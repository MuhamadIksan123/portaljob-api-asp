import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../app/api/baseApi";

export interface Bookmark {
  id: number;
  jobId: number;
  jobName: string;
  jobSlug: string;
  companyName: string;
  categoryName?: string;
  thumbnailUrl: string;
  location: string;
  type: string;
  skillLevel?: string;
  salary: number;
  isOpen: boolean;
  createdAt?: string;
}

export const bookmarkApi = createApi({
  reducerPath: "bookmarkApi",
  baseQuery,
  tagTypes: ["Bookmarks"],
  endpoints: (builder) => ({
    getBookmarks: builder.query<Bookmark[], void>({
      query: () => "bookmarks",
      providesTags: ["Bookmarks"],
    }),
    addBookmark: builder.mutation<void, number>({
      query: (jobId) => ({
        url: `bookmarks/${jobId}`,
        method: "POST",
      }),
      invalidatesTags: ["Bookmarks"],
    }),
    deleteBookmark: builder.mutation<void, number>({
      query: (jobId) => ({
        url: `bookmarks/${jobId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookmarks"],
    }),
  }),
});

export const {
  useGetBookmarksQuery,
  useAddBookmarkMutation,
  useDeleteBookmarkMutation,
} = bookmarkApi;
