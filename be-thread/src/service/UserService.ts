import { DataSource, Repository } from "typeorm";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import * as JWT from "jsonwebtoken";
import * as cloudinary from "cloudinary";
import "dotenv/config";

export default new (class UserService {
  private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);

  async register(user: User): Promise<string> {
    try {
      const usernameRegistered = this.userRepository.findOneBy({
        username: user.username,
      });

      if (!usernameRegistered) {
        throw Error("username has been registered");
      }

      const emailRegistered = this.userRepository.findOneBy({
        email: user.email,
      });

      if (!emailRegistered) {
        throw Error("email has been registered");
      }

      user.password = await bcrypt.hash(user.password, 10);

      await this.userRepository.save(user);
      const payload = {
        username: user.username,
        full_name: user.full_name,
        profile_description: user.profile_picture,
        profile_picture: user.profile_picture,
        id: user.id,
      };
      const token = JWT.sign(payload, process.env.SECRET, {
        expiresIn: "99999s",
      });

      return token;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async login(user: { username: string; password: string }) {
    try {
      const existingUser = await this.userRepository.findOneByOrFail({
        username: user.username,
      });

      const i = await this.userRepository.findOne({
        where: {
          username: user.username,
        },
        relations: {
          follower: {
            following: true,
          },
          following: true,
        },
      });

      const isMatch = await bcrypt.compare(user.password, existingUser.password);

      if (!isMatch) {
        throw new Error("username/password doesn't match");
      }

      const payload = {
        id: existingUser.id,
        username: existingUser.username,
        full_name: existingUser.full_name,
        profile_picture: existingUser.profile_picture,
        profile_description: existingUser.profile_description,
        follower: i.follower,
        following: i.following,
      };

      const token = JWT.sign(payload, process.env.SECRET, {
        expiresIn: 1800,
      });

      return token;
    } catch (err) {
      throw err;
    }
  }

  check(token: string) {
    try {
      const payload = JWT.verify(token, process.env.SECRET);
      return payload;
    } catch (err) {
      throw err;
    }
  }

  async editProfile(user: User, image: string) {
    try {
      cloudinary.v2.config({
        api_secret: process.env.API_SECRET,
        api_key: process.env.API_KEY,
        cloud_name: process.env.CLOUD_NAME,
      });

      const imageUpload = await cloudinary.v2.uploader.upload("src/uploads/" + image);
      user.profile_picture = imageUpload.secure_url;

      user.password = await bcrypt.hash(user.password, 10);

      const result = await this.userRepository.save(user);

      const payload = {
        id: result.id,
        username: result.username,
        full_name: result.full_name,
        profile_picture: result.profile_picture,
        profile_description: result.profile_description,
      };

      const token = JWT.sign(payload, process.env.SECRET, {
        expiresIn: 1800,
      });

      return token;
    } catch (err) {
      throw err;
    }
  }

  async delete(id: number) {
    return this.userRepository.delete({
      id,
    });
  }

  async getEditProfile(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findAll() {
    return this.userRepository.find({
      select: {
        id: true,
        username: true,
        profile_picture: true,
        full_name: true,
      },
    });
  }

  async suggestedUser() {
    try {
      const users = await this.userRepository.find({
        select: {
          id: true,
          full_name: true,
          username: true,
          profile_picture: true,
          profile_description: true,
          created_at: true,
        },
      });

      const r = await this.userRepository
        .createQueryBuilder("user")
        .select()
        .leftJoinAndSelect("user.follower", "follower")
        .execute();

      // const followers = await AppDataSource.getRepository(Follow)
      //   .createQueryBuilder()
      //   .select().
      //   .execute();

      // console.log(r);

      // const result = users.map(u => {
      //   let isFollowing = false;
      //   followers.forEach(f => {
      //     console.log(f.follower.username);
      //     console.log(currentUser.username);
      //     // console.log("Follower Id", f.follower.id);
      //     // console.log("Current User", currentUser.id);
      //     if (f.follower.id == currentUser.id) {
      //       isFollowing = true;
      //       console.log("Following");
      //     }
      //   });

      //   return { ...u, isFollowing };
      // });

      return r;
    } catch (err) {
      throw err;
    }
  }
})();
