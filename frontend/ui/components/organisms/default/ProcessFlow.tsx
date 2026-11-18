import React from "react";
import classNames from "classnames";
import { BlockOptions } from "@pomeg-dev/nextpress-client/types";
import BlockWrapper from "./BlockWrapper";

type Step = {
  label?: string;
  title?: string;
  text?: string;
  code?: string;
  code_label?: string;
};

type ProcessFlowProps = {
  heading?: string;
  intro?: string;
  steps?: Step[];
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

// A numbered flow. The order is the point, so the numbers stay: they sit in a
// strict margin column with the step's stage name. Code excerpts are plain
// text in a chip with a file strip.
const ProcessFlow: React.FC<ProcessFlowProps> = ({
  heading,
  intro,
  steps = [],
  blockOptions,
  className,
  id,
}) => {
  return (
    <BlockWrapper
      blockOptions={blockOptions}
      className={className}
      id={id}
      style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
    >
      <div className="container">
        {(heading || intro) && (
          <div className="flow mb-xl grid gap-sm lg:grid-cols-12 lg:gap-x-md">
            {heading && <h2 className="lg:col-span-7 lg:col-start-3">{heading}</h2>}
            {intro && <p className="body-lg measure text-muted lg:col-span-6 lg:col-start-3">{intro}</p>}
          </div>
        )}
        {steps.length > 0 && (
          <ol className="flow-steps">
            {steps.map((step, index) => (
              <li key={index} className="flow-step" data-reveal>
                <div className="flow-step-index">
                  <span className="flow-step-number">{String(index + 1).padStart(2, "0")}</span>
                  {step.label && <span className="label text-muted">{step.label}</span>}
                </div>
                <div className={classNames("flow", step.code ? "lg:col-span-4" : "lg:col-span-7")}>
                  {step.title && <h3 className="heading-md">{step.title}</h3>}
                  {step.text && <p className="text-muted">{step.text}</p>}
                </div>
                {step.code && (
                  <figure className="flow-step-code">
                    {step.code_label && <figcaption className="chip-strip">{step.code_label}</figcaption>}
                    <pre tabIndex={0}><code>{step.code}</code></pre>
                  </figure>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </BlockWrapper>
  );
};

export default ProcessFlow;
