import React from 'react';
import type { ComponentType, FunctionComponent } from 'react';

interface PerformanceMetric {
  componentName: string;
  operation: string;
  startTime: number;
  endTime: number;
  duration: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private measurements: Map<string, number[]>;

  private constructor() {
    this.measurements = new Map();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public measure(callback: () => void): number {
    const start = performance.now();
    callback();
    const end = performance.now();
    return end - start;
  }

  public log(metric: string, duration: number): void {
    console.log(`Performance [${metric}]: ${duration.toFixed(2)}ms`);
  }

  public measureOperation(operation: string, callback: () => void): void {
    const duration = this.measure(callback);
    this.log(operation, duration);
  }
}

// Performance monitoring decorator
export function measurePerformance() {
  return function <T extends object>(
    target: T,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const monitor = PerformanceMonitor.getInstance();

    descriptor.value = function (...args: unknown[]): unknown {
    const start = performance.now();
    const result = originalMethod.apply(this, args);

    // Handle both synchronous and asynchronous functions
    if (result && typeof result === 'object' && 'then' in result) {
      return (result as Promise<unknown>).finally(() => {
        const duration = performance.now() - start;
        monitor.log(`${target.constructor.name}.${propertyKey}`, duration);
      });
    }

    const duration = performance.now() - start;
    monitor.log(`${target.constructor.name}.${propertyKey}`, duration);
    return result;
  };

    return descriptor;
  };
}

// React component performance HOC
export function withPerformanceTracking<P extends object>(
  WrappedComponent: ComponentType<P>
): FunctionComponent<P> {
  const componentName = WrappedComponent.displayName || WrappedComponent.name;
  const monitor = PerformanceMonitor.getInstance();

  const WithPerformance: FunctionComponent<P> = (props) => {
    React.useEffect(() => {
      monitor.measureOperation(`${componentName}.mount`, () => {});
      return () => {
        monitor.measureOperation(`${componentName}.unmount`, () => {});
      };
    }, []);

    React.useEffect(() => {
      monitor.measureOperation(`${componentName}.update`, () => {});
    });

    return React.createElement(WrappedComponent, props);
  };

  WithPerformance.displayName = `WithPerformanceTracking(${componentName})`;
  return WithPerformance;
}

export const Performance = PerformanceMonitor.getInstance();

// Helper function to measure performance of async operations
export const measureAsyncPerformance = async <T>(
  operation: string,
  callback: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await callback();
    const duration = performance.now() - start;
    Performance.log(operation, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    Performance.log(`${operation} (error)`, duration);
    throw error;
  }
};