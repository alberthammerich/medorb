import { useMemo, useState } from "react";
import {
  MedicalWorkflowOrb as MedOrb,
  type MedicalWorkflowState,
} from "./MedicalWorkflowOrb";

const states: Array<{
  state: MedicalWorkflowState;
  label: string;
  detail: string;
}> = [
  {
    state: "listening",
    label: "Listening",
    detail: "stream open",
  },
  {
    state: "checking",
    label: "Checking data",
    detail: "reading records",
  },
  {
    state: "full-picture",
    label: "Full picture",
    detail: "joining context",
  },
  {
    state: "documenting",
    label: "Documenting",
    detail: "drafting note",
  },
  {
    state: "summarizing",
    label: "Summarising",
    detail: "building brief",
  },
  {
    state: "routing",
    label: "Routing",
    detail: "next step",
  },
  {
    state: "review-needed",
    label: "Review needed",
    detail: "clinician needed",
  },
];

export function App() {
  const [activeState, setActiveState] =
    useState<MedicalWorkflowState>("listening");
  const [size, setSize] = useState<"compact" | "regular">("regular");
  const [speed, setSpeed] = useState(1);
  const [copied, setCopied] = useState<
    "install" | "usage" | "playground" | null
  >(null);

  const active = states.find((item) => item.state === activeState)!;
  const code = useMemo(
    () =>
      `import { MedOrb } from 'medorb';\nimport 'medorb/styles.css';\n\n<MedOrb state="${activeState}" size={${
        size === "regular" ? 72 : 24
      }} />`,
    [activeState, size],
  );

  async function copyText(
    target: "install" | "usage" | "playground",
    text: string,
  ) {
    await navigator.clipboard.writeText(text);
    setCopied(target);
    window.setTimeout(() => setCopied(null), 1400);
  }

  return (
    <main>
      <nav className="nav" aria-label="Page navigation">
        <a className="nav__mark" href="#top" aria-label="MedOrb home">
          <MedOrb state="listening" size={28} />
        </a>
        <div className="nav__links">
          <a href="#states">States</a>
          <a href="#usage">Install</a>
          <a href="#playground">Try it</a>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="hero__icon">
          <MedOrb state="listening" size={68} />
        </div>
        <p className="hero__kicker">OPEN SOURCE / REACT</p>
        <h1>medorb</h1>
        <p>A motion system for clinical AI work.</p>
      </header>

      <section className="orb-grid" id="states" aria-label="MedOrb states">
        {states.map((item, index) => (
          <article
            className={`orb-card orb-card--${item.state}`}
            key={item.state}
          >
            <span className="orb-card__number">0{index + 1}</span>
            <MedOrb
              state={item.state}
              size={item.state === "full-picture" ? 170 : 150}
              speed={speed}
            />
            <span className="status-pill">
              <span aria-hidden="true">
                <MedOrb
                  state={item.state}
                  size={20}
                  speed={speed}
                />
              </span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </span>
            </span>
          </article>
        ))}
      </section>

      <section className="docs" id="usage">
        <div className="docs__section">
          <div className="section-title">
            <span>01</span>
            <h2>Install</h2>
          </div>
          <div className="code-line">
            <code>npm install medorb</code>
            <button
              type="button"
              onClick={() => void copyText("install", "npm install medorb")}
            >
              {copied === "install" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="docs__section">
          <div className="section-title">
            <span>02</span>
            <h2>Render one</h2>
          </div>
          <div className="code-block">
            <pre>
              <code>
                <span className="syntax-muted">import</span>{" "}
                <span className="syntax-bright">{"{ MedOrb }"}</span>{" "}
                <span className="syntax-muted">from</span>{" "}
                <span className="syntax-string">'medorb'</span>;
                {"\n"}
                <span className="syntax-muted">import</span>{" "}
                <span className="syntax-string">'medorb/styles.css'</span>;
                {"\n\n"}
                {"<"}
                <span className="syntax-bright">MedOrb</span>{" "}
                state=<span className="syntax-string">"checking"</span> size=
                <span className="syntax-string">{"{72}"}</span> {"/>"}
              </code>
            </pre>
            <button
              type="button"
              onClick={() =>
                void copyText(
                  "usage",
                  `import { MedOrb } from 'medorb';\nimport 'medorb/styles.css';\n\n<MedOrb state="checking" size={72} />`,
                )
              }
            >
              {copied === "usage" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </section>

      <section className="playground" id="playground">
        <div className="section-title">
          <span>03</span>
          <h2>Tune it</h2>
        </div>

        <div className="playground__panel">
          <div className="controls">
            <fieldset>
              <legend>state</legend>
              <div className="segmented segmented--wrap">
                {states.map((item) => (
                  <button
                    type="button"
                    data-active={activeState === item.state}
                    onClick={() => setActiveState(item.state)}
                    key={item.state}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>size</legend>
              <div className="segmented">
                <button
                  type="button"
                  data-active={size === "regular"}
                  onClick={() => setSize("regular")}
                >
                  72px
                </button>
                <button
                  type="button"
                  data-active={size === "compact"}
                  onClick={() => setSize("compact")}
                >
                  24px
                </button>
              </div>
            </fieldset>

            <fieldset className="speed-control">
              <legend>speed</legend>
              <div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.05"
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  aria-label="Animation speed"
                />
                <output>{speed.toFixed(2)}×</output>
              </div>
            </fieldset>
          </div>

          <div className="playground__stage">
            <MedOrb
              state={activeState}
              size={size === "regular" ? 154 : 52}
              speed={speed}
            />
            <div className="playground__status">
              <strong>{active.label}</strong>
              <span>{active.detail}</span>
            </div>
          </div>

          <div className="code-block code-block--result">
            <pre>
              <code>{code}</code>
            </pre>
            <button
              type="button"
              onClick={() => void copyText("playground", code)}
            >
              {copied === "playground" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </section>

      <footer>
        <span>medorb</span>
        <div className="footer__credit">
          <p>
            Open-sourced by{" "}
            <a href="https://github.com/alberthammerich">Albert Hammerich</a>
          </p>
          <p>
            Inspired by working with and contributing to{" "}
            <a href="https://openmed.life/">OpenMed</a>.
          </p>
        </div>
        <span>MIT / 2026</span>
      </footer>
    </main>
  );
}
