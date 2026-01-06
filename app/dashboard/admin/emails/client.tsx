"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Eye, Send, Check } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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

export function AdminEmailsClient({ templates }: AdminEmailsClientProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
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
      {/* Header */}
      <BlurFade delay={0.1}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-muted-foreground">
            Preview and test email templates sent to customers
          </p>
        </div>
      </BlurFade>

      {/* Stats */}
      <BlurFade delay={0.15}>
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
      </BlurFade>

      {/* Templates Grid */}
      <BlurFade delay={0.2}>
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{template.name} Template</DialogTitle>
                          <DialogDescription>
                            Preview of the {template.name.toLowerCase()} email template
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-2">Subject: {template.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            Template preview would render here with the React Email component.
                          </p>
                          <div className="mt-4 p-4 bg-background rounded border">
                            <p className="text-xs font-medium mb-2">Preview Props:</p>
                            <pre className="text-xs overflow-x-auto">
                              {JSON.stringify(template.previewProps, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
      </BlurFade>
    </div>
  )
}
