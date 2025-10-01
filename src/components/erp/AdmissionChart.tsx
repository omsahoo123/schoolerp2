"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useData } from "@/lib/data-context"

const chartConfig = {
  admitted: {
    label: "Admitted",
    color: "hsl(var(--chart-1))",
  },
  capacity: {
    label: "Capacity",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function AdmissionChart() {
  const { admissions } = useData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admission Rate</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={admissions} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="admitted" fill="var(--color-admitted)" radius={4} />
            <Bar dataKey="capacity" fill="var(--color-capacity)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
