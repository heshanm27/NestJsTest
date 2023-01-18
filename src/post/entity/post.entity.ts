import { User } from 'src/user/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('posts')
export class Post {
  static readonly collectionName = 'Post';
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  category: string;

  @Column()
  @ManyToOne(() => User, (user) => user.id)
  authorId: string;
}
