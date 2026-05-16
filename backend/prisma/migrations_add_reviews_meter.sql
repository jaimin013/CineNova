-- Migration: add_reviews_meter
-- Add Review, ReviewLike, and MeterVote models

-- Create Review table
CREATE TABLE "Review" (
    "id" SERIAL PRIMARY KEY,
    "contentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "voteType" VARCHAR(255) NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fk_review_content" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_review_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_review_contentId" ON "Review"("contentId");
CREATE INDEX "idx_review_userId" ON "Review"("userId");

-- Create ReviewLike table
CREATE TABLE "ReviewLike" (
    "id" SERIAL PRIMARY KEY,
    "reviewId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fk_reviewlike_review" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_reviewlike_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,

    CONSTRAINT "uq_reviewlike_review_user" UNIQUE ("reviewId", "userId")
);

CREATE INDEX "idx_reviewlike_reviewId" ON "ReviewLike"("reviewId");
CREATE INDEX "idx_reviewlike_userId" ON "ReviewLike"("userId");

-- Create MeterVote table
CREATE TABLE "MeterVote" (
    "id" SERIAL PRIMARY KEY,
    "contentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "voteType" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fk_metervote_content" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_metervote_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,

    CONSTRAINT "uq_metervote_content_user" UNIQUE ("contentId", "userId")
);

CREATE INDEX "idx_metervote_contentId" ON "MeterVote"("contentId");
CREATE INDEX "idx_metervote_userId" ON "MeterVote"("userId");