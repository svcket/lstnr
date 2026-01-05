import {
  isValidEmail,
  isValidPhone,
  validatePassword,
  isPasswordStrong,
  getAuthRoute,
  getIdentifierError,
} from '../utils/authValidation';

describe('Email Validation', () => {
  it('accepts valid email formats', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
    expect(isValidEmail('name+tag@gmail.com')).toBe(true);
  });

  it('rejects invalid email formats', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('missing@domain')).toBe(false);
    expect(isValidEmail('@nodomain.com')).toBe(false);
    expect(isValidEmail('spaces here@test.com')).toBe(false);
  });
});

describe('Phone Validation', () => {
  it('accepts valid phone numbers', () => {
    expect(isValidPhone('12345')).toBe(true);
    expect(isValidPhone('8001234567')).toBe(true);
  });

  it('rejects invalid phone numbers', () => {
    expect(isValidPhone('')).toBe(false);
    expect(isValidPhone('1234')).toBe(false); // Too short
    expect(isValidPhone('abc12345')).toBe(false); // Contains letters
  });
});

describe('Password Strength Rules', () => {
  it('detects uppercase requirement', () => {
    expect(validatePassword('ABC').hasUpper).toBe(true);
    expect(validatePassword('abc').hasUpper).toBe(false);
  });

  it('detects lowercase requirement', () => {
    expect(validatePassword('abc').hasLower).toBe(true);
    expect(validatePassword('ABC').hasLower).toBe(false);
  });

  it('detects number requirement', () => {
    expect(validatePassword('abc123').hasNumber).toBe(true);
    expect(validatePassword('abcdef').hasNumber).toBe(false);
  });

  it('detects special character requirement', () => {
    expect(validatePassword('abc!').hasSpecial).toBe(true);
    expect(validatePassword('abc123').hasSpecial).toBe(false);
  });

  it('detects minimum length requirement', () => {
    expect(validatePassword('12345678').hasLength).toBe(true);
    expect(validatePassword('1234567').hasLength).toBe(false);
  });

  it('validates strong password correctly', () => {
    expect(isPasswordStrong('Abc123!@')).toBe(true);
    expect(isPasswordStrong('Abc123!@#xyz')).toBe(true);
  });

  it('rejects weak passwords', () => {
    expect(isPasswordStrong('password')).toBe(false); // No upper, number, special
    expect(isPasswordStrong('Password1')).toBe(false); // No special
    expect(isPasswordStrong('Pass1!')).toBe(false); // Too short
  });
});

describe('Identifier Routing Logic', () => {
  it('routes to login when user exists', () => {
    expect(getAuthRoute(true)).toBe('login');
  });

  it('routes to signup when user does not exist', () => {
    expect(getAuthRoute(false)).toBe('signup');
  });
});

describe('Identifier Error Messages', () => {
  it('returns error for empty identifier', () => {
    expect(getIdentifierError('', 'email')).toBe('Please enter your identifier');
    expect(getIdentifierError('', 'whatsapp')).toBe('Please enter your identifier');
  });

  it('returns error for invalid email', () => {
    expect(getIdentifierError('notanemail', 'email')).toBe(
      'Enter a valid email address like name@email.com'
    );
  });

  it('returns empty string for valid email', () => {
    expect(getIdentifierError('user@example.com', 'email')).toBe('');
  });

  it('returns error for invalid phone', () => {
    expect(getIdentifierError('123', 'whatsapp')).toBe('Enter a valid phone number');
  });

  it('returns empty string for valid phone', () => {
    expect(getIdentifierError('8001234567', 'whatsapp')).toBe('');
  });
});
