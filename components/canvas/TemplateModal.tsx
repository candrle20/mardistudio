'use client';

import { useState } from 'react';
import { useTabStore } from '@/stores/tab-store';
import { WEDDING_TEMPLATES, TEMPLATE_CATEGORIES, TemplateCategory } from '@/types/wedding-templates';
import { X, Search, Sparkles } from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateModal({ isOpen, onClose }: TemplateModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addTab } = useTabStore();

  if (!isOpen) return null;

  const filteredTemplates = WEDDING_TEMPLATES.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (template: typeof WEDDING_TEMPLATES[0]) => {
    const tabNumber = useTabStore.getState().tabs.length + 1;
    addTab({
      name: `${template.name} ${tabNumber}`,
      type: 'blank', // Can be extended to match template types
      canvasData: '',
      width: template.width,
      height: template.height,
    });
    onClose();
  };

  const handleBlankCanvas = () => {
    const tabNumber = useTabStore.getState().tabs.length + 1;
    addTab({
      name: `Untitled ${tabNumber}`,
      type: 'blank',
      canvasData: '',
      width: 1500,
      height: 2100,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold">Create New Design</h2>
            <p className="text-sm text-gray-600 mt-1">Choose a template or start from scratch</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Blank Canvas */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex gap-4">
            {/* Blank Canvas Card */}
            <button
              onClick={handleBlankCanvas}
              className="flex-shrink-0 w-48 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group"
            >
              <div className="flex flex-col items-center justify-center h-full">
                <Sparkles className="w-8 h-8 text-gray-400 group-hover:text-primary mb-2" />
                <span className="font-medium text-sm">Blank Canvas</span>
                <span className="text-xs text-gray-500">5×7 (1500×2100px)</span>
              </div>
            </button>

            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-64 border-r bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="font-medium">All Templates</span>
                <span className="text-xs ml-2 opacity-75">({WEDDING_TEMPLATES.length})</span>
              </button>

              <div className="h-px bg-gray-200 my-2" />

              {TEMPLATE_CATEGORIES.map((category) => {
                const count = WEDDING_TEMPLATES.filter((t) => t.category === category.id).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id as TemplateCategory)}
                    className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-xs ml-2 opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="group relative p-4 border rounded-lg hover:border-primary hover:shadow-lg transition-all text-left"
                  >
                    {template.popular && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                        Popular
                      </div>
                    )}
                    
                    {/* Template Preview */}
                    <div 
                      className="mb-3 bg-gray-100 rounded flex items-center justify-center overflow-hidden"
                      style={{ 
                        aspectRatio: `${template.width}/${template.height}`,
                        maxHeight: '150px'
                      }}
                    >
                      <div className="text-gray-400 text-xs text-center p-4">
                        {template.width}×{template.height}px<br/>
                        {(template.width / 300).toFixed(1)}×{(template.height / 300).toFixed(1)}"
                      </div>
                    </div>

                    {/* Template Info */}
                    <h3 className="font-medium text-sm mb-1 group-hover:text-primary">
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <p className="text-lg mb-2">No templates found</p>
                  <p className="text-sm">Try a different search or category</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

