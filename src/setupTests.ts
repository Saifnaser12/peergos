import '@testing-library/jest-dom';

// Enable experimental decorators for TypeScript
require('reflect-metadata');

// Configure Jest DOM matchers
expect.extend({
  toHaveTextContent(received: HTMLElement, text: string) {
    const hasText = (received.textContent || '').includes(text);
    return {
      message: () =>
        `expected element ${hasText ? 'not ' : ''}to have text content "${text}"`,
      pass: hasText,
    };
  },
}); 