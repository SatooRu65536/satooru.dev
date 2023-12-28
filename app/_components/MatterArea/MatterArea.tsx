"use client";

import {
  Bodies,
  Composite,
  Engine,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
} from "matter-js";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type WindowSize = {
  width: number;
  height: number;
};

export default function Main() {
  const scene = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  function handleResize() {
    setWindowSize({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    });
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    const { clientWidth, clientHeight } = document.body;

    const engine = Engine.create();
    const { world } = engine;

    const render = Render.create({
      element: scene.current!,
      engine: engine,
      options: {
        width: clientWidth,
        height: clientHeight,
        wireframes: false,
        showVelocity: true,
      },
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    Composite.add(world, [
      Bodies.rectangle(200, 100, 60, 60, { frictionAir: 0.001 }),
      Bodies.rectangle(400, 100, 60, 60, { frictionAir: 0.05 }),
      Bodies.rectangle(600, 100, 60, 60, { frictionAir: 0.1 }),

      Bodies.rectangle(clientWidth, -100, clientWidth * 2, 200, {
        isStatic: true,
      }),
      Bodies.rectangle(clientWidth, clientHeight + 80, clientWidth * 2, 200, {
        isStatic: true,
      }),
      Bodies.rectangle(-100, clientHeight, 200, clientHeight * 2, {
        isStatic: true,
      }),
      Bodies.rectangle(clientWidth + 100, clientHeight, 200, clientHeight * 2, {
        isStatic: true,
      }),
    ]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: clientWidth, y: clientHeight },
    });

    return () => {
      Render.stop(render);
      render.canvas.remove();
    };
  }, [windowSize]);

  return <div ref={scene} />;
}
