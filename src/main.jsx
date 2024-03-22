import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
	<GoogleOAuthProvider clientId="828300930674-q0ma0esel0hjdi89eiq1icniq7kgjkl3.apps.googleusercontent.com">
		<React.StrictMode>
			<Router />
		</React.StrictMode>
	</GoogleOAuthProvider>
);
