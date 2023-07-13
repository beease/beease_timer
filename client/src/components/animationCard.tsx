import { useRef, useState, useEffect } from "react";
import { randomValue, wait } from "../utils/function";

// Type Definitions
type Props = {
  isStarted: boolean;
  color: null | string;
};
type Point = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: {
    r: number;
    g: number;
    b: number;
  };
};
type Particles = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  direction: number;
};
type Navette = {
  x: number;
  y: number;
  direction: number;
};
type Speed = {
  x: number;
  y: number;
  direction: number;
};

// Constants
const NUM_STARS = 50;
const NUM_SPEEDS = 5;
const MAX_STAR_SIZE = 1;
const MIN_STAR_SIZE = 0.5;
const CANVA_SIZE = { width: 465, height: 96 };
const PIXELS_TO_MOVE = 5;
const PARALLAX_AMOUNT = 3;
const NAVETTE_BASE_POSITION = { x: 170, y: 50, direction: 0 };

export const AnimationCard = ({ isStarted, color }: Props) => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" id="Calque_2" viewBox="0 0 128 128">
  <path fill="#fff" d="M47.56,94.58l15.28-14.78h-20.61l-3.01,17.43,.67,.03c1.47,.02,5.11-.21,7.67-2.68Z"/>
  <path fill="#fff" d="M33.79,59.97l8.21,10.86h43.83l4.55-6.32h23.87l.13-.76-16.53-12.1s-3.57-2.59-18.73-2.59-67.17,.42-67.17,.42v6.2l.1,4.29h21.75Z"/>
  <path fill="${
    color || "#4969fb"
  }" d="M118.04,57.06l-3.79,7.45h-23.87l-4.55,6.32H42l-8.21-10.86H12.04l-.1-4.29-4.53-.83,.3,12.58,4.15-.93-.17,13.31H62.84l-15.28,14.78c-2.57,2.47-6.2,2.7-7.67,2.68-.41,0-.67-.03-.67-.03l-1.26,6.44,5.56,.25c2.65,0,5.43-2.4,5.43-2.4l23.59-21.72h42.35s12.38-.13,12.38-10.36-9.22-12.38-9.22-12.38Z"/>
  <polygon fill="#fff" points="7.41 54.83 1.71 53.78 1.71 68.93 7.71 67.58 7.71 67.42 7.41 54.84 7.41 54.83"/>
  <rect fill="#b0d4ff" x="44.28" y="57.53" width="17.81" height="4.8"/>
  <rect fill="#b0d4ff" x="66.76" y="57.53" width="17.81" height="4.8"/>
  <path fill="#e5e5e5" d="M87.98,44.81l-56.33-.09-3.41-3.82-9.98-12.88s-3.03-3.03-7.33-2.91c-4.29,.13-5.94,.25-5.94,.25l5.56,15.16,1.39,4.17v4.94s51.91-.38,67.07-.38c9.5,0,16.28,1.59,19.08,2.41l.4-4.9c-5.8-1.81-10.52-1.94-10.52-1.94Z"/><polygon class="cls-3" points="114.25 64.52 114.01 64.52 114.38 64.72 118.04 57.06 118.04 57.06 114.25 64.52"/>
  <polygon fill="#e5e5e5" points="114 64.52 114.01 64.52 114.25 64.52 114 64.52"/>
