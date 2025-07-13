import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Users", href: "/users", icon: "Users" },
    { name: "Plans", href: "/plans", icon: "Package" },
    { name: "Billing", href: "/billing", icon: "CreditCard" },
    { name: "Analytics", href: "/analytics", icon: "BarChart3" },
    { name: "Settings", href: "/settings", icon: "Settings" }
  ];

  return (
    <>
{/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
        <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-manrope bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  SparkChat
                </h1>
                <p className="text-xs text-gray-500">Hub</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-8 px-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
cn(
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <ApperIcon
                        name={item.icon}
                        className={cn(
"mr-3 h-5 w-5 transition-colors duration-200",
                          isActive ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-primary"
                        )}
                      />
                      {item.name}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
<div className={cn(
          "absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <ApperIcon name="Zap" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-manrope bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    SparkChat
                  </h1>
<p className="text-xs text-gray-500 dark:text-gray-400">Hub</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <ApperIcon name="X" className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
          
          <nav className="mt-8 px-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
cn(
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <ApperIcon
                        name={item.icon}
className={cn(
                          "mr-3 h-5 w-5 transition-colors duration-200",
                          isActive ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-primary"
                        )}
                      />
                      {item.name}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;