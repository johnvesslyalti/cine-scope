/*
  Warnings:

  - Added the required column `posterUrl` to the `Watchlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Watchlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Watchlist" ADD COLUMN     "posterUrl" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
