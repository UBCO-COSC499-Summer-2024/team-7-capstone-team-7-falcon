import { IsNotEmpty, IsString } from 'class-validator';
import { DisputeStatusEnum } from '../../../enums/exam-dispute.enum';

export class DisputeStatusDto {
  @IsString()
  @IsNotEmpty()
  status!: DisputeStatusEnum;
}
