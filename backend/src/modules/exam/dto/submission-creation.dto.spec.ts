import { plainToInstance } from 'class-transformer';
import { SubmissionCreationDto } from './submission-creation.dto';
import { validate } from 'class-validator';

describe('SubmissionCreationDto', () => {
  it('should be defined', () => {
    expect(SubmissionCreationDto).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: SubmissionCreationDto = {
      score: 100,
      answers: {
        errorFlag: false,
        answer_list: [
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
        ],
      },
      documentPath: 'path',
    };

    const dto = plainToInstance(SubmissionCreationDto, payload);
    expect(dto).toBeDefined();
    expect(dto.score).toBe(100);
    expect(dto.answers).toEqual({
      errorFlag: false,
      answer_list: [
        { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
      ],
    });
    expect(dto.documentPath).toBe('path');

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      score: -1,
      answers: {},
      documentPath: 'path',
    };

    const dto = plainToInstance(SubmissionCreationDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(2);
  });
});
