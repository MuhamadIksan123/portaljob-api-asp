import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { categoryApi } from "../../features/categories/categoryApi";
import { accountApi } from "../../features/account/accountApi";
import { companyApi } from "../../features/company/companyApi";
import { jobApi } from "../../features/job/jobApi";
import { applicationApi } from "../../features/applications/applicationApi";
import { profileApi } from "../../features/profile/profileApi";
import { bookmarkApi } from "../../features/bookmarks/bookmarkApi";
import { contactApi } from "../../features/contact/contactApi";

export const store = configureStore({
  reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [bookmarkApi.reducerPath]: bookmarkApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(categoryApi.middleware)
      .concat(accountApi.middleware)
      .concat(companyApi.middleware)
      .concat(jobApi.middleware)
      .concat(applicationApi.middleware)
      .concat(profileApi.middleware)
      .concat(bookmarkApi.middleware)
      .concat(contactApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
