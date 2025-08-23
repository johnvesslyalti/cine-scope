"use client";

import { useState, useEffect, useRef } from 'react';
import { FaBrain, FaSearch, FaLightbulb, FaTimes, FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface AISearchSuggestion {
  query: string;
  type: 'genre' | 'mood' | 'actor' | 'director' | 'year' | 'general';
  confidence: number;
}

interface AISearchAssistantProps {
  onSearch: (query: string) => void;
  currentQuery?: string;
  searchHistory?: string[];
}

export default function AISearchAssistant({ 
  onSearch, 
  currentQuery = '', 
  searchHistory = [] 
}: AISearchAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<AISearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(currentQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setInputValue(currentQuery);
  }, [currentQuery]);

  const handleInputChange = async (value: string) => {
    setInputValue(value);
    
    if (value.length > 2) {
      setLoading(true);
      try {
        const response = await fetch('/api/ai/search-suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: value,
            searchHistory: searchHistory.slice(0, 5) // Last 5 searches
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching AI suggestions:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: AISearchSuggestion) => {
    setInputValue(suggestion.query);
    setShowSuggestions(false);
    onSearch(suggestion.query);
    router.push(`/search?q=${encodeURIComponent(suggestion.query)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'genre': return '🎭';
      case 'mood': return '😊';
      case 'actor': return '👤';
      case 'director': return '🎬';
      case 'year': return '📅';
      default: return '🔍';
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'genre': return 'text-purple-400';
      case 'mood': return 'text-yellow-400';
      case 'actor': return 'text-blue-400';
      case 'director': return 'text-green-400';
      case 'year': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="relative">
      {/* AI Search Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 rounded-lg font-semibold transition-all duration-200"
      >
        <FaBrain className="text-white" />
        <span className="text-white">AI Search</span>
      </button>

      {/* AI Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-2xl border border-zinc-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg">
                  <FaBrain className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">AI Search Assistant</h2>
                  <p className="text-gray-400 text-sm">Get intelligent movie suggestions</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-zinc-800 rounded-lg transition"
              >
                <FaTimes className="text-gray-400" />
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Describe what you're looking for... (e.g., 'sci-fi movies like Blade Runner' or 'feel-good comedies from the 90s')"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg hover:from-cyan-500 hover:to-blue-600 transition"
                >
                  <FaSearch className="text-white" />
                </button>
              </div>
            </form>

            {/* AI Suggestions */}
            {showSuggestions && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FaLightbulb className="text-yellow-400" />
                  <h3 className="text-white font-semibold">AI Suggestions</h3>
                </div>
                
                {loading ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
                    <span>Analyzing your query...</span>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center justify-between p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                          <div className="text-left">
                            <p className="text-white font-medium">{suggestion.query}</p>
                            <p className={`text-xs ${getSuggestionColor(suggestion.type)}`}>
                              {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)} • {suggestion.confidence}/10 confidence
                            </p>
                          </div>
                        </div>
                        <FaArrowRight className="text-gray-400 group-hover:text-cyan-400 transition" />
                      </button>
                    ))}
                  </div>
                ) : inputValue.length > 2 ? (
                  <p className="text-gray-400 text-sm">No AI suggestions available for this query.</p>
                ) : null}
              </div>
            )}

            {/* Quick Examples */}
            <div>
              <h3 className="text-white font-semibold mb-3">Try these examples:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Action movies with strong female leads",
                  "Mind-bending psychological thrillers",
                  "Feel-good family movies from the 2000s",
                  "Award-winning foreign films",
                  "Movies similar to Inception",
                  "Comedies that will make me laugh out loud"
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleInputChange(example)}
                    className="p-2 text-left text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition text-gray-300 hover:text-white"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-zinc-700">
              <p className="text-gray-400 text-xs text-center">
                💡 AI analyzes your query and suggests relevant search terms based on genres, moods, actors, and more
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

