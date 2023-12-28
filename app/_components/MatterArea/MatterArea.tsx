"use client";

import {
  Bodies,
  Composite,
  Engine,
  Events,
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
      Bodies.rectangle(clientWidth * 0.3, clientHeight * 0.6, 60, 60, {
        frictionAir: 0.001,
      }),
      Bodies.rectangle(clientWidth * 0.5, clientHeight * 0.6, 60, 60, {
        frictionAir: 0.05,
      }),
      Bodies.rectangle(clientWidth * 0.7, clientHeight * 0.6, 60, 60, {
        frictionAir: 0.1,
      }),

      Bodies.rectangle(
        clientWidth * 0.5,
        clientHeight + 80,
        clientWidth * 0.8,
        200,
        {
          isStatic: true,
        }
      ),
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

    Events.on(mouseConstraint, "mousedown", (e) => {
      if (mouseConstraint.body) return;

      const composite = Composite.create();
      Composite.add(world, composite);
      const r = Math.random() * 100;

      if (r < 30) {
        const min = 20;
        const max = 40;
        const radius = Math.random() * (max - min) + min;
        const ball = Bodies.circle(
          e.mouse.position.x,
          e.mouse.position.y,
          radius,
          { restitution: 0.5 }
        );
        Composite.add(composite, ball);
      } else if (r < 60) {
        const min = 20;
        const max = 300;
        const width = Math.random() * (max - min) + min;
        const height = Math.random() * (max - min) + min;
        const rect = Bodies.rectangle(
          e.mouse.position.x,
          e.mouse.position.y,
          width,
          height,
          { restitution: 0.5 }
        );
        Composite.add(composite, rect);
      } else {
        const min = 10;
        const max = 40;
        const triangle = Bodies.polygon(
          e.mouse.position.x,
          e.mouse.position.y,
          3,
          Math.random() * (max - min) + min,
          { restitution: 0.5 }
        );
        Composite.add(composite, triangle);
      }
    });

    return () => {
      Render.stop(render);
      render.canvas.remove();
    };
  }, [windowSize]);

  return <div ref={scene} />;
}
