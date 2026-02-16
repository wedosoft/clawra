"use client";

import { useRouter } from "next/navigation";
import { characters } from "@/data/characters";
import { isPremiumUser } from "@/lib/storage";
import { useState, useEffect } from "react";

export default function CharactersPage() {
  const router = useRouter();
  const [premium, setPremium] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPremium(isPremiumUser());
  }, []);

  if (!mounted) return null;

  const handleSelect = (charId: string, charIsPremium: boolean) => {
    if (charIsPremium && !premium) {
      router.push("/premium");
      return;
    }
    router.push(`/chat/${charId}`);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "20px 16px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 28,
        padding: "0 4px",
      }}>
        <button
          onClick={() => router.push("/")}
          style={{ fontSize: 24, marginRight: 12 }}
        >
          ←
        </button>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>여자친구 선택</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>마음에 드는 여자친구를 골라보세요</p>
        </div>
      </div>

      {/* Free Characters */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{
          fontSize: 14,
          fontWeight: 600,
          color: "var(--text-secondary)",
          marginBottom: 16,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}>
          무료 캐릭터
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {characters.filter(c => !c.isPremium).map((char, i) => (
            <button
              key={char.id}
              onClick={() => handleSelect(char.id, false)}
              className="glass fade-in-up"
              style={{
                animationDelay: `${i * 0.1}s`,
                padding: 20,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                gap: 16,
                textAlign: "left",
                width: "100%",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = char.accentColor;
                e.currentTarget.style.background = `rgba(${parseInt(char.accentColor.slice(1,3),16)}, ${parseInt(char.accentColor.slice(3,5),16)}, ${parseInt(char.accentColor.slice(5,7),16)}, 0.08)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
            >
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: char.bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                flexShrink: 0,
              }}>
                {char.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 17 }}>{char.name}</span>
                  <span style={{
                    fontSize: 11,
                    color: "var(--text-secondary)",
                    background: "rgba(255,255,255,0.08)",
                    padding: "2px 8px",
                    borderRadius: 8,
                  }}>
                    {char.age}세
                  </span>
                </div>
                <div style={{
                  fontSize: 14,
                  color: char.accentColor,
                  fontWeight: 600,
                  marginBottom: 6,
                }}>
                  {char.tagline}
                </div>
                <div style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}>
                  {char.description}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {char.traits.map(t => (
                    <span key={t} style={{
                      fontSize: 10,
                      padding: "3px 8px",
                      borderRadius: 10,
                      background: `${char.accentColor}20`,
                      color: char.accentColor,
                      fontWeight: 500,
                    }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Premium Characters */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}>
          <h2 style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}>
            프리미엄 캐릭터
          </h2>
          <span className="premium-badge">PREMIUM</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {characters.filter(c => c.isPremium).map((char, i) => (
            <button
              key={char.id}
              onClick={() => handleSelect(char.id, true)}
              className="glass fade-in-up"
              style={{
                animationDelay: `${0.3 + i * 0.1}s`,
                padding: 20,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                gap: 16,
                textAlign: "left",
                width: "100%",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = char.accentColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              {!premium && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "linear-gradient(135deg, #ffd700, #ffaa00)",
                  color: "#000",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: "0 0 0 12px",
                }}>
                  🔒 PREMIUM
                </div>
              )}

              <div style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: char.bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                flexShrink: 0,
                filter: premium ? "none" : "blur(1px)",
              }}>
                {char.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 17 }}>{char.name}</span>
                  <span style={{
                    fontSize: 11,
                    color: "var(--text-secondary)",
                    background: "rgba(255,255,255,0.08)",
                    padding: "2px 8px",
                    borderRadius: 8,
                  }}>
                    {char.age}세
                  </span>
                </div>
                <div style={{
                  fontSize: 14,
                  color: char.accentColor,
                  fontWeight: 600,
                  marginBottom: 6,
                }}>
                  {char.tagline}
                </div>
                <div style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}>
                  {char.description}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {char.traits.map(t => (
                    <span key={t} style={{
                      fontSize: 10,
                      padding: "3px 8px",
                      borderRadius: 10,
                      background: `${char.accentColor}20`,
                      color: char.accentColor,
                      fontWeight: 500,
                    }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Premium CTA */}
      {!premium && (
        <div style={{
          background: "linear-gradient(135deg, rgba(255,77,141,0.1), rgba(139,92,246,0.1))",
          border: "1px solid rgba(255,77,141,0.2)",
          borderRadius: 20,
          padding: 24,
          textAlign: "center",
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>✨</div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            프리미엄으로 모든 캐릭터 잠금 해제
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>
            무제한 대화 + 프리미엄 캐릭터 + 특별 시나리오
          </p>
          <button
            className="btn-primary"
            onClick={() => router.push("/premium")}
            style={{ fontSize: 14, padding: "12px 32px" }}
          >
            프리미엄 구독하기
          </button>
        </div>
      )}
    </div>
  );
}
