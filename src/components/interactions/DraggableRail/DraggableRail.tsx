"use client";

import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { gsap } from "@/lib/gsap";
import styles from "./DraggableRail.module.scss";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function DraggableRail({ children, className = "" }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });
  const momentumRef = useRef<gsap.core.Tween | null>(null);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || event.pointerType === "mouse" && event.button !== 0) return;

    momentumRef.current?.kill();
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startScroll: rail.scrollLeft,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
    };

    rail.setPointerCapture(event.pointerId);
    rail.dataset.dragging = "true";
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active) return;

    const now = performance.now();
    const dt = Math.max(16, now - drag.lastTime);
    const dx = event.clientX - drag.lastX;

    rail.scrollLeft = drag.startScroll - (event.clientX - drag.startX);
    drag.velocity = dx / dt;
    drag.lastX = event.clientX;
    drag.lastTime = now;
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active) return;

    drag.active = false;
    rail.dataset.dragging = "false";

    if (rail.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }

    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const target = Math.max(0, Math.min(maxScroll, rail.scrollLeft - drag.velocity * 520));
    const proxy = { value: rail.scrollLeft };

    momentumRef.current = gsap.to(proxy, {
      value: target,
      duration: 0.9,
      ease: "power4.out",
      onUpdate: () => {
        rail.scrollLeft = proxy.value;
      },
    });
  };

  return (
    <div
      ref={railRef}
      className={`${styles.rail} ${className}`.trim()}
      data-cursor="drag"
      data-cursor-label="DRAG"
      data-dragging="false"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onPointerLeave={(event) => {
        if (dragRef.current.active) finishDrag(event);
      }}
    >
      {children}
    </div>
  );
}
