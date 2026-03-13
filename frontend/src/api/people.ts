/**
 * People API client — fetches people list and network graph data.
 *
 * Owns: HTTP calls to /api/people endpoints.
 * Does NOT own: rendering, layout, or state management.
 */
import axios from 'axios';

const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL) ||
  'http://localhost:8000';

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

/** A person node in the network graph. */
export interface NetworkNode {
  id: string;
  name: string;
  born_year: number | null;
  died_year: number | null;
  roles: string[] | null;
  image_url: string | null;
}

/** An edge in the network graph. */
export interface NetworkEdge {
  source: string;
  target: string;
  weight: number;
  edge_type: 'shared_event' | 'contemporary';
}

/** Full network response. */
export interface NetworkResponse {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

/** Person detail from the list endpoint. */
export interface PersonDetail {
  id: string;
  name: string;
  slug: string | null;
  born_year: number | null;
  died_year: number | null;
  nationality: string | null;
  roles: string[] | null;
  bio: string | null;
  importance_score: number | null;
  image_url: string | null;
}

/**
 * Fetch the full people network (nodes + edges).
 * @returns Network graph data for React Flow rendering
 */
export async function fetchPeopleNetwork(): Promise<NetworkResponse> {
  const { data } = await api.get<NetworkResponse>('/api/people/network');
  return data;
}

/**
 * Fetch all people as a flat list.
 * @returns Array of person details
 */
export async function fetchPeople(): Promise<PersonDetail[]> {
  const { data } = await api.get<PersonDetail[]>('/api/people');
  return data;
}

/**
 * Fetch a single person by ID.
 * @param id - Person UUID
 * @returns Person detail
 */
export async function fetchPersonById(id: string): Promise<PersonDetail> {
  const people = await fetchPeople();
  const person = people.find((p) => p.id === id);
  if (!person) throw new Error(`Person not found: ${id}`);
  return person;
}
