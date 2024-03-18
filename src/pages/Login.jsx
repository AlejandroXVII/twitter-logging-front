import { Link } from "react-router-dom";
import "../styles/form.css";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import API_URL from "../assets/api-url";
import { Logo, GoogleIcon } from "../assets/icons";

const Login = () => {
	const navigate = useNavigate();
	const cookies = new Cookies(null, { path: "/" });
	async function loginUser(e) {
		// Default options are marked with *
		const response = await fetch(API_URL + "/login", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Set-Cookie": "name1=value1",
			},
			body: JSON.stringify({
				username: e.username.value,
				password: e.password.value,
			}),
		});
		const jsonResponse = await response.json();
		//response.headers.getSetCookie();
		cookies.set("token", jsonResponse.token);
		cookies.set("userID", jsonResponse.userID);
		navigate("/");
		return; // parses JSON response into native JavaScript objects
	}
	return (
		<div className="container login-container">
			<div className="big-logo">
				<Logo class="logo" />
			</div>
			<div className="form">
				<Logo class="logo" />
				<h1>Happening now</h1>
				<h2>Join today.</h2>
				<button className="login-button">
					<GoogleIcon class="button-icon" />
					Sign up with Google
				</button>
				<p className="text-center">or</p>
				<button className="login-button principal-button">
					Create account
				</button>
				<p className="tiny-text">
					By signing up, you agree to the{" "}
					<a href="">Terms of Service</a> and{" "}
					<a href="">Privacy Policy</a>, including{" "}
					<a href="">Cookie Use.</a>
				</p>
				<p>
					<b>Already have an account?</b>
				</p>
				<button className="login-button">Sign in</button>
			</div>
		</div>
	);
};

export default Login;
