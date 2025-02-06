"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";

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
import { cn } from "../../lib/utils";

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
    id: "category",
    label: "Category",
    type: "select",
    options: ["Personal", "Business", "Education", "Healthcare", "Finance"],
  },
  {
    id: "ninStatus",
    label: "NIN Status",
    type: "select",
    options: ["Verified", "Pending", "Rejected", "Not Submitted"],
  },
  {
    id: "idCardStatus",
    label: "ID card status",
    type: "select",
    options: ["Active", "Expired", "Processing", "Not Available"],
  },
];

export default function FilterPage() {
  const [values, setValues] = useState({});

  const handleClear = (fieldId) => {
    setValues((prev) => {
      const newValues = { ...prev };
      delete newValues[fieldId];
      return newValues;
    });
  };

  const handleReset = () => {
    setValues({});
  };

  const handleApply = () => {
    console.log("Applied filters:", values);
    // Handle filter application logic here
  };

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
                              onSelect={(date) =>
                                setValues((prev) => ({
                                  ...prev,
                                  [field.id]: date,
                                }))
                              }
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
                      onValueChange={(value) =>
                        setValues((prev) => ({ ...prev, [field.id]: value }))
                      }
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
              Reset
            </Button>
            <Button
              className="bg-green-800 hover:bg-green-900 text-white"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Debug: Show current filters */}
      {Object.keys(values).length > 0 && (
        <pre className="mt-4 p-4 bg-gray-100 rounded">
          {JSON.stringify(values, null, 2)}
        </pre>
      )}
    </div>
  );
}
