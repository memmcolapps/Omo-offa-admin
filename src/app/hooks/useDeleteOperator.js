"use client";
import { useState } from "react";
import { toast } from "react-toastify";

import useFetchAPI from "./useFetch";

const useDeleteOperator = () => {
  const fetchAPI = useFetchAPI();
  const [loading, setLoading] = useState(false);

  /**
   *
   * @param {*} token
   * @param {*} id
   */

  const deleteOperator = async (token, id) => {
    try {
      setLoading(true);
      const response = await fetchAPI(`api/v1/admin/delete-operator/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success("Operator deleted successfully");
      } else {
        toast.error("Operator not deleted");
      }
    } catch (error) {
      const networkError = error.message || "Network error";
      toast.error(networkError);
      console.error("Network Error:", networkError);
    } finally {
      setLoading(false);
    }
  };

  return { deleteOperator, loading };
};

export default useDeleteOperator;
