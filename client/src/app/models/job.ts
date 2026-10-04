export interface JobSummary {
  id: number;
  name: string;
  slug: string;
  companyName: string;
  thumbnailUrl: string;
  location: string;
  type: string;
  salary: number;
  isOpen: boolean;
}

export interface Job extends JobSummary {
  companyId: number;
  categoryId: number;
  about: string;
  skillLevel: string;
  createdAt: string | null;
  categoryName: string;
  responsibilities: string[];
  qualifications: string[];
  relatedJobs: JobSummary[];
}
