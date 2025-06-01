import React, { useState, useRef, useEffect } from 'react';
import { useTax, calculateCIT } from '../context/TaxContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Assistant: React.FC = () => {
  const { state } = useTax();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your tax assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (question: string): string => {
    const totalRevenue = state.revenues.reduce((sum, entry) => sum + entry.amount, 0);
    const netIncome = totalRevenue - state.expenses.reduce((sum, entry) => sum + entry.amount, 0);
    const citAmount = calculateCIT(netIncome);
    
    // Convert question to lowercase for easier matching
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('vat') || lowerQuestion.includes('value added tax')) {
      if (totalRevenue > 375000) {
        return `Based on your current revenue of AED ${totalRevenue.toLocaleString()}, which exceeds the VAT threshold of AED 375,000, you are required to register for VAT. You should register within 30 days of exceeding the threshold.`;
      }
      return `Your current revenue is AED ${totalRevenue.toLocaleString()}, which is below the VAT threshold of AED 375,000. VAT registration is not mandatory at this time, but you can still register voluntarily.`;
    }

    if (lowerQuestion.includes('cit') || lowerQuestion.includes('corporate') || lowerQuestion.includes('income tax')) {
      if (netIncome <= 375000) {
        return `Based on your net income of AED ${netIncome.toLocaleString()}, you are in the 0% CIT bracket. No Corporate Income Tax is due.`;
      }
      return `Based on your net income of AED ${netIncome.toLocaleString()}, your estimated Corporate Income Tax (CIT) is AED ${citAmount.toLocaleString()}. This is calculated at 9% on taxable income exceeding AED 375,000.`;
    }

    if (lowerQuestion.includes('document') || lowerQuestion.includes('submit')) {
      return `For tax compliance, you should maintain and be ready to submit:
1. Financial statements (balance sheet, income statement)
2. Bank statements
3. Sales and purchase invoices
4. VAT returns (if registered)
5. Business license and registration documents
6. Proof of expenses and tax-deductible items`;
    }

    return `I'm not sure about that specific question. However, I can help you with:
• VAT registration requirements
• Corporate Income Tax calculations
• Required documentation
• General tax compliance guidance

Feel free to ask about any of these topics!`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    // Generate and add assistant response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: generateResponse(input),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg min-h-[600px] flex flex-col">
        {/* Chat header */}
        <div className="px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Tax Assistant</h2>
          <p className="text-sm text-gray-500">Ask me anything about your tax obligations</p>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-indigo-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about VAT, CIT, or required documents..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Example questions */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Example questions you can ask:</h3>
        <div className="space-y-2">
          <button
            onClick={() => setInput('Do I need to register for VAT?')}
            className="block text-left text-sm text-indigo-600 hover:text-indigo-800"
          >
            • Do I need to register for VAT?
          </button>
          <button
            onClick={() => setInput('How much Corporate Income Tax do I owe?')}
            className="block text-left text-sm text-indigo-600 hover:text-indigo-800"
          >
            • How much Corporate Income Tax do I owe?
          </button>
          <button
            onClick={() => setInput('What documents should I submit for tax compliance?')}
            className="block text-left text-sm text-indigo-600 hover:text-indigo-800"
          >
            • What documents should I submit for tax compliance?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant; 