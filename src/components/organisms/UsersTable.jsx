import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Users from "@/components/pages/Users";
import FormField from "@/components/molecules/FormField";
import SearchBar from "@/components/molecules/SearchBar";
import TableHeader from "@/components/molecules/TableHeader";
import userService from "@/services/api/userService";
import planService from "@/services/api/planService";
const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    currentPlanId: "",
    status: "active"
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
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
  const handleAddUser = () => {
    setFormData({
      email: "",
      currentPlanId: "",
      status: "active"
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      currentPlanId: user.currentPlanId,
      status: user.status
    });
    setFormErrors({});
    setShowEditModal(true);
    setOpenDropdown(null);
  };

  const handleViewUser = (user) => {
    toast.info(`Viewing user: ${user.email}`);
    setOpenDropdown(null);
  };

  const handleDeleteUser = async (user) => {
    if (confirm(`Are you sure you want to delete user ${user.email}?`)) {
      try {
        await userService.delete(user.Id);
        toast.success("User deleted successfully");
        loadData();
      } catch (err) {
        toast.error("Failed to delete user");
      }
    }
    setOpenDropdown(null);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.currentPlanId) {
      errors.currentPlanId = "Plan selection is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      if (showEditModal && selectedUser) {
        await userService.update(selectedUser.Id, {
          email: formData.email,
          currentPlanId: parseInt(formData.currentPlanId),
          status: formData.status
        });
        toast.success("User updated successfully");
        setShowEditModal(false);
      } else {
        await userService.create({
          email: formData.email,
          currentPlanId: parseInt(formData.currentPlanId),
          status: formData.status
        });
        toast.success("User created successfully");
        setShowAddModal(false);
      }
      
      loadData();
      setSelectedUser(null);
    } catch (err) {
      toast.error(`Failed to ${showEditModal ? 'update' : 'create'} user`);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedUser(null);
    setFormData({
      email: "",
      currentPlanId: "",
      status: "active"
    });
    setFormErrors({});
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
              <Button onClick={handleAddUser} className="bg-primary hover:bg-primary/90 transition-colors">
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
                      <div className="relative">
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={() => setOpenDropdown(openDropdown === user.Id ? null : user.Id)}
                          className="hover:bg-gray-100 transition-colors"
                        >
                          <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
                        </Button>
                        
                        {openDropdown === user.Id && (
                          <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleViewUser(user)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                                Edit User
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                              >
                                <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                                Delete User
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
      </CardContent>
    </Card>

    {/* Add User Modal */}
    {showAddModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold font-manrope text-gray-900">Add New User</h2>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <FormField
                label="Email Address"
                required
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                error={formErrors.email}
              />
              
              <FormField
                label="Plan"
                required
                error={formErrors.currentPlanId}
              >
                <select
                  value={formData.currentPlanId}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPlanId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a plan</option>
                  {plans.map(plan => (
                    <option key={plan.Id} value={plan.Id}>{plan.name}</option>
                  ))}
                </select>
              </FormField>
              
              <FormField
                label="Status"
                required
              >
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </FormField>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create User"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}

    {/* Edit User Modal */}
    {showEditModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold font-manrope text-gray-900">Edit User</h2>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <FormField
                label="Email Address"
                required
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                error={formErrors.email}
              />
              
              <FormField
                label="Plan"
                required
                error={formErrors.currentPlanId}
              >
                <select
                  value={formData.currentPlanId}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPlanId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a plan</option>
                  {plans.map(plan => (
                    <option key={plan.Id} value={plan.Id}>{plan.name}</option>
                  ))}
                </select>
              </FormField>
              
              <FormField
                label="Status"
                required
              >
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </FormField>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Updating..." : "Update User"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}

    {/* Click outside to close dropdown */}
    {openDropdown && (
      <div 
        className="fixed inset-0 z-5" 
        onClick={() => setOpenDropdown(null)}
      />
)}
    </>
  );
};

export default UsersTable;