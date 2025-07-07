/**
 * Validates if an email address is from an allowed domain
 * @param email - The email address to validate
 * @param allowedDomains - Array of allowed domain suffixes
 * @returns boolean - True if email is from allowed domain
 */
export const isValidEmailDomain = (email: string, allowedDomains: string[] = ['.mes.ac.in']): boolean => {
  if (!email) return false;
  
  return allowedDomains.some(domain => email.endsWith(domain));
};

/**
 * Gets the domain from an email address
 * @param email - The email address
 * @returns string - The domain part of the email
 */
export const getEmailDomain = (email: string): string => {
  if (!email || !email.includes('@')) return '';
  return email.split('@')[1];
};

/**
 * Checks if an email is specifically from MES Academy
 * @param email - The email address to check
 * @returns boolean - True if email is from MES Academy
 */
export const isMESEmail = (email: string): boolean => {
  return isValidEmailDomain(email, ['.mes.ac.in']);
}; 