import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TaskModule } from './tasks/tasks.module';
import { AppDataSource } from './dataSource'; // Importando o arquivo de DataSource

@Module({
  imports: [
    // Usando o TypeOrmModule com a configuração assíncrona
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        // Inicializando o AppDataSource e retornando as opções de conexão
        await AppDataSource.initialize(); // Inicializa a conexão
        return AppDataSource.options; // Retorna as opções para TypeOrmModule
      },
    }),
    AuthModule,
    UsersModule,
    TaskModule,
  ],
})
export class AppModule { }
