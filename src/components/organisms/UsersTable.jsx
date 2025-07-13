import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import TableHeader from "@/components/molecules/TableHeader";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import userService from "@/services/api/userService";
import planService from "@/services/api/planService";
import { toast } from "react-toastify";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [usersData, plansData] = await Promise.all([
        userService.getAll(),
        planService.getAll()
      ]);
      setUsers(usersData);
      setPlans(plansData);
    } catch (err) {
      setError("Failed to load users data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      await userService.suspendUser(userId);
      toast.success("User suspended successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to suspend user");
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await userService.activateUser(userId);
      toast.success("User activated successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to activate user");
    }
  };

  const getPlanName = (planId) => {
    const plan = plans.find(p => p.Id === planId);
    return plan ? plan.name : "Unknown Plan";
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      suspended: "warning", 
      cancelled: "error"
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const filteredUsers = users
    .filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPlanName(user.currentPlanId).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];
      
      if (sortKey === "planName") {
        aValue = getPlanName(a.currentPlanId);
        bValue = getPlanName(b.currentPlanId);
      }
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <Error message={error} onRetry={loadData} type="data" />
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <Empty type="users" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardContent className="p-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold font-manrope text-gray-900">
              Users Management
            </h3>
            <div className="flex items-center space-x-4">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-64"
              />
              <Button>
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader column="email" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort}>
                  Email
                </TableHeader>
                <TableHeader column="planName" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort}>
                  Plan
                </TableHeader>
                <TableHeader column="status" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort}>
                  Status
                </TableHeader>
                <TableHeader column="createdAt" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort}>
                  Created
                </TableHeader>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.Id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                        <ApperIcon name="User" className="w-4 h-4 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">ID: {user.Id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{getPlanName(user.currentPlanId)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {user.status === "active" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuspendUser(user.Id)}
                        >
                          <ApperIcon name="Pause" className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleActivateUser(user.Id)}
                        >
                          <ApperIcon name="Play" className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTable;