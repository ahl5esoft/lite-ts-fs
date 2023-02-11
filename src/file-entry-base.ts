import { existsSync } from 'fs';
import { rename } from 'fs/promises';
import { basename, join } from 'path';

import { CopyOption } from './copy-option';
import { IFileEntry } from './i-file-entry';
import { IFileFactory } from './i-file-factory';

export abstract class FsFileEntryBase implements IFileEntry {
    public name: string;

    public constructor(
        public factory: IFileFactory,
        public path: string,
    ) {
        this.name = basename(path);
    }

    public async copyTo(opts: string | string[] | CopyOption) {
        let data: CopyOption;
        if (typeof opts === 'string') {
            data = {
                paths: [opts]
            };
        } else if (Array.isArray(opts)) {
            data = {
                paths: opts
            };
        } else {
            data = opts;
        }
        await this._copyTo(data);
    }

    public async exists() {
        return existsSync(this.path);
    }

    public async moveTo(v: any) {
        if (typeof v === 'string')
            v = [v];

        if (!Array.isArray(v))
            throw new Error(`${this.constructor.name}.moveTo: 暂不支持${v?.constructor.name ?? 'null or undefined'}`);

        await rename(
            this.path,
            join(
                ...(v as string[]),
            ),
        );
    }

    public abstract remove(): Promise<void>;

    protected abstract _copyTo(opts: CopyOption): Promise<void>;
}