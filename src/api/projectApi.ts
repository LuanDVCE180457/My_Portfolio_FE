import type { Project } from '../types/project';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_URL}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const res = await fetch(`${API_URL}/projects/featured`);
  if (!res.ok) throw new Error('Failed to fetch featured projects');
  return res.json();
}