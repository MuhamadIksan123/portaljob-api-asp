import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../app/api/baseApi";

export type UserInfo = {
  id: string;
  email: string;
  userName: string;
  name: string;
  avatarUrl?: string;
  occupation?: string;
  experience: number;
  roles: string[];
};

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery,
  tagTypes: ["UserInfo"],
  endpoints: (builder) => ({
    login: builder.mutation<void, { email: string; password: string }>({
      query: (body) => ({
        url: "login?useCookies=true",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserInfo"],
    }),
    register: builder.mutation<void, FormData>({
      query: (body) => ({
        url: "account/register",
        method: "POST",
        body,
      }),
    }),
    userInfo: builder.query<UserInfo, void>({
      query: () => "account/user-info",
      providesTags: ["UserInfo"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "account/logout",
        method: "POST",
      }),
      invalidatesTags: ["UserInfo"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUserInfoQuery,
  useLogoutMutation,
} = accountApi;
