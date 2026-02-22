"use client";

import Link from "next/link";
import { useWeb3 } from "../context/Web3Context";
import PageLayout from "../components/PageLayout";

export default function Reputation() {
  const {
    address,
    isConnected,
    isCorrectNetwork,
    connect,
    switchNetwork,
    disconnect,
    reputation,
    balance,
    pools,
    refreshReputation,
  } = useWeb3();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Calculate stats from pools
  const completedPools = pools.filter(p => p.completed).length;
  const activePools = pools.filter(p => p.status === "active").length;
  const totalPools = pools.length;

  // Reputation tier calculation
  const getReputationTier = (rep: number) => {
    if (rep >= 10) return { name: "Diamond", color: "text-cyan-400", bg: "bg-cyan-900/50" };
    if (rep >= 5) return { name: "Gold", color: "text-yellow-400", bg: "bg-yellow-900/50" };
    if (rep >= 2) return { name: "Silver", color: "text-gray-300", bg: "bg-gray-700/50" };
    if (rep >= 0) return { name: "Bronze", color: "text-orange-400", bg: "bg-orange-900/50" };
    return { name: "At Risk", color: "text-red-400", bg: "bg-red-900/50" };
  };

  const tier = getReputationTier(reputation);

  return (
    <PageLayout>
      <div className="p-8">
        {/* Not Connected State */}
        {!isConnected && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">View Your Reputation</h2>
            <p className="text-gray-400 mb-6 text-center max-w-md">
              Connect your wallet to see your trust score and participation history.
            </p>
            <button 
              onClick={connect}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* Wrong Network */}
        {isConnected && !isCorrectNetwork && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Wrong Network</h2>
            <p className="text-gray-400 mb-6 text-center max-w-md">
              Please switch to Monad Testnet to view your reputation.
            </p>
            <button 
              onClick={switchNetwork}
              className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Switch to Monad Testnet
            </button>
          </div>
        )}

        {/* Connected Content */}
        {isConnected && isCorrectNetwork && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold">
                    {address?.slice(2, 4).toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${reputation >= 0 ? "bg-green-500" : "bg-red-500"} border-2 border-slate-950 rounded-full`}></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">My Reputation</h1>
                  <p className="text-gray-400 font-mono">{truncateAddress(address!)}</p>
                </div>
              </div>
              <button 
                onClick={() => refreshReputation()}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Trust Score */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Trust Score</h3>
                    <span className={`${tier.bg} ${tier.color} text-xs px-2 py-1 rounded-full`}>
                      {tier.name}
                    </span>
                  </div>
                  
                  {/* Big Number Display */}
                  <div className="text-center py-8">
                    <div className={`text-6xl font-bold ${reputation >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {reputation}
                    </div>
                    <div className="text-gray-400 mt-2">reputation points</div>
                  </div>
                  
                  <div className="text-center text-sm">
                    {reputation >= 0 ? (
                      <span className="text-green-400">Good standing</span>
                    ) : (
                      <span className="text-red-400">Build reputation by completing rounds</span>
                    )}
                  </div>
                </div>

                {/* How Reputation Works */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mt-6">
                  <h3 className="font-semibold mb-4">How it works</h3>
                  <div className="space-y-3 text-sm text-gray-400">
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400">+1</span>
                      <span>Complete a payout round on time</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-red-400">-2</span>
                      <span>Miss a deadline (default)</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-400">?</span>
                      <span>Higher rep = access to better pools</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
                    <div className="text-sm text-gray-400 mb-1">Balance</div>
                    <div className="text-2xl font-bold">{parseFloat(balance).toFixed(4)}</div>
                    <div className="text-xs text-blue-400 mt-1">MON</div>
                  </div>
                  
                  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
                    <div className="text-sm text-gray-400 mb-1">Active Pools</div>
                    <div className="text-2xl font-bold">{activePools}</div>
                    <div className="text-xs text-gray-400 mt-1">participating in</div>
                  </div>
                  
                  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
                    <div className="text-sm text-gray-400 mb-1">Total Pools</div>
                    <div className="text-2xl font-bold">{totalPools}</div>
                    <div className="text-xs text-gray-400 mt-1">{completedPools} completed</div>
                  </div>
                </div>

                {/* Reputation Tiers */}
                <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 p-6 rounded-xl border border-slate-700">
                  <h4 className="font-semibold mb-4">Reputation Tiers</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`p-3 rounded-lg text-center ${reputation < 0 ? "border-2 border-red-500" : "border border-slate-600"}`}>
                      <div className="text-red-400 font-bold">At Risk</div>
                      <div className="text-xs text-gray-400">{"< 0"}</div>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${reputation >= 0 && reputation < 2 ? "border-2 border-orange-500" : "border border-slate-600"}`}>
                      <div className="text-orange-400 font-bold">Bronze</div>
                      <div className="text-xs text-gray-400">0-1</div>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${reputation >= 2 && reputation < 5 ? "border-2 border-gray-400" : "border border-slate-600"}`}>
                      <div className="text-gray-300 font-bold">Silver</div>
                      <div className="text-xs text-gray-400">2-4</div>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${reputation >= 5 && reputation < 10 ? "border-2 border-yellow-500" : "border border-slate-600"}`}>
                      <div className="text-yellow-400 font-bold">Gold</div>
                      <div className="text-xs text-gray-400">5-9</div>
                    </div>
                  </div>
                  <div className={`mt-4 p-3 rounded-lg text-center ${reputation >= 10 ? "border-2 border-cyan-500" : "border border-slate-600"}`}>
                    <div className="text-cyan-400 font-bold">Diamond</div>
                    <div className="text-xs text-gray-400">10+ points</div>
                  </div>
                </div>

                {/* Recent Pool Activity */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mt-6">
                  <h4 className="font-semibold mb-4">Network Pools</h4>
                  {pools.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p>No pools on the network yet.</p>
                      <Link href="/pools" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
                        Create the first pool →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pools.slice(0, 5).map((pool) => (
                        <div key={pool.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              pool.completed 
                                ? "bg-gradient-to-r from-gray-500 to-gray-600"
                                : "bg-gradient-to-r from-blue-500 to-cyan-500"
                            }`}>
                              {pool.id}
                            </div>
                            <div>
                              <div className="text-sm font-medium">Pool #{pool.id}</div>
                              <div className="text-xs text-gray-400">
                                {pool.memberCount}/{pool.maxMembers} members
                              </div>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            pool.completed 
                              ? "bg-gray-700 text-gray-400" 
                              : pool.status === "active"
                              ? "bg-green-900/50 text-green-400"
                              : "bg-blue-900/50 text-blue-400"
                          }`}>
                            {pool.completed ? "Completed" : pool.status === "active" ? "Active" : "Open"}
                          </span>
                        </div>
                      ))}
                      {pools.length > 5 && (
                        <Link href="/pools" className="block text-center text-blue-400 hover:text-blue-300 text-sm mt-4">
                          View all {pools.length} pools →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}