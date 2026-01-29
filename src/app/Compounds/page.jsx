"use client";
import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";

const initialCompounds = [
  {
    id: "c1",
    name: "Water",
  },
  { id: "c2", name: "Ethanol" },
];

export default function CompoundsPage() {
  const [compounds, setCompounds] = useState(initialCompounds);
  const [form, setForm] = useState({ id: "", name: "" });
  const [isEditing, setIsEditing] = useState(false);
  // UI helpers: search and pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 25;

  const resetForm = () => {
    setForm({ id: "", name: "" });
    setIsEditing(false);
  };

  const addCompound = () => {
    if (!form.name.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      name: form.name.trim(),
    };
    setCompounds((prev) => [...prev, newItem]);
    resetForm();
  };

  const startEdit = (compound) => {
    setForm({ id: compound.id, name: compound.name });
    setIsEditing(true);
  };

  const updateCompound = () => {
    if (!form.id) return;
    setCompounds((prev) =>
      prev.map((c) => (c.id === form.id ? { ...c, name: form.name } : c)),
    );
    resetForm();
  };

  const deleteCompound = (id) => {
    setCompounds((prev) => prev.filter((c) => c.id !== id));
  };

  const canSubmit = form.name.trim();

  const handleInput = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  // Filtering and pagination logic
  const filteredCompounds = compounds.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCompounds.length / PER_PAGE),
  );
  const paginatedCompounds = filteredCompounds.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  return (
    <div className="container mx-auto p-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add Compound</CardTitle>
          <CardDescription>Create a new compound entry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={handleInput("name")}
            />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button
              className="flex items-center"
              onClick={isEditing ? updateCompound : addCompound}
              disabled={!canSubmit && !isEditing}
            >
              {isEditing ? (
                <span>Update Compound</span>
              ) : (
                <span>Add Compound</span>
              )}
            </Button>
            {isEditing && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Compounds</CardTitle>
          <CardDescription className="text-lg">
            Manage compounds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <Input
              placeholder="Search compounds"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <span className="text-sm text-muted-foreground ml-2 hidden sm:inline">
              {filteredCompounds.length} results
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCompounds.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell className="flex justify-end w-full">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(c)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteCompound(c.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
