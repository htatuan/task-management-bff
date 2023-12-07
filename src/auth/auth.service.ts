import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './types/user.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUser(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async login(username: string, password: string): Promise<User> {
    var user = await this.userRepository.findOneBy({ username, password });
    if (!user) {
      throw new UnauthorizedException('Please check your login credentials');
    }
    return user;
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    var user = this.userRepository.create(createUserInput);
    return this.userRepository.save(user);
  }
}
