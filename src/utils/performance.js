import React from 'react';
class PerformanceMonitor {
    constructor() {
        Object.defineProperty(this, "metrics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "maxMetrics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        });
    }
    static getInstance() {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }
    startMeasure(componentName, operation) {
        return performance.now();
    }
    endMeasure(componentName, operation, startTime) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        const metric = {
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
    getMetrics() {
        return [...this.metrics];
    }
    getAverageMetrics() {
        const averages = {};
        this.metrics.forEach(metric => {
            const key = `${metric.componentName}-${metric.operation}`;
            if (!averages[key]) {
                averages[key] = { total: 0, count: 0 };
            }
            averages[key].total += metric.duration;
            averages[key].count += 1;
        });
        return Object.entries(averages).reduce((acc, [key, { total, count }]) => {
            acc[key] = total / count;
            return acc;
        }, {});
    }
    clearMetrics() {
        this.metrics = [];
    }
}
// Performance monitoring decorator
export function measurePerformance() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const monitor = PerformanceMonitor.getInstance();
            const startTime = monitor.startMeasure(target.constructor.name, propertyKey);
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
export function withPerformanceTracking(WrappedComponent) {
    const componentName = WrappedComponent.displayName || WrappedComponent.name;
    const WithPerformance = (props) => {
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
export const measurePerformance = (callback) => {
    const start = performance.now();
    callback();
    const end = performance.now();
    return end - start;
};
export const logPerformance = (metric, duration) => {
    console.log(`Performance [${metric}]: ${duration.toFixed(2)}ms`);
};
