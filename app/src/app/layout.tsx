import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "모치 - AI 여자친구 | 나만의 완벽한 여자친구",
  description: "AI와 함께하는 달달한 연애 시뮬레이션. 다양한 매력의 여자친구와 설레는 대화를 나눠보세요.",
  keywords: ["AI 여자친구", "AI 채팅", "연애 시뮬레이션", "AI girlfriend"],
  openGraph: {
    title: "모치 - AI 여자친구",
    description: "나만의 완벽한 AI 여자친구와 설레는 대화를 시작하세요 💕",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💕</text></svg>" />
      </head>
      <body>
        <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", position: "relative" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
