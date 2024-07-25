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
      answers: {},
      documentPath: 'path',
    };

    const dto = plainToInstance(SubmissionCreationDto, payload);
    expect(dto).toBeDefined();
    expect(dto.score).toBe(100);
    expect(dto.answers).toEqual({});
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
    expect(errors).resolves.toHaveLength(1);
  });

  it('should throw an error when score has four decimal places', () => {
    const payload = {
      score: 34.1234,
      answers: {},
      documentPath: 'path',
    };

    const dto = plainToInstance(SubmissionCreationDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});
