import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { User } from '../users/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findAll', () => {
    it('deve retornar uma lista de tarefas para o usuário especificado', async () => {
      const userId = 1;
      const tasks: Task[] = [
        { id: 1, title: 'Teste', description: 'Descrição', completed: false, user: { id: userId } as User }
      ];
      jest.spyOn(taskRepository, 'find').mockResolvedValue(tasks);

      const result = await service.findAll(userId);
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma tarefa se encontrada', async () => {
      const userId = 1;
      const taskId = 1;
      const task = { id: taskId, title: 'Teste', description: 'Descrição', completed: false, user: { id: userId } as User };
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(task as Task);

      const result = await service.findOne(userId, taskId);
      expect(result).toEqual(task);
    });

    it('deve lançar uma exceção NotFoundException se a tarefa não for encontrada', async () => {
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('deve criar uma nova tarefa para o usuário especificado', async () => {
      const userId = 1;
      const taskData = { title: 'Nova Tarefa', description: 'Descrição da nova tarefa', completed: false };
      const user = { id: userId } as User;
      const task = { id: 1, ...taskData, user };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(taskRepository, 'create').mockReturnValue(task as Task);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(task as Task);

      const result = await service.create(userId, taskData);
      expect(result).toEqual(task);
    });

    it('deve lançar uma exceção NotFoundException se o usuário não for encontrado', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(1, { title: 'Teste', description: 'Descrição', completed: false })).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar uma tarefa existente', async () => {
      const userId = 1;
      const taskId = 1;
      const updateData = { title: 'Título Atualizado', completed: true };
      const existingTask = { id: taskId, title: 'Título Antigo', description: 'Descrição', completed: false, user: { id: userId } as User };

      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(existingTask as Task);
      jest.spyOn(taskRepository, 'save').mockResolvedValue({ ...existingTask, ...updateData } as Task);

      const result = await service.update(userId, taskId, updateData);
      expect(result.title).toEqual(updateData.title);
      expect(result.completed).toEqual(updateData.completed);
    });
  });

  describe('delete', () => {
    it('deve remover uma tarefa existente', async () => {
      const userId = 1;
      const taskId = 1;
      const task = { id: taskId, title: 'Teste', description: 'Descrição', completed: false, user: { id: userId } as User };

      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(task as Task);
      jest.spyOn(taskRepository, 'remove').mockResolvedValue(undefined);

      await expect(service.delete(userId, taskId)).resolves.not.toThrow();
    });
  });
});
