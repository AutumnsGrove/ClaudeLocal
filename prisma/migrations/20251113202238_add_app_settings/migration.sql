-- CreateTable
CREATE TABLE "app_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "defaultModel" TEXT NOT NULL DEFAULT 'claude-sonnet-4-20250514',
    "startupBehavior" TEXT NOT NULL DEFAULT 'last_conversation',
    "themePreference" TEXT NOT NULL DEFAULT 'system',
    "fontSize" TEXT NOT NULL DEFAULT 'medium',
    "codeFontFamily" TEXT NOT NULL DEFAULT 'monospace',
    "messageDensity" TEXT NOT NULL DEFAULT 'comfortable',
    "apiTimeout" INTEGER NOT NULL DEFAULT 120000,
    "enabledModels" TEXT,
    "defaultTemperature" REAL NOT NULL DEFAULT 1.0,
    "defaultMaxTokens" INTEGER NOT NULL DEFAULT 4096,
    "enableThinking" BOOLEAN NOT NULL DEFAULT false,
    "enableCaching" BOOLEAN NOT NULL DEFAULT true,
    "experimentalFeatures" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
