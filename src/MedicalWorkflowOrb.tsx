import { useMemo, type CSSProperties } from "react";
import "./orb.css";

export const medicalWorkflowStates = [
  "listening",
  "checking",
  "full-picture",
  "documenting",
  "summarizing",
  "routing",
  "review-needed",
] as const;

export type MedicalWorkflowState = (typeof medicalWorkflowStates)[number];

export interface MedicalWorkflowOrbProps {
  state: MedicalWorkflowState;
  size?: number;
  label?: string;
  speed?: number;
  className?: string;
}

const defaultLabels: Record<MedicalWorkflowState, string> = {
  listening: "Listening to encounter",
  checking: "Checking health data",
  documenting: "Writing clinical note",
  "full-picture": "Getting the full picture",
  summarizing: "Summarizing visit",
  routing: "Routing follow-up",
  "review-needed": "Waiting for clinician review",
};

const particleCounts: Record<MedicalWorkflowState, number> = {
  listening: 72,
  checking: 72,
  documenting: 180,
  "full-picture": 240,
  summarizing: 184,
  routing: 72,
  "review-needed": 200,
};

const goldenAngle = Math.PI * (3 - Math.sqrt(5));

type Particle = {
  x: number;
  y: number;
  z: number;
  scale: number;
  alpha: number;
  stretchX?: number;
  stretchY?: number;
  rotation?: number;
  targetX?: number;
  targetY?: number;
  targetZ?: number;
  delay?: number;
  group?:
    | "summary-frame"
    | "summary-rope"
    | "review-core"
    | "review-bridge"
    | "review-petal";
};

