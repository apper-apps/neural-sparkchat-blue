import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Settings = () => {
  const [webhookSettings, setWebhookSettings] = useState({
    endpoint: "",
    events: [],
    secretKey: ""
  });
  
  const [emailSettings, setEmailSettings] = useState({
    provider: "mailgun",
    apiKey: "",
    domain: "",
    fromEmail: "noreply@sparkchat.app"
  });

  const [workspaceSettings, setWorkspaceSettings] = useState({
    name: "SparkChat Hub",
    domain: "sparkchat.app",
    brandingEnabled: false
  });

  const availableEvents = [
    { id: "user.created", name: "User Created" },
    { id: "subscription.created", name: "Subscription Created" },
    { id: "payment.succeeded", name: "Payment Succeeded" },
    { id: "payment.failed", name: "Payment Failed" },
    { id: "user.suspended", name: "User Suspended" }
  ];

  const emailProviders = [
    { id: "mailgun", name: "Mailgun" },
    { id: "sendgrid", name: "SendGrid" },
    { id: "aws-ses", name: "AWS SES" },
    { id: "postmark", name: "Postmark" }
  ];

  const handleEventToggle = (eventId) => {
    const currentEvents = [...webhookSettings.events];
    const index = currentEvents.indexOf(eventId);
    
    if (index > -1) {
      currentEvents.splice(index, 1);
    } else {
      currentEvents.push(eventId);
    }
    
    setWebhookSettings({ ...webhookSettings, events: currentEvents });
  };

  const handleSaveWebhooks = () => {
    toast.success("Webhook settings saved successfully");
  };

  const handleSaveEmail = () => {
    toast.success("Email settings saved successfully");
  };

  const handleSaveWorkspace = () => {
    toast.success("Workspace settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-manrope text-gray-900 mb-2">
          Settings
        </h1>
        <p className="text-gray-600">
          Configure your SparkChat Hub workspace and integrations
        </p>
      </div>

      {/* Workspace Settings */}
      <Card className="hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <h3 className="text-lg font-semibold font-manrope text-gray-900">
            Workspace Settings
          </h3>
          <p className="text-sm text-gray-600">
            Manage your workspace configuration and branding
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Workspace Name"
                value={workspaceSettings.name}
                onChange={(e) => setWorkspaceSettings({ ...workspaceSettings, name: e.target.value })}
              />
              <FormField
                label="Domain"
                value={workspaceSettings.domain}
                onChange={(e) => setWorkspaceSettings({ ...workspaceSettings, domain: e.target.value })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Custom Branding</h4>
                <p className="text-sm text-gray-500">Enable custom branding for your workspace</p>
              </div>
              <Button
                variant={workspaceSettings.brandingEnabled ? "primary" : "outline"}
                size="sm"
                onClick={() => setWorkspaceSettings({ 
                  ...workspaceSettings, 
                  brandingEnabled: !workspaceSettings.brandingEnabled 
                })}
              >
                {workspaceSettings.brandingEnabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveWorkspace}>
                <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card className="hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <h3 className="text-lg font-semibold font-manrope text-gray-900">
            Email Configuration
          </h3>
          <p className="text-sm text-gray-600">
            Configure email provider and notification settings
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Email Provider">
                <select
                  value={emailSettings.provider}
                  onChange={(e) => setEmailSettings({ ...emailSettings, provider: e.target.value })}
                  className="flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                >
                  {emailProviders.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </FormField>
              
              <FormField
                label="From Email"
                type="email"
                value={emailSettings.fromEmail}
                onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
              />
              
              <FormField
                label="API Key"
                type="password"
                value={emailSettings.apiKey}
                onChange={(e) => setEmailSettings({ ...emailSettings, apiKey: e.target.value })}
              />
              
              <FormField
                label="Domain"
                value={emailSettings.domain}
                onChange={(e) => setEmailSettings({ ...emailSettings, domain: e.target.value })}
              />
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveEmail}>
                <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                Save Email Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Settings */}
      <Card className="hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <h3 className="text-lg font-semibold font-manrope text-gray-900">
            Webhook Configuration
          </h3>
          <p className="text-sm text-gray-600">
            Configure webhooks for external integrations
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Webhook Endpoint"
                type="url"
                value={webhookSettings.endpoint}
                onChange={(e) => setWebhookSettings({ ...webhookSettings, endpoint: e.target.value })}
                placeholder="https://your-app.com/webhooks"
              />
              
              <FormField
                label="Secret Key"
                type="password"
                value={webhookSettings.secretKey}
                onChange={(e) => setWebhookSettings({ ...webhookSettings, secretKey: e.target.value })}
                placeholder="Your webhook secret"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Webhook Events
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      webhookSettings.events.includes(event.id)
                        ? "border-primary bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleEventToggle(event.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{event.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{event.id}</p>
                      </div>
                      {webhookSettings.events.includes(event.id) && (
                        <Badge variant="success">
                          <ApperIcon name="Check" className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline">
                <ApperIcon name="TestTube" className="w-4 h-4 mr-2" />
                Test Webhook
              </Button>
              <Button onClick={handleSaveWebhooks}>
                <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                Save Webhook Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;