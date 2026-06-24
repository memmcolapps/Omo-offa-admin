"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  X,
  Send,
  Loader2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  History,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar as CalendarComponent } from "../components/ui/calendar";
import { Badge } from "../components/ui/badge";

const MAX_SMS_LENGTH = 160;
const PHONE_REGEX = /^(0[7-9][0-1][0-9]{8})$/;
const ITEMS_PER_PAGE = 20;
const MAX_DATE_RANGE_DAYS = 90;
const MAX_PHONE_NUMBERS = 500;
const API_BASE_URL = "https://octopus-app-8k2vt.ondigitalocean.app";

const isValidNigerianPhone = (phone) => {
  const cleaned = phone.replace(/\s/g, "");
  return PHONE_REGEX.test(cleaned);
};

const cleanPhoneNumber = (phone) => {
  return phone.replace(/\s/g, "").replace(/[^0-9]/g, "");
};

const getArray = (value) => (Array.isArray(value) ? value : []);

const getSubmissionSummary = (log) => {
  const invalid = getArray(log.invalidNumbers).length;
  const flooding = getArray(log.floodingNumbers).length;
  const insufficient = getArray(log.insufficientUnitNumbers).length;
  const dnd = getArray(log.dndNumbers).length;

  return { invalid, flooding, insufficient, dnd };
};

const getDeliverySummary = (reports = []) => {
  return reports.reduce((summary, report) => {
    const status = report.status || "UNKNOWN";
    summary[status] = (summary[status] || 0) + 1;
    return summary;
  }, {});
};

const getStatusBadge = (log, reports = []) => {
  const deliverySummary = getDeliverySummary(reports);
  const delivered = deliverySummary.DELIVERED || 0;
  const deliveryFailures = reports.length - delivered;
  const { invalid, flooding, insufficient } = getSubmissionSummary(log);

  if (reports.length > 0) {
    if (deliveryFailures === 0) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Delivered</Badge>
      );
    }

    if (delivered === 0) {
      return <Badge variant="destructive">Delivery Failed</Badge>;
    }

    return (
      <Badge className="bg-amber-500 hover:bg-amber-600">Mixed Delivery</Badge>
    );
  }

  if (insufficient > 0) {
    return <Badge variant="destructive">Insufficient Units</Badge>;
  }

  if (flooding > 0) {
    return <Badge variant="destructive">Flooding</Badge>;
  }

  if (invalid > 0) {
    return <Badge variant="destructive">Invalid Numbers</Badge>;
  }

  if (log.failedCount === 0) {
    return <Badge className="bg-green-500 hover:bg-green-600">Submitted</Badge>;
  }

  if (log.successfulCount === 0) {
    return <Badge variant="destructive">Submission Failed</Badge>;
  }

  return (
    <Badge className="bg-amber-500 hover:bg-amber-600">
      Partial Submission
    </Badge>
  );
};

const getUndeliveredRecipients = (log, reports = []) => {
  const delivered = new Set(
    reports
      .filter((report) => report.status === "DELIVERED")
      .map((report) => report.mobile),
  );
  const invalid = new Set(getArray(log.invalidNumbers));
  const insufficient = new Set(getArray(log.insufficientUnitNumbers));

  return getArray(log.normalizedRecipients).filter(
    (phone) =>
      !delivered.has(phone) && !invalid.has(phone) && !insufficient.has(phone),
  );
};

const renderNumberList = (title, numbers, className = "bg-gray-50") => {
  if (!numbers || numbers.length === 0) return null;

  return (
    <div className="border-t pt-4">
      <h4 className="font-medium mb-2">{title}</h4>
      <div
        className={`${className} rounded-lg p-3 max-h-[150px] overflow-y-auto space-y-1`}
      >
        {numbers.map((number, index) => (
          <div key={`${number}-${index}`} className="text-sm font-medium">
            {number}
          </div>
        ))}
      </div>
    </div>
  );
};

