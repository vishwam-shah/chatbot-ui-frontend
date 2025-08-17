
"use client";
import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Message } from "@/types";
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Page() {
  // Check JWT expiration and redirect to login if expired
  useEffect(() => {
    const checkJwt = () => {
      const token = window.sessionStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      try {
  const decoded: { exp: number } = jwtDecode(token);
        // exp is in seconds, Date.now() is in ms
        if (decoded.exp * 1000 < Date.now()) {
          window.sessionStorage.removeItem("token");
          window.location.href = "/login";
        }
      } catch {
        window.sessionStorage.removeItem("token");
        window.location.href = "/login";
      }
    };
    checkJwt();
    const interval = setInterval(checkJwt, 5000); // check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize with assistant message
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi there! I'm Chatbot UI, an AI assistant. I can help you with things like answering questions, providing information, and helping with tasks. How can I help you?",
      },
    ]);
  }, []);

  // Send user message to API and stream response
  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) return;

    setLoading(false);
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let isFirst = true;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      if (isFirst) {
        isFirst = false;
        setMessages((messages) => [
          ...messages,
          { role: "assistant", content: chunkValue },
        ]);
      } else {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          return [
            ...messages.slice(0, -1),
            { ...lastMessage, content: lastMessage.content + chunkValue },
          ];
        });
      }
    }
  };

  // Reset chat to initial assistant message
  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi there! I'm Chatbot UI, an AI assistant. I can help you with things like answering questions, providing information, and helping with tasks. How can I help you?",
      },
    ]);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
        <section className="max-w-[800px] mx-auto mt-4 sm:mt-12">
          <Chat
            messages={messages}
            loading={loading}
            onSend={handleSend}
            onReset={handleReset}
          />
          <div ref={messagesEndRef} />
        </section>
      </main>
      <Footer />
    </>
  );
}
