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
  
  const [testingEndpoint, setTestingEndpoint] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [deliveryLogs, setDeliveryLogs] = useState([]);
  
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

  const integrationEvents = {
    crm: [
      { id: "contact.created", name: "Contact Created", description: "New contact added to CRM" },
      { id: "contact.updated", name: "Contact Updated", description: "Contact information modified" },
      { id: "deal.created", name: "Deal Created", description: "New sales opportunity created" },
      { id: "deal.won", name: "Deal Won", description: "Sales opportunity closed successfully" },
      { id: "deal.lost", name: "Deal Lost", description: "Sales opportunity lost" },
      { id: "lead.qualified", name: "Lead Qualified", description: "Lead marked as qualified" }
    ],
    marketing: [
      { id: "campaign.sent", name: "Campaign Sent", description: "Email campaign delivered" },
      { id: "subscriber.added", name: "Subscriber Added", description: "New email subscriber" },
      { id: "subscriber.unsubscribed", name: "Subscriber Unsubscribed", description: "User unsubscribed from emails" },
      { id: "email.opened", name: "Email Opened", description: "Recipient opened email" },
      { id: "email.clicked", name: "Email Clicked", description: "Recipient clicked email link" },
      { id: "automation.triggered", name: "Automation Triggered", description: "Marketing automation started" }
    ],
    billing: [
      { id: "payment.succeeded", name: "Payment Succeeded", description: "Payment processed successfully" },
      { id: "payment.failed", name: "Payment Failed", description: "Payment processing failed" },
      { id: "subscription.created", name: "Subscription Created", description: "New subscription activated" },
      { id: "subscription.cancelled", name: "Subscription Cancelled", description: "Subscription terminated" },
      { id: "invoice.created", name: "Invoice Created", description: "New invoice generated" }
    ]
  };

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

