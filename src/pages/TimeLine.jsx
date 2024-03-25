import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import Login from "./Login";
import "../styles/login.css";
import axios from "axios";
import API_URL from "../assets/api-url";

function TimeLine() {
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null);

	const login = useGoogleLogin({
		onSuccess: (codeResponse) => {
			setUser(codeResponse);
		},
		onError: (error) => console.log("Login Failed:", error),
	});

	useEffect(() => {
		if ("googleData" in localStorage && "profileInfo" in localStorage) {
			setUser(JSON.parse(localStorage.getItem("googleData")));
			setProfile(JSON.parse(localStorage.getItem("profileInfo")));
		}
	}, []);

	useEffect(() => {
		if (user !== null) {
			axios
				.get(
					`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
					{
						headers: {
							Authorization: `Bearer ${user.access_token}`,
							Accept: "application/json",
						},
					}
				)
				.then((res) => {
					const notFormatProfile = res.data;
					const formatProfile = {
						first_name: notFormatProfile.given_name,
						last_name: notFormatProfile.family_name,
						email: notFormatProfile.email,
						avatar: notFormatProfile.picture,
						sign_up_method: "google",
					};
					registerUserWithGoogle(formatProfile);
					setProfile(formatProfile);
					localStorage.setItem(
						"profileInfo",
						JSON.stringify(formatProfile)
					);
					localStorage.setItem("googleData", JSON.stringify(user));
				})
				.catch((err) => console.log(err));
		}
	}, [user]);

	async function registerUserWithGoogle(formatProfile) {
		// Default options are marked with *
		console.log(formatProfile);
		if (await checkDataExistence("email", formatProfile.email)) {
			console.log("email exist already");
			return;
		}

		await fetch(API_URL + "/users", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				first_name: formatProfile.first_name,
				last_name: formatProfile.last_name,
				email: formatProfile.email,
				avatar: formatProfile.avatar,
				sign_up_method: formatProfile.sign_up_method,
			}),
		});
		return; // parses JSON response into native JavaScript objects
	}

	async function checkDataExistence(type, data) {
		const response = await fetch(
			API_URL + "/users/exists/" + type + "/" + data
		);
		const responseJson = await response.json();
		return responseJson.exists;
	}
	// log out function to log the user out of google and set the profile array to null
	const logOut = () => {
		googleLogout();
		setProfile(null);
		setUser(null);
		localStorage.clear();
	};

	const isAccessTokenExpired = () => {
		let currentDate = new Date();
		console.log(user.expires_in);
		let timeObject = new Date();
		timeObject = new Date(timeObject.getTime() + user.expires_in * 1000);
		console.log(timeObject);
	};
	return (
		<>
			{profile !== null ? (
				<div>
					<img src={profile.avatar} alt="user image" />
					<h3>User Logged in</h3>
					<p>Name: {profile.first_name + " " + profile.last_name}</p>
					<p>Email Address: {profile.email}</p>
					<br />
					<br />
					<button onClick={logOut}>Log out</button>
					<button onClick={isAccessTokenExpired}>verify</button>
				</div>
			) : (
				<Login
					login={login}
					user={user}
					setUser={setUser}
					profile={profile}
					setProfile={setProfile}
				/>
			)}
		</>
	);
}
export default TimeLine;
