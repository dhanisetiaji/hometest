/*
  Warnings:

  - The values [TRANSFER] on the enum `IntegrationTypeEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `currency` on the `Balance` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `fromId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `toId` on the `Transaction` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionStatusEnum" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterEnum
BEGIN;
CREATE TYPE "IntegrationTypeEnum_new" AS ENUM ('DEPOSIT', 'WITHDRAW');
ALTER TABLE "Transaction" ALTER COLUMN "type" TYPE "IntegrationTypeEnum_new" USING ("type"::text::"IntegrationTypeEnum_new");
ALTER TYPE "IntegrationTypeEnum" RENAME TO "IntegrationTypeEnum_old";
ALTER TYPE "IntegrationTypeEnum_new" RENAME TO "IntegrationTypeEnum";
DROP TYPE "IntegrationTypeEnum_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fromId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_toId_fkey";

-- AlterTable
ALTER TABLE "Balance" DROP COLUMN "currency";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "currency",
DROP COLUMN "fromId",
DROP COLUMN "toId",
ADD COLUMN     "status" "TransactionStatusEnum" NOT NULL DEFAULT 'PENDING';
