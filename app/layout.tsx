import { css } from "@/styled-system/css";
import type { Metadata } from "next";
import { M_PLUS_1 } from "next/font/google";
import "./global.css";

const mplus = M_PLUS_1({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SatooRu Developments",
  description: "SatooRu Developments is Satooru's Products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={css({
          fontSize: mplus.style.fontFamily,
        })}
      >
        {children}
      </body>
    </html>
  );
}
