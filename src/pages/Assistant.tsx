import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, IconButton, Card, CardContent, Alert, Snackbar, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PaperAirplaneIcon, ArrowPathIcon, DocumentTextIcon, QuestionMarkCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: 'vat' | 'cit' | 'transferPricing' | 'general';
}

const Assistant: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample suggestions - replace with actual data from API
  const suggestions: Suggestion[] = [
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
    if (!input.trim()) return;

    const userMessage: Message = {
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
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: t('assistant.response', 'I am an AI assistant specialized in UAE tax compliance. I can help you with VAT, CIT, and transfer pricing matters. Please note that my responses are for guidance only and should not be considered as professional tax advice.'),
        type: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(t('assistant.error', 'Error getting response from assistant'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInput(suggestion.title);
  };

  return (
    <Box>
      <Paper elevation={0} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <Box className="flex items-center gap-4 mb-6">
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <Box>
            <Typography variant="h4" className="text-gray-900 dark:text-white mb-2">
              {t('assistant.title', 'AI Assistant')}
            </Typography>
            <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
              {t('assistant.subtitle', 'Get instant guidance on tax compliance matters')}
            </Typography>
          </Box>
        </Box>

        {/* Chat Interface */}
        <Box className="mb-6">
          <Paper className="h-[500px] bg-gray-50 dark:bg-gray-700 rounded-lg p-4 overflow-y-auto">
            {messages.map((message) => (
              <Box
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <Box
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                >
                  <Typography variant="body1">{message.content}</Typography>
                  <Typography variant="caption" className="text-gray-500 dark:text-gray-400 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            ))}
            {isLoading && (
              <Box className="flex justify-center mb-4">
                <CircularProgress size={24} />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Paper>
        </Box>

        {/* Input Area */}
        <Box className="flex gap-4 mb-6">
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t('assistant.input.placeholder', 'Ask a question about tax compliance...')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="bg-white dark:bg-gray-700"
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700"
            startIcon={<PaperAirplaneIcon className="h-5 w-5" />}
          >
            {t('assistant.input.send', 'Send')}
          </Button>
        </Box>

        {/* Suggestions */}
        <Box>
          <Typography variant="h6" className="text-gray-900 dark:text-white mb-4">
            {t('assistant.suggestions.title', 'Common Questions')}
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestions.map((suggestion) => (
              <Card
                key={suggestion.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <CardContent>
                  <Box className="flex items-start gap-4">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-1" />
                    <Box>
                      <Typography variant="h6" className="text-gray-900 dark:text-white mb-2">
                        {suggestion.title}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                        {suggestion.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Paper>

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
    </Box>
  );
};

export default Assistant; 
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Grid,
  Paper,
  Avatar,
  Chip
} from '@mui/material';
import { Send as SendIcon, SmartToy as BotIcon, Person as PersonIcon } from '@mui/icons-material';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your tax and compliance assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    'How do I calculate VAT?',
    'What are transfer pricing requirements?',
    'CIT filing deadlines',
    'Financial reporting standards',
    'Tax compliance checklist'
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAssistantResponse(inputMessage),
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const getAssistantResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('vat')) {
      return 'VAT (Value Added Tax) is calculated as a percentage of the transaction value. In UAE, the standard VAT rate is 5%. To calculate VAT: VAT Amount = (Transaction Value × VAT Rate) / 100. For example, on a $1000 transaction: VAT = ($1000 × 5) / 100 = $50.';
    } else if (lowerQuestion.includes('transfer pricing')) {
      return 'Transfer pricing refers to the pricing of transactions between related entities. UAE requires documentation for transactions exceeding AED 10 million. Key methods include CUP (Comparable Uncontrolled Price), CPI (Cost Plus Index), and RPM (Resale Price Method). Ensure proper documentation and economic substance compliance.';
    } else if (lowerQuestion.includes('cit')) {
      return 'Corporate Income Tax (CIT) in UAE is 9% for profits exceeding AED 375,000. Small businesses with profits up to AED 375,000 are exempt. Filing deadline is within 9 months of the financial year-end. Ensure proper bookkeeping and maintain supporting documents.';
    } else if (lowerQuestion.includes('financial reporting')) {
      return 'UAE follows International Financial Reporting Standards (IFRS). Key reports include Balance Sheet, Income Statement, Cash Flow Statement, and Statement of Changes in Equity. Ensure compliance with UAE Commercial Companies Law and maintain proper audit trails.';
    } else {
      return 'I understand you\'re asking about tax and compliance matters. While I can provide general guidance, I recommend consulting with a qualified tax professional for specific advice tailored to your situation. Feel free to ask more specific questions about VAT, CIT, transfer pricing, or financial reporting.';
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Tax & Compliance Assistant
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      maxWidth: '70%',
                      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                    }}
                  >
                    <Avatar sx={{ mx: 1 }}>
                      {message.sender === 'user' ? <PersonIcon /> : <BotIcon />}
                    </Avatar>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                        color: message.sender === 'user' ? 'white' : 'text.primary'
                      }}
                    >
                      <Typography variant="body1">{message.text}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                        {message.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ mx: 1 }}>
                    <BotIcon />
                  </Avatar>
                  <Paper sx={{ p: 2, backgroundColor: 'grey.100' }}>
                    <Typography>Typing...</Typography>
                  </Paper>
                </Box>
              )}
            </Box>
            
            <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Ask me about tax, compliance, or financial matters..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading || !inputMessage.trim()}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  <SendIcon />
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Questions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {quickQuestions.map((question, index) => (
                  <Chip
                    key={index}
                    label={question}
                    onClick={() => handleQuickQuestion(question)}
                    variant="outlined"
                    sx={{ justifyContent: 'flex-start', height: 'auto', py: 1, px: 2 }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Disclaimer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This assistant provides general information only. Always consult with qualified tax professionals for specific advice and compliance requirements.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Assistant;
import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Assistant: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tax Assistant
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          AI-powered tax assistance features will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Assistant;
