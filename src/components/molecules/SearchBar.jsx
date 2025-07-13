import React from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ value, onChange, placeholder = "Search...", className }) => {
  return (
    <div className="relative">
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
      />
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`pl-10 ${className}`}
      />
    </div>
  );
};

export default SearchBar;