import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle, AlertCircle, TrendingUp, Sparkles, XCircle } from 'lucide-react';

export function AnalysisResult({ result }) {
    if (!result) return null;

    const { match_percentage, matched_skills, missing_skills, suggestions } = result;

    // Determine status color
    const getStatusColor = (score) => {
        if (score >= 80) return "text-emerald-500";
        if (score >= 50) return "text-amber-500";
        return "text-rose-500";
    };

    const getProgressColor = (score) => {
        if (score >= 80) return "bg-gradient-to-r from-emerald-500 to-teal-400";
        if (score >= 50) return "bg-gradient-to-r from-amber-500 to-orange-400";
        return "bg-gradient-to-r from-rose-500 to-pink-500";
    };

    return (
        <div className="space-y-6">
            {/* 1. Score Card */}
            <Card className="text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className={`h-full ${getProgressColor(match_percentage)}`}
                    />
                </div>

                <h3 className="text-lg font-medium text-slate-500 mb-6 uppercase tracking-wider text-xs">ATScore Analysis</h3>

                <div className="relative inline-flex items-center justify-center mb-6">
                    <svg className="w-40 h-40 transform -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            className="text-slate-100"
                        />
                        <motion.circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            strokeLinecap="round"
                            className={getStatusColor(match_percentage)}
                            initial={{ strokeDasharray: 440, strokeDashoffset: 440 }}
                            animate={{ strokeDashoffset: 440 - (440 * match_percentage) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className={`text-5xl font-extrabold ${getStatusColor(match_percentage)}`}
                        >
                            {match_percentage}%
                        </motion.span>
                        <span className="text-xs font-semibold text-slate-400 mt-1">MATCH</span>
                    </div>
                </div>

                <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                    {match_percentage >= 80
                        ? "Excellent! Your resume is highly optimized for this role."
                        : match_percentage >= 50
                            ? "Good start. Address the missing skills to improve your ranking."
                            : "Significant gaps found. Requires major tailored updates."}
                </p>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* 2. Matched Skills */}
                <Card delay={0.2} className="border-l-4 border-l-emerald-400">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-800">Matched Skills</h4>
                        <span className="ml-auto bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded-full">
                            {matched_skills.length}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {matched_skills.length > 0 ? (
                            matched_skills.map((skill, i) => (
                                <Badge key={skill} variant="success" delay={0.3 + (i * 0.05)}>
                                    {skill}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-slate-400 text-sm italic py-2">No direct skill matches found.</span>
                        )}
                    </div>
                </Card>

                {/* 3. Missing Skills */}
                <Card delay={0.3} className="border-l-4 border-l-rose-400">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                            <XCircle className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-800">Missing Keywords</h4>
                        <span className="ml-auto bg-rose-50 text-rose-600 text-xs font-bold px-2 py-1 rounded-full">
                            {missing_skills.length}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {missing_skills.length > 0 ? (
                            missing_skills.map((skill, i) => (
                                <Badge key={skill} variant="error" delay={0.4 + (i * 0.05)}>
                                    {skill}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-slate-400 text-sm italic py-2">No missing critical skills detected!</span>
                        )}
                    </div>
                </Card>
            </div>

            {/* 4. AI Strategic Suggestions */}
            <div className="space-y-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    Strategic Recommendations
                </h4>

                <div className="grid gap-3">
                    {Array.isArray(suggestions) && suggestions.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (index * 0.1) }}
                            className={`p-4 rounded-xl border flex gap-4 ${item.type === 'critical' ? 'bg-rose-50 border-rose-100' :
                                    item.type === 'warning' || item.type === 'skill_gap' ? 'bg-amber-50 border-amber-100' :
                                        item.type === 'success' ? 'bg-emerald-50 border-emerald-100' :
                                            'bg-indigo-50 border-indigo-100'
                                }`}
                        >
                            <div className={`mt-0.5 shrink-0 ${item.type === 'critical' ? 'text-rose-600' :
                                    item.type === 'warning' || item.type === 'skill_gap' ? 'text-amber-600' :
                                        item.type === 'success' ? 'text-emerald-600' :
                                            'text-indigo-600'
                                }`}>
                                {item.type === 'critical' ? <AlertCircle className="w-5 h-5" /> :
                                    item.type === 'skill_gap' ? <TrendingUp className="w-5 h-5" /> :
                                        item.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                                            <Sparkles className="w-5 h-5" />}
                            </div>
                            <div>
                                <h5 className={`font-semibold text-sm mb-1 ${item.type === 'critical' ? 'text-rose-900' :
                                        item.type === 'warning' || item.type === 'skill_gap' ? 'text-amber-900' :
                                            item.type === 'success' ? 'text-emerald-900' :
                                                'text-indigo-900'
                                    }`}>
                                    {item.title}
                                </h5>
                                <p className={`text-sm leading-relaxed ${item.type === 'critical' ? 'text-rose-700' :
                                        item.type === 'warning' || item.type === 'skill_gap' ? 'text-amber-700' :
                                            item.type === 'success' ? 'text-emerald-700' :
                                                'text-indigo-700'
                                    }`}>
                                    {item.message}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                    {/* Fallback if suggestions is string (for backward compatibility or error) */}
                    {typeof suggestions === 'string' && (
                        <motion.div className="p-4 rounded-xl border bg-slate-50 border-slate-100 text-slate-600">
                            {suggestions}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
