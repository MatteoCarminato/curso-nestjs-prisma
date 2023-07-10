/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Patch, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';
import LogInterceptor from 'src/interceptors/log.interceptor';
import { ParamId } from 'src/decorators/param-id.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guards';
import { AuthGuard } from 'src/guards/auth.guards';

@UseGuards(AuthGuard,RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async index() {
        return this.userService.getAll();
    }

    @Roles(Role.Admin)
    @Post()
    async create(@Body() {email,password,name, birthAt, role}: CreateUserDTO) {
        return this.userService.create({email,password,name,birthAt, role});
    }

    @Roles(Role.Admin)
    @Get(':id')
    async show(@ParamId() id:number) {
        return this.userService.show(id);
    }

    @Roles(Role.Admin)
    @Patch(':id')
    async editPatch(@Body() data: UpdateUserDTO, @ParamId() id:number) {
        return { params: 'patch', id, data }
    }

    @Roles(Role.Admin)
    @Put(':id')
    async edit(@Body() data: UpdateUserDTO, @ParamId() id:number) {
        return this.userService.update(data,id)
    }

    @Roles(Role.Admin)
    @Delete(':id')
    async delete(@ParamId() id:number) {
        return this.userService.delete(id)
    }
}
