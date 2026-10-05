import { getCollection, getEntries, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Company = CollectionEntry<'companies'>;

/** All companies, in the configured order. */
export async function getCompanies(): Promise<Company[]> {
  const companies = await getCollection('companies');
  return companies.sort((a, b) => a.data.order - b.data.order);
}

/** All projects, newest first. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title, 'da'));
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.data.featured).slice(0, limit);
}

export async function getProjectCompanies(project: Project): Promise<Company[]> {
  return getEntries(project.data.companies);
}

/** Danish list: "A, B og C". */
export function joinDa(items: string[]): string {
  return new Intl.ListFormat('da', { type: 'conjunction' }).format(items);
}
