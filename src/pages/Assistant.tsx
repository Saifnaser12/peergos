
import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, IconButton, Card, CardContent, Alert, Snackbar, CircularProgress, Fab, Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { 
  PaperAirplaneIcon, 
  DocumentArrowDownIcon, 
  ShareIcon,
  SparklesIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useTax } from '../context/TaxContext';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface SuggestedQuestion {
  id: string;
  question: string;
  category: 'cit' | 'vat' | 'transferPricing' | 'general';
  answer: string;
}

const Assistant: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { state } = useTax();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRTL = i18n.language === 'ar';

  // Smart responses based on user data and UAE context
  const getSmartResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Context-aware responses using actual system data
    if (lowerQuestion.includes('tax') && lowerQuestion.includes('owe')) {
      const citLiability = state.citDue || 0;
      const vatDue = state.vatDue || 0;
      const total = citLiability + vatDue;
      
      if (total > 0) {
        return t('assistant.responses.taxOwed', {
          citAmount: citLiability.toLocaleString(),
          vatAmount: vatDue.toLocaleString(),
          totalAmount: total.toLocaleString(),
          defaultValue: `Based on your current filings, you owe AED ${citLiability.toLocaleString()} in Corporate Income Tax and AED ${vatDue.toLocaleString()} in VAT, totaling AED ${total.toLocaleString()}. Please review your CIT and VAT pages for detailed calculations.`
        });
      } else {
        return t('assistant.responses.noTaxOwed', 'Great news! Based on your current data, you have no outstanding tax liabilities. Make sure to file your returns on time to maintain compliance.');
      }
    }

    if (lowerQuestion.includes('small business relief')) {
      const revenue = state.revenue || 0;
      if (revenue <= 3000000) {
        return t('assistant.responses.smallBusinessEligible', 'You appear eligible for Small Business Relief! Companies with revenue ≤ AED 3 million can elect for 0% CIT rate. You can make this election in your CIT filing page.');
      } else {
        return t('assistant.responses.smallBusinessNotEligible', `With revenue of AED ${revenue.toLocaleString()}, you exceed the AED 3 million threshold for Small Business Relief. Your standard CIT rate is 9%.`);
      }
    }

    if (lowerQuestion.includes('vat') && lowerQuestion.includes('export')) {
      return t('assistant.responses.vatExport', 'To export your VAT summary, go to the VAT page and click the "Export Returns" button. You can download as PDF or Excel format. The export includes all your VAT periods, input/output tax, and net VAT position.');
    }

    if (lowerQuestion.includes('exempt income')) {
      return t('assistant.responses.exemptIncome', 'Under UAE CIT, exempt income includes dividends from UAE resident companies, income from free zone qualifying activities (if elected), and capital gains from disposal of qualifying shareholdings. This must be properly documented in your CIT return.');
    }

    if (lowerQuestion.includes('transfer pricing')) {
      return t('assistant.responses.transferPricing', 'UAE transfer pricing rules apply to related party transactions. You need documentation if your group revenue exceeds AED 200 million. Check our Transfer Pricing module to assess your compliance requirements and upload necessary documentation.');
    }

    if (lowerQuestion.includes('deadline') || lowerQuestion.includes('due date')) {
      return t('assistant.responses.deadlines', 'UAE tax deadlines: VAT returns are due by 28th of the month following the tax period. CIT returns are due 9 months after financial year-end. Transfer pricing documentation is due with CIT return filing.');
    }

    if (lowerQuestion.includes('registration') || lowerQuestion.includes('trn')) {
      return t('assistant.responses.registration', 'VAT registration is mandatory if your taxable turnover exceeds AED 375,000. CIT registration is automatic for UAE mainland companies. You can verify TRN details using our TRN Search feature.');
    }

    // Default helpful response
    return t('assistant.responses.default', 'I\'m here to help with UAE tax compliance including VAT, CIT, and Transfer Pricing. I can provide guidance based on UAE FTA regulations and your system data. For specific legal advice, please consult a qualified tax advisor.');
  };

  const suggestedQuestions: SuggestedQuestion[] = [
    {
      id: '1',
      question: t('assistant.suggestions.taxOwed', 'How much tax do I owe?'),
      category: 'general',
      answer: 'Based on your current filings...'
    },
    {
      id: '2',
      question: t('assistant.suggestions.smallBusiness', 'Am I eligible for Small Business Relief?'),
      category: 'cit',
      answer: 'Small Business Relief eligibility...'
    },
    {
      id: '3',
      question: t('assistant.suggestions.vatExport', 'How to export VAT summary?'),
      category: 'vat',
      answer: 'To export your VAT summary...'
    },
    {
      id: '4',
      question: t('assistant.suggestions.exemptIncome', 'What is exempt income in UAE?'),
      category: 'cit',
      answer: 'Exempt income under UAE CIT...'
    },
    {
      id: '5',
      question: t('assistant.suggestions.transferPricingReq', 'Do I need transfer pricing documentation?'),
      category: 'transferPricing',
      answer: 'Transfer pricing requirements...'
    },
    {
      id: '6',
      question: t('assistant.suggestions.taxDeadlines', 'What are the tax filing deadlines?'),
      category: 'general',
      answer: 'UAE tax deadlines...'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response = getSmartResponse(currentInput);

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: response,
        type: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => prev.filter(msg => !msg.isTyping).concat([assistantMessage]));
    } catch (err) {
      setError(t('assistant.error', 'Error getting response from assistant'));
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
            
            <Box className="flex items-center gap-2">
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
