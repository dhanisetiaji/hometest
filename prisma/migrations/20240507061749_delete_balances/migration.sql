/*
  Warnings:

  - You are about to drop the `Balance` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `balances` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "balances" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Balance";
