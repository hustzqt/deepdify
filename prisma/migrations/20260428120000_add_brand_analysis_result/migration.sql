-- CreateTable
CREATE TABLE "brand_analysis_results" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "usageLogId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brand_analysis_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brand_analysis_results_usageLogId_key" ON "brand_analysis_results"("usageLogId");

CREATE INDEX "brand_analysis_results_brandId_idx" ON "brand_analysis_results"("brandId");

CREATE INDEX "brand_analysis_results_userId_idx" ON "brand_analysis_results"("userId");

-- AddForeignKey
ALTER TABLE "brand_analysis_results" ADD CONSTRAINT "brand_analysis_results_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "brand_analysis_results" ADD CONSTRAINT "brand_analysis_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "brand_analysis_results" ADD CONSTRAINT "brand_analysis_results_usageLogId_fkey" FOREIGN KEY ("usageLogId") REFERENCES "ai_usage_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
