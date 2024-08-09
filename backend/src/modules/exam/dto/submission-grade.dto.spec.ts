import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SubmissionGradeDto } from './submission-grade.dto';

describe('SubmissionGradeDto', () => {
  it('should be defined', () => {
    expect(new SubmissionGradeDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: SubmissionGradeDto = {
      answers: {
        errorFlag: false,
        answer_list: [
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
        ],
      },
    };
    const dto = plainToInstance(SubmissionGradeDto, payload);
    expect(dto).toBeDefined();
    expect(dto.answers.errorFlag).toBe(false);
    expect(dto.answers.answer_list).toHaveLength(1);
    const errors = validate(dto);

    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      grade: -1,
    };

    const dto = plainToInstance(SubmissionGradeDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});
