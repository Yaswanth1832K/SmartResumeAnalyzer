import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { UploadZone } from './components/features/UploadZone';
import { JobDescriptionInput } from './components/features/JobDescriptionInput';
import { AnalysisResult } from './components/features/AnalysisResult';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError("Only PDF files are allowed.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setFile(selectedFile);
    setError("");
    setResult(null);

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumeText(response.data.text);
    } catch (err) {
      console.error(err);
      setError("Failed to extract text from PDF. Please try again.");
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText) {
      setError("Please upload a resume first.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post('http://localhost:5000/analyze', {
        resume_text: resumeText,
        job_description: jobDescription,
      });
      // Add a small artificial delay for better UX (to show loading state)
      await new Promise(resolve => setTimeout(resolve, 800));
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    setResumeText("");
    setJobDescription("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/50 to-transparent -z-10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl -z-10" />
      <div className="absolute top-20 -left-20 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl -z-10" />

      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-sm font-medium shadow-sm mb-6"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Powered ATS Optimization</span>
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                  Is your resume ready for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">dream job?</span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Upload your resume and the job description to get an instant match score, missing keywords, and tailored improvement suggestions.
                </p>
              </div>

              <div className="grid md:grid-cols-12 gap-8">
                <div className="md:col-span-12 lg:col-span-7 space-y-6">
                  <Card>
                    <UploadZone
                      onFileSelect={handleFileSelect}
                      selectedFile={file}
                      error={error && !file ? error : null}
                    />
                  </Card>

                  <Card delay={0.1}>
                    <JobDescriptionInput
                      value={jobDescription}
                      onChange={setJobDescription}
                      error={error && !jobDescription ? error : null}
                    />
                  </Card>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleAnalyze}
                      isLoading={isLoading}
                      disabled={!file || !jobDescription}
                      className="flex-1 text-lg py-4 shadow-xl shadow-indigo-500/20"
                    >
                      Analyze Resume <ArrowRight className="w-5 h-5 ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="hidden lg:block lg:col-span-5 space-y-6">
                  {/* Decorative Side Panel / Tips */}
                  <Card delay={0.3} className="h-full bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none relative overflow-hidden">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-4 opacity-90">Why optimize?</h3>
                        <ul className="space-y-4 text-indigo-100">
                          <li className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-sm font-bold">1</div>
                            <p>Beat the Applicant Tracking Systems (ATS) filters.</p>
                          </li>
                          <li className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-sm font-bold">2</div>
                            <p>Identify critical missing hard & soft skills.</p>
                          </li>
                          <li className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-sm font-bold">3</div>
                            <p>Increase your chances of landing an interview by 3x.</p>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-8 pt-8 border-t border-white/20">
                        <div className="flex items-center gap-3 opacity-80">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full bg-white/30 border-2 border-indigo-600" />
                            ))}
                          </div>
                          <p className="text-sm">Trusted by job seekers worldwide</p>
                        </div>
                      </div>
                    </div>

                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                  </Card>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results-section"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-8">
                <Button variant="ghost" onClick={clearAll} className="gap-2 pl-0 hover:bg-transparent hover:text-indigo-600">
                  <RotateCcw className="w-4 h-4" />
                  Analyze Another
                </Button>
                <h2 className="text-2xl font-bold text-slate-800">Analysis Results</h2>
              </div>

              <AnalysisResult result={result} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features & How it Works Sections (Only visible when no result) */}
        {!result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-32 space-y-32"
          >
            {/* How it Works */}
            <section id="how-it-works" className="scroll-mt-24">
              <div className="text-center mb-16">
                <span className="text-indigo-600 font-semibold tracking-wider text-sm uppercase">Simple Process</span>
                <h2 className="text-3xl font-bold text-slate-900 mt-2">How it works</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: "Upload Resume", desc: "Upload your existing resume in PDF format. We extract the text securely.", step: "01" },
                  { title: "Paste Job Description", desc: "Copy the job description from LinkedIn, Indeed, or any career page.", step: "02" },
                  { title: "Get Instant Feedback", desc: "Receive a match score and actionable advice to improve your application.", step: "03" }
                ].map((item, i) => (
                  <div key={i} className="relative p-8 rounded-2xl bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="absolute -top-6 left-8 text-6xl font-black text-indigo-50/80 select-none z-0">
                      {item.step}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Features */}
            <section id="features" className="scroll-mt-24">
              <div className="bg-slate-900 rounded-3xl p-12 md:p-20 text-white relative overflow-hidden">
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <span className="text-indigo-400 font-bold tracking-wider text-sm uppercase">Why Choose Us</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">Engineered for your success</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                      Our advanced algorithms mimic real-world Applicant Tracking Systems used by Fortune 500 companies.
                    </p>
                    <ul className="space-y-4">
                      {[
                        "Hybrid Matching Algorithm (Keywords + Context)",
                        "Instant PDF Parsing & Analysis",
                        "Privacy First - No data storage",
                        "Detailed Skill Gap Analysis"
                      ].map((feat, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-200">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          </div>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 blur-3xl opacity-20" />
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <div className="h-2 w-24 bg-white/20 rounded mb-2" />
                          <div className="h-2 w-16 bg-white/10 rounded" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-2 w-full bg-white/10 rounded" />
                        <div className="h-2 w-full bg-white/10 rounded" />
                        <div className="h-2 w-3/4 bg-white/10 rounded" />
                      </div>
                      <div className="mt-6 flex gap-2">
                        <div className="h-8 w-20 bg-indigo-500/20 rounded-lg border border-indigo-500/30" />
                        <div className="h-8 w-20 bg-white/5 rounded-lg border border-white/10" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              </div>
            </section>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;
