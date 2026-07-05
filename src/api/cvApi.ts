import type { Experience } from '../types/experience';
import type { Skill } from '../types/skill';
import type { Project } from '../types/project';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface CreateContactMessagePayload {
  name: string;
  email: string;
  message: string;
}

async function handleResponse<T>(response: Response, errorMessage: string): Promise<T> {
  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export async function getFullCv(): Promise<{ profile: any; skills: Skill[]; experiences: Experience[]; projects: Project[] }> {
  const response = await fetch(`${API_URL}/cv`);
  return handleResponse(response, 'Failed to fetch full CV');
}

export async function getSkills(): Promise<Skill[]> {
  const response = await fetch(`${API_URL}/skills`);
  return handleResponse<Skill[]>(response, 'Failed to fetch skills');
}

export async function getExperiences(): Promise<Experience[]> {
  const response = await fetch(`${API_URL}/experiences`);
  return handleResponse<Experience[]>(response, 'Failed to fetch experiences');
}

export async function createContactMessage(
  payload: CreateContactMessagePayload,
): Promise<{ id: number }> {
  const response = await fetch(`${API_URL}/contact-messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<{ id: number }>(response, 'Failed to send contact message');
}
