"use client";

import React from "react";
import { MissingBlock } from "./missing-block";

type Props = { name?: string; children: React.ReactNode };

/**
 * Isolates a single block: if it throws while rendering (e.g. data shaped for
 * fields its deployed component doesn't know yet), that block renders nothing
 * (a placeholder with the error in dev) and the rest of the page carries on.
 */
export class BlockBoundary extends React.Component<Props, { failed: boolean; message?: string }> {
  state = { failed: false, message: undefined };

  static getDerivedStateFromError(error: unknown) {
    return { failed: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: unknown) {
    console.error(`Nextpress: block "${this.props.name}" failed to render, skipping`, error);
  }

  render() {
    if (!this.state.failed) {
      return this.props.children;
    }
    return process.env.NODE_ENV === "development" ? (
      <MissingBlock name={this.props.name} error={this.state.message ?? "unknown error"} />
    ) : null;
  }
}
