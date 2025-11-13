'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { CanvasEditor } from '@/components/canvas/CanvasEditor';
import { CanvasToolbar } from '@/components/canvas/CanvasToolbar';
import { Toolbar } from '@/components/canvas/Toolbar';
import { CanvasSidebar } from '@/components/canvas/CanvasSidebar';
import { CanvasTabs } from '@/components/canvas/CanvasTabs';
import { TemplateModal } from '@/components/canvas/TemplateModal';
import { KeyboardShortcuts } from '@/components/editor/KeyboardShortcuts';
import { useProjectStore } from '@/stores/project-store';
import { useTabStore } from '@/stores/tab-store';

export default function StudioPage({ params }: { params: { projectId: string } }) {
  const { project, loadProject } = useProjectStore();
  const { tabs, activeTabId, getActiveTab, createNewTemplate, loadTabs, setProjectContext } = useTabStore();
  const projectId = params.projectId;
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  useEffect(() => {
    if (projectId && projectId !== 'new') {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  useLayoutEffect(() => {
    if (!projectId || typeof window === 'undefined') return;
    setProjectContext(projectId);
    loadTabs(projectId);
  }, [projectId, loadTabs, setProjectContext]);

  const activeTab = getActiveTab();

  return (
    <div className="h-screen flex flex-col">
      <CanvasToolbar />
      <CanvasTabs />
      <div className="flex-1 flex overflow-hidden">
        <Toolbar />
        <div className="flex-1 relative">
          {activeTab ? (
            <CanvasEditor
              key={activeTab.id}
              projectId={activeTab.id}
              initialCanvas={activeTab.canvasData}
              onSave={(canvas) => {
                const { updateTab } = useTabStore.getState();
                updateTab(activeTab.id, { canvasData: canvas, isDirty: true });
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
              <button
                onClick={() => setShowTemplateModal(true)}
                className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold text-lg shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                Create New Template
              </button>
            </div>
          )}
        </div>
        <CanvasSidebar />
      </div>
      
      {/* Template Modal for empty state */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
      />
      
      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts />
    </div>
  );
}

