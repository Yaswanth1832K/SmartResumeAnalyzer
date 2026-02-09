import { motion } from 'framer-motion';

export function Card({ children, className = "", delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={`bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-6 ${className}`}
        >
            {children}
        </motion.div>
    );
}
