import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, Card, CardContent, Alert, Snackbar, CircularProgress, Chip, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PaperAirplaneIcon, XMarkIcon, BuildingOffice2Icon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useTax } from '../context/TaxContext';
import { useFinance } from '../context/FinanceContext';
// TODO: Move to environment variables later
const OPENAI_API_KEY = 'sk-placeholder-your-openai-api-key-here';
// UAE Free Zone Tax System Prompt for GPT-4
const UAE_FREE_ZONE_SYSTEM_PROMPT = `You are a specialized UAE Free Zone Tax Advisor helping SMEs understand Free Zone CIT and VAT compliance based on Federal Tax Authority (FTA) guidance and UAE CIT Law Article 18. Answer in simple, practical language using local regulations and QFZP decision trees.

**UAE FREE ZONE CORPORATE TAX KNOWLEDGE:**
- Qualifying Free Zone Person (QFZP): 0% CIT rate on Qualifying Income under Article 18
- Non-Qualifying Income: 9% CIT rate on income above AED 375,000 (same as mainland)
- De Minimis Test: Non-qualifying income must not exceed 5% of total income OR AED 5 million
- Qualifying Income includes: Exports from UAE, transactions within same Free Zone, income from foreign sources
- Non-Qualifying Income includes: Supply of goods/services consumed in mainland UAE

**UAE FREE ZONE VAT KNOWLEDGE:**
- Free Zone to Mainland: Standard rated (5% VAT) if goods/services consumed in mainland
- Free Zone to Free Zone (same zone): Zero-rated (0% VAT)
- Free Zone to Foreign: Zero-rated exports (0% VAT)
- Input VAT Recovery: Can claim input VAT on mainland purchases for business use
- Designated Zones: Special rules for reverse charge mechanism on mainland imports

**QFZP QUALIFICATION CRITERIA:**
1. Licensed to operate in UAE Free Zone
2. Maintains adequate economic substance in the Free Zone
3. Derives only Qualifying Income OR meets De Minimis test
4. Complies with Free Zone regulations and licensing requirements

**DESIGNATED ZONES:**
- Abu Dhabi Global Market (ADGM)
- Dubai International Financial Centre (DIFC)
- Special reverse charge rules apply for supplies from mainland UAE

**ECONOMIC SUBSTANCE REQUIREMENTS:**
- Adequate number of employees in Free Zone
- Adequate operating expenditure in Free Zone
- Core income-generating activities conducted in Free Zone
- Proper books and records maintained in UAE

**COMMON FREE ZONE SCENARIOS:**
- Manufacturing for export: Likely QFZP qualifying
- Trading within Free Zone: QFZP qualifying
- Services to mainland UAE: Non-qualifying income (subject to 9% CIT)
- Re-export business: Likely QFZP qualifying if proper substance

Always provide specific guidance based on the user's Free Zone status and business activities. Reference Article 18 of UAE CIT Law and FTA guidance where applicable.`;
const FreeZoneAdvisor = ({ open, onClose, context = 'general' }) => {
    const { t, i18n } = useTranslation();
    const { state } = useTax();
    const { getTotalRevenue, getQualifyingIncome, getNonQualifyingIncome } = useFinance();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const messagesEndRef = useRef(null);
    const isRTL = i18n.language === 'ar';
    // Get user's Free Zone context
    const userContext = {
        isFreeZone: state.isFreeZone || false,
        isQFZP: state.isQFZP || false,
        freeZoneName: state.freeZoneName || '',
        totalRevenue: getTotalRevenue(),
        qualifyingIncome: getQualifyingIncome(),
        nonQualifyingIncome: getNonQualifyingIncome(),
        deMinimisCompliant: getNonQualifyingIncome() <= (getTotalRevenue() * 0.05) || getNonQualifyingIncome() <= 5000000,
        context
    };
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    // Free Zone specific OpenAI integration
    const callFreeZoneAdvisor = async (userMessage) => {
        try {
            // Enhanced system prompt with user's Free Zone context
            const contextualSystemPrompt = `${UAE_FREE_ZONE_SYSTEM_PROMPT}

**CURRENT USER CONTEXT:**
- Free Zone Company: ${userContext.isFreeZone ? 'Yes' : 'No'}
- QFZP Status: ${userContext.isQFZP ? 'Qualified' : 'Not Qualified'}
- Free Zone: ${userContext.freeZoneName || 'Not specified'}
- Total Revenue: AED ${userContext.totalRevenue.toLocaleString()}
- Qualifying Income: AED ${userContext.qualifyingIncome.toLocaleString()}
- Non-Qualifying Income: AED ${userContext.nonQualifyingIncome.toLocaleString()}
- De Minimis Compliant: ${userContext.deMinimisCompliant ? 'Yes' : 'No'}
- Context: ${context} form consultation

**RESPONSE GUIDELINES:**
- Always check user's Free Zone status before providing advice
- Reference specific Free Zone regulations and Article 18 where applicable
- Provide practical, actionable guidance for SME compliance
- Suggest next steps or form actions when relevant
- If user is not in Free Zone, clearly state limitations`;
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        { role: 'system', content: contextualSystemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    max_tokens: 600,
                    temperature: 0.7
                })
            });
            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }
            const data = await response.json();
            return data.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try rephrasing your question.';
        }
        catch (error) {
            console.error('Free Zone Advisor API Error:', error);
            // Enhanced fallback responses with Free Zone context
            const isArabic = i18n.language === 'ar';
            const lowerMsg = userMessage.toLowerCase();
            // Check if user is not in Free Zone
            if (!userContext.isFreeZone) {
                return isArabic
                    ? 'أنت لست مصنفاً كشخص في المنطقة الحرة، لذا قد لا تنطبق هذه الأحكام عليك. للحصول على المشورة العامة بشأن الضرائب، يرجى استخدام المساعد الضريبي الرئيسي.'
                    : 'You are not classified as a Free Zone Person, so these provisions may not apply to you. For general tax advice, please use the main Tax Assistant.';
            }
            // QFZP questions
            if (lowerMsg.includes('qfzp') || lowerMsg.includes('qualify') || lowerMsg.includes('0%') || lowerMsg.includes('zero percent')) {
                return isArabic
                    ? 'للتأهل كشخص مؤهل في المنطقة الحرة (QFZP)، يجب أن تستوفي معايير الجوهر الاقتصادي وأن تحقق دخلاً مؤهلاً فقط أو تستوفي اختبار الحد الأدنى (5% أو 5 مليون درهم). حالتك الحالية: ' + (userContext.isQFZP ? 'مؤهل' : 'غير مؤهل')
                    : `To qualify as a QFZP, you must meet economic substance criteria and derive only Qualifying Income OR meet the De Minimis test (5% or AED 5 million). Your current status: ${userContext.isQFZP ? 'Qualified' : 'Not Qualified'}`;
            }
            // VAT questions
            if (lowerMsg.includes('vat') || lowerMsg.includes('input vat') || lowerMsg.includes('mainland')) {
                return isArabic
                    ? 'يمكن للشركات في المنطقة الحرة استرداد ضريبة القيمة المضافة على المدخلات من المشتريات في البر الرئيسي للاستخدام التجاري. المبيعات للبر الرئيسي تخضع للمعدل القياسي 5% إذا كانت تُستهلك هناك.'
                    : 'Free Zone companies can claim input VAT on mainland purchases for business use. Sales to mainland are standard rated (5% VAT) if consumed there.';
            }
            // Designated Zones
            if (lowerMsg.includes('designated zone') || lowerMsg.includes('adgm') || lowerMsg.includes('difc')) {
                return isArabic
                    ? 'المناطق المخصصة (ADGM، DIFC) لها قواعد خاصة للرسوم العكسية على التوريدات من البر الرئيسي للإمارات. يجب تطبيق آلية الرسوم العكسية على الواردات من البر الرئيسي.'
                    : 'Designated Zones (ADGM, DIFC) have special reverse charge rules for supplies from mainland UAE. Reverse charge mechanism applies on mainland imports.';
            }
            return isArabic
                ? 'أعتذر، أواجه مشكلة في الاتصال بقاعدة المعرفة الخاصة بالمنطقة الحرة. يرجى المحاولة مرة أخرى لاحقاً.'
                : 'I\'m having trouble connecting to my Free Zone knowledge base. Please try again in a moment.';
        }
    };
    // Add welcome message on component mount
    useEffect(() => {
        if (open && messages.length === 0) {
            const welcomeMessage = {
                id: 'welcome',
                content: userContext.isFreeZone
                    ? t('freeZoneAdvisor.welcome.freeZone', `Hello! I'm your Free Zone Tax Advisor. I can help with QFZP qualification, Free Zone CIT, VAT compliance, and Designated Zone rules. Your Free Zone: ${userContext.freeZoneName || 'Not specified'}`)
                    : t('freeZoneAdvisor.welcome.nonFreeZone', 'Hello! I see you are not classified as a Free Zone company. I can still provide general Free Zone information, but these provisions may not apply to your situation.'),
                type: 'advisor',
                timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
        }
    }, [open, userContext.isFreeZone, userContext.freeZoneName]);
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
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        // Add typing indicator
        const typingMessage = {
            id: (Date.now() + 1).toString(),
            content: '',
            type: 'advisor',
            timestamp: new Date(),
            isTyping: true
        };
        setMessages(prev => [...prev, typingMessage]);
        try {
            const response = await callFreeZoneAdvisor(currentInput);
            const advisorMessage = {
                id: (Date.now() + 2).toString(),
                content: response,
                type: 'advisor',
                timestamp: new Date(),
            };
            setMessages(prev => prev.filter(msg => !msg.isTyping).concat([advisorMessage]));
        }
        catch (err) {
            setError(t('freeZoneAdvisor.error', 'Error getting response from Free Zone Advisor. Please try again.'));
            setMessages(prev => prev.filter(msg => !msg.isTyping));
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleClose = () => {
        setMessages([]);
        setInput('');
        setError(null);
        setSuccess(null);
        onClose();
    };
    const suggestedQuestions = [
        'Do I qualify for 0% CIT as a Free Zone company?',
        'Can I claim input VAT on mainland purchases?',
        'What are Designated Zones and how do they affect my VAT?',
        'What is the De Minimis test for QFZP status?',
        'How do I maintain economic substance in my Free Zone?',
        'Can I sell to mainland UAE and keep QFZP status?'
    ];
    if (!open)
        return null;
    return (_jsxs(Dialog, { open: open, onClose: handleClose, maxWidth: "md", fullWidth: true, PaperProps: {
            sx: { height: '80vh' }
        }, children: [_jsx(DialogTitle, { children: _jsxs(Box, { className: "flex items-center justify-between", children: [_jsxs(Box, { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg", children: _jsx(BuildingOffice2Icon, { className: "h-6 w-6 text-white" }) }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white font-semibold", children: t('freeZoneAdvisor.title', 'Free Zone Tax Advisor') }), _jsx(Typography, { variant: "caption", className: "text-gray-600 dark:text-gray-400", children: t('freeZoneAdvisor.subtitle', 'Specialized guidance for Free Zone CIT & VAT compliance') })] })] }), _jsxs(Box, { className: "flex items-center gap-2", children: [_jsx(Chip, { icon: userContext.isFreeZone ? _jsx(ShieldCheckIcon, { className: "h-4 w-4" }) : _jsx(ExclamationTriangleIcon, { className: "h-4 w-4" }), label: userContext.isFreeZone ? 'Free Zone' : 'Non-Free Zone', size: "small", color: userContext.isFreeZone ? 'success' : 'warning' }), userContext.isFreeZone && (_jsx(Chip, { label: userContext.isQFZP ? 'QFZP Qualified' : 'Not QFZP', size: "small", color: userContext.isQFZP ? 'success' : 'default' })), _jsx(IconButton, { onClick: handleClose, size: "small", children: _jsx(XMarkIcon, { className: "h-5 w-5" }) })] })] }) }), _jsxs(DialogContent, { className: "flex flex-col h-full", children: [_jsxs(Box, { className: "flex-1 overflow-y-auto space-y-4 mb-4", children: [messages.map((message) => (_jsx(Box, { className: `flex ${message.type === 'user' ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}`, children: _jsx(Box, { className: `max-w-[75%] rounded-2xl px-4 py-3 ${message.type === 'user'
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'}`, children: message.isTyping ? (_jsx(Box, { className: "flex items-center space-x-1", children: _jsxs("div", { className: "flex space-x-1", children: [_jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce" }), _jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: '0.1s' } }), _jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: '0.2s' } })] }) })) : (_jsxs(_Fragment, { children: [_jsx(Typography, { variant: "body1", className: "whitespace-pre-wrap", children: message.content }), _jsx(Typography, { variant: "caption", className: `block mt-2 ${message.type === 'user'
                                                    ? 'text-emerald-100'
                                                    : 'text-gray-500 dark:text-gray-400'}`, children: message.timestamp.toLocaleTimeString() })] })) }) }, message.id))), _jsx("div", { ref: messagesEndRef })] }), messages.length <= 1 && (_jsxs(Box, { className: "mb-4", children: [_jsx(Typography, { variant: "subtitle2", className: "text-gray-700 dark:text-gray-300 mb-2", children: t('freeZoneAdvisor.suggestions', 'Suggested Questions:') }), _jsx(Box, { className: "grid grid-cols-1 gap-2", children: suggestedQuestions.slice(0, 3).map((question, index) => (_jsx(Card, { className: "cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700", onClick: () => setInput(question), children: _jsx(CardContent, { className: "p-3", children: _jsx(Typography, { variant: "body2", className: "text-gray-700 dark:text-gray-300", children: question }) }) }, index))) })] })), _jsxs(Box, { className: "flex gap-3 items-end border-t border-gray-200 dark:border-gray-700 pt-4", children: [_jsx(TextField, { fullWidth: true, multiline: true, maxRows: 3, variant: "outlined", placeholder: t('freeZoneAdvisor.input.placeholder', 'Ask about Free Zone CIT, VAT, QFZP qualification, or Designated Zones...'), value: input, onChange: (e) => setInput(e.target.value), onKeyPress: (e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }, disabled: isLoading, size: "small", sx: {
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    },
                                } }), _jsx(Button, { variant: "contained", onClick: handleSend, disabled: isLoading || !input.trim(), className: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-4 py-2 rounded-xl", endIcon: isLoading ? _jsx(CircularProgress, { size: 16, color: "inherit" }) : _jsx(PaperAirplaneIcon, { className: "h-4 w-4" }), children: t('freeZoneAdvisor.send', 'Send') })] })] }), _jsx(Snackbar, { open: !!error, autoHideDuration: 6000, onClose: () => setError(null), anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, children: _jsx(Alert, { severity: "error", onClose: () => setError(null), children: error }) }), _jsx(Snackbar, { open: !!success, autoHideDuration: 3000, onClose: () => setSuccess(null), anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, children: _jsx(Alert, { severity: "success", onClose: () => setSuccess(null), children: success }) })] }));
};
export default FreeZoneAdvisor;
