"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FaBrain,
  FaEye,
  FaUsers,
  FaExclamationTriangle,
  FaHeart,
  FaSadTear,
  FaMeh,
} from "react-icons/fa";

interface MovieAnalysis {
  sentiment: "positive" | "negative" | "neutral";
  themes: string[];
  targetAudience: string;
  contentWarnings: string[];
  summary: string;
}

interface AIMovieAnalysisProps {
  movieId: string;
  title: string;
  overview: string;
  genres: string[];
}

export default function AIMovieAnalysis({
  title,
  overview,
  genres,
}: AIMovieAnalysisProps) {
  const [analysis, setAnalysis] = useState<MovieAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          overview,
          genres,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data.analysis);
      } else {
        setError("Failed to analyze movie");
      }
    } catch {
      setError("Failed to analyze movie");
    } finally {
      setLoading(false);
    }
  }, [title, overview, genres]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <FaHeart className="text-green-400" />;
      case "negative":
        return <FaSadTear className="text-red-400" />;
      default:
        return <FaMeh className="text-yellow-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-400";
      case "negative":
        return "text-red-400";
      default:
        return "text-yellow-400";
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
          <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
        </div>
        <p className="text-gray-400">Analyzing movie content...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-700">
        <div className="flex items-center gap-3 mb-4">
          <FaBrain className="text-cyan-400 text-xl" />
          <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
        </div>
        <p className="text-gray-400">
          {error || "AI analysis not available for this movie."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg">
              <FaBrain className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                AI Movie Analysis
              </h3>
              <p className="text-gray-400 text-sm">
                Powered by artificial intelligence
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition"
          >
            {isExpanded ? "−" : "+"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className={`transition-all duration-300 ${
          isExpanded ? "max-h-none" : "max-h-96 overflow-hidden"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Sentiment Analysis */}
          <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg">
            <div className="text-2xl">
              {getSentimentIcon(analysis.sentiment)}
            </div>
            <div>
              <h4 className="font-semibold text-white">Overall Sentiment</h4>
              <p className={`text-sm ${getSentimentColor(analysis.sentiment)}`}>
                {analysis.sentiment.charAt(0).toUpperCase() +
                  analysis.sentiment.slice(1)}
              </p>
            </div>
          </div>

          {/* Themes */}
          {analysis.themes.length > 0 && (
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <FaEye className="text-purple-400" />
                Key Themes
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.themes.map((theme, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Target Audience */}
          <div>
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <FaUsers className="text-blue-400" />
              Target Audience
            </h4>
            <p className="text-gray-300 bg-zinc-800/50 p-3 rounded-lg">
              {analysis.targetAudience}
            </p>
          </div>

          {/* Content Warnings */}
          {analysis.contentWarnings.length > 0 && (
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <FaExclamationTriangle className="text-orange-400" />
                Content Warnings
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.contentWarnings.map((warning, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30"
                  >
                    {warning}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Summary */}
          <div>
            <h4 className="font-semibold text-white mb-3">AI Summary</h4>
            <p className="text-gray-300 bg-zinc-800/50 p-3 rounded-lg leading-relaxed">
              {analysis.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Expand/Collapse Indicator */}
      {!isExpanded && (
        <div className="p-4 border-t border-zinc-700 bg-gradient-to-t from-zinc-900 to-transparent">
          <p className="text-center text-gray-400 text-sm">
            Click to see full AI analysis
          </p>
        </div>
      )}
    </div>
  );
}
