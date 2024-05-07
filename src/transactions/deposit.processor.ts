import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { DepositDto } from './dto/deposit.dto';
import {
  IntegrationTypeEnum,
  TransactionStatusEnum,
  User,
} from '@prisma/client';
import { parse } from 'path';
import { TransactionsService, TransactionsType } from './transactions.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Processor('deposit')
export class DepositProcessor {
  constructor(private readonly transactionService: TransactionsService) {}

  @Process()
  async processDeposit(job) {
    let payload = job.data;

    const detailUser: User = await this.transactionService.findUserById({
      id: payload.userId,
    });
    console.log('detailUser:', detailUser);
    payload = { ...payload, current_balance: detailUser.balances };
    const transaction = await this.transactionService.createTransaction(
      payload,
      true,
    );
    console.log('transaction:', transaction);
    try {
      await this.performDeposit(payload);

      // Jika proses deposit berhasil, ubah status transaksi menjadi COMPLETED
      await this.transactionService.updateTransaction(transaction.id, {
        status: TransactionStatusEnum.COMPLETED,
      });

      return { success: true }; // Kirim respons sukses
    } catch (error) {
      await this.transactionService.updateTransaction(transaction.id, {
        status: TransactionStatusEnum.FAILED,
      });

      throw new HttpException(
        'Failed to deposit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async performDeposit(payload: TransactionsType) {
    //update balance
    try {
      const newBalance = payload.current_balance + payload.amount;
      await this.transactionService.updateBalance(payload.userId, newBalance);
    } catch (error) {
      throw new HttpException(
        'Failed to update balance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @OnQueueFailed()
  onError(job, err: Error) {
    console.error('Queue error:', err);
    return err;
  }

  @OnQueueError()
  onQError(err) {
    console.log(err);
    return err;
  }
}
