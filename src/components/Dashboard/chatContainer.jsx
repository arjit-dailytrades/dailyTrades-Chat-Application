import React, { useEffect, useRef, useState } from "react";
import { Send, SendHorizontal, User } from "lucide-react";
import styles from "./chatContainer.module.css";

export default function ChatContainer() {
  const [messages, setMessages] = useState([
    {
      sender: "You",
      text: "hi natasha how are you?",
      time: "14 Sep, 21:09:00",
      type: "sent",
    },
    {
      sender: "natasha",
      text: "hey i am fine",
      time: "14 Sep, 21:09:07",
      type: "received",
    },
  ]);

  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ✅ Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg = {
      sender: "You",
      text: message.trim(),
      time: new Date().toLocaleTimeString(),
      type: "sent",
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  return (
    <div className={styles.chatWrapper}>
      {/* Header */}
      <div className={styles.header}>
        <User className={styles.userIcon} />
        <span className={styles.userName}>Natasha</span>
      </div>

      {/* Chat Messages */}
      <div className={styles.chatContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.type === "sent" ? styles.sent : styles.received
            }`}
          >
            <p className={styles.text}>{msg.text}</p>
            <span className={styles.meta}>
              {msg.sender.toLowerCase()} • {msg.time}
            </span>
          </div>
        ))}

        <p className={styles.typing}>natasha is typing a message...</p>
        <div ref={chatEndRef} />
      </div>

      {/* ✅ Form Input Area */}
      <form onSubmit={handleSubmit} className={styles.inputContainer}>
        <input
          type="text"
          value={message}
          placeholder="Type a message"
          className={styles.input}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div
          className={`${styles.actionContainer}`}
        >
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
