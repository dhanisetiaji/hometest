import { IsNotEmpty, IsString, isNumber } from 'class-validator';

export class DepositDto {
  @IsNotEmpty()
  order_id: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  timestamp: string;
}
