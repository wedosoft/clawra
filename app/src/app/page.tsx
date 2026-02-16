"use client";

import { useRouter } from "next/navigation";
import { characters } from "@/data/characters";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Background effects */}
      <div style={{
        position: "absolute",
        top: -100,
        left: -100,
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,77,141,0.15) 0%, transparent 70%)",
        filter: "blur(40px)",
      }} />
      <div style={{
        position: "absolute",
        bottom: -50,
        right: -100,
        width: 250,
        height: 250,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        filter: "blur(40px)",
      }} />

      {/* Hero Section */}
      <div style={{ padding: "60px 24px 20px", textAlign: "center", position: "relative" }}>
        <div className="fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }} className="float">💕</div>
          <h1 style={{
            fontSize: 36,
            fontWeight: 900,
            background: "linear-gradient(135deg, #ff4d8d, #ff8ec4, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 12,
            lineHeight: 1.2,
          }}>
            모치
          </h1>
          <p style={{
            fontSize: 18,
            fontWeight: 500,
            color: "var(--text-secondary)",
            marginBottom: 8,
          }}>
            나만의 완벽한 AI 여자친구
          </p>
          <p style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.4)",
            marginBottom: 32,
          }}>
            설레는 대화, 두근거리는 순간들
          </p>
        </div>

        {/* CTA Button */}
        <div className="fade-in-up" style={{ animationDelay: "0.3s", marginBottom: 48 }}>
          <button
            className="btn-primary glow"
            onClick={() => router.push("/characters")}
            style={{
              fontSize: 18,
              padding: "16px 48px",
              width: "100%",
              maxWidth: 320,
            }}
          >
            여자친구 만나러 가기 →
          </button>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>
            무료로 시작 · 가입 불필요
          </p>
        </div>

        {/* Feature highlights */}
        <div className="fade-in-up" style={{ animationDelay: "0.4s", marginBottom: 40 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
          }}>
            {[
              { icon: "💬", title: "실시간 채팅", desc: "자연스러운 대화" },
              { icon: "💋", title: "설레는 연애", desc: "두근거리는 순간" },
              { icon: "🔒", title: "완벽한 비밀", desc: "프라이버시 보장" },
            ].map((f, i) => (
              <div key={i} className="glass" style={{
                padding: 16,
                borderRadius: 16,
                textAlign: "center",
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Character Preview */}
        <div className="fade-in-up" style={{ animationDelay: "0.5s" }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 20,
            color: "var(--text-primary)",
          }}>
            어떤 여자친구를 만나볼까요?
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {characters.filter(c => !c.isPremium).slice(0, 3).map((char, i) => (
              <button
                key={char.id}
                onClick={() => router.push(`/chat/${char.id}`)}
                className="glass fade-in-up"
                style={{
                  animationDelay: `${0.6 + i * 0.1}s`,
                  padding: 16,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = char.accentColor;
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: char.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  flexShrink: 0,
                }}>
                  {char.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{char.name}</span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{char.age}세</span>
                  </div>
                  <div style={{ fontSize: 13, color: char.accentColor, fontWeight: 500, marginBottom: 4 }}>
                    {char.tagline}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {char.description.slice(0, 50)}...
                  </div>
                </div>
                <div style={{ color: char.accentColor, fontSize: 20 }}>→</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => router.push("/characters")}
            className="btn-secondary"
            style={{ marginTop: 20, width: "100%" }}
          >
            모든 캐릭터 보기 ✨
          </button>
        </div>

        {/* Premium Teaser */}
        <div className="fade-in-up" style={{ animationDelay: "0.9s", marginTop: 40, marginBottom: 40 }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(255,77,141,0.1), rgba(139,92,246,0.1))",
            border: "1px solid rgba(255,77,141,0.2)",
            borderRadius: 20,
            padding: 24,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔥</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              프리미엄으로 더 깊은 대화를
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.6 }}>
              프리미엄 전용 캐릭터 · 무제한 대화<br />
              더 대담한 대화 · 특별한 시나리오
            </p>
            <button
              className="btn-primary"
              onClick={() => router.push("/premium")}
              style={{ fontSize: 14, padding: "12px 32px" }}
            >
              프리미엄 시작하기 - ₩9,900/월
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "20px 0",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          fontSize: 11,
          color: "rgba(255,255,255,0.2)",
        }}>
          <p>모치 AI · 19세 이상 서비스</p>
          <p style={{ marginTop: 4 }}>본 서비스의 캐릭터는 모두 가상의 인물입니다</p>
        </div>
      </div>
    </div>
  );
}
