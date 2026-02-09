import { FileText, Sparkles } from 'lucide-react';

export function Navbar() {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2 rounded-lg shadow-lg shadow-indigo-500/30">
                        <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                        SmartResume
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <button
                        onClick={() => scrollToSection('how-it-works')}
                        className="hover:text-indigo-600 transition-colors"
                    >
                        How it works
                    </button>
                    <button
                        onClick={() => scrollToSection('features')}
                        className="hover:text-indigo-600 transition-colors"
                    >
                        Features
                    </button>
                </div>
            </div>
        </nav>
    );
}