const BulkSMSPage = () => {
  const router = useRouter();
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // SMS Logs State
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [toDate, setToDate] = useState(new Date());
  const [selectedLog, setSelectedLog] = useState(null);
  const [deliveryReports, setDeliveryReports] = useState([]);
  const [deliveryReportsLoading, setDeliveryReportsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLogs = React.useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLogsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        from: fromDate.toISOString().split("T")[0],
        to: toDate.toISOString().split("T")[0],
      });

      const response = await fetch(
        `${API_BASE_URL}/api/v1/sms/logs?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.data) {
        setLogs(data.data.logs || []);
        setTotalPages(data.data.pagination?.totalPages || 1);
        setTotalLogs(data.data.pagination?.total || 0);
      }
    } catch (error) {
      toast.error("Failed to load SMS logs");
    } finally {
      setLogsLoading(false);
    }
  }, [currentPage, fromDate, toDate]);

  const fetchDeliveryReports = React.useCallback(async (log) => {
    const token = localStorage.getItem("token");
    if (!token || !log) return;

    const queryParams = new URLSearchParams();
    if (getArray(log.refIds).length > 0) {
      queryParams.set("refIds", log.refIds.join(","));
    }
    if (getArray(log.providerMessageIds).length > 0) {
      queryParams.set("providerMessageIds", log.providerMessageIds.join(","));
    }
    if (getArray(log.normalizedRecipients).length > 0) {
      queryParams.set("mobiles", log.normalizedRecipients.join(","));
    }

    if (!queryParams.toString()) {
      setDeliveryReports([]);
      return;
    }

    setDeliveryReportsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/sms/delivery-reports?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setDeliveryReports(data.data?.reports || []);
    } catch (error) {
      toast.error("Failed to load delivery reports");
      setDeliveryReports([]);
    } finally {
      setDeliveryReportsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      fetchLogs();
    }
  }, [router, fetchLogs]);

  const handleAddPhone = (value) => {
    if (phoneNumbers.length >= MAX_PHONE_NUMBERS) {
      toast.warning(`Maximum ${MAX_PHONE_NUMBERS} phone numbers allowed`);
      return;
    }

    const cleaned = cleanPhoneNumber(value);
    if (!cleaned) return;

    if (!isValidNigerianPhone(cleaned)) {
      toast.error(
        `Invalid phone number: ${value}. Must be 11 digits starting with 070, 080, 081, 090, or 091`,
      );
      return;
    }

    if (phoneNumbers.includes(cleaned)) {
      toast.warning(`Phone number ${cleaned} already added`);
      return;
    }

    setPhoneNumbers([...phoneNumbers, cleaned]);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddPhone(inputValue);
    } else if (
      e.key === "Backspace" &&
      !inputValue &&
      phoneNumbers.length > 0
    ) {
      const lastNumber = phoneNumbers[phoneNumbers.length - 1];
      setPhoneNumbers(phoneNumbers.slice(0, -1));
      setInputValue(lastNumber);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    const numbers = pastedData
      .split(/[,\n\s\t]+/)
      .map(cleanPhoneNumber)
      .filter((n) => n.length > 0);

    const validNumbers = [];
    const invalidNumbers = [];
    const duplicates = [];

    numbers.forEach((num) => {
      if (!isValidNigerianPhone(num)) {
        invalidNumbers.push(num);
      } else if (phoneNumbers.includes(num) || validNumbers.includes(num)) {
        duplicates.push(num);
      } else {
        validNumbers.push(num);
      }
    });

    if (validNumbers.length > 0) {
      setPhoneNumbers([...phoneNumbers, ...validNumbers]);
    }

    if (invalidNumbers.length > 0) {
      toast.error(
        `${invalidNumbers.length} invalid number(s) skipped: ${invalidNumbers.slice(0, 3).join(", ")}${invalidNumbers.length > 3 ? "..." : ""}`,
      );
    }

    if (duplicates.length > 0) {
      toast.warning(`${duplicates.length} duplicate number(s) skipped`);
    }

    setInputValue("");
  };

  const removePhone = (phoneToRemove) => {
    setPhoneNumbers(phoneNumbers.filter((phone) => phone !== phoneToRemove));
  };

  const handleSendSMS = async () => {
    if (phoneNumbers.length === 0) {
      toast.error("Please add at least one phone number");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required");
      router.push("/");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/sms/send-bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumbers,
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const data = await response.json();
      const { successful, failed, failures } = data.data;

      if (failed === 0) {
        toast.success(`SMS sent successfully to ${successful} recipient(s)`);
      } else if (successful === 0) {
        toast.error(`SMS failed for all ${failed} recipient(s)`);
      } else {
        toast.warning(`SMS sent: ${successful} successful, ${failed} failed`);
      }

      // Show failure details if any
      if (failures && failures.length > 0) {
        failures.forEach((failure) => {
          toast.error(`${failure.phone}: ${failure.reason}`, {
            autoClose: 5000,
          });
        });
      }

      // Reset form and refresh logs
      setPhoneNumbers([]);
      setMessage("");
      setInputValue("");
      fetchLogs();
    } catch (error) {
      toast.error(error.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendUndelivered = async () => {
    if (!selectedLog) return;

    const recipients = getUndeliveredRecipients(selectedLog, deliveryReports);
    if (recipients.length === 0) {
      toast.info("No undelivered recipients available for resend");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required");
      router.push("/");
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/sms/send-bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumbers: recipients,
          message: selectedLog.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const data = await response.json();
      toast.success(
        `Resend submitted: ${data.data.successful} successful, ${data.data.failed} failed`,
      );
      fetchLogs();
    } catch (error) {
      toast.error(error.message || "Unable to resend SMS");
    } finally {
      setIsResending(false);
    }
  };

  const handleClearFilters = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    setFromDate(thirtyDaysAgo);
    setToDate(today);
    setCurrentPage(1);
  };

  const handleFromDateChange = (date) => {
    if (date) {
      const maxToDate = new Date(date);
      maxToDate.setDate(maxToDate.getDate() + MAX_DATE_RANGE_DAYS);

      if (toDate > maxToDate) {
        setToDate(maxToDate);
      }
      setFromDate(date);
      setCurrentPage(1);
    }
  };

  const handleToDateChange = (date) => {
    if (date) {
      setToDate(date);
      setCurrentPage(1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRowClick = (log) => {
    setSelectedLog(log);
    setDeliveryReports([]);
    setIsModalOpen(true);
    fetchDeliveryReports(log);
  };

  const charCount = message.length;
  const isOverLimit = charCount > MAX_SMS_LENGTH;
  const isNearLimit =
    charCount > MAX_SMS_LENGTH - 20 && charCount <= MAX_SMS_LENGTH;

  return (
    <div className="container mx-auto p-10 space-y-8">
      <ToastContainer />

      {/* Send SMS Section */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Send className="h-6 w-6" />
            Bulk SMS
          </CardTitle>
          <CardDescription>
            Send SMS messages to multiple recipients at once
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Phone Numbers Section */}
          <div className="space-y-2">
            <Label htmlFor="phone-input">
              Phone Numbers <span className="text-red-500">*</span>
            </Label>
            <div
              className={`min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-within:ring-1 focus-within:ring-ring ${
                phoneNumbers.length > 0 ? "pb-2" : ""
              }`}
              onClick={() => inputRef.current?.focus()}
            >
              <div className="flex flex-wrap gap-2">
                {phoneNumbers.map((phone) => (
                  <span
                    key={phone}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#007250] text-white text-sm"
                  >
                    {phone}
                    <button
                      type="button"
                      onClick={() => removePhone(phone)}
                      className="hover:bg-[#005a3e] rounded-sm p-0.5 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <Input
                  ref={inputRef}
                  id="phone-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  placeholder={
                    phoneNumbers.length === 0
                      ? "Type phone number and press Enter"
                      : ""
                  }
                  className="flex-1 min-w-[150px] border-0 shadow-none focus-visible:ring-0 p-0 h-8 text-base"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>
                {phoneNumbers.length}/{MAX_PHONE_NUMBERS} number
                {phoneNumbers.length !== 1 ? "s" : ""} added
              </span>
              <span className="text-xs">Format: 08012345678 (11 digits)</span>
            </div>
          </div>

          {/* Message Section */}
          <div className="space-y-2">
            <Label htmlFor="message">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              rows={6}
              disabled={isLoading}
              className="resize-none"
            />
            <div className="flex justify-between items-center text-sm">
              <span
                className={`${
                  isOverLimit
                    ? "text-red-500 font-medium"
                    : isNearLimit
                      ? "text-amber-500"
                      : "text-muted-foreground"
                }`}
              >
                {charCount}/{MAX_SMS_LENGTH} characters
                {isOverLimit && " (exceeds limit)"}
              </span>
              {isOverLimit && (
                <span className="text-red-500 text-xs">
                  Message will be truncated
                </span>
              )}
            </div>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendSMS}
            disabled={isLoading || phoneNumbers.length === 0 || !message.trim()}
            className="w-full h-12 text-lg bg-[#007250] hover:bg-[#005a3e]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send SMS to {phoneNumbers.length} Recipient
                {phoneNumbers.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* SMS Logs Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <History className="h-5 w-5" />
            SMS History
          </CardTitle>
          <CardDescription>
            View past SMS messages and their delivery status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm">From:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[150px] justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "MMM dd, yyyy") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={fromDate}
                    onSelect={handleFromDateChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm">To:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[150px] justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "MMM dd, yyyy") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={toDate}
                    onSelect={handleToDateChange}
                    disabled={(date) =>
                      date > new Date() ||
                      (fromDate && date < fromDate) ||
                      (fromDate &&
                        (date - fromDate) / (1000 * 60 * 60 * 24) >
                          MAX_DATE_RANGE_DAYS)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="ml-auto"
            >
              Clear Filters
            </Button>
          </div>

          {/* Logs Table */}
          {logsLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-[#007250]" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No SMS logs found for the selected date range
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow
                        key={log.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleRowClick(log)}
                      >
                        <TableCell>
                          <div className="font-medium">
                            {log.recipientsCount} total
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {log.successfulCount} submitted · {log.failedCount}{" "}
                            failed
                          </div>
                          {getSubmissionSummary(log).dnd > 0 && (
                            <div className="text-xs text-amber-600">
                              {getSubmissionSummary(log).dnd} DND
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[300px] truncate">
                            {log.message}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getStatusBadge(log)}
                            <div className="text-xs text-muted-foreground">
                              Click for provider details
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(
                            new Date(log.createdAt),
                            "MMM dd, yyyy • h:mm a",
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalLogs)} of{" "}
                  {totalLogs} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1 || logsLoading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm px-3 py-1 bg-gray-100 rounded">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || logsLoading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>SMS Details</DialogTitle>
            <DialogDescription>
              View submission results, provider response, and delivery reports
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Current Status:
                </span>
                {getStatusBadge(selectedLog, deliveryReports)}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Resend undelivered</p>
                  <p className="text-xs text-muted-foreground">
                    {
                      getUndeliveredRecipients(selectedLog, deliveryReports)
                        .length
                    }{" "}
                    recipient
                    {getUndeliveredRecipients(selectedLog, deliveryReports)
                      .length === 1
                      ? ""
                      : "s"}{" "}
                    eligible for resend
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleResendUndelivered}
                  disabled={
                    isResending ||
                    deliveryReportsLoading ||
                    getUndeliveredRecipients(selectedLog, deliveryReports)
                      .length === 0
                  }
                  className="bg-[#007250] hover:bg-[#005a3e]"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Resend
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sent By:</span>
                <span className="font-medium">{selectedLog.adminEmail}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span>
                  {format(
                    new Date(selectedLog.createdAt),
                    "MMMM dd, yyyy 'at' h:mm a",
                  )}
                </span>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Submission Summary:</h4>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Total:</span>
                    <span className="font-medium">
                      {selectedLog.recipientsCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Submitted successfully:</span>
                    <span className="font-medium">
                      {selectedLog.successfulCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Submission failed:</span>
                    <span className="font-medium">
                      {selectedLog.failedCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Invalid:</span>
                    <span className="font-medium">
                      {getSubmissionSummary(selectedLog).invalid}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Flooding:</span>
                    <span className="font-medium">
                      {getSubmissionSummary(selectedLog).flooding}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Insufficient units:</span>
                    <span className="font-medium">
                      {getSubmissionSummary(selectedLog).insufficient}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-amber-600">
                    <span>DND:</span>
                    <span className="font-medium">
                      {getSubmissionSummary(selectedLog).dnd}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Delivery Reports:</h4>
                {deliveryReportsLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading delivery reports...
                  </div>
                ) : deliveryReports.length === 0 ? (
                  <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-700">
                    No delivery report received yet. SmartSMS may still be
                    processing, or the DLR callback has not posted for this
                    message.
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mobile</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Done</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deliveryReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">
                              {report.mobile}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  report.status === "DELIVERED"
                                    ? "bg-green-500 hover:bg-green-600"
                                    : ""
                                }
                                variant={
                                  report.status === "DELIVERED"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {report.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{report.description || "N/A"}</TableCell>
                            <TableCell>
                              {report.doneTime
                                ? format(
                                    new Date(report.doneTime),
                                    "MMM dd, yyyy • h:mm a",
                                  )
                                : "Pending"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {selectedLog.failedCount > 0 && selectedLog.failures && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Submission Failures:</h4>
                  <div className="bg-red-50 rounded-lg p-3 max-h-[150px] overflow-y-auto space-y-1">
                    {selectedLog.failures.map((failure, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{failure.phone}</span>
                        {failure.normalized && (
                          <span className="text-muted-foreground">
                            {" "}
                            ({failure.normalized})
                          </span>
                        )}
                        <span className="text-muted-foreground">
                          {" "}
                          - {failure.reason}
                        </span>
                        {failure.bucket && (
                          <Badge variant="outline" className="ml-2">
                            {failure.bucket}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {renderNumberList(
                "Invalid Numbers:",
                selectedLog.invalidNumbers,
                "bg-red-50",
              )}
              {renderNumberList(
                "Flooding Numbers:",
                selectedLog.floodingNumbers,
                "bg-red-50",
              )}
              {renderNumberList(
                "Insufficient Unit Numbers:",
                selectedLog.insufficientUnitNumbers,
                "bg-red-50",
              )}
              {renderNumberList(
                "DND Numbers:",
                selectedLog.dndNumbers,
                "bg-amber-50",
              )}
              {renderNumberList(
                "Normalized Recipients:",
                selectedLog.normalizedRecipients,
              )}

              {(getArray(selectedLog.refIds).length > 0 ||
                getArray(selectedLog.providerMessageIds).length > 0) && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Provider IDs:</h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                    {getArray(selectedLog.refIds).length > 0 && (
                      <div>
                        <span className="font-medium">Ref IDs:</span>{" "}
                        <span className="break-all">
                          {selectedLog.refIds.join(", ")}
                        </span>
                      </div>
                    )}
                    {getArray(selectedLog.providerMessageIds).length > 0 && (
                      <div>
                        <span className="font-medium">Message IDs:</span>{" "}
                        <span className="break-all">
                          {selectedLog.providerMessageIds.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Message:</h4>
                <div className="bg-gray-50 rounded-lg p-3 text-sm whitespace-pre-wrap">
                  {selectedLog.message}
                </div>
              </div>

              {getArray(selectedLog.providerResponses).length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Raw Provider Responses:</h4>
                  <div className="bg-gray-950 text-gray-50 rounded-lg p-3 max-h-[260px] overflow-auto text-xs">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.providerResponses, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkSMSPage;
