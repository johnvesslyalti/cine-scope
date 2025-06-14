/*
  Warnings:

  - You are about to drop the column `addedAt` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `tvShowId` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the `CastMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TVShow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MovieGenres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TVGenres` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `movieId` on table `Watchlist` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CastMember" DROP CONSTRAINT "CastMember_movieId_fkey";

-- DropForeignKey
ALTER TABLE "CastMember" DROP CONSTRAINT "CastMember_tvShowId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_tvShowId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_userId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_tvShowId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "Watchlist" DROP CONSTRAINT "Watchlist_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Watchlist" DROP CONSTRAINT "Watchlist_tvShowId_fkey";

-- DropForeignKey
ALTER TABLE "_MovieGenres" DROP CONSTRAINT "_MovieGenres_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieGenres" DROP CONSTRAINT "_MovieGenres_B_fkey";

-- DropForeignKey
ALTER TABLE "_TVGenres" DROP CONSTRAINT "_TVGenres_A_fkey";

-- DropForeignKey
ALTER TABLE "_TVGenres" DROP CONSTRAINT "_TVGenres_B_fkey";

-- AlterTable
ALTER TABLE "Watchlist" DROP COLUMN "addedAt",
DROP COLUMN "tvShowId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "movieId" SET NOT NULL;

-- DropTable
DROP TABLE "CastMember";

-- DropTable
DROP TABLE "Genre";

-- DropTable
DROP TABLE "Movie";

-- DropTable
DROP TABLE "Rating";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "TVShow";

-- DropTable
DROP TABLE "_MovieGenres";

-- DropTable
DROP TABLE "_TVGenres";
