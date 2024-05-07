import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { BullModule } from '@nestjs/bull';
import { TransactionsJobProducer } from './transactions-job.producer';
import { DepositProcessor } from './deposit.processor';
import { DatabaseService } from 'src/database/database.service';
import { WithdrawProcessor } from './withdraw.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'deposit',
    }),
    BullModule.registerQueue({
      name: 'withdraw',
    }),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionsJobProducer,
    DepositProcessor,
    DatabaseService,
    WithdrawProcessor,
  ],
})
export class TransactionsModule {}
