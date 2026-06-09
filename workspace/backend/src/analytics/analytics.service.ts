import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Customer } from '../entities/customer.entity';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async getAnalytics(tenantId: string, period: 'week' | 'month' | 'year' = 'week') {
    const now = new Date();
    let startDate: Date;
    let dateFormat: string;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFormat = 'Dy';
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFormat = 'Mon DD';
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        dateFormat = 'Mon';
        break;
    }

    const orders = await this.ordersRepository.find({
      where: { tenantId, createdAt: Between(startDate, now) },
    });

    const customers = await this.customersRepository.find({
      where: { tenantId, createdAt: Between(startDate, now) },
    });

    const ids = orders.map(o => o.id);
    const orderItems = ids.length > 0 ? await this.orderItemsRepository.find({
      where: { order: { id: In(ids) } } as any,
      relations: { menuItem: true },
    }) : [];

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const revenueByDate: Record<string, number> = {};
    const ordersByDate: Record<string, number> = {};
    for (const order of orders) {
      const key = order.createdAt.toISOString().split('T')[0];
      revenueByDate[key] = (revenueByDate[key] || 0) + Number(order.totalAmount || 0);
      ordersByDate[key] = (ordersByDate[key] || 0) + 1;
    }

    const revenueChart = Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue,
      orders: ordersByDate[date] || 0,
      customers: customers.filter(c => c.createdAt.toISOString().split('T')[0] === date).length,
    }));

    const itemSales: Record<string, { name: string; sales: number; revenue: number }> = {};
    for (const item of orderItems) {
      const name = item.menuItem?.name || 'Unknown Item';
      if (!itemSales[name]) itemSales[name] = { name, sales: 0, revenue: 0 };
      itemSales[name].sales += item.quantity || 1;
      itemSales[name].revenue += Number(item.totalPrice || 0);
    }

    const topItems = Object.values(itemSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map((item, i) => ({
        name: item.name,
        sales: item.sales,
        revenue: item.revenue,
        trend: (i < 2 ? 'up' : 'down') as 'up' | 'down',
      }));

    const hours: Record<string, number> = {};
    for (const order of orders) {
      const hour = `${order.createdAt.getHours().toString().padStart(2, '0')}:00`;
      hours[hour] = (hours[hour] || 0) + 1;
    }
    const peakHours = Object.entries(hours)
      .map(([hour, count]) => ({ hour, orders: count }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    const returningCustomers = customers.filter(c => {
      const customerOrders = orders.filter(o => o.customerId === c.id);
      return customerOrders.length > 1;
    }).length;

    const customerRetention = {
      newCustomers: totalCustomers - returningCustomers,
      returningCustomers,
      rate: totalCustomers > 0 ? Math.round((returningCustomers / totalCustomers) * 100) : 0,
    };

    return {
      revenue: { total: totalRevenue, change: 0 },
      orders: { total: totalOrders, change: 0 },
      customers: { total: totalCustomers, change: 0 },
      avgOrderValue: { value: avgOrderValue, change: 0 },
      conversionRate: { value: 0, change: 0 },
      revenueChart: revenueChart.sort((a, b) => a.date.localeCompare(b.date)),
      topItems,
      peakHours,
      customerRetention,
    };
  }

  async getKpiSummary(tenantId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const orders = await this.ordersRepository.find({
      where: { tenantId, createdAt: Between(startOfMonth, now) },
    });
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const openOrders = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
    const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;

    return {
      revenue: totalRevenue,
      orders: totalOrders,
      openOrders,
      completedOrders,
    };
  }
}