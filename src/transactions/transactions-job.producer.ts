import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { DepositDto } from './dto/deposit.dto';

interface payload {
  order_id: string;
  amount: number;
  timestamp: string;
  userId: string;
}

@Injectable()
export class TransactionsJobProducer {
  constructor(
    @InjectQueue('deposit') private readonly depositQueue: Queue,
    @InjectQueue('withdraw') private readonly withdrawQueue: Queue,
  ) {}

  async deposit(payload: payload) {
    try {
      return await this.depositQueue.add(payload);
    } catch (error) {
      return error;
    }
  }

  async withdraw(payload: payload) {
    try {
      return await this.withdrawQueue.add(payload);
    } catch (error) {
      return error;
    }
  }
}
