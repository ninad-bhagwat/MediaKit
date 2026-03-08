"use client"
import React, {useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import VideoCard from '@/components/VideoCard'
import { Video } from '@/types'
function Home() {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchVideos = useCallback(async () => {
        try {
            const response = await axios.get("/api/videos")
            if(Array.isArray(response.data)) {
                setVideos(response.data)
            } else {
                throw new Error(" Unexpected response format");

            }
        } catch (error) {
            console.log(error);
            setError("Failed to fetch videos")

        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchVideos()
    }, [fetchVideos])

    const handleDownload = useCallback(async (url: string, title: string) => {
        try {
            const response = await fetch(url, { mode: "cors" });
            if (!response.ok) throw new Error("Download failed");
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${title}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch {
            // Fallback: open in new tab if fetch fails (e.g. CORS)
            const link = document.createElement("a");
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.click();
        }
    }, [])

    if(loading){
        return (
            <div className="space-y-6">
              <div className="h-9 w-48 bg-base-300 rounded-lg animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card bg-base-200 shadow-xl">
                    <div className="aspect-video bg-base-300 animate-pulse" />
                    <div className="card-body p-4 space-y-3">
                      <div className="h-5 bg-base-300 rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-base-300 rounded w-full animate-pulse" />
                      <div className="h-4 bg-base-300 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Your Videos</h1>
            <p className="text-base-content/70">Browse, play, and download your compressed videos</p>
          </div>
          {videos.length === 0 ? (
            <div className="card bg-base-200 border border-base-300">
              <div className="card-body items-center text-center py-16">
                <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="card-title text-xl">No videos yet</h2>
                <p className="text-base-content/70 max-w-sm">Upload your first video to get started. Compress and optimize your videos for faster sharing.</p>
                <a href="/video-upload" className="btn btn-primary mt-4">Upload Video</a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {
                videos.map((video) => (
                    <VideoCard
                        key={video.id}
                        video={video}
                        onDownload={handleDownload}
                    />
                ))
              }
            </div>
          )}
        </div>
    );
}

export default Home
