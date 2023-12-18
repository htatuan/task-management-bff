import { mock_forgot_password_token } from 'src/auth/test/mocks/tokens.mock';

export const sendMailStub = () => {
  return {
    email: 'admin@example.com',
    subject: 'Reset your password!',
    template: './forgot-password',
    name: 'admin',
    activationCode: `http://localhost:3001/reset-password?verify=${mock_forgot_password_token}`,
  };
};
export const resetPasswordUrlStub = () => {
  return `http://localhost:3001/reset-password?verify=${mock_forgot_password_token}`;
};
