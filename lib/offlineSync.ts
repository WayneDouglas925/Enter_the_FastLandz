/**
 * Offline mode and sync queue system for Fastlandz
 * Queues operations when offline and syncs when back online
 */

import { supabase } from './supabase';

export interface QueuedOperation {
  id: string;
  type: 'progress_update' | 'journal_create' | 'journal_update' | 'fast_session_update';
  data: any;
  timestamp: number;
  retries: number;
}

const QUEUE_KEY = 'fastlandz_sync_queue';
const MAX_RETRIES = 3;

/**
 * Check if the user is online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Add an operation to the sync queue
 */
export const queueOperation = (
  type: QueuedOperation['type'],
  data: any
): void => {
  const queue = getSyncQueue();

  const operation: QueuedOperation = {
    id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    data,
    timestamp: Date.now(),
    retries: 0,
  };

  queue.push(operation);
  saveSyncQueue(queue);
};

/**
 * Get the current sync queue
 */
export const getSyncQueue = (): QueuedOperation[] => {
  try {
    const stored = localStorage.getItem(QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Save the sync queue
 */
const saveSyncQueue = (queue: QueuedOperation[]): void => {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

/**
 * Process a single queued operation
 */
const processOperation = async (operation: QueuedOperation): Promise<boolean> => {
  if (!supabase) return false;

  try {
    switch (operation.type) {
      case 'progress_update': {
        const { error } = await supabase
          .from('user_progress')
          .update(operation.data.updates)
          .eq('user_id', operation.data.userId);

        if (error) throw error;
        return true;
      }

      case 'journal_create': {
        const { error } = await supabase
          .from('journal_entries')
          .insert(operation.data);

        if (error) throw error;
        return true;
      }

      case 'journal_update': {
        const { error } = await supabase
          .from('journal_entries')
          .update(operation.data.updates)
          .eq('user_id', operation.data.userId)
          .eq('day', operation.data.day);

        if (error) throw error;
        return true;
      }

      case 'fast_session_update': {
        const { error } = await supabase
          .from('fast_sessions')
          .update(operation.data.updates)
          .eq('id', operation.data.sessionId);

        if (error) throw error;
        return true;
      }

      default:
        console.warn('Unknown operation type:', operation.type);
        return false;
    }
  } catch (error) {
    console.error('Failed to process operation:', error);
    return false;
  }
};

/**
 * Process all queued operations
 */
export const processSyncQueue = async (): Promise<{
  processed: number;
  failed: number;
}> => {
  if (!isOnline() || !supabase) {
    return { processed: 0, failed: 0 };
  }

  const queue = getSyncQueue();
  if (queue.length === 0) {
    return { processed: 0, failed: 0 };
  }

  let processed = 0;
  let failed = 0;
  const remainingQueue: QueuedOperation[] = [];

  for (const operation of queue) {
    const success = await processOperation(operation);

    if (success) {
      processed++;
    } else {
      operation.retries++;

      if (operation.retries < MAX_RETRIES) {
        remainingQueue.push(operation);
      } else {
        failed++;
        console.error('Operation exceeded max retries:', operation);
      }
    }
  }

  saveSyncQueue(remainingQueue);

  return { processed, failed };
};

/**
 * Clear the sync queue (use with caution)
 */
export const clearSyncQueue = (): void => {
  localStorage.removeItem(QUEUE_KEY);
};

/**
 * Get sync queue status
 */
export const getSyncQueueStatus = (): {
  pending: number;
  oldestTimestamp: number | null;
} => {
  const queue = getSyncQueue();

  return {
    pending: queue.length,
    oldestTimestamp: queue.length > 0 ? Math.min(...queue.map((op) => op.timestamp)) : null,
  };
};

/**
 * Setup online/offline event listeners
 */
export const setupOfflineSync = (
  onOnline?: () => void,
  onOffline?: () => void
): (() => void) => {
  const handleOnline = async () => {
    console.log('Back online - processing sync queue');

    if (onOnline) onOnline();

    // Process any queued operations
    const result = await processSyncQueue();

    if (result.processed > 0) {
      console.log(`Synced ${result.processed} operations`);
    }

    if (result.failed > 0) {
      console.warn(`${result.failed} operations failed after max retries`);
    }
  };

  const handleOffline = () => {
    console.log('Gone offline - operations will be queued');
    if (onOffline) onOffline();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

/**
 * Periodic sync - call this regularly when online
 */
export const periodicSync = async (): Promise<void> => {
  if (!isOnline()) return;

  const status = getSyncQueueStatus();

  if (status.pending > 0) {
    await processSyncQueue();
  }
};

/**
 * Setup periodic sync (every 30 seconds)
 */
export const setupPeriodicSync = (): (() => void) => {
  const intervalId = setInterval(periodicSync, 30000);

  return () => clearInterval(intervalId);
};
