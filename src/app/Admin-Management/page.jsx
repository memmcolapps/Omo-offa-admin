"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { redirect } from "next/navigation";
import { BadgeX, Pencil, Plus } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import useGetAdmins from "../hooks/useGetAdmins";
import useDeleteOperator from "../hooks/useDeleteOperator";
import useAddAdminOperator from "../hooks/useAddAdminOperator";
import useEditPermission from "../hooks/useEditPermission";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { EditPermissionDialog } from "../components/common/editPermissionDialog";

const INITIAL_PERMISSIONS = {
  audit: { view: false },
  user: { view: false, edit: false, approve: false },
  reports: { generate: false, view: false },
  compounds: { view: false },
};

export default function AdminManagement() {
  const { getAdmins, data, loading } = useGetAdmins();
  const { deleteOperator, loading: deleting } = useDeleteOperator();
  const { editPermission } = useEditPermission();
  const { addAdminOperator, loading: adding } = useAddAdminOperator();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    permissions: INITIAL_PERMISSIONS,
  });
  const [adminOperators, setAdminOperators] = useState([]);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    selectedOperator: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      redirect("/");
    }
    getAdmins(token);
  }, [getAdmins]);

  useEffect(() => {
    if (data?.admins) {
      setAdminOperators(data.admins);
    }
  }, [data]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handlePermissionChange = useCallback((category, permission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [category]: {
          ...prev.permissions[category],
          [permission]: !prev.permissions[category][permission],
        },
      },
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      email: "",
      password: "",
      permissions: INITIAL_PERMISSIONS,
    });
  }, []);

  const handleAddOperator = useCallback(async () => {
    const { email, password, permissions } = formData;
    if (!email || !password) return;

    const token = localStorage.getItem("token");
    if (!token) {
      redirect("/");
    }

    const newOperator = { email, password, permissions };
    await addAdminOperator(token, newOperator);

    setAdminOperators((prev) => [
      ...prev,
      { ...newOperator, adminType: "operator" },
    ]);
    resetForm();
  }, [formData, addAdminOperator, resetForm]);

  const handleDeleteOperator = useCallback(
    async (index) => {
      const token = localStorage.getItem("token");
      if (!token) {
        redirect("/");
        return;
      }

      const operatorToDelete = adminOperators[index];
      if (operatorToDelete?.id) {
        await deleteOperator(token, operatorToDelete.id);
        setAdminOperators((prev) =>
          prev.filter((op) => op.id !== operatorToDelete.id)
        );
      }
    },
    [adminOperators, deleteOperator]
  );

  const handleEditOperator = useCallback(
    (index) => {
      setDialogState({
        isOpen: true,
        selectedOperator: adminOperators[index],
      });
    },
    [adminOperators]
  );

  const handleSavePermissions = useCallback(
    async (updatedPermissions) => {
      const token = localStorage.getItem("token");
      if (!token || !dialogState.selectedOperator) {
        redirect("/");
      }

      await editPermission(
        token,
        dialogState.selectedOperator.email,
        updatedPermissions
      );
      setAdminOperators((prev) =>
        prev.map((op) =>
          op.id === dialogState.selectedOperator.id
            ? { ...op, permissions: updatedPermissions }
            : op
        )
      );
    },
    [dialogState.selectedOperator, editPermission]
  );

  const permissionsSection = useMemo(
    () => (
      <div className="mt-8 grid grid-cols-2 gap-6">
        {Object.entries(formData.permissions).map(([category, perms]) => (
          <div key={category} className="space-y-2">
            <h3 className="font-semibold capitalize text-xl">{category}</h3>
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
    ),
    [formData.permissions, handlePermissionChange]
  );

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto p-10 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add Admin Operator</CardTitle>
            <CardDescription>
              Create a new admin operator account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6 text-lg">
                <Input
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
              </div>
              {permissionsSection}
              <Button
                onClick={handleAddOperator}
                disabled={adding || !formData.email || !formData.password}
              >
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
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="text-xl text-gray-500">
                    <TableHead>Email</TableHead>
                    <TableHead>Admin Type</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-lg">
                  {adminOperators?.map((operator, index) => (
                    <TableRow key={operator.id || index}>
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
                                {Object.entries(perms)
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
                        <div className="space-x-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteOperator(index)}
                            disabled={deleting}
                          >
                            <BadgeX className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditOperator(index)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <EditPermissionDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
        operator={dialogState.selectedOperator}
        onSave={handleSavePermissions}
      />
    </>
  );
}
