import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../app/api/baseApi";
import type { Company } from "../../app/models/company";

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery,
  tagTypes: ["Company"],
  endpoints: (builder) => ({
    getCompanies: builder.query<Company[], void>({
      query: () => "companies",
      providesTags: ["Company"],
    }),
    getCompany: builder.query<Company, number>({
      query: (id) => `companies/${id}`,
      providesTags: ["Company"],
    }),
    createCompany: builder.mutation<Company, FormData>({
      query: (body) => ({
        url: "companies",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Company"],
    }),
    updateCompany: builder.mutation<void, { id: number; body: FormData }>({
      query: ({ id, body }) => ({
        url: `companies/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Company"],
    }),
    deleteCompany: builder.mutation<void, number>({
      query: (id) => ({
        url: `companies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Company"],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;
