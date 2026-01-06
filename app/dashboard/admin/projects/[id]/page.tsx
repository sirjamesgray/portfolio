"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectChat } from "@/components/dashboard/project-chat"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Save,
  Calendar,
  Mail,
  Phone,
  User,
  Clock,
  Building,
  Copy,
  Check,
  Github,
  ExternalLink,
  DollarSign,
  Undo2,
  Timer,
  FileText,
} from "lucide-react"
import { useRouter, useParams } from "next/navigation"

type Contact = {
  name: string
  email: string
  phone?: string
  company?: string
}

type Project = {
  id: string
  title: string | null
  description: string | null
  status: string
  project_type: string | null
  price: number | null
  amount_paid: number | null
  end_date: string | null
  github_url: string | null
  vercel_url: string | null
  meeting_time: string | null
  notes: string | null
  created_at: string
  updated_at: string
  contacts: Contact | Contact[] | null
}

type ActivityLog = {
  id: string
  action: string
  details: string | null
  created_at: string
}

function getStatusColor(status: string) {
  switch (status) {
    case "lead":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "contacted":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "in_progress":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    case "completed":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "canceled":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getContact(contacts: Contact | Contact[] | null | undefined): Contact | null {
  if (!contacts) return null
  if (Array.isArray(contacts)) return contacts[0] || null
  return contacts
}

function formatCurrency(amount: number | null) {
  if (amount === null || amount === undefined) return "—"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDuration(startDate: string, endDate: string | null) {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""}`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? "s" : ""}`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? "s" : ""}`
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) !== 1 ? "s" : ""}`
}

function CopyableField({ value, children }: { value: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const [hovering, setHovering] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="group flex items-center gap-2 cursor-pointer"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={handleCopy}
    >
      {children}
      <button
        className={`h-4 w-4 text-muted-foreground hover:text-foreground transition-opacity ${
          hovering ? "opacity-100" : "opacity-0"
        }`}
      >
        {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      </button>
    </div>
  )
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Editable fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("")
  const [price, setPrice] = useState("")
  const [amountPaid, setAmountPaid] = useState("")
  const [endDate, setEndDate] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [vercelUrl, setVercelUrl] = useState("")

  // Track original notes for diff
  const [originalNotes, setOriginalNotes] = useState("")
  const notesChanged = notes !== originalNotes

  useEffect(() => {
    fetchProject()
    fetchActivityLog()
    fetchCurrentUser()
  }, [projectId])

  async function fetchCurrentUser() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setCurrentUserId(user.id)
    }
  }

  async function fetchProject() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        id,
        title,
        description,
        status,
        project_type,
        price,
        amount_paid,
        end_date,
        github_url,
        vercel_url,
        meeting_time,
        notes,
        created_at,
        updated_at,
        contacts (
          name,
          email,
          phone,
          company
        )
      `
      )
      .eq("id", projectId)
      .single()

    if (error) {
      console.error("Error fetching project:", error)
      setLoading(false)
      return
    }

    setProject(data)
    setTitle(data.title || "")
    setDescription(data.description || "")
    setNotes(data.notes || "")
    setOriginalNotes(data.notes || "")
    setStatus(data.status)
    setPrice(data.price?.toString() || "")
    setAmountPaid(data.amount_paid?.toString() || "")
    setEndDate(data.end_date ? data.end_date.split("T")[0] : "")
    setGithubUrl(data.github_url || "")
    setVercelUrl(data.vercel_url || "")
    setLoading(false)
  }

  async function fetchActivityLog() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("activity_log")
      .select("id, action, details, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching activity log:", error)
      return
    }

    setActivityLog(data || [])
  }

  function revertNotes() {
    setNotes(originalNotes)
  }

  async function handleSave() {
    if (!project) return

    setSaving(true)
    const supabase = createClient()

    // Check what changed
    const statusChanged = status !== project.status
    const notesUpdated = notes !== originalNotes

    // Update project
    const { error: projectError } = await supabase
      .from("projects")
      .update({
        title: title || null,
        description: description || null,
        status,
        notes,
        price: price ? parseFloat(price) : null,
        amount_paid: amountPaid ? parseFloat(amountPaid) : null,
        end_date: endDate || null,
        github_url: githubUrl || null,
        vercel_url: vercelUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)

    if (projectError) {
      console.error("Error updating project:", projectError)
      setSaving(false)
      return
    }

    // Log activity for status change
    if (statusChanged) {
      await supabase.from("activity_log").insert({
        project_id: projectId,
        action: "status_changed",
        details: `Status changed from ${formatStatus(project.status)} to ${formatStatus(status)}`,
      })
    }

    // Log activity for notes change with diff
    if (notesUpdated) {
      const oldLines = originalNotes.split("\n")
      const newLines = notes.split("\n")
      let diffDetails = ""

      if (!originalNotes && notes) {
        diffDetails = `Notes added: "${notes.substring(0, 100)}${notes.length > 100 ? "..." : ""}"`
      } else if (originalNotes && !notes) {
        diffDetails = "Notes cleared"
      } else {
        const addedLines = newLines.filter(line => !oldLines.includes(line)).length
        const removedLines = oldLines.filter(line => !newLines.includes(line)).length
        diffDetails = `Notes updated: +${addedLines} line${addedLines !== 1 ? "s" : ""}, -${removedLines} line${removedLines !== 1 ? "s" : ""}`
      }

      await supabase.from("activity_log").insert({
        project_id: projectId,
        action: "notes_updated",
        details: diffDetails,
      })
    }

    // Refresh activity log
    fetchActivityLog()

    // Update local state
    setProject({
      ...project,
      title: title || null,
      description: description || null,
      status,
      notes,
      price: price ? parseFloat(price) : null,
      amount_paid: amountPaid ? parseFloat(amountPaid) : null,
      end_date: endDate || null,
      github_url: githubUrl || null,
      vercel_url: vercelUrl || null,
    })
    setOriginalNotes(notes)
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard/admin/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Project not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const contact = getContact(project.contacts)
  const priceNum = price ? parseFloat(price) : 0
  const paidNum = amountPaid ? parseFloat(amountPaid) : 0
  const owed = priceNum - paidNum

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/dashboard/admin/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Project Title & Description */}
      <div className="space-y-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project Title"
          className="text-3xl font-bold tracking-tight h-auto py-2 border-none bg-transparent px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a project description..."
          className="resize-none border-none bg-transparent px-0 focus-visible:ring-0 text-muted-foreground placeholder:text-muted-foreground/50"
          rows={2}
        />
        {!title && contact?.name && (
          <p className="text-sm text-muted-foreground">
            {contact.name}&apos;s Project
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Name</p>
                <CopyableField value={contact?.name || ""}>
                  <p className="text-sm text-muted-foreground">
                    {contact?.name || "N/A"}
                  </p>
                </CopyableField>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Email</p>
                <CopyableField value={contact?.email || ""}>
                  {contact?.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {contact.email}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">N/A</p>
                  )}
                </CopyableField>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Phone</p>
                <CopyableField value={contact?.phone || ""}>
                  <p className="text-sm text-muted-foreground">
                    {contact?.phone || "N/A"}
                  </p>
                </CopyableField>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Company</p>
                <CopyableField value={contact?.company || ""}>
                  <p className="text-sm text-muted-foreground">
                    {contact?.company || "N/A"}
                  </p>
                </CopyableField>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-start gap-3">
              <Timer className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {formatDuration(project.created_at, endDate || null)}
                  {!endDate && (
                    <span className="text-emerald-600 dark:text-emerald-400 ml-1">(ongoing)</span>
                  )}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Meeting Time</p>
                <p className="text-sm text-muted-foreground">
                  {project.meeting_time
                    ? new Date(project.meeting_time).toLocaleString()
                    : "Not scheduled"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(project.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Total Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className="pl-7"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Amount Paid</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder="0"
                  className="pl-7"
                />
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Amount Owed</span>
                <span className={`text-lg font-bold ${owed > 0 ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                  {formatCurrency(owed)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deliverables Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Deliverables
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub Repository
              </label>
              <Input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
              />
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                >
                  Open repository <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Vercel Preview
              </label>
              <Input
                type="url"
                value={vercelUrl}
                onChange={(e) => setVercelUrl(e.target.value)}
                placeholder="https://your-project.vercel.app"
              />
              {vercelUrl && (
                <a
                  href={vercelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                >
                  Open preview <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat */}
      {currentUserId && (
        <ProjectChat
          projectId={projectId}
          currentUserId={currentUserId}
          isAdmin={true}
        />
      )}

      {/* Notes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Notes</CardTitle>
            {notesChanged && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-yellow-600 border-yellow-600/30">
                  Unsaved changes
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={revertNotes}
                  className="h-8"
                >
                  <Undo2 className="h-4 w-4 mr-1" />
                  Revert
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add notes about this project..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
          />
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {activityLog.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No activity yet
            </p>
          ) : (
            <div className="space-y-4">
              {activityLog.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`flex gap-4 ${
                    index !== activityLog.length - 1 ? "pb-4 border-b" : ""
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      activity.action === "notes_updated"
                        ? "bg-blue-500"
                        : activity.action === "status_changed"
                        ? "bg-yellow-500"
                        : "bg-primary"
                    }`} />
                    {index !== activityLog.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1 pt-0.5">
                    <p className="text-sm font-medium">
                      {activity.action === "notes_updated" ? "Notes Updated" :
                       activity.action === "status_changed" ? "Status Changed" :
                       activity.action}
                    </p>
                    {activity.details && (
                      <p className="text-sm text-muted-foreground">
                        {activity.details}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
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
