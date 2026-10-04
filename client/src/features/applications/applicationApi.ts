import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../app/api/baseApi";
import type { JobApplication } from "../../app/models/application";

export const applicationApi = createApi({
  reducerPath: "applicationApi",
  baseQuery,
  tagTypes: ["Application", "Job"],
  endpoints: (builder) => ({
    apply: builder.mutation<JobApplication, { slug: string; body: FormData }>({
      query: ({ slug, body }) => ({
        url: `applications/jobs/${slug}/apply`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Application"],
    }),
    getMine: builder.query<JobApplication[], void>({
      query: () => "applications/mine",
      providesTags: ["Application"],
    }),
    getMineById: builder.query<JobApplication, number>({
      query: (id) => `applications/mine/${id}`,
      providesTags: ["Application"],
    }),
    getJobApplications: builder.query<JobApplication[], number>({
      query: (jobId) => `applications/jobs/${jobId}`,
      providesTags: ["Application"],
    }),
    hire: builder.mutation<void, number>({
      query: (id) => ({
        url: `applications/${id}/hire`,
        method: "PUT",
      }),
      invalidatesTags: ["Application", "Job"],
    }),
    getResume: builder.query<Blob, number>({
      query: (id) => ({
        url: `applications/${id}/resume`,
        responseHandler: async (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useApplyMutation,
  useGetMineQuery,
  useGetMineByIdQuery,
  useGetJobApplicationsQuery,
  useHireMutation,
} = applicationApi;
