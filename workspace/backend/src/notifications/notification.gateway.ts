import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://192.168.101.2:3000'],
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

  emitNewOrder(businessId: string, data: {
    id: string;
    orderId: string;
    tableNumber?: string;
    customer?: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }) {
    this.server.to(`business:${businessId}`).emit('order:new', data);
  }

  emitOrderStatusUpdate(businessId: string, data: {
    id: string;
    orderId: string;
    tableNumber?: string;
    customer?: string;
    totalAmount: number;
    oldStatus: string;
    newStatus: string;
    updatedAt: string;
  }) {
    this.server.to(`business:${businessId}`).emit('order:status', data);
  }

  emitPaymentUpdate(businessId: string, data: {
    orderId: string;
    paymentStatus: string;
    totalAmount: number;
    updatedAt: string;
  }) {
    this.server.to(`business:${businessId}`).emit('payment:update', data);
  }

  emitNotification(businessId: string, data: {
    id: string;
    type: 'order' | 'payment' | 'system';
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: string;
  }) {
    this.server.to(`business:${businessId}`).emit('notification', data);
  }
}
