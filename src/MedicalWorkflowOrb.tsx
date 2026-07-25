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
  summarizing: 120,
  routing: 72,
  "review-needed": 112,
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
  group?: "source-left" | "source-right" | "handoff";
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
    const cluster = index % 4;
    const clusterIndex = Math.floor(index / 4);
    const sourceCenters = [
      [-0.19, -0.15],
      [0.2, -0.13],
      [-0.18, 0.16],
      [0.19, 0.15],
    ];
    const sourceAngle = clusterIndex * goldenAngle + cluster * 0.8;
    const sourceRadius =
      Math.sqrt(noise(index + 18)) * size * (0.058 + cluster * 0.004);
    const targetProgress = index / count;
    const targetY = 1 - targetProgress * 2;
    const targetRadius = Math.sqrt(Math.max(0, 1 - targetY * targetY));
    return {
      x:
        sourceCenters[cluster][0] * size +
        Math.cos(sourceAngle) * sourceRadius,
      y:
        sourceCenters[cluster][1] * size +
        Math.sin(sourceAngle) * sourceRadius,
      z: (noise(index + 38) - 0.5) * size * 0.045,
      targetX:
        Math.cos(angle) * targetRadius * size * 0.12,
      targetY: targetY * size * 0.12,
      targetZ:
        Math.sin(angle) * targetRadius * size * 0.065,
      scale: 0.56 + noise(index + 58) * 0.72,
      alpha: 0.52 + noise(index + 78) * 0.45,
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
    if (index < 96) {
      const side = index < 48 ? -1 : 1;
      const localIndex = index % 48;
      const fieldY = 1 - (localIndex / 47) * 2;
      const fieldRadius = Math.sqrt(Math.max(0, 1 - fieldY * fieldY));
      const fieldAngle = localIndex * goldenAngle;
      return {
        x:
          side * size * 0.19 +
          Math.cos(fieldAngle) * fieldRadius * size * 0.092,
        y: fieldY * size * 0.13,
        z: Math.sin(fieldAngle) * fieldRadius * size * 0.055,
        scale: 0.52 + noise(index + 4) * 0.7,
        alpha: 0.48 + noise(index + 14) * 0.46,
        group: side === -1 ? "source-left" : "source-right",
      };
    }

    const handoffIndex = index - 96;
    const handoffRadius =
      Math.sqrt(noise(handoffIndex + 8)) * size * 0.034;
    const handoffAngle = noise(handoffIndex + 18) * Math.PI * 2;
    return {
      x: -size * 0.085 + Math.cos(handoffAngle) * handoffRadius,
      y: Math.sin(handoffAngle) * handoffRadius,
      z: size * 0.05,
      targetX: size * 0.085 + Math.cos(handoffAngle) * handoffRadius,
      targetY: Math.sin(handoffAngle) * handoffRadius,
      targetZ: size * 0.05,
      scale: 0.82 + noise(index + 6) * 0.74,
      alpha: 0.82 + noise(index + 16) * 0.17,
      group: "handoff",
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
                    "--particle-delay": `${index * -0.027}s`,
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
