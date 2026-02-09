import { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UploadZone({ onFileSelect, selectedFile, error }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const inputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) onFileSelect(file);
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className="w-full group">
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
          p-10 text-center
          ${isDragOver
                        ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]'
                        : error
                            ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400'
                            : selectedFile
                                ? 'border-emerald-400 bg-emerald-50/30'
                                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'
                    }
        `}
            >
                <input
                    type="file"
                    ref={inputRef}
                    hidden
                    accept=".pdf"
                    onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
                />

                <AnimatePresence mode="wait">
                    {selectedFile ? (
                        <motion.div
                            key="file-selected"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2 shadow-sm">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">{selectedFile.name}</h3>
                            <p className="text-slate-500 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
                            <span className="text-xs text-indigo-600 font-medium mt-2 group-hover:underline">Click to replace</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload-prompt"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-sm transition-colors
                ${isDragOver ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-400 border border-slate-100'}
              `}>
                                <Upload className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">Upload your Resume</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">
                                Drag and drop your PDF here, or click to browse.
                                <span className="block text-xs mt-2 text-slate-400">Max size: 5MB</span>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isDragOver && (
                    <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[1px] flex items-center justify-center">
                        <p className="text-indigo-600 font-bold text-lg bg-white/90 px-6 py-2 rounded-full shadow-lg">Drop to upload</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-rose-500 text-sm mt-2 font-medium flex items-center gap-1.5 justify-center"
                    >
                        <X className="w-4 h-4" />
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}
