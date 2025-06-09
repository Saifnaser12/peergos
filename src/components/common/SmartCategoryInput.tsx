
import React, { useState, useRef, useEffect } from 'react';
import { getSuggestions, categoryConfig } from '../../utils/constants';

interface SmartCategoryInputProps {
  type: 'revenue' | 'expense';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const SmartCategoryInput: React.FC<SmartCategoryInputProps> = ({
  type,
  value,
  onChange,
  placeholder,
  className = '',
  onKeyDown
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const suggestions = getSuggestions(inputValue, type);
  const config = categoryConfig[type];

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(newValue.length >= 2);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleSuggestionClick(suggestions[selectedIndex]);
          } else if (suggestions.length > 0) {
            handleSuggestionClick(suggestions[0]);
          } else {
            onChange(inputValue);
            setShowSuggestions(false);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedIndex(-1);
          break;
        case 'Tab':
          if (selectedIndex >= 0) {
            e.preventDefault();
            handleSuggestionClick(suggestions[selectedIndex]);
          } else if (suggestions.length > 0) {
            e.preventDefault();
            handleSuggestionClick(suggestions[0]);
          }
          break;
      }
    }

    // Pass through to parent handler
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      onChange(inputValue);
    }, 150);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => inputValue.length >= 2 && setShowSuggestions(true)}
        placeholder={placeholder}
        className={`${className} transition-all duration-200`}
        autoComplete="off"
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => {
            const categoryData = config[suggestion as keyof typeof config];
            return (
              <div
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`flex items-center px-3 py-2 cursor-pointer transition-colors duration-150 ${
                  index === selectedIndex
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-lg mr-3">{categoryData.icon}</span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {suggestion.replace(/-/g, ' ')}
                  </span>
                </div>
                <div
                  className="w-3 h-3 rounded-full ml-2"
                  style={{ backgroundColor: categoryData.color }}
                ></div>
              </div>
            );
          })}
          
          {/* Keyboard shortcuts hint */}
          <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">↑↓</kbd> navigate, 
              <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs ml-1">Enter</kbd> select,
              <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs ml-1">Tab</kbd> quick select
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartCategoryInput;
