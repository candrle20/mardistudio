'use client';

import { useTabStore } from '@/stores/tab-store';
import { X, Plus, FileText } from 'lucide-react';
import { useState } from 'react';
import { TemplateModal } from './TemplateModal';

export function CanvasTabs() {
  const { tabs, activeTabId, setActiveTab, removeTab } = useTabStore();
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    removeTab(tabId);
  };

  return (
    <>
      <div className="flex items-center bg-gray-100 border-b overflow-x-auto">
        {/* Tabs */}
        <div className="flex items-center flex-1 min-w-0">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`
                flex items-center gap-2 px-4 py-2 border-r border-gray-300 min-w-[120px] max-w-[200px] relative
                ${activeTabId === tab.id
                  ? 'bg-white text-primary font-medium'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <button
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 flex-1 min-w-0 text-left"
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span className="truncate text-sm">{tab.name}</span>
                {tab.isDirty && <span className="text-xs text-gray-400">•</span>}
              </button>
              <button
                onClick={(e) => handleCloseTab(e, tab.id)}
                className="ml-auto hover:bg-gray-200 rounded p-0.5 flex-shrink-0"
                title="Close tab"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* New Template Button */}
        <button
          onClick={() => setShowTemplateModal(true)}
          className="px-4 py-2 hover:bg-gray-200 text-gray-600 border-l border-gray-300 flex items-center gap-2"
          title="New Template"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New</span>
        </button>
      </div>

      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
      />
    </>
  );
}

