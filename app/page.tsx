import { css } from "@/styled-system/css";
import MatterArea from "./_components/MatterArea/MatterArea";

export default function Page() {
  return (
    <main
      className={css({
        height: "100vh",
        width: "100vw",
        backgroundColor: "primary.300",
      })}
    >
      <h1
        className={css({
          color: "white",
          fontSize: "4rem",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        })}
      >
        satooru.dev
      </h1>
      <MatterArea />
    </main>
  );
}
