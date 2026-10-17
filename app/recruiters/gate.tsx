"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

const field =
  "h-11 w-full border border-brand/40 bg-black px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none";

/** Password form. The server checks the password and sets an httpOnly cookie. */
export function RecruiterGate() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/recruiter/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          password: data.get("password"),
        }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not unlock. Try again.");
    } catch {
      setError("Could not unlock. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-sm space-y-3 border border-brand/40 bg-black p-4">
      <p className="flex items-center gap-2 font-mono text-xs text-brand">
        <Lock className="size-4" aria-hidden /> LOCKED
      </p>
      <label className="block text-sm text-muted-foreground">
        Name
        <input name="name" required autoComplete="name" className={`${field} mt-1`} />
      </label>
      <label className="block text-sm text-muted-foreground">
        Company (optional)
        <input name="company" autoComplete="organization" className={`${field} mt-1`} />
      </label>
      <label className="block text-sm text-muted-foreground">
        Password
        <input name="password" type="password" required autoComplete="off" className={`${field} mt-1`} />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="h-11 w-full border border-brand bg-brand px-4 text-sm font-medium text-black hover:bg-[#30a46c] disabled:opacity-60"
      >
        {busy ? "Checking…" : "Unlock"}
      </button>
    </form>
  );
}

export function RecruiterLock() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="font-mono text-xs text-muted-foreground hover:text-brand"
      onClick={async () => {
        await fetch("/api/recruiter/logout", { method: "POST" });
        router.refresh();
      }}
    >
      Lock
    </button>
  );
}
