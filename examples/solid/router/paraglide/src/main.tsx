import { RouterProvider } from "@tanstack/solid-router";
import { render } from "solid-js/web";
import { createRouter } from "./router";
import "./styles.css";

const router = createRouter();

const rootElement = document.getElementById("root");

if (rootElement) {
  render(() => <RouterProvider router={router} />, rootElement);
}
