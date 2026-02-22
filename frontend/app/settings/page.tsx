import PageLayout from "../components/PageLayout";

export default function Settings() {
  return (
    <PageLayout>
      <div className="container mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-gray-400">Manage your account preferences and security</p>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-6">Profile Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your display name"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="your.email@example.com"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Pool Activity</div>
                  <div className="text-sm text-gray-400">Get notified about pool updates and payments</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Payment Reminders</div>
                  <div className="text-sm text-gray-400">Receive reminders before payment deadlines</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Marketing Updates</div>
                  <div className="text-sm text-gray-400">Get updates about new features and promotions</div>
                </div>
                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-6">Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-400">Add an extra layer of security to your account</div>
                </div>
                <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm transition-colors">
                  Enable 2FA
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div>
                  <div className="font-medium">Connected Wallets</div>
                  <div className="text-sm text-gray-400">Manage your connected web3 wallets</div>
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  Manage
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div>
                  <div className="font-medium">Session Management</div>
                  <div className="text-sm text-gray-400">View and manage active sessions</div>
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  View Sessions
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-6">Privacy</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Public Profile</div>
                  <div className="text-sm text-gray-400">Allow others to view your reputation score</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Activity Visibility</div>
                  <div className="text-sm text-gray-400">Show your pool participation in public feeds</div>
                </div>
                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}