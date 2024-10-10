// src/repositories/user.repository.ts
import User, { IUser } from "../models/user.models";

class UserRepository {
  async createUser(email: string, cognitoUserId: string): Promise<IUser> {
    const user = new User({ email, cognitoUserId, confirmed: false });
    return await user.save();
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).exec();
  }

  async getUserByCognitoId(cognitoUserId: string): Promise<IUser | null> {
    return await User.findOne({ cognitoUserId }).exec();
  }

  async confirmUser(email: string): Promise<IUser | null> {
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { confirmed: true } },
      { new: true }
    ).exec();
    return user;
  }

  async deleteUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOneAndDelete({ email }).exec();
  }
}

export default new UserRepository();
