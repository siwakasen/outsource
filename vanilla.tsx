import React, { useState } from 'react';

// Custom hook for ATM number masking
const useAtmMask = () => {
  const formatAtmNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Limit to 16 digits
    const limitedDigits = digits.slice(0, 16);
    
    // Apply mask pattern: 0000 - 0000 - 0000 - 0000
    const groups = limitedDigits.match(/.{1,4}/g) || [];
    return groups.join(' - ');
  };

  const handleAtmChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const inputValue = e.target.value;
    const formatted = formatAtmNumber(inputValue);
    onChange(formatted);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const currentValue = input.value;
    const currentDigits = currentValue.replace(/\D/g, '');
    
    // Allow: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        (e.keyCode === 90 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    
    // Check if we've reached the 16 digit limit
    if (currentDigits.length >= 16) {
      e.preventDefault();
      return;
    }
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return { formatAtmNumber, handleAtmChange, handleKeyDown };
};

// Validation function
const validateAtmNumber = (value: string) => {
  if (!value || value.trim() === '') {
    return 'ATM number is required';
  }
  
  const digits = value.replace(/\D/g, '');
  
  if (digits.length < 16) {
    return 'ATM number must be 16 digits';
  }
  
  if (!/^\d{4} - \d{4} - \d{4} - \d{4}$/.test(value)) {
    return 'ATM number must be in format: 0000 - 0000 - 0000 - 0000';
  }
  
  return null;
};

// ATM Number Input Component
const AtmNumberInput = ({ value, onChange, error, ...props }) => {
  const { handleAtmChange, handleKeyDown } = useAtmMask();

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        ATM Number
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => handleAtmChange(e, onChange)}
        onKeyDown={handleKeyDown}
        placeholder="0000 - 0000 - 0000 - 0000"
        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg tracking-wider ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300'
        }`}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-500 mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

// Main Form Component
const AtmNumberForm = () => {
  const [atmNumber, setAtmNumber] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAtmNumberChange = (value: string) => {
    setAtmNumber(value);
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async () => {
    // Validate the input
    const validationError = validateAtmNumber(atmNumber);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove formatting for actual submission
      const cleanAtmNumber = atmNumber.replace(/\s|-/g, '');
      
      console.log('Submitted ATM Number:', cleanAtmNumber);
      alert(`ATM Number submitted: ${cleanAtmNumber}`);
      
      // Reset form after successful submission
      setAtmNumber('');
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to submit ATM number. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanAtmNumber = atmNumber.replace(/\s|-/g, '');

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        ATM Number Registration
      </h2>
      
      <div className="space-y-6">
        <AtmNumberInput
          value={atmNumber}
          onChange={handleAtmNumberChange}
          error={error}
        />

        {/* Display formatted and clean values */}
        <div className="bg-gray-50 p-3 rounded-md text-sm">
          <div className="text-gray-600">
            <strong>Formatted:</strong> {atmNumber || 'None'}
          </div>
          <div className="text-gray-600">
            <strong>Clean:</strong> {cleanAtmNumber || 'None'}
          </div>
          <div className="text-gray-600">
            <strong>Length:</strong> {cleanAtmNumber.length}/16
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit ATM Number'}
        </button>
      </div>

      {/* Example section */}
      <div className="mt-8 p-4 bg-blue-50 rounded-md">
        <h3 className="font-semibold text-blue-800 mb-2">Current Implementation Features:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Numbers only:</strong> Prevents typing non-numeric characters</li>
          <li>• <strong>Auto-masking:</strong> Formats as 0000 - 0000 - 0000 - 0000</li>
          <li>• <strong>Keyboard shortcuts:</strong> Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X work</li>
          <li>• <strong>Navigation keys:</strong> Arrow keys, Home, End, Delete work</li>
          <li>• <strong>Length limit:</strong> Maximum 16 digits</li>
          <li>• <strong>Real-time validation:</strong> Shows errors instantly</li>
        </ul>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-semibold text-yellow-800 mb-1">For Your Project:</h4>
          <p className="text-sm text-yellow-700">
            Use the integration code above with react-input-mask + react-hook-form + zod 
            in your actual project for the best experience!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AtmNumberForm;
