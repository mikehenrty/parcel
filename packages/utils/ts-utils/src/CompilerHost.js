// @flow
import type {FilePath} from '@parcel/types';
import type {CompilerOptions, SourceFile} from 'typescript';
import typeof {ScriptTarget} from 'typescript'; // eslint-disable-line import/no-extraneous-dependencies
import path from 'path';
import {FSHost} from './FSHost';

export class CompilerHost extends FSHost {
  outputCode: ?string;
  outputMap: ?string;

  getSourceFile(
    filePath: FilePath,
    languageVersion: $Values<ScriptTarget>,
  ): void | SourceFile {
    const sourceText = this.readFile(filePath);
    return sourceText !== undefined
      ? this.ts.createSourceFile(filePath, sourceText, languageVersion)
      : undefined;
  }

  getDefaultLibFileName(options: CompilerOptions): string {
    return this.ts.getDefaultLibFilePath(options);
  }

  writeFile(filePath: FilePath, content: string) {
    if (path.extname(filePath) === '.map') {
      this.outputMap = content;
    } else {
      this.outputCode = content;
    }
  }

  getCanonicalFileName(fileName: FilePath): FilePath | string {
    return this.ts.sys.useCaseSensitiveFileNames
      ? fileName
      : fileName.toLowerCase();
  }

  useCaseSensitiveFileNames(): boolean {
    return this.ts.sys.useCaseSensitiveFileNames;
  }

  getNewLine(): string {
    return this.ts.sys.newLine;
  }
}
