import { JSONRPCClient } from 'json-rpc-2.0';

export class Remote {
    private readonly socket: WebSocket;
    private readonly rpcClient: JSONRPCClient;

    constructor(
        public readonly url = 'ws://localhost:50000',
    ) {
        this.socket = new WebSocket(url);
        this.rpcClient = Remote.createRPCClient(this.socket);

        this.registerSocketListeners();
    }

    async echo(text: string): Promise<string> {
        return await this.rpcClient.request('echo', [ text ]);
    }

    async log(message: string): Promise<void> {
        await this.rpcClient.request('log', [ message ]);
    }

    async run(script: string): Promise<void> {
        await this.rpcClient.request('run', [ script ]);
    }

    private registerSocketListeners(): void {
        this.socket.addEventListener('open', () => {
            console.info('Connection is open!');
            this.log('Hello from the IDE!').catch(console.error);
        });
        
        this.socket.addEventListener('message', (event) => {
            this.rpcClient.receive(JSON.parse(event.data));
        });
        
        this.socket.addEventListener('close', (event) => {
            this.rpcClient.rejectAllPendingRequests(`Connection is closed (${event}).`);
        });
    }

    private static createRPCClient(socket: WebSocket): JSONRPCClient {
        return new JSONRPCClient((request) => {
            try {
                socket.send(JSON.stringify(request));
                return Promise.resolve(request);
            } catch (err) {
                return Promise.reject(err);
            }
        });
    }
}

