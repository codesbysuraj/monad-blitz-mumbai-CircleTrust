"use client";

import Link from "next/link";
import { HamburgerMenu } from "./components/Sidebar";
import AuroraBackground from "./components/AuroraBackground";
import { useWeb3 } from "./context/Web3Context";

export default function Home() {
  const { isConnected, isConnecting, connect, address, isCorrectNetwork, switchNetwork } = useWeb3();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen relative text-white bg-slate-950">
      {/* Aurora Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <AuroraBackground
          colorStops={["#52d7ff","#201098","#5227FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-800/50 backdrop-blur-xl px-8 py-4 bg-slate-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Hamburger Menu */}
              <HamburgerMenu />
              
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">CT</span>
              </div>
              <div>
                <div className="text-xl font-bold">CircleTrust</div>
                <div className="text-xs text-gray-400">Monad Testnet</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/pools" className="text-gray-300 hover:text-white transition-colors">
                Pools
              </Link>
              {!isConnected ? (
                <button 
                  onClick={connect}
                  disabled={isConnecting}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </button>
              ) : !isCorrectNetwork ? (
                <button 
                  onClick={switchNetwork}
                  className="bg-orange-600 hover:bg-orange-700 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Switch Network
                </button>
              ) : (
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-2 bg-green-600/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-mono text-sm">{truncateAddress(address!)}</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="relative px-8 py-20">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Savings Circles
            </h1>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white drop-shadow-lg">
              Reimagined
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto drop-shadow-md">
              Join decentralized savings circles powered by smart contracts on Monad. 
              Build trust, save together, and achieve your financial goals with transparency and security.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              {!isConnected ? (
                <button 
                  onClick={connect}
                  disabled={isConnecting}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg backdrop-blur-sm disabled:opacity-50"
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </button>
              ) : (
                <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg backdrop-blur-sm">
                  Go to Dashboard
                </Link>
              )}
              <Link href="/pools" className="border border-slate-400 hover:border-slate-300 bg-slate-800/30 backdrop-blur-sm px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Browse Pools
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">Monad</div>
                <div className="text-gray-400 text-sm">Blockchain</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">3%</div>
                <div className="text-gray-400 text-sm">Creator Fee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">2x</div>
                <div className="text-gray-400 text-sm">Collateral</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-8 py-16 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12 text-white drop-shadow-lg">Why Choose CircleTrust?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700/50">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">Trustless & Secure</h4>
                <p className="text-gray-300">Smart contracts ensure transparency. Collateral protects all members from defaults.</p>
              </div>
              
              <div className="text-center p-6 bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700/50">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">Fair Payouts</h4>
                <p className="text-gray-300">Each round, one member receives the pooled funds. Rounds rotate until everyone gets paid.</p>
              </div>
              
              <div className="text-center p-6 bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700/50">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">Build Reputation</h4>
                <p className="text-gray-300">Complete rounds successfully to increase your trust score and access premium pools.</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h3>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Create or Join a Pool</h4>
                  <p className="text-gray-400">
                    Create a new savings pool with your desired contribution amount, member count, and round duration. 
                    Or browse existing pools and join one that fits your goals.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Deposit Funds</h4>
                  <p className="text-gray-400">
                    When joining, deposit 2x the contribution amount (contribution + collateral). 
                    Your collateral protects other members and is returned when the pool completes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Receive Payouts</h4>
                  <p className="text-gray-400">
                    Each round, one member receives the pool. Members take turns in the order they joined. 
                    Miss a deadline and your collateral covers your payout - plus you lose reputation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Complete & Earn</h4>
                  <p className="text-gray-400">
                    When all rounds complete, remaining collateral is returned. 
                    Successful participation increases your reputation score, unlocking access to premium pools.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              {!isConnected ? (
                <button 
                  onClick={connect}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                >
                  Connect Wallet to Get Started
                </button>
              ) : (
                <Link href="/pools" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block">
                  Browse Available Pools
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 px-8 py-8 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">CT</span>
              </div>
              <span className="text-gray-400">CircleTrust on Monad Testnet</span>
            </div>
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/pools" className="hover:text-white transition-colors">Pools</Link>
              <Link href="/reputation" className="hover:text-white transition-colors">Reputation</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
