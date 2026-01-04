"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { Star, Send, MapPin, Sparkles, ToggleLeft, ToggleRight, Calendar, Clock, Loader2 } from "lucide-react";
import { BellIcon } from "@/components/ui/bell";
import { HeartIcon, type HeartIconHandle } from "@/components/ui/heart";
import { ZapIcon } from "@/components/ui/zap";
import { RefreshCWIcon } from "@/components/ui/refresh-cw";
import { WifiIcon, type WifiIconHandle } from "@/components/ui/wifi";
import { MoonIcon } from "@/components/ui/moon";
import { DownloadIcon, type DownloadIconHandle } from "@/components/ui/download";
import { UserIcon, type UserIconHandle } from "@/components/ui/user";
import { CheckIcon } from "@/components/ui/check";
import { VolumeIcon } from "@/components/ui/volume";
import { CogIcon } from "@/components/ui/cog";
import { LockIcon, type LockIconHandle } from "@/components/ui/lock";
import { LockOpenIcon, type LockOpenIconHandle } from "@/components/ui/lock-open";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

function InteractiveCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-white/10 bg-card/40 px-5 py-4 backdrop-blur-xl transition-colors duration-500 shrink-0",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function AutoToggleSwitch() {
  const [checked, setChecked] = useState(false);
  const bellRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setChecked((prev) => {
        bellRef.current?.startAnimation();
        return !prev;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard>
      <BellIcon ref={bellRef} size={16} className={cn("transition-colors", checked ? "text-primary" : "text-muted-foreground")} />
      <span className="text-sm font-medium">Notifications</span>
      <Switch checked={checked} onCheckedChange={setChecked} className="ml-auto" />
    </InteractiveCard>
  );
}

function AutoSlider() {
  const [value, setValue] = useState([30]);
  const zapRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(([current]) => {
        const next = current + 15;
        zapRef.current?.startAnimation();
        return [next > 100 ? 20 : next];
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard className="min-w-[180px]">
      <ZapIcon ref={zapRef} size={16} className="text-yellow-500" />
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-sm font-medium">Performance</span>
        <Slider value={value} onValueChange={setValue} max={100} step={1} className="w-full" />
      </div>
    </InteractiveCard>
  );
}

function AutoCheckboxes() {
  const [checks, setChecks] = useState([true, false, false]);
  const checkRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    let index = 1;
    const interval = setInterval(() => {
      setChecks((prev) => {
        const next = [...prev];
        next[index] = !next[index];
        checkRef.current?.startAnimation();
        index = index === 2 ? 1 : 2;
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard className="flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <CheckIcon ref={checkRef} size={16} className="text-green-500" />
        <span className="text-sm font-medium">Features</span>
      </div>
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
  const checkRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setClicked(true);
      checkRef.current?.startAnimation();
      setTimeout(() => setClicked(false), 600);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard>
      <Button
        size="sm"
        className={cn(
          "transition-all duration-200",
          clicked && "scale-95 bg-green-600 hover:bg-green-600"
        )}
      >
        <AnimatePresence mode="wait">
          {clicked ? (
            <motion.span
              key="sent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center"
            >
              <CheckIcon ref={checkRef} size={14} className="mr-1" />
              Sent!
            </motion.span>
          ) : (
            <motion.span
              key="send"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center"
            >
              <Send className="mr-1 h-3 w-3" />
              Send
            </motion.span>
          )}
        </AnimatePresence>
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
    <InteractiveCard>
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
  const heartRef = useRef<HeartIconHandle>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiked((prev) => {
        setCount((c) => (prev ? c - 1 : c + 1));
        return !prev;
      });
      setTimeout(() => heartRef.current?.startAnimation(), 0);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard>
      <button
        onClick={() => {
          setLiked(!liked);
          setCount((c) => (liked ? c - 1 : c + 1));
          heartRef.current?.startAnimation();
        }}
        className="flex items-center gap-2"
      >
        <HeartIcon
          ref={heartRef}
          size={20}
          className={cn(
            "transition-all duration-300",
            liked ? "text-red-500 [&_path]:fill-red-500" : "text-muted-foreground"
          )}
        />
        <NumberFlow
          value={count}
          className="text-sm font-medium tabular-nums"
          transformTiming={{ duration: 400, easing: "ease-out" }}
        />
      </button>
    </InteractiveCard>
  );
}

function AutoVolume() {
  const [value, setValue] = useState([65]);
  const volumeRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.random() > 0.5 ? 10 : -10;
      setValue(([current]) => {
        const next = Math.max(20, Math.min(100, current + change));
        return [next];
      });
      // Call animation outside of setState to avoid render-time updates
      setTimeout(() => volumeRef.current?.startAnimation(), 0);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard className="min-w-[160px]">
      <VolumeIcon ref={volumeRef} size={16} className="text-blue-500" />
      <Slider value={value} onValueChange={setValue} max={100} step={1} className="w-full" />
    </InteractiveCard>
  );
}

function AutoWifi() {
  const [connected, setConnected] = useState(true);
  const wifiRef = useRef<WifiIconHandle>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setConnected((prev) => {
        wifiRef.current?.startAnimation();
        return !prev;
      });
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard>
      <WifiIcon ref={wifiRef} size={16} className={cn("transition-colors", connected ? "text-green-500" : "text-muted-foreground")} />
      <span className="text-sm font-medium">WiFi</span>
      <Switch checked={connected} onCheckedChange={setConnected} className="ml-auto" />
    </InteractiveCard>
  );
}

function AutoDarkMode() {
  const [dark, setDark] = useState(false);
  const moonRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDark((prev) => {
        moonRef.current?.startAnimation();
        return !prev;
      });
    }, 2700);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard>
      <MoonIcon ref={moonRef} size={16} className={cn("transition-colors", dark ? "text-indigo-400" : "text-muted-foreground")} />
      <span className="text-sm font-medium">Dark Mode</span>
      <Switch checked={dark} onCheckedChange={setDark} className="ml-auto" />
    </InteractiveCard>
  );
}

