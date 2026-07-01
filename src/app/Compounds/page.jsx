"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import useCompounds from "../hooks/useCompounds";

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

export default function CompoundsPage() {
  const {
    compounds,
    addCompound,
    updateCompound,
    deleteCompound,
    loading,
    pagination,
    loadCompounds,
  } = useCompounds();
  const [form, setForm] = useState({ id: "", name: "" });
  const [isEditing, setIsEditing] = useState(false);
  // UI helpers: search and pagination
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 25;

  const resetForm = () => {
    setForm({ id: "", name: "" });
    setIsEditing(false);
  };

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    await addCompound?.(form.name.trim());
    resetForm();
  };

  const startEdit = (compound) => {
    setForm({ id: compound.id, name: compound.name });
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (!form.id) return;
    await updateCompound?.(form.id, form.name);
    resetForm();
  };

  const handleDelete = async (id) => {
    await deleteCompound?.(id);
  };

  const canSubmit = form.name.trim();

  const handleInput = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    loadCompounds({
      page: currentPage,
      limit: PER_PAGE,
      search: debouncedSearch,
    });
  }, [currentPage, debouncedSearch, loadCompounds]);

  const totalPages = pagination.totalPages || 1;

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
              onClick={isEditing ? handleUpdate : handleAdd}
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
              {pagination.totalItems} results
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
              {compounds.map((c) => (
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
                        onClick={() => handleDelete(c.id)}
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
                disabled={!pagination.hasNextPage || loading}
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
