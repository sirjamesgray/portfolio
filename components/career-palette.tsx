"use client";

import { useTheme } from "next-themes";
import { RESUME_PATH, SITE_CONFIG, SOCIALS } from "@/lib/constants";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "turbo", label: "Turbo" },
  { id: "lab", label: "Builder log" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CareerPalette({ open, onOpenChange }: Props) {
  const { setTheme, resolvedTheme } = useTheme();

  const close = () => onOpenChange(false);

  const go = (id: string) => {
    close();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Command palette">
      <CommandInput placeholder="Jump, write, or switch theme" />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>
        <CommandGroup heading="Sections">
          {SECTIONS.map((section) => (
            <CommandItem key={section.id} value={section.label} onSelect={() => go(section.id)}>
              {section.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Keys">
          <CommandItem value="g w Work" onSelect={() => go("work")}>
            g w · Work
          </CommandItem>
          <CommandItem value="g t Turbo" onSelect={() => go("turbo")}>
            g t · Turbo
          </CommandItem>
          <CommandItem
            value="question shortcuts"
            onSelect={() => {
              close();
              window.dispatchEvent(new Event("career-help"));
            }}
          >
            ? · shortcut sheet
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem
            value="Download resume"
            onSelect={() => {
              close();
              window.location.href = RESUME_PATH;
            }}
          >
            Download resume
          </CommandItem>
          <CommandItem
            value="Email"
            onSelect={() => {
              close();
              window.location.href = `mailto:${SITE_CONFIG.email}`;
            }}
          >
            Email
          </CommandItem>
          <CommandItem
            value="LinkedIn"
            onSelect={() => {
              close();
              window.open(SOCIALS.linkedin, "_blank", "noopener,noreferrer");
            }}
          >
            LinkedIn
          </CommandItem>
          <CommandItem
            value="Toggle theme"
            onSelect={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
              close();
            }}
          >
            Toggle theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
