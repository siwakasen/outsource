// First, install the required packages:
// npm install react-hook-form @hookform/resolvers/zod zod react-input-mask

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InputMask from 'react-input-mask';

// Zod schema for validation
const schema = z.object({
  atmNumber: z
    .string()
    .min(1, 'ATM number is required')
    .regex(/^\d{4} - \d{4} - \d{4} - \d{4}$/, 'ATM number must be in format: 0000 - 0000 - 0000 - 0000')
    .refine((val) => val.replace(/\s|-/g, '').length === 16, 'ATM number must be 16 digits')
});

type FormData = z.infer<typeof schema>;

// Custom ATM Input with react-input-mask
const AtmNumberInput = ({ value, onChange, error, ...props }) => {
  const handleKeyDown = (e) => {
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
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        ATM Number
      </label>
      <InputMask
        mask="9999 - 9999 - 9999 - 9999"
        value={value || ''}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        maskChar={null} // This prevents showing placeholder characters
        {...props}
      >
        {(inputProps) => (
          <input
            {...inputProps}
            type="text"
            placeholder="0000 - 0000 - 0000 - 0000"
            className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg tracking-wider ${
              error 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300'
            }`}
          />
        )}
      </InputMask>
      {error && (
        <span className="text-sm text-red-500 mt-1">
          {error.message}
        </span>
      )}
    </div>
  );
};

// Alternative: Using react-input-mask with beforeMaskedStateChange for more control
const AtmNumberInputAdvanced = ({ value, onChange, error, ...props }) => {
  const beforeMaskedStateChange = ({ nextState }) => {
    const { value } = nextState;
    const digits = value.replace(/\D/g, '');
    
    // Only allow up to 16 digits
    if (digits.length > 16) {
      return {
        ...nextState,
        value: nextState.value.slice(0, -1)
      };
    }
    
    return nextState;
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        ATM Number
      </label>
      <InputMask
        mask="9999 - 9999 - 9999 - 9999"
        value={value || ''}
        onChange={onChange}
        beforeMaskedStateChange={beforeMaskedStateChange}
        maskChar={null}
        {...props}
      >
        {(inputProps) => (
          <input
            {...inputProps}
            type="text"
            placeholder="0000 - 0000 - 0000 - 0000"
            className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg tracking-wider ${
              error 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300'
            }`}
          />
        )}
      </InputMask>
      {error && (
        <span className="text-sm text-red-500 mt-1">
          {error.message}
        </span>
      )}
    </div>
  );
};

// Main Form Component with react-hook-form integration
const AtmNumberForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      atmNumber: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove formatting for actual submission
      const cleanAtmNumber = data.atmNumber.replace(/\s|-/g, '');
      
      console.log('Submitted ATM Number:', cleanAtmNumber);
      alert(`ATM Number submitted: ${cleanAtmNumber}`);
      
      // Reset form after successful submission
      reset();
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const atmValue = watch('atmNumber');

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        ATM Number Registration
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="atmNumber"
          control={control}
          render={({ field }) => (
            <AtmNumberInput
              {...field}
              error={errors.atmNumber}
            />
          )}
        />

        {/* Display formatted and clean values */}
        <div className="bg-gray-50 p-3 rounded-md text-sm">
          <div className="text-gray-600">
            <strong>Formatted:</strong> {atmValue || 'None'}
          </div>
          <div className="text-gray-600">
            <strong>Clean:</strong> {atmValue ? atmValue.replace(/\s|-/g, '') : 'None'}
          </div>
          <div className="text-gray-600">
            <strong>Length:</strong> {atmValue ? atmValue.replace(/\s|-/g, '').length : 0}/16
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit ATM Number'}
        </button>
      </form>
    </div>
  );
};

export default AtmNumberForm;
