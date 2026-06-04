import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly gatewayUrl: string;

  constructor() {
    this.gatewayUrl = process.env.WHATSAPP_GATEWAY_URL || 'http://localhost:3002';
  }

  private formatNumber(phone: string): string {
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) return `62${cleaned.slice(1)}@c.us`;
    if (cleaned.startsWith('62')) return `${cleaned}@c.us`;
    return `62${cleaned}@c.us`;
  }

  async sendMessage(to: string, message: string, session?: string): Promise<boolean> {
    try {
      const payload: any = {
        session: session || process.env.WHATSAPP_DEFAULT_SESSION || 'default',
        to: this.formatNumber(to),
        text: message,
      };

      await axios.post(`${this.gatewayUrl}/sendText`, payload, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
      });

      this.logger.log(`WhatsApp sent to ${to} via session ${payload.session}`);
      return true;
    } catch (error) {
      this.logger.error(`WhatsApp send failed to ${to}: ${error.message}`);
      return false;
    }
  }

  async sendOrderNotification(
    to: string,
    orderId: string,
    tableNumber: string | undefined,
    items: { name: string; qty: number; price: number }[],
    total: number,
    session?: string,
  ): Promise<boolean> {
    const lines = items.slice(0, 10).map(i => `• ${i.qty}x ${i.name} - ${formatCurrency(i.price * i.qty)}`);
    if (items.length > 10) lines.push(`...dan ${items.length - 10} item lainnya`);
    const tableInfo = tableNumber ? `\nMeja: ${tableNumber}` : '';
    const message = [
      `*Pesanan Baru!* 🛎️`,
      `No. Pesanan: ${orderId}${tableInfo}`,
      ``,
      lines.join('\n'),
      ``,
      `*Total: ${formatCurrency(total)}*`,
    ].join('\n');

    return this.sendMessage(to, message, session);
  }

  async sendPaymentNotification(
    to: string,
    orderId: string,
    amount: number,
    status: string,
    session?: string,
  ): Promise<boolean> {
    const statusText = status === 'PAID' ? 'LUNAS ✅' : status === 'FAILED' ? 'GAGAL ❌' : status;
    const message = [
      `*Pembayaran ${statusText}*`,
      `No. Pesanan: ${orderId}`,
      `Jumlah: ${formatCurrency(amount)}`,
    ].join('\n');

    return this.sendMessage(to, message, session);
  }
}

function formatCurrency(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}
