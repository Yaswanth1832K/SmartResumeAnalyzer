import { motion } from 'framer-motion';

export function Badge({ children, variant = "neutral", delay = 0 }) {
    const variants = {
        success: "bg-emerald-100 text-emerald-700 border-emerald-200",
        error: "bg-rose-100 text-rose-700 border-rose-200",
        neutral: "bg-slate-100 text-slate-700 border-slate-200",
        indigo: "bg-indigo-100 text-indigo-700 border-indigo-200"
    };

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay }}
            className={`px-3 py-1 rounded-full text-sm font-medium border ${variants[variant]} inline-block shadow-sm`}
        >
            {children}
        </motion.span>
    );
}
