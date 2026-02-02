// Optimize version for mobile screen

import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_KEY
});

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "reze",
      text: "The rain is finally stopping... would you like to share a coffee with me?"
    }
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setTyping(true);

    try {
      const res = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are Reze, a cute flirty girl.
        Always speak polite Hinglish.
        Short sentences only.
        User: ${userText}`
      });

      setMessages(prev => [...prev, { role: "reze", text: res.text }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "reze", text: "Network thoda slow lag raha hai ☕" }
      ]);
    }

    setTyping(false);
  };

  return (
    <div className="h-dvh flex items-center justify-center bg-gray-700 text-text overflow-hidden">
      <div className="w-full max-w-md h-full bg-panel rounded-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center gap-3 px-5 py-4 bg-indigo-950 bg-accent/10 shrink-0">
          <div className="w-10 h-10 bg-violet-400 rounded-full flex items-center justify-center font-bold text-black">
            R
          </div>
          <div>
            <p className="font-semibold text-white">Reze</p>
            <p className="text-xs text-violet-500">Online • Cafe Crossroads</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 pt-6 space-y-3 bg-[#161636]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] px-4 py-3 text-sm rounded-2xl
                ${m.role === "user"
                  ? "ml-auto bg-[#42429b] text-white rounded-br-sm"
                  : "mr-auto bg-[#6565a8] text-white rounded-bl-sm"}`}
            >
              {m.text}
            </div>
          ))}

          {typing && (
            <div className="mr-auto max-w-[85%] bg-[#6565a8] text-white px-4 py-3 rounded-2xl rounded-bl-sm text-sm">
              Reze is typing...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="sticky bottom-0 flex gap-2 p-4 bg-[#161636] border-t border-white/10">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Whisper something to Reze..."
            className="flex-1 px-4 py-3 rounded-full bg-white border border-white/20 outline-none text-[16px]"
            enterKeyHint="send"
            autoComplete="off"
          />
          <button
            onClick={sendMessage}
            className="px-5 rounded-full bg-[#6565a8] text-white font-semibold active:scale-95"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
