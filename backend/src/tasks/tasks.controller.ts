import { Controller, Get, Post, Put, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';
import { JwtAuthGuard } from '../jwt/jwt-auth.guards';

@Controller('task')
export class TasksController {
    constructor(private readonly taskService: TasksService) { }

    @Get('getItem')
    // @UseGuards(JwtAuthGuard)
    async findAll(@Request() req): Promise<Task[]> {
        return this.taskService.findAll(req.user.id);
    }

    @Get('getItemById/:id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Request() req, @Param('id') id: number): Promise<Task> {
        return this.taskService.findOne(req.user.id, id);
    }

    @Post('createItem')
    @UseGuards(JwtAuthGuard)
    async create(@Request() req, @Body() todo: Partial<Task>): Promise<Task> {
        return this.taskService.create(req.user.id, todo);
    }

    @Put('editItem/:id')
    @UseGuards(JwtAuthGuard)
    async update(@Request() req, @Param('id') id: number, @Body() todo: Partial<Task>): Promise<Task> {
        return this.taskService.update(req.user.id, id, todo);
    }

    @Delete('deleteItem/:id')
    @UseGuards(JwtAuthGuard)
    async delete(@Request() req, @Param('id') id: number): Promise<void> {
        return this.taskService.delete(req.user.id, id);
    }
}
