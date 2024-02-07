import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Reply } from "./Reply";
import { Like } from "./Like";

@Entity()
export class Thread {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @ManyToOne(() => User, user => user.threads)
  user: User;

  // one thread has many replies
  @OneToMany(() => Reply, reply => reply.thread, { cascade: true })
  reply: Reply;

  @OneToMany(() => Like, like => like.thread)
  like: Like;
}
