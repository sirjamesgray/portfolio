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
  Users,
  Eye as EyeIcon,
  Activity,
  BarChart3,
  CalendarDays,
  Filter,
  XCircle,
} from "lucide-react"
import { DashboardButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Types
interface RecruiterPassword {
  id: string
  label: string
  is_active: boolean
  created_at: string
}

interface PasswordStat {
  password_id: string
  password_label: string
  is_active: boolean
  total_visits: number
  unique_visitors: number
  last_visit_at: string | null
  avg_session_seconds: number | null
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

// --- Helper ---

function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return "—"
  if (seconds < 60) return `${Math.round(seconds)}s`
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60)
    const s = Math.round(seconds % 60)
    return `${m}m ${s}s`
  }
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  return `${h}h ${m}m`
}

type FilterStatus = "all" | "active" | "inactive" | "disabled"

// --- Aggregate Stats ---

function AggregateStats({ stats }: { stats: PasswordStat[] }) {
  const totalPasswords = stats.length
  const activePasswords = stats.filter((s) => s.is_active).length
  const totalVisits = stats.reduce((sum, s) => sum + s.total_visits, 0)
  const totalUnique = [...new Set(stats.map((s) => s.unique_visitors))].reduce(
    (sum) => sum + 0,
    0
  )
  // Recalculate unique properly
  const uniqueVisitors = stats.reduce((sum, s) => sum + s.unique_visitors, 0)
  const avgSession = stats
    .filter((s) => s.avg_session_seconds !== null)
    .reduce((sum, s) => sum + (s.avg_session_seconds || 0), 0)
  const avgSessionCount = stats.filter((s) => s.avg_session_seconds !== null).length

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Passwords</p>
            <Key className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-bold">{totalPasswords}</p>
          <p className="text-xs text-emerald-500">
            {activePasswords} active
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Visits</p>
            <EyeIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-bold">{totalVisits}</p>
          <p className="text-xs text-muted-foreground">
            All time
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Unique Visitors</p>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-bold">{uniqueVisitors}</p>
          <p className="text-xs text-muted-foreground">
            Distinct names
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Avg Session</p>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-bold">
            {avgSessionCount > 0
              ? formatDuration(avgSession / avgSessionCount)
              : "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            Per visit
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// --- Password Stats Cards ---

function PasswordStatsCards({
  stats,
  filterStatus,
  onFilterLogs,
}: {
  stats: PasswordStat[]
  filterStatus: FilterStatus
  onFilterLogs: (passwordId: string | null) => void
}) {
  const filtered = stats.filter((s) => {
    if (filterStatus === "active") return s.is_active
    if (filterStatus === "inactive") return !s.is_active
    return true
  })

  if (filtered.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No passwords match the selected filter.
      </p>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((s) => (
        <Card
          key={s.password_id}
          className="cursor-pointer transition-all duration-200 hover:border-emerald-500/40 hover:shadow-sm"
          onClick={() => onFilterLogs(s.password_id)}
          title="Click to show only logs for this password"
        >
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <Key className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium truncate">
                  {s.password_label}
                </span>
              </div>
              <span
                className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  s.is_active
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-bold">{s.total_visits}</p>
                <p className="text-[10px] text-muted-foreground">Visits</p>
              </div>
              <div>
                <p className="text-lg font-bold">{s.unique_visitors}</p>
                <p className="text-[10px] text-muted-foreground">Unique</p>
              </div>
              <div>
                <p className="text-lg font-bold">{formatDuration(s.avg_session_seconds)}</p>
                <p className="text-[10px] text-muted-foreground">Avg</p>
              </div>
            </div>

            {s.last_visit_at && (
              <p className="mt-2 text-[10px] text-muted-foreground text-center">
                Last visit:{" "}
                {new Date(s.last_visit_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// --- Password Manager ---

function PasswordManager({
  passwords,
  onRefresh,
}: {
  passwords: RecruiterPassword[]
  onRefresh: () => void
}) {
  const [newLabel, setNewLabel] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
      onRefresh()
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
      onRefresh()
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
      onRefresh()
    } catch (err) {
      console.error("Failed to delete:", err)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setSuccess("Copied to clipboard")
    } catch {
      setError("Failed to copy")
    }
  }

  const clearMessages = () => {
    setError("")
    setSuccess("")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Key className="h-4 w-4 text-emerald-500" />
          Create New Password
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

        {/* Existing Passwords List */}
        {passwords.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">
              All Passwords ({passwords.length})
            </h4>
            <div className="space-y-1.5">
              {passwords.map((pw) => (
                <div
                  key={pw.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm truncate">{pw.label}</span>
                    <span
                      className={`shrink-0 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                        pw.is_active
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {pw.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `🔒 ${pw.label}: ${window.location.origin}/protected`
                        )
                      }
                      className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      title="Copy share URL"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggle(pw.id)}
                      className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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
                      className="rounded-md p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// --- Access Logs ---

function AccessLogs() {
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [filterPasswordId, setFilterPasswordId] = useState<string | null>(null)

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

  // Expose reset handler for parent
  useEffect(() => {
    ;(window as any).__resetRecruiterLogFilter = () => {
      setFilterPasswordId(null)
      setSearch("")
    }
    return () => {
      delete (window as any).__resetRecruiterLogFilter
    }
  }, [])

  const filteredLogs = logs.filter((log) => {
    if (filterPasswordId && log.password_id !== filterPasswordId) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        log.visitor_name.toLowerCase().includes(q) ||
        (log.visitor_company?.toLowerCase() || "").includes(q) ||
        log.password_label.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            Access Logs
            {total > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                ({total} total
                {filteredLogs.length < total
                  ? `, ${filteredLogs.length} shown`
                  : ""}
                )
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {filterPasswordId && (
              <button
                onClick={() => setFilterPasswordId(null)}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <XCircle className="h-3 w-3" />
                Clear filter
              </button>
            )}
            <div className="relative w-44">
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
                      <button
                        onClick={() => setFilterPasswordId(log.password_id)}
                        className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded px-1.5 py-0.5 hover:bg-emerald-500/20 transition-colors"
                        title="Show only this password's logs"
                      >
                        {log.password_label}
                      </button>
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

                {log.visitor_message && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                    <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                    <em>&ldquo;{log.visitor_message}&rdquo;</em>
                  </div>
                )}

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
                      <p className="truncate">UA: {log.user_agent}</p>
                    )}
                    {log.referrer && (
                      <p className="truncate">Ref: {log.referrer}</p>
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

// --- Main Page ---

export default function RecruitersAdminPage() {
  const [passwords, setPasswords] = useState<RecruiterPassword[]>([])
  const [stats, setStats] = useState<PasswordStat[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [logFilterPasswordId, setLogFilterPasswordId] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      const [pwRes, statsRes] = await Promise.all([
        fetch("/api/admin/recruiter-passwords"),
        fetch("/api/admin/recruiter-stats"),
      ])
      if (pwRes.ok) {
        const pwData = await pwRes.json()
        setPasswords(pwData.passwords)
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.stats)
      }
    } catch (err) {
      console.error("Failed to fetch data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const filterTabs: { key: FilterStatus; label: string; count: number }[] = [
    {
      key: "all",
      label: "All",
      count: stats.length,
    },
    {
      key: "active",
      label: "Active",
      count: stats.filter((s) => s.is_active).length,
    },
    {
      key: "inactive",
      label: "Inactive",
      count: stats.filter((s) => !s.is_active).length,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Protected Content</h1>
          <p className="text-muted-foreground">
            Manage password-protected areas and monitor visitor activity.
          </p>
        </div>
      </div>

      {/* Aggregate Stats */}
      {!loading && stats.length > 0 && (
        <AggregateStats stats={stats} />
      )}

      {/* Create & Manage Passwords */}
      <PasswordManager passwords={passwords} onRefresh={fetchAll} />

      {/* Per-Password Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              Password Usage Stats
            </CardTitle>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterStatus(tab.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    filterStatus === tab.key
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  <span className="ml-1 text-[10px] opacity-60">
                    ({tab.count})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <PasswordStatsCards
              stats={stats}
              filterStatus={filterStatus}
              onFilterLogs={(passwordId) => setLogFilterPasswordId(passwordId)}
            />
          )}
        </CardContent>
      </Card>

      {/* Access Logs */}
      <AccessLogs />
    </div>
  )
}