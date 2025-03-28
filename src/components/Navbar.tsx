import React, { useState } from 'react';
import { Home, Bolt, LogOut } from 'lucide-react';
import { useAuth } from './SignStateContext';
import { Button } from './ui/button';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, signOut } = useAuth()

  const navItems = [
    { name: "Home", link: "/", icon: <Home /> },
    { name: "Blogs", link: "/home", icon: <Bolt /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        <div className="flex items-center space-x-2">
          <a href="/">
          <div className="relative">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 animate-pulse">
              FLASH
            </span>
            <span className="absolute top-0 left-0 text-2xl font-black text-white/20 blur-sm animate-pulse">
              FLASH
            </span>
          </div>
          </a>
        </div>


        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <a 
              key={item.name}
              href={item.link} 
              className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
            >
              {React.cloneElement(item.icon, {
                className: "h-5 w-5 text-gray-400 group-hover:text-yellow-400 transition-colors"
              })}
              <span>{item.name}</span>
            </a>
          ))}
          {isSignedIn && <Button onClick={() => signOut()} className='text-white'><LogOut/>Logout</Button>}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 absolute top-full left-0 w-full">
          {navItems.map((item) => (
            <a 
              key={item.name}
              href={item.link} 
              className="px-4 py-3 text-gray-300 hover:bg-gray-800 flex items-center space-x-3"
            >
              {React.cloneElement(item.icon, {
                className: "h-5 w-5 mr-3 text-gray-400"
              })}
              {item.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;