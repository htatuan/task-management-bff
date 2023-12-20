import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('EmailService', () => {
  let emailService: EmailService;
  let mailerServiceMock: jest.Mocked<MailerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useFactory: () => ({
            sendMail: jest.fn(),
          }),
        },
      ],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
    mailerServiceMock = module.get<MailerService>(
      MailerService,
    ) as jest.Mocked<MailerService>;
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  it('should call sendMail on mailService with correct parameters', async () => {
    const mailOptions = {
      subject: 'Test Subject',
      email: 'test@example.com',
      name: 'John Doe',
      activationCode: '123456',
      template: 'activation',
    };

    await emailService.sendMail(mailOptions);

    expect(mailerServiceMock.sendMail).toHaveBeenCalledWith({
      to: mailOptions.email,
      subject: mailOptions.subject,
      template: mailOptions.template,
      context: {
        name: mailOptions.name,
        activationCode: mailOptions.activationCode,
      },
    });
  });
});
