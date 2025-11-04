import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.CreateUser(createUserDto);
    }

    @Put(':Id')
    update(@Param('Id') Id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.UpdateUser(+Id, updateUserDto);
    }

    @Get(':Id')
    findUser(@Param('Id') Id: string) {
        return this.userService.ShowUser(+Id)
    }
}
