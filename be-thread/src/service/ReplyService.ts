import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Reply } from "../entity/Reply";
import { PostReplyType } from "../types/ReplyType";

export default new (class ReplyService {
  private readonly replyRepository: Repository<Reply> =
    AppDataSource.getRepository(Reply);

  async findAllByThreadId(threadId: number) {
    const replies = await this.replyRepository.find({
      relations: {
        user: true,
        thread: true,
      },
      where: {
        thread: {
          id: threadId,
        },
      },
      order: {
        created_at: "asc",
      },
      select: {
        content: true,
        id: true,
        image: true,
        created_at: true,
        user: {
          full_name: true,
          id: true,
          username: true,
          profile_picture: true,
        },
      },
    });

    return replies;
  }

  async post(reply: PostReplyType) {
    try {
      const newReply = this.replyRepository.create({
        content: reply.content,
        image: reply.image,
        thread: {
          id: reply.threadId,
        },
        user: {
          id: reply.currentUser.id,
        },
      });

      await this.replyRepository.save(newReply);
    } catch (err) {
      throw err;
    }
  }
})();
