"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import useGetAdmins from "../hooks/useGetAdmins";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default function AdminManagement() {
  const { getAdmins, data, loading } = useGetAdmins();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState({
    operator: { add: false, view: false, edit: false, delete: false },
    audit: { view: false },
    user: { view: false, edit: false, approve: false },
    reports: { generate: false, view: false },
  });
  const [adminOperators, setAdminOperators] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      getAdmins(token);
    }
  }, []);

  useEffect(() => {
    if (data) {
      setAdminOperators(data.admins);
    }
  }, [data]);

  const handlePermissionChange = (category, permission) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permission]: !prev[category][permission],
      },
    }));
  };

  const handleAddOperator = () => {
    if (email && password) {
      const newOperator = { email, password, permissions };
      setAdminOperators([...adminOperators, newOperator]);
      setEmail("");
      setPassword("");
      setPermissions({
        operator: { add: false, view: false, edit: false, delete: false },
        audit: { view: false },
        user: { view: false, edit: false, approve: false },
        reports: { generate: false, view: false },
      });
    }
  };

  const handleDeleteOperator = (index) => {
    console.log(adminOperators[index]);
  };

  return (
    <div className="container mx-auto p-10 pt-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add Admin Operator</CardTitle>
          <CardDescription>Create a new admin operator account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-14">
            <div className="grid grid-cols-2 gap-6 text-lg">
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-80 grid grid-cols-2 gap-6">
              {Object.entries(permissions).map(([category, perms]) => (
                <div key={category} className="space-y-2">
                  <h3 className="font-semibold capitalize text-xl">
                    {category}
                  </h3>
                  {Object.entries(perms).map(([permission, value]) => (
                    <div
                      key={`${category}-${permission}`}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`${category}-${permission}`}
                        checked={value}
                        onCheckedChange={() =>
                          handlePermissionChange(category, permission)
                        }
                      />
                      <label
                        htmlFor={`${category}-${permission}`}
                        className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <Button onClick={handleAddOperator}>
              <Plus className="mr-2 h-4 w-4" /> Add Operator
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Admin Operators</CardTitle>
          <CardDescription className="text-lg">
            Manage existing admin operators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="text-xl  text-gray-500">
                <TableHead>Email</TableHead>
                <TableHead>Admin Type</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-lg">
              {adminOperators?.map((operator, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{operator.email}</TableCell>
                    <TableCell>{operator.adminType}</TableCell>
                    <TableCell>
                      {operator.permissions ? (
                        Object.entries(operator.permissions).map(
                          ([category, perms]) => (
                            <div key={category} className="mb-2">
                              <span className="font-semibold capitalize">
                                {category}:{" "}
                              </span>
                              {Object?.entries(perms)
                                .filter(([, value]) => value)
                                .map(([permission]) => permission)
                                .join(", ")}
                            </div>
                          )
                        )
                      ) : (
                        <div>No permissions available</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteOperator(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
