import React from 'react';

export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: any) => boolean | string;
  message?: string;
};

export type ValidationRules = {
  [key: string]: ValidationRule;
};

export type ValidationErrors = {
  [key: string]: string;
};

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = React.useState<ValidationErrors>({});

  const validateField = (name: string, value: any): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    if (rule.required && !value) {
      return rule.message || 'This field is required';
    }

    if (value) {
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `Minimum length is ${rule.minLength} characters`;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `Maximum length is ${rule.maxLength} characters`;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || 'Invalid format';
      }

      if (rule.validate) {
        const result = rule.validate(value);
        if (typeof result === 'string') {
          return result;
        }
        if (!result) {
          return rule.message || 'Invalid value';
        }
      }
    }

    return null;
  };

  const validateForm = (values: { [key: string]: any }): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach((name) => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const validateFieldOnChange = (name: string, value: any) => {
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error || '',
    }));
  };

  return {
    errors,
    validateForm,
    validateFieldOnChange,
  };
};

// Common validation rules
export const commonValidations = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  phone: {
    pattern: /^\+?[\d\s-]{10,}$/,
    message: 'Please enter a valid phone number',
  },
  url: {
    pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    message: 'Please enter a valid URL',
  },
  number: {
    pattern: /^\d+$/,
    message: 'Please enter a valid number',
  },
  currency: {
    pattern: /^\d+(\.\d{1,2})?$/,
    message: 'Please enter a valid currency amount',
  },
  date: {
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: 'Please enter a valid date (YYYY-MM-DD)',
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
  },
}; 