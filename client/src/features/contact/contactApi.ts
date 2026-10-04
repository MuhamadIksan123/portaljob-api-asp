import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../app/api/baseApi";

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactAdmin {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery,
  tagTypes: ["Contact"],
  endpoints: (builder) => ({
    sendContact: builder.mutation<void, ContactRequest>({
      query: (body) => ({
        url: "contacts",
        method: "POST",
        body,
      }),
    }),
    getContacts: builder.query<ContactAdmin[], void>({
      query: () => "contacts",
    }),
    deleteContact: builder.mutation<void, number>({
      query: (id) => ({
        url: `contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const {
  useSendContactMutation,
  useGetContactsQuery,
  useDeleteContactMutation,
} = contactApi;
