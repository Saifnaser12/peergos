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

// TODO: Move to environment variables later
const OPENAI_API_KEY = 'sk-placeholder-your-openai-api-key-here';

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

  // OpenAI GPT-4 API integration
  const callOpenAI = async (userMessage: string): Promise<string> => {
    try {
      // Get user context for more personalized responses
      const citLiability = state.citDue || 0;
      const vatDue = state.vatDue || 0;
      const revenue = state.revenue || 0;

      const systemPrompt = `You are Peergos Tax Assistant, an AI expert in UAE tax compliance including VAT, Corporate Income Tax (CIT), and Transfer Pricing. 

Current user context:
- CIT liability: AED ${citLiability.toLocaleString()}
- VAT due: AED ${vatDue.toLocaleString()}  
- Revenue: AED ${revenue.toLocaleString()}

Guidelines:
- Provide accurate, helpful advice on UAE FTA regulations
- Be conversational and friendly
- Reference specific UAE tax rates, thresholds, and deadlines
- Suggest using Peergos features when relevant
- Always recommend consulting qualified tax advisors for complex matters
- Keep responses concise but comprehensive`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || t('assistant.responses.default', 'I\'m here to help with UAE tax compliance. Please try rephrasing your question.');
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Fallback to basic responses if API fails
      if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        return t('assistant.responses.greeting', 'Hi! I\'m your Peergos Tax Assistant. Ask me anything about VAT, CIT, or compliance in the UAE.');
      }
      
      return t('assistant.responses.apiError', 'I\'m having trouble connecting to my knowledge base right now. Please try again in a moment, or contact support if the issue persists.');
    }
  };

  const suggestedQuestions: SuggestedQuestion[] = [
    {
      id: '1',
      question: t('assistant.suggestions.taxOwed', 'How much tax do I owe currently?'),
      category: 'general',
      answer: 'AI will analyze your current tax position...'
    },
    {
      id: '2',
      question: t('assistant.suggestions.smallBusiness', 'Am I eligible for Small Business Relief in UAE?'),
      category: 'cit',
      answer: 'AI will check your eligibility...'
    },
    {
      id: '3',
      question: t('assistant.suggestions.vatRegistration', 'Do I need to register for VAT in UAE?'),
      category: 'vat',
      answer: 'AI will assess your VAT obligations...'
    },
    {
      id: '4',
      question: t('assistant.suggestions.citDeadlines', 'When is my CIT return due?'),
      category: 'cit',
      answer: 'AI will provide deadline information...'
    },
    {
      id: '5',
      question: t('assistant.suggestions.transferPricingReq', 'Do I need transfer pricing documentation?'),
      category: 'transferPricing',
      answer: 'AI will review your requirements...'
    },
    {
      id: '6',
      question: t('assistant.suggestions.complianceChecklist', 'What compliance tasks should I prioritize?'),
      category: 'general',
      answer: 'AI will create a personalized checklist...'
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

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: response,
        type: 'assistant',
        timestamp: new Date(),
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