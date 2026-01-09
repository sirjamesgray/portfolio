"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Eye, Send, Check, X } from "lucide-react"
import { MobileBackButton } from "@/components/dashboard/mobile-back-button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

type EmailTemplate = {
  id: string
  name: string
  description: string
  subject: string
  previewProps: Record<string, unknown>
}

interface AdminEmailsClientProps {
  templates: readonly EmailTemplate[]
}

function EmailPreview({ template }: { template: EmailTemplate }) {
  const [html, setHtml] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function renderEmail() {
      setLoading(true)
      try {
        const response = await fetch("/api/admin/emails/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateId: template.id, props: template.previewProps }),
        })
        if (response.ok) {
          const data = await response.json()
          setHtml(data.html)
        }
      } catch (error) {
        console.error("Error rendering email:", error)
      } finally {
        setLoading(false)
      }
    }
    renderEmail()
  }, [template.id, template.previewProps])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading preview...</div>
      </div>
    )
  }

  if (!html) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-muted-foreground">Failed to load preview</div>
      </div>
    )
  }

  return (
    <iframe
      srcDoc={html}
      className="w-full h-full min-h-[600px] bg-white rounded-lg border-0"
      title={`${template.name} email preview`}
    />
  )
}

export function AdminEmailsClient({ templates }: AdminEmailsClientProps) {
  const [testSent, setTestSent] = useState<string | null>(null)

  const sendTestEmail = async (templateId: string) => {
    try {
      const response = await fetch("/api/admin/emails/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      })

      if (response.ok) {
        setTestSent(templateId)
        setTimeout(() => setTestSent(null), 3000)
      }
    } catch (error) {
      console.error("Error sending test email:", error)
    }
  }

  return (
    <div className="space-y-6">
      <MobileBackButton />
      {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-muted-foreground">
            Preview and test email templates sent to customers
          </p>
        </div>

      {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Email Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Resend</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                Active
              </Badge>
            </CardContent>
          </Card>
        </div>

      {/* Templates Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {template.id}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  {template.description}
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Subject:</span> {template.subject}
                  </p>
                  <div className="flex gap-2">
                    <Drawer direction="right">
                      <DrawerTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="h-full w-full sm:max-w-2xl">
                        <DrawerHeader className="border-b">
                          <div className="flex items-center justify-between">
                            <div>
                              <DrawerTitle>{template.name}</DrawerTitle>
                              <DrawerDescription>
                                Subject: {template.subject}
                              </DrawerDescription>
                            </div>
                            <DrawerClose asChild>
                              <Button variant="ghost" size="icon">
                                <X className="h-4 w-4" />
                              </Button>
                            </DrawerClose>
                          </div>
                        </DrawerHeader>
                        <div className="flex-1 overflow-auto p-4 bg-muted/50">
                          <EmailPreview template={template} />
                        </div>
                      </DrawerContent>
                    </Drawer>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => sendTestEmail(template.id)}
                      disabled={testSent === template.id}
                    >
                      {testSent === template.id ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Sent
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-1" />
                          Test
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
    </div>
  )
}
