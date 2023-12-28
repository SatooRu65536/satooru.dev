import { css } from "@/styled-system/css";
import MatterArea from "./_components/MatterArea/MatterArea";

export default function Page() {
  return (
    <main
      className={css({
        height: "100svh",
        width: "100vw",
        backgroundColor: "rgb(20, 21, 31)",
      })}
    >
      <MatterArea />
    </main>
  );
}
