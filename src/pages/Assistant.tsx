import React, { useState, useRef, useEffect } from 'react';
import { useTax, calculateCIT } from '../context/TaxContext';
import { useAudit } from '../context/AuditContext';
import { useLocation } from 'react-router-dom';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  DocumentCheckIcon,
  CalculatorIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Card from '../components/Card';
import Button from '../components/Button';
import { EmptyState, illustrations } from '../components/Illustration';
import { LoadingOverlay } from '../components/Spinner';
import PermissionGate from '../components/PermissionGate';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PageTip {
  icon: React.ReactElement;
  title: string;
  content: string;
}

const Assistant: React.FC = () => {
  const { state } = useTax();
  const { log } = useAudit();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get current page tips
  const getPageTips = (): PageTip[] => {
    const path = location.pathname;

    if (path.includes('/setup')) {
      return [
        {
          icon: <DocumentCheckIcon className="h-6 w-6 text-blue-500" />,
          title: 'License Types',
          content: 'Mainland: Full commercial rights in UAE\nFree Zone: 100% ownership, tax benefits\nOffshore: International operations only'
        },
        {
          icon: <CalculatorIcon className="h-6 w-6 text-green-500" />,
          title: 'Revenue Thresholds',
          content: 'VAT Registration: AED 375,000\nVoluntary Registration: AED 187,500\nCIT Registration: AED 3,000,000'
        }
      ];
    }

    if (path.includes('/filing')) {
      return [
        {
          icon: <CalculatorIcon className="h-6 w-6 text-purple-500" />,
          title: 'VAT Calculation',
          content: 'Standard Rate: 5%\nZero Rate: Exports, healthcare\nExempt: Financial services, local transport'
        },
        {
          icon: <ChartBarIcon className="h-6 w-6 text-indigo-500" />,
          title: 'CIT Overview',
          content: '0% up to AED 375,000\n9% over AED 375,000\nExcludes certain free zone businesses'
        }
      ];
    }

    // Dashboard tips
    return [
      {
        icon: <SparklesIcon className="h-6 w-6 text-yellow-500" />,
        title: 'Compliance Tips',
        content: 'Keep records for 5 years\nSubmit returns on time\nMaintain proper documentation'
      },
      {
        icon: <ChartBarIcon className="h-6 w-6 text-green-500" />,
        title: 'Performance Metrics',
        content: 'Monitor revenue trends\nTrack tax obligations\nReview compliance score'
      }
    ];
  };

  useEffect(() => {
    log('VIEW_ASSISTANT');
    // Show welcome message based on current page
    const pageTips = getPageTips();
    const welcomeMessage = {
      id: Date.now().toString(),
      role: 'assistant' as const,
      content: `Welcome! I can help you with ${pageTips[0].title.toLowerCase()} and ${pageTips[1].title.toLowerCase()}. What would you like to know?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [location.pathname]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (question: string): Promise<string> => {
    const lowerQuestion = question.toLowerCase();
    const path = location.pathname;
    
    // Log the question
    log('ASSISTANT_QUERY', { question, page: path });

    // Simulate typing delay
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsTyping(false);

    if (path.includes('/setup')) {
      if (lowerQuestion.includes('license')) {
        return `There are three main license types in the UAE:

1. Mainland License:
- Full commercial rights within the UAE
- Requires local sponsor (51% ownership)
- No restrictions on business activities

2. Free Zone License:
- 100% foreign ownership
- Tax benefits and exemptions
- Limited to free zone and international trade

3. Offshore License:
- International business operations only
- No physical office required
- Tax-neutral structure`;
      }

      if (lowerQuestion.includes('revenue') || lowerQuestion.includes('threshold')) {
        return `Revenue thresholds for tax registration:

1. VAT Registration:
- Mandatory: Over AED 375,000
- Voluntary: AED 187,500 - 375,000
- Below AED 187,500: Not eligible

2. Corporate Income Tax:
- 0% tax rate: Up to AED 375,000
- 9% tax rate: Over AED 375,000
- Special rates for free zones`;
      }
    }

    if (path.includes('/filing')) {
      if (lowerQuestion.includes('vat')) {
        return `VAT in the UAE:

1. Standard rate: 5%
2. Zero-rated supplies:
   - Exports
   - Healthcare
   - Education
   - Investment precious metals
3. Exempt supplies:
   - Financial services
   - Local passenger transport
   - Residential property`;
      }

      if (lowerQuestion.includes('cit') || lowerQuestion.includes('corporate')) {
        return `Corporate Income Tax (CIT):

1. Tax rates:
   - 0% for taxable income up to AED 375,000
   - 9% for taxable income above AED 375,000
2. Qualifying free zone businesses:
   - 0% on qualifying income
   - 9% on non-qualifying income
3. Filing requirements:
   - Annual return
   - Audited financial statements
   - Transfer pricing documentation`;
      }
    }

    // Default dashboard-related responses
    if (lowerQuestion.includes('compliance')) {
      return `Key compliance requirements:

1. Record keeping:
   - Maintain records for 5 years
   - Keep original invoices and receipts
   - Document all transactions

2. Filing deadlines:
   - VAT: Monthly/Quarterly
   - CIT: Annually
   - Penalties for late submission

3. Documentation:
   - Tax registration certificates
   - License documents
   - Bank statements`;
    }

    return `I can help you with:
• Understanding license types and requirements
• Tax thresholds and calculations
• Filing requirements and deadlines
• Compliance guidelines

Feel free to ask about any of these topics!`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pageTips = getPageTips();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-indigo-500" />
            <h2 className="ml-2 text-lg font-medium text-gray-900">Tax Assistant</h2>
          </div>
        </div>

        {/* Chat Area */}
        <PermissionGate
          resource="assistant"
          requiredPermission="view"
          restrictedTo="Tax Agent or Admin"
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">
                    {message.content}
                  </pre>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 px-4 py-4">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about tax regulations, calculations, or filing requirements..."
                className="flex-1 min-w-0 rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!input.trim() || isLoading}
                icon={<PaperAirplaneIcon className="h-4 w-4" />}
              >
                Send
              </Button>
            </form>
          </div>
        </PermissionGate>

        {/* Quick Tips */}
        <PermissionGate
          resource="assistant"
          requiredPermission="view"
          restrictedTo="SME or Tax Agent"
        >
          <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Tips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getPageTips().map((tip, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center mb-2">
                    {tip.icon}
                    <h4 className="ml-2 text-sm font-medium text-gray-900">
                      {tip.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {tip.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </PermissionGate>
      </Card>

      {isLoading && <LoadingOverlay isLoading={isLoading} text="Getting response..." />}
    </div>
  );
};

export default Assistant; 