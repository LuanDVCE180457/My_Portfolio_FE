import type { Experience } from './experience';
import type { Project } from './project';

export interface Profile {
  name: string;
  roleClass: string;
  dob: string;
  location: string;
  education: string;
  bio: string;
  avatarUrl: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface SkillGroup {
  category: string;
  items: SkillItem[];
}

export interface CvData {
  profile: Profile;
  skills: SkillGroup[];
  experiences: Experience[];
  projects: Project[];
}
