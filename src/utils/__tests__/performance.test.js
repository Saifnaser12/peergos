var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
            async asyncMethod() {
                await new Promise(resolve => setTimeout(resolve, 100));
                return 'result';
            }
            syncMethod() {
                return 'result';
            }
        }
        __decorate([
            measurePerformance(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", Promise)
        ], TestClass.prototype, "asyncMethod", null);
        __decorate([
            measurePerformance(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", String)
        ], TestClass.prototype, "syncMethod", null);
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
        const TestComponent = ({ text }) => {
            return React.createElement('div', null, text);
        };
        TestComponent.displayName = 'TestComponent';
        const WrappedComponent = withPerformanceTracking(TestComponent);
        it('tracks component lifecycle', () => {
            const { rerender, unmount } = render(React.createElement(WrappedComponent, { text: 'test' }));
            // Check mount metrics
            let metrics = Performance.getMetrics();
            expect(metrics).toHaveLength(2); // mount + render
            expect(metrics.some(m => m.operation === 'mount')).toBe(true);
            expect(metrics.some(m => m.operation === 'render')).toBe(true);
            // Trigger update
            rerender(React.createElement(WrappedComponent, { text: 'updated' }));
            metrics = Performance.getMetrics();
            expect(metrics.some(m => m.operation === 'update')).toBe(true);
            // Unmount
            unmount();
            metrics = Performance.getMetrics();
            expect(metrics.some(m => m.operation === 'unmount')).toBe(true);
        });
        it('preserves component props and functionality', () => {
            const { container } = render(React.createElement(WrappedComponent, { text: 'test' }));
            expect(container).toHaveTextContent('test');
        });
    });
});
