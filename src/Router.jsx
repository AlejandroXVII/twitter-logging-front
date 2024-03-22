import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import TimeLine from "./pages/TimeLine";

const Router = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <TimeLine />,
			errorElement: <ErrorPage />,
		},
		{
			path: "sign-up",
			element: <SignUp />,
		},
		{
			path: "log-in",
			element: <Login />,
		},
	]);

	return <RouterProvider router={router} />;
};

export default Router;
