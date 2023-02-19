import { JSONRPCClient } from 'json-rpc-2.0';

export class RemoteAgent {
    //#region WebSocket & RPC Client

    private _socket?: WebSocket;
    get socket() {
        if (this._socket && this._socket.readyState !== this._socket.OPEN)
            this.socket = undefined;

        return this._socket;
    }
    set socket(value) {
        if (value !== this._socket)
            this.client.rejectAllPendingRequests('Connection status changed');

        this._socket?.removeEventListener('message', this.messageListener);
        this._socket = value;
        this._socket?.addEventListener('message', this.messageListener);
    }

    private readonly messageListener = (event: MessageEvent) => {
        this.client.receive(JSON.parse(event.data));
    };

    private readonly client = new JSONRPCClient((request) => {
        const socket = this.socket;
        if (!socket) return Promise.reject('The socket is not connected!');

        try {
            socket.send(JSON.stringify(request));
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    });

    //#endregion

    //#region Client Methods

    async echo(text: string): Promise<string> {
        return await this.client.request('echo', [text]);
    }

    async log(message: string): Promise<void> {
        await this.client.request('log', [message]);
    }

    async run(script: string): Promise<void> {
        await this.client.request('run', [script]);
    }

    //#endregion
}

