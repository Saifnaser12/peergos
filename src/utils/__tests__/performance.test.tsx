import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Performance, measurePerformance, withPerformanceTracking } from '../performance';

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    Performance.clearMetrics();
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  describe('Basic Monitoring', () => {
    it('records and retrieves metrics', () => {
      const startTime = Performance.startMeasure('TestComponent', 'render');
      jest.advanceTimersByTime(100); // Simulate 100ms of work
      Performance.endMeasure('TestComponent', 'render', startTime);

      const metrics = Performance.getMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0]).toMatchObject({
        componentName: 'TestComponent',
        operation: 'render'
      });
      expect(metrics[0].duration).toBeGreaterThan(0);
    });

    it('maintains maximum metrics limit', () => {
      // Add more than maxMetrics entries
      for (let i = 0; i < 1100; i++) {
        const startTime = Performance.startMeasure(`Component${i}`, 'test');
        Performance.endMeasure(`Component${i}`, 'test', startTime);
      }

      const metrics = Performance.getMetrics();
      expect(metrics.length).toBe(1000); // maxMetrics is 1000
      expect(metrics[metrics.length - 1].componentName).toBe('Component1099');
    });

    it('calculates average metrics correctly', () => {
      // Add multiple metrics for the same component/operation
      for (let i = 0; i < 3; i++) {
        const startTime = Performance.startMeasure('TestComponent', 'render');
        jest.advanceTimersByTime(100); // Each operation takes 100ms
        Performance.endMeasure('TestComponent', 'render', startTime);
      }

      const averages = Performance.getAverageMetrics();
      expect(averages['TestComponent-render']).toBeCloseTo(100, 0);
    });

    it('clears metrics correctly', () => {
      const startTime = Performance.startMeasure('TestComponent', 'render');
      Performance.endMeasure('TestComponent', 'render', startTime);
      
      Performance.clearMetrics();
      expect(Performance.getMetrics()).toHaveLength(0);
    });
  });

  describe('Performance Decorator', () => {
    class TestClass {
      @measurePerformance()
      async asyncMethod() {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'result';
      }

      @measurePerformance()
      syncMethod() {
        return 'result';
      }
    }

    it('measures synchronous methods', () => {
      const instance = new TestClass();
      instance.syncMethod();

      const metrics = Performance.getMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0].componentName).toBe('TestClass');
      expect(metrics[0].operation).toBe('syncMethod');
    });

    it('measures asynchronous methods', async () => {
      const instance = new TestClass();
      await instance.asyncMethod();

      const metrics = Performance.getMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0].componentName).toBe('TestClass');
      expect(metrics[0].operation).toBe('asyncMethod');
      expect(metrics[0].duration).toBeGreaterThanOrEqual(100);
    });
  });

  describe('React Component HOC', () => {
    interface TestComponentProps {
      text: string;
    }

    const TestComponent: React.FC<TestComponentProps> = ({ text }) => <div>{text}</div>;
    const WrappedComponent = withPerformanceTracking(TestComponent, 'TestComponent');

    it('tracks component lifecycle', () => {
      const { rerender, unmount } = render(<WrappedComponent text="test" />);

      // Check mount metrics
      let metrics = Performance.getMetrics();
      expect(metrics).toHaveLength(2); // mount + render
      expect(metrics.some(m => m.operation === 'mount')).toBe(true);
      expect(metrics.some(m => m.operation === 'render')).toBe(true);

      // Trigger update
      rerender(<WrappedComponent text="updated" />);
      metrics = Performance.getMetrics();
      expect(metrics.some(m => m.operation === 'update')).toBe(true);

      // Unmount
      unmount();
      metrics = Performance.getMetrics();
      expect(metrics.some(m => m.operation === 'unmount')).toBe(true);
    });

    it('preserves component props and functionality', () => {
      const { container } = render(<WrappedComponent text="test" />);
      expect(container).toHaveTextContent('test');
    });
  });
}); 