export type BuilderLabId = "toggles" | "ascii" | "diff" | "agent" | "spring" | "swatch";

export type BuilderNote = {
  id: string;
  kind: "note";
  title: string;
  body: string;
  draft: true;
};

export type BuilderLab = {
  id: BuilderLabId;
  kind: "lab";
  title: string;
  file: string;
  draft: false;
};

export type BuilderEntry = BuilderNote | BuilderLab;

export const BUILDER_LOG: readonly BuilderEntry[] = [
  {
    id: "toggles",
    kind: "lab",
    title: "Live toggles",
    file: "toggles.tsx",
    draft: false,
  },
  {
    id: "ascii",
    kind: "lab",
    title: "ASCII field",
    file: "ascii.tsx",
    draft: false,
  },
  {
    id: "diff",
    kind: "lab",
    title: "JS to TS, API layer",
    file: "wewrite.diff",
    draft: false,
  },
  {
    id: "agent",
    kind: "lab",
    title: "Agent workflow",
    file: "ship.ts",
    draft: false,
  },
  {
    id: "spring",
    kind: "lab",
    title: "Easing",
    file: "ease.css",
    draft: false,
  },
  {
    id: "swatch",
    kind: "lab",
    title: "Tokens",
    file: "tokens.css",
    draft: false,
  },
  {
    id: "note-1",
    kind: "note",
    title: "TODO(jamie): fill in",
    body: "TODO(jamie): fill in",
    draft: true,
  },
  {
    id: "note-2",
    kind: "note",
    title: "TODO(jamie): fill in",
    body: "TODO(jamie): fill in",
    draft: true,
  },
];
