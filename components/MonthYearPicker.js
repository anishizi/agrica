// components/MonthYearPicker.js
import React, { useState } from "react";

const MonthYearPicker = ({ selectedMonth, selectedYear, onChange }) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const years = Array.from({ length: 10 }, (_, index) => new Date().getFullYear() + index); // Next 10 years

  const handleMonthChange = (e) => {
    const month = e.target.value;
    onChange(new Date(selectedYear, month));
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    onChange(new Date(year, selectedMonth));
  };

  return (
    <div className="flex flex-col space-y-2">
      <select
        value={selectedMonth}
        onChange={handleMonthChange}
        className="border rounded p-2 w-full"
      >
        {months.map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>
      <select
        value={selectedYear}
        onChange={handleYearChange}
        className="border rounded p-2 w-full"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthYearPicker;
