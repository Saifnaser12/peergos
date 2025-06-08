import React from 'react';
export class PerformanceMonitor {
    constructor() {
        Object.defineProperty(this, "measurements", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.measurements = new Map();
    }
    static getInstance() {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }
    measure(callback) {
        const start = performance.now();
        callback();
        const end = performance.now();
        return end - start;
    }
    log(metric, duration) {
        console.log(`Performance [${metric}]: ${duration.toFixed(2)}ms`);
    }
    measureOperation(operation, callback) {
        const duration = this.measure(callback);
        this.log(operation, duration);
    }
}
// Performance monitoring decorator
export function measurePerformance() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const monitor = PerformanceMonitor.getInstance();
        descriptor.value = function (...args) {
            const result = monitor.measure(() => originalMethod.apply(this, args));
            // Handle both synchronous and asynchronous functions
            if (result && typeof result === 'object' && 'then' in result) {
                return result.finally(() => {
                    monitor.log(`${target.constructor.name}.${propertyKey}`, performance.now());
                });
            }
            return result;
        };
        return descriptor;
    };
}
// React component performance HOC
export function withPerformanceTracking(WrappedComponent) {
    const componentName = WrappedComponent.displayName || WrappedComponent.name;
    const monitor = PerformanceMonitor.getInstance();
    const WithPerformance = (props) => {
        React.useEffect(() => {
            monitor.measureOperation(`${componentName}.mount`, () => { });
            return () => {
                monitor.measureOperation(`${componentName}.unmount`, () => { });
            };
        }, []);
        React.useEffect(() => {
            monitor.measureOperation(`${componentName}.update`, () => { });
        });
        return React.createElement(WrappedComponent, props);
    };
    WithPerformance.displayName = `WithPerformanceTracking(${componentName})`;
    return WithPerformance;
}
export const Performance = PerformanceMonitor.getInstance();
// Helper function to measure performance of async operations
export const measureAsyncPerformance = async (operation, callback) => {
    const start = performance.now();
    try {
        const result = await callback();
        const duration = performance.now() - start;
        Performance.log(operation, duration);
        return result;
    }
    catch (error) {
        const duration = performance.now() - start;
        Performance.log(`${operation} (error)`, duration);
        throw error;
    }
};