<path fill="#b0d4ff" d="M118.04,57.06l-12-7.07c-2.53-1.45-5.13-2.49-7.54-3.24l-1.66,8.68-.95,3.84,18.12,5.24h0s.82,.1,.82,.1l3.22-7.55Z"/></svg>`;
  // State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const velocityRef = useRef<number>(0);
  const isMovingRef = useRef(false);
  const speedTransitionRef = useRef<number | null>(null);
  const animationFrameId = useRef(0);

  const [isAnimating, setIsAnimating] = useState(false);
  const [savePoints, setSavePoints] = useState<Point[]>([]);
  const [saveParticles, setSaveParticles] = useState<Particles[]>([]);
  const [saveSpeeds, setSaveSpeeds] = useState<Speed[]>([]);
  const [navettePosition, setNavettePosition] = useState<Navette>({
    x: 100,
    y: 50,
    direction: 0,
  });

  const frameCounter = useRef(randomValue(0, 1000));
  const canvas = canvasRef.current;
  const context = canvasRef?.current?.getContext("2d");

  const img = new Image();
  img.src = "data:image/svg+xml," + encodeURIComponent(svgString);

  let lastRenderTime = Date.now();

  useEffect(() => {
    if (isStarted) {
      speedUp();
    } else {
      slowDown();
    }
  }, [isStarted]);

  useEffect(() => {
    const points = createRandomPoints(CANVA_SIZE, NUM_STARS);
    const speeds = createRandomSpeed(CANVA_SIZE, NUM_SPEEDS);
    setSavePoints(points);
    setSaveSpeeds(speeds);
    drawPoints(points);
    const handleStart = async () => {
      await wait(10);
      startAnimation();
    };
    const startAnimation = () => {
      if (!isAnimating) {
        lastRenderTime = Date.now();
        tick();
        setIsAnimating(true);
      }
    };

    handleStart();
  }, [canvas, context]);

  const tick = () => {
    animationFrameId.current && cancelAnimationFrame(animationFrameId.current);
    const currentTime = Date.now();
    const deltaTime = currentTime - lastRenderTime;
    lastRenderTime = currentTime;

    frameCounter.current += 1;
    setSaveParticles((prevParticles) => {
      const particles = nextFrameParticles(prevParticles, deltaTime);
      drawParticles(particles);
      return particles;
    });

    setNavettePosition((prevNavettePosition) => {
      const navettePosition = nextFrameNavette(prevNavettePosition, deltaTime);
      drawNavette();
      return navettePosition;
    });

    setSavePoints((prevPoints) => {
      const points = nextFramePoint(prevPoints, deltaTime);
      clearCanvas();
      drawPoints(points);
      return points;
    });

    setSaveSpeeds((prevSpeeds) => {
      const speeds = nextFrameSpeed(prevSpeeds, deltaTime);
      drawSpeed(speeds);
      return speeds;
    });

    animationFrameId.current = requestAnimationFrame(tick);
  };

  const drawParticles = (particles: Particles[]) => {
    if (context) {
      const currentMaxSize = Math.max(
        ...particles.map((particle) => particle.size)
      );
      for (const particle of particles) {
        const normalizedSize = particle.size / currentMaxSize;
        const r = Math.floor(255 * (1 - normalizedSize) + 255 * normalizedSize);
        const g = Math.floor(0 * (1 - normalizedSize) + 255 * normalizedSize);
        const b = Math.floor(0 * (1 - normalizedSize));
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.opacity})`;
        context.shadowBlur = 6;
        context.shadowColor = `rgba(${r}, ${g}, ${b}, ${particle.opacity})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        context.fill();
      }
    }
  };

  const nextFrameParticles = (particles: Particles[], deltaTime: number) => {
    for (const particle of particles) {
      particle.x -= 100 * (deltaTime / 1000);
      particle.y += particle.direction * (deltaTime / 1000);
      particle.size += 10 * (deltaTime / 1000);
      particle.opacity -= 0.5 * (deltaTime / 1000);
    }

    if (particles.length < 100 && isMovingRef.current) {
      particles.push({
        x: navettePosition.x,
        y: navettePosition.y,
        size: Math.random() * 2 + 1,
        opacity: Math.random() / 4 + 0.2,
        direction: Math.random() * 30 - 15,
      });
    }

    const filteredParticles = particles.filter((item) => item.opacity > 0);
    return filteredParticles;
  };

  const drawNavette = () => {
    if (context) {
      context.save();
      const angleInRadians = navettePosition.direction * (Math.PI / 180);
      context.translate(navettePosition.x, navettePosition.y);
      context.rotate(angleInRadians);
      context.drawImage(img, -0, -38, 80, 80);
      context.restore();
    }
  };

  const nextFrameNavette = (navettePosition: Navette, deltaTime: number) => {
    const xMove =
      Math.cos(frameCounter.current / 100) * 1 * (velocityRef.current + 0.4);
    const yMove =
      Math.cos(frameCounter.current / 70) * 0.5 * (velocityRef.current + 0.4);
    const yMoveDirection =
      Math.cos(frameCounter.current / 70 + 2.2) * 0.5 * (velocityRef.current + 0.4);
    navettePosition.x = NAVETTE_BASE_POSITION.x + xMove * 30;
    navettePosition.y = NAVETTE_BASE_POSITION.y + yMove * 30;
    navettePosition.direction = NAVETTE_BASE_POSITION.direction + yMoveDirection * 10;
    return navettePosition;
  };

  const createRandomPoints = (
    { width, height }: { width: number; height: number },
    numPoints: number
  ) => {
    let points: Point[] = [];
    const colorrange = {
      r: [214, 255, 255],
      g: [214, 214, 255],
      b: [255, 214, 214],
    };
    for (let i = 0; i < numPoints; i++) {
      const hue = randomValue(0, colorrange.r.length - 1);
      const point = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        size: +Math.max(MIN_STAR_SIZE, Math.random() * MAX_STAR_SIZE).toFixed(
          2
        ),
        opacity: +(Math.random() * 2 - 1).toFixed(2),
        color: {
          r: colorrange.r[hue] + (255 - colorrange.r[hue]) * Math.random(),
          g: colorrange.g[hue] + (255 - colorrange.r[hue]) * Math.random(),
          b: colorrange.b[hue] + (255 - colorrange.r[hue]) * Math.random(),
        },
      };
      points = [...points, point];
    }
    return points;
  };

  const drawPoints = (points: Point[]) => {
    if (context) {
      for (const point of points) {
        const color = `rgba(${point.color.r}, ${point.color.g}, ${
          point.color.b
        }, ${Math.abs(point.opacity) / 5 * 2 + 3 / 5})`;
        context.fillStyle = color;
        context.shadowBlur = 6;
        context.shadowColor = color;
        context.beginPath();
        context.arc(point.x, point.y, point.size * 2, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      }
    }
  };

  const nextFramePoint = (points: Point[], deltaTime: number) => {
    for (const point of points) {
      point.x -=
        PIXELS_TO_MOVE * (deltaTime / 1000) * velocityRef.current +
        PIXELS_TO_MOVE *
          velocityRef.current *
          (point.size * (PARALLAX_AMOUNT / 100));

      if (point.x < 0) {
        point.x = CANVA_SIZE.width;
      }

      if (point.opacity <= -1) {
        point.opacity = 1;
      } else {
        point.opacity = point.opacity - 1 * (deltaTime / 1000);
      }
    }
    return points;
  };

  const createRandomSpeed = (
    { width, height }: { width: number; height: number },
    numSpeed: number
  ) => {
    let speeds: Speed[] = [];
    for (let i = 0; i < numSpeed; i++) {
      const speed = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        direction: 0,
      };
      speeds = [...speeds, speed];
    }
    return speeds;
  };

  const drawSpeed = (speeds: Speed[]) => {
    if (context) {
      for (const speed of speeds) {
        context.strokeStyle = `rgba(255, 255, 255, ${
          0.5 * velocityRef.current
        })`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(speed.x, speed.y);
        context.lineTo(speed.x + 15, speed.y);
        context.stroke();
      }
    }
  };

  const nextFrameSpeed = (speeds: Speed[], deltaTime: number) => {
    for (const speed of speeds) {
      speed.x -= 500 * velocityRef.current * (deltaTime / 1000);

      if (speed.x < 0) {
        speed.x = CANVA_SIZE.width;
        speed.y = Math.floor(Math.random() * CANVA_SIZE.height);
      }
    }
    return speeds;
  };

  const clearCanvas = () => {
    if (context && canvas) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const slowDown = () => {
    if (speedTransitionRef.current !== null) {
      cancelAnimationFrame(speedTransitionRef.current);
      speedTransitionRef.current = null;
    }

    const duration = 4000;
    const startTime = Date.now();
    const startSpeed = velocityRef.current;

    const step = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const t = elapsed / duration;
        const easedT = 0.5 - 0.5 * Math.cos(t * Math.PI);
        velocityRef.current = startSpeed * (1 - easedT);
        speedTransitionRef.current = requestAnimationFrame(step);
      } else {
        velocityRef.current = 0;
        if (speedTransitionRef.current !== null) {
          cancelAnimationFrame(speedTransitionRef.current);
          speedTransitionRef.current = null;
        }
      }
    };

    isMovingRef.current = false;
    speedTransitionRef.current = requestAnimationFrame(step);
  };

  const speedUp = () => {
    if (speedTransitionRef.current !== null) {
      cancelAnimationFrame(speedTransitionRef.current);
      speedTransitionRef.current = null;
    }

    const duration = 2000;
    const startTime = Date.now();
    const startSpeed = velocityRef.current;
    const endSpeed = 1;
    isMovingRef.current = true;

    const step = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const t = elapsed / duration;
        const easingFactor =
          t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        velocityRef.current =
          startSpeed + (endSpeed - startSpeed) * easingFactor;
        requestAnimationFrame(step);
      } else {
        velocityRef.current = endSpeed;
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <canvas
      className={"animationCard"}
      ref={canvasRef}
      width={CANVA_SIZE.width}
      height={CANVA_SIZE.height}
      style={{
        width: `${CANVA_SIZE.width / 2}px`,
        height: `${CANVA_SIZE.height / 2}px`,
      }}
    />
  );
};
