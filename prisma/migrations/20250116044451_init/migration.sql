-- CreateTable
CREATE TABLE "stores" (
    "shop" TEXT NOT NULL,
    "shopDomain" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "shopId" TEXT,
    "shopName" TEXT,
    "email" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("shop")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "shop" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countdownWidget" (
    "content" TEXT NOT NULL,
    "shop" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "datePickerWidget" (
    "content" TEXT NOT NULL,
    "shop" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "dayDelivery" (
    "content" TEXT NOT NULL,
    "shop" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "stores_shopDomain_key" ON "stores"("shopDomain");

-- CreateIndex
CREATE INDEX "stores_shop_idx" ON "stores"("shop");

-- CreateIndex
CREATE INDEX "session_id_idx" ON "session"("id");

-- CreateIndex
CREATE INDEX "session_shop_idx" ON "session"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "countdownWidget_shop_key" ON "countdownWidget"("shop");

-- CreateIndex
CREATE INDEX "countdownWidget_shop_idx" ON "countdownWidget"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "datePickerWidget_shop_key" ON "datePickerWidget"("shop");

-- CreateIndex
CREATE INDEX "datePickerWidget_shop_idx" ON "datePickerWidget"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "dayDelivery_shop_key" ON "dayDelivery"("shop");

-- CreateIndex
CREATE INDEX "dayDelivery_shop_idx" ON "dayDelivery"("shop");
