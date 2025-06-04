
export interface Notification {
  id: string;
  type: 'deadline' | 'missing_document' | 'setup_incomplete' | 'info';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  dueDate?: string;
  daysRemaining?: number;
  action?: {
    label: string;
    path: string;
  };
  isRead: boolean;
  createdAt: string;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
}
