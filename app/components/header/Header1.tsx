"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useReadContract } from 'wagmi';
import { config, GigBlocksAbi, GIGBLOCKS_ADDRESS } from '@/app/config';
import WalletButton from '../WalletButton';

export default function Header1() {
  const { address, isConnected } = useAccount({
    config,
  });

  const result = useReadContract({
    abi: GigBlocksAbi,
    address: GIGBLOCKS_ADDRESS,
    functionName: 'isRegistered',
    args: [address]
  });

  const isRegistered = result.data;

  return (
    <header className="fixed w-full bg-green-500 z-10 shadow-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              width={250}
              height={180}
              src="/logo.png"
              alt="Header Logo"
              className="h-16 w-auto"
            />
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {isConnected && isRegistered ? (
            <Link href="/dashboard" className="bg-white text-green-500 px-11 py-3 rounded-full hover:bg-green-100 transition duration-300 font-semibold shadow-md hover:shadow-lg text-lg">
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/register" className="bg-white text-green-500 px-11 py-1.5 rounded-full hover:bg-green-100 transition duration-300 font-semibold shadow-md hover:shadow-lg text-lg">
              Join
            </Link>
          )}
          <WalletButton registerSession={true} />
        </div>
        <div className="md:hidden">
          {/* Add a mobile menu button here */}
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
