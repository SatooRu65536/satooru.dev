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
import satooruMe from "./satooru-me.svg";
import blogSatooruMe from "./blog-satooru-me.svg";
import { css } from "@/styled-system/css";

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

  function openLink(url: string) {
    window.open(url, "_blank");
  }

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

    const runner = Runner.create();
    Render.run(render);
    Runner.run(runner, engine);

    const mouse = Mouse.create(render.canvas);
    render.mouse = mouse;
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

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
            xScale: 1,
            yScale: 1,
          },
        },
      }
    );
    const satooruMeRect = Bodies.rectangle(
      clientWidth * 0.2,
      clientHeight * 0.1,
      180,
      22,
      {
        friction: 0.0001,
        restitution: 0.01,
        render: {
          sprite: {
            texture: satooruMe.src,
            xScale: 0.6,
            yScale: 0.6,
          },
        },
      }
    );
    const blogSatooruMeRect = Bodies.rectangle(
      clientWidth * 0.8,
      clientHeight * 0.1,
      180,
      22,
      {
        friction: 0.0001,
        restitution: 0.01,
        render: {
          sprite: {
            texture: blogSatooruMe.src,
            xScale: 0.6,
            yScale: 0.6,
          },
        },
      }
    );
    Composite.add(world, [
      sensor,
      Bodies.rectangle(clientWidth * 0.2, clientHeight * 0.6, 60, 60, {
        frictionAir: 0.001,
      }),
      Bodies.rectangle(clientWidth * 0.5, clientHeight * 0.6, 60, 60, {
        frictionAir: 0.05,
      }),
      Bodies.rectangle(clientWidth * 0.8, clientHeight * 0.6, 60, 60, {
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
      satooruDevRect,
      satooruMeRect,
      blogSatooruMeRect,
      mouseConstraint,
    ]);

    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: clientWidth, y: clientHeight },
    });

    let mouseDownTime = 0;
    let lastClickBody: Body | null = null;

    Events.on(mouseConstraint, "mousedown", (e) => {
      mouseDownTime = Date.now();
      lastClickBody = mouseConstraint.body;

      if (mouseConstraint.body !== sensor) {
        console.log("sensor");
        return;
      }
      console.log("other");

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

    Events.on(mouseConstraint, "mouseup", () => {
      if (Date.now() - mouseDownTime > 100) return;

      if (lastClickBody === satooruMeRect) {
        openLink("https://satooru.me");
      } else if (lastClickBody === blogSatooruMeRect) {
        openLink("https://blog.satooru.me");
      }
    });

    Events.on(engine, "collisionEnd", (e) => {
      e.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const notRemoveBodies = [
          satooruDevRect,
          satooruMeRect,
          blogSatooruMeRect,
        ];

        if (bodyA !== sensor && bodyB !== sensor) return;
        if (
          notRemoveBodies.includes(bodyA) ||
          notRemoveBodies.includes(bodyB)
        ) {
          const body = bodyA !== sensor ? bodyA : bodyB;
          Body.setPosition(body, { x: clientWidth * 0.5, y: 0 });
          Body.setSpeed(body, 0);
        }
      });
    });

    return () => {
      Render.stop(render);
      render.canvas.remove();
    };
  }, [windowSize]);

  return (
    <div
      ref={scene}
      className={css({
        width: "100%",
        height: "100%",
      })}
    />
  );
}
