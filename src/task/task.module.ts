import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { TaskService } from './task.service';
import { TASK_SERVICE_NAME } from './proto/task';
import { TaskResolver } from './task.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: TASK_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50051',
          package: 'task',
          protoPath: join(__dirname, '../task/proto/task.proto'),
        },
      },
    ]),
  ],
  providers: [TaskService, TaskResolver, ConfigService],
})
export class TaskModule {}
