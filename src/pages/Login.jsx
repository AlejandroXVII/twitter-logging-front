import "../styles/login.css";
import { useState, useRef, useEffect } from "react";
import API_URL from "../assets/api-url";
import { Logo, ExIcon } from "../assets/icons";
import { GoogleLogin } from "@react-oauth/google";

const Login = (prop) => {
	const [dialogState, setDialogState] = useState(false);
	const [typeDialogState, setTypeDialogState] = useState("create-account");

	const handleLoginFailure = () => {
		console.log("Login Failed");
		// handle error
	};
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
				<div>
					<GoogleLogin
						onSuccess={prop.login}
						onError={(err) => console.log("fail", err)}
						onFailure={(err) => console.log("fail", err)}
					/>
				</div>
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
						<SignIn
							handleLoginSuccess={prop.login}
							handleLoginFailure={handleLoginFailure}
						/>
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
	const [emailExists, setEmailExists] = useState(null);
	const [usernameExists, setUsernameExists] = useState(null);

	async function checkDataExistence(type, data) {
		const response = await fetch(
			API_URL + "/users/exists/" + type + "/" + data
		);
		const responseJson = await response.json();
		if (type === "email") {
			setEmailExists(responseJson.exists);
		} else if (type === "username") {
			setUsernameExists(responseJson.exists);
		}
	}
	async function registerUser(e) {
		// Check if email exists
		await checkDataExistence("email", e.email.value);
		if (emailExists) {
			console.log("email exist already");
			return;
		}

		// Check if username exists
		await checkDataExistence("username", e.username.value);
		if (usernameExists) {
			console.log("username exist already");
			return;
		}

		if (password === confirmPassword) {
			await fetch(API_URL + "/users", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					first_name: e.first_name.value,
					last_name: e.last_name.value,
					username: e.username.value,
					email: e.email.value,
					password: e.password.value,
					sign_up_method: "email",
				}),
			});
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

function SignIn(prop) {
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
				email: e.email.value,
				password: e.password.value,
			}),
		});
		const jsonResponse = await response.json();
		//SAVE THE SESSION
		//...
		return jsonResponse; // parses JSON response into native JavaScript objects
	}
	return (
		<>
			<h1>Sign in to twitter</h1>
			<form
				action="POST"
				onSubmit={(e) => {
					e.preventDefault();
					loginUser(e.target);
				}}
			>
				<GoogleLogin
					onSuccess={prop.handleLoginSuccess}
					onError={prop.handleLoginFailure}
				/>
				<p className="text-center or">or</p>
				<InputComponent>
					<label htmlFor="email">Email</label>
					<input name="email" type="text" placeholder=" " required />
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
