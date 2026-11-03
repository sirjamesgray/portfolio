"use client";

import { Download, Linkedin, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { SECTION_ROUTES } from "@/lib/section-routes";
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
  { id: "experiments", label: "Experiments" },
  { id: "about", label: "About" },
  { id: "blog", label: "Blog" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CareerPalette({ open, onOpenChange }: Props) {
  const router = useRouter();
  const close = () => onOpenChange(false);

  const go = (id: string) => {
    close();
    router.push(SECTION_ROUTES[id] ?? "/");
  };

  const visit = (path: string) => {
    close();
    router.push(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Command palette">
      <CommandInput placeholder="Jump or write" />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem value="Home" onSelect={() => visit("/")}>
            Home
          </CommandItem>
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
        <CommandGroup heading="More">
          <CommandItem value="Projects" onSelect={() => visit("/projects")}>
            Projects
          </CommandItem>
          <CommandItem value="Experience page" onSelect={() => visit("/experience")}>
            Experience page
          </CommandItem>
          <CommandItem value="For recruiters" onSelect={() => visit("/for-recruiters")}>
            For recruiters
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
