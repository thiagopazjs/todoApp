import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from 'src/helpers/swagger/bad-request.swagger';
import { NotFoundSwagger } from 'src/helpers/swagger/not-found-swagger';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { IndexTodoSwagger } from './swagger/index-todo.swagger';
import { ShowTodoSwagger } from './swagger/show-todo.swagger';
import { UpdateTodoSwagger } from './swagger/update-todo-swagger';
import { TodoService } from './todo.service';

@Controller('api/v1/todos')
@ApiTags('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'List all tasks' })
  @ApiResponse({
    status: 200,
    description: 'To-do list return sucessfully',
    type: IndexTodoSwagger,
    isArray: true,
  })
  async index() {
    return await this.todoService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add a new task' })
  @ApiResponse({
    status: 201,
    description: 'New task created successfully',
    type: ShowTodoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters',
    type: BadRequestSwagger,
  })
  async create(@Body() body: CreateTodoDto) {
    return await this.todoService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'View the data of a task' })
  @ApiResponse({ status: 200, description: 'Task returned successfully' })
  @ApiResponse({
    status: 400,
    description: 'Task not found',
    type: BadRequestSwagger,
  })
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.todoService.findOneOrFail(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task data' })
  @ApiResponse({
    status: 200,
    description: 'Task update successfully',
    type: UpdateTodoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data ',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
    type: NotFoundSwagger,
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTodoDto,
  ) {
    return await this.todoService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a task' })
  @ApiResponse({ status: 204, description: 'Task removed successfully' })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
    type: NotFoundSwagger,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.todoService.deleteById(id);
  }
}
