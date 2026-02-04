"use client";
import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";

export function EditPermissionDialog({ isOpen, onClose, operator, onSave }) {
  const [permissions, setPermissions] = useState(operator?.permissions || {});

  useEffect(() => {
    if (operator) {
      const completePermissions = {
        ...operator.permissions,
        compounds: { view: false },
      };
      setPermissions(completePermissions);
    }
  }, [operator]);

  const handlePermissionChange = (category, permission) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permission]: !prev[category][permission],
      },
    }));
  };

  const handleSave = () => {
    onSave(permissions);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-10">
        <DialogHeader>
          <DialogTitle>Edit Permissions</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(permissions).map(([category, perms]) => (
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
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
