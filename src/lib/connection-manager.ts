import { JSONRPCClient } from 'json-rpc-2.0';

export interface ConnectionManagerOptions {
    maxRetries: number;
    retryDelay: number;
    backoff: 'fixed' | 'exponential';
}

export enum ConnectionStatus {
    /**
     * Waiting a delay before transitioning to the `Connecting` state.
     * 
     * - The socket is not created in this state.
     * - The socket is disposed in this state if there was one.
     * - In this state the retry delay happens.
     * - The previous state can be any one.
     * - The next state if didn't give up is `Connecting`.
     * - The next state if max retries was reached is `Disconnected`.
     */
    NotConnected = 'NOT_CONNECTED',
    /**
     * Waiting for the WebSocket to be ready.
     * 
     * - The socket is created in this state.
     * - This state waits for the `open` event of the socket to trigger.
     * - This previous state can be `NotConnected`.
     * - The next state incase of success is `Identifying`.
     * - The next state incase of failure is `NotConnected`.
     */
    Connecting = 'CONNECTING',
    /**
     * Identifying the version of the server.
     * 
     * - The socket is active in this state and RPC works,
     * but doesn't allow the general use yet.
     * - The previous state is `Connecting`.
     * - The next state incase of failure is `NotConnected`.
     * - The next state incase of rejection (incompatible versions) is `Disconnected`.
     * - The next state incase of success is `Connected`.
     */
    Identifying = 'IDENTIFYING',
    /**
     * Connection established and RPC works.
     * 
     * - The socket is active in this state and RPC works,
     * general use is allowed.
     * - Once this state is activated, the retry counter is reset.
     * - The previous state is `Identifying`.
     * - The next state incase of disruption is `NotConnected`.
     * - The next state incase of rejection (server closed or by user request) is `Disconnected`.
     */
    Connected = 'CONNECTED',
    /**
     * Awaiting for the user to request reconnection.
     * 
     * - The socket is disposed in this state if there was one.
     * - The previous state can be any one.
     * - The next state on user request is `NotConnected`.
     * - This state is used when the user stops the connection manually,
     * or if the connection gave up due to some reason.
     */
    Disconnected = 'DISCONNECTED',
}

class Utilities {
    /**
     * @param delay - in milliseconds.
     */
    static async sleep(delay: number, abortSignal?: AbortSignal): Promise<void> {
        return new Promise((resolve, reject) => {
            const abortAborter = new AbortController();

            const id = setTimeout(() => {
                abortAborter.abort();
                resolve();
            }, delay);

            abortSignal?.addEventListener('abort', () => {
                clearTimeout(id);
                reject('aborted');
            }, { signal: abortAborter.signal });
        });
    }

    /**
     * Waits for a WebSocket until it reaches the ready state.
     * 
     * Closes the WebSocket if aborted while waiting.
     */
    static async waitUntilReady(socket: WebSocket): Promise<void> {
        return new Promise((resolve, reject) => {
            const listeners = new AbortController();
            const signal = listeners.signal;

            socket.addEventListener('open', () => {
                listeners.abort('socket got ready');
                resolve();
            }, { once: true, signal });

            socket.addEventListener('close', (ev) => {
                listeners.abort('socket was closed');
                reject(new Error(ev.reason || 'unknown failure'));
            }, { once: true, signal });
        });
    }
}

class IdentificationRPC {
    private socket?: WebSocket;

    private readonly client = new JSONRPCClient((request) => {
        if (!this.socket) return Promise.reject('The RPC server & client was detached');

        try {
            this.socket.send(JSON.stringify(request));
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    });

    private readonly messageListener = (event: MessageEvent) => {
        this.client.receive(JSON.parse(event.data));
    };

    constructor(socket: WebSocket) {
        this.socket = socket;
        this.socket.addEventListener('message', this.messageListener);
    }

    async identify(): Promise<unknown> {
        return this.client.request('identify', []); // TODO: Send the version of the IDE.
    }

    /**
     * Detach the RPC client & server from the socket without closing it.
     */
    detach() {
        if (!this.socket) throw new Error('Already detached!');
        
        this.socket?.removeEventListener('message', this.messageListener);
        delete this.socket;

        this.client.rejectAllPendingRequests(`Connection closed.`);
    }
}

export class ConnectionManager {
    private readonly eventsTarget = new EventTarget();
    public readonly options: Readonly<ConnectionManagerOptions>;

