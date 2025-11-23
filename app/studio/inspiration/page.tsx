'use client';

import { useState, useCallback, useEffect } from 'react';
import { useInspirationStore, InspirationImage, STATIONERY_TYPES, ELEMENT_CATEGORIES, FILTER_GROUPS } from '@/stores/inspiration-store';
import { Heart, Search, Upload, User, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { SlidingFilterBar } from '@/components/ui/SlidingFilterBar';

// Helper for file upload
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


export default function InspirationPage() {
  const {
    getFilteredInspirations,
    featuredArtists,
    searchQuery,
    setSearchQuery,
    selectedArtistId,
    activeFilters,
    setFilter,
    toggleLike,
    likedInspirationIds,
    addInspiration,
  } = useInspirationStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'design' | 'element'>('design');
  const [selectedStationeryType, setSelectedStationeryType] = useState<string>('wedding_invite');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Separate search/filter for Elements
  const [elementSearchQuery, setElementSearchQuery] = useState('');
  const [selectedElementCategory, setSelectedElementCategory] = useState<string | null>(null);

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

            const tags = ['uploaded', uploadType];
            if (uploadType === 'design') {
                tags.push(selectedStationeryType);
            }

            newInspirations.push({
                url, // Use the returned API URL
                title: file.name.replace(/\.[^/.]+$/, ""),
                artist: 'Uploaded',
                tags,
                source: 'upload' as const,
                type: uploadType,
            });
        }
        // Add all at once or sequentially
        newInspirations.forEach(insp => addInspiration(insp));
        
        // Notify user (optional toast)
        console.log(`Uploaded ${newInspirations.length} items`);
    } catch (error) {
        console.error("Upload failed", error);
    } finally {
        setIsUploading(false);
    }
  }, [addInspiration, uploadType, selectedStationeryType]);

  const { getRootProps, getInputProps, isDragActive, open: openUpload } = useDropzone({ 
    onDrop, 
    accept: {'image/*': []},
    noClick: true // We'll use a custom button for click
  });

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
        newSelected.delete(id);
    } else {
        newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkAction = (action: 'delete' | 'addToProject') => {
    console.log(`${action} on ${selectedIds.size} items`);
    // TODO: Implement bulk delete or add to project
    if (action === 'addToProject') {
        // Logic to add to current canvas would go here
        // For now we just log
    }
    setIsSelectMode(false);
    setSelectedIds(new Set());
  };

  const designInspirations = isClient ? getFilteredInspirations('design') : [];
  
  // Filter Elements Logic
  let elementInspirations = isClient ? getFilteredInspirations('element') : [];
  if (selectedElementCategory) {
    elementInspirations = elementInspirations.filter(img => img.tags.includes(selectedElementCategory));
  }
  if (elementSearchQuery.trim()) {
    const q = elementSearchQuery.toLowerCase();
    elementInspirations = elementInspirations.filter(img => 
        img.title.toLowerCase().includes(q) || 
        img.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Design Library</h1>
          </div>
          
          {/* Upload Section */}
          <div className="flex flex-col items-end gap-2">
             <div className="flex items-center gap-2">
                 {uploadType === 'design' && (
                    <select 
                        value={selectedStationeryType}
                        onChange={(e) => setSelectedStationeryType(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-700 text-xs rounded-lg focus:ring-primary focus:border-primary block px-2 py-1 h-8"
                    >
                        {STATIONERY_TYPES.map(t => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                    </select>
                 )}
                 
                 <div className="flex bg-gray-100 p-1 rounded-lg text-xs">
                    <button 
                        onClick={() => setUploadType('design')}
                        className={`px-3 py-1 rounded-md transition ${uploadType === 'design' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                    >
                        Design
                    </button>
                    <button 
                        onClick={() => setUploadType('element')}
                        className={`px-3 py-1 rounded-md transition ${uploadType === 'element' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                    >
                        Element
                    </button>
                 </div>
             </div>
             
             <div className="flex gap-2">
                 {isSelectMode ? (
                     <>
                        <button 
                            onClick={() => handleBulkAction('addToProject')}
                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition disabled:opacity-50"
                            disabled={selectedIds.size === 0}
                        >
                            Use Selected ({selectedIds.size})
                        </button>
                        <button 
                            onClick={() => { setIsSelectMode(false); setSelectedIds(new Set()); }}
                            className="px-4 py-2 bg-white border text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                     </>
                 ) : (
                     <button 
                        onClick={() => setIsSelectMode(true)}
                        className="px-4 py-2 bg-white border text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition"
                     >
                        Select
                     </button>
                 )}
                 
                 <div {...getRootProps()} className="relative">
                    <input {...getInputProps()} />
                    <button 
                        onClick={openUpload}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
                    >
                        <Upload className="w-4 h-4" />
                        {isDragActive ? "Drop to Upload" : "Bulk Import"}
                    </button>
                 </div>
             </div>
          </div>
        </div>

        {/* Search and Filters for Designs */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search design styles, artists, or themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          {/* Sliding Filters */}
          <SlidingFilterBar 
            groups={FILTER_GROUPS}
            selectedFilters={activeFilters || {}}
            onSelect={setFilter}
          />
        </div>

        {/* Inspiration Designs */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Stationery Inspiration</h2>
            {designInspirations.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                    <p>No designs found matching your criteria.</p>
                    <button 
                        onClick={() => {
                            setSearchQuery('');
                            setFilter('artists', null);
                            setFilter('styles', null);
                            setFilter('types', null);
                        }}
                        className="mt-4 text-primary hover:underline font-medium"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {designInspirations.map((inspiration) => {
                    const isLiked = likedInspirationIds.includes(inspiration.id);
                    const isSelected = selectedIds.has(inspiration.id);
                    
                    return (
                    <div 
                        key={inspiration.id} 
                        className={`group relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-sm transition border-2 ${
                            isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:shadow-md'
                        }`}
                        onClick={() => {
                            if (isSelectMode) {
                                toggleSelection(inspiration.id);
                            }
                        }}
                    >
                        <img
                            src={inspiration.url}
                            alt={inspiration.title}
                            className={`w-full h-full object-cover transition duration-500 ${isSelected ? 'scale-95' : 'group-hover:scale-105'}`}
                            loading="lazy"
                        />
                        
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 flex flex-col justify-end p-4 ${
                            isSelectMode || isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                            <p className="text-white font-medium truncate">{inspiration.title}</p>
                            <p className="text-white/80 text-xs truncate">{inspiration.artist}</p>
                        </div>

                        {/* Selection Checkbox */}
                        {isSelectMode && (
                            <div className="absolute top-2 left-2">
                                <div className={`w-5 h-5 rounded border shadow-sm flex items-center justify-center transition ${
                                    isSelected ? 'bg-primary border-primary text-white' : 'bg-white/80 border-gray-300'
                                }`}>
                                    {isSelected && <Sparkles className="w-3 h-3" />}
                                </div>
                            </div>
                        )}

                        {!isSelectMode && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLike(inspiration.id);
                                }}
                                className={`absolute top-2 right-2 p-2 rounded-full transition shadow-sm ${
                                    isLiked 
                                    ? 'bg-white text-red-500' 
                                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                                }`}
                            >
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                            </button>
                        )}
                    </div>
                    );
                })}
                </div>
            )}
        </div>

        {/* Elements Section */}
        <div className="space-y-4 pt-8 border-t">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Elements</h2>
            </div>
            
            {/* Element-specific Search and Filter */}
            <div className="space-y-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search elements (flowers, maps, etc)..."
                        value={elementSearchQuery}
                        onChange={(e) => setElementSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none bg-gray-50 focus:bg-white text-sm"
                    />
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setSelectedElementCategory(null)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                            selectedElementCategory === null
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        All
                    </button>
                    {ELEMENT_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedElementCategory(selectedElementCategory === cat.id ? null : cat.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                                selectedElementCategory === cat.id
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {elementInspirations.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                    <p>No elements found matching your filters.</p>
                    <button 
                        onClick={() => { setElementSearchQuery(''); setSelectedElementCategory(null); }}
                        className="mt-2 text-primary hover:underline text-sm"
                    >
                        Clear element filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {elementInspirations.map((inspiration) => {
                    const isLiked = likedInspirationIds.includes(inspiration.id);
                    return (
                    <div key={inspiration.id} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition">
                        <img
                            src={inspiration.url}
                            alt={inspiration.title}
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                            <p className="text-white font-medium truncate text-sm">{inspiration.title}</p>
                        </div>

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
                            <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                    );
                })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
