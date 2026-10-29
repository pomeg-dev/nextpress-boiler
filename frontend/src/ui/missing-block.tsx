import React from "react";

/**
 * Dev-only stand-in for a block WordPress knows about (pushed with
 * blocks:push) that has no component yet, or whose component threw.
 * Shows the block name and its data so the component can be built against it.
 * Production renders nothing instead.
 */
export function MissingBlock({
  name,
  data,
  error,
}: {
  name?: string;
  data?: unknown;
  error?: string;
}) {
  return (
    <div
      style={{
        margin: "16px",
        padding: "12px 16px",
        border: `2px dashed ${error ? "#d93025" : "#f29900"}`,
        borderRadius: 8,
        background: error ? "#fce8e6" : "#fef7e0",
        color: "#202124",
        fontFamily: "ui-monospace, monospace",
        fontSize: 13,
      }}
    >
      <strong>{name}</strong>{" "}
      {error ? `failed to render: ${error}` : "has no component yet"}
      <span style={{ opacity: 0.7 }}> (dev only, hidden in production)</span>
      {data !== undefined && (
        <details style={{ marginTop: 8 }}>
          <summary style={{ cursor: "pointer" }}>Block data</summary>
          <pre style={{ whiteSpace: "pre-wrap", margin: "8px 0 0" }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
