import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppMessagesService } from './whatsapp-messages.service';
import { WhatsAppMessage } from '../entities/whatsapp-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WhatsAppMessage])],
  controllers: [WhatsAppController],
  providers: [WhatsAppMessagesService],
  exports: [WhatsAppMessagesService],
})
export class WhatsAppModule {}
