# CircleTrust 🔄

> Decentralized Rotating Savings and Credit Association (ROSCA) platform built on Monad Testnet

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://circletrust.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Monad](https://img.shields.io/badge/Monad-Testnet-purple)](https://monad.xyz)

## 🌟 Overview

CircleTrust reimagines traditional savings circles for the blockchain era. It enables trustless, transparent rotating savings pools where members contribute regular amounts and take turns receiving payouts. With built-in reputation tracking, collateral requirements, and smart contract automation, CircleTrust makes community savings accessible to everyone.

**Contract Address**: `0x22E2d4EEa809954bF2cc9794a5442bc8044d1a23` (Monad Testnet)

## ✨ Key Features

- **🔒 Trustless Operations**: Smart contract-enforced contribution and distribution cycles
- **⭐ Reputation System**: On-chain reputation (+1 for completion, -2 for defaults) 
- **💰 Collateral Protection**: 2x collateral requirement ensures commitment
- **⏰ Time-Based Automation**: Automatic round progression with configurable durations
- **🎯 Customizable Pools**: Flexible parameters for pool size, contribution amounts, and reputation requirements
- **📊 Real-time Dashboard**: Live pool status, member tracking, and reputation scores
- **🔄 Auto-refresh**: 10-second intervals keep data synchronized

## 🏗️ Architecture

### Smart Contract (`circletrust.sol`)
- **Solidity Version**: 0.8.28
- **Network**: Monad Testnet (Chain ID: 10143)
- **Key Functions**:
  - `createPool()` - Initialize new savings pools
  - `joinPool()` - Join with 2x collateral
  - `distribute()` - Automated round payouts
  - Reputation tracking for accountability

### Frontend
- **Framework**: Next.js 16.1.6 with App Router
- **UI**: React 19.2.3 + Tailwind CSS 4
- **Web3**: ethers.js 6.16.0
- **Deployment**: Vercel (auto-deploy from GitHub)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Monad Testnet MON tokens ([faucet link](https://faucet.monad.xyz))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/codesbysuraj/monad-blitz-mumbai-CircleTrust.git
cd circletrust
```

2. **Install smart contract dependencies**
```bash
cd backend/contracts
npm install
```

3. **Install frontend dependencies**
```bash
cd ../../frontend
npm install
```

4. **Configure environment**
```bash
# In backend/contracts/.env
PRIVATE_KEY=your_private_key_here
MONAD_RPC_URL=https://testnet-rpc.monad.xyz

# In frontend/.env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0x22E2d4EEa809954bF2cc9794a5442bc8044d1a23
```

### Development

**Run the frontend locally:**
```bash
cd frontend
npm run dev
```
Visit `http://localhost:3000`

**Compile smart contracts:**
```bash
cd backend/contracts
npx hardhat compile
```

**Deploy contracts:**
```bash
npx hardhat run scripts/deploy.ts --network monad
```

## 📖 How to Use

### Creating a Pool

1. Connect your MetaMask wallet to Monad Testnet
2. Navigate to "Pools" page
3. Click "Create Pool" and configure:
   - **Contribution Amount**: Amount each member contributes per round
   - **Max Members**: Total pool size (minimum 2)
   - **Minimum Reputation**: Required reputation to join (use 0 for testing)
   - **Round Duration**: Time between payouts (in seconds)
4. Confirm transaction and pay 2x collateral

### Joining a Pool

1. Browse available pools on the Pools page
2. Select an "Open" pool
3. Click "Join Pool" 
4. Confirm transaction with 2x the contribution amount
5. Wait for all members to join

### Receiving Payouts

- Once a pool is full, it becomes "Active"
- After each round duration, anyone can trigger `distribute()`
- Receiver gets their payout + collateral back
- Remaining members contribute for the next round
- Reputation increases (+1) for successful participation

### Reputation System

- **Start**: 0 reputation for new wallets
- **Gain**: +1 for each successful pool completion
- **Lose**: -2 for each default/missed payment
- **Purpose**: Gating mechanism for higher-value pools

## 🧪 Testing Guide

### Two-Person Test Pool

1. **Account 1**: Create pool (0.001 MON, 2 members, 0 min reputation, 60 seconds)
2. **Account 2**: Join with 0.002 MON
3. Wait 60 seconds
4. **Either account**: Call `distribute()` → Account 1 receives payout
5. Wait 60 seconds
6. **Either account**: Call `distribute()` → Account 2 receives payout
7. Verify both accounts have +1 reputation

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Blockchain | Monad Testnet |
| Smart Contracts | Solidity 0.8.28, Hardhat 3.1.9 |
| Frontend | Next.js 16.1.6, React 19.2.3, TypeScript |
| Styling | Tailwind CSS 4 |
| Web3 Integration | ethers.js 6.16.0 |
| Deployment | Vercel (Frontend), Hardhat (Contracts) |

## 📁 Project Structure

```
circletrust/
├── backend/
│   └── contracts/
│       ├── contracts/
│       │   └── circletrust.sol        # Main ROSCA contract
│       ├── scripts/
│       │   └── deploy.ts              # Deployment script
│       └── hardhat.config.ts          # Hardhat configuration
├── frontend/
│   ├── app/
│   │   ├── context/
│   │   │   └── Web3Context.tsx        # Web3 provider & contract interactions
│   │   ├── lib/
│   │   │   └── contract.ts            # Contract ABI & configuration
│   │   ├── pools/
│   │   │   └── page.tsx               # Pool browsing & creation
│   │   ├── dashboard/
│   │   │   └── page.tsx               # User dashboard
│   │   └── page.tsx                   # Landing page
│   └── package.json
└── README.md
```

## 🌐 Live Deployment

**Frontend**: [https://circletrust.vercel.app](https://circletrust.vercel.app)  
**Smart Contract**: [0x22E2d4EEa809954bF2cc9794a5442bc8044d1a23](https://testnet.monad.xyz/address/0x22E2d4EEa809954bF2cc9794a5442bc8044d1a23)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built for Monad Blitz Mumbai Hackathon
- Powered by Monad's high-performance blockchain
- Inspired by traditional ROSCA systems worldwide

## 📞 Contact & Support

- **GitHub**: [codesbysuraj/monad-blitz-mumbai-CircleTrust](https://github.com/codesbysuraj/monad-blitz-mumbai-CircleTrust)
- **Demo**: [circletrust.vercel.app](https://circletrust.vercel.app)

---

**Built with ❤️ on Monad Testnet**