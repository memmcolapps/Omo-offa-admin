"use client";

import { useCallback, useState } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { cn } from "../../lib/utils";
import useGenerateReport from "../hooks/useGenerateReport";
import { downloadCSV } from "../funcs/DownloadReport";

const filterFields = [
  {
    id: "dateFrom",
    label: "From",
    type: "date",
  },
  {
    id: "dateTo",
    label: "To",
    type: "date",
  },

  {
    id: "ward",
    label: "Ward",
    type: "select",
    options: [
      "Asalofa",
      "Balogun",
      "Essa",
      "Ojomu",
      "Shawo",
    ],
  },
  {
    id: "title",
    label: "Title",
    type: "select",
    options: ["MR", "MRS", "MISS", "DR", "PROF", "ENGR", "CHIEF"],
  },
  {
    id: "maritalStatus",
    label: "Marital Status",
    type: "select",
    options: ["Single", "Married", "Widowed", "Divorced"],
  },
  {
    id: "verificationStatus",
    label: "Verification Status",
    type: "select",
    options: ["APPROVED", "PENDING", "REJECTED"],
  },
  {
    id: "idPayment",
    label: "ID card Payment Status",
    type: "select",
    options: ["True", "False"],
  },
];

export default function FilterPage() {
  const router = useRouter();
  const [values, setValues] = useState({});
  const [error, setError] = useState(null);
  const {
    generateReport,
    data,
    loading,
    error: reportError,
  } = useGenerateReport();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const validateDates = () => {
    if (values.dateFrom && values.dateTo) {
      if (values.dateFrom > values.dateTo) {
        setError("Start date must be before end date");
        return false;
      }
    }
    return true;
  };

  const handleClear = (fieldId) => {
    setValues((prev) => {
      const newValues = { ...prev };
      delete newValues[fieldId];
      return newValues;
    });
    setError(null);
  };

  const handleReset = () => {
    if (Object.keys(values).length === 0) return;

    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }

    setValues({});
    setError(null);
    setShowResetConfirm(false);
  };

  const handleApply = useCallback(async () => {
    try {
      setError(null);
      if (!validateDates()) return;

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const result = await generateReport(token, values);

      if (result && result.length > 0) {
        const shouldDownload = window.confirm(
          "Report generated successfully. Download now?"
        );
        if (shouldDownload) {
          downloadCSV(result);
        }
      } else {
        setError("No data found for the selected filters");
      }
    } catch (err) {
      setError(err.message || "Failed to generate report");
    }
  }, [generateReport, values, router]);

  return (
    <div className="mx-auto p-8 max-w-7xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Filter</CardTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {(error || reportError) && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error || reportError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {filterFields
                  .filter((field) => field.type === "date")
                  .map((field) => (
                    <div key={field.id}>
                      <label className="text-sm font-medium">
                        {field.label}
                      </label>
                      <div className="flex items-center justify-between mt-1.5">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !values[field.id] && "text-muted-foreground"
                              )}
                            >
                              {values[field.id] ? (
                                format(values[field.id], "PPP")
                              ) : (
                                <span>Choose Date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={values[field.id]}
                              onSelect={(date) => {
                                setValues((prev) => ({
                                  ...prev,
                                  [field.id]: date,
                                }));
                                setError(null);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        {values[field.id] && (
                          <Button
                            variant="ghost"
                            className="px-2 text-red-500 hover:text-red-600"
                            onClick={() => handleClear(field.id)}
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
              {filterFields
                .filter((field) => field.type === "select")
                .map((field) => (
                  <div key={field.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium">
                        {field.label}
                      </label>
                      {values[field.id] && (
                        <Button
                          variant="ghost"
                          className="px-2 text-red-500 hover:text-red-600"
                          onClick={() => handleClear(field.id)}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    <Select
                      value={values[field.id]}
                      onValueChange={(value) => {
                        setValues((prev) => ({ ...prev, [field.id]: value }));
                        setError(null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <Button
              variant="secondary"
              className="bg-green-50 hover:bg-green-100 text-black"
              onClick={handleReset}
            >
              {showResetConfirm ? "Click again to confirm reset" : "Reset"}
            </Button>
            <Button
              className="bg-green-800 hover:bg-green-900 text-white"
              onClick={handleApply}
              disabled={loading}
            >
              {loading ? "Generating..." : "Apply"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {process.env.NODE_ENV === "development" &&
        Object.keys(values).length > 0 && (
          <pre className="mt-4 p-4 bg-gray-100 rounded">
            {JSON.stringify(values, null, 2)}
          </pre>
        )}
    </div>
  );
}
