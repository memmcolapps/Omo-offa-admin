"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";

const mockData = {
  wards: {
    type: "wards",
    items: [
      { name: "Ward A", count: 150 },
      { name: "Ward B", count: 200 },
      { name: "Ward C", count: 175 },
      { name: "Ward D", count: 225 },
      { name: "Ward E", count: 190 },
    ],
  },
  compounds: {
    type: "compounds",
    items: [
      { name: "Compound 1", count: 80 },
      { name: "Compound 2", count: 120 },
      { name: "Compound 3", count: 95 },
      { name: "Compound 4", count: 110 },
      { name: "Compound 5", count: 105 },
    ],
  },
  professions: {
    type: "professions",
    items: [
      { name: "Doctor", count: 50 },
      { name: "Teacher", count: 75 },
      { name: "Engineer", count: 60 },
      { name: "Nurse", count: 80 },
      { name: "Accountant", count: 45 },
    ],
  },
};

export async function fetchReportData(type) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockData[type];
}

export default function ReportSummary() {
  const [reportType, setReportType] = useState("wards");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadReportData() {
      setLoading(true);
      try {
        const data = await fetchReportData(reportType);
        setReportData(data);
      } catch (error) {
        console.error("Failed to fetch report data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReportData();
  }, [reportType]);

  const handleReportTypeChange = (value) => {
    setReportType(value);
  };

  return (
    <div className="p-10">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Report Summary</CardTitle>
          <CardDescription className="text-lg">
            Select a report type to view the summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Select onValueChange={handleReportTypeChange} value={reportType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wards">Wards</SelectItem>
                <SelectItem value="compounds">Compounds</SelectItem>
                <SelectItem value="professions">Professions</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : reportData ? (
            <ChartContainer
              config={{
                count: {
                  label: "Count",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reportData.items}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="text-center">No data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
