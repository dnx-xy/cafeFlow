import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from '../entities/table.entity';
import { Outlet } from '../entities/outlet.entity';
import { QrCode } from '../entities/qr-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Table, Outlet, QrCode])],
  controllers: [TablesController],
  providers: [TablesService],
  exports: [TablesService],
})
export class TablesModule {}