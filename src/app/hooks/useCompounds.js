"use client";
import { useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";

import useFetchAPI from "./useFetch";

const useCompounds = () => {
  const fetchAPI = useFetchAPI();
  const [compounds, setCompounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const queryRef = useRef({ page: 1, limit: 25, search: "" });
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadCompounds = useCallback(async (options = {}) => {
    try {
      setLoading(true);
      const queryValues = { ...queryRef.current, ...options };
      queryRef.current = queryValues;
      const query = new URLSearchParams({
        page: String(queryValues.page),
        limit: String(queryValues.limit),
      });
      if (queryValues.search.trim()) {
        query.set("search", queryValues.search.trim());
      }
      const response = await fetchAPI(
        `api/v1/admin/compounds?${query.toString()}`,
        {},
      );
      const data = await response.json();
      if (data.success) {
        setCompounds(data.compounds);
        setPagination({
          currentPage: data.pagination?.currentPage || 1,
          totalItems: data.pagination?.totalItems || 0,
          totalPages: data.pagination?.totalPages || 1,
          hasNextPage: data.pagination?.hasNextPage || false,
          hasPreviousPage: data.pagination?.hasPreviousPage || false,
        });
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
        await loadCompounds();
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
        await loadCompounds();
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
        await loadCompounds();
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
    pagination,
    loadCompounds,
  };
};

export default useCompounds;
