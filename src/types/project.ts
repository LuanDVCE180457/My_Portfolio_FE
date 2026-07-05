export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  projectUrl?: string | null;
  githubUrl?: string | null;
  techStack?: string[] | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}