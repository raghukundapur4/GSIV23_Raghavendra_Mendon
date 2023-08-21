import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import './index.css';

import App, { MovieDetails } from "./App";
import store from "./store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/movie/:movieId",
    element: <MovieDetails />
  }
]);
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