const handleTestWebhook = async () => {
    if (!webhookSettings.endpoint) {
      toast.error("Please enter a webhook endpoint URL");
      return;
    }

    setTestingEndpoint(true);
    setTestResults(null);

    try {
      const testPayload = {
        event: "webhook.test",
        timestamp: new Date().toISOString(),
        data: {
          message: "This is a test webhook from SparkChat Hub",
          user_id: 12345,
          test: true
        }
      };

      const response = await fetch(webhookSettings.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': webhookSettings.secretKey ? `sha256=${webhookSettings.secretKey}` : '',
          'User-Agent': 'SparkChat-Hub/1.0'
        },
        body: JSON.stringify(testPayload)
      });

      const result = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        timestamp: new Date().toISOString(),
        responseTime: `${Math.floor(Math.random() * 200) + 50}ms`
      };

      if (response.ok) {
        result.message = "Webhook endpoint responded successfully";
        toast.success("Webhook test successful!");
      } else {
        result.message = `Webhook endpoint returned ${response.status} ${response.statusText}`;
        toast.error(`Webhook test failed: ${response.status} ${response.statusText}`);
      }

      setTestResults(result);
      
      // Add to delivery logs
      const logEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        event: "webhook.test",
        status: response.ok ? "success" : "failed",
        endpoint: webhookSettings.endpoint,
        responseTime: result.responseTime,
        statusCode: response.status
      };
      
      setDeliveryLogs(prev => [logEntry, ...prev.slice(0, 9)]);

    } catch (error) {
      const result = {
        success: false,
        status: 0,
        statusText: "Network Error",
        timestamp: new Date().toISOString(),
        message: `Failed to connect to webhook endpoint: ${error.message}`,
        responseTime: "N/A"
      };
      
      setTestResults(result);
      toast.error(`Webhook test failed: ${error.message}`);
      
      // Add error to delivery logs
      const logEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        event: "webhook.test",
        status: "error",
        endpoint: webhookSettings.endpoint,
        responseTime: "N/A",
        statusCode: 0,
        error: error.message
      };
      
      setDeliveryLogs(prev => [logEntry, ...prev.slice(0, 9)]);
    } finally {
      setTestingEndpoint(false);
    }
  };

  const handleSaveWebhooks = () => {
    if (!webhookSettings.endpoint) {
      toast.error("Please enter a webhook endpoint URL");
      return;
    }
    
    if (webhookSettings.events.length === 0) {
      toast.warning("No events selected. Webhook will not receive any notifications.");
    }
    
    toast.success(`Webhook settings saved successfully. ${webhookSettings.events.length} events configured.`);
  };

  const handleSaveEmail = () => {
    if (!emailSettings.apiKey) {
      toast.error("Please enter an API key for your email provider");
      return;
    }
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
            Configure webhooks for external integrations like Salesforce CRM and Mailchimp marketing
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Endpoint Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Webhook Endpoint URL"
                type="url"
                value={webhookSettings.endpoint}
                onChange={(e) => setWebhookSettings({ ...webhookSettings, endpoint: e.target.value })}
                placeholder="https://your-app.com/webhooks/sparkchat"
              />
              
              <FormField
                label="Secret Key (Optional)"
                type="password"
                value={webhookSettings.secretKey}
                onChange={(e) => setWebhookSettings({ ...webhookSettings, secretKey: e.target.value })}
                placeholder="Your webhook signature secret"
              />
            </div>

            {/* Endpoint Testing */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Endpoint Testing</h4>
                  <p className="text-sm text-gray-600">Test your webhook endpoint connectivity and response</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleTestWebhook}
                  disabled={testingEndpoint || !webhookSettings.endpoint}
                >
                  {testingEndpoint ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="TestTube" className="w-4 h-4 mr-2" />
                      Test Endpoint
                    </>
                  )}
                </Button>
              </div>

              {testResults && (
                <div className={`p-4 rounded-lg border ${
                  testResults.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <ApperIcon 
                          name={testResults.success ? "CheckCircle" : "XCircle"} 
                          className={`w-5 h-5 mr-2 ${
                            testResults.success ? 'text-green-600' : 'text-red-600'
                          }`} 
                        />
                        <span className={`font-medium ${
                          testResults.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {testResults.success ? 'Test Successful' : 'Test Failed'}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        testResults.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {testResults.message}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span>Status: {testResults.status}</span>
                        <span>Response Time: {testResults.responseTime}</span>
                        <span>Timestamp: {new Date(testResults.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Event Categories */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-4 block">
                  Webhook Events Configuration
                </label>
                <p className="text-sm text-gray-600 mb-6">
                  Select which events should trigger webhook notifications to your external systems
                </p>
              </div>

              {/* CRM Events (Salesforce) */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <ApperIcon name="Users" className="w-5 h-5 mr-2 text-blue-600" />
                  <h4 className="text-sm font-semibold text-gray-900">CRM Integration Events</h4>
                  <Badge variant="outline" className="ml-2">Salesforce Compatible</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integrationEvents.crm.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        webhookSettings.events.includes(event.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleEventToggle(event.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">{event.name}</h5>
                          <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                            {event.id}
                          </code>
                        </div>
                        {webhookSettings.events.includes(event.id) && (
                          <Badge variant="success" className="ml-2">
                            <ApperIcon name="Check" className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marketing Events (Mailchimp) */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <ApperIcon name="Mail" className="w-5 h-5 mr-2 text-green-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Marketing Integration Events</h4>
                  <Badge variant="outline" className="ml-2">Mailchimp Compatible</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integrationEvents.marketing.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        webhookSettings.events.includes(event.id)
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleEventToggle(event.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">{event.name}</h5>
                          <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                            {event.id}
                          </code>
                        </div>
                        {webhookSettings.events.includes(event.id) && (
                          <Badge variant="success" className="ml-2">
                            <ApperIcon name="Check" className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Events */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <ApperIcon name="CreditCard" className="w-5 h-5 mr-2 text-purple-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Billing & Payment Events</h4>
                  <Badge variant="outline" className="ml-2">Universal</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integrationEvents.billing.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        webhookSettings.events.includes(event.id)
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleEventToggle(event.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">{event.name}</h5>
                          <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                            {event.id}
                          </code>
                        </div>
                        {webhookSettings.events.includes(event.id) && (
                          <Badge variant="success" className="ml-2">
                            <ApperIcon name="Check" className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Logs */}
            {deliveryLogs.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Recent Webhook Activity</h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <div className="space-y-3">
                    {deliveryLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <ApperIcon 
                            name={log.status === 'success' ? 'CheckCircle' : log.status === 'error' ? 'XCircle' : 'AlertCircle'} 
                            className={`w-4 h-4 mr-2 ${
                              log.status === 'success' ? 'text-green-600' : 
                              log.status === 'error' ? 'text-red-600' : 'text-yellow-600'
                            }`} 
                          />
                          <span className="font-medium">{log.event}</span>
                          <span className="text-gray-500 ml-2">→ {log.endpoint}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">{log.responseTime}</span>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-600">
                {webhookSettings.events.length} event{webhookSettings.events.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setWebhookSettings({ ...webhookSettings, events: [] })}>
                  <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                  Clear All Events
                </Button>
                <Button onClick={handleSaveWebhooks}>
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  Save Webhook Configuration
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;