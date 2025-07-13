import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useTheme } from "@/context/ThemeContext";

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  const { theme, toggleTheme, isDark } = useTheme();
return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden mr-2"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
</Button>
            <h1 className="text-2xl font-bold font-manrope text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>
<div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ApperIcon 
                name={isDark ? "Sun" : "Moon"} 
                className="w-5 h-5" 
              />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ApperIcon name="Bell" className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ApperIcon name="HelpCircle" className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;