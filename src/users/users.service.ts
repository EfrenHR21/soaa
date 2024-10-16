/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import config from 'config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userTypes } from 'src/shared/schema/users';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { generateHashPassword } from 'src/shared/utility/password-manager';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) private readonly userDB: UserRepository,
  ){}
  async create(createUserDto: CreateUserDto) {
    try {
      //generar contra
      createUserDto.password = await generateHashPassword(
        createUserDto.password,
      );
      
      //check por admin
      if(createUserDto.type === userTypes.ADMIN && 
        createUserDto.secretToken !== config.get('adminSecretToken')
      ){
        throw new Error ('Not allowed to create admin');
      }else{
        createUserDto.isVerified = true;
      }

      const user = await this.userDB.findOne({
        email: createUserDto.email,
      });
      if(user){
        throw new Error('User existente')
      }

      const otp = Math.floor(Math.random() * 900000) + 100000;

      const otpExpiryTime = new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes()+10);

      const newUser = await this.userDB.create({
        ...createUserDto,
        otp,
        otpExpiryTime,
      });
      if(newUser.type !== userTypes.ADMIN){
        sendEmail();
      }
      return {
        success: true,
        message: 'Usuario creado con exito',
        result: {email: newUser.email},
      }

    } catch (error) {
      throw error;
    }
  }

  login(login: string, password: string) {
    return 'This action login a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
