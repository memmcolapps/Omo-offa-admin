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
import { useRouter } from "next/navigation";

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
import useGetReport from "../hooks/useGetReport";
import MaxContainer from "../components/common/maxcontainer";

export default function ReportSummary() {
  const [reportType, setReportType] = useState("wardName");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data, getReport } = useGetReport();
  const router = useRouter();

  useEffect(() => {
    async function loadReportData() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
        } else {
          await getReport(token, reportType);
        }
      } catch (error) {
        console.error("Failed to fetch report data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReportData();
  }, [reportType]);

  useEffect(() => {
    if (data) {
      setReportData(data);
      console.log(data);
    }
  }, [data]);

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
              <SelectTrigger className="w-[180px] text-xl">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wardName" className="text-xl">
                  Wards
                </SelectItem>
                <SelectItem value="compoundName" className="text-xl">
                  Compounds
                </SelectItem>
                <SelectItem value="occupation" className="text-xl">
                  Professions
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : reportData ? (
            <MaxContainer>
              <ChartContainer
                config={{
                  count: {
                    label: "Count",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[400px] w-[95%]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reportData.report}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" className="text-[1rem] font-black" />
                    <YAxis className="text-[1.3rem]" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </MaxContainer>
          ) : (
            <div className="text-center">No data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
