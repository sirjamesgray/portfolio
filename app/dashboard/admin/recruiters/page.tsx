"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Key,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  Loader2,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Building2,
  MessageSquare,
  Monitor,
  Globe,
  Search,
  Copy,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { DashboardButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RecruiterPassword {
  id: string
  label: string
  is_active: boolean
  created_at: string
}

interface AccessLog {
  id: string
  password_label: string
  password_id: string
  visitor_name: string
  visitor_company: string | null
  visitor_message: string | null
  ip_address: string | null
  user_agent: string | null
  referrer: string | null
  created_at: string
}

function PasswordManager() {
  const [passwords, setPasswords] = useState<RecruiterPassword[]>([])
  const [loading, setLoading] = useState(true)
  const [newLabel, setNewLabel] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchPasswords = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/recruiter-passwords")
      if (res.ok) {
        const data = await res.json()
        setPasswords(data.passwords)
      }
    } catch (err) {
      console.error("Failed to fetch passwords:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPasswords()
  }, [fetchPasswords])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!newLabel || !newPassword) return

    setCreating(true)
    try {
      const res = await fetch("/api/admin/recruiter-passwords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel, password: newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create password")
        return
      }

      setSuccess(`Password "${newLabel}" created`)
      setNewLabel("")
      setNewPassword("")
      setShowPassword(false)
      fetchPasswords()
    } catch {
      setError("Something went wrong")
    } finally {
      setCreating(false)
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await fetch("/api/admin/recruiter-passwords", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-active", id }),
      })
      fetchPasswords()
    } catch (err) {
      console.error("Failed to toggle:", err)
    }
  }

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Delete password "${label}"? This cannot be undone.`)) return

    try {
      await fetch("/api/admin/recruiter-passwords", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })
      setSuccess(`Password "${label}" deleted`)
      fetchPasswords()
    } catch (err) {
      console.error("Failed to delete:", err)
    }
  }

  const getShareablePasswordUrl = (label: string) => {
    if (typeof window === "undefined") return ""
    const url = `${window.location.origin}/for-recruiters`
    return `🔒 ${label}: ${url}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setSuccess("Copied to clipboard")
    } catch {
      setError("Failed to copy")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-4 w-4 text-emerald-500" />
            Create New Recruiter Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Label (who is this for?)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Google Recruiter"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-500/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {success && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-lg px-3 py-2 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {success}
              </p>
            )}

            <DashboardButton
              type="submit"
              disabled={creating || !newLabel || !newPassword}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Password
                </>
              )}
            </DashboardButton>
          </form>
        </CardContent>
      </Card>

      {/* Existing Passwords */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-4 w-4" />
            Existing Passwords
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : passwords.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No passwords created yet
            </p>
          ) : (
            <div className="space-y-3">
              {passwords.map((pw) => (
                <div
                  key={pw.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {pw.label}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          pw.is_active
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {pw.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Created {new Date(pw.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() =>
                        copyToClipboard(getShareablePasswordUrl(pw.label))
                      }
                      className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      title="Copy share URL"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggle(pw.id)}
                      className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      title={pw.is_active ? "Deactivate" : "Activate"}
                    >
                      {pw.is_active ? (
                        <ToggleRight className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(pw.id, pw.label)}
                      className="rounded-md p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function AccessLogs() {
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/recruiter-logs")
      if (res.ok) {
        const data = await res.json()
        setLogs(data.logs)
        setTotal(data.total)
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const filteredLogs = search
    ? logs.filter(
        (log) =>
          log.visitor_name.toLowerCase().includes(search.toLowerCase()) ||
          (log.visitor_company?.toLowerCase() || "").includes(search.toLowerCase()) ||
          log.password_label.toLowerCase().includes(search.toLowerCase())
      )
    : logs

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            Access Logs
            {total > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                ({total} total)
              </span>
            )}
          </CardTitle>
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <Monitor className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No access logs yet. Share a password with a recruiter and come back
              here to see when they log in.
            </p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No logs match your search
          </p>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-lg border border-border p-3 space-y-2"
              >
                {/* Top row: name + company + time */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="text-sm font-medium text-foreground">
                        {log.visitor_name}
                      </span>
                      {log.visitor_company && (
                        <>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {log.visitor_company}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded px-1.5 py-0.5">
                        {log.password_label}
                      </span>
                      <span>
                        {new Date(log.created_at).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message if any */}
                {log.visitor_message && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                    <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                    <em>&ldquo;{log.visitor_message}&rdquo;</em>
                  </div>
                )}

                {/* Technical details toggle */}
                <details className="group">
                  <summary className="text-[10px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors list-none flex items-center gap-1">
                    <ChevronDown className="h-3 w-3 group-open:hidden" />
                    <ChevronUp className="h-3 w-3 hidden group-open:block" />
                    Technical details
                  </summary>
                  <div className="mt-1 space-y-1 text-[10px] text-muted-foreground font-mono">
                    {log.ip_address && (
                      <p className="flex items-center gap-1">
                        <Globe className="h-3 w-3" /> IP: {log.ip_address}
                      </p>
                    )}
                    {log.user_agent && (
                      <p className="truncate">
                        UA: {log.user_agent}
                      </p>
                    )}
                    {log.referrer && (
                      <p className="truncate">
                        Ref: {log.referrer}
                      </p>
                    )}
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function RecruitersAdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recruiters</h1>
        <p className="text-muted-foreground">
          Manage recruiter passwords and view access logs for the protected
          portfolio area.
        </p>
      </div>

      <PasswordManager />
      <AccessLogs />
    </div>
  )
}