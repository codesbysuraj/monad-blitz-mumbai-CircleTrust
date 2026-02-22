"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";
import { useSearchParams } from "next/navigation";
import { PoolDisplay } from "../lib/contract";
import PageLayout from "../components/PageLayout";

export default function Pools() {
  const {
    isConnected,
    isCorrectNetwork,
    connect,
    switchNetwork,
    pools,
    poolCount,
    createPool,
    joinPool,
    distribute,
    refreshPools,
    hasUserJoined,
    address,
  } = useWeb3();

  const searchParams = useSearchParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState<PoolDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [joinedPools, setJoinedPools] = useState<Set<number>>(new Set());

  // Form state for creating pool
  const [createForm, setCreateForm] = useState({
    contributionAmount: "0.1",
    maxMembers: "3",
    minReputation: "0",
    roundDuration: "3600", // 1 hour default
  });

  // Check if create modal should open from URL
  useEffect(() => {
    if (searchParams.get("create") === "true" && isConnected && isCorrectNetwork) {
      setShowCreateModal(true);
    }
  }, [searchParams, isConnected, isCorrectNetwork]);

  // Check which pools user has joined
  useEffect(() => {
    const checkJoinedPools = async () => {
      if (!isConnected || pools.length === 0) return;
      const joined = new Set<number>();
      for (const pool of pools) {
        try {
          const hasJoined = await hasUserJoined(pool.id);
          if (hasJoined) {
            joined.add(pool.id);
          }
        } catch (error) {
          console.error(`Error checking pool ${pool.id}:`, error);
        }
      }
      setJoinedPools(joined);
    };
    checkJoinedPools();
  }, [isConnected, pools, hasUserJoined]);

  const handleCreatePool = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createPool(
        createForm.contributionAmount,
        parseInt(createForm.maxMembers),
        parseInt(createForm.minReputation),
        parseInt(createForm.roundDuration)
      );
      setShowCreateModal(false);
      setCreateForm({
        contributionAmount: "0.1",
        maxMembers: "3",
        minReputation: "0",
        roundDuration: "3600",
      });
    } catch (error) {
      console.error("Error creating pool:", error);
      alert("Error creating pool. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinPool = async () => {
    if (!selectedPool) return;
    setIsLoading(true);
    try {
      // Amount is 2x contribution (contribution + collateral)
      const amount = (parseFloat(selectedPool.contributionAmount) * 2).toString();
      await joinPool(selectedPool.id, amount);
      setShowJoinModal(false);
      setSelectedPool(null);
    } catch (error) {
      console.error("Error joining pool:", error);
      alert("Error joining pool. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDistribute = async (poolId: number) => {
    setIsLoading(true);
    try {
      await distribute(poolId);
    } catch (error) {
      console.error("Error distributing:", error);
      alert("Error distributing. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const openJoinModal = (pool: PoolDisplay) => {
    setSelectedPool(pool);
    setShowJoinModal(true);
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    return `${Math.floor(seconds / 86400)} days`;
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Savings Pools</h1>
            <p className="text-gray-400">
              {isConnected ? `${poolCount} total pools on the network` : "Connect wallet to view pools"}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {isConnected && isCorrectNetwork && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Create Pool
              </button>
            )}
          </div>
        </div>

        {/* Not Connected State */}
        {!isConnected && (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-800/50 rounded-lg border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Connect Wallet to View Pools</h2>
            <button
              onClick={connect}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* Wrong Network */}
        {isConnected && !isCorrectNetwork && (
          <div className="flex flex-col items-center justify-center py-20 bg-orange-600/20 rounded-lg border border-orange-500">
            <h2 className="text-xl font-bold mb-4">Switch to Monad Testnet</h2>
            <button
              onClick={switchNetwork}
              className="bg-orange-600 hover:bg-orange-700 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Switch Network
            </button>
          </div>
        )}

        {/* Pool Cards Grid */}
        {isConnected && isCorrectNetwork && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pools.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-800/50 rounded-lg border border-slate-700">
                <h2 className="text-xl font-bold mb-4">No Pools Yet</h2>
                <p className="text-gray-400 mb-6">Be the first to create a savings pool!</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Create First Pool
                </button>
              </div>
            ) : (
              <>
                {pools.map((pool) => (
                  <div
                    key={pool.id}
                    className={`bg-slate-800/50 p-6 rounded-lg border ${
                      pool.completed ? "border-gray-600" : "border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Pool #{pool.id}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          pool.completed
                            ? "bg-gray-600 text-gray-300"
                            : pool.status === "active"
                            ? "bg-green-600 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {pool.completed ? "Completed" : pool.status === "active" ? "Active" : "Open"}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-400">
                      <div className="flex justify-between">
                        <span>Contribution:</span>
                        <span className="text-white">{pool.contributionAmount} MON</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Members:</span>
                        <span className="text-white">
                          {pool.memberCount}/{pool.maxMembers}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Round:</span>
                        <span className="text-white">
                          {pool.currentRound + 1}/{pool.maxMembers}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Round Duration:</span>
                        <span className="text-white">{formatDuration(pool.roundDuration)}</span>
                      </div>
                      {pool.minimumReputation > 0 && (
                        <div className="flex justify-between">
                          <span>Min Reputation:</span>
                          <span className="text-white">{pool.minimumReputation}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-gray-400">
                          {Math.round((pool.currentRound / pool.maxMembers) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            pool.completed ? "bg-gray-500" : "bg-blue-500"
                          }`}
                          style={{
                            width: `${(pool.currentRound / pool.maxMembers) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      {!pool.completed && (
                        <>
                          {pool.status === "open" && !joinedPools.has(pool.id) && (
                            <button
                              onClick={() => openJoinModal(pool)}
                              disabled={isLoading}
                              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                              Join Pool ({(parseFloat(pool.contributionAmount) * 2).toFixed(4)} MON)
                            </button>
                          )}
                          {joinedPools.has(pool.id) && (
                            <div className="text-center py-2 text-green-400 text-sm">
                              ✓ You have joined this pool
                            </div>
                          )}
                          {pool.status === "active" && pool.memberCount === pool.maxMembers && (
                            <button
                              onClick={() => handleDistribute(pool.id)}
                              disabled={isLoading}
                              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isLoading ? "Processing..." : "Trigger Distribution"}
                            </button>
                          )}
                        </>
                      )}
                      {pool.completed && (
                        <div className="text-center py-2 text-gray-400 text-sm">
                          Pool completed
                        </div>
                      )}
                    </div>

                    {/* Creator info */}
                    <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-gray-500">
                      Creator: {pool.creator.slice(0, 6)}...{pool.creator.slice(-4)}
                    </div>
                  </div>
                ))}

                {/* Create New Pool Card */}
                <div
                  className="bg-slate-800/50 p-6 rounded-lg border border-dashed border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => setShowCreateModal(true)}
                >
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Create New Pool</h3>
                  <p className="text-gray-400 text-center text-sm">
                    Start your own savings circle
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Refresh Button */}
        {isConnected && isCorrectNetwork && (
          <div className="mt-8 text-center">
            <button
              onClick={() => refreshPools()}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              ↻ Refresh Pools
            </button>
          </div>
        )}
      </div>

      {/* Create Pool Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-8 rounded-lg border border-slate-700 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Create New Pool</h2>
            <form onSubmit={handleCreatePool} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Contribution Amount (MON)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={createForm.contributionAmount}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, contributionAmount: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Members will deposit 2x this (contribution + collateral)
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Members</label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={createForm.maxMembers}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, maxMembers: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Minimum Reputation (0 for no requirement)
                </label>
                <input
                  type="number"
                  min="0"
                  value={createForm.minReputation}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, minReputation: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Round Duration (seconds)
                </label>
                <select
                  value={createForm.roundDuration}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, roundDuration: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
                >
                  <option value="60">1 minute (testing)</option>
                  <option value="300">5 minutes</option>
                  <option value="3600">1 hour</option>
                  <option value="86400">1 day</option>
                  <option value="604800">1 week</option>
                </select>
              </div>

              <div className="bg-slate-800 p-4 rounded-lg text-sm">
                <div className="text-gray-400 mb-2">Pool Summary:</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Total Pool Size:</span>
                    <span>
                      {(
                        parseFloat(createForm.contributionAmount) *
                        parseInt(createForm.maxMembers)
                      ).toFixed(4)}{" "}
                      MON
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Creator Fee (3%):</span>
                    <span>
                      {(
                        parseFloat(createForm.contributionAmount) *
                        parseInt(createForm.maxMembers) *
                        0.03
                      ).toFixed(4)}{" "}
                      MON
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-slate-600 hover:border-slate-500 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create Pool"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Pool Modal */}
      {showJoinModal && selectedPool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-8 rounded-lg border border-slate-700 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Join Pool #{selectedPool.id}</h2>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-800 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Contribution:</span>
                  <span>{selectedPool.contributionAmount} MON</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Collateral:</span>
                  <span>{selectedPool.contributionAmount} MON</span>
                </div>
                <div className="flex justify-between font-bold border-t border-slate-600 pt-2">
                  <span>Total Required:</span>
                  <span>
                    {(parseFloat(selectedPool.contributionAmount) * 2).toFixed(4)} MON
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-400">
                <p className="mb-2">By joining this pool, you agree to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Participate in all {selectedPool.maxMembers} rounds</li>
                  <li>Risk losing collateral if you miss a payout round</li>
                  <li>Receive your payout on your designated round</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowJoinModal(false);
                  setSelectedPool(null);
                }}
                className="flex-1 border border-slate-600 hover:border-slate-500 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinPool}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? "Joining..." : "Confirm & Join"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}