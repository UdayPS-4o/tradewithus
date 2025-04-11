import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';

interface UserInput {
  email: string;
  password: string;
  name: string;
}

interface LoginInput {
  email: string;
  password: string;
}

class UserService {
  // Create a new user
  async createUser(userData: UserInput): Promise<IUser> {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        email: userData.email,
        password: hashedPassword,
        name: userData.name
      });
      
      return await user.save();
    } catch (error) {
      throw error;
    }
  }
  
  // Find user by email
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  // Find user by ID
  async findUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }
  
  // Authenticate user
  async authenticateUser(loginData: LoginInput): Promise<IUser | null> {
    try {
      // Find user by email
      const user = await this.findUserByEmail(loginData.email);
      if (!user) return null;
      
      // Validate password
      const isMatch = await bcrypt.compare(loginData.password, user.password);
      if (!isMatch) return null;
      
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  // Get all users - for admin purposes
  async getAllUsers(): Promise<IUser[]> {
    return await User.find();
  }

  // Delete a user
  async deleteUser(userId: string): Promise<boolean> {
    try {
      const result = await User.deleteOne({ _id: userId });
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService(); 