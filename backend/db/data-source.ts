import { DataSource } from 'typeorm';
import { User } from '../src/users/users.entity';
import { Task } from '../src/tasks/tasks.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Task],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false,
    migrationsRun: true
});
