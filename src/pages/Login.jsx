import "../styles/form.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import API_URL from "../assets/api-url";
import { Logo, GoogleIcon, ExIcon } from "../assets/icons";

const Login = () => {
	const [dialogState, setDialogState] = useState(true);
	const [typeDialogState, setTypeDialogState] = useState("create-account");
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
	function openDialog(type) {
		setTypeDialogState(type);
		setDialogState(true);
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
				<p className="text-center or">or</p>
				<button
					className="login-button principal-button"
					onClick={() => openDialog("create-account")}
				>
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
				<button
					className="login-button"
					onClick={() => openDialog("sign-in")}
				>
					Sign in
				</button>
			</div>
			<div
				className="emerge-form"
				style={{ display: dialogState ? "flex" : "none" }}
			>
				<FormCard setDialogState={setDialogState}>
					{" "}
					{typeDialogState === "create-account" ? (
						<CreateAccount />
					) : (
						<SignIn />
					)}
				</FormCard>
			</div>
		</div>
	);
};

function FormCard(prop) {
	function closeDialog() {
		prop.setDialogState(false);
	}
	return (
		<div className="form-container form">
			<button className="ex" onClick={closeDialog}>
				<ExIcon />
			</button>
			<Logo class="logo" />
			{prop.children}
		</div>
	);
}

function CreateAccount() {
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
			prop.setDialogState(false);
			return; // parses JSON response into native JavaScript objects
		}
	}
	return (
		<>
			<h1>Create your account</h1>
			<form
				action="POST"
				onSubmit={(e) => {
					e.preventDefault();
					registerUser(e.target);
				}}
			>
				<InputComponent>
					<label htmlFor="first_name">First name</label>
					<input
						name="first_name"
						type="text"
						placeholder=" "
						required
					/>
				</InputComponent>
				<InputComponent>
					<label htmlFor="last_name">Last name</label>
					<input
						name="last_name"
						type="text"
						placeholder=" "
						required
					/>
				</InputComponent>
				<InputComponent>
					<label htmlFor="username">Username</label>
					<input
						name="username"
						type="text"
						placeholder=" "
						required
					/>
				</InputComponent>
				<InputComponent>
					<label htmlFor="email">Email</label>
					<input name="email" type="email" placeholder=" " required />
				</InputComponent>
				<InputComponent>
					<label htmlFor="password">Password</label>
					<input
						name="password"
						type="password"
						required
						onChange={(e) => setPassword(e.target.value)}
						placeholder=" "
						className={
							password !== confirmPassword &&
							confirmPassword !== ""
								? "bad-input"
								: null
						}
					/>
				</InputComponent>
				<InputComponent>
					<label htmlFor="confirm_password">Confirm password</label>
					<input
						name="confirm_password"
						type="password"
						required
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder=" "
						className={
							password !== confirmPassword &&
							confirmPassword !== ""
								? "bad-input"
								: null
						}
					/>
				</InputComponent>

				<button className="login-button principal-button">
					Submit
				</button>
			</form>
		</>
	);
}

function SignIn() {
	return (
		<>
			<h1>Sign in to twitter</h1>
			<form
				action="POST"
				onSubmit={(e) => {
					e.preventDefault();
				}}
			>
				<button className="login-button">
					<GoogleIcon class="button-icon" />
					Sign in with Google
				</button>
				<p className="text-center or">or</p>
				<InputComponent>
					<label htmlFor="username">Username</label>
					<input
						name="username"
						type="text"
						placeholder=" "
						required
					/>
				</InputComponent>
				<InputComponent>
					<label htmlFor="password">Password</label>
					<input
						name="password"
						type="password"
						required
						onChange={(e) => setPassword(e.target.value)}
						placeholder=" "
					/>
				</InputComponent>

				<button className="login-button principal-button">
					Submit
				</button>
			</form>
		</>
	);
}

function InputComponent({ children }) {
	const containerRef = useRef(null);
	function redirectClick(e) {
		if (
			(e.target.classList[0] === "input-container") |
			(e.target.localName == "label")
		)
			containerRef.current.children[1].focus();
	}
	return (
		<div
			className="input-container"
			ref={containerRef}
			onClick={redirectClick}
		>
			{children}
		</div>
	);
}

export default Login;
