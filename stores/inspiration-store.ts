import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface InspirationImage {
  id: string;
  url: string;
  title: string;
  artist: string;
  tags: string[];
  source: 'upload' | 'pinterest' | 'system';
  likes: number;
  type: 'design' | 'element'; // Distinguish between full designs and individual elements
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

interface InspirationStoreState {
  inspirations: InspirationImage[];
  featuredArtists: Artist[];
  likedInspirationIds: string[];
  searchQuery: string;
  selectedArtistId: string | null;
  activeFilters: Record<string, string | null>;
}

interface InspirationStoreActions {
  toggleLike: (id: string) => void;
  addInspiration: (inspiration: Omit<InspirationImage, 'id' | 'likes'>) => void;
  setSearchQuery: (query: string) => void;
  setSelectedArtistId: (id: string | null) => void;
  setFilter: (groupId: string, optionId: string | null) => void;
  getLikedInspirations: (type?: 'design' | 'element') => InspirationImage[];
  getFilteredInspirations: (type?: 'design' | 'element') => InspirationImage[];
}

type InspirationStore = InspirationStoreState & InspirationStoreActions;

const MOCK_ARTISTS: Artist[] = [
  { id: 'a1', name: 'Maria Rodriguez', bio: 'Watercolor floral specialist' },
  { id: 'a2', name: 'Sarah Chen', bio: 'Modern minimalist designer' },
  { id: 'a3', name: 'Emma Thompson', bio: 'Botanical illustrator' },
  { id: 'a4', name: 'Liam O\'Connor', bio: 'Vintage & Art Deco enthusiast' },
];

export const STATIONERY_TYPES = [
  { id: 'wedding_invite', label: 'Wedding Invite' },
  { id: 'save_the_date', label: 'Save the Date' },
  { id: 'menu', label: 'Menu' },
  { id: 'place_card', label: 'Place Card' },
  { id: 'thank_you', label: 'Thank You' },
  { id: 'signage', label: 'Signage' },
];

export const ELEMENT_CATEGORIES = [
  { id: 'flower', label: 'Flowers' },
  { id: 'plant', label: 'Plants' },
  { id: 'map', label: 'Maps' },
  { id: 'tree', label: 'Trees' },
  { id: 'animal', label: 'Animals' },
  { id: 'texture', label: 'Textures' },
  { id: 'location', label: 'Locations' },
];

export const FILTER_GROUPS = [
  {
    id: 'types',
    label: 'Stationery Type',
    options: STATIONERY_TYPES
  },
  {
    id: 'styles',
    label: 'Style',
    options: [
      { id: 'watercolor', label: 'Watercolor' },
      { id: 'modern', label: 'Modern' },
      { id: 'vintage', label: 'Vintage' },
      { id: 'minimalist', label: 'Minimalist' },
      { id: 'luxury', label: 'Luxury' },
      { id: 'art deco', label: 'Art Deco' },
      { id: 'botanical', label: 'Botanical' },
    ]
  }
];

const MOCK_INSPIRATIONS: InspirationImage[] = [];

export const useInspirationStore = create<InspirationStore>()(
  persist(
    (set, get) => ({
      inspirations: MOCK_INSPIRATIONS,
      featuredArtists: MOCK_ARTISTS,
      likedInspirationIds: [],
      searchQuery: '',
      selectedArtistId: null,
      activeFilters: {},

      toggleLike: (id) =>
        set((state) => {
          const isLiked = state.likedInspirationIds.includes(id);
          return {
            likedInspirationIds: isLiked
              ? state.likedInspirationIds.filter((lid) => lid !== id)
              : [...state.likedInspirationIds, id],
          };
        }),

      addInspiration: (inspiration) =>
        set((state) => {
          // Check for duplicate images based on URL to prevent black screen loops
          const isDuplicate = state.inspirations.some(
            (item) => item.url === inspiration.url
          );
          
          if (isDuplicate) {
            console.warn('Skipping duplicate image upload:', inspiration.title);
            return state;
          }

          return {
            inspirations: [
              { ...inspiration, id: uuidv4(), likes: 0 },
              ...state.inspirations,
            ],
          };
        }),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedArtistId: (id) => set({ selectedArtistId: id }),
      
      setFilter: (groupId, optionId) => 
        set((state) => ({
            activeFilters: {
                ...state.activeFilters,
                [groupId]: optionId
            }
        })),

      getLikedInspirations: (type) => {
        const state = get();
        let items = state.inspirations.filter((img) =>
          state.likedInspirationIds.includes(img.id)
        );
        
        if (type) {
            items = items.filter(img => img.type === type);
        }
        return items;
      },

      getFilteredInspirations: (type) => {
        const state = get();
        let filtered = state.inspirations;

        // 1. Filter by main type (design vs element)
        if (type) {
            filtered = filtered.filter(img => img.type === type);
        }

        // 2. Filter by Artist (Legacy) - activeFilters takes precedence if set
        if (state.selectedArtistId && !state.activeFilters['artists']) {
          const artist = state.featuredArtists.find(a => a.id === state.selectedArtistId);
          if (artist) {
              filtered = filtered.filter(img => img.artist === artist.name);
          }
        }

        // 3. Apply Sliding Filters
        if (state.activeFilters['artists']) {
            const artistId = state.activeFilters['artists'];
            const artist = state.featuredArtists.find(a => a.id === artistId);
            if (artist) {
                filtered = filtered.filter(img => img.artist === artist.name);
            }
        }
        
        if (state.activeFilters['styles']) {
            const style = state.activeFilters['styles'];
            filtered = filtered.filter(img => img.tags.includes(style));
        }

        if (state.activeFilters['types']) {
            const stationeryType = state.activeFilters['types'];
            // Assume tags contain type info like 'invite', 'menu', etc.
            // In real app, this might need a dedicated property or smarter tagging
            filtered = filtered.filter(img => img.tags.includes(stationeryType));
        }

        // 4. Apply Search Query
        if (state.searchQuery.trim()) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (img) =>
              img.title.toLowerCase().includes(query) ||
              img.tags.some((tag) => tag.toLowerCase().includes(query)) ||
              img.artist.toLowerCase().includes(query)
          );
        }

        return filtered;
      },
    }),
    {
      name: 'inspiration-storage',
      partialize: (state) => ({
        likedInspirationIds: state.likedInspirationIds,
        inspirations: state.inspirations, // Persist uploaded/imported inspirations
      }),
    }
  )
);
