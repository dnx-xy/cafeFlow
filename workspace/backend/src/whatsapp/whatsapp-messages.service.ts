import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhatsAppMessage, WhatsAppDirection } from '../entities/whatsapp-message.entity';

@Injectable()
export class WhatsAppMessagesService {
  constructor(
    @InjectRepository(WhatsAppMessage)
    private repo: Repository<WhatsAppMessage>,
  ) {}

  async findByBusiness(businessId: string): Promise<WhatsAppMessage[]> {
    return this.repo.find({
      where: { businessId },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findConversations(businessId: string): Promise<any[]> {
    const messages = await this.repo.find({
      where: { businessId },
      order: { createdAt: 'DESC' },
    });

    const grouped = new Map<string, { customer: string; phone: string; lastMessage: string; lastDate: Date; unread: number; messages: WhatsAppMessage[] }>();

    for (const msg of messages) {
      const key = msg.fromNumber;
      if (!grouped.has(key)) {
        grouped.set(key, {
          customer: msg.customerName || msg.fromNumber,
          phone: msg.fromNumber,
          lastMessage: msg.body,
          lastDate: msg.createdAt,
          unread: msg.direction === WhatsAppDirection.INCOMING && !msg.read ? 1 : 0,
          messages: [],
        });
      }
      const conv = grouped.get(key)!;
      conv.messages.push(msg);
      if (msg.createdAt > conv.lastDate) {
        conv.lastMessage = msg.body;
        conv.lastDate = msg.createdAt;
      }
      if (msg.direction === WhatsAppDirection.INCOMING && !msg.read) {
        conv.unread += 1;
      }
    }

    return Array.from(grouped.values()).sort((a, b) => b.lastDate.getTime() - a.lastDate.getTime());
  }

  async create(data: Partial<WhatsAppMessage>): Promise<WhatsAppMessage> {
    const msg = this.repo.create(data);
    return this.repo.save(msg);
  }

  async markRead(id: string): Promise<void> {
    await this.repo.update(id, { read: true });
  }

  async markAllRead(businessId: string, fromNumber: string): Promise<void> {
    await this.repo.update(
      { businessId, fromNumber, direction: WhatsAppDirection.INCOMING, read: false },
      { read: true },
    );
  }
}
