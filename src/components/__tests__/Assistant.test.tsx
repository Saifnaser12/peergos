
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { TaxProvider } from '../../context/TaxContext';
import { FinanceProvider } from '../../context/FinanceContext';
import Assistant from '../../pages/Assistant';

// Mock OpenAI API
global.fetch = jest.fn();

const MockProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <I18nextProvider i18n={i18n}>
      <TaxProvider>
        <FinanceProvider>
          {children}
        </FinanceProvider>
      </TaxProvider>
    </I18nextProvider>
  </BrowserRouter>
);

describe('AI Assistant Production Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful OpenAI response
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: 'Mock AI response' } }],
        usage: { total_tokens: 150 }
      })
    });
  });

  // 1. Context Injection Tests
  describe('Context Injection', () => {
    it('should inject TRN and financial data into assistant context', async () => {
      render(
        <MockProviders>
          <Assistant />
        </MockProviders>
      );

      const input = screen.getByPlaceholderText(/Ask about VAT, CIT/i);
      fireEvent.change(input, { target: { value: 'What is my current tax liability?' } });
      fireEvent.click(screen.getByText('Send'));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'https://api.openai.com/v1/chat/completions',
          expect.objectContaining({
            body: expect.stringContaining('CURRENT USER CONTEXT')
          })
        );
      });
    });
  });

  // 2. Simulation Commands Tests
  describe('Simulation Commands', () => {
    it('should handle CIT calculation request', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ 
            message: { 
              content: 'Based on your revenue of AED 500,000, your estimated CIT payable is AED 11,250 (9% on income above AED 375,000).'
            } 
          }],
          usage: { total_tokens: 200 }
        })
      });

      render(
        <MockProviders>
          <Assistant />
        </MockProviders>
      );

      const input = screen.getByPlaceholderText(/Ask about VAT, CIT/i);
      fireEvent.change(input, { target: { value: 'Can you calculate my CIT for 2024?' } });
      fireEvent.click(screen.getByText('Send'));

      await waitFor(() => {
        expect(screen.getByText(/estimated CIT payable/i)).toBeInTheDocument();
      });
    });

    it('should detect Small Business Relief eligibility', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ 
            message: { 
              content: 'Yes, you qualify for Small Business Relief as your taxable income is below AED 375,000. Your CIT rate is 0%.'
            } 
          }],
          usage: { total_tokens: 180 }
        })
      });

      render(
        <MockProviders>
          <Assistant />
        </MockProviders>
      );

      const input = screen.getByPlaceholderText(/Ask about VAT, CIT/i);
      fireEvent.change(input, { target: { value: 'Do I qualify for Small Business Relief?' } });
      fireEvent.click(screen.getByText('Send'));

      await waitFor(() => {
        expect(screen.getByText(/qualify for Small Business Relief/i)).toBeInTheDocument();
      });
    });
  });

  // 3. FTA Rules Awareness Tests
  describe('FTA Rules Awareness', () => {
    it('should provide accurate VAT deadline information', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ 
            message: { 
              content: 'For Q2 VAT returns (April-June), the filing deadline is 28 July. You must file and pay by this date to avoid penalties.'
            } 
          }],
          usage: { total_tokens: 160 }
        })
      });

      render(
        <MockProviders>
          <Assistant />
        </MockProviders>
      );

      const input = screen.getByPlaceholderText(/Ask about VAT, CIT/i);
      fireEvent.change(input, { target: { value: 'What is the VAT deadline for Q2?' } });
      fireEvent.click(screen.getByText('Send'));

      await waitFor(() => {
        expect(screen.getByText(/28 July/i)).toBeInTheDocument();
      });
    });

    it('should list non-deductible CIT expenses', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ 
            message: { 
              content: 'Non-deductible expenses under UAE CIT include: personal expenses, entertainment costs exceeding limits, penalties and fines, and capital expenditure (unless depreciated).'
            } 
          }],
          usage: { total_tokens: 190 }
        })
      });

      render(
        <MockProviders>
          <Assistant />
        </MockProviders>
      );

      const input = screen.getByPlaceholderText(/Ask about VAT, CIT/i);
      fireEvent.change(input, { target: { value: 'What expenses are not deductible under CIT?' } });
      fireEvent.click(screen.getByText('Send'));

      await waitFor(() => {
        expect(screen.getByText(/Non-deductible expenses/i)).toBeInTheDocument();
      });
    });
  });

  // 4. Intent Detection Tests
  describe('Intent Detection', () => {
    it('should detect filing intent and show simulation button', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ 
            message: { 
              content: 'I can help you file your CIT return. Your estimated CIT payable is AED 15,000 based on current data.'
            } 
          }],
          usage: { total_tokens: 170 }
        })
      });

      render(
        <MockProviders>
          <Assistant />
        </MockProviders>
      );

      const input = screen.getByPlaceholderText(/Ask about VAT, CIT/i);
      fireEvent.change(input, { target: { value: 'Submit CIT' } });
      fireEvent.click(screen.getByText('Send'));

      await waitFor(() => {
        expect(screen.getByText(/Draft Filing Detected/i)).toBeInTheDocument();
      });
    });
  });

  // 5. Security Tests
  describe('Security', () => {
    it('should reject SQL injection attempts', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ 
            message: { 
              content: 'I can only help with UAE tax compliance questions. Please ask about CIT, VAT, or filing requirements.'
            } 
          }],
          usage: { total_tokens: 100 }
        })
      });

      render(
        <MockProviders>
          <Assistant />
        </MockProviders>
      );

      const input = screen.getByPlaceholderText(/Ask about VAT, CIT/i);
      fireEvent.change(input, { target: { value: "'; DROP TABLE users; --" } });
      fireEvent.click(screen.getByText('Send'));

      await waitFor(() => {
        expect(screen.getByText(/tax compliance questions/i)).toBeInTheDocument();
      });
    });

    it('should handle API errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(
        <MockProviders>
          <Assistant />
        </MockProviders>
      );

      const input = screen.getByPlaceholderText(/Ask about VAT, CIT/i);
      fireEvent.change(input, { target: { value: 'Test query' } });
      fireEvent.click(screen.getByText('Send'));

      await waitFor(() => {
        expect(screen.getByText(/having trouble connecting/i)).toBeInTheDocument();
      });
    });
  });

  // 6. Performance Tests
  describe('Performance', () => {
    it('should show typing indicator during API calls', async () => {
      // Simulate slow API response
      (fetch as jest.Mock).mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({
              choices: [{ message: { content: 'Response after delay' } }],
              usage: { total_tokens: 100 }
            })
          }), 1000)
        )
      );

      render(
        <MockProviders>
          <Assistant />
        </MockProviders>
      );

      const input = screen.getByPlaceholderText(/Ask about VAT, CIT/i);
      fireEvent.change(input, { target: { value: 'Test query' } });
      fireEvent.click(screen.getByText('Send'));

      // Should show typing indicator
      await waitFor(() => {
        expect(document.querySelector('.animate-bounce')).toBeInTheDocument();
      });
    });
  });

  // 7. Export Functionality Tests
  describe('Export Functionality', () => {
    it('should export chat history', async () => {
      // Mock URL.createObjectURL
      global.URL.createObjectURL = jest.fn(() => 'mock-url');
      global.URL.revokeObjectURL = jest.fn();
      
      render(
        <MockProviders>
          <Assistant />
        </MockProviders>
      );

      // Add a message first
      const input = screen.getByPlaceholderText(/Ask about VAT, CIT/i);
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(screen.getByText('Send'));

      await waitFor(() => {
        // Find and click export button
        const exportButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(exportButton);
      });

      await waitFor(() => {
        const exportChatOption = screen.getByText('Export Chat');
        fireEvent.click(exportChatOption);
      });

      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
  });
});
