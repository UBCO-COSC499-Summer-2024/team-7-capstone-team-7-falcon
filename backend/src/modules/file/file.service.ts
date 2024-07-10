import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';

@Injectable()
export class FileService {
  private readonly COMPRESSION_LEVEL = 9;

  /**
   * Zips the files in the given array to the given output path.
   * @param filePaths {string[]} The paths of the files to be zipped.
   * @param outputZipPath {string} The path of the output zip file.
   * @returns {Promise<void>} A promise that resolves when the zip operation is complete.
   */
  async zipFiles(filePaths: string[], outputZipPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputZipPath);

      const archive = archiver('zip', {
        zlib: { level: this.COMPRESSION_LEVEL },
      });

      output.on('close', () => {
        resolve();
      });

      output.on('error', (err: Error) => {
        reject(err);
      });

      archive.on('error', (err: Error) => {
        reject(err);
      });

      archive.pipe(output);

      filePaths.forEach((filePath) => {
        const fileName = path.basename(filePath);
        archive.file(filePath, { name: fileName });
      });

      archive.finalize();
    });
  }
}
