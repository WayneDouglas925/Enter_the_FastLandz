/**
 * Browser notification system for Fastlandz
 * Handles push notifications for fast completion, reminders, and milestones
 */

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
}

/**
 * Request permission for browser notifications
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Send a browser notification
 */
export const sendNotification = (options: NotificationOptions): void => {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  const notification = new Notification(options.title, {
    body: options.body,
    icon: options.icon || '/icon-192x192.png',
    badge: options.badge || '/badge-72x72.png',
    tag: options.tag || 'fastlandz',
    requireInteraction: options.requireInteraction || false,
  });

  // Auto-close after 10 seconds if not requiring interaction
  if (!options.requireInteraction) {
    setTimeout(() => notification.close(), 10000);
  }

  // Optional: Handle notification click
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
};

/**
 * Fast completion notification
 */
export const notifyFastComplete = (duration: number): void => {
  sendNotification({
    title: 'MISSION ACCOMPLISHED',
    body: `You've completed a ${duration}-hour fast. FEED, SURVIVOR.`,
    icon: '/icon-192x192.png',
    tag: 'fast-complete',
    requireInteraction: true,
  });

  // Play a sound if supported
  playNotificationSound();
};

/**
 * Fast milestone notification (halfway, 75%, etc.)
 */
export const notifyFastMilestone = (milestone: string, remaining: string): void => {
  sendNotification({
    title: `${milestone} Complete`,
    body: `Keep going! ${remaining} remaining until feast mode.`,
    icon: '/icon-192x192.png',
    tag: 'fast-milestone',
  });
};

/**
 * Streak notification
 */
export const notifyStreak = (days: number): void => {
  sendNotification({
    title: 'STREAK ACHIEVED',
    body: `${days} days in a row! You're unstoppable, survivor.`,
    icon: '/icon-192x192.png',
    tag: 'streak',
  });
};

/**
 * Daily reminder notification
 */
export const notifyDailyReminder = (challengeDay: number): void => {
  sendNotification({
    title: 'Ready for Today\'s Challenge?',
    body: `Day ${challengeDay} awaits. The wasteland doesn't wait for anyone.`,
    icon: '/icon-192x192.png',
    tag: 'daily-reminder',
  });
};

/**
 * Play a notification sound
 */
const playNotificationSound = (): void => {
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch((err) => console.warn('Could not play notification sound:', err));
  } catch (err) {
    console.warn('Notification sound not available');
  }
};

/**
 * Schedule a notification for a specific time
 * Note: This uses setTimeout, so it only works while the tab is open
 * For persistent notifications, you'd need a service worker
 */
export const scheduleNotification = (
  options: NotificationOptions,
  delayMs: number
): number => {
  const timeoutId = window.setTimeout(() => {
    sendNotification(options);
  }, delayMs);

  return timeoutId;
};

/**
 * Cancel a scheduled notification
 */
export const cancelScheduledNotification = (timeoutId: number): void => {
  clearTimeout(timeoutId);
};

/**
 * Check if notifications are supported and enabled
 */
export const areNotificationsEnabled = (): boolean => {
  return 'Notification' in window && Notification.permission === 'granted';
};

/**
 * Get notification permission status
 */
export const getNotificationPermission = (): NotificationPermission | 'unsupported' => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

/**
 * Schedule fast completion notification
 * Returns the timeout ID so it can be cancelled if needed
 */
export const scheduleFastCompleteNotification = (
  targetEndTime: number,
  durationHours: number
): number => {
  const delayMs = targetEndTime - Date.now();

  if (delayMs <= 0) {
    // Already past end time
    notifyFastComplete(durationHours);
    return -1;
  }

  return scheduleNotification(
    {
      title: 'MISSION ACCOMPLISHED',
      body: `Your ${durationHours}-hour fast is complete! Time to break the fast.`,
      tag: 'fast-complete',
      requireInteraction: true,
    },
    delayMs
  );
};

/**
 * Schedule milestone notifications (50%, 75%, 90%)
 */
export const scheduleMilestoneNotifications = (
  startTime: number,
  targetEndTime: number,
  totalPausedTime: number
): number[] => {
  const timeoutIds: number[] = [];
  const totalDuration = targetEndTime - startTime;

  const milestones = [
    { percent: 50, label: '50%' },
    { percent: 75, label: '75%' },
    { percent: 90, label: '90%' },
  ];

  milestones.forEach((milestone) => {
    const milestoneTime = startTime + (totalDuration * milestone.percent) / 100;
    const delayMs = milestoneTime - Date.now() + totalPausedTime;

    if (delayMs > 0) {
      const remaining = Math.round((targetEndTime - milestoneTime) / (1000 * 60 * 60));
      const timeoutId = scheduleNotification(
        {
          title: `${milestone.label} Complete`,
          body: `Halfway there! About ${remaining}h remaining.`,
          tag: `milestone-${milestone.percent}`,
        },
        delayMs
      );
      timeoutIds.push(timeoutId);
    }
  });

  return timeoutIds;
};
