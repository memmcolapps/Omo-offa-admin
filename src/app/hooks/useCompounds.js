"use client";
import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";

import useFetchAPI from "./useFetch";

const useCompounds = () => {
  const fetchAPI = useFetchAPI();
  const [compounds, setCompounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadCompounds = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAPI("api/v1/admin/compounds", {});
      const data = await response.json();
      if (data.success) {
        setCompounds(data.compounds);
      } else {
        setError(data.message || "Failed to load compounds");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, [fetchAPI]);

  const addCompound = async (name) => {
    try {
      setLoading(true);
      const response = await fetchAPI("api/v1/admin/compounds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (data.success) {
        setCompounds((prev) => [...prev, data.compound]);
        toast.success("Compound added successfully");
      } else {
        toast.error(data.message || "Failed to add compound");
      }
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const updateCompound = async (id, name) => {
    try {
      setLoading(true);
      const response = await fetchAPI(`api/v1/admin/compounds/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (data.success) {
        setCompounds((prev) =>
          prev.map((compound) =>
            compound.id === id ? { ...compound, name } : compound,
          ),
        );
        toast.success("Compound updated successfully");
      } else {
        toast.error(data.message || "Failed to update compound");
      }
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const deleteCompound = async (id) => {
    try {
      setLoading(true);
      const response = await fetchAPI(`api/v1/admin/compounds/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCompounds((prev) => prev.filter((compound) => compound.id !== id));
        toast.success("Compound deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete compound");
      }
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return {
    compounds,
    addCompound,
    updateCompound,
    deleteCompound,

    loading,
    error,
    loadCompounds,
  };
};

export default useCompounds;
