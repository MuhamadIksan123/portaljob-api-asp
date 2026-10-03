import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:5001/api/";

export const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  credentials: "include",
});
