import {
  Controller, Get, Post, Body, Param, Query,
  UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { AuthenticatedUser, Roles, Public } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';
import { WhatsAppMessagesService } from './whatsapp-messages.service';
import { WhatsAppDirection } from '../entities/whatsapp-message.entity';
import axios from 'axios';

@Controller('whatsapp')
export class WhatsAppController {
  private readonly gatewayUrl: string;

  constructor(private readonly service: WhatsAppMessagesService) {
    this.gatewayUrl = process.env.WHATSAPP_GATEWAY_URL || 'http://localhost:3002';
  }

  @Get('session/qr')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async getSessionQr(@AuthenticatedUser() user: any) {
    const sessionId = `business-${user.businessId}`;
    try {
      const res = await axios.get(`${this.gatewayUrl}/sessions/${sessionId}/qr`, { timeout: 8000 });
      return { sessionId, ...res.data };
    } catch {
      return { sessionId, status: 'gateway_unreachable', gatewayUrl: this.gatewayUrl };
    }
  }

  @Get('session/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async getSessionStatus(@AuthenticatedUser() user: any) {
    const sessionId = `business-${user.businessId}`;
    try {
      const res = await axios.get(`${this.gatewayUrl}/sessions/${sessionId}/qr`, { timeout: 5000 });
      return { sessionId, status: res.data.status, user: res.data.user };
    } catch {
      return { sessionId, status: 'gateway_unreachable' };
    }
  }

  @Get('conversations')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async getConversations(@AuthenticatedUser() user: any) {
    return this.service.findConversations(user.businessId);
  }

  @Get('messages')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async getMessages(
    @Query('from') from: string,
    @AuthenticatedUser() user: any,
  ) {
    const all = await this.service.findByBusiness(user.businessId);
    const filtered = from ? all.filter(m => m.fromNumber === from) : all;
    return filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  @Post('reply')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async reply(
    @Body() body: { to: string; text: string; session?: string },
    @AuthenticatedUser() user: any,
  ) {
    const session = body.session || `business-${user.businessId}`;

    await axios.post(`${this.gatewayUrl}/sendText`, {
      session,
      to: body.to,
      text: body.text,
    }).catch(e => { throw e; });

    const msg = await this.service.create({
      businessId: user.businessId,
      tenantId: user.tenantId,
      sessionId: session,
      fromNumber: body.to,
      toNumber: body.to,
      body: body.text,
      direction: WhatsAppDirection.OUTGOING,
      status: 'sent',
    });

    return msg;
  }

  @Post('webhook')
  @Public()
  async webhook(@Body() body: any) {
    const { session, from, body: text, id: waMessageId, name, businessId } = body;
    console.log(`[WA Webhook] session=${session} from=${from} text="${text?.slice(0, 50)}" biz=${businessId}`);
    const bid = businessId || (session?.startsWith('business-') ? session.replace('business-', '') : null);
    if (!bid) {
      console.log(`[WA Webhook] Rejected: no businessId (session=${session})`);
      return { ok: false, reason: 'no businessId' };
    }

    const msg = await this.service.create({
      businessId: bid,
      tenantId: bid,
      sessionId: session,
      fromNumber: from,
      body: text,
      direction: WhatsAppDirection.INCOMING,
      status: 'received',
      waMessageId,
      customerName: name,
    });

    return { ok: true, id: msg.id };
  }

  @Post(':id/read')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async markRead(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.markRead(id);
    return { ok: true };
  }

  @Post('mark-read')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async markAllRead(
    @Body() body: { from: string },
    @AuthenticatedUser() user: any,
  ) {
    await this.service.markAllRead(user.businessId, body.from);
    return { ok: true };
  }
}
