import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PublicService } from './public.service';
import { Public } from '../auth/decorators/auth.decorators';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('tables/:tableId/menu')
  @Public()
  async getMenuByTable(@Param('tableId') tableId: string) {
    return await this.publicService.getMenuByTable(tableId);
  }

  @Post('orders')
  @Public()
  async createOrder(@Body() body: {
    tableId: string;
    items: { menuItemId: string; quantity: number; notes?: string }[];
    notes?: string;
    orderType?: string;
    customerName?: string;
    customerWhatsapp?: string;
  }) {
    return await this.publicService.createOrder(body);
  }

  @Post('feedback')
  @Public()
  async submitFeedback(@Body() body: {
    customerName?: string;
    customerWhatsapp?: string;
    rating: number;
    comment?: string;
    orderId?: string;
    tenantId: string;
    businessId?: string;
  }) {
    return await this.publicService.submitFeedback(body);
  }

  @Post('loyalty/join')
  @Public()
  async joinLoyalty(@Body() body: {
    name: string;
    whatsappNumber: string;
    tenantId: string;
    businessId?: string;
  }) {
    return await this.publicService.joinLoyalty(body);
  }
}
