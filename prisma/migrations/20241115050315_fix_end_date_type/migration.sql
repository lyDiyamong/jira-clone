/*
  Warnings:

  - Changed the type of `endDate` on the `Sprint` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Sprint" DROP CONSTRAINT "Sprint_projectId_fkey";

-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "endDate",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
