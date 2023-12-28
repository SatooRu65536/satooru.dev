import { css } from "@/styled-system/css";

export default function Header() {
  return (
    <header
      className={css({
        height: "60px",
        backgroundColor: "primary.300",
      })}
    >
      <h1
        className={css({
          color: "secoundary.100",
          fontSize: "1.5rem",
          fontWeight: "bold",
        })}
      >
        SatooRu&apos;s Products
      </h1>
    </header>
  );
}
