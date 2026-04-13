import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Video, Sparkles, Loader2, Download, ExternalLink, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

interface PromoPageProps {
  dark: boolean;
  gymName: string;
}

export const PromoPage: React.FC<PromoPageProps> = ({ dark, gymName }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    try {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } catch (e) {
      console.error("Key check failed", e);
    }
  };

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    setHasKey(true);
  };

  const generateReel = async () => {
    setLoading(true);
    setError(null);
    setStatus("Initializing AI model...");
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setStatus("Crafting your cinematic gym reel...");
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: `A high-quality, dynamic 3D animation showing a sleek gym management software interface called 'GymFlow' for ${gymName}. The video should feature a modern dashboard with glowing charts, a member management list, and a 'Follow Up' tab. The aesthetic should be energetic, with neon orange accents and a dark, professional gym atmosphere in the background. Cinematic lighting, 4k resolution, smooth transitions, perfect for an Instagram Reel.`,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '9:16'
        }
      });

      setStatus("AI is rendering your video (this may take a few minutes)...");

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        try {
          operation = await ai.operations.getVideosOperation({ operation: operation });
        } catch (e: any) {
          if (e.message?.includes("Requested entity was not found")) {
            setHasKey(false);
            throw new Error("API Key session expired. Please select your key again.");
          }
          throw e;
        }
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setStatus("Fetching final render...");
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': process.env.API_KEY || "",
          },
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setStatus("Reel generated successfully!");
      } else {
        throw new Error("Failed to retrieve video link.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during generation.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className={`p-8 rounded-3xl border max-w-md w-full ${dark ? "bg-[#13131e] border-white/5" : "bg-white border-black/5 shadow-xl"}`}>
          <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mx-auto mb-6">
            <Video size={32} />
          </div>
          <h2 className="text-xl font-black mb-4">Generate Instagram Reel</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            To generate high-quality AI videos, you need to select a paid Gemini API key. 
            <br />
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline inline-flex items-center gap-1 mt-2">
              Learn about billing <ExternalLink size={12} />
            </a>
          </p>
          <button 
            onClick={handleSelectKey}
            className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95"
          >
            Select API Key to Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`p-8 rounded-3xl border ${dark ? "bg-[#13131e] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black">AI Promo Reel Generator</h2>
            <p className="text-xs text-gray-500">Create a professional Instagram Reel for {gymName}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-500">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div className="text-xs font-bold leading-relaxed">{error}</div>
          </div>
        )}

        {!videoUrl && !loading && (
          <div className="space-y-6">
            <div className="aspect-[9/16] max-w-[280px] mx-auto bg-black/20 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center">
              <Video className="text-gray-600 mb-4" size={48} />
              <p className="text-xs text-gray-500 font-medium">Your 9:16 Instagram Reel will appear here</p>
            </div>
            <button 
              onClick={generateReel}
              className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-3"
            >
              <Sparkles size={20} />
              Generate Cinematic Reel
            </button>
          </div>
        )}

        {loading && (
          <div className="space-y-8 py-12 flex flex-col items-center text-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                <Video size={32} className="animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-black animate-pulse">{status}</p>
              <p className="text-[10px] text-gray-500 max-w-xs mx-auto">
                AI video generation is complex and takes time. Please don't close this tab.
              </p>
            </div>
          </div>
        )}

        {videoUrl && (
          <div className="space-y-6">
            <div className="aspect-[9/16] max-w-[320px] mx-auto rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              <a 
                href={videoUrl} 
                download={`GymFlow_${gymName}_Reel.mp4`}
                className="flex-1 bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download Reel
              </a>
              <button 
                onClick={() => { setVideoUrl(null); setStatus(""); }}
                className="px-6 bg-white/5 text-gray-400 font-bold rounded-2xl hover:bg-white/10 transition-all"
              >
                New
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={`p-6 rounded-3xl border border-dashed ${dark ? "border-white/10" : "border-black/10"}`}>
        <h3 className="text-xs font-bold mb-3 uppercase tracking-widest text-gray-500">Instagram Tips</h3>
        <ul className="space-y-2">
          <li className="text-[10px] text-gray-500 flex items-start gap-2">
            <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 shrink-0" />
            Add trending audio from the Instagram library after uploading.
          </li>
          <li className="text-[10px] text-gray-500 flex items-start gap-2">
            <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 shrink-0" />
            Use hashtags like #GymManagement #FitnessTech #GymFlow.
          </li>
          <li className="text-[10px] text-gray-500 flex items-start gap-2">
            <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 shrink-0" />
            Tag your gym's location to reach local members.
          </li>
        </ul>
      </div>
    </div>
  );
};
