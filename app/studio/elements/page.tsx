'use client';

import { useState, useCallback } from 'react';
import { useInspirationStore, type InspirationImage } from '@/stores/inspiration-store';
import { Heart, Search, Upload, Tag } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

// Helper for file upload
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const ELEMENT_CATEGORIES = [
  { id: 'flower', label: 'Flowers' },
  { id: 'greenery', label: 'Greenery' },
  { id: 'texture', label: 'Textures' },
  { id: 'location', label: 'Locations' },
  { id: 'building', label: 'Architecture' },
  { id: 'animal', label: 'Animals' },
  { id: 'map', label: 'Maps' },
];

export default function ElementsPage() {
  const {
    getFilteredInspirations,
    searchQuery,
    setSearchQuery,
    toggleLike,
    likedInspirationIds,
    addInspiration,
  } = useInspirationStore();

  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      const newInspirations: Omit<InspirationImage, 'id' | 'likes'>[] = [];
      
      for (const file of acceptedFiles) {
        // Upload to API
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Upload failed');
        const { url } = await res.json();

        newInspirations.push({
          url, // Use the returned API URL
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: 'Uploaded',
          tags: ['uploaded', 'element'],
          source: 'upload' as const,
          type: 'element',
        });
      }
      
      // Use addInspiration in a loop or batch update if store supports it
      // For now, iterating is fine as the store handles state updates
      newInspirations.forEach(insp => addInspiration(insp));
      
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  }, [addInspiration]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'image/*': []} 
  });

  const inspirations = getFilteredInspirations('element').filter((item) => {
    if (!selectedCategory) return true;
    return item.tags.includes(selectedCategory);
  });

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Design Elements</h1>
        </div>
        
        {/* Upload Button */}
        <div {...getRootProps()} className="cursor-pointer self-start">
           <input {...getInputProps()} />
           <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm">
              <Upload className="w-4 h-4" />
              {isDragActive ? "Drop files..." : "Upload Element"}
           </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mt-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white"
          />
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === null
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                  All Elements
              </button>
              {ELEMENT_CATEGORIES.map((cat) => (
                  <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                          selectedCategory === cat.id
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                      {cat.label}
                  </button>
              ))}
          </div>
        </div>
      </div>

      {/* Elements Grid */}
      <div className="mt-6">
        {inspirations.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
                <p>No elements found matching your criteria.</p>
                <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                    className="mt-4 text-primary hover:underline"
                >
                    Clear filters
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {inspirations.map((inspiration) => {
                const isLiked = likedInspirationIds.includes(inspiration.id);
                return (
                <div key={inspiration.id} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition border">
                    <img
                        src={inspiration.url}
                        alt={inspiration.title}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <p className="text-white font-medium text-sm truncate">{inspiration.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {inspiration.tags.filter((t) => t !== 'element' && t !== 'uploaded').slice(0, 2).map((tag) => (
                                <span key={tag} className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Like Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(inspiration.id);
                        }}
                        className={`absolute top-2 right-2 p-1.5 rounded-full transition shadow-sm ${
                            isLiked 
                            ? 'bg-white text-red-500' 
                            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                        }`}
                    >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                </div>
                );
            })}
            </div>
        )}
      </div>
    </div>
  );
}
