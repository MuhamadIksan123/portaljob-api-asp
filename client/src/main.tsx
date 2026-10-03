import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./app/store/store";
import { router } from "./app/routes/routes";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
