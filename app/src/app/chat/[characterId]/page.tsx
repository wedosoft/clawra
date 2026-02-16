"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { getCharacter } from "@/data/characters";
import { generateResponse, Message } from "@/lib/chat-engine";
import {
  getChatMessages,
  saveChatMessage,
  getMessageCount,
  isPremiumUser,
} from "@/lib/storage";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.characterId as string;
  const character = getCharacter(characterId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    if (!character) return;

    const savedMessages = getChatMessages(characterId);
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    } else {
      const greeting: Message = {
        id: "greeting",
        role: "assistant",
        content: character.greeting,
        timestamp: Date.now(),
      };
      setMessages([greeting]);
      saveChatMessage(characterId, greeting);
    }
  }, [characterId, character]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!mounted) return null;

  if (!character) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>캐릭터를 찾을 수 없습니다.</p>
        <button className="btn-primary" onClick={() => router.push("/characters")} style={{ marginTop: 20 }}>
          캐릭터 선택으로
        </button>
      </div>
    );
  }

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(36),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    saveChatMessage(characterId, userMsg);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    const delay = 800 + Math.random() * 1500;
    await new Promise(resolve => setTimeout(resolve, delay));

    const msgCount = getMessageCount(characterId);
    const premium = isPremiumUser();

    const result = generateResponse(text, character, {
      messages: [...messages, userMsg],
      messageCount: msgCount,
      isPremiumUser: premium,
    });

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(36),
      role: "assistant",
      content: result.response,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, assistantMsg]);
    saveChatMessage(characterId, assistantMsg);
    setIsTyping(false);

    if (result.shouldShowPaywall) {
      setShowPaywall(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const freeMessagesLeft = Math.max(0, 20 - getMessageCount(characterId));
  const premium = isPremiumUser();

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-primary)",
    }}>
      {/* Chat Header */}
      <div style={{
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(10,10,15,0.95)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <button
          onClick={() => router.push("/characters")}
          style={{ fontSize: 20, padding: 4 }}
        >
          ←
        </button>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: character.bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
        }}>
          {character.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{character.name}</div>
          <div style={{
            fontSize: 11,
            color: isTyping ? character.accentColor : "#4ade80",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}>
            {isTyping ? (
              <>
                <span style={{ animation: "typing 1s infinite" }}>입력 중</span>
                <span style={{ animation: "typing 1s infinite 0.2s" }}>.</span>
                <span style={{ animation: "typing 1s infinite 0.4s" }}>.</span>
                <span style={{ animation: "typing 1s infinite 0.6s" }}>.</span>
              </>
            ) : (
              <>
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#4ade80",
                  display: "inline-block",
                }} />
                온라인
              </>
            )}
          </div>
        </div>
        {!premium && (
          <div style={{
            fontSize: 11,
            color: freeMessagesLeft <= 5 ? "#ff4d8d" : "var(--text-secondary)",
            textAlign: "right",
          }}>
            <div style={{ fontWeight: 600 }}>{freeMessagesLeft}</div>
            <div>남은 메시지</div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
        {/* Date indicator */}
        <div style={{
          textAlign: "center",
          padding: "8px 0",
          marginBottom: 8,
        }}>
          <span style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.05)",
            padding: "4px 16px",
            borderRadius: 20,
          }}>
            오늘
          </span>
        </div>

        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className="fade-in-up"
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: 8,
              animationDelay: index === messages.length - 1 ? "0s" : "0s",
            }}
          >
            {msg.role === "assistant" && (
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: character.bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
                alignSelf: "flex-end",
              }}>
                {character.avatar}
              </div>
            )}
            <div style={{
              maxWidth: "75%",
              padding: "10px 14px",
              borderRadius: msg.role === "user"
                ? "18px 18px 4px 18px"
                : "18px 18px 18px 4px",
              background: msg.role === "user"
                ? "linear-gradient(135deg, #ff4d8d, #8b5cf6)"
                : "rgba(255,255,255,0.08)",
              color: "white",
              fontSize: 14,
              lineHeight: 1.6,
              wordBreak: "break-word",
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: character.bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}>
              {character.avatar}
            </div>
            <div style={{
              padding: "12px 18px",
              borderRadius: "18px 18px 18px 4px",
              background: "rgba(255,255,255,0.08)",
              display: "flex",
              gap: 4,
            }}>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: character.accentColor,
                    animation: `typing 1.4s infinite ${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Paywall Overlay */}
      {showPaywall && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(to top, rgba(10,10,15,0.98), rgba(10,10,15,0.9))",
          backdropFilter: "blur(20px)",
          padding: "32px 24px",
          borderRadius: "24px 24px 0 0",
          textAlign: "center",
          zIndex: 100,
          maxWidth: 480,
          margin: "0 auto",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💔</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
            {character.name}가 더 이야기하고 싶어해요
          </h3>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.6 }}>
            무료 메시지를 모두 사용했어요<br />
            프리미엄으로 무제한 대화를 즐겨보세요
          </p>
          <p style={{ fontSize: 13, color: character.accentColor, marginBottom: 20 }}>
            &ldquo;오빠... 가지 마... 더 얘기하고 싶어...&rdquo; 💕
          </p>
          <button
            className="btn-primary"
            onClick={() => router.push("/premium")}
            style={{ width: "100%", fontSize: 16, padding: "16px", marginBottom: 12 }}
          >
            프리미엄 구독하기 - ₩9,900/월
          </button>
          <button
            onClick={() => setShowPaywall(false)}
            style={{ fontSize: 13, color: "var(--text-secondary)", padding: 8 }}
          >
            나중에 할게
          </button>
        </div>
      )}

      {/* Input Area */}
      <div style={{
        padding: "12px 16px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(10,10,15,0.95)",
        backdropFilter: "blur(10px)",
      }}>
        {!premium && freeMessagesLeft <= 5 && freeMessagesLeft > 0 && (
          <div style={{
            textAlign: "center",
            fontSize: 11,
            color: "#ff4d8d",
            marginBottom: 8,
            animation: "pulse 2s infinite",
          }}>
            무료 메시지가 {freeMessagesLeft}개 남았어요! 프리미엄으로 무제한 대화하세요 💕
          </div>
        )}
        <div style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`${character.name}에게 메시지 보내기...`}
            disabled={showPaywall}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 24,
              padding: "12px 18px",
              fontSize: 14,
              color: "white",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = character.accentColor;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping || showPaywall}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: input.trim() && !isTyping
                ? "linear-gradient(135deg, #ff4d8d, #8b5cf6)"
                : "rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              transition: "all 0.3s",
              flexShrink: 0,
            }}
          >
            💌
          </button>
        </div>
      </div>
    </div>
  );
}
