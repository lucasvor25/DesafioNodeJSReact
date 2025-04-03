import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { User } from 'src/users/users.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly todoRepository: Repository<Task>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findAll(userId: number): Promise<Task[]> {
        return this.todoRepository.find({ where: { user: { id: userId } } });
    }

    async findOne(userId: number, id: number): Promise<Task> {
        const todo = await this.todoRepository.findOne({ where: { id, user: { id: userId } } });
        if (!todo) {
            throw new NotFoundException(`Todo with ID ${id} not found or not owned by you`);
        }
        return todo;
    }

    async create(userId: number, todo: Partial<Task>): Promise<Task> {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const newTodo = this.todoRepository.create({ ...todo, user });
        return this.todoRepository.save(newTodo);
    }

    async update(userId: number, id: number, todo: Partial<Task>): Promise<Task> {
        const existingTodo = await this.findOne(userId, id);
        const updatedTodo = Object.assign(existingTodo, todo);
        return this.todoRepository.save(updatedTodo);
    }

    async delete(userId: number, id: number): Promise<void> {
        const todo = await this.findOne(userId, id);
        await this.todoRepository.remove(todo);
    }
}
