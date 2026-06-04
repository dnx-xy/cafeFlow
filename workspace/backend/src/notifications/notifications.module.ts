import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { WhatsAppService } from './whatsapp.service';

@Module({
  providers: [NotificationGateway, WhatsAppService],
  exports: [NotificationGateway, WhatsAppService],
})
export class NotificationsModule {}
