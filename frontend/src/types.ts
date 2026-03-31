export enum UserRole {
  mentor = "mentor",
  company = "company",
}

export enum UserStatus {
  pending = "pending",
  interview = "interview",
  pass = "pass",
  selected = "selected",
}

export interface MentorProfile {
  fullName: string;
  expertise: string;
  title: string;
  bio: string;
  yearsExperience: number;
  skills: string[];
  industries: string[];
  linkedinUrl: string;
  websiteUrl: string;
  location: string;
  availability: string;
  phone: string;
  profileImage: string;
}

export interface CompanyProfile {
  companyName: string;
  industry: string;
  description: string;
  teamSize: number;
  mentorRequirements: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  location: string;
  profileImage: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  role: UserRole;
  isAdmin: boolean;
  isProfileCompleted: boolean;
  isApproved: boolean;
  status: UserStatus;
  mentorProfile?: MentorProfile | null;
  companyProfile?: CompanyProfile | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}

export interface RequestAccessSubmission {
  name: string;
  email: string;
  roleInterest: string;
  message: string;
}
