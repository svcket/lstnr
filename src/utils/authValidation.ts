// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (basic - minimum 5 digits)
export const isValidPhone = (phone: string): boolean => {
  return phone.length >= 5 && /^\d+$/.test(phone);
};

// Password strength rules
export interface PasswordValidation {
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  hasLength: boolean;
}

export const validatePassword = (password: string): PasswordValidation => {
  return {
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasLength: password.length >= 8,
  };
};

export const isPasswordStrong = (password: string): boolean => {
  const v = validatePassword(password);
  return v.hasUpper && v.hasLower && v.hasNumber && v.hasSpecial && v.hasLength;
};

// Identifier routing logic
export type AuthRoute = 'login' | 'signup';

export const getAuthRoute = (userExists: boolean): AuthRoute => {
  return userExists ? 'login' : 'signup';
};

// Get validation error message (returns empty string if valid)
export const getIdentifierError = (
  identifier: string,
  method: 'email' | 'whatsapp'
): string => {
  if (!identifier) {
    return 'Please enter your identifier';
  }
  
  if (method === 'email') {
    if (!isValidEmail(identifier)) {
      return 'Enter a valid email address like name@email.com';
    }
  } else {
    if (!isValidPhone(identifier)) {
      return 'Enter a valid phone number';
    }
  }
  
  return '';
};
