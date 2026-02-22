import Link from "next/link";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-b border-slate-800">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">🔒</span>
          </div>
          <span className="text-xl font-semibold">CircleTrust</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/how-it-works" className="text-blue-400 font-medium">
            How it works
          </Link>
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">
            Dashboard
          </Link>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
            Connect Wallet
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">How CircleTrust Works</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            CircleTrust is a decentralized rotating savings solution built on blockchain technology. 
            Join savings circles with complete transparency, automated payments, and self-custody of your funds.
          </p>
        </div>

        {/* Process Flow - Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto mb-20 timeline-mobile">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-blue-500 to-blue-400 h-full timeline-line"></div>
          
          <div className="space-y-24">
            {/* Step 1: Connect Your Wallet - Right Side */}
            <div className="relative flex items-center">
              <div className="w-1/2 pr-8 text-right timeline-content">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 inline-block max-w-sm">
                  <h3 className="text-xl font-semibold mb-3">Connect Your Wallet</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Start by securely connecting your Web3 wallet (MetaMask, Rainbow, etc.). No personal data or email is required - your wallet address is your identity.
                  </p>
                </div>
              </div>
              {/* Circle Node */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-4 border-slate-950 z-10 timeline-node">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="w-1/2 pl-8 md:block hidden"></div>
            </div>

            {/* Step 2: Join a Savings Pool - Left Side */}
            <div className="relative flex items-center">
              <div className="w-1/2 pr-8 md:block hidden"></div>
              {/* Circle Node */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-4 border-slate-950 z-10 timeline-node">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="w-1/2 pl-8 timeline-content md:text-left text-left">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 inline-block max-w-sm">
                  <h3 className="text-xl font-semibold mb-3">Join a Savings Pool</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Browse available circles or create your own. Set the contribution amount, number of members, and your first share into the audited smart contract.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Circle Formation - Right Side */}
            <div className="relative flex items-center">
              <div className="w-1/2 pr-8 text-right timeline-content">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 inline-block max-w-sm">
                  <h3 className="text-xl font-semibold mb-3">Circle Formation</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Wait for the pool to fill up with other verified members. Once the circle reaches capacity (e.g., 5/5 members), the saving cycle officially begins automatically.
                  </p>
                </div>
              </div>
              {/* Circle Node */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-4 border-slate-950 z-10 timeline-node">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="w-1/2 pl-8 md:block hidden"></div>
            </div>

            {/* Step 4: Rotating Payouts - Left Side */}
            <div className="relative flex items-center">
              <div className="w-1/2 pr-8 md:block hidden"></div>
              {/* Circle Node */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-4 border-slate-950 z-10 timeline-node">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="w-1/2 pl-8 timeline-content md:text-left text-left">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 inline-block max-w-sm">
                  <h3 className="text-xl font-semibold mb-3">Rotating Payouts</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Every cycle (e.g. weekly), the total pooled funds are automatically distributed to one member. This rotates until everyone has received the lump sum payout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Use CircleTrust */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Why use CircleTrust?</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience the benefits of traditional rotating savings and credit associations (ROSCAs) 
            enhanced with blockchain security and transparency.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Trustless Security */}
          <div className="bg-slate-800/30 p-8 rounded-xl border border-slate-700 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl text-blue-400">🔐</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Trustless Security</h3>
            <p className="text-gray-400 leading-relaxed">
              Smart contracts eliminate the need for trust. Rules are transparent, immutable, and automatically executed on the blockchain.
            </p>
          </div>

          {/* Automated Payments */}
          <div className="bg-slate-800/30 p-8 rounded-xl border border-slate-700 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl text-green-400">⚡</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Automated Payments</h3>
            <p className="text-gray-400 leading-relaxed">
              Contributions and distributions happen automatically according to the schedule. No manual coordination required.
            </p>
          </div>

          {/* Self Custody */}
          <div className="bg-slate-800/30 p-8 rounded-xl border border-slate-700 text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl text-purple-400">🏦</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Self Custody</h3>
            <p className="text-gray-400 leading-relaxed">
              You maintain full control of your funds. No intermediaries, no third-party risk. Your keys, your crypto.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-12 rounded-2xl border border-blue-800/50 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to start saving together?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are building wealth through decentralized savings circles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              Browse Pools
            </Link>
            <button className="border border-slate-600 hover:border-slate-500 px-8 py-4 rounded-lg font-semibold transition-colors">
              Create New Pool
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 mt-16">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2026 CircleTrust. Decentralized savings made simple.</p>
        </div>
      </footer>
    </div>
  );
}