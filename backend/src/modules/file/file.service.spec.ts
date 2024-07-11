import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import * as fs from 'fs';
import * as sinon from 'sinon';
import * as archiver from 'archiver';

describe('FileService', () => {
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    fileService = module.get<FileService>(FileService);
  });

  describe('zipFiles', () => {
    it('should zip the files', async () => {
      const fixturesPath = 'test/fixtures';
      const filePaths = [
        `${fixturesPath}/test_file_2.txt`,
        `${fixturesPath}/test_file.txt`,
      ];
      const outputZipPath = 'output.zip';

      await fileService.zipFiles(filePaths, `${fixturesPath}/${outputZipPath}`);

      const outputZipExists = fs.existsSync(`${fixturesPath}/${outputZipPath}`);
      expect(outputZipExists).toBe(true);

      fs.unlinkSync(`${fixturesPath}/${outputZipPath}`);

      const outputZipDeleted = fs.existsSync(
        `${fixturesPath}/${outputZipPath}`,
      );
      expect(outputZipDeleted).toBe(false);
    });

    it('should throw an error when on error event triggered', async () => {
      const fixturesPath = 'test/fixtures';
      const filePaths = [];
      const outputZipPath = 'output.zip';

      sinon.stub(archiver, 'create').returns({
        on: sinon.stub().callsFake(function (event, callback) {
          if (event === 'error') {
            callback(new Error('ENOENT: no such file or directory'));
          }
        }),
      } as any);

      sinon.stub(fs, 'createWriteStream').returns({
        on: sinon.stub(),
      } as any);

      await expect(
        fileService.zipFiles(filePaths, `${fixturesPath}/${outputZipPath}`),
      ).rejects.toThrow('ENOENT: no such file or directory');

      sinon.restore();
    });

    it('should thro an error on fs createWriteStream error', async () => {
      const fixturesPath = 'test/fixtures';
      const filePaths = [];
      const outputZipPath = 'output.zip';

      sinon.stub(archiver, 'create').returns({
        on: sinon.stub(),
      } as any);

      sinon.stub(fs, 'createWriteStream').returns({
        on: sinon.stub().callsFake(function (event, callback) {
          if (event === 'error') {
            callback(new Error('ENOENT: no such file or directory'));
          }
        }),
      } as any);

      await expect(
        fileService.zipFiles(filePaths, `${fixturesPath}/${outputZipPath}`),
      ).rejects.toThrow('ENOENT: no such file or directory');

      sinon.restore();
    });
  });
});
