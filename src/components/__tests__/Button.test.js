import { jsx as _jsx } from "react/jsx-runtime";
/// <reference types="jest" />
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';
describe('Button', () => {
    it('renders with default props', () => {
        render(_jsx(Button, { children: "Click me" }));
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });
    it('handles click events', () => {
        const handleClick = jest.fn();
        render(_jsx(Button, { onClick: handleClick, children: "Click me" }));
        fireEvent.click(screen.getByText('Click me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
    it('can be disabled', () => {
        render(_jsx(Button, { disabled: true, children: "Click me" }));
        expect(screen.getByText('Click me')).toBeDisabled();
    });
    it('renders with different variants', () => {
        const { rerender } = render(_jsx(Button, { variant: "primary", children: "Primary" }));
        expect(screen.getByText('Primary')).toHaveClass('bg-indigo-600');
        rerender(_jsx(Button, { variant: "secondary", children: "Secondary" }));
        expect(screen.getByText('Secondary')).toHaveClass('bg-gray-600');
        rerender(_jsx(Button, { variant: "danger", children: "Danger" }));
        expect(screen.getByText('Danger')).toHaveClass('bg-red-600');
    });
    it('renders with different sizes', () => {
        const { rerender } = render(_jsx(Button, { size: "sm", children: "Small" }));
        expect(screen.getByText('Small')).toHaveClass('px-2', 'py-1', 'text-sm');
        rerender(_jsx(Button, { size: "md", children: "Medium" }));
        expect(screen.getByText('Medium')).toHaveClass('px-4', 'py-2', 'text-base');
        rerender(_jsx(Button, { size: "lg", children: "Large" }));
        expect(screen.getByText('Large')).toHaveClass('px-6', 'py-3', 'text-lg');
    });
    it('renders with custom className', () => {
        render(_jsx(Button, { className: "custom-class", children: "Custom" }));
        expect(screen.getByText('Custom')).toHaveClass('custom-class');
    });
    it('forwards ref correctly', () => {
        const ref = React.createRef();
        render(_jsx(Button, { ref: ref, children: "Ref Button" }));
        expect(ref.current).toBeInTheDocument();
    });
});
