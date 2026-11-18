import React from "react";
import Parser from "html-react-parser";
import { BlockOptions } from "@pomeg-dev/nextpress-client/types";
import { GravityForm } from "../forms/GravityForm";
import BlockWrapper from "./BlockWrapper";

type ContactFormProps = {
  heading?: string;
  content?: string;
  aside?: string;
  gfData?: any;
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

// Split: the heading, intro and contact details beside the form panel.
const ContactForm: React.FC<ContactFormProps> = ({
  heading,
  content,
  aside,
  gfData,
  blockOptions,
  className,
  id,
}) => {
  return (
    <BlockWrapper
      blockOptions={blockOptions}
      className={className}
      id={id}
      style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-section)" }}
    >
      <div className="container grid gap-lg lg:grid-cols-12 lg:gap-x-md">
        <div className="flex flex-col gap-lg lg:col-span-5">
          <div className="flow">
            {heading && <div className="flow">{Parser(heading)}</div>}
            {content && <p className="body-lg measure text-muted">{content}</p>}
          </div>
          {aside && <div className="flow border-t border-rule pt-md lg:mt-auto">{Parser(aside)}</div>}
        </div>
        <div className="rounded-md bg-surface-raised p-sm md:p-lg lg:col-span-6 lg:col-start-7">
          {gfData?.fields ? (
            <GravityForm gfData={gfData} />
          ) : (
            <p className="text-muted">Choose a form for this block in the editor.</p>
          )}
        </div>
      </div>
    </BlockWrapper>
  );
};

export default ContactForm;
