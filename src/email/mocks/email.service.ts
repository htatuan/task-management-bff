export const EmailService = jest.fn().mockResolvedValue({
  sendMail: jest.fn().mockResolvedValue(null),
});