    /**
     * Aborts any ongoing/active connection.
     */
    private abort = () => {};

    private _socket?: WebSocket;
    get socket() { return this.status === ConnectionStatus.Connected ? this._socket : undefined; }

    /**
     * **⚠️ DON'T access directly, use the setter and getter⚠️**
     * 
     * _even if it was for internal use_.
     */
    private _status = ConnectionStatus.Disconnected;
    get status() { return this._status; }
    private set status(value) {
        this._status = value;
        this.eventsTarget.dispatchEvent(new Event('status_update'))
    }

    private _retryCount = 0;
    get retryCount() { return this._retryCount; }

    get nextRetryDelay(): number {
        const { backoff, retryDelay } = this.options;
        if (backoff === 'exponential') return retryDelay * (1 << this._retryCount);
        else if (backoff === 'fixed') return retryDelay;
        else throw Error(`Unimplemented backoff method '${backoff}'`);
    }

    constructor(options?: Partial<ConnectionManagerOptions>) {
        const {
            maxRetries = 4,
            retryDelay = 500,
            backoff = 'exponential',
        } = options ?? {};

        this.options = { maxRetries, retryDelay, backoff };
        this.reconnect();
    }

    addEventListener(type: 'status_update', callback: (manager: ConnectionManager) => void) {
        this.eventsTarget.addEventListener(type, () => callback(this));
    }

    removeEventListener(type: 'status_update', callback: (manager: ConnectionManager) => void) {
        this.eventsTarget.removeEventListener(type, () => callback(this));
    }

    reconnect() {
        if (this.status !== ConnectionStatus.Disconnected) return;

        const abortController = new AbortController();
        this.abort = abortController.abort.bind(abortController);
        const abortSignal = abortController.signal;

        this.start(abortSignal).catch(console.error); // FIXME: This is a critical error, display something to the user about it.
    }

    disconnect() {
        if (this._status === ConnectionStatus.Disconnected) return;
        this.abort();
    }

    /**
     * Starts the procedure of establishing a connection.
     */
    private async start(abortSignal?: AbortSignal) {
        this._retryCount = 0;

        while (this._retryCount < this.options.maxRetries && !abortSignal?.aborted) {
            try {
                await this.attemptConnection(abortSignal);
                return;
            } catch (error) {
                console.error('Error while attempting to connect:', error);
                this._retryCount++;
            }
        }

        this.status = ConnectionStatus.Disconnected;
        if (abortSignal?.aborted) return;

        // FIXME: This is a critical error, display something to the user about it.
    }

    private async attemptConnection(abortSignal?: AbortSignal) {
        //#region Stage: Not Connected
        this.status = ConnectionStatus.NotConnected;
        await Utilities.sleep(this.nextRetryDelay, abortSignal);
        //#endregion

        //#region Stage: Connecting
        this.status = ConnectionStatus.Connecting;

        const socket = new WebSocket('ws://localhost:50000'); // TODO: Allow configuring the port.
        abortSignal?.addEventListener('abort', () => {
            socket.close(1000, 'aborted');

            if (this._socket !== socket) return;
            delete this._socket;

            this.status = ConnectionStatus.Disconnected;
        });

        await Utilities.waitUntilReady(socket);
        //#endregion

        //#region Stage: Identifying
        this.status = ConnectionStatus.Identifying;
        
        const identificationRPC = new IdentificationRPC(socket);
        // await identificationRPC.identify();
        identificationRPC.detach();
        //#endregion

        //#region Stage: Connected
        socket.addEventListener('close', () => {
            if (this._socket !== socket) return;
            delete this._socket;

            this.status = ConnectionStatus.Disconnected;
            this.reconnect();
        }, { once: true });

        this._socket = socket;
        // The status has to be updated after setting the socket because an event will be triggered.
        this.status = ConnectionStatus.Connected;
        //#endregion

        // TODO: Add timeout.
        // TODO: Add heartbeat.
    }
}