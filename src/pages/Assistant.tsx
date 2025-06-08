import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, IconButton, Card, CardContent, Alert, Snackbar, CircularProgress, Fab, Menu, MenuItem, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  PaperAirplaneIcon, 
  DocumentArrowDownIcon, 
  ShareIcon,
  SparklesIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { useTax } from '../context/TaxContext';
import { useFinance } from '../context/FinanceContext';

// TODO: Move to environment variables later
const OPENAI_API_KEY = 'sk-placeholder-your-openai-api-key-here';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
  filingIntent?: FilingIntent;
}

interface FilingIntent {
  type: 'CIT' | 'VAT';
  extractedData: {
    revenue?: number;
    expenses?: number;
    taxableIncome?: number;
    citPayable?: number;
    outputVAT?: number;
    inputVAT?: number;
    netVAT?: number;
    period?: string;
    summary?: string;
  };
  confidence: number;
}

interface AuditLog {
  id: string;
  userMessage: string;
  assistantReply: string;
  timestamp: Date;
  tokenUsage?: number;
  responseTime?: number;
}

// UAE CIT/VAT System Prompt for GPT-4
const UAE_TAX_SYSTEM_PROMPT = `You are a specialized UAE tax assistant helping SMEs comply with Corporate Income Tax (CIT) and VAT regulations based on Federal Tax Authority (FTA) guidance. Answer in simple, practical language using local deadlines, thresholds, and formats.

**UAE CORPORATE TAX (CIT) KNOWLEDGE:**
- CIT Rate: 9% on taxable income exceeding AED 375,000
- Small Business Relief: 0% rate for income up to AED 375,000
- Tax Period: Financial year (can be calendar year or custom 12 months)
- Filing Deadline: 9 months after financial year-end
- Payment Deadline: Same as filing deadline
- Registration Threshold: AED 1 million revenue (automatic registration required)
- Minimum Tax: None for qualifying Small Business Relief
- Tax Groups: Available for UAE resident companies under common control
- Participation Exemption: Available for qualifying shareholdings

**UAE VAT KNOWLEDGE:**
- Standard Rate: 5% on most goods and services
- Zero Rate: 0% on exports, international transport, precious metals
- Exempt: Financial services, residential property sales, local passenger transport
- Registration Threshold: AED 375,000 revenue over 12 months
- Voluntary Registration: Available for businesses below threshold
- Tax Period: Monthly (large businesses) or Quarterly (small businesses)
- Filing Deadline: 28 days after end of tax period
- Payment Deadline: Same as filing deadline
- Penalties: 5% of tax due (minimum AED 3,000) for late filing

**COMMON FTA REQUIREMENTS:**
- TRN (Tax Registration Number): Required for all registered taxpayers
- Economic Substance Regulations: Apply to relevant activities
- Digital Services Tax: 50% withholding on certain digital services
- Excise Tax: 100% on tobacco, 50% on carbonated drinks, 100% on energy drinks
- Transfer Pricing: Documentation required for related party transactions

**SME PRACTICAL GUIDANCE:**
- Maintain proper books and records for 5 years
- Issue tax invoices for VAT-registered supplies
- File nil returns even with no activity
- Penalties can be significant - seek professional help when unsure
- FTA offers guidance documents and webinars
- Consider voluntary disclosure for past errors

**KEY DATES TO REMEMBER:**
- VAT monthly filing: 28th of following month
- VAT quarterly filing: 28 days after quarter end
- CIT filing: 9 months after financial year-end
- Economic Substance deadline: 6 months after financial year-end

Always provide specific AED amounts, actual deadlines, and reference FTA guidance where applicable. Suggest consulting qualified tax advisors for complex matters.`;

interface SuggestedQuestion {
  id: string;
  question: string;
  category: 'cit' | 'vat' | 'transferPricing' | 'general';
  answer: string;
}

