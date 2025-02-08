"use client";
import { useState } from "react";
import { toast } from "react-toastify";

import useFetchAPI from "./useFetch";

const useEditPermission = () => {
  const fetchAPI = useFetchAPI();
  const [loading, setLoading] = useState(false);

  /**
   *
   * @param {*} token
   * @param {*} id
   * @param {*} data
   */

  const editPermission = async (token, email, permissions) => {
    try {
      setLoading(true);
      const response = await fetchAPI(
        `api/v1/admin/edit-operator-permissions`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, permissions }),
        }
      );

      const responseData = await response.json();

      if (responseData.success) {
        toast.success("Permission updated successfully");
      } else {
        toast.error("Permission not updated");
      }
    } catch (error) {
      const networkError = error.message || "Network error";
      toast.error(networkError);
    } finally {
      setLoading(false);
    }
  };

  return { editPermission, loading };
};

export default useEditPermission;
