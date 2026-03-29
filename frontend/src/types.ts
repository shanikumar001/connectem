export enum UserRole {
  mentor = "mentor",
  company = "company",
}

export interface MentorProfile {
  fullName: string;
  title: string;
  bio: string;
  yearsExperience: number;
  skills: string[];
  industries: string[];
  linkedinUrl: string;
  websiteUrl: string;
  location: string;
  availability: string;
}

export interface CompanyProfile {
  companyName: string;
  industry: string;
  description: string;
  teamSize: number;
  mentorRequirements: string;
  contactName: string;
  contactEmail: string;
  websiteUrl: string;
  location: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  role: UserRole;
  isAdmin: boolean;
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
