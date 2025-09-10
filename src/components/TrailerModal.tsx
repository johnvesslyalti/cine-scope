'use client';

import { useEffect, useState } from 'react';
import { FaPlay, FaTimes, FaYoutube } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string;
  movieTitle: string;
}

export default function TrailerModal({ isOpen, onClose, movieId, movieTitle }: TrailerModalProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (isOpen && movieId) {
      fetchVideos();
    }
  }, [isOpen, movieId]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/movies/${movieId}/videos`);
      const data = await response.json();
      
      // Filter for trailers and teasers from YouTube
      const trailers = data.results?.filter((video: Video) => 
        video.site === 'YouTube' && 
        (video.type === 'Trailer' || video.type === 'Teaser')
      ) || [];
      
      setVideos(trailers);
      if (trailers.length > 0) {
        setSelectedVideo(trailers[0]);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-zinc-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-700">
            <div className="flex items-center gap-3">
              <FaYoutube className="text-red-500 text-2xl" />
              <h2 className="text-xl font-bold text-white">{movieTitle} - Trailers</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-white text-lg">Loading trailers...</div>
              </div>
            ) : videos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FaPlay className="text-gray-400 text-4xl mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No trailers available</h3>
                <p className="text-gray-400">This movie doesn&apos;t have any trailers yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Main Video Player */}
                {selectedVideo && (
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1`}
                      title={selectedVideo.name}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                )}

                {/* Video List */}
                {videos.length > 1 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">More Trailers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {videos.map((video) => (
                        <button
                          key={video.id}
                          onClick={() => handleVideoSelect(video)}
                          className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                            selectedVideo?.id === video.id
                              ? 'border-cyan-400 bg-cyan-400/10'
                              : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50 hover:bg-zinc-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <Image height={72} width={120}
                                src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                                alt={video.name}
                                className="w-20 h-12 object-cover rounded"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-white truncate">
                                {video.name}
                              </h4>
                              <p className="text-xs text-gray-400 capitalize">
                                {video.type}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
