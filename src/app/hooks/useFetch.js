"use client";

const useFetchAPI = () => {
  const fetchAPI = async (endpoint, options) => {
    try {
      const response = await fetch(
        `https://octopus-app-8k2vt.ondigitalocean.app/${endpoint}`,
        options
      );

      if (!response.ok) {
        let error = await response.json();
        error = error.error;
        throw new Error(`Error: ${response.status} - ${error}`);
      }

      return response;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  return fetchAPI;
};

export default useFetchAPI;
