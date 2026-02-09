import { FileText } from 'lucide-react';

export function JobDescriptionInput({ value, onChange, error }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    Job Description
                </label>
                <span className="text-xs text-slate-400 font-medium">
                    {value.length} characters
                </span>
            </div>

            <div className="relative group">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Paste the job description here (e.g., from LinkedIn or Company Website)..."
                    className={`
            w-full h-48 p-5 rounded-xl border bg-white/50 backdrop-blur-sm
            focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all duration-200 resize-none
            placeholder:text-slate-400 text-slate-700 leading-relaxed
            ${error
                            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                            : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-200 group-hover:border-indigo-300'
                        }
          `}
                />
                <div className="absolute bottom-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                </div>
            </div>

            {error && (
                <p className="text-rose-500 text-xs font-medium pl-1">{error}</p>
            )}
        </div>
    );
}
