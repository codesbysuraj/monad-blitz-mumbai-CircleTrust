"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { BrowserProvider, Contract, formatEther, parseEther, JsonRpcSigner } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS, MONAD_TESTNET, Pool, PoolDisplay, isContractDeployed } from "../lib/contract";

interface Web3ContextType {
  // Connection state
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  isCorrectNetwork: boolean;

  // User data
  reputation: number;
  balance: string;

  // Contract data
  poolCount: number;
  pools: PoolDisplay[];

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;

  // Contract interactions
  createPool: (contributionAmount: string, maxMembers: number, minReputation: number, roundDuration: number) => Promise<number>;
  joinPool: (poolId: number, amount: string) => Promise<void>;
  distribute: (poolId: number) => Promise<void>;
  refreshPools: () => Promise<void>;
  refreshReputation: () => Promise<void>;
  getPoolMembers: (poolId: number) => Promise<string[]>;
  hasUserJoined: (poolId: number) => Promise<boolean>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  // Connection state
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  // User data
  const [reputation, setReputation] = useState(0);
  const [balance, setBalance] = useState("0");

  // Contract data
  const [poolCount, setPoolCount] = useState(0);
  const [pools, setPools] = useState<PoolDisplay[]>([]);

  const isConnected = !!address;
  const isCorrectNetwork = chainId === MONAD_TESTNET.chainId;

  // Initialize provider and check existing connection
  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        const browserProvider = new BrowserProvider(window.ethereum);
        setProvider(browserProvider);

