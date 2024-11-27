"use client";

import localFont from "next/font/local";
import "./globals.css";
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Book, 
  Upload, 
  LayoutDashboard, 
  Settings, 
  Library, 
  PlusCircle,
  ChevronRight
} from 'lucide-react';
import { BookProvider } from '@/context/BookContext';
import { ClerkProvider, SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const Sidebar = ({ activeTab, handleTabChange }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', tab: 'dashboard' },
    { icon: PlusCircle, label: 'New Book', tab: 'new-book' },
    { icon: Upload, label: 'Upload Images', tab: 'upload' },
    { icon: Library, label: 'My Books', tab: 'my-books' },
    { icon: Settings, label: 'Settings', tab: 'settings' }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-72 md:flex md:flex-col bg-gradient-to-b from-[#1E293B] to-[#0F172A] shadow-xl z-50 p-6">
        <div className="flex items-center mb-6">
          <Book className="mr-3 text-blue-400" size={32} />
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            BookCraft AI
          </h1>
        </div>

        {/* Add User Profile Section */}
        <div className="mb-8 p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center justify-between">
            <UserButton
              appearance={{
                elements: {
                  userButtonBox: "w-full flex items-center justify-between",
                  userButtonTrigger: "flex items-center gap-2",
                  userButtonAvatarBox: "w-10 h-10",
                  userButtonOuterIdentifier: "text-gray-300 ml-2",
                }
              }}
              afterSignOutUrl="/sign-in"
            />
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => handleTabChange(item.tab)}
              className={`
                w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 
                ${activeTab === item.tab 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
              `}
            >
              <div className="flex items-center">
                <item.icon className="mr-3" size={20} />
                {item.label}
              </div>
              {activeTab === item.tab && <ChevronRight size={20} />}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#1E293B] to-[#0F172A] md:hidden z-50">
        <nav className="flex justify-around p-4">
          {menuItems.slice(0, 4).map((item) => (
            <button
              key={item.tab}
              onClick={() => handleTabChange(item.tab)}
              className={`flex flex-col items-center ${
                activeTab === item.tab ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default function RootLayout({ children }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'new-book') {
      router.push('/CreateBook');
    } else if (tab === 'dashboard') {
      router.push('/');
    }
  };

  // Update active tab based on current path
  React.useEffect(() => {
    if (pathname === '/') setActiveTab('dashboard');
    else if (pathname === '/CreateBook') setActiveTab('new-book');
  }, [pathname]);

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <BookProvider>
            <SignedIn>
              <Sidebar activeTab={activeTab} handleTabChange={handleTabChange} />
              <div className="md:ml-72 pb-20 md:pb-0">
                {children}
              </div>
            </SignedIn>
            <SignedOut>
              {children}
            </SignedOut>
          </BookProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
