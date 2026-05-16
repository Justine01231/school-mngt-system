import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = ({ invalid = false, className = '', ...props }: InputProps) => {
  return (
    <input
      className={`w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
      {...props}
    />
  );
};
