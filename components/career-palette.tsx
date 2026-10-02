"use client";

import { Download, Linkedin, Mail } from "lucide-react";
import { RESUME_PATH, SITE_CONFIG, SOCIALS } from "@/lib/constants";
import { careerButtonClass } from "@/components/career-button";
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
  const close = () => onOpenChange(false);

  const go = (id: string) => {
    close();
    const node = document.getElementById(id);
    if (node) {
      node.scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.location.assign(`/#${id}`);
  };

  const visit = (path: string) => {
    close();
    window.location.assign(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Command palette">
      <CommandInput placeholder="Jump or write" />
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
        <CommandGroup heading="Pages">
          <CommandItem value="Projects" onSelect={() => visit("/projects")}>
            Projects
          </CommandItem>
          <CommandItem value="Experience page" onSelect={() => visit("/experience")}>
            Experience page
          </CommandItem>
          <CommandItem value="For recruiters" onSelect={() => visit("/for-recruiters")}>
            For recruiters
          </CommandItem>
          <CommandItem value="Contact page" onSelect={() => visit("/contact")}>
            Contact page
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem
            className={careerButtonClass("primary", "sm")}
            value="Download resume"
            onSelect={() => {
              close();
              window.location.href = RESUME_PATH;
            }}
          >
            <Download aria-hidden />
            Download resume
          </CommandItem>
          <CommandItem
            className={careerButtonClass("secondary", "sm")}
            value="Email"
            onSelect={() => {
              close();
              window.location.href = `mailto:${SITE_CONFIG.email}`;
            }}
          >
            <Mail aria-hidden />
            Email
          </CommandItem>
          <CommandItem
            className={careerButtonClass("secondary", "sm")}
            value="LinkedIn"
            onSelect={() => {
              close();
              window.open(SOCIALS.linkedin, "_blank", "noopener,noreferrer");
            }}
          >
            <Linkedin aria-hidden />
            LinkedIn
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
