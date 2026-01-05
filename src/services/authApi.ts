export const checkIdentifierExists = async (identifier: string): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock logic: 
  // "test@example.com" or numbers ending in "00" exist.
  // Everything else is new.
  if (identifier.toLowerCase() === 'test@example.com' || identifier.endsWith('00')) {
    return true;
  }
  return false;
};

export const requestOtp = async (identifier: string): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true };
};

export const verifyOtp = async (identifier: string, code: string): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Mock: Code "1234" is valid
  if (code === '1234') {
    return { success: true };
  }
  return { success: false };
};

// Password Reset Flow
export const requestPasswordReset = async (email: string): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Always succeed for mock
  return { success: true };
};

export const verifyResetCode = async (email: string, code: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  // Mock: Code "0000" is valid for password reset
  return code === '0000';
};

export const resetPassword = async (email: string, code: string, newPassword: string): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Mock: Always succeed if code was previously verified
  return { success: true };
};
