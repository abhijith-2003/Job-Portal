import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Briefcase, AlertCircle } from 'lucide-react';

const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Initialize Gemini API with Vite's environment variable
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-500">Configuration Error</h2>
          <p className="mb-4">Please set up your Gemini API key in the .env file:</p>
          <pre className="bg-gray-100 p-4 rounded mb-4">
            VITE_GEMINI_API_KEY=your_api_key_here
          </pre>
          <p>You can get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a></p>
        </Card>
      </div>
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setResumeFile(file);
    setError(null);
  };

  const extractTextFromResume = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsText(file);
    });
  };

  const parseAnalysis = (text) => {
    // Extract score
    const scoreMatch = text.match(/Score: (\d+)/);
    if (scoreMatch) {
      setScore(parseInt(scoreMatch[1]));
    }

    // Extract missing keywords
    const keywordsMatch = text.match(/Missing Keywords:([\s\S]*?)(?=Suggestions:|$)/i);
    if (keywordsMatch) {
      const keywords = keywordsMatch[1]
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      setMissingKeywords(keywords);
    }

    // Extract suggestions
    const suggestionsMatch = text.match(/Suggestions:([\s\S]*?)$/i);
    if (suggestionsMatch) {
      const suggestions = suggestionsMatch[1]
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => s.replace(/^[•\-\*#\d\.\s]+/, '').trim())
        .filter(s => s.length > 0)
        .slice(0, 7);
      setSuggestions(suggestions);
    }
  };

  const analyzeResume = async () => {
    if (!resumeFile || !jobDescription) {
      setError('Please upload a resume and provide a job description');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const resumeText = await extractTextFromResume(resumeFile);
      
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `
        Analyze this resume against the job description and provide the following in a structured format:

        1. First line should be "Score: XX" where XX is a number between 0-100
        2. Then "Missing Keywords:" followed by a comma-separated list of missing keywords
        3. Finally "Suggestions:" followed by 6-7 bullet points for improvement suggestions

        Keep suggestions concise (1-2 lines each) and focus on actionable improvements.
        Do not use quotes, numbers, or special characters in the suggestions.
        Each suggestion should start with a bullet point (•).

        Resume:
        ${resumeText}
        
        Job Description:
        ${jobDescription}
      `;

      const result = await model.generateContent({
        contents: [{
          parts: [{ text: prompt }]
        }]
      });
      
      const response = await result.response;
      const text = response.text();
      
      parseAnalysis(text);
      setAnalysis(text);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      if (error.message.includes('API key')) {
        setError('Invalid API key. Please check your Gemini API key in the .env file.');
      } else if (error.message.includes('model')) {
        setError('Error accessing the AI model. Please try again later.');
      } else {
        setError('Error analyzing resume. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto p-6 pb-20 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl lg:text-6xl tracking-tighter py-4">
            ATS Resume Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your resume and job description to get instant feedback
          </p>
        </div>
        
        <div className="space-y-8">
          <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/5 backdrop-blur-sm border border-gray-200/10">
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Resume
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-300">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX, or TXT files</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Job Description
                </label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="min-h-[200px] resize-none bg-transparent border border-gray-200/20 rounded-lg focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              )}

              <Button
                onClick={analyzeResume}
                disabled={loading}
                className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                {loading ? 'Analyzing...' : 'Analyze Resume'}
              </Button>
            </div>
          </Card>

          {score > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/5 backdrop-blur-sm border border-gray-200/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Resume Match Score</h2>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                    {score}
                  </div>
                </div>
                <div className="space-y-4">
                  <Progress value={score} className="h-3 bg-gray-200/20" />
                  <p className="text-center text-lg font-medium">
                    {score >= 80 ? 'Excellent Match!' : 
                     score >= 60 ? 'Good Match' : 
                     score >= 40 ? 'Fair Match' : 
                     'Needs Improvement'}
                  </p>
                </div>
              </Card>

              {missingKeywords.length > 0 && (
                <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/5 backdrop-blur-sm border border-gray-200/10">
                  <h2 className="text-2xl font-semibold mb-6">Missing Keywords</h2>
                  <div className="flex flex-wrap gap-3">
                    {missingKeywords.map((keyword, index) => (
                      <span 
                        key={index} 
                        className="px-4 py-2 bg-red-100/10 text-red-400 rounded-full text-sm font-medium hover:bg-red-100/20 transition-colors duration-300 border border-red-200/20"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {suggestions.length > 0 && (
            <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/5 backdrop-blur-sm border border-gray-200/10">
              <h2 className="text-2xl font-semibold mb-6">Improvement Suggestions</h2>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="flex items-start"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer; 