import { Injectable } from '@nestjs/common';
import { DepositDto } from './dto/deposit.dto';
import { TransactionsJobProducer } from './transactions-job.producer';
import { DatabaseService } from 'src/database/database.service';
import {
  IntegrationTypeEnum,
  Prisma,
  TransactionStatusEnum,
  User,
} from '@prisma/client';

export interface TransactionsType {
  order_id: string;
  amount: number;
  timestamp: string;
  current_balance?: number;
  userId: string;
}

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsJob: TransactionsJobProducer,
    private readonly prisma: DatabaseService,
  ) {}

  async deposit(payload: DepositDto, userId: string) {
    const newPayload = {
      ...payload,
      userId,
    };
    return await this.transactionsJob.deposit(newPayload);
  }

  async findUserById(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.findUnique({ where });
  }

  async withdraw(payload: DepositDto, userId: string) {
    const newPayload = {
      ...payload,
      userId,
    };
    return await this.transactionsJob.withdraw(newPayload);
  }

  async createTransaction(payload: TransactionsType, isDeposit = true) {
    try {
      const transaction = await this.prisma.transaction.create({
        data: {
          order_id: payload.order_id, // Fungsi untuk menghasilkan order_id unik
          amount: payload.amount,
          current_balance: payload.current_balance || 0,
          status: TransactionStatusEnum.PENDING,
          type: isDeposit
            ? IntegrationTypeEnum.DEPOSIT
            : IntegrationTypeEnum.WITHDRAW,
          createdAt: new Date(payload.timestamp),
          user_id: payload.userId,
        },
      });
      return transaction;
    } catch (error) {
      console.log('error:', error);
      throw new Error('Failed to create transaction');
    }
  }

  async checkTransaction(orderId: string) {
    return this.prisma.transaction.findFirst({
      where: { order_id: orderId },
    });
  }

  async updateTransaction(transactionId: string, data: any) {
    return this.prisma.transaction.update({
      where: { id: transactionId },
      data,
    });
  }

  async updateBalance(userId: string, newBalance: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        balances: newBalance,
      },
    });
  }

  async getTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: { user_id: userId },
    });
  }
}
