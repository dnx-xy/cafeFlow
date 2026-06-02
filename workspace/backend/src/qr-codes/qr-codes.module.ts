import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrCodesController } from './qr-codes.controller';
import { QrCodesService } from './qr-codes.service';
import { QrCode } from '../entities/qr-code.entity';
import { Table } from '../entities/table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([QrCode, Table]),
  ],
  controllers: [QrCodesController],
  providers: [QrCodesService],
  exports: [QrCodesService],
})
export class QrCodesModule {}