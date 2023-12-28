"use client";

import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
} from "matter-js";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import satooruDev from "./satooru-dev.svg";

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

    const sensor = Bodies.rectangle(
      clientWidth * 0.5,
      clientHeight * 0.5,
      clientWidth * 2,
      clientHeight * 2,
      {
        isSensor: true,
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
      }
    );
    const satooruDevRect = Bodies.rectangle(
      clientWidth * 0.5,
      clientHeight * 0.3,
      300,
      45,
      {
        friction: 0.0001,
        restitution: 0.01,
        render: {
          sprite: {
            texture: satooruDev.src,
          },
        },
      }
    );
    Composite.add(world, [
      sensor,
      satooruDevRect,
      Bodies.rectangle(clientWidth * 0.3, clientHeight * 0.6, 60, 60, {
        frictionAir: 0.001,
      }),
      Bodies.rectangle(clientWidth * 0.5, clientHeight * 0.6, 60, 60, {
        frictionAir: 0.05,
      }),
      Bodies.rectangle(clientWidth * 0.7, clientHeight * 0.6, 60, 60, {
        frictionAir: 0.01,
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
      if (mouseConstraint.body !== sensor) return;

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

    Events.on(engine, "collisionEnd", (e) => {
      e.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        if (bodyA !== sensor && bodyB !== sensor) return;
        if (bodyA === satooruDevRect || bodyB === satooruDevRect) {
          Body.setPosition(satooruDevRect, { x: clientWidth * 0.5, y: 0 });
          Body.setSpeed(satooruDevRect, 0);
        } else {
          const removeBody = bodyA !== sensor ? bodyB : bodyA;
          Composite.remove(world, removeBody);
        }
      });
    });

    return () => {
      Render.stop(render);
      render.canvas.remove();
    };
  }, [windowSize]);

  return <div ref={scene} />;
}