function noise(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function particleForState(
  state: MedicalWorkflowState,
  index: number,
  size: number,
  count: number,
): Particle {
  const progress = index / count;
  const angle = index * goldenAngle;
  const radius = size * 0.31;

  if (state === "checking") {
    const envelope = Math.sin(progress * Math.PI);
    return {
      x: (progress - 0.5) * size * 0.66,
      y: Math.sin(progress * Math.PI * 6) * size * 0.14 * envelope,
      z: Math.cos(progress * Math.PI * 4) * size * 0.05,
      scale: 0.55 + envelope * 0.7,
      alpha: 0.45 + envelope * 0.55,
    };
  }

  if (state === "documenting") {
    if (index < 36) {
      const staffProgress = index / 35;
      return {
        x: 0,
        y: size * (-0.24 + staffProgress * 0.51),
        z: size * 0.012,
        scale: 0.58 + noise(index + 3) * 0.38,
        alpha: 0.66 + noise(index + 13) * 0.3,
        stretchX: 0.72,
        stretchY: 1.5,
      };
    }

    if (index < 54) {
      const crownAngle = ((index - 36) / 18) * Math.PI * 2;
      return {
        x: Math.cos(crownAngle) * size * 0.045,
        y: -size * 0.285 + Math.sin(crownAngle) * size * 0.045,
        z: Math.sin(crownAngle) * size * 0.015,
        scale: 0.72 + noise(index) * 0.48,
        alpha: 0.72 + noise(index + 9) * 0.26,
      };
    }

    if (index < 102) {
      const wingIndex = index - 54;
      const side = wingIndex < 24 ? -1 : 1;
      const localIndex = wingIndex % 24;
      const feather = Math.floor(localIndex / 6);
      const featherProgress = (localIndex % 6) / 5;
      return {
        x:
          side *
          size *
          (0.045 + featherProgress * (0.235 - feather * 0.025)),
        y:
          size *
          (-0.225 +
            feather * 0.032 +
            Math.sin(featherProgress * Math.PI) * 0.018),
        z: (feather - 1.5) * size * 0.012,
        scale: 0.55 + noise(index + 5) * 0.52,
        alpha: 0.56 + noise(index + 15) * 0.4,
        stretchX: 1.35,
        stretchY: 0.7,
        rotation: side * (-12 + feather * 5),
      };
    }

    const snakeIndex = index - 102;
    const snake = snakeIndex % 2;
    const snakeProgress = Math.floor(snakeIndex / 2) / 38;
    return {
      x:
        Math.sin(snakeProgress * Math.PI * 4.5 + snake * Math.PI) *
        size *
        0.072,
      y: size * (-0.17 + snakeProgress * 0.4),
      z:
        Math.cos(snakeProgress * Math.PI * 4.5 + snake * Math.PI) *
        size *
        0.028,
      scale: 0.58 + noise(index + 7) * 0.55,
      alpha: 0.58 + noise(index + 17) * 0.4,
    };
  }

  if (state === "full-picture") {
    if (index < 30) {
      const headRadius = Math.sqrt(noise(index + 11)) * size * 0.064;
      const headAngle = noise(index + 31) * Math.PI * 2;
      return {
        x: Math.cos(headAngle) * headRadius,
        y: -size * 0.27 + Math.sin(headAngle) * headRadius,
        z: (noise(index + 51) - 0.5) * size * 0.025,
        scale: 0.62 + noise(index + 71) * 1.3,
        alpha: 0.62 + noise(index + 91) * 0.36,
        stretchX: 0.72 + noise(index + 3) * 1.2,
        stretchY: 0.72 + noise(index + 7) * 1.2,
        rotation: noise(index + 13) * 180,
      };
    }

    if (index < 130) {
      const torsoSeed = index - 30;
      const torsoProgress = noise(torsoSeed + 5);
      const y = size * (-0.17 + torsoProgress * 0.34);
      const profile =
        size *
        (0.095 +
          Math.sin(torsoProgress * Math.PI) * 0.058 +
          (torsoProgress > 0.72 ? 0.018 : 0));
      return {
        x: (noise(torsoSeed + 37) * 2 - 1) * profile,
        y,
        z: (noise(torsoSeed + 67) - 0.5) * size * 0.055,
        scale: 0.52 + noise(torsoSeed + 97) * 1.55,
        alpha: 0.52 + noise(torsoSeed + 127) * 0.46,
        stretchX: 0.65 + noise(torsoSeed + 17) * 1.4,
        stretchY: 0.65 + noise(torsoSeed + 23) * 1.4,
        rotation: noise(torsoSeed + 29) * 180,
      };
    }

    if (index < 170) {
      const armIndex = index - 130;
      const side = armIndex % 2 === 0 ? -1 : 1;
      const armProgress = Math.floor(armIndex / 2) / 19;
      return {
        x:
          side * size * (0.105 + armProgress * 0.14) +
          (noise(index + 7) - 0.5) * size * 0.028,
        y:
          size * (-0.1 + armProgress * 0.23) +
          (noise(index + 17) - 0.5) * size * 0.025,
        z: (noise(index + 27) - 0.5) * size * 0.03,
        scale: 0.5 + noise(index + 37) * 1.4,
        alpha: 0.5 + noise(index + 47) * 0.45,
        stretchX: 0.65 + noise(index + 57) * 1.45,
        stretchY: 0.65 + noise(index + 67) * 1.45,
        rotation: noise(index + 77) * 180,
      };
    }

    const legIndex = index - 170;
    const side = legIndex % 2 === 0 ? -1 : 1;
    const legProgress = Math.floor(legIndex / 2) / 34;
    return {
      x:
        side * size * (0.054 + legProgress * 0.052) +
        (noise(index + 9) - 0.5) * size * 0.05,
      y:
        size * (0.15 + legProgress * 0.25) +
        (noise(index + 19) - 0.5) * size * 0.04,
      z: (noise(index + 29) - 0.5) * size * 0.04,
      scale: 0.68 + noise(index + 39) * 1.65,
      alpha: 0.52 + noise(index + 49) * 0.44,
      stretchX: 0.9 + noise(index + 59) * 1.6,
      stretchY: 0.72 + noise(index + 69) * 1.55,
      rotation: noise(index + 79) * 180,
    };
  }

  if (state === "summarizing") {
    const frameHalfX = 0.25;
    const frameHalfY = 0.19;

    if (index < 72) {
      const pointsPerSide = 18;
      const side = Math.floor(index / pointsPerSide);
      const point = index % pointsPerSide;
      const sideProgress = point / (pointsPerSide - 1);
      let xUnit = 0;
      let yUnit = 0;
      let rotation = 0;

      if (side === 0 || side === 2) {
        xUnit = -frameHalfX + sideProgress * frameHalfX * 2;
        yUnit =
          (side === 0 ? -frameHalfY : frameHalfY) +
          Math.sin(sideProgress * Math.PI * 2 + side * 0.7) * 0.008;
      } else {
        xUnit =
          (side === 1 ? frameHalfX : -frameHalfX) +
          (side === 1 ? -1 : 1) *
            Math.sin(sideProgress * Math.PI) *
            0.028;
        yUnit = -frameHalfY + sideProgress * frameHalfY * 2;
        rotation = 90;
      }

      const normalizedX = xUnit / frameHalfX;
      const normalizedY = yUnit / frameHalfY;
      return {
        x: xUnit * size,
        y: yUnit * size,
        z: 0,
        targetX:
          xUnit *
          size *
          (0.64 + Math.abs(normalizedY) * 0.2),
        targetY:
          (yUnit * 0.88 +
            Math.sin(normalizedX * Math.PI) * 0.016) *
          size,
        targetZ:
          Math.cos(normalizedX * Math.PI * 0.5) *
          Math.cos(normalizedY * Math.PI * 0.5) *
          size *
          0.14,
        scale: 1.02 + noise(index + 31) * 0.72,
        alpha: 0.72 + noise(index + 41) * 0.25,
        stretchX: 1.42,
        stretchY: 0.9,
        rotation,
        delay: -Math.hypot(normalizedX, normalizedY) * 0.08,
        group: "summary-frame",
      };
    }

    const ropeSegments = [
      [[-0.2, -0.17], [-0.11, 0]],
      [[0, -0.17], [-0.11, 0]],
      [[0, -0.17], [0.11, 0]],
      [[0.2, -0.17], [0.11, 0]],
      [[-0.11, 0], [-0.2, 0.17]],
      [[-0.11, 0], [0, 0.17]],
      [[0.11, 0], [0, 0.17]],
      [[0.11, 0], [0.2, 0.17]],
    ];
    const ropeIndex = index - 72;
    const pointsPerRope = 14;
    const rope = Math.floor(ropeIndex / pointsPerRope);
    const point = ropeIndex % pointsPerRope;
    const ropeProgress = point / (pointsPerRope - 1);
    const [start, end] = ropeSegments[rope];
    const deltaX = end[0] - start[0];
    const deltaY = end[1] - start[1];
    const length = Math.hypot(deltaX, deltaY);
    const perpendicularX = -deltaY / length;
    const perpendicularY = deltaX / length;
    const bow =
      Math.sin(ropeProgress * Math.PI) *
      0.007 *
      (rope % 2 === 0 ? -1 : 1);
    const xUnit =
      start[0] + deltaX * ropeProgress + perpendicularX * bow;
    const yUnit =
      start[1] + deltaY * ropeProgress + perpendicularY * bow;
    const normalizedX = xUnit / frameHalfX;
    const normalizedY = yUnit / frameHalfY;
    return {
      x: xUnit * size,
      y: yUnit * size,
      z: Math.sin(ropeProgress * Math.PI) * size * 0.014,
      targetX:
        xUnit *
        size *
        (0.64 + Math.abs(normalizedY) * 0.2),
      targetY:
        (yUnit * 0.88 +
          Math.sin(normalizedX * Math.PI) * 0.016) *
        size,
      targetZ:
        Math.cos(normalizedX * Math.PI * 0.5) *
        Math.cos(normalizedY * Math.PI * 0.5) *
        size *
        0.14,
      scale: 0.88 + noise(index + 51) * 0.62,
      alpha: 0.64 + noise(index + 61) * 0.32,
      stretchX: 1.9,
      stretchY: 0.88,
      rotation: (Math.atan2(deltaY, deltaX) * 180) / Math.PI,
      delay: rope * -0.035,
      group: "summary-rope",
    };
  }

  if (state === "routing") {
    const major = size * 0.21;
    const minor = size * 0.085;
    const u = progress * Math.PI * 2;
    const v = ((index * 11) % count) / count * Math.PI * 2;
    return {
      x: (major + minor * Math.cos(v)) * Math.cos(u),
      y: minor * Math.sin(v),
      z: (major + minor * Math.cos(v)) * Math.sin(u),
      scale: 0.55 + ((index * 7) % 10) / 18,
      alpha: 0.5 + ((index * 5) % 10) / 20,
    };
  }

  if (state === "review-needed") {
    if (index < 72) {
      const coreAngle = (index / 72) * Math.PI * 2;
      const radius = size * 0.112;
      return {
        x: Math.cos(coreAngle) * radius,
        y: Math.sin(coreAngle) * radius,
        z: Math.sin(coreAngle * 2) * size * 0.016,
        targetX: Math.cos(coreAngle) * radius * 0.93,
        targetY: Math.sin(coreAngle) * radius * 0.93,
        targetZ: Math.sin(coreAngle * 2) * size * 0.022,
        scale: 0.74 + noise(index + 17) * 0.5,
        alpha: 0.64 + noise(index + 27) * 0.32,
        delay: 0,
        group: "review-core",
      };
    }

    const directions = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ];

    if (index < 104) {
      const bridgeIndex = index - 72;
      const particlesPerBridge = 8;
      const direction = Math.floor(bridgeIndex / particlesPerBridge);
      const point = bridgeIndex % particlesPerBridge;
      const bridgeProgress = point / (particlesPerBridge - 1);
      const [directionX, directionY] = directions[direction];
      const distance = size * (0.132 + bridgeProgress * 0.058);
      return {
        x: directionX * distance,
        y: directionY * distance,
        z: Math.sin(bridgeProgress * Math.PI) * size * 0.014,
        targetX: directionX * (distance - size * 0.008),
        targetY: directionY * (distance - size * 0.008),
        targetZ: Math.sin(bridgeProgress * Math.PI) * size * 0.02,
        scale: 0.58 + noise(index + 37) * 0.44,
        alpha: 0.38 + noise(index + 47) * 0.34,
        stretchX: 1.42,
        stretchY: 0.8,
        rotation: direction * 90,
        delay: 0,
        group: "review-bridge",
      };
    }

    const petalIndex = index - 104;
    const particlesPerPetal = 24;
    const direction = Math.floor(petalIndex / particlesPerPetal);
    const localIndex = petalIndex % particlesPerPetal;
    const [directionX, directionY] = directions[direction];
    const perpendicularX = -directionY;
    const perpendicularY = directionX;
    const axialUnit = noise(localIndex + direction * 31 + 7) * 2 - 1;
    const axial = axialUnit * size * 0.052;
    const petalWidth =
      size * (0.008 + (1 - Math.pow(Math.abs(axialUnit), 1.35)) * 0.034);
    const lateral =
      (noise(localIndex + direction * 47 + 19) * 2 - 1) * petalWidth;
    const distance = size * 0.235;
    const targetDistance = size * 0.2;
    return {
      x:
        directionX * (distance + axial) +
        perpendicularX * lateral,
      y:
        directionY * (distance + axial) +
        perpendicularY * lateral,
      z:
        size *
        (0.024 +
          (noise(localIndex + direction * 53 + 29) - 0.5) * 0.026),
      targetX:
        directionX * (targetDistance + axial * 0.88) +
        perpendicularX * lateral,
      targetY:
        directionY * (targetDistance + axial * 0.88) +
        perpendicularY * lateral,
      targetZ: size * 0.045,
      scale: 0.72 + noise(index + 57) * 0.82,
      alpha: 0.66 + noise(index + 67) * 0.3,
      stretchX: 0.92 + noise(index + 77) * 0.42,
      stretchY: 0.92 + noise(index + 87) * 0.42,
      rotation: noise(index + 97) * 180,
      delay: 0,
      group: "review-petal",
    };
  }

  const yUnit = 1 - (index / (count - 1)) * 2;
  const sphereRadius = Math.sqrt(1 - yUnit * yUnit);
  return {
    x: Math.cos(angle) * sphereRadius * radius,
    y: yUnit * radius,
    z: Math.sin(angle) * sphereRadius * radius,
    scale: 0.5 + ((index * 13) % 10) / 14,
    alpha: 0.5 + ((index * 17) % 10) / 20,
  };
}

