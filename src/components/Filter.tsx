"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function Filter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // State to store the temporary filter values before applying
  const [filters, setFilters] = useState({
    type: "",
    min: "",
    max: "",
    cat: "",
    sort: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);

    // Set all filters in the query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value); // Only set if a value exists
      else params.delete(key); // Remove empty filters
    });

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-12 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap gap-6">
        <select
          name="type"
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED] ring-1 ring-gray-400"
          value={filters.type}
          onChange={handleInputChange}
        >
          <option value="">Type</option>
          <option value="physical">Physical</option>
          <option value="digital">Digital</option>
        </select>

        <input
          type="text"
          name="min"
          placeholder="min price"
          className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"
          value={filters.min}
          onChange={handleInputChange}
        />

        <input
          type="text"
          name="max"
          placeholder="max price"
          className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"
          value={filters.max}
          onChange={handleInputChange}
        />

        <select
          name="cat"
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED] ring-1 ring-gray-400"
          value={filters.cat}
          onChange={handleInputChange}
        >
          <option value="">Category</option>
          <option value="new">New Arrival</option>
          <option value="popular">Popular</option>
        </select>

        <select
          name="sort"
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-white ring-1 ring-gray-400"
          value={filters.sort}
          onChange={handleInputChange}
        >
          <option value="">Sort By</option>
          <option value="asc price">Price (low to high)</option>
          <option value="desc price">Price (high to low)</option>
          <option value="asc lastUpdated">Newest</option>
          <option value="desc lastUpdated">Oldest</option>
        </select>
      </div>

      {/* Apply Button to trigger the filter updates */}
      <button
        className="py-2 px-6 bg-primary text-white rounded-2xl"
        onClick={handleApplyFilters}
      >
        Apply
      </button>
    </div>
  );
}
