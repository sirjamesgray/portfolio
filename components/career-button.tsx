import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./career-system.module.css";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT: Record<Variant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
};

export function careerButtonClass(variant: Variant = "primary", size: "md" | "sm" = "md") {
  return cn(styles.btn, VARIANT[variant], size === "sm" && styles.sm);
}

type Shared = {
  variant?: Variant;
  size?: "md" | "sm";
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
};

type ButtonProps = Shared &
  Omit<React.ComponentProps<"button">, "children" | "className"> & {
    href?: undefined;
    "data-close"?: boolean;
  };

type LinkProps = Shared & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export function CareerButton(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", icon: Icon, children, className } = props;
  const classes = cn(careerButtonClass(variant, size), className);
  const content = (
    <>
      <Icon aria-hidden />
      {children}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <a href={props.href} target={props.target} rel={props.rel} onClick={props.onClick} className={classes}>
        {content}
      </a>
    );
  }

  const buttonProps = props as ButtonProps;
  return (
    <button
      type={buttonProps.type ?? "button"}
      onClick={buttonProps.onClick}
      data-close={buttonProps["data-close"] ? "" : undefined}
      className={classes}
    >
      {content}
    </button>
  );
}
