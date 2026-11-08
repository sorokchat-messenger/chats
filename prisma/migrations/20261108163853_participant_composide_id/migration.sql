/*
  Warnings:

  - The primary key for the `participants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `participants` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "participants_chat_id_user_id_key";

-- AlterTable
ALTER TABLE "participants" DROP CONSTRAINT "participants_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "participants_pkey" PRIMARY KEY ("user_id", "chat_id");
