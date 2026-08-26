import type { Experience } from './experience';
import type { Project } from './project';

export interface Profile {
  name: string;
  roleClass: string;
  phone: string;
  dob: string;
  gender: string;
  location: string;
  education: string;
  bio: string;
  awards: string[];
  avatarUrl: string;
  email: string;
  githubUrl: string;
}

export interface SkillItem {
  name: string;
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
