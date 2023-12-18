import { mock_token, verifiedToken } from './tokens.mock';

export const mockJwtService = {
  sign: jest.fn().mockReturnValue(mock_token),
  verify: jest.fn().mockReturnValue(verifiedToken),
};