const Assistant: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { state } = useTax();
  const { getTotalRevenue, getTotalExpenses, getNetIncome } = useFinance();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [uaeMode] = useState(true); // Always enabled for UAE compliance
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRTL = i18n.language === 'ar';

  // Detect filing intent from assistant responses
  const detectFilingIntent = (content: string): FilingIntent | null => {
    const citPatterns = [
      /estimated CIT payable.*?AED\s*([\d,]+)/i,
      /corporate tax.*?due.*?AED\s*([\d,]+)/i,
      /CIT liability.*?AED\s*([\d,]+)/i,
      /taxable income.*?AED\s*([\d,]+)/i,
      /file.*?CIT.*?summary/i
    ];

    const vatPatterns = [
      /VAT.*?payable.*?AED\s*([\d,]+)/i,
      /output VAT.*?AED\s*([\d,]+)/i,
      /input VAT.*?AED\s*([\d,]+)/i,
      /net VAT.*?AED\s*([\d,]+)/i,
      /file.*?VAT.*?summary/i,
      /VAT return.*?period/i
    ];

    const extractNumbers = (text: string) => {
      const numbers = text.match(/AED\s*([\d,]+)/g);
      return numbers ? numbers.map(n => parseInt(n.replace(/[^\d]/g, ''))) : [];
    };

    // Check CIT patterns
    for (const pattern of citPatterns) {
      if (pattern.test(content)) {
        const numbers = extractNumbers(content);
        return {
          type: 'CIT',
          extractedData: {
            revenue: getTotalRevenue(),
            expenses: getTotalExpenses(),
            taxableIncome: getNetIncome(),
            citPayable: numbers[0] || 0,
            period: `${new Date().getFullYear()}`,
            summary: content.substring(0, 200)
          },
          confidence: 0.85
        };
      }
    }

    // Check VAT patterns
    for (const pattern of vatPatterns) {
      if (pattern.test(content)) {
        const numbers = extractNumbers(content);
        return {
          type: 'VAT',
          extractedData: {
            revenue: getTotalRevenue(),
            expenses: getTotalExpenses(),
            outputVAT: numbers[0] || 0,
            inputVAT: numbers[1] || 0,
            netVAT: numbers[0] - (numbers[1] || 0),
            period: `${new Date().getFullYear()}-Q${Math.ceil((new Date().getMonth() + 1) / 3)}`,
            summary: content.substring(0, 200)
          },
          confidence: 0.80
        };
      }
    }

    return null;
  };

  // Handle draft filing simulation
  const handleDraftFiling = (message: Message) => {
    if (!message.filingIntent) return;

    const { type, extractedData } = message.filingIntent;
    
    // Store draft data in sessionStorage for preview pages
    const draftData = {
      source: 'assistant',
      timestamp: new Date().toISOString(),
      assistantMessageId: message.id,
      simulationMode: true,
      data: extractedData
    };

    sessionStorage.setItem(`draft${type}Filing`, JSON.stringify(draftData));

    // Audit log for draft filing simulation
    const auditEntry: AuditLog = {
      id: Date.now().toString(),
      userMessage: `Draft ${type} filing simulation`,
      assistantReply: `Simulated ${type} filing with extracted data`,
      timestamp: new Date(),
      responseTime: 0
    };
    setAuditLogs(prev => [...prev, auditEntry]);

    setSuccess(t('assistant.draftFiling.success', `Draft ${type} filing prepared. Redirecting to preview...`));

    // Navigate to preview page
    setTimeout(() => {
      if (type === 'CIT') {
        navigate('/cit?mode=preview&source=assistant');
      } else {
        navigate('/vat?mode=preview&source=assistant');
      }
    }, 1500);
  };

  // OpenAI GPT-4 API integration with UAE CIT/VAT training
  const callOpenAI = async (userMessage: string): Promise<string> => {
    const startTime = Date.now();
    
    try {
      // Get user context for more personalized responses
      const citLiability = state.citDue || 0;
      const vatDue = state.vatDue || 0;
      const revenue = state.revenue || 0;
      const currentYear = new Date().getFullYear();

      // Enhanced system prompt with user context
      const contextualSystemPrompt = `${UAE_TAX_SYSTEM_PROMPT}

**CURRENT USER CONTEXT:**
- CIT liability: AED ${citLiability.toLocaleString()}
- VAT due: AED ${vatDue.toLocaleString()}  
- Total revenue: AED ${revenue.toLocaleString()}
- Current tax year: ${currentYear}
- Using Peergos UAE Compliance Platform

**RESPONSE GUIDELINES:**
- Provide specific, actionable advice for UAE SMEs
- Reference the user's current tax position when relevant
- Suggest Peergos features for compliance management
- Always recommend professional consultation for complex matters
- Keep responses clear, practical, and compliant with FTA guidance`;

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
      const assistantReply = data.choices[0]?.message?.content || t('assistant.responses.default', 'I\'m here to help with UAE tax compliance. Please try rephrasing your question.');
      const responseTime = Date.now() - startTime;

      // Audit logging
      const auditEntry: AuditLog = {
        id: Date.now().toString(),
        userMessage,
        assistantReply,
        timestamp: new Date(),
        tokenUsage: data.usage?.total_tokens || 0,
        responseTime
      };

      setAuditLogs(prev => [...prev, auditEntry]);
      
      // Log to console for debugging
      console.log('🤖 Assistant Audit Log:', {
        userMessage: userMessage.substring(0, 100) + '...',
        replyLength: assistantReply.length,
        responseTime: `${responseTime}ms`,
        tokens: data.usage?.total_tokens || 0
      });

      return assistantReply;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Enhanced fallback responses with UAE context
      if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        return t('assistant.responses.greeting', 'Hello! I\'m your UAE tax assistant. I can help with CIT, VAT, filing deadlines, and FTA compliance. What would you like to know?');
      }
      
      if (userMessage.toLowerCase().includes('cit') || userMessage.toLowerCase().includes('corporate tax')) {
        return 'I can help with UAE Corporate Tax! Key facts: 9% rate on income above AED 375,000, Small Business Relief available, filing due 9 months after year-end. What specific CIT question do you have?';
      }
      
      if (userMessage.toLowerCase().includes('vat')) {
        return 'I can assist with UAE VAT compliance! Key facts: 5% standard rate, AED 375,000 registration threshold, monthly/quarterly filing. What VAT question can I help with?';
      }
      
      return t('assistant.responses.apiError', 'I\'m having trouble connecting to my knowledge base right now. Please try again in a moment, or contact support if the issue persists.');
    }
  };

  const suggestedQuestions: SuggestedQuestion[] = [
    {
      id: '1',
      question: 'When is my next CIT payment due?',
      category: 'cit',
      answer: 'AI will analyze your CIT filing deadline based on your financial year-end...'
    },
    {
      id: '2',
      question: 'How do I apply for Small Business Relief?',
      category: 'cit',
      answer: 'AI will explain the AED 375,000 threshold and application process...'
    },
    {
      id: '3',
      question: 'What happens if I miss my VAT return?',
      category: 'vat',
      answer: 'AI will explain FTA penalties and remediation steps...'
    },
    {
      id: '4',
      question: 'Do I need to register for VAT with AED 350,000 revenue?',
      category: 'vat',
      answer: 'AI will assess your proximity to the AED 375,000 threshold...'
    },
    {
      id: '5',
      question: 'How do I get a TRN for my business?',
      category: 'general',
      answer: 'AI will guide you through the FTA registration process...'
    },
    {
      id: '6',
      question: 'What records do I need to keep for CIT compliance?',
      category: 'cit',
      answer: 'AI will list the 5-year record-keeping requirements...'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message on component mount
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: t('assistant.welcome.message', 'Hi! I\'m your Peergos Tax Assistant. Ask me anything about VAT, CIT, or compliance.'),
        type: 'assistant',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
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
    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      type: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Call OpenAI GPT-4 API
      const response = await callOpenAI(currentInput);

      // Detect filing intent in the response
      const filingIntent = detectFilingIntent(response);

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: response,
        type: 'assistant',
        timestamp: new Date(),
        filingIntent
      };

      setMessages(prev => prev.filter(msg => !msg.isTyping).concat([assistantMessage]));
    } catch (err) {
      setError(t('assistant.error', 'Error getting response from assistant. Please check your API key or try again.'));
      setMessages(prev => prev.filter(msg => !msg.isTyping));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: SuggestedQuestion) => {
    setInput(suggestion.question);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const exportChat = () => {
    const chatContent = messages
      .map(msg => `${msg.type === 'user' ? 'You' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-assistant-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSuccess(t('assistant.exportSuccess', 'Chat exported successfully'));
    setExportMenuAnchor(null);
  };

  const exportAuditLog = () => {
    const auditContent = auditLogs.map(log => 
      `[${log.timestamp.toISOString()}] Tokens: ${log.tokenUsage}, Response Time: ${log.responseTime}ms
User: ${log.userMessage}
Assistant: ${log.assistantReply}
---`
    ).join('\n\n');

    const blob = new Blob([auditContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assistant-audit-log-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSuccess(t('assistant.auditExported', 'Audit log exported successfully'));
    setExportMenuAnchor(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cit': return 'text-blue-600 dark:text-blue-400';
      case 'vat': return 'text-green-600 dark:text-green-400';
      case 'transferPricing': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-indigo-600 dark:text-indigo-400';
    }
  };

  return (
    <Box className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <Paper elevation={0} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
          <Box className="flex items-center justify-between mb-4">
            <Box className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <Box>
                <Typography variant="h4" className="text-gray-900 dark:text-white font-semibold">
                  {t('assistant.title', 'Tax Assistant')}
                </Typography>
                <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
                  {t('assistant.subtitle', 'AI-powered guidance for UAE tax compliance')}
                </Typography>
              </Box>
            </Box>

            <Box className="flex items-center gap-3">
              {/* UAE Mode Badge */}
              {uaeMode && (
                <Box className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full">
                  <span className="text-lg">🇦🇪</span>
                  <Typography variant="caption" className="text-green-700 dark:text-green-300 font-medium">
                    CIT/VAT UAE Mode: Active
                  </Typography>
                </Box>
              )}
              
              {messages.length > 0 && (
                <>
                  <IconButton
                    onClick={clearChat}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </IconButton>
                  <IconButton
                    onClick={(e) => setExportMenuAnchor(e.currentTarget)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <ShareIcon className="h-5 w-5" />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Chat Interface */}
        <Paper className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {/* Messages Area */}
          <Box className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <Box className="flex items-center justify-center h-full text-center">
                <Box>
                  <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <Typography variant="h6" className="text-gray-500 dark:text-gray-400 mb-2">
                    {t('assistant.welcome', 'Welcome to your Tax Assistant')}
                  </Typography>
                  <Typography variant="body2" className="text-gray-400 dark:text-gray-500">
                    {t('assistant.welcomeDesc', 'Ask questions about UAE tax compliance, or try a suggested question below')}
                  </Typography>
                </Box>
              </Box>
            ) : (
              messages.map((message) => (
                <Box
                  key={message.id}
                  className={`flex ${message.type === 'user' ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}`}
                >
                  <Box
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {message.isTyping ? (
                      <Box className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="body1" className="whitespace-pre-wrap">
                          {message.content}
                        </Typography>
                        
                        {/* Draft Filing Intent Detection */}
                        {message.filingIntent && message.filingIntent.confidence > 0.7 && (
                          <Box className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <Box className="flex items-center gap-2 mb-2">
                              <BeakerIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <Typography variant="caption" className="text-blue-700 dark:text-blue-300 font-semibold uppercase tracking-wide">
                                {t('assistant.draftFiling.detected', 'Draft Filing Detected')}
                              </Typography>
                              <Chip 
                                label={`🧪 ${message.filingIntent.type}`}
                                size="small"
                                className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200"
                              />
                            </Box>
                            <Typography variant="body2" className="text-blue-600 dark:text-blue-300 mb-3">
                              {message.filingIntent.type === 'CIT' 
                                ? t('assistant.draftFiling.citDetected', 'I detected CIT filing information in my response. Would you like to simulate a draft filing?')
                                : t('assistant.draftFiling.vatDetected', 'I detected VAT filing information in my response. Would you like to simulate a draft filing?')
                              }
                            </Typography>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<DocumentDuplicateIcon className="h-4 w-4" />}
                              onClick={() => handleDraftFiling(message)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {t('assistant.draftFiling.simulate', `Simulate ${message.filingIntent.type} Filing`)}
                            </Button>
                          </Box>
                        )}
                        
                        <Typography 
                          variant="caption" 
                          className={`block mt-2 ${
                            message.type === 'user' 
                              ? 'text-indigo-100' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              ))
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box className="border-t border-gray-200 dark:border-gray-700 p-4">
            <Box className="flex gap-3 items-end">
              <TextField
                fullWidth
                multiline
                maxRows={3}
                variant="outlined"
                placeholder={t('assistant.input.placeholder', 'Ask about VAT, CIT, Transfer Pricing, or general tax questions...')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLoading}
                className="bg-gray-50 dark:bg-gray-700"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgb(99 102 241)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgb(99 102 241)',
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-6 py-3 rounded-xl"
                endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <PaperAirplaneIcon className="h-5 w-5" />}
              >
                {t('assistant.input.send', 'Send')}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Suggested Questions */}
        <Paper elevation={0} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm mt-6">
          <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold">
            {t('assistant.suggestions.title', 'Suggested Questions')}
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedQuestions.map((suggestion) => (
              <Card
                key={suggestion.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <CardContent className="p-4">
                  <Box className="flex items-start gap-3">
                    <QuestionMarkCircleIcon className={`h-6 w-6 mt-1 ${getCategoryColor(suggestion.category)}`} />
                    <Box className="flex-1">
                      <Typography 
                        variant="body1" 
                        className="text-gray-900 dark:text-white font-medium mb-1"
                      >
                        {suggestion.question}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        className={`uppercase tracking-wide font-semibold ${getCategoryColor(suggestion.category)}`}
                      >
                        {t(`assistant.categories.${suggestion.category}`, suggestion.category)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>

        {/* Export Menu */}
        <Menu
          anchorEl={exportMenuAnchor}
          open={Boolean(exportMenuAnchor)}
          onClose={() => setExportMenuAnchor(null)}
        >
          <MenuItem onClick={exportChat}>
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            {t('assistant.export.chat', 'Export Chat')}
          </MenuItem>
          <MenuItem onClick={exportAuditLog}>
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            {t('assistant.export.auditLog', 'Export Audit Log')}
          </MenuItem>
        </Menu>

        {/* Notifications */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={3000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        </Snackbar>
      </div>
    </Box>
  );
};

export default Assistant;