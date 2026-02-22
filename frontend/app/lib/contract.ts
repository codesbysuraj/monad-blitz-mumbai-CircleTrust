// CircleTrust Contract Configuration for Monad Testnet

// Contract Address - UPDATE THIS AFTER DEPLOYMENT
export const CONTRACT_ADDRESS = "0x22E2d4EEa809954bF2cc9794a5442bc8044d1a23"; // Deployed on Monad Testnet

// Helper to check if contract is deployed
export const isContractDeployed = () => {
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  return CONTRACT_ADDRESS.toLowerCase() !== ZERO_ADDRESS.toLowerCase();
};

// Monad Testnet Configuration
export const MONAD_TESTNET = {
  chainId: 10143,
  chainIdHex: "0x27AF",
  chainName: "Monad Testnet",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: ["https://testnet-rpc.monad.xyz"],
  blockExplorerUrls: ["https://testnet.monadexplorer.com"],
};

// Contract ABI - Compiled from CircleTrust.sol
export const CONTRACT_ABI = [
  // Events (matching the actual contract)
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "poolId", type: "uint256" },
      { indexed: false, internalType: "address", name: "creator", type: "address" },
    ],
    name: "PoolCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "poolId", type: "uint256" },
      { indexed: false, internalType: "address", name: "member", type: "address" },
    ],
    name: "Joined",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "poolId", type: "uint256" },
      { indexed: false, internalType: "address", name: "receiver", type: "address" },
    ],
    name: "Distributed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "poolId", type: "uint256" },
      { indexed: false, internalType: "address", name: "defaulter", type: "address" },
    ],
    name: "CollateralSlashed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "uint256", name: "poolId", type: "uint256" }],
    name: "PoolCompleted",
    type: "event",
  },
  // Functions
  {
    inputs: [
      { internalType: "uint256", name: "_contributionAmount", type: "uint256" },
      { internalType: "uint256", name: "_maxMembers", type: "uint256" },
      { internalType: "uint256", name: "_minimumReputation", type: "uint256" },
      { internalType: "uint256", name: "_roundDuration", type: "uint256" },
    ],
    name: "createPool",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_poolId", type: "uint256" }],
    name: "distribute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_poolId", type: "uint256" },
      { internalType: "address", name: "_member", type: "address" },
    ],
    name: "getCollateral",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_poolId", type: "uint256" }],
    name: "getMembers",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_poolId", type: "uint256" }],
    name: "getPool",
    outputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint256", name: "contributionAmount", type: "uint256" },
      { internalType: "uint256", name: "maxMembers", type: "uint256" },
      { internalType: "uint256", name: "currentRound", type: "uint256" },
      { internalType: "uint256", name: "memberCount", type: "uint256" },
      { internalType: "bool", name: "completed", type: "bool" },
      { internalType: "uint256", name: "minimumReputation", type: "uint256" },
      { internalType: "uint256", name: "creatorFeePercent", type: "uint256" },
      { internalType: "uint256", name: "roundDuration", type: "uint256" },
      { internalType: "uint256", name: "roundDeadline", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_poolId", type: "uint256" },
      { internalType: "address", name: "_member", type: "address" },
    ],
    name: "hasJoined",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_poolId", type: "uint256" },
      { internalType: "address", name: "_member", type: "address" },
    ],
    name: "isActiveMember",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_poolId", type: "uint256" }],
    name: "joinPool",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "poolCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "pools",
    outputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint256", name: "contributionAmount", type: "uint256" },
      { internalType: "uint256", name: "maxMembers", type: "uint256" },
      { internalType: "uint256", name: "currentRound", type: "uint256" },
      { internalType: "bool", name: "completed", type: "bool" },
      { internalType: "bool", name: "exists", type: "bool" },
      { internalType: "uint256", name: "minimumReputation", type: "uint256" },
      { internalType: "uint256", name: "creatorFeePercent", type: "uint256" },
      { internalType: "uint256", name: "roundDuration", type: "uint256" },
      { internalType: "uint256", name: "roundDeadline", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "reputation",
    outputs: [{ internalType: "int256", name: "", type: "int256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Type definitions
export interface Pool {
  id: number;
  creator: string;
  contributionAmount: bigint;
  maxMembers: number;
  currentRound: number;
  memberCount: number;
  completed: boolean;
  minimumReputation: number;
  creatorFeePercent: number;
  roundDuration: number;
  roundDeadline: number;
}

export interface PoolDisplay {
  id: number;
  creator: string;
  contributionAmount: string; // formatted ETH string
  maxMembers: number;
  currentRound: number;
  memberCount: number;
  completed: boolean;
  minimumReputation: number;
  creatorFeePercent: number;
  roundDuration: number;
  roundDeadline: number;
  status: "open" | "active" | "completed";
}