        // Check if already connected
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[];
          if (accounts && accounts.length > 0) {
            const signerInstance = await browserProvider.getSigner();
            const addr = await signerInstance.getAddress();
            setAddress(addr);
            setSigner(signerInstance);

            const network = await browserProvider.getNetwork();
            setChainId(Number(network.chainId));

            // Create contract instance
            const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerInstance);
            setContract(contractInstance);
          }
        } catch (error) {
          console.error("Error checking existing connection:", error);
        }

        // Listen for account changes
        window.ethereum.on("accountsChanged", (...args: unknown[]) => {
          const accounts = args[0] as string[];
          if (!accounts || accounts.length === 0) {
            disconnect();
          } else {
            setAddress(accounts[0]);
          }
        });

        // Listen for chain changes
        window.ethereum.on("chainChanged", (...args: unknown[]) => {
          const chainIdHex = args[0] as string;
          setChainId(parseInt(chainIdHex, 16));
          window.location.reload();
        });
      }
    };

    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners?.();
      }
    };
  }, []);

  // Fetch user balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (provider && address) {
        try {
          const bal = await provider.getBalance(address);
          setBalance(formatEther(bal));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [provider, address]);

  // Connect wallet
  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or another Web3 wallet");
      return;
    }

    setIsConnecting(true);
    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const signerInstance = await browserProvider.getSigner();
      const addr = await signerInstance.getAddress();
      const network = await browserProvider.getNetwork();

      setProvider(browserProvider);
      setSigner(signerInstance);
      setAddress(addr);
      setChainId(Number(network.chainId));

      // Create contract instance only if deployed
      if (isContractDeployed()) {
        const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerInstance);
        setContract(contractInstance);
      } else {
        console.warn("Contract not yet deployed. Update CONTRACT_ADDRESS in lib/contract.ts after deployment.");
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Error connecting:", err?.message || "Unknown error");
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAddress(null);
    setSigner(null);
    setContract(null);
    setReputation(0);
    setBalance("0");
    setPools([]);
  }, []);

  // Switch to Monad Testnet
  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MONAD_TESTNET.chainIdHex }],
      });
    } catch (switchError: unknown) {
      // Chain not added, add it
      if ((switchError as { code: number }).code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: MONAD_TESTNET.chainIdHex,
                chainName: MONAD_TESTNET.chainName,
                nativeCurrency: MONAD_TESTNET.nativeCurrency,
                rpcUrls: MONAD_TESTNET.rpcUrls,
                blockExplorerUrls: MONAD_TESTNET.blockExplorerUrls,
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
        }
      }
    }
  }, []);

  // Refresh reputation
  const refreshReputation = useCallback(async () => {
    if (!contract || !address) return;

    try {
      const rep = await contract.reputation(address);
      const repValue = Number(rep);
      setReputation(repValue);
      console.log("👤 Reputation:", repValue);
    } catch (error) {
      console.error("Error fetching reputation:", error);
    }
  }, [contract, address]);

  // Refresh pools
  const refreshPools = useCallback(async () => {
    if (!contract) return;

    try {
      const count = await contract.poolCount();
      const poolCountNum = Number(count);
      setPoolCount(poolCountNum);
      console.log("📊 Total pool count:", poolCountNum);

      const poolsData: PoolDisplay[] = [];
      // Pools are 0-indexed in the contract
      for (let i = 0; i < poolCountNum; i++) {
        try {
          const poolData = await contract.getPool(i);
          const [
            creator,
            contributionAmount,
            maxMembers,
            currentRound,
            memberCount,
            completed,
            minimumReputation,
            creatorFeePercent,
            roundDuration,
            roundDeadline,
          ] = poolData;

          let status: "open" | "active" | "completed" = "open";
          if (completed) {
            status = "completed";
          } else if (Number(memberCount) === Number(maxMembers)) {
            status = "active";
          }

          poolsData.push({
            id: i,
            creator,
            contributionAmount: formatEther(contributionAmount),
            maxMembers: Number(maxMembers),
            currentRound: Number(currentRound),
            memberCount: Number(memberCount),
            completed,
            minimumReputation: Number(minimumReputation),
            creatorFeePercent: Number(creatorFeePercent),
            roundDuration: Number(roundDuration),
            roundDeadline: Number(roundDeadline),
            status,
          });
        } catch (error: any) {
          // Skip non-existent pools silently (gaps in pool IDs)
          if (error?.message?.includes("Pool does not exist") || error?.reason?.includes("Pool does not exist")) {
            // Don't log for every refresh to avoid console spam
            continue;
          }
          console.error(`Error fetching pool ${i}:`, error?.message || error);
        }
      }

      setPools(poolsData);
      console.log(`✅ Loaded ${poolsData.length} pools`);
    } catch (error) {
      console.error("Error fetching pools:", error);
    }
  }, [contract]);

  // Create pool
  const createPool = useCallback(
    async (contributionAmount: string, maxMembers: number, minReputation: number, roundDuration: number) => {
      if (!contract) throw new Error("Contract not initialized");

      try {
        console.log("Creating pool with:", { contributionAmount, maxMembers, minReputation, roundDuration });
        const tx = await contract.createPool(
          parseEther(contributionAmount),
          maxMembers,
          minReputation,
          roundDuration
        );
        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
        
        // Get pool ID from event
        const event = receipt.logs.find((log: { fragment?: { name: string } }) => 
          log.fragment?.name === "PoolCreated"
        );
        const poolId = event ? Number(event.args[0]) : Number(await contract.poolCount()) - 1;
        console.log("✅ Pool created with ID:", poolId);
        
        await refreshPools();
        return poolId;
      } catch (error: any) {
        console.error("Error creating pool:", error);
        if (error?.message?.includes("Contribution must be > 0")) {
          throw new Error("Contribution amount must be greater than 0");
        } else if (error?.message?.includes("Need at least 2 members")) {
          throw new Error("Pool must have at least 2 members");
        }
        throw error;
      }
    },
    [contract, refreshPools]
  );

  // Join pool
  const joinPool = useCallback(
    async (poolId: number, amount: string) => {
      if (!contract) throw new Error("Contract not initialized");

      try {
        console.log("Joining pool:", poolId, "with amount:", amount);
        const tx = await contract.joinPool(poolId, {
          value: parseEther(amount),
        });
        console.log("Join transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Join transaction confirmed:", receipt);
        await refreshPools();
        await refreshReputation();
      } catch (error: any) {
        console.error("Error joining pool:", error);
        if (error?.message?.includes("Reputation too low")) {
          throw new Error("Your reputation is too low for this pool. Build reputation by completing pools with no minimum requirement.");
        } else if (error?.message?.includes("Pool is full")) {
          throw new Error("This pool is already full.");
        } else if (error?.message?.includes("Already joined")) {
          throw new Error("You have already joined this pool.");
        }
        throw error;
      }
    },
    [contract, refreshPools, refreshReputation]
  );

  // Distribute
  const distribute = useCallback(
    async (poolId: number) => {
      if (!contract) throw new Error("Contract not initialized");

      try {
        console.log("Distributing pool:", poolId);
        const tx = await contract.distribute(poolId);
        console.log("Distribute transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Distribute transaction confirmed:", receipt);
        console.log("✅ Distribution successful!");
        await refreshPools();
        await refreshReputation();
      } catch (error: any) {
        console.error("Error distributing:", error);
        if (error?.message?.includes("Not enough time has passed")) {
          throw new Error("Round duration not completed yet. Please wait.");
        } else if (error?.message?.includes("Pool not active")) {
          throw new Error("This pool is not active yet or is already completed.");
        }
        throw error;
      }
    },
    [contract, refreshPools, refreshReputation]
  );

  // Get pool members
  const getPoolMembers = useCallback(
    async (poolId: number) => {
      if (!contract) throw new Error("Contract not initialized");
      return await contract.getMembers(poolId);
    },
    [contract]
  );

  // Check if user has joined pool
  const hasUserJoined = useCallback(
    async (poolId: number) => {
      if (!contract || !address) return false;
      return await contract.hasJoined(poolId, address);
    },
    [contract, address]
  );

  // Fetch data when connected
  useEffect(() => {
    if (isConnected && isCorrectNetwork) {
      refreshPools();
      refreshReputation();
    }
  }, [isConnected, isCorrectNetwork, refreshPools, refreshReputation]);

  // Auto-refresh pools and reputation every 10 seconds
  useEffect(() => {
    if (!isConnected || !isCorrectNetwork) return;

    console.log("🔄 Auto-refresh enabled (every 10 seconds)");
    
    const interval = setInterval(() => {
      console.log("🔄 Auto-refreshing...");
      refreshPools();
      refreshReputation();
    }, 10000); // 10 seconds

    return () => {
      console.log("🔄 Auto-refresh disabled");
      clearInterval(interval);
    };
  }, [isConnected, isCorrectNetwork, refreshPools, refreshReputation]);

  const value: Web3ContextType = {
    address,
    isConnected,
    isConnecting,
    chainId,
    isCorrectNetwork,
    reputation,
    balance,
    poolCount,
    pools,
    connect,
    disconnect,
    switchNetwork,
    createPool,
    joinPool,
    distribute,
    refreshPools,
    refreshReputation,
    getPoolMembers,
    hasUserJoined,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

// Type for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeAllListeners?: () => void;
    };
  }
}
