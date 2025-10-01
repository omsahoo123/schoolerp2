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
import { useData } from "@/lib/data-context"

const chartConfig = {
  occupants: {
    label: "Occupants",
  },
  occupied: {
    label: "Occupied",
    color: "hsl(var(--chart-1))",
  },
  available: {
    label: "Available",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export default function HostelChart() {
  const { hostelRooms } = useData();

  const totalOccupants = hostelRooms.reduce((acc, room) => acc + room.occupants.length, 0);
  const totalCapacity = hostelRooms.reduce((acc, room) => acc + room.capacity, 0);
  const availableSlots = totalCapacity - totalOccupants;

  const chartData = [
      { name: "Occupied", value: totalOccupants, fill: "var(--color-occupied)" },
      { name: "Available", value: availableSlots, fill: "var(--color-available)" },
    ];
  

  const occupancyRate = totalCapacity > 0 ? (totalOccupants / totalCapacity) * 100 : 0;


  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Hostel Occupancy</CardTitle>
        <CardDescription>Current Rate</CardDescription>
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
                          {occupancyRate.toFixed(1)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Full
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
          {totalOccupants} of {totalCapacity} beds filled
        </div>
        <div className="leading-none text-muted-foreground">
          Showing current hostel occupancy
        </div>
      </CardFooter>
    </Card>
  )
}
