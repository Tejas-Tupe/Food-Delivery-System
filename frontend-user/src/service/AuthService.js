import api_routes from '../util/APIConfig';

/**
 * Sends registration payload to backend API.
 * @param {Object} accountData - The user credentials { name, email, password }
 * @returns {Promise<Object>} Resolves with the response data if successful
 */
export const registerAccount = async (accountData) => {
  const response = await fetch(api_routes.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(accountData),
  });

  if (response.ok) {
    return response.json().catch(() => ({ success: true }));
  }

  const errorData = await response.json().catch(() => ({}));
  const fallbackMessage = response.status === 409
    ? 'This email address is already in use.'
    : 'Registration failed. Please try again.';

  throw new Error(errorData.message || fallbackMessage);
};

/**
 * Authenticates user credentials with the backend API.
 * @param {Object} credentials - User login payload { email, password }
 * @returns {Promise<Object>} Resolves with data containing JWT token
 */
export const loginAccount = async (credentials) => {
  const response = await fetch(api_routes.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password
    }),
  });

  if (response.ok) {
    return response.json();
  }

  const errorData = await response.json().catch(() => ({}));
  const fallbackMessage = 'Invalid email or password.';
  throw new Error(errorData.reason || errorData.message || fallbackMessage);
};