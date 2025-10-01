"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Fee, fees as mockFees } from "@/lib/data"

const chartConfig = {
  fees: {
    label: "Fees",
  },
  paid: {
    label: "Paid",
    color: "hsl(var(--chart-2))",
  },
  due: {
    label: "Due",
    color: "hsl(var(--chart-4))",
  },
  overdue: {
    label: "Overdue",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function FeeStatusChart() {
  const [fees, setFees] = React.useState<Fee[]>(mockFees);

  const chartData = React.useMemo(() => {
    const statusCounts = fees.reduce((acc, fee) => {
      acc[fee.status] = (acc[fee.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: "Paid", value: statusCounts['Paid'] || 0, fill: "var(--color-paid)" },
      { name: "Due", value: statusCounts['Due'] || 0, fill: "var(--color-due)" },
      { name: "Overdue", value: statusCounts['Overdue'] || 0, fill: "var(--color-overdue)" },
    ];
  }, [fees]);

  const totalStudents = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [chartData]);


  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Fee Status Overview</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold font-headline"
                        >
                          {totalStudents.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Students
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          All students accounted for <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total students with fee status
        </div>
      </CardFooter>
    </Card>
  )
}
