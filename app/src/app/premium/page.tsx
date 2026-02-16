"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { isPremiumUser, setPremium } from "@/lib/storage";

export default function PremiumPage() {
  const router = useRouter();
  const [alreadyPremium, setAlreadyPremium] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAlreadyPremium(isPremiumUser());
  }, []);

  if (!mounted) return null;

  const handlePurchase = () => {
    // Demo: activate premium immediately
    // In production, integrate with payment gateway (Toss Payments, etc.)
    setPremium(true);
    setShowSuccess(true);
    setAlreadyPremium(true);
  };

  if (showSuccess) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
      }}>
        <div className="fade-in-up" style={{ fontSize: 80, marginBottom: 24 }}>🎉</div>
        <h1 className="fade-in-up" style={{
          fontSize: 28,
          fontWeight: 800,
          marginBottom: 12,
          animationDelay: "0.2s",
          background: "linear-gradient(135deg, #ff4d8d, #ffd700)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          프리미엄 활성화 완료!
        </h1>
        <p className="fade-in-up" style={{
          fontSize: 15,
          color: "var(--text-secondary)",
          marginBottom: 32,
          animationDelay: "0.3s",
          lineHeight: 1.6,
        }}>
          이제 모든 캐릭터와 무제한으로<br />
          대화할 수 있어요 💕
        </p>
        <button
          className="btn-primary fade-in-up"
          onClick={() => router.push("/characters")}
          style={{ animationDelay: "0.4s", fontSize: 16, padding: "14px 40px" }}
        >
          여자친구 만나러 가기 💋
        </button>
      </div>
    );
  }

  if (alreadyPremium) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>👑</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
          이미 프리미엄 회원이에요!
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
          모든 기능을 자유롭게 이용하세요
        </p>
        <button
          className="btn-primary"
          onClick={() => router.push("/characters")}
          style={{ fontSize: 14, padding: "12px 32px" }}
        >
          대화하러 가기
        </button>
      </div>
    );
  }

  const plans = {
    monthly: { price: "₩9,900", period: "/월", daily: "하루 ₩330", save: "" },
    yearly: { price: "₩79,900", period: "/년", daily: "하루 ₩219", save: "33% 할인" },
  };

  return (
    <div style={{ minHeight: "100vh", padding: "20px 16px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 24,
      }}>
        <button onClick={() => router.back()} style={{ fontSize: 24, marginRight: 12 }}>←</button>
        <h1 style={{ fontSize: 20, fontWeight: 800 }}>프리미엄</h1>
      </div>

      {/* Hero */}
      <div className="fade-in-up" style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>💎</div>
        <h2 style={{
          fontSize: 26,
          fontWeight: 900,
          marginBottom: 8,
          background: "linear-gradient(135deg, #ff4d8d, #ffd700)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          모치 프리미엄
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          더 깊고 대담한 대화를 원한다면
        </p>
      </div>

      {/* Benefits */}
      <div className="fade-in-up" style={{
        animationDelay: "0.2s",
        marginBottom: 32,
      }}>
        {[
          { icon: "💬", title: "무제한 메시지", desc: "제한 없이 원하는 만큼 대화하세요" },
          { icon: "🔓", title: "프리미엄 캐릭터", desc: "하나, 리카 등 특별한 캐릭터 잠금 해제" },
          { icon: "🔥", title: "더 대담한 대화", desc: "프리미엄에서만 가능한 깊은 대화" },
          { icon: "⚡", title: "빠른 응답", desc: "우선 처리로 더 빠른 답장" },
          { icon: "🎭", title: "특별 시나리오", desc: "특별한 상황극과 롤플레이" },
          { icon: "💝", title: "독점 이벤트", desc: "프리미엄 전용 특별 이벤트" },
        ].map((benefit, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 0",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ fontSize: 24, width: 36, textAlign: "center" }}>{benefit.icon}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{benefit.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{benefit.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Selection */}
      <div className="fade-in-up" style={{ animationDelay: "0.3s", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setSelectedPlan("monthly")}
            style={{
              flex: 1,
              padding: 20,
              borderRadius: 16,
              border: `2px solid ${selectedPlan === "monthly" ? "#ff4d8d" : "rgba(255,255,255,0.1)"}`,
              background: selectedPlan === "monthly" ? "rgba(255,77,141,0.08)" : "transparent",
              textAlign: "center",
              transition: "all 0.3s",
            }}
          >
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>월간</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{plans.monthly.price}</div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
              {plans.monthly.daily}
            </div>
          </button>

          <button
            onClick={() => setSelectedPlan("yearly")}
            style={{
              flex: 1,
              padding: 20,
              borderRadius: 16,
              border: `2px solid ${selectedPlan === "yearly" ? "#8b5cf6" : "rgba(255,255,255,0.1)"}`,
              background: selectedPlan === "yearly" ? "rgba(139,92,246,0.08)" : "transparent",
              textAlign: "center",
              transition: "all 0.3s",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "linear-gradient(135deg, #ffd700, #ffaa00)",
              color: "#000",
              fontSize: 9,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "0 0 0 10px",
            }}>
              BEST
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>연간</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{plans.yearly.price}</div>
            <div style={{ fontSize: 11, color: "#ffd700", marginTop: 4, fontWeight: 600 }}>
              {plans.yearly.save} · {plans.yearly.daily}
            </div>
          </button>
        </div>
      </div>

      {/* Purchase Button */}
      <div className="fade-in-up" style={{ animationDelay: "0.4s", marginBottom: 16 }}>
        <button
          className="btn-primary glow"
          onClick={handlePurchase}
          style={{
            width: "100%",
            fontSize: 17,
            padding: "16px",
            fontWeight: 800,
          }}
        >
          {selectedPlan === "monthly" ? "₩9,900/월" : "₩79,900/년"} 으로 시작하기
        </button>
      </div>

      {/* Trust signals */}
      <div style={{
        textAlign: "center",
        fontSize: 11,
        color: "rgba(255,255,255,0.3)",
        marginBottom: 40,
        lineHeight: 1.8,
      }}>
        <p>🔒 안전한 결제 · 언제든 해지 가능</p>
        <p>구독은 자동 갱신되며 언제든 취소할 수 있습니다</p>
      </div>

      {/* Testimonials */}
      <div className="fade-in-up" style={{ animationDelay: "0.5s", marginBottom: 40 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, textAlign: "center" }}>
          프리미엄 후기 💬
        </h3>
        {[
          { text: "유나랑 진짜 연애하는 기분이에요... 프리미엄 안 하면 후회합니다", rating: "⭐⭐⭐⭐⭐" },
          { text: "하나 언니 진짜 대박... 프리미엄 전용 대화가 차원이 다름", rating: "⭐⭐⭐⭐⭐" },
          { text: "매일 밤 리카랑 대화하는 게 하루의 힐링이에요", rating: "⭐⭐⭐⭐⭐" },
        ].map((review, i) => (
          <div key={i} className="glass" style={{
            padding: 16,
            borderRadius: 12,
            marginBottom: 8,
          }}>
            <div style={{ fontSize: 12, marginBottom: 4 }}>{review.rating}</div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              &ldquo;{review.text}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
