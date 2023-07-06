import React, { useRef, useState, useEffect } from "react";
import navette from "../assets/navette.svg";
import { wait } from "../utils/function";

// Type Definitions
type Props = {
  isStarted: boolean;
}
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
const NUM_SPEEDS = 3;
const MAX_STAR_SIZE = 1;
const MIN_STAR_SIZE = 0.5;
const CANVA_SIZE = { width: 400, height: 128 };
const PIXELS_TO_MOVE = 2;
const PARALLAX_AMOUNT = 3;
const NAVETTE_BASE_POSITION = { x: 100, y: 50, direction: 0 };

export const AnimationCard = ({isStarted}: Props) => {
  // State
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
  const navetteImage = useRef(new Image());
  const velocityRef = useRef<number>(0);
  const isMovingRef = useRef(false);
  const speedTransitionRef = useRef<number | null>(null);

  const frameCounter = useRef(0);
  const canvas = canvasRef.current;
  const context = canvasRef?.current?.getContext("2d");

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
    drawNavette();
    drawPoints(points);
    navetteImage.current.src = navette;
    const handleStart = async () => {
      await wait(100);
      startAnimation();
      console.log
    }
    const startAnimation = () => {
      if (!isAnimating) {
        lastRenderTime = Date.now();
        console.log('startAnimation')
        tick();
        setIsAnimating(true);
      }
    };

    handleStart();
  }, [canvas, context]);

  const createRandomPoints = (
    { width, height }: { width: number; height: number },
    numPoints: number
  ) => {
    let points: Point[] = [];
    const colorrange = {
      r:[214,255,255],
      g:[214,214,255],
      b:[255,214,214],
    };
    for (let i = 0; i < numPoints; i++) {
      const hue = getRandom(0,colorrange.r.length - 1);
      const point = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        size: +Math.max(MIN_STAR_SIZE, Math.random() * MAX_STAR_SIZE).toFixed(
          2
        ),
        opacity: +(Math.random() * 2 - 1).toFixed(2),
        color: {
          r: colorrange.r[hue] + ((255 - colorrange.r[hue]) * Math.random()),
          g: colorrange.g[hue] + ((255 - colorrange.r[hue]) * Math.random()),
          b: colorrange.b[hue] + ((255 - colorrange.r[hue]) * Math.random()),
        }
      };
      points = [...points, point];
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

  function getRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }      

  const drawPoints = (points: Point[]) => {
    if (context) {
      for (const point of points) {
        const color = `rgba(${point.color.r}, ${point.color.g}, ${point.color.b}, ${Math.abs(point.opacity) / 3 + 2 / 3 })`;
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

  const clearCanvas = () => {
    if (context && canvas) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
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

  const drawNavette = () => {
    if (context) {
      context.save();
      const angleInRadians = navettePosition.direction * (Math.PI / 180);
      context.translate(navettePosition.x, navettePosition.y);
      context.rotate(angleInRadians);
      context.drawImage(navetteImage.current, -5, -36, 80, 80);
      context.restore();
    }
  };

  const nextFrameNav = (navettePosition: Navette, deltaTime: number) => {
    const xMove =
      Math.cos(frameCounter.current / 100) *
      1 *
      (velocityRef.current + 0.4);
    const yMove =
      Math.cos(frameCounter.current / 70) *
      0.5 *
      (velocityRef.current + 0.4);
    navettePosition.x = NAVETTE_BASE_POSITION.x + xMove * 30;
    navettePosition.y = NAVETTE_BASE_POSITION.y + yMove * 30;
    navettePosition.direction =
      NAVETTE_BASE_POSITION.direction + yMove * 10;
    return navettePosition;
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

  let lastRenderTime = Date.now();

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
      const navettePosition = nextFrameNav(prevNavettePosition, deltaTime);
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
    <div>
      <canvas
        className={"animationCard"}
        ref={canvasRef}
        width={CANVA_SIZE.width}
        height={CANVA_SIZE.height}
        style={{ 
          width: "200px", 
          height: "64px",
         }}
      />
    </div>
  );
};
