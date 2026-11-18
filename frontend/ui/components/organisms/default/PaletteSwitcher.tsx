"use client";

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { BlockOptions } from "@pomeg-dev/nextpress-client/types";
import BlockWrapper from "./BlockWrapper";

type Palette = {
  name?: string;
  chalk?: string;
  bottle?: string;
  flare?: string;
  sage?: string;
};

type PaletteSwitcherProps = {
  heading?: string;
  intro?: string;
  presets?: Palette[];
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

const KEYS = ["chalk", "bottle", "flare", "sage"] as const;

// Tokens derived from the four raw colours, so raised grounds and accent text
// follow a preset. Removed again when the preview resets.
const DERIVED: Record<string, string> = {
  "--np-chalk-raised": "color-mix(in oklab, var(--np-chalk), white 50%)",
  "--np-bottle-raised": "color-mix(in oklab, var(--np-bottle), white 8%)",
  "--np-flare-deep": "color-mix(in oklab, var(--np-flare), black 38%)",
  "--np-flare-light": "color-mix(in oklab, var(--np-flare), white 45%)",
};

// WCAG 2.1 contrast ratio of two hex colours.
const luminance = (hex: string) => {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a?: string, b?: string) => {
  if (!a || !b || !/^#([0-9a-f]{3}){1,2}$/i.test(a) || !/^#([0-9a-f]{3}){1,2}$/i.test(b)) return null;
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// The pairs the design depends on, and the AA threshold each must meet.
// Ink (body text, button labels) is not part of a preset.
type Colours = Omit<Palette, "name"> & { ink?: string };
const PAIRS: { label: string; fg: keyof Colours; bg: keyof Colours; min: number }[] = [
  { label: "Bottle on chalk", fg: "bottle", bg: "chalk", min: 4.5 },
  { label: "Chalk on bottle", fg: "chalk", bg: "bottle", min: 4.5 },
  { label: "Ink on flare", fg: "ink", bg: "flare", min: 4.5 },
];

const PaletteSwitcher: React.FC<PaletteSwitcherProps> = ({
  heading,
  intro,
  presets = [],
  blockOptions,
  className,
  id,
}) => {
  const [defaults, setDefaults] = useState<(Palette & { ink?: string }) | null>(null);
  const [active, setActive] = useState(0);

  // The default palette is read from the live tokens, not repeated here.
  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const read = (key: string) => styles.getPropertyValue(`--np-${key}`).trim();
    setDefaults({ name: "Default", chalk: read("chalk"), bottle: read("bottle"), flare: read("flare"), sage: read("sage"), ink: read("ink") });
  }, []);

  const palettes: Palette[] = [
    defaults ?? { name: "Default" },
    ...presets.filter((preset) => KEYS.every((key) => preset?.[key])),
  ];

  // Apply the active palette to the whole page; clear it on reset or unmount.
  useEffect(() => {
    const root = document.documentElement;
    const clear = () => {
      KEYS.forEach((key) => root.style.removeProperty(`--np-${key}`));
      Object.keys(DERIVED).forEach((name) => root.style.removeProperty(name));
    };
    clear();
    if (active > 0 && palettes[active]) {
      KEYS.forEach((key) => root.style.setProperty(`--np-${key}`, palettes[active][key] as string));
      Object.entries(DERIVED).forEach(([name, value]) => root.style.setProperty(name, value));
    }
    return clear;
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = palettes[active] ?? palettes[0];
  const colours: Colours = { ...current, ink: defaults?.ink };

  return (
    <BlockWrapper
      blockOptions={blockOptions}
      className={className}
      id={id}
      style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
    >
      <div className="container grid gap-lg lg:grid-cols-12 lg:gap-x-md">
        <div className="flow lg:col-span-5">
          {heading && <h2>{heading}</h2>}
          {intro && <p className="body-lg text-muted">{intro}</p>}
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="palette-options" role="group" aria-label="Palettes">
            {palettes.map((palette, index) => (
              <button
                key={index}
                type="button"
                className="palette-option"
                aria-pressed={active === index}
                onClick={() => setActive(index)}
              >
                <span className="palette-swatches" aria-hidden="true">
                  {KEYS.map((key) => (
                    <span key={key} style={{ backgroundColor: palette[key] || `var(--np-${key})` }} />
                  ))}
                </span>
                {palette.name || `Palette ${index}`}
              </button>
            ))}
          </div>

          <table className="palette-contrast">
            <caption className="label mb-xs text-left text-muted">Contrast, WCAG 2.1 AA</caption>
            <tbody>
              {PAIRS.map((pair) => {
                const ratio = contrast(colours[pair.fg], colours[pair.bg]);
                const pass = ratio !== null && ratio >= pair.min;
                return (
                  <tr key={pair.label}>
                    <th scope="row">{pair.label}</th>
                    <td>{ratio ? `${ratio.toFixed(2)}:1` : "–"}</td>
                    <td className={classNames(ratio !== null && (pass ? "is-pass" : "is-fail"))}>
                      {ratio === null ? "" : pass ? "Pass" : "Fail"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="sr-only" aria-live="polite">{`${current.name || "Palette"} applied`}</p>
        </div>
      </div>
    </BlockWrapper>
  );
};

export default PaletteSwitcher;
