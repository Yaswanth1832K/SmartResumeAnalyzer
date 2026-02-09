import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function Button({
    children,
    onClick,
    variant = 'primary',
    isLoading = false,
    disabled = false,
    className = "",
    type = "button"
}) {
    const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";

    const variants = {
        primary: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:to-violet-500",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 shadow-sm",
        outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
        ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
    };

    return (
        <motion.button
            type={type}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed grayscale" : ""} ${className}`}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                </>
            ) : children}
        </motion.button>
    );
}
