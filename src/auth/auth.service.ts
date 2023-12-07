import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
    const user = await this.userRepository.findOneBy({ username, password });
    if (!user) {
      throw new UnauthorizedException('Please check your login credentials');
    }
    return user;
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      const { username, password } = createUserInput;
      const user = this.userRepository.findOneBy({ username });
      const creatingUser = this.userRepository.create({ username, password });
      return await this.userRepository.save(creatingUser);
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
