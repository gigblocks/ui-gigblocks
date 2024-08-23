"use client"

import { useState } from 'react';
import { Home, FileText, Heart, MessageSquare, Star, FileInput, DollarSign, BarChart2, Briefcase, FolderPlus, ChevronLeft, ChevronRight } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: FileText, label: 'My Proposals', href: '/my-proposals' },
  { icon: MessageSquare, label: 'Message', href: '/message' },
  { icon: Star, label: 'Reviews', href: '/reviews' },
  { icon: DollarSign, label: 'Payouts', href: '/payouts' },
];

const manageItems = [
  { icon: FolderPlus, label: 'Manage Projects', href: '/manage-projects' },
];

export default function Sidebar({ children }: Readonly<{ children: React.ReactNode }>) {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className={`relative transition-all duration-300 ease-in-out ${
                isOpen ? 'w-64' : 'w-16'
            } bg-gray-900 text-white overflow-y-auto`}>
                <div className="p-4 flex items-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold mr-2">
                        R
                    </div>
                    {isOpen && <span className="font-bold text-xl">Freeio.</span>}
                </div>
                <div className="mt-4 px-4">
                    {isOpen && <div className="text-xs text-gray-400 mb-2">Start</div>}
                    {menuItems.map((item, index) => (
                        <a key={index} href={item.href} className="flex items-center py-2 px-2 hover:bg-gray-800 rounded">
                            <item.icon size={20} />
                            {isOpen && <span className="ml-3">{item.label}</span>}
                        </a>
                    ))}
                </div>
                <div className="mt-6 px-4">
                    {isOpen && <div className="text-xs text-gray-400 mb-2">Organize and Manage</div>}
                    {manageItems.map((item, index) => (
                        <a key={index} href={item.href} className="flex items-center py-2 px-2 hover:bg-gray-800 rounded">
                            <item.icon size={20} />
                            {isOpen && <span className="ml-3">{item.label}</span>}
                        </a>
                    ))}
                </div>

                {/* Toggle button */}
                <button
                    className="absolute top-2 -right-3 bg-gray-700 text-white p-1 rounded-full focus:outline-none"
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