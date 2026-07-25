import type { CSSProperties } from "react";
import "./orb.css";

export type MedicalWorkflowState =
  | "listening"
  | "transcribing"
  | "checking"
  | "summarizing"
  | "routing"
  | "escalating";

export interface MedicalWorkflowOrbProps {
  state: MedicalWorkflowState;
  size?: number;
  label?: string;
  speed?: number;
  className?: string;
}

const defaultLabels: Record<MedicalWorkflowState, string> = {
  listening: "Listening",
  transcribing: "Transcribing",
  checking: "Checking record",
  summarizing: "Preparing summary",
  routing: "Routing next step",
  escalating: "Escalating for review",
};

const particleCount = 18;

export function MedicalWorkflowOrb({
  state,
  size = 72,
  label,
  speed = 1,
  className = "",
}: MedicalWorkflowOrbProps) {
  const style = {
    "--orb-size": `${size}px`,
    "--orb-speed": `${Math.max(0.25, speed)}s`,
  } as CSSProperties;
  const accessibleLabel = label ?? defaultLabels[state];

  return (
    <div
      className={`medical-orb medical-orb--${state} ${className}`.trim()}
      style={style}
      role="img"
      aria-label={`${accessibleLabel}. AI workflow status.`}
      data-state={state}
    >
      <div className="medical-orb__field" aria-hidden="true">
        <div className="medical-orb__core" />
        <div className="medical-orb__scan" />
        <div className="medical-orb__particles">
          {Array.from({ length: particleCount }, (_, index) => (
            <span
              key={index}
              style={
                {
                  "--particle-angle": `${index * 20}deg`,
                  "--particle-delay": `${index * -0.045}s`,
                  "--particle-scale": 0.5 + (index % 4) * 0.15,
                  "--particle-x": `${(index - 9) * size * 0.027}px`,
                  "--particle-y": `${
                    Math.sin(index * (Math.PI / 4.5)) * size * 0.13
                  }px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
