import { Repository } from "typeorm";
import { Thread } from "../entity/Thread";
import { AppDataSource } from "../data-source";
import { PostThreadType } from "../types/ThreadType";
import * as cloudinary from "cloudinary";
import "dotenv/config";
import path = require("path");
import { Like } from "../entity/Like";
import LikeService from "./LikeService";

export default new (class ThreadService {
  private readonly threadRepository: Repository<Thread> = AppDataSource.getRepository(Thread);
  private readonly likeRepository: Repository<Like> = AppDataSource.getRepository(Like);

  async findAll() {
    try {
      let threads: any = await this.threadRepository.find({
        relations: {
          user: true,
          reply: true,
          like: true,
        },
        order: {
          created_at: "DESC",
        },
        select: {
          id: true,
          content: true,
          created_at: true,
          image: true,
          user: {
            profile_picture: true,
            full_name: true,
            username: true,
          },
        },
      });

      threads = await Promise.all(
        threads.map(async t => {
          const l = await LikeService.findAllByThreadId(t.id);
          t.like = l;
          return t;
        })
      );

      return threads;
    } catch (err) {
      console.log(err);
      return { error: true };
    }
  }

  async findById(id: number) {
    try {
      const selectedFields = {
        id: true,
        content: true,
        created_at: true,
        image: true,
        user: { profile_picture: true, full_name: true, username: true },
      };

      const threads = await this.threadRepository.findOne({
        relations: { user: true, reply: true, like: true },
        where: { id },
        select: selectedFields,
      });

      return threads;
    } catch (err) {
      return { error: true };
    }
  }

  async findByUserId(id: number) {
    try {
      const selectedFields = {
        id: true,
        content: true,
        created_at: true,
        image: true,
      };

      let threads: any = await this.threadRepository.find({
        relations: { user: true },
        where: {
          user: {
            id,
          },
        },
        select: selectedFields,
      });

      threads = await Promise.all(
        threads.map(async t => {
          const l = await LikeService.findAllByThreadId(t.id);
          t.like = l;
          return t;
        })
      );

      return threads;
    } catch (err) {
      return { error: true };
    }
  }

  async post(params: PostThreadType) {
    console.log(params.image);
    try {
      const newThread = this.threadRepository.create({
        content: params.content,
        image: params?.image?.secure_url || null,
        user: {
          id: params.currentUser.id,
        },
      });

      await this.threadRepository.save(newThread);
      console.log("Saved");
    } catch (err) {
      console.log("Cloudinary", err);
      throw err;
    }
  }
})();
