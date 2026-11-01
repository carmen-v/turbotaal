"use client";

import { useEffect, useRef } from "react";
import Car from "@/components/Car";

const TRACK_WIDTH = 800;
const TRACK_HEIGHT = 500;

const CAR_WIDTH = 30;
const CAR_HEIGHT = (CAR_WIDTH * 100) / 60;

// Speeds are in pixels per second, the turn rate in radians per second.
const ACCELERATION = 400;
const BRAKE = 700;
const FRICTION = 250;
const MAX_SPEED = 380;
const MAX_REVERSE_SPEED = 140;
const TURN_RATE = 3;

// Uses event.code (the physical key), so WASD sits in the same place on
// every keyboard layout and works with Caps Lock on.
const CONTROLS = {
  gas: ["ArrowUp", "KeyW"],
  brake: ["ArrowDown", "KeyS"],
  left: ["ArrowLeft", "KeyA"],
  right: ["ArrowRight", "KeyD"],
};
const CONTROL_KEYS = Object.values(CONTROLS).flat();

export default function Game() {
  const carRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The angle is 0 when the car points up and grows clockwise.
    const car = { x: TRACK_WIDTH / 2, y: TRACK_HEIGHT - 80, angle: 0, speed: 0 };
    const pressed = new Set<string>();
    const isHeld = (control: keyof typeof CONTROLS) =>
      CONTROLS[control].some((code) => pressed.has(code));

    const onKeyDown = (event: KeyboardEvent) => {
      if (!CONTROL_KEYS.includes(event.code)) return;
      // Leave shortcuts like Cmd+S or Ctrl+A to the browser.
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      event.preventDefault(); // stop the arrow keys from scrolling the page
      pressed.add(event.code);
    };
    const onKeyUp = (event: KeyboardEvent) => pressed.delete(event.code);
    const onBlur = () => pressed.clear();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    let frame = 0;
    let lastTime = performance.now();

    const tick = (time: number) => {
      // Cap the time step so the car doesn't jump after the tab was hidden.
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const gas = isHeld("gas");
      const brake = isHeld("brake");

      if (gas) {
        car.speed += ACCELERATION * dt;
      } else if (brake) {
        car.speed -= (car.speed > 0 ? BRAKE : ACCELERATION) * dt;
      } else {
        const slowdown = FRICTION * dt;
        car.speed = Math.abs(car.speed) <= slowdown ? 0 : car.speed - Math.sign(car.speed) * slowdown;
      }
      car.speed = Math.max(-MAX_REVERSE_SPEED, Math.min(MAX_SPEED, car.speed));

      // Steering only works while moving, and flips when reversing like a real car.
      const steer = (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);
      const grip = Math.min(Math.abs(car.speed) / 120, 1) * Math.sign(car.speed);
      car.angle += steer * TURN_RATE * grip * dt;

      car.x += Math.sin(car.angle) * car.speed * dt;
      car.y -= Math.cos(car.angle) * car.speed * dt;

      // Stop at the edges of the track area.
      const margin = CAR_WIDTH / 2;
      const clampedX = Math.max(margin, Math.min(TRACK_WIDTH - margin, car.x));
      const clampedY = Math.max(margin, Math.min(TRACK_HEIGHT - margin, car.y));
      if (clampedX !== car.x || clampedY !== car.y) {
        car.x = clampedX;
        car.y = clampedY;
        car.speed = 0;
      }

      if (carRef.current) {
        carRef.current.style.transform =
          `translate(${car.x - CAR_WIDTH / 2}px, ${car.y - CAR_HEIGHT / 2}px) rotate(${car.angle}rad)`;
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="max-w-full overflow-x-auto">
        <div
          className="relative overflow-hidden rounded-xl border-4 border-zinc-800 bg-zinc-600"
          style={{ width: TRACK_WIDTH, height: TRACK_HEIGHT }}
        >
          <div
            ref={carRef}
            className="absolute top-0 left-0 origin-center"
            style={{
              width: CAR_WIDTH,
              height: CAR_HEIGHT,
              transform: `translate(${TRACK_WIDTH / 2 - CAR_WIDTH / 2}px, ${TRACK_HEIGHT - 80 - CAR_HEIGHT / 2}px)`,
            }}
          >
            <Car width={CAR_WIDTH} className="block" />
          </div>
        </div>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        ↑ / W gas · ↓ / S brake / reverse · ← → / A D steer
      </p>
    </div>
  );
}
