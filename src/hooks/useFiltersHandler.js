import { cloneDeep } from "lodash";
import React, { useCallback, useState } from "react";

const useFiltersHandler = (initialFilters) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleChangePage = useCallback((page) => {
    setFilters((prev) => {
      const nextFilters = cloneDeep(prev);
      if (nextFilters) {
        nextFilters["page"] = page;
      }

      return nextFilters;
    });
  }, []);

  const handleSearch = useCallback((nextFilters) => {
    const nextFiltersTemp = cloneDeep(nextFilters);
    if ("page" in nextFiltersTemp) {
      nextFiltersTemp["page"] = 1;
    }

    setFilters(nextFiltersTemp);
  }, []);

  return {
    filters,
    handleChangePage,
    handleSearch,
  };
};

export default useFiltersHandler;
