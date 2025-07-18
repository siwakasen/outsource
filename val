import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Check, X } from 'lucide-react';

const passwordSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z
    .string()
    .min(1, "Confirm password is required")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function PasswordForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange'
  });

  const password = watch('password') || '';
  const confirmPassword = watch('confirmPassword') || '';

  // Validation checks
  const validations = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    passwordsMatch: password === confirmPassword && confirmPassword.length > 0,
    bothNotEmpty: password.length > 0 && confirmPassword.length > 0
  };

  const onSubmit = async (data: PasswordFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', { password: data.password });
    alert('Password created successfully!');
    reset();
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Create Password
      </h2>
      
      <div className="space-y-4">
        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Validation Requirements */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Password requirements:</p>
          
          {/* Min 8 characters */}
          <div className={`flex items-center space-x-2 p-2 rounded-md ${
            validations.minLength ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {validations.minLength ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            <span className="text-sm">At least 8 characters</span>
          </div>

          {/* Has uppercase */}
          <div className={`flex items-center space-x-2 p-2 rounded-md ${
            validations.hasUppercase ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {validations.hasUppercase ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            <span className="text-sm">At least one uppercase letter</span>
          </div>

          {/* Has lowercase */}
          <div className={`flex items-center space-x-2 p-2 rounded-md ${
            validations.hasLowercase ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {validations.hasLowercase ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            <span className="text-sm">At least one lowercase letter</span>
          </div>

          {/* Has number */}
          <div className={`flex items-center space-x-2 p-2 rounded-md ${
            validations.hasNumber ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {validations.hasNumber ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            <span className="text-sm">At least one number</span>
          </div>

          {/* Passwords match */}
          <div className={`flex items-center space-x-2 p-2 rounded-md ${
            validations.passwordsMatch ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {validations.passwordsMatch ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            <span className="text-sm">Passwords match</span>
          </div>

          {/* Both not empty */}
          <div className={`flex items-center space-x-2 p-2 rounded-md ${
            validations.bothNotEmpty ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {validations.bothNotEmpty ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            <span className="text-sm">Both fields are not empty</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Creating...' : 'Create Password'}
        </button>
      </div>
    </div>
  );
}
