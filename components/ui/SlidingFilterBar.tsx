'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface SlidingFilterBarProps {
  groups: FilterGroup[];
  selectedFilters: Record<string, string | null>; // groupId -> optionId
  onSelect: (groupId: string, optionId: string | null) => void;
}

export function SlidingFilterBar({ groups, selectedFilters, onSelect }: SlidingFilterBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const amount = 300;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative group w-full">
      {/* Gradient Masks */}
      <div className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none transition-opacity ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none transition-opacity ${showRightArrow ? 'opacity-100' : 'opacity-0'}`} />

      {/* Navigation Arrows */}
      {showLeftArrow && (
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-1 bg-white rounded-full shadow-md border hover:bg-gray-50 transition opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
      )}
      
      {showRightArrow && (
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-1 bg-white rounded-full shadow-md border hover:bg-gray-50 transition opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex items-center gap-6 overflow-x-auto scrollbar-hide px-4 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {groups.map((group) => (
          <div key={group.id} className="flex items-center gap-2 shrink-0 border-r pr-6 last:border-r-0 last:pr-0">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{group.label}</span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onSelect(group.id, null)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
                        !selectedFilters[group.id]
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    All
                </button>
                {group.options.map(option => {
                    const isSelected = selectedFilters[group.id] === option.id;
                    return (
                        <button
                            key={option.id}
                            onClick={() => onSelect(group.id, isSelected ? null : option.id)}
                            className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-all duration-200 ${
                                isSelected
                                ? 'bg-gray-900 text-white shadow-sm'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

