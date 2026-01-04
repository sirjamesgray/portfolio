"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Bell, Zap, Heart, Star, Send } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function InteractiveCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.3 }}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 px-4 py-3 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function AutoToggleSwitch() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setChecked((prev) => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard delay={1}>
      <Bell className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">Notifications</span>
      <Switch checked={checked} onCheckedChange={setChecked} className="ml-auto" />
    </InteractiveCard>
  );
}

function AutoSlider() {
  const [value, setValue] = useState([30]);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(([current]) => {
        const next = current + 15;
        return [next > 100 ? 20 : next];
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard className="min-w-[180px]" delay={2}>
      <Zap className="h-4 w-4 text-yellow-500" />
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-sm font-medium">Performance</span>
        <Slider value={value} onValueChange={setValue} max={100} step={1} className="w-full" />
      </div>
    </InteractiveCard>
  );
}

function AutoCheckboxes() {
  const [checks, setChecks] = useState([true, false, false]);

  useEffect(() => {
    let index = 1;
    const interval = setInterval(() => {
      setChecks((prev) => {
        const next = [...prev];
        next[index] = !next[index];
        index = index === 2 ? 1 : 2;
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard className="flex-col items-start gap-2" delay={3}>
      <span className="text-sm font-medium">Features</span>
      <div className="flex flex-col gap-2">
        {["Analytics", "Reports", "Alerts"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <Checkbox
              checked={checks[i]}
              onCheckedChange={(checked) => {
                setChecks((prev) => {
                  const next = [...prev];
                  next[i] = checked as boolean;
                  return next;
                });
              }}
            />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </InteractiveCard>
  );
}

function AutoButton() {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setClicked(true);
      setTimeout(() => setClicked(false), 600);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard delay={4}>
      <Button
        size="sm"
        className={cn(
          "transition-all duration-200",
          clicked && "scale-95 bg-green-600 hover:bg-green-600"
        )}
      >
        {clicked ? (
          <>
            <Check className="mr-1 h-3 w-3" />
            Sent!
          </>
        ) : (
          <>
            <Send className="mr-1 h-3 w-3" />
            Send
          </>
        )}
      </Button>
    </InteractiveCard>
  );
}

function AutoBadges() {
  const [activeBadge, setActiveBadge] = useState(0);
  const badges = [
    { label: "New", variant: "default" as const },
    { label: "Popular", variant: "secondary" as const },
    { label: "Trending", variant: "outline" as const },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBadge((prev) => (prev + 1) % badges.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [badges.length]);

  return (
    <InteractiveCard delay={5}>
      <Star className="h-4 w-4 text-amber-500" />
      <div className="flex gap-2">
        {badges.map((badge, i) => (
          <Badge
            key={badge.label}
            variant={badge.variant}
            className={cn(
              "transition-all duration-300",
              activeBadge === i ? "scale-110 ring-2 ring-primary/20" : "opacity-60"
            )}
          >
            {badge.label}
          </Badge>
        ))}
      </div>
    </InteractiveCard>
  );
}

function AutoLike() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiked((prev) => {
        setCount((c) => (prev ? c - 1 : c + 1));
        return !prev;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard delay={6}>
      <button
        onClick={() => {
          setLiked(!liked);
          setCount((c) => (liked ? c - 1 : c + 1));
        }}
        className="flex items-center gap-2"
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-all duration-300",
            liked ? "fill-red-500 text-red-500 scale-110" : "text-muted-foreground"
          )}
        />
        <span className="text-sm font-medium tabular-nums">{count}</span>
      </button>
    </InteractiveCard>
  );
}

export function UIShowcase() {
  return (
    <section className="relative border-y border-border/50 bg-muted/30 py-6 overflow-hidden">
      <Marquee pauseOnHover className="[--duration:45s]">
        <AutoToggleSwitch />
        <AutoSlider />
        <AutoButton />
        <AutoBadges />
        <AutoLike />
        <AutoCheckboxes />
      </Marquee>
    </section>
  );
}
