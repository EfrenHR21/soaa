/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { userTypes } from 'src/shared/schema/users';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import config from 'config';
import { UserRepository } from 'src/shared/repositories/user.repository';
import {
  comparePassword,
  generateHashPassword,
} from 'src/shared/utility/password-manager';
import { sendEmail } from 'src/shared/utility/mail-handler';
import { generateAuthToken } from 'src/shared/utility/token-generator';
@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) private readonly userDB: UserRepository,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      // generate the hash password
      createUserDto.password = await generateHashPassword(
        createUserDto.password,
      );

      /// check is it for admin
      if (
        createUserDto.type === userTypes.ADMIN &&
        createUserDto.secretToken !== config.get('adminSecretToken')
      ) {
        throw new Error('Not allowed to create admin');
      } else if (createUserDto.type !== userTypes.CUSTOMER) {
        createUserDto.isVerified = true;
      }

      // user is already exist
      const user = await this.userDB.findOne({
        email: createUserDto.email,
      });
      if (user) {
        throw new Error('User already exist');
      }

      // generate the otp
      const otp = Math.floor(Math.random() * 900000) + 100000;

      const otpExpiryTime = new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);

      const newUser = await this.userDB.create({
        ...createUserDto,
        otp,
        otpExpiryTime,
      });
      if (newUser.type !== userTypes.ADMIN) {
        sendEmail(
          newUser.email,
          config.get('emailService.emailTemplates.verifyEmail'),
          'Email verification - Digizone',
          {
            customerName: newUser.name,
            customerEmail: newUser.email,
            otp,
          },
        );
      }
      return {
        success: true,
        message:
          newUser.type === userTypes.ADMIN
            ? 'Admin created successfully'
            : 'Please activate your account by verifying your email. We have sent you a wmail with the otp',
        result: { email: newUser.email },
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const userExists = await this.userDB.findOne({
        email,
      });
      if (!userExists) {
        throw new Error('Invalid email or password');
      }
      if (!userExists.isVerified) {
        throw new Error('Please verify your email');
      }
      const isPasswordMatch = await comparePassword(
        password,
        userExists.password,
      );
      if (!isPasswordMatch) {
        throw new Error('Invalid email or password');
      }
      const token = await generateAuthToken(userExists.id);

      return {
        success: true,
        message: 'Login successful',
        result: {
          user: {
            name: userExists.name,
            email: userExists.email,
            type: userExists.type,
            id: userExists._id.toString(),
          },
          token,
        },
      };
    } catch (error) {
      throw error;
    }
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
