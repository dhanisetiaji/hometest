import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { DepositDto } from './dto/deposit.dto';
import { ApiAuthGuard } from 'src/auth/auth.guard';

@UseGuards(ApiAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  async deposit(@Req() req, @Body() payload: DepositDto) {
    const userId = req.user.id;
    const checkOrderId = await this.transactionsService.checkTransaction(
      payload.order_id,
    );
    if (checkOrderId) {
      throw new NotFoundException('Order ID already exists');
    }
    if (payload.amount < 0 || !payload.timestamp) {
      throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST);
    }
    try {
      const result = await this.transactionsService.deposit(payload, userId);
      return {
        status: 1,
        order_id: result.data.order_id,
        amount: result.data.amount,
      };
    } catch (error) {
      return error;
    }
  }

  @Post('withdraw')
  async withdraw(@Req() req, @Body() payload: DepositDto) {
    const userId = req.user.id;
    const checkOrderId = await this.transactionsService.checkTransaction(
      payload.order_id,
    );
    if (checkOrderId) {
      throw new NotFoundException('Order ID already exists');
    }
    if (payload.amount < 0 || !payload.timestamp) {
      throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST);
    }
    try {
      const result = await this.transactionsService.withdraw(payload, userId);
      return {
        status: 1,
        order_id: result.data.order_id,
        amount: result.data.amount,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/')
  async getTransactions(@Req() req) {
    const userId = req.user.id;
    const transactions = await this.transactionsService.getTransactions(userId);
    return transactions;
  }

  @Get('balance')
  async getBalance(@Req() req) {
    const userId = req.user.id;
    const balance = await this.transactionsService.findUserById({
      id: userId,
    });
    return {
      balance: balance.balances,
    };
  }
}
