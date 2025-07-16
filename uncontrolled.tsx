import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod schema for ATM number validation
const atmSchema = z.object({
  atmNumber: z
    .string()
    .min(1, "ATM number should not be empty")
    .refine(
      (value) => value.replace(/\s|-/g, '').length >= 15,
      "ATM number must be at least 15 characters"
    )
    .refine(
      (value) => /^\d{4}\s-\s\d{4}\s-\s\d{4}\s-\s\d{4}$/.test(value),
      "ATM number must be in format: 0000 - 0000 - 0000 - 0000"
    )
});

type AtmFormData = z.infer<typeof atmSchema>;

// Auto-masking function
const formatAtmNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Limit to 16 digits
  const limitedDigits = digits.slice(0, 16);
  
  // Apply formatting
  if (limitedDigits.length <= 4) {
    return limitedDigits;
  } else if (limitedDigits.length <= 8) {
    return `${limitedDigits.slice(0, 4)} - ${limitedDigits.slice(4)}`;
  } else if (limitedDigits.length <= 12) {
    return `${limitedDigits.slice(0, 4)} - ${limitedDigits.slice(4, 8)} - ${limitedDigits.slice(8)}`;
  } else {
    return `${limitedDigits.slice(0, 4)} - ${limitedDigits.slice(4, 8)} - ${limitedDigits.slice(8, 12)} - ${limitedDigits.slice(12)}`;
  }
};

const AtmNumberForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<AtmFormData>({
    resolver: zodResolver(atmSchema),
    mode: 'onChange', // Validate on every change
    defaultValues: {
      atmNumber: ''
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatAtmNumber(e.target.value);
    setValue('atmNumber', formattedValue, { shouldValidate: true });
  };

  const onSubmit = (data: AtmFormData) => {
    console.log('Form submitted:', data);
    alert(`ATM Number: ${data.atmNumber}`);
  };

  const atmNumberValue = watch('atmNumber');

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        ATM Number Form
      </h2>
      
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="atmNumber" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            ATM Number
          </label>
          
          <input
            {...register('atmNumber')}
            id="atmNumber"
            type="text"
            placeholder="0000 - 0000 - 0000 - 0000"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg tracking-wider ${
              errors.atmNumber 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300'
            }`}
            onChange={handleInputChange}
            maxLength={22} // "0000 - 0000 - 0000 - 0000" = 22 chars
          />
          
          {errors.atmNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.atmNumber.message}
            </p>
          )}
          
          {/* Character count indicator */}
          <div className="mt-1 text-xs text-gray-500">
            {atmNumberValue ? (
              <span>
                {atmNumberValue.replace(/\s|-/g, '').length}/16 digits
              </span>
            ) : (
              <span>0/16 digits</span>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Submit
        </button>
      </div>

      {/* Debug info */}
      <div className="mt-6 p-3 bg-gray-100 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h3>
        <p className="text-xs text-gray-600">
          Current value: "{atmNumberValue}"
        </p>
        <p className="text-xs text-gray-600">
          Digits only: "{atmNumberValue?.replace(/\s|-/g, '') || ''}"
        </p>
        <p className="text-xs text-gray-600">
          Length: {atmNumberValue?.replace(/\s|-/g, '').length || 0}
        </p>
      </div>
    </div>
  );
};

export default AtmNumberForm;
