import { ConnectionManager } from './lib/connection-manager';
import { RemoteAgent } from './lib/remote-agent';

export const connectionManager = new ConnectionManager();
export const remoteAgent = new RemoteAgent();

connectionManager.addEventListener('status_update', () => {
    remoteAgent.socket = connectionManager.socket;
});