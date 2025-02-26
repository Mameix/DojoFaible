import React from 'react';
import { motion } from 'framer-motion';

interface BankProps {
  amount: number;
}

export const Bank: React.FC<BankProps> = ({ amount }) => {
  return (
    <motion.div
      className="fixed bottom-4 left-4 bg-gradient-to-r from-yellow-600 to-yellow-400 p-4 rounded-lg shadow-lg"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-2xl font-bold text-white">
        Total : {amount} €
      </div>
    </motion.div>
  );
};