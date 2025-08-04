import React from "react";
import Logo from "../ui/logo";
import { motion } from "framer-motion";

interface ResultHeaderProps {
  userName: string;
  customTitle?: string;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({
  userName,
  customTitle,
}) => (
  <motion.div
    className="text-center space-y-4 py-4"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Logo className="h-12 md:h-16 mx-auto" />
    </motion.div>

    <motion.h1
      className="font-playfair text-xl md:text-3xl font-semibold text-[#432818] px-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      whileHover={{ scale: 1.01 }}
    >
      {customTitle || `Olá, ${userName}, seu Estilo Predominante é:`}
    </motion.h1>

    <motion.div
      className="w-24 h-1 mx-auto bg-gradient-to-r from-amber-300 to-amber-500 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: 96 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    />
  </motion.div>
);

export default ResultHeader;
