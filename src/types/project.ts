export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  period: string;
  imageUrl?: string | null;
  role?: string | null;
  platform?: string | null;
  team?: string | null;
  highlights: string[];
  projectUrl?: string | null;
  githubUrl?: string | null;
  techStack?: string[] | null;
  featured: boolean;
}
