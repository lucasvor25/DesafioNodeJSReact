import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TaskModule } from './tasks/tasks.module';
import { AppDataSource } from '../db/data-source';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.entity';
import { Task } from './tasks/tasks.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TTypeOrmModule.forRootAsync({
  useFactory: () => {
    if (process.env.DATABASE_URL) {
      return {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        entities: [User, Task],
        migrations: ['dist/db/migrations/*.js'],
        synchronize: false,
        migrationsRun: true,
      };
    }

    return {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: false,
      entities: [User, Task],
      migrations: ['dist/db/migrations/*.js'],
      synchronize: false,
      migrationsRun: true,
    };
  }
}),
    AuthModule,
    UsersModule,
    TaskModule,
  ],
})
export class AppModule { }
