-- GlobalHire: MySQL Database Migration Script
-- Computer Science Final Year Project
-- DBMS: MySQL 8.0+

CREATE DATABASE IF NOT EXISTS `globalhire_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `globalhire_db`;

-- Users Table
CREATE TABLE IF NOT EXISTS `User` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `passwordHash` VARCHAR(255) NOT NULL,
  `role` ENUM('SEEKER', 'EMPLOYER', 'ADMIN') NOT NULL DEFAULT 'SEEKER',
  `status` ENUM('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Candidate Profile Table
CREATE TABLE IF NOT EXISTS `Profile` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(191) NOT NULL UNIQUE,
  `fullName` VARCHAR(191) NOT NULL,
  `headline` VARCHAR(255) NULL,
  `bio` TEXT NULL,
  `location` VARCHAR(191) NOT NULL,
  `timezone` VARCHAR(50) NOT NULL,
  `utcOffset` DOUBLE NOT NULL DEFAULT 0.0,
  `skills` JSON NOT NULL,
  `experienceYears` INT NOT NULL DEFAULT 0,
  `expectedSalary` INT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `resumeUrl` VARCHAR(255) NULL,
  `resumeFileName` VARCHAR(255) NULL,
  `githubUrl` VARCHAR(255) NULL,
  `linkedinUrl` VARCHAR(255) NULL,
  `portfolioUrl` VARCHAR(255) NULL,
  `workPreference` ENUM('REMOTE', 'HYBRID', 'ONSITE') NOT NULL DEFAULT 'REMOTE',
  `avatarUrl` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  INDEX `idx_profile_location` (`location`),
  INDEX `idx_profile_experience` (`experienceYears`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Company Profile Table
CREATE TABLE IF NOT EXISTS `Company` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(191) NOT NULL UNIQUE,
  `name` VARCHAR(191) NOT NULL,
  `industry` VARCHAR(191) NOT NULL,
  `headquarters` VARCHAR(191) NOT NULL,
  `timezone` VARCHAR(50) NOT NULL,
  `website` VARCHAR(255) NULL,
  `logoUrl` VARCHAR(255) NULL,
  `description` TEXT NOT NULL,
  `teamSize` VARCHAR(50) NOT NULL,
  `verified` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_company_user` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  INDEX `idx_company_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Postings Table
CREATE TABLE IF NOT EXISTS `Job` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `companyId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `department` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `requirements` JSON NOT NULL,
  `niceToHave` JSON NULL,
  `skills` JSON NOT NULL,
  `employmentType` ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP') NOT NULL DEFAULT 'FULL_TIME',
  `experienceLevel` ENUM('ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE') NOT NULL DEFAULT 'MID',
  `location` VARCHAR(191) NOT NULL,
  `isRemote` BOOLEAN NOT NULL DEFAULT TRUE,
  `timezoneRequirement` VARCHAR(100) NULL,
  `targetUtcOffset` DOUBLE NULL,
  `minOverlapHours` INT NOT NULL DEFAULT 4,
  `salaryMin` INT NOT NULL,
  `salaryMax` INT NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `status` ENUM('OPEN', 'CLOSED', 'DRAFT') NOT NULL DEFAULT 'OPEN',
  `moderationStatus` ENUM('APPROVED', 'PENDING', 'FLAGGED') NOT NULL DEFAULT 'APPROVED',
  `featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_job_company` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE,
  INDEX `idx_job_title` (`title`),
  INDEX `idx_job_remote` (`isRemote`),
  INDEX `idx_job_status_mod` (`status`, `moderationStatus`),
  INDEX `idx_job_salary` (`salaryMin`, `salaryMax`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Applications Table
CREATE TABLE IF NOT EXISTS `Application` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `jobId` VARCHAR(191) NOT NULL,
  `seekerId` VARCHAR(191) NOT NULL,
  `status` ENUM('SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'REJECTED', 'HIRED') NOT NULL DEFAULT 'SUBMITTED',
  `matchScore` DOUBLE NOT NULL,
  `matchBreakdown` JSON NOT NULL,
  `coverLetter` TEXT NULL,
  `resumeSnapshotUrl` VARCHAR(255) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_app_job` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_app_seeker` FOREIGN KEY (`seekerId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_job_seeker` (`jobId`, `seekerId`),
  INDEX `idx_app_status` (`status`),
  INDEX `idx_app_score` (`matchScore`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Saved Jobs Table
CREATE TABLE IF NOT EXISTS `SavedJob` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(191) NOT NULL,
  `jobId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_saved_user` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_saved_job` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_saved_user_job` (`userId`, `jobId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Interview Scheduling Table
CREATE TABLE IF NOT EXISTS `Interview` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `applicationId` VARCHAR(191) NOT NULL,
  `scheduledAt` DATETIME(3) NOT NULL,
  `durationMinutes` INT NOT NULL DEFAULT 45,
  `timezone` VARCHAR(50) NOT NULL,
  `meetingLink` VARCHAR(255) NOT NULL,
  `meetingPlatform` VARCHAR(50) NOT NULL DEFAULT 'Google Meet',
  `notes` TEXT NULL,
  `status` ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_interview_app` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE CASCADE,
  INDEX `idx_interview_schedule` (`scheduledAt`),
  INDEX `idx_interview_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Compliance & Security Audit Logs Table
CREATE TABLE IF NOT EXISTS `AuditLog` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `actorId` VARCHAR(191) NULL,
  `actorEmail` VARCHAR(191) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entityType` VARCHAR(50) NOT NULL,
  `entityId` VARCHAR(191) NOT NULL,
  `details` JSON NULL,
  `ipAddress` VARCHAR(45) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `idx_audit_action` (`action`),
  INDEX `idx_audit_created` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
