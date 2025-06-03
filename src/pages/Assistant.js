import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Card, CardContent, Alert, Snackbar, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PaperAirplaneIcon, QuestionMarkCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
const Assistant = () => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    // Sample suggestions - replace with actual data from API
    const suggestions = [
        {
            id: '1',
            title: t('assistant.suggestions.vat.title', 'VAT Registration Requirements'),
            description: t('assistant.suggestions.vat.description', 'Learn about VAT registration requirements in the UAE'),
            category: 'vat',
        },
        {
            id: '2',
            title: t('assistant.suggestions.cit.title', 'CIT Compliance Guide'),
            description: t('assistant.suggestions.cit.description', 'Understand Corporate Income Tax compliance requirements'),
            category: 'cit',
        },
        {
            id: '3',
            title: t('assistant.suggestions.transferPricing.title', 'Transfer Pricing Documentation'),
            description: t('assistant.suggestions.transferPricing.description', 'Get guidance on transfer pricing documentation requirements'),
            category: 'transferPricing',
        },
    ];
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const handleSend = async () => {
        if (!input.trim())
            return;
        const userMessage = {
            id: Date.now().toString(),
            content: input,
            type: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        try {
            // Simulate API call - replace with actual API integration
            await new Promise(resolve => setTimeout(resolve, 1000));
            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                content: t('assistant.response', 'I am an AI assistant specialized in UAE tax compliance. I can help you with VAT, CIT, and transfer pricing matters. Please note that my responses are for guidance only and should not be considered as professional tax advice.'),
                type: 'assistant',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
        }
        catch (err) {
            setError(t('assistant.error', 'Error getting response from assistant'));
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion.title);
    };
    return (_jsxs(Box, { children: [_jsxs(Paper, { elevation: 0, className: "p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm", children: [_jsxs(Box, { className: "flex items-center gap-4 mb-6", children: [_jsx(ChatBubbleLeftRightIcon, { className: "h-8 w-8 text-indigo-600 dark:text-indigo-400" }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h4", className: "text-gray-900 dark:text-white mb-2", children: t('assistant.title', 'AI Assistant') }), _jsx(Typography, { variant: "body1", className: "text-gray-600 dark:text-gray-400", children: t('assistant.subtitle', 'Get instant guidance on tax compliance matters') })] })] }), _jsx(Box, { className: "mb-6", children: _jsxs(Paper, { className: "h-[500px] bg-gray-50 dark:bg-gray-700 rounded-lg p-4 overflow-y-auto", children: [messages.map((message) => (_jsx(Box, { className: `flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`, children: _jsxs(Box, { className: `max-w-[70%] rounded-lg p-3 ${message.type === 'user'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'}`, children: [_jsx(Typography, { variant: "body1", children: message.content }), _jsx(Typography, { variant: "caption", className: "text-gray-500 dark:text-gray-400 mt-1 block", children: message.timestamp.toLocaleTimeString() })] }) }, message.id))), isLoading && (_jsx(Box, { className: "flex justify-center mb-4", children: _jsx(CircularProgress, { size: 24 }) })), _jsx("div", { ref: messagesEndRef })] }) }), _jsxs(Box, { className: "flex gap-4 mb-6", children: [_jsx(TextField, { fullWidth: true, variant: "outlined", placeholder: t('assistant.input.placeholder', 'Ask a question about tax compliance...'), value: input, onChange: (e) => setInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSend(), className: "bg-white dark:bg-gray-700" }), _jsx(Button, { variant: "contained", onClick: handleSend, disabled: isLoading || !input.trim(), className: "bg-indigo-600 hover:bg-indigo-700", startIcon: _jsx(PaperAirplaneIcon, { className: "h-5 w-5" }), children: t('assistant.input.send', 'Send') })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-4", children: t('assistant.suggestions.title', 'Common Questions') }), _jsx(Box, { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: suggestions.map((suggestion) => (_jsx(Card, { className: "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", onClick: () => handleSuggestionClick(suggestion), children: _jsx(CardContent, { children: _jsxs(Box, { className: "flex items-start gap-4", children: [_jsx(QuestionMarkCircleIcon, { className: "h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-1" }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-2", children: suggestion.title }), _jsx(Typography, { variant: "body2", className: "text-gray-600 dark:text-gray-400", children: suggestion.description })] })] }) }) }, suggestion.id))) })] })] }), _jsx(Snackbar, { open: !!error, autoHideDuration: 6000, onClose: () => setError(null), anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, children: _jsx(Alert, { severity: "error", onClose: () => setError(null), children: error }) })] }));
};
export default Assistant;
