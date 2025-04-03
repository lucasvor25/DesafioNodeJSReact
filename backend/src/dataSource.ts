import { DataSource } from 'typeorm';
import { User } from './users/users.entity';
import { Task } from './tasks/tasks.entity';

export const AppDataSource = new DataSource({
    type: 'mssql',
    host: 'localhost',
    port: 1433,
    username: 'sa',
    password: 'todolist2025@',
    database: 'todolist',
    entities: [User, Task],
    migrations: ["./src/migrations/*.ts"],
    synchronize: false,
    migrationsRun: true,
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true,
    },
});
