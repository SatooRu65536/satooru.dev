import { css } from "@/styled-system/css";

export default function Header() {
  return (
    <header
      className={css({
        height: "60px",
        padding: "0 1rem",
        backgroundColor: "primary.300",
      })}
    >
      <h1
        className={css({
          color: "secoundary.100",
          lineHeight: "60px",
          fontSize: "1.5rem",
          fontWeight: "bold",
        })}
      >
        SatooRu&apos;s Products
      </h1>
    </header>
  );
}
