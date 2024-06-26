import { UserModel } from '../../../modules/user/entities/user.entity';
import { TokenTypeEnum } from '../../../enums/token-type.enum';
import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('token_model')
export class TokenModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  @Generated('uuid')
  token: string;

  @Column({ default: TokenTypeEnum.EMAIL_VERIFICATION })
  type: TokenTypeEnum;

  @Column({ type: 'bigint' })
  created_at: number;

  @Column({ type: 'bigint' })
  expires_at: number;

  @ManyToOne(() => UserModel, (user) => user.tokens)
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  async expireToken() {
    this.expires_at = -1;
    await this.save();
  }
}
