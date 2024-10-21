"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import MaxContainer from "../common/maxcontainer";

export const description = "A mixed bar chart";

export function DashboardChart({ data }) {
  const chartData = [
    {
      item: "totalRegistered",
      totalNumbers: data.totalUsers,
      fill: "var(--color-totalRegistered)",
    },
    {
      item: "Pendingusers",
      totalNumbers: data.totalPendingUsers,
      fill: "var(--color-Pendingusers)",
    },
    {
      item: "Rejectedusers",
      totalNumbers: data.totalRejectedUsers,
      fill: "var(--color-Rejectedusers)",
    },
    {
      item: "Approvedusers",
      totalNumbers: data.totalApprovedUsers,
      fill: "var(--color-Approvedusers)",
    },
    {
      item: "UserswhopaidforID",
      totalNumbers: data.usersWithId,
      fill: "var(--color-UserswhopaidforID)",
    },
    {
      item: "deliveredId",
      totalNumbers: data.deliveredId,
      fill: "var(--color-deliveredId)",
    },
  ];
  const chartConfig = {
    totalNumbers: {
      label: "totalNumbers",
    },
    totalRegistered: {
      label: "Total Registered",
      color: "hsl(var(--chart-1))",
    },
    Pendingusers: {
      label: "Pending Users",
      color: "hsl(var(--chart-2))",
    },
    Rejectedusers: {
      label: "Rejected Users",
      color: "hsl(var(--chart-3))",
    },
    Approvedusers: {
      label: "Approved Users",
      color: "hsl(var(--chart-4))",
    },
    UserswhopaidforID: {
      label: "Paid for ID",
      color: "hsl(var(--chart-5))",
    },
    deliveredId: {
      label: "Delivered ID",
      color: "hsl(var(--chart-6))",
    },
  };
  return (
    <MaxContainer>
      <Card className="mx-[4rem] p-[2rem]">
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: 30,
              }}
            >
              <YAxis
                dataKey="item"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => chartConfig[value]?.label}
                className="text-[1rem]"
              />
              <XAxis
                dataKey="totalNumbers"
                type="number"
                className="text-[1rem]"
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent hideLabel className="text-[2rem]" />
                }
              />
              <Bar dataKey="totalNumbers" layout="vertical" radius={5} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </MaxContainer>
  );
}
