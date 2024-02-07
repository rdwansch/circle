import { Repository } from "typeorm";
import { Follow } from "../entity/Follow";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { JWTSession } from "../types/UserType";

export default new (class FollowService {
  private readonly followRepository: Repository<Follow> =
    AppDataSource.getRepository(Follow);

  async create(followerId: number, followingId: number) {
    try {
      // followers -> following
      // siapa pengikutku?: get All following by myId
      // siapa yang aku ikuti?: get All followers by myId
      const follows = this.followRepository.create({
        follower: {
          id: followerId,
        },
        following: {
          id: followingId,
        },
      });

      const hasFollowed = await this.followRepository.find({
        where: {
          follower: {
            id: followerId,
          },
          following: {
            id: followingId,
          },
        },
      });

      if (hasFollowed.length > 0) {
        throw new Error("User is already followed");
      }

      await this.followRepository.save(follows);
    } catch (err) {
      throw err;
    }
  }

  async findFollowers(followingId: number) {
    try {
      const followers = await this.followRepository.find({
        where: {
          following: {
            id: followingId,
          },
        },
        select: {
          follower: {
            full_name: true,
            id: true,
            username: true,
            profile_picture: true,
            follower: true,
          },
        },
        relations: {
          follower: true,
        },
      });
      return followers;
    } catch (err) {
      throw err;
    }
  }

  async findFollowing(followerId: number) {
    try {
      const following = await this.followRepository.find({
        where: {
          follower: {
            id: followerId,
          },
        },
        select: {
          following: {
            full_name: true,
            id: true,
            username: true,
            profile_picture: true,
          },
          follower: {
            full_name: true,
            id: true,
            username: true,
            profile_picture: true,
          },
        },
        relations: {
          following: true,
          follower: true,
        },
      });

      return following;
    } catch (err) {
      throw err;
    }
  }

  async unfollow(followerId: number, followingId: number) {
    try {
      await this.followRepository.delete({
        follower: {
          id: followerId,
        },
        following: {
          id: followingId,
        },
      });
    } catch (err) {
      throw err;
    }
  }
})();
