"use client"

import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { config, GIGBLOCKS_ADDRESS, GigBlocksAbi } from '@/app/config';
import Link from 'next/link';
import { Star, DollarSign, FolderPlus, ChevronLeft, ChevronRight } from 'lucide-react';

const menuItems = [
  { icon: Star, label: 'Reviews', href: '/reviews' },
  { icon: DollarSign, label: 'Payouts', href: '/payouts' },
];

let manageItems = [
  { icon: FolderPlus, label: 'Manage Projects', href: '/manage-projects' },
  { icon: FolderPlus, label: 'Create Projects', href: '/create-projects' },
];

export default function Sidebar({ children }: Readonly<{ children: React.ReactNode }>) {
  const account = useAccount()
  const {data: isClient} = useReadContract({ abi: GigBlocksAbi, address: GIGBLOCKS_ADDRESS, functionName: 'isClient', args: [account.address] })  
  const [isOpen, setIsOpen] = useState<boolean>(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    manageItems = !isClient ? [
      { icon: FolderPlus, label: 'Manage Projects', href: '/manage-projects' }] 
    : [
      { icon: FolderPlus, label: 'Manage Projects', href: '/manage-projects' },
      { icon: FolderPlus, label: 'Create Projects', href: '/create-projects' },
    ]
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div style={{ overflow: 'visible' }} className={`relative transition-all duration-300 ease-in-out z-0 ${
                isOpen ? 'w-64' : 'w-16'
            } bg-green-500 text-gray-100`}>
                <div className="mt-4 px-4">
                    {isOpen && <div className="text-s mb-2">
                        <div className="flex items-center space-x-2">
                            <Link href="/" className="flex items-center">
                            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                            </Link>
                        </div>
                        </div>}
                    {manageItems.map((item, index) => (
                        <a key={index} href={item.href} className="flex items-center py-2 px-2 hover:bg-gray-800 rounded">
                            <item.icon size={20} />
                            {isOpen && <span className="ml-3">{item.label}</span>}
                        </a>
                    ))}
                    {menuItems.map((item, index) => {
                      return (
                        <a key={index} href={item.href} className="flex items-center py-2 px-2 hover:bg-gray-800 rounded">
                            <item.icon size={20} />
                            {isOpen && <span className="ml-3">{item.label}</span>}
                        </a>
                      )
                    })}
                </div>

                {/* Toggle button */}
                <button
                    className="absolute top-2 -right-3 bg-gray-700 text-white p-1 rounded-full focus:outline-none z-30"
                    onClick={toggleSidebar}
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto">
                {children}
            </div>
        </div>
    );
};