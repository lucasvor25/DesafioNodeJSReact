import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TaskModule } from './tasks/tasks.module';
import { AppDataSource } from './dataSource';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        await AppDataSource.initialize();
        return AppDataSource.options;
      },
    }),
    AuthModule,
    UsersModule,
    TaskModule,
  ],
})
export class AppModule { }