function AutoProgress() {
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(true);
  const downloadRef = useRef<DownloadIconHandle>(null);
  const checkRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setDownloading(false);
          checkRef.current?.startAnimation();
          setTimeout(() => {
            setProgress(0);
            setDownloading(true);
            downloadRef.current?.startAnimation();
          }, 1500);
          return 100;
        }
        return prev + 8;
      });
    }, 400);

    downloadRef.current?.startAnimation();
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard className="min-w-[180px]">
      <AnimatePresence mode="wait">
        {downloading ? (
          <motion.div key="downloading" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
            <DownloadIcon ref={downloadRef} size={16} className="text-cyan-500" />
          </motion.div>
        ) : (
          <motion.div key="complete" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
            <CheckIcon ref={checkRef} size={16} className="text-green-500" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-1 flex-col gap-1">
        <motion.span layout className="text-sm font-medium">{downloading ? "Downloading..." : "Complete!"}</motion.span>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </InteractiveCard>
  );
}

function AutoSync() {
  const [syncing, setSyncing] = useState(false);
  const refreshRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);
  const checkRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncing(true);
      refreshRef.current?.startAnimation();
      setTimeout(() => {
        setSyncing(false);
        checkRef.current?.startAnimation();
      }, 1500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard>
      <AnimatePresence mode="wait">
        {syncing ? (
          <motion.div key="syncing" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <RefreshCWIcon ref={refreshRef} size={16} className="text-emerald-500" />
          </motion.div>
        ) : (
          <motion.div key="synced" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <CheckIcon ref={checkRef} size={14} className="text-emerald-500" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.span layout className="text-sm font-medium">{syncing ? "Syncing..." : "Synced"}</motion.span>
    </InteractiveCard>
  );
}

function AutoUserStatus() {
  const [online, setOnline] = useState(true);
  const userRef = useRef<UserIconHandle>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnline((prev) => {
        userRef.current?.startAnimation();
        return !prev;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard>
      <div className="relative">
        <UserIcon ref={userRef} size={16} className="text-muted-foreground" />
        <motion.span
          animate={{ backgroundColor: online ? "#22c55e" : "#6b7280" }}
          className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background"
        />
      </div>
      <motion.span layout className="text-sm font-medium">{online ? "Online" : "Away"}</motion.span>
    </InteractiveCard>
  );
}

function AutoSettings() {
  const [open, setOpen] = useState(false);
  const cogRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpen((prev) => {
        cogRef.current?.startAnimation();
        return !prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard>
      <CogIcon ref={cogRef} size={16} className={cn("transition-colors", open ? "text-primary" : "text-muted-foreground")} />
      <span className="text-sm font-medium">Settings</span>
      <Badge variant={open ? "default" : "outline"} className="ml-auto text-xs">
        {open ? "Open" : "Closed"}
      </Badge>
    </InteractiveCard>
  );
}

function AutoLocation() {
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTracking((prev) => !prev);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard>
      <motion.div animate={{ scale: tracking ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }}>
        <MapPin className={cn("h-4 w-4 transition-colors", tracking ? "text-blue-500" : "text-muted-foreground")} />
      </motion.div>
      <span className="text-sm font-medium">Location</span>
      <Switch checked={tracking} onCheckedChange={setTracking} className="ml-auto" />
    </InteractiveCard>
  );
}

function AutoSecurity() {
  const [locked, setLocked] = useState(true);
  const lockRef = useRef<LockIconHandle>(null);
  const lockOpenRef = useRef<LockOpenIconHandle>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocked((prev) => {
        if (prev) {
          lockOpenRef.current?.startAnimation();
        } else {
          lockRef.current?.startAnimation();
        }
        return !prev;
      });
    }, 3100);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard>
      <AnimatePresence mode="wait">
        {locked ? (
          <motion.div
            key="locked"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LockIcon ref={lockRef} size={16} className="text-green-500" />
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LockOpenIcon ref={lockOpenRef} size={16} className="text-red-500" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.span layout className="text-sm font-medium">{locked ? "Locked" : "Unlocked"}</motion.span>
      <AnimatePresence mode="wait">
        <motion.div
          key={locked ? "secure" : "warning"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Badge variant={locked ? "default" : "destructive"} className="ml-auto text-xs">
            {locked ? "Secure" : "Warning"}
          </Badge>
        </motion.div>
      </AnimatePresence>
    </InteractiveCard>
  );
}

function AutoSparkle() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(true);
      setTimeout(() => setActive(false), 1000);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard>
      <motion.div animate={{ scale: active ? [1, 1.3, 1] : 1, rotate: active ? [0, 15, -15, 0] : 0 }} transition={{ duration: 0.4 }}>
        <Sparkles className={cn("h-4 w-4 transition-colors", active ? "text-amber-400" : "text-muted-foreground")} />
      </motion.div>
      <span className="text-sm font-medium">AI Assist</span>
      <AnimatePresence mode="wait">
        <motion.div
          key={active ? "active" : "ready"}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <Badge variant={active ? "default" : "secondary"} className={cn("ml-auto text-xs transition-all", active && "bg-amber-500")}>
            {active ? "Active" : "Ready"}
          </Badge>
        </motion.div>
      </AnimatePresence>
    </InteractiveCard>
  );
}

