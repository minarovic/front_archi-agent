import { useState, useCallback } from 'react';
import { ViewType, CanvasTrigger, ConfirmChipData } from '../types';

// ============================================
// Hook Options Interface
// ============================================

interface UseCanvasTriggerOptions {
  onViewChange?: (viewType: ViewType, entityName?: string) => void;
  onNewAnalysis?: (query: string) => Promise<void>;
  onMessage?: (message: string) => void;
  onConfirmRequired?: (data: Omit<ConfirmChipData, 'onConfirm' | 'onDismiss'>) => void;
}

// ============================================
// useCanvasTrigger Hook (FE-002)
// ============================================

export function useCanvasTrigger(options: UseCanvasTriggerOptions = {}) {
  const [currentView, setCurrentView] = useState<ViewType>('er_diagram');
  const [currentEntity, setCurrentEntity] = useState<string | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const [isViewPinned, setIsViewPinned] = useState(false);

  // Confidence threshold for auto-switching
  const CONFIDENCE_THRESHOLD = 0.6;

  const handleCanvasTrigger = useCallback(
    async (trigger: CanvasTrigger | undefined) => {
      // Graceful fallback - if trigger is missing or action is 'none', do nothing
      if (!trigger || trigger.action === 'none') {
        return;
      }

      // Manual override check - if user pinned the view, don't auto-switch
      if (isViewPinned && trigger.view_type) {
        console.log('[Canvas Trigger] View pinned, showing confirm chip');
        options.onConfirmRequired?.({
          message: trigger.reason,
          viewType: trigger.view_type,
        });
        return;
      }

      // Confidence check - only auto-switch if confidence >= threshold
      const confidence = trigger.confidence ?? 1.0;
      if (confidence < CONFIDENCE_THRESHOLD && trigger.view_type) {
        console.log('[Canvas Trigger] Low confidence:', confidence);
        options.onConfirmRequired?.({
          message: `${trigger.reason} (confidence: ${Math.round(confidence * 100)}%)`,
          viewType: trigger.view_type,
        });
        return;
      }

      setIsTriggering(true);

      try {
        // Show reason as message (if callback exists)
        if (trigger.reason && options.onMessage) {
          options.onMessage(trigger.reason);
        }

        switch (trigger.action) {
          case 'switch_view':
            if (trigger.view_type) {
              setCurrentView(trigger.view_type);
              setCurrentEntity(trigger.entity_name || null);
              options.onViewChange?.(trigger.view_type, trigger.entity_name);
              console.log('[Canvas Trigger] Switched to:', trigger.view_type);
            }
            break;

          case 'new_analysis':
            if (trigger.query && options.onNewAnalysis) {
              await options.onNewAnalysis(trigger.query);
              if (trigger.view_type) {
                setCurrentView(trigger.view_type);
              }
              console.log('[Canvas Trigger] New analysis:', trigger.query);
            }
            break;
        }
      } catch (error) {
        console.error('[Canvas Trigger] Error:', error);
      } finally {
        setIsTriggering(false);
      }
    },
    [isViewPinned, options]
  );

  // Manual view controls
  const manualSetView = useCallback((view: ViewType) => {
    setCurrentView(view);
    setIsViewPinned(true);
  }, []);

  const pinView = useCallback(() => {
    setIsViewPinned(true);
  }, []);

  const unpinView = useCallback(() => {
    setIsViewPinned(false);
  }, []);

  return {
    currentView,
    currentEntity,
    isTriggering,
    isViewPinned,
    handleCanvasTrigger,
    setCurrentView,
    manualSetView,
    pinView,
    unpinView,
  };
}

export default useCanvasTrigger;
