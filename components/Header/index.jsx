'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { PiGlobeSimpleX ,PiGlobeSimpleLight } from "react-icons/pi";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // ESC key to close menu
    useEffect(() => {
        if (!isMenuOpen) return;

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isMenuOpen]);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4">
                <div>
                    <Image src="/img/logo.png" alt="logo" width={120} height={120} />
                </div>

                <button
                    onClick={toggleMenu}
                    className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#2c3144] hover:bg-[#3a4050] transition-colors cursor-pointer"
                >
                    <PiGlobeSimpleLight  className="text-2xl text-[#d2b6ec]" />
                </button>
            </header>

            {/* Backdrop */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                        onClick={closeMenu}
                    />
                )}
            </AnimatePresence>

            {/* Side Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-950 border-l border-slate-800 shadow-2xl z-[70] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-800">
                            <div>
                                <Image src="/img/logo.png" alt="logo" width={90} height={90} />
                            </div>
                            <button
                                onClick={closeMenu}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                            >
                                <PiGlobeSimpleX className="text-2xl text-[#d2b6ec]" />
                            </button>
                        </div>

                        {/* Menu Content */}
                        <div className="p-6">
                            <nav className="space-y-2">
                                <Link
                                    href="#"
                                    className="block px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                    onClick={closeMenu}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="#"
                                    className="block px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                    onClick={closeMenu}
                                >
                                    About
                                </Link>
                                <Link
                                    href="#"
                                    className="block px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                    onClick={closeMenu}
                                >
                                    Contact
                                </Link>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
