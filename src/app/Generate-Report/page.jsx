"use client";
import { use, useState } from "react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function ReportGenerator() {
  const [reportData, setReportData] = useState({
    ward: "",
    profession: "",
    gender: "",
    age: "",
    country: "",
  });
  const [generatedReport, setGeneratedReport] = useState("");

  const handleInputChange = (field, value) => {
    setReportData((prev) => ({ ...prev, [field]: value }));
  };

  const generateReport = () => {
    const report = Object.entries(reportData)
      .filter(([_, value]) => value !== "")
      .map(
        ([key, value]) =>
          `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
      )
      .join("\n");
    setGeneratedReport(report);
  };

  return (
    <div className="min-h-screen bg-[#F3FFF2] p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="sub_header_i">Report Generator</CardTitle>
          <CardDescription className="p_i">
            Enter the details to generate a report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ward" className="p_ii">
                  Ward
                </Label>
                <Input
                  id="ward"
                  value={reportData.ward}
                  onChange={(e) => handleInputChange("ward", e.target.value)}
                  className="p_ii"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profession" className="p_ii">
                  Profession
                </Label>
                <Input
                  id="profession"
                  value={reportData.profession}
                  onChange={(e) =>
                    handleInputChange("profession", e.target.value)
                  }
                  className="p_ii"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="p_ii">
                  Gender
                </Label>
                <Select
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger className="p_ii">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="p_ii">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={reportData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="p_ii"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="p_ii">
                  Country of Residence
                </Label>
                <Input
                  id="country"
                  value={reportData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="p_ii"
                />
              </div>
            </div>
            <Button
              onClick={generateReport}
              type="button"
              className="w-full p_ii"
            >
              Generate Report
            </Button>
          </form>
          {generatedReport && (
            <div className="mt-8">
              <h3 className="sub_header_ii mb-4">Generated Report</h3>
              <pre className="p_i bg-muted p-4 rounded-md whitespace-pre-wrap">
                {generatedReport}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
