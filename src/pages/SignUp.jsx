import { Link } from "react-router-dom";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API_URL from "../assets/api-url";

const SignUp = () => {
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	async function registerUser(e) {
		// Default options are marked with *
		if (password === confirmPassword) {
			await fetch(API_URL + "/users", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					full_name: e.full_name.value,
					username: e.username.value,
					email: e.email.value,
					password: e.password.value,
				}),
			});
			navigate("/log-in");
			return; // parses JSON response into native JavaScript objects
		}
	}
	return (
		<div className="container">
			<div className="form">
				<h1>Sing up</h1>
				<form
					action="POST"
					onSubmit={(e) => {
						e.preventDefault();
						registerUser(e.target);
					}}
				>
					<label htmlFor="full_name">Full name</label>
					<input name="full_name" type="text" required />
					<label htmlFor="username">Username</label>
					<input name="username" type="text" required />
					<label htmlFor="email">Email</label>
					<input name="email" type="email" required />
					<label htmlFor="password">Password</label>
					<input
						name="password"
						type="password"
						required
						onChange={(e) => setPassword(e.target.value)}
						style={{
							backgroundColor:
								password !== confirmPassword
									? "#ff000033"
									: null,
						}}
					/>
					<label htmlFor="confirm_password">Confirm password</label>
					<input
						name="confirm_password"
						type="password"
						required
						onChange={(e) => setConfirmPassword(e.target.value)}
						style={{
							backgroundColor:
								password !== confirmPassword
									? "#ff000033"
									: null,
						}}
					/>

					<button>Submit</button>
				</form>
				<p>
					Do you already have an account?
					<Link to={"/log-in"}> Long-in</Link>
				</p>
			</div>
		</div>
	);
};

export default SignUp;
