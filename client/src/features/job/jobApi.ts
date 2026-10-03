import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../app/api/baseApi";
import type { Job, JobSummary } from "../../app/models/job";

export type JobPageResult = {
  items: JobSummary[];
  pageNumber: number;
  pageSize: number;
  count: number;
};

export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery,
  tagTypes: ["Job"],
  endpoints: (builder) => ({
    getJobs: builder.query<
      JobPageResult,
      { keyword?: string; categorySlug?: string }
    >({
      query: (params) => ({
        url: "jobs",
        params,
      }),
      providesTags: ["Job"],
    }),

    getJob: builder.query<Job, string>({
      query: (slug) => `jobs/${slug}`,
      providesTags: ["Job"],
    }),

    getMyJobs: builder.query<JobSummary[], void>({
      query: () => "jobs/mine",
      providesTags: ["Job"],
    }),

    createJob: builder.mutation<Job, FormData>({
      query: (body) => ({
        url: "jobs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Job"],
    }),

    updateJob: builder.mutation<void, { id: number; body: FormData }>({
      query: ({ id, body }) => ({
        url: `jobs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Job"],
    }),

    deleteJob: builder.mutation<void, number>({
      query: (id) => ({
        url: `jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Job"],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobQuery,
  useGetMyJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobApi;
