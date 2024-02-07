import { Repository } from "typeorm";
import { Like } from "../entity/Like";
import { AppDataSource } from "../data-source";

export default new (class LikeService {
  private readonly likeRepository: Repository<Like> = AppDataSource.getRepository(Like);

  async findAll() {
    try {
      const likes = this.likeRepository.find({
        relations: {
          user: true,
          thread: true,
        },
        select: {
          user: {
            id: true,
          },
          thread: {
            id: true,
          },
        },
      });

      return likes;
    } catch (err) {
      throw err;
    }
  }

  async findAllByThreadId(threadId: number) {
    try {
      const likes = await this.likeRepository.find({
        relations: { user: true, thread: true },
        where: {
          thread: {
            id: threadId,
          },
        },
        select: {
          id: true,
          created_at: true,
          thread: {},
          user: {
            id: true,
            username: true,
            full_name: true,
            created_at: true,
            updated_at: true,
            profile_picture: true,
            profile_description: true,
          },
        },
      });

      return likes;
    } catch (err) {
      throw err;
    }
  }

  async postLike(threadId: number, userId: number) {
    try {
      const isLiked = await this.likeRepository.findOne({
        where: {
          thread: {
            id: threadId,
          },
          user: {
            id: userId,
          },
        },
        relations: { thread: true, user: true },
      });

      if (isLiked) {
        await this.likeRepository.delete({
          user: {
            id: userId,
          },
          thread: {
            id: threadId,
          },
        });

        return;
      }
      const like = this.likeRepository.create({
        thread: {
          id: threadId,
        },
        user: {
          id: userId,
        },
      });

      await this.likeRepository.save(like);
    } catch (err) {
      throw err;
    }
  }
})();
