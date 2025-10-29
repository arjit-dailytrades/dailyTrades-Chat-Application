import React, { useEffect, useRef, useState } from "react";
import { Send, SendHorizontal, User } from "lucide-react";
import styles from "./chatContainer.module.css";
import { io } from "socket.io-client";
import moment from "moment";
import messageToneFile from "../assets/message-tone.mp3";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("Arjit");
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [clientsTotal, setClientsTotal] = useState(0);

  const messageContainerRef = useRef(null);
  const messageTone = useRef(new Audio(messageToneFile));

  // Initialize socket
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("clients-total", (data) => setClientsTotal(data));

    newSocket.on("chat-message", (data) => {
      messageTone.current.play();
      setMessages((prev) => [...prev, { ...data, isOwn: false }]);
    });

    newSocket.on("feedback", (data) => setFeedback(data.feedback));

    return () => newSocket.disconnect();
  }, []);

  // Auto scroll on new messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages, feedback]);

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const data = {
      name,
      message,
      dateTime: new Date(),
    };

    socket.emit("message", data);

    setMessages((prev) => [...prev, { ...data, isOwn: true }]);
    setMessage("");
  };

  const handleTyping = () => {
    socket.emit("feedback", {
      feedback: `${name} is typing a message...`,
    });
  };

  const handleBlur = () => {
    socket.emit("feedback", { feedback: "" });
  };

  return (
    <div className={styles.chatWrapper}>
      {/* Header */}

      <div className={styles.header}>
        <div className={styles.userName}>
          <User className={styles.userIcon} />
          <span className={styles.userName}>
            {" "}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.nameInput}
              maxLength="20"
            />
          </span>
        </div>
        <div className={styles.clientsCount}>
          <p>Client: {clientsTotal}</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className={styles.chatContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.isOwn ? styles.sent : styles.received
            }`}
          >
            <p className={styles.text}>{msg.message}</p>
            <span className={styles.meta}>
              {msg.isOwn ? "You" : msg.name} • {moment(msg.dateTime).fromNow()}
            </span>
          </div>
        ))}

        <p className={styles.typing}>{feedback}</p>
      </div>

      {/* Form Input Area */}
      <form onSubmit={sendMessage} className={styles.inputContainer}>
        <input
          type="text"
          value={message}
          placeholder="Type a message"
          className={styles.input}
          onFocus={handleTyping}
          onBlur={handleBlur}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
        />
        <div className={`${styles.actionContainer}`}>
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!message.trim()}
            style={{
              cursor: !message.trim() ? "not-allowed" : "pointer",
              backgroundColor: message.toString() ? "#0F8CE9" : "",
              color: message.toString() ? "#fff" : "",
            }}
          >
            <span>Send</span>
            {!message ? <Send size={14} /> : <SendHorizontal size={14} />}
          </button>
        </div>
      </form>
    </div>
  );
}
