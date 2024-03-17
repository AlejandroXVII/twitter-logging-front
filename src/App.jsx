import LogoutButton from "./components/LogoutButton";
import "./styles/message-box.css";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import API_URL from "./assets/api-url";

const App = () => {
	const messageDefault = {
		messages: [{ _id: 0, text: "There is not message", sender_id: 0 }],
	};
	const [users, setUsers] = useState([]);
	const [messages, setMessages] = useState(messageDefault);
	const [thisUser, setThisUser] = useState([]);
	const [otherUser, setOtherUser] = useState(null);
	const cookies = new Cookies(null, { path: "/" });
	const navigate = useNavigate();

	async function fetchUsers() {
		// Default options are marked with *
		const response = await fetch(API_URL + "/users", {
			method: "GET",
		});
		const allUser = await response.json();
		const userID = cookies.get("userID");
		setUsers(allUser);
		setThisUser(allUser.find((user) => user._id === userID));
	}
	async function fetchMessages(e, text = "no text") {
		// Default options are marked with *
		const targetID = e.target.parentNode.id || e.target.id;
		let chat = thisUser.chats.find((chat) => chat.user_id === targetID);
		const otherUserData = users.find((user) => user._id === targetID);
		setOtherUser(otherUserData);
		if (chat === undefined) {
			fetchUsers();
			chat = thisUser.chats.find((chat) => chat.user_id === targetID);
			setMessages(null);
			setMessages({
				messages: [{ _id: 0, text: text, sender_id: thisUser._id }],
			});
			console.log("it should work now");
		}
		try {
			const response = await fetch(API_URL + "/chats/" + chat.chat_id, {
				method: "GET",
			});
			const allMessage = await response.json();
			setMessages(allMessage);
		} catch (error) {
			if (text === "no text") setMessages(messageDefault);
		}
	}
	async function verifyToken(token) {
		try {
			await fetch(API_URL + "/token/" + token, {
				method: "GET",
			});
		} catch (error) {
			navigate("/log-in");
		}
	}
	useLayoutEffect(() => {
		const token = cookies.get("token");
		console.log(token === undefined);
		if (token === undefined) {
			navigate("/log-in");
		} else {
			verifyToken(token);
			fetchUsers();
		}
	}, []);
	return (
		<div className="container">
			<div className="message-box">
				<Sidebar
					users={users}
					thisUser={thisUser}
					otherUser={otherUser}
					fetchMessages={fetchMessages}
				/>
				{otherUser !== null ? (
					<Text
						messages={messages}
						otherUser={otherUser}
						thisUser={thisUser}
						fetchMessages={fetchMessages}
					/>
				) : (
					<div className="no-chat">
						<h1>Select a chat</h1>
					</div>
				)}
			</div>
		</div>
	);
};

const Header = (prop) => {
	return (
		<div className="header bar">
			<div className="icon">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<title>account-circle</title>
					<path d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" />
				</svg>
			</div>
			<h1>{prop.thisUser.username}</h1>
			<LogoutButton />
		</div>
	);
};

const Sidebar = (prop) => {
	return (
		<div className="sidebar">
			<Header users={prop.users} thisUser={prop.thisUser} />
			<div className="all-user-container">
				{prop.users.map((user) =>
					user._id !== prop.thisUser._id ? (
						<div
							key={user._id}
							id={user._id}
							className="user-container"
							onClick={prop.fetchMessages}
						>
							<div className="icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
								>
									<title>account-circle</title>
									<path d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" />
								</svg>
							</div>
							<p>{user.username}</p>
						</div>
					) : null
				)}
			</div>
		</div>
	);
};

const Text = (prop) => {
	const messagesRef = useRef(null);
	useEffect(() => {
		messagesRef.current.scrollTo(0, document.body.scrollHeight);
	}, [prop.messages]);

	return (
		<div className="text-box">
			<div className="bar">
				<h1>
					{prop.otherUser !== null ? prop.otherUser.username : null}
				</h1>
			</div>
			<div className="messages" ref={messagesRef}>
				<div className="all-message-container">
					{prop.messages !== null
						? prop.messages.messages.map((message) => (
								<div
									key={message._id}
									className={
										message.sender_id === prop.thisUser._id
											? "message-container"
											: message.sender_id !== 0
											? "message-container received"
											: "default message-container"
									}
								>
									<p>{message.text}</p>
								</div>
						  ))
						: null}
				</div>
			</div>
			<SendBar
				otherUser={prop.otherUser}
				thisUser={prop.thisUser}
				fetchMessages={prop.fetchMessages}
			/>
		</div>
	);
};

const SendBar = (prop) => {
	const inputRef = useRef(null);
	async function sendMessage() {
		// Default options are marked with *
		if (inputRef.current.value === "") return;
		const messageText = inputRef.current.value;
		inputRef.current.value = "";
		await fetch(API_URL + "/chats/", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				from_user_id: prop.thisUser._id,
				to_user_id: prop.otherUser._id,
				text: messageText,
			}),
		});
		prop.fetchMessages(
			{
				target: { parentNode: { id: prop.otherUser._id } },
			},
			messageText
		);
	}
	return (
		<div className="send-messages bar">
			<input type="text" ref={inputRef} />
			<button className="icon icon-button" onClick={() => sendMessage()}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<title>send-circle</title>
					<path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M8,7.71V11.05L15.14,12L8,12.95V16.29L18,12L8,7.71Z" />
				</svg>
			</button>
		</div>
	);
};

export default App;
