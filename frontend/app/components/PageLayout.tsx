"use client";

import Link from "next/link";
import { HamburgerMenu } from "./Sidebar";
import { useWeb3 } from "../context/Web3Context";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const { isConnected, isConnecting, connect, address, isCorrectNetwork, switchNetwork } = useWeb3();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/50 backdrop-blur-xl px-8 py-4 bg-slate-950/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Hamburger Menu */}
            <HamburgerMenu />

            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">CT</span>
              </div>
              <div>
                <div className="text-xl font-bold">CircleTrust</div>
                <div className="text-xs text-gray-400">Monad Testnet</div>
              </div>
            </Link>
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

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
}
