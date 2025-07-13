import React from "react";
import ApperIcon from "@/components/ApperIcon";

const TableHeader = ({ column, sortKey, sortDirection, onSort, children }) => {
  const isActive = sortKey === column;
  
  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      onClick={() => onSort && onSort(column)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {onSort && (
          <ApperIcon 
            name={isActive && sortDirection === "desc" ? "ChevronDown" : "ChevronUp"} 
            className={`w-4 h-4 transition-colors duration-200 ${
              isActive ? "text-primary" : "text-gray-400"
            }`} 
          />
        )}
      </div>
    </th>
  );
};

export default TableHeader;