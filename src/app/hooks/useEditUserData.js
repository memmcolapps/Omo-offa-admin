"use client";
import useFetchAPI from "./useFetch";
import { useState } from "react";
import { toast } from "react-toastify";

const useEditUderData = () => {
  const fetchAPI = useFetchAPI();
  const [data, setData] = useState({});
  const [editLoading, setLoading] = useState(false);

  /**
   *
   * @param {*} formData
   * @param {*} offaNimiId
   * @param {*} token
   */

  const editData = async (formData, offaNimiId, token) => {
    try {
      setLoading(true);
      const userData = { ...formData, offaNimiId };
      const response = await fetchAPI("api/v1/user/edit-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userData }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        toast.success("User data updated successfully");
      } else {
        toast.error("User data not updated");
      }

      setData(responseData);
    } catch (error) {
      const networkError = error.message || "Network error";
      toast.error(networkError);
      console.error("Network Error:", networkError);
    } finally {
      setLoading(false);
    }
  };

  return { editData };
};

export default useEditUderData;