function AutoCalendar() {
  const [day, setDay] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setDay((prev) => (prev >= 28 ? 1 : prev + 1));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard>
      <Calendar className="h-4 w-4 text-violet-500" />
      <span className="text-sm font-medium tabular-nums flex items-center gap-0.5">
        Jan <NumberFlow value={day} transformTiming={{ duration: 300, easing: "ease-out" }} />
      </span>
      <Badge variant="outline" className="ml-auto text-xs tabular-nums">
        2025
      </Badge>
    </InteractiveCard>
  );
}

function AutoClock() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev + 1) % 60);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard>
      <Clock className="h-4 w-4 text-cyan-500" />
      <span className="text-sm font-medium tabular-nums flex items-center">
        12:<NumberFlow
          value={seconds}
          format={{ minimumIntegerDigits: 2 }}
          transformTiming={{ duration: 300, easing: "ease-out" }}
        />
      </span>
      <Badge variant="secondary" className="ml-auto text-xs">
        PM
      </Badge>
    </InteractiveCard>
  );
}

function AutoLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const checkRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setLoading(false);
          checkRef.current?.startAnimation();
          setTimeout(() => {
            setProgress(0);
            setLoading(true);
          }, 1500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
            <CheckIcon ref={checkRef} size={16} className="text-green-500" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.span layout className="text-sm font-medium">{loading ? "Loading..." : "Done!"}</motion.span>
      <span className="ml-auto text-xs text-muted-foreground tabular-nums flex items-center">
        <NumberFlow
          value={progress}
          transformTiming={{ duration: 150, easing: "ease-out" }}
        />%
      </span>
    </InteractiveCard>
  );
}

function AutoToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setOn((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard>
      <AnimatePresence mode="wait">
        {on ? (
          <motion.div key="on" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
            <ToggleRight className="h-5 w-5 text-green-500" />
          </motion.div>
        ) : (
          <motion.div key="off" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
            <ToggleLeft className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-sm font-medium">Power</span>
      <AnimatePresence mode="wait">
        <motion.div
          key={on ? "on" : "off"}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <Badge variant={on ? "default" : "outline"} className={cn("ml-auto text-xs", on && "bg-green-500")}>
            {on ? "On" : "Off"}
          </Badge>
        </motion.div>
      </AnimatePresence>
    </InteractiveCard>
  );
}

// First row components
const row1Components = [
  <AutoToggleSwitch key="toggle" />,
  <AutoSlider key="slider" />,
  <AutoButton key="button" />,
  <AutoBadges key="badges" />,
  <AutoLike key="like" />,
  <AutoCheckboxes key="checkboxes" />,
  <AutoSettings key="settings" />,
  <AutoSparkle key="sparkle" />,
  <AutoCalendar key="calendar" />,
  <AutoToggle key="power" />,
];

// Second row components
const row2Components = [
  <AutoVolume key="volume" />,
  <AutoWifi key="wifi" />,
  <AutoDarkMode key="darkmode" />,
  <AutoProgress key="progress" />,
  <AutoSync key="sync" />,
  <AutoUserStatus key="userstatus" />,
  <AutoLocation key="location" />,
  <AutoSecurity key="security" />,
  <AutoClock key="clock" />,
  <AutoLoader key="loader" />,
];

export function UIShowcase() {
  return (
    <section className="relative py-6 overflow-hidden">
      <div className="flex flex-col gap-2">
        {/* First row - scrolls left */}
        <Marquee pauseOnHover className="[--duration:60s]">
          {row1Components}
        </Marquee>

        {/* Second row - scrolls right (reversed) */}
        <Marquee reverse pauseOnHover className="[--duration:55s]">
          {row2Components}
        </Marquee>
      </div>
    </section>
  );
}
