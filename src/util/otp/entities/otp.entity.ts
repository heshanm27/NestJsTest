import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  otp: string;

  @Column({ unique: true })
  userID: string;
}
