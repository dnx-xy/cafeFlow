import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class MenuGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSubscribe(client: Socket, businessId: string): void;
    handleUnsubscribe(client: Socket, businessId: string): void;
    emitMenuItemUpdated(businessId: string, data: {
        itemId: string;
        soldOut: boolean;
        available: boolean;
        updatedAt: string;
    }): void;
}
