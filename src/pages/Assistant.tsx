
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
