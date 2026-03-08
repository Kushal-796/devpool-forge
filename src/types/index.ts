// User roles
export type UserRole = 'developer' | 'learner' | 'owner' | 'admin';

// Project status
export type ProjectStatus = 'open' | 'active' | 'completed';

// Project member roles
export type ProjectMemberRole = 'frontend' | 'backend' | 'ml' | 'designer' | 'tester';

// Task status
export type TaskStatus = 'todo' | 'in_progress' | 'done';

// Task priority
export type TaskPriority = 'high' | 'medium' | 'low';

// Bounty submission status
export type BountySubmissionStatus = 'pending' | 'approved' | 'rejected';

// Project invitation status
export type ProjectInvitationStatus = 'pending' | 'accepted' | 'rejected';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

// Users table
export interface User {
  id: string;
  name: string;
  email: string;
  githubUsername?: string;
  avatarUrl?: string;
  bio?: string;
  role: UserRole;
  reputationScore: number;
  createdAt: Date;
  updatedAt?: Date;
}

// Projects table
export interface Project {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  techStack: string[];
  difficulty: Difficulty;
  status: ProjectStatus;
  maxTeamSize: number;
  currentMembers?: number;
  stars?: number;
  amountInINR?: number; // optional funding or reward amount in rupees
  createdAt: Date;
  updatedAt?: Date;
}

// Project Members table (Team)
export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectMemberRole;
  joinedAt: Date;
}

// Project Tasks table
export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt?: Date;
}

// Bounties table
export interface Bounty {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  techStack: string[];
  points: number;
  createdBy: string;
  timeEstimate?: string;
  submissions?: number;
  createdAt: Date;
  updatedAt?: Date;
}

// Bounty Submissions table
export interface BountySubmission {
  id: string;
  bountyId: string;
  userId: string;
  repoLink: string;
  score?: number;
  status: BountySubmissionStatus;
  submittedAt: Date;
  reviewedAt?: Date;
}

// Skills table
export interface Skill {
  id: string;
  skillName: string;
}

// User Skills table
export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  skillScore: number;
}

// Repositories table
export interface Repository {
  id: string;
  userId: string;
  repoName: string;
  repoUrl: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  lastUpdated: Date;
}

// Portfolios table
export interface Portfolio {
  id: string;
  userId: string;
  headline: string;
  about: string;
  generatedAt: Date;
  updatedAt?: Date;
}

// Portfolio Projects table
export interface PortfolioProject {
  id: string;
  portfolioId: string;
  repoId: string;
  projectSummary: string;
}

// Notifications table
export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Project Invitations table
export interface ProjectInvitation {
  id: string;
  projectId: string;
  invitedUser: string;
  status: ProjectInvitationStatus;
  sentAt: Date;
  respondedAt?: Date;
}
