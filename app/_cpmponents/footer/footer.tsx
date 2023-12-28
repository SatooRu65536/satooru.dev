import { css } from "@/styled-system/css";

export default function Footer() {
  return (
    <footer
      className={css({
        height: "30px",
        padding: "0 1rem",
        backgroundColor: "primary.200",
      })}
    >
      <p
        className={css({
          textAlign: "center",
          lineHeight: "30px",
        })}
      >
        SatooRu © 2023 Copyright.
      </p>
    </footer>
  );
}
