import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
  Index,
} from "typeorm";
import { Thread } from "./Thread";
import { Reply } from "./Reply";
import { Like } from "./Like";
import { Follow } from "./Follow";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  full_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ nullable: true })
  profile_description: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  // one user has many threads
  @OneToMany(() => Thread, thread => thread.user, { cascade: true })
  threads: Thread[];

  @OneToMany(() => Reply, reply => reply.user, { cascade: true })
  reply: Reply[];

  @OneToMany(() => Like, like => like.user, { cascade: true })
  like: Like[];

  @OneToMany(() => Follow, follow => follow.follower, { cascade: true })
  follower: Follow[];

  @OneToMany(() => Follow, follow => follow.following, { cascade: true })
  following: Follow[];
}
