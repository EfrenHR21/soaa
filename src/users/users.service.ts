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
import { envs } from 'config/env';
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
        createUserDto.secretToken !== envs.adminSecretToken
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

  async confirmedEmail(otp: string, email: string) {
    try {
      const userExists = await this.userDB.findOne({
        email,
      });
      if (!userExists) {
        throw new Error('Invalid email or password');
      }
      if (userExists.otp !== otp) {
        throw new Error('Invalid otp');
      }
      if (userExists.otpExpiryTime < new Date()) {
        throw new Error('Otp expired');
      }

      await this.userDB.updateOne(
        {
          email,
        },
        {
          isVerified: true,
        },
      );

      return {
        success: true,
        message: 'Email verified successfully. you can login now',
        result: { email: userExists.email },
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async sendOtpEmail(email) {
    try {
      const emailverified = await this.userDB.findOne({
        email,
      });

      if (!emailverified) throw new Error('Email not found');

      if (emailverified.isVerified) throw new Error('Email already verified');

      const otp = Math.floor(Math.random() * 900000) + 100000;
      const otpExpiryTime = new Date();

      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);

      await this.userDB.updateOne(
        {
          email,
        },
        {
          otp,
          otpExpiryTime,
        },
      );

      sendEmail(
        emailverified.email,
        envs.verifyEmail,
        'Email verification - SOA-Ecommerce',
        {
          customerName: emailverified.name,
          customerEmail: email,
          otp,  
        }
      );

      return { success: true, message: 'OTP sent successfully', result: { email: emailverified.email } };

    } catch (error) {
      throw new Error(error);
    }
  }

  async forgotPassword(email:string){
    try {
      const user = await this.userDB.findOne({
        email,  
      });

      if (!user) throw new Error('Email not found');

      let password = Math.random().toString(36).substring(2, 12);
      const tempPassword = password;
      password = await generateHashPassword(password);

      await this.userDB.updateOne(
        {
          _id : user._id,
        },
        {
          password,
        },
      );

      sendEmail(
        user.email,
        envs.forgotPassword,
        'Password reset - SOA-Ecommerce',
        {
          customerName: user.name,
          customerEmail: user.email,
          newPassword: password,
          loginLink: envs.loginLink,
        }
      );

      return { success: true, message: 'Password reset successfully', result: { email: user.email, tempPassword } };

    } catch (error) {
      throw new Error(error);
    }
  }
  
  async findAll(type:string) {
    try {
      const rsp = await this.userDB.find({
        type,
      })

      return { success: true, message: 'Users found successfully', result: rsp };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updatePasswordOrName(id: string, updateUserDto: UpdateUserDto) {
    try {
      const {oldPassword, newPassword, name} = updateUserDto;

      if(!name && !newPassword) throw new Error('Please provide at least one field to update');
    
      const user = await this.userDB.findOne({
        _id: id,
      });

      if (!user) throw new Error('User not found');

      if(newPassword){
        const isPasswordMatch = await comparePassword(
          oldPassword,
          user.password,
        )
        if(!isPasswordMatch) throw new Error('Invalid old password');
        
        await this.userDB.updateOne(
          {
            _id: id,
          },
          {
            password: await generateHashPassword(newPassword),
          },
        );
      
        if(name){
          await this.userDB.updateOne(
            {
              _id: id,
            },
            {
              name,
            },
          );
        }

        return {
          success: true,
          message: 'Password updated successfully',
          result: {
            name,
            password: newPassword,
          }
        }
      
      }
      
    } catch (error) {
      throw new Error(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
