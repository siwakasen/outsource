import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod schema for password validation
const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function PasswordValidationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange'
  });

  // Watch form values for real-time validation logging
  const watchedValues = watch();

  // Function to log validation results
  const logValidation = (data: any) => {
    console.log('=== ZOD VALIDATION LOG ===');
    console.log('Form Data:', data);
    
    // Test validation manually for detailed logging
    const result = passwordSchema.safeParse(data);
    
    if (result.success) {
      console.log('✅ Validation: SUCCESS');
      console.log('Valid Data:', result.data);
    } else {
      console.log('❌ Validation: FAILED');
      console.log('Errors:', result.error.errors);
      
      // Log detailed error information
      result.error.errors.forEach((error, index) => {
        console.log(`Error ${index + 1}:`, {
          path: error.path,
          message: error.message,
          code: error.code
        });
      });
    }
    console.log('========================');
  };

  const onSubmit = (data: PasswordFormData) => {
    logValidation(data);
    alert('Form submitted! Check console for validation logs.');
  };

  // Log validation on every change
  React.useEffect(() => {
    if (watchedValues.password || watchedValues.confirmPassword) {
      logValidation(watchedValues);
    }
  }, [watchedValues]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Password Validation Demo
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Submit
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold text-sm text-gray-700 mb-2">Validation Rules:</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• At least 8 characters</li>
          <li>• One uppercase letter</li>
          <li>• One lowercase letter</li>
          <li>• One number</li>
          <li>• One special character</li>
          <li>• Passwords must match</li>
        </ul>
        <p className="text-xs text-blue-600 mt-2">
          Open browser console to see validation logs
        </p>
      </div>
    </div>
  );
}
