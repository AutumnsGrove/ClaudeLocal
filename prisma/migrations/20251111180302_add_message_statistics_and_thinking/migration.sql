-- AlterTable
ALTER TABLE "Message" ADD COLUMN "tokensPerSecond" REAL;
ALTER TABLE "Message" ADD COLUMN "totalTokens" INTEGER;
ALTER TABLE "Message" ADD COLUMN "inputTokens" INTEGER;
ALTER TABLE "Message" ADD COLUMN "outputTokens" INTEGER;
ALTER TABLE "Message" ADD COLUMN "cachedTokens" INTEGER;
ALTER TABLE "Message" ADD COLUMN "timeToFirstToken" REAL;
ALTER TABLE "Message" ADD COLUMN "stopReason" TEXT;
ALTER TABLE "Message" ADD COLUMN "modelConfig" TEXT;
ALTER TABLE "Message" ADD COLUMN "cost" REAL;
ALTER TABLE "Message" ADD COLUMN "thinkingContent" TEXT;
