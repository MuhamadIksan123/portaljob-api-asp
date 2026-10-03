import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../app/api/baseApi";

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  occupation?: string;
  experience: number;
  roles: string[];
}

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, void>({
      query: () => "profile",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<void, FormData>({
      query: (body) => ({
        url: "profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    changePassword: builder.mutation<
      void,
      {
        currentPassword: string;
        newPassword: string;
      }
    >({
      query: (body) => ({
        url: "profile/password",
        method: "PUT",
        body,
      }),
    }),
    deleteProfile: builder.mutation<void, { password: string }>({
      query: (body) => ({
        url: "profile",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteProfileMutation,
} = profileApi;
