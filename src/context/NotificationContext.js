import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTax } from './TaxContext';
const NotificationContext = createContext(undefined);
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
export const NotificationProvider = ({ children }) => {
    const { t } = useTranslation();
    const { profile } = useTax();
    const [notifications, setNotifications] = useState([]);
    // Generate smart notifications based on business logic
    const generateSmartNotifications = () => {
        const smartNotifications = [];
        const today = new Date();
        // VAT deadline notification (monthly - 28th of following month)
        const vatDeadline = new Date(today.getFullYear(), today.getMonth() + 1, 28);
        const vatDaysRemaining = Math.ceil((vatDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (vatDaysRemaining <= 7 && vatDaysRemaining > 0) {
            smartNotifications.push({
                id: 'vat-deadline',
                type: 'deadline',
                priority: vatDaysRemaining <= 3 ? 'urgent' : 'high',
                title: t('notifications.vatDeadline'),
                message: t('notifications.vatDeadlineDesc', { days: vatDaysRemaining }),
                dueDate: vatDeadline.toISOString(),
                daysRemaining: vatDaysRemaining,
                action: {
                    label: t('notifications.fileNow'),
                    path: '/vat'
                },
                isRead: false,
                createdAt: today.toISOString()
            });
        }
        // CIT deadline notification (9 months after financial year end)
        if (profile?.citSubmissionDate) {
            const citDeadline = new Date(profile.citSubmissionDate);
            const citDaysRemaining = Math.ceil((citDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            if (citDaysRemaining <= 30 && citDaysRemaining > 0) {
                smartNotifications.push({
                    id: 'cit-deadline',
                    type: 'deadline',
                    priority: citDaysRemaining <= 7 ? 'urgent' : 'high',
                    title: t('notifications.citDeadline'),
                    message: t('notifications.citDeadlineDesc', { days: citDaysRemaining }),
                    dueDate: citDeadline.toISOString(),
                    daysRemaining: citDaysRemaining,
                    action: {
                        label: t('notifications.fileNow'),
                        path: '/cit'
                    },
                    isRead: false,
                    createdAt: today.toISOString()
                });
            }
        }
        // Setup incomplete notification
        if (!profile?.companyName || !profile?.trnNumber) {
            smartNotifications.push({
                id: 'setup-incomplete',
                type: 'setup_incomplete',
                priority: 'medium',
                title: t('notifications.setupIncomplete'),
                message: t('notifications.setupIncompleteDesc'),
                action: {
                    label: t('notifications.completeSetup'),
                    path: '/setup'
                },
                isRead: false,
                createdAt: today.toISOString()
            });
        }
        // Missing documents notification (simulated)
        const hasAgentCertificate = localStorage.getItem('agent_certificate_uploaded');
        const hasBankSlip = localStorage.getItem('bank_slip_uploaded');
        if (!hasAgentCertificate) {
            smartNotifications.push({
                id: 'missing-agent-cert',
                type: 'missing_document',
                priority: 'medium',
                title: t('notifications.missingAgentCert'),
                message: t('notifications.missingAgentCertDesc'),
                action: {
                    label: t('notifications.uploadDocument'),
                    path: '/setup'
                },
                isRead: false,
                createdAt: today.toISOString()
            });
        }
        if (!hasBankSlip) {
            smartNotifications.push({
                id: 'missing-bank-slip',
                type: 'missing_document',
                priority: 'medium',
                title: t('notifications.missingBankSlip'),
                message: t('notifications.missingBankSlipDesc'),
                action: {
                    label: t('notifications.uploadDocument'),
                    path: '/setup'
                },
                isRead: false,
                createdAt: today.toISOString()
            });
        }
        return smartNotifications;
    };
    // Update notifications periodically
    useEffect(() => {
        const updateNotifications = () => {
            const smartNotifications = generateSmartNotifications();
            const existingIds = notifications.map(n => n.id);
            const newNotifications = smartNotifications.filter(n => !existingIds.includes(n.id));
            if (newNotifications.length > 0) {
                setNotifications(prev => [...prev, ...newNotifications]);
            }
        };
        updateNotifications();
        const interval = setInterval(updateNotifications, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [profile, t]);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const markAsRead = (id) => {
        setNotifications(prev => prev.map(notification => notification.id === id ? { ...notification, isRead: true } : notification));
    };
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
    };
    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };
    const addNotification = (notification) => {
        const newNotification = {
            ...notification,
            id: `${Date.now()}-${Math.random()}`,
            isRead: false,
            createdAt: new Date().toISOString()
        };
        setNotifications(prev => [newNotification, ...prev]);
    };
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };
    const clearAllNotifications = () => {
        setNotifications([]);
    };
    const value = {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        addNotification,
        removeNotification,
        clearAllNotifications
    };
    return (_jsx(NotificationContext.Provider, { value: value, children: children }));
};
