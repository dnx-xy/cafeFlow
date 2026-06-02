import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/menu-updates',
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  },
})
export class MenuGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const businessId = client.handshake.query.businessId as string;
    if (businessId) {
      client.join(`business:${businessId}`);
    }
  }

  handleDisconnect(client: Socket) {
    const businessId = client.handshake.query.businessId as string;
    if (businessId) {
      client.leave(`business:${businessId}`);
    }
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, businessId: string) {
    client.join(`business:${businessId}`);
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, businessId: string) {
    client.leave(`business:${businessId}`);
  }

  emitMenuItemUpdated(businessId: string, data: { itemId: string; soldOut: boolean; available: boolean; updatedAt: string }) {
    this.server.to(`business:${businessId}`).emit('menuItem:updated', data);
  }
}
