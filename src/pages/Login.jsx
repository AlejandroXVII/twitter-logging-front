import { Link } from "react-router-dom";
import "../styles/form.css";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import API_URL from "../assets/api-url";

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
		<div className="container">
			<div className="form">
				<h1>Login</h1>
				<form
					action="POST"
					onSubmit={(e) => {
						e.preventDefault();
						loginUser(e.target);
					}}
				>
					<label htmlFor="username">Username</label>
					<input name="username" type="text" required />
					<label htmlFor="password">Password</label>
					<input name="password" type="password" required />
					<button>Submit</button>
				</form>
				<p>
					You do not have an account? You can
					<Link to={"/sign-up"}> Sign-up</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
