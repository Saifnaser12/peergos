import React from 'react';
import type { ComponentType, FunctionComponent } from 'react';

interface PerformanceMetric {
  componentName: string;
  operation: string;
  startTime: number;
  endTime: number;
  duration: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 1000;

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public startMeasure(componentName: string, operation: string): number {
    return performance.now();
  }

  public endMeasure(componentName: string, operation: string, startTime: number): void {
    const endTime = performance.now();
    const duration = endTime - startTime;

    const metric: PerformanceMetric = {
      componentName,
      operation,
      startTime,
      endTime,
      duration
    };

    this.metrics.push(metric);

    // Keep only the last maxMetrics entries
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow operations (> 16ms, which is roughly 60fps)
    if (duration > 16) {
      console.warn(`Slow operation detected: ${componentName} - ${operation} took ${duration.toFixed(2)}ms`);
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getAverageMetrics(): Record<string, number> {
    const averages: Record<string, { total: number; count: number }> = {};

    this.metrics.forEach(metric => {
      const key = `${metric.componentName}-${metric.operation}`;
      if (!averages[key]) {
        averages[key] = { total: 0, count: 0 };
      }
      averages[key].total += metric.duration;
      averages[key].count += 1;
    });

    return Object.entries(averages).reduce<Record<string, number>>((acc, [key, { total, count }]) => {
      acc[key] = total / count;
      return acc;
    }, {});
  }

  public clearMetrics(): void {
    this.metrics = [];
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

    descriptor.value = function (...args: unknown[]): unknown {
      const monitor = PerformanceMonitor.getInstance();
      const startTime = monitor.startMeasure(
        target.constructor.name,
        propertyKey
      );

      const result = originalMethod.apply(this, args);

      // Handle both synchronous and asynchronous functions
      if (result instanceof Promise) {
        return result.finally(() => {
          monitor.endMeasure(target.constructor.name, propertyKey, startTime);
        });
      }

      monitor.endMeasure(target.constructor.name, propertyKey, startTime);
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
  
  const WithPerformance: FunctionComponent<P> = (props) => {
    const monitor = PerformanceMonitor.getInstance();
    const startTimeRef = React.useRef(0);

    React.useEffect(() => {
      monitor.endMeasure(componentName, 'mount', startTimeRef.current);
      return () => {
        monitor.endMeasure(componentName, 'unmount', startTimeRef.current);
      };
    }, []);

    React.useEffect(() => {
      monitor.endMeasure(componentName, 'update', startTimeRef.current);
    });

    startTimeRef.current = monitor.startMeasure(componentName, 'render');
    return React.createElement(WrappedComponent, props);
  };

  WithPerformance.displayName = `WithPerformanceTracking(${componentName})`;
  return WithPerformance;
}

export const Performance = PerformanceMonitor.getInstance(); 