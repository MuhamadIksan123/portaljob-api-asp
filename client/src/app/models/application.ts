export interface JobApplication {
  id: number;
  companyJobId: number;
  jobName: string;
  jobSlug: string;
  companyName: string;
  candidateId: string;
  candidateName: string;
  resumeUrl: string;
  message: string;
  isHired: boolean;
  createdAt: string;
}
