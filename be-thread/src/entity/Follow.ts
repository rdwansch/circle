import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Follow {
  @Unique(["followingId", "followerId"])
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.following)
  following: User;

  @ManyToOne(() => User, user => user.follower)
  follower: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
