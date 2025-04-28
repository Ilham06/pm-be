-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "representative" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "client_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventDocument" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "file_type" TEXT,
    "file_size" TEXT,
    "file_name" TEXT,
    "document_type" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventActivity" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "budget" DECIMAL(65,2) NOT NULL,
    "plan_start_date" TIMESTAMP(3) NOT NULL,
    "plan_end_date" TIMESTAMP(3) NOT NULL,
    "actual_start_date" TIMESTAMP(3) NOT NULL,
    "actual_end_date" TIMESTAMP(3) NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "bank_number" BIGINT NOT NULL,
    "bank_account" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventFinance" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "event_activity_id" TEXT,
    "is_activity" BOOLEAN NOT NULL,
    "transaction_code" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(65,2) NOT NULL,
    "destination_bank_id" TEXT NOT NULL,
    "sender_bank_id" TEXT,
    "payment_due_date" TIMESTAMP(3) NOT NULL,
    "transaction_date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventFinance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventFinanceDocument" (
    "id" TEXT NOT NULL,
    "event_finance_id" TEXT NOT NULL,
    "file_type" TEXT,
    "file_size" TEXT,
    "file_name" TEXT,
    "document_type" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventFinanceDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventDailyReport" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "event_activity_id" TEXT,
    "is_activity" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "activity_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "EventDailyReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_name_key" ON "Client"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Event_code_key" ON "Event"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Event_name_key" ON "Event"("name");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDocument" ADD CONSTRAINT "EventDocument_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDocument" ADD CONSTRAINT "EventDocument_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventActivity" ADD CONSTRAINT "EventActivity_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventActivity" ADD CONSTRAINT "EventActivity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFinance" ADD CONSTRAINT "EventFinance_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFinance" ADD CONSTRAINT "EventFinance_event_activity_id_fkey" FOREIGN KEY ("event_activity_id") REFERENCES "EventActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFinance" ADD CONSTRAINT "EventFinance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFinance" ADD CONSTRAINT "EventFinance_action_by_fkey" FOREIGN KEY ("action_by") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFinance" ADD CONSTRAINT "EventFinance_sender_bank_id_fkey" FOREIGN KEY ("sender_bank_id") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFinance" ADD CONSTRAINT "EventFinance_destination_bank_id_fkey" FOREIGN KEY ("destination_bank_id") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFinanceDocument" ADD CONSTRAINT "EventFinanceDocument_event_finance_id_fkey" FOREIGN KEY ("event_finance_id") REFERENCES "EventFinance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDailyReport" ADD CONSTRAINT "EventDailyReport_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDailyReport" ADD CONSTRAINT "EventDailyReport_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDailyReport" ADD CONSTRAINT "EventDailyReport_event_activity_id_fkey" FOREIGN KEY ("event_activity_id") REFERENCES "EventActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
