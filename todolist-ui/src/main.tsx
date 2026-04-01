import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import TasksPage from "./pages/TasksPage";
import EmailPage from "./pages/EmailPage";
import "./App.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <TasksPage /> },
            { path: "tasks", element: <TasksPage /> },
            { path: "email", element: <EmailPage /> },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);