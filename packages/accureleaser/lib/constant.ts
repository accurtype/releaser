import { getDirname } from 'esm-entry';
import * as fsp from 'fs/promises';
import * as path from 'path';
import safe from './safe-do-fn';

export const myDir = path.join(getDirname(import.meta.url), '..');
export const myPackageJSON = JSON.parse(`${await safe.myPackageJSON(fsp.readFile)(path.join(myDir, 'package.json'))}`);
