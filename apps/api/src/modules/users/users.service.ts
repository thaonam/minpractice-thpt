import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../database/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase().trim() });
  }

  create(input: { name: string; email: string; passwordHash: string; role?: string }) {
    return this.userModel.create({ ...input, email: input.email.toLowerCase().trim() });
  }

  async findSafeById(id: string) {
    const user = await this.userModel.findById(id).select('-passwordHash').lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  list() {
    return this.userModel.find().select('-passwordHash').sort({ createdAt: -1 }).lean();
  }
}
