-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('MEMBER', 'ADMIN');

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "role" "ChatRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participants_chat_id_user_id_key" ON "participants"("chat_id", "user_id");

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
