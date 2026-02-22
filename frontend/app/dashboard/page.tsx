"use client";

import Link from "next/link";
import { useWeb3 } from "../context/Web3Context";
import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";

export default function Dashboard() {
  const {
    address,
    isConnected,
    isConnecting,
    isCorrectNetwork,
    connect,
    disconnect,
    switchNetwork,
    balance,
    reputation,
    pools,
    poolCount,
    refreshPools,
  } = useWeb3();

  const [userPools, setUserPools] = useState<typeof pools>([]);

  // Filter pools the user has joined
  useEffect(() => {
    if (pools.length > 0 && address) {
      // For now show all non-completed pools, in production we'd filter by membership
      setUserPools(pools.filter(p => !p.completed));
    }
  }, [pools, address]);

  const activePools = pools.filter(p => p.status === "active").length;
  const openPools = pools.filter(p => p.status === "open").length;

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <PageLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-2">
            {isConnected 
              ? "Welcome back! Here's your CircleTrust overview." 
              : "Connect your wallet to get started."}
          </p>
        </div>

        {/* Not Connected State */}
        {!isConnected && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6 text-center max-w-md">
              Connect your wallet to view your pools, reputation score, and start participating in savings circles.
            </p>
            <button 
              onClick={connect}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* Connected Content */}
        {isConnected && isCorrectNetwork && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <div className="text-sm text-gray-400 mb-1">Balance</div>
                <div className="text-2xl font-bold">{parseFloat(balance).toFixed(4)} MON</div>
                <div className="text-blue-400 text-sm">Monad Testnet</div>
              </div>
              
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <div className="text-sm text-gray-400 mb-1">Total Pools</div>
                <div className="text-2xl font-bold">{poolCount}</div>
                <div className="text-blue-400 text-sm">{openPools} open, {activePools} active</div>
              </div>
              
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <div className="text-sm text-gray-400 mb-1">Trust Score</div>
                <div className="text-2xl font-bold">{reputation}</div>
                <div className={reputation >= 0 ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
                  {reputation >= 0 ? "Good Standing" : "Low Reputation"}
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <div className="text-sm text-gray-400 mb-1">Network</div>
                <div className="text-2xl font-bold">Monad</div>
                <div className="text-green-400 text-sm">Testnet Connected</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Active Pools */}
              <div className="lg:col-span-2">
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Recent Pools</h3>
                    <Link href="/pools" className="text-blue-400 hover:text-blue-300 text-sm">View All</Link>
                  </div>
                  
                  <div className="space-y-4">
                    {pools.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <p>No pools found. Create the first pool!</p>
                      </div>
                    ) : (
                      pools.slice(0, 5).map((pool) => (
                        <div key={pool.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              pool.status === "completed" 
                                ? "bg-gradient-to-r from-gray-500 to-gray-600"
                                : pool.status === "active"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                : "bg-gradient-to-r from-blue-500 to-cyan-500"
                            }`}>
                              #{pool.id}
                            </div>
                            <div>
                              <div className="font-medium">Pool #{pool.id}</div>
                              <div className="text-sm text-gray-400">
                                {pool.memberCount}/{pool.maxMembers} members • Round {pool.currentRound + 1}/{pool.maxMembers}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${
                              pool.status === "completed" ? "text-gray-400" :
                              pool.status === "active" ? "text-green-400" : "text-blue-400"
                            }`}>
                              {pool.status === "completed" ? "Completed" :
                               pool.status === "active" ? "Active" : "Open"}
                            </div>
                            <div className="text-sm text-gray-400">{pool.contributionAmount} MON</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions & Info */}
              <div>
                {/* Quick Actions */}
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <Link href="/pools?create=true" className="block w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-medium transition-colors text-center">
                      Create New Pool
                    </Link>
                    
                    <Link href="/pools" className="block w-full border border-slate-600 hover:border-slate-500 p-3 rounded-lg font-medium transition-colors text-center">
                      Browse Pools
                    </Link>
                    
                    <button 
                      onClick={() => refreshPools()}
                      className="w-full border border-slate-600 hover:border-slate-500 p-3 rounded-lg font-medium transition-colors"
                    >
                      Refresh Data
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <h3 className="text-lg font-semibold mb-4">How It Works</h3>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400">1.</span>
                      <span>Create or join a savings pool</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400">2.</span>
                      <span>Deposit contribution + collateral</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400">3.</span>
                      <span>Each round, one member gets the pot</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400">4.</span>
                      <span>Build reputation by participating</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
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
              Please switch to Monad Testnet to use CircleTrust.
            </p>
            <button 
              onClick={switchNetwork}
              className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Switch to Monad Testnet
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}