export function MedicalWorkflowOrb({
  state,
  size = 72,
  label,
  speed = 1,
  className = "",
}: MedicalWorkflowOrbProps) {
  const normalizedSize =
    Number.isFinite(size) && size > 0 ? Math.max(12, size) : 72;
  const normalizedSpeed =
    Number.isFinite(speed) && speed > 0 ? Math.min(4, Math.max(0.25, speed)) : 1;
  const style = {
    "--orb-size": `${normalizedSize}px`,
    "--orb-speed": `${1 / normalizedSpeed}s`,
  } as CSSProperties;
  const accessibleLabel = label ?? defaultLabels[state];
  const particleCount = particleCounts[state];
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, index) =>
        particleForState(state, index, normalizedSize, particleCount),
      ),
    [normalizedSize, particleCount, state],
  );

  return (
    <div
      className={`medical-orb medical-orb--${state} ${className}`.trim()}
      style={style}
      role="img"
      aria-label={`${accessibleLabel}. AI workflow status.`}
      data-state={state}
    >
      <div className="medical-orb__field" aria-hidden="true">
        <div className="medical-orb__aura" />
        <div className="medical-orb__particles">
          {particles.map((particle, index) => {
            return (
              <span
                key={index}
                data-particle-group={particle.group}
                style={
                  {
                    "--particle-x": `${particle.x}px`,
                    "--particle-y": `${particle.y}px`,
                    "--particle-z": `${particle.z}px`,
                    "--particle-target-x": `${particle.targetX ?? particle.x}px`,
                    "--particle-target-y": `${particle.targetY ?? particle.y}px`,
                    "--particle-target-z": `${particle.targetZ ?? particle.z}px`,
                    "--particle-scale-x":
                      particle.scale * (particle.stretchX ?? 1),
                    "--particle-scale-y":
                      particle.scale * (particle.stretchY ?? 1),
                    "--particle-alpha": particle.alpha,
                    "--particle-rotation": `${particle.rotation ?? 0}deg`,
                    "--particle-delay": `${
                      particle.delay ?? index * -0.027
                    }s`,
                  } as CSSProperties
                }
              />
            );
          })}
        </div>
        <div className="medical-orb__scan" />
      </div>
    </div>
  );
}
