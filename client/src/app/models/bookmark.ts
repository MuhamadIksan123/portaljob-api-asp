export interface Bookmark {
  id: number;
  jobId: number;
  jobName: string;
  jobSlug: string;
  companyName: string;
  categoryName: string;
  thumbnailUrl: string;
  location: string;
  type: string;
  skillLevel: string;
  salary: number;
  isOpen: boolean;
  createdAt: string;
}
