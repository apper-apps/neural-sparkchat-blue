import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import TableHeader from "@/components/molecules/TableHeader";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import billingService from "@/services/api/billingService";

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("paidAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await billingService.getInvoices();
      setInvoices(data);
    } catch (err) {
      setError("Failed to load billing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      paid: "success",
      pending: "warning",
      failed: "error",
      refunded: "secondary"
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const filteredInvoices = invoices
    .filter(invoice => 
      invoice.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.stripeInvoiceId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];
      
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
      <div className="flex justify-center">
        <Error message={error} onRetry={loadInvoices} type="data" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-manrope text-gray-900 mb-2">
          Billing & Invoices
        </h1>
        <p className="text-gray-600">
          Track payments, invoices, and billing history
        </p>
      </div>

      <Card className="hover:shadow-xl transition-all duration-300">
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h3 className="text-lg font-semibold font-manrope text-gray-900">
                Invoice History
              </h3>
              <div className="flex items-center space-x-4">
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search invoices..."
                  className="w-64"
                />
                <Button>
                  <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="p-8">
              <Empty type="invoices" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeader column="stripeInvoiceId" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort}>
                      Invoice ID
                    </TableHeader>
                    <TableHeader column="userEmail" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort}>
                      Customer
                    </TableHeader>
                    <TableHeader column="amount" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort}>
                      Amount
                    </TableHeader>
                    <TableHeader column="status" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort}>
                      Status
                    </TableHeader>
                    <TableHeader column="paidAt" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort}>
                      Date
                    </TableHeader>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.Id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.stripeInvoiceId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                            <ApperIcon name="User" className="w-4 h-4 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{invoice.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          ${invoice.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <ApperIcon name="Eye" className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ApperIcon name="Download" className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;