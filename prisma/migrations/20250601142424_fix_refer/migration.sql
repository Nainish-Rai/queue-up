-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Signup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "waitlistId" TEXT NOT NULL,
    "referredBy" TEXT,
    "referralId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Signup_waitlistId_fkey" FOREIGN KEY ("waitlistId") REFERENCES "Waitlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Signup" ("createdAt", "email", "id", "name", "referralId", "referredBy", "waitlistId") SELECT "createdAt", "email", "id", "name", "referralId", "referredBy", "waitlistId" FROM "Signup";
DROP TABLE "Signup";
ALTER TABLE "new_Signup" RENAME TO "Signup";
CREATE UNIQUE INDEX "Signup_referralId_key" ON "Signup"("referralId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
