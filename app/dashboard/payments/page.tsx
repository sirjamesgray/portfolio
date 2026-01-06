"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BlurFade } from "@/components/ui/blur-fade"
import { CreditCard, Clock, Receipt } from "lucide-react"

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <BlurFade delay={0.1}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            View your invoices and payment history
          </p>
        </div>
      </BlurFade>

      {/* Coming Soon Card */}
      <BlurFade delay={0.2}>
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Payments Coming Soon</h2>
              <p className="text-muted-foreground max-w-md">
                We&apos;re working on a seamless payment experience. Soon you&apos;ll be able to view invoices, make payments, and track your payment history all in one place.
              </p>
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* Feature Preview */}
      <BlurFade delay={0.3}>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Receipt className="h-4 w-4 text-blue-500" />
                Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and download all your invoices in one place.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-500" />
                Easy Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pay securely with credit card or bank transfer.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track all your payments and outstanding balances.
              </p>
            </CardContent>
          </Card>
        </div>
      </BlurFade>
    </div>
  )
}
