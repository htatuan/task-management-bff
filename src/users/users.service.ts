import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    const newUser = this.userRepository.create({
      ...createUserInput,
      password: hashedPassword,
    });
    try {
      const res = this.userRepository.save(newUser);
      return res;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(error.detail);
      } else {
        throw new InternalServerErrorException(error.detail);
      }
    }
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  resetPassword(id: number, newPassword: string) {
    return this.userRepository.update({ id }, { password: newPassword });
  }
}
