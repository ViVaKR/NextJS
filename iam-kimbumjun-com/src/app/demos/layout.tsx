// src/app/demos/layout.tsx
"use client";
import VivDrawerComponent from "@/components/VivDrawer";
import { Button, Box } from "@mui/material";
import React, { useState } from "react";
// import { motion } from "motion/react"
import { AnimatePresence, motion } from "framer-motion"; // Framer Motion 추가
import { usePathname } from "next/navigation";

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const handleShowMenu = () => {
        setOpen(true);
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <VivDrawerComponent open={open} setOpen={setOpen} />
            <Box component="div" sx={{ flexGrow: 1 }}>
                <div className="flex justify-center my-4">
                    <Button onClick={handleShowMenu}>show menu</Button>
                </div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        className="flex flex-col gap-4 p-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </Box>
        </Box>
    );
};

export default Layout;
