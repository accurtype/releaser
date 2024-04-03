import { getDirname } from 'esm-entry';
import * as fsp from 'fs/promises';
import * as path from 'path';
import safe from './safe-do-fn.js';

export const myDir = path.join(getDirname(import.meta.url), '..');
export const myPackageJSON = JSON.parse(`${await safe.myPackageJSON(fsp.readFile, [path.join(myDir, 'package.json')])}`);
/**
 * 把需要回调的函数包装成 Promise
 * @template {any[]} P
 * @template T
 * @param {(...args: [...P, (err: any, data: T) => void]) => any} fn 要被包装的函数
 * @returns {(...args: P) => Promise<T>}
 */
export function promisify(fn) {
	return (...args) => {
		return new Promise((res, rej) => {
			/**@type {[...P, (err: any, data: T) => void]} */
			const argAll = [...args, (err, data) => (err ? rej(err) : res(data))];
			fn(...argAll);
		});
	};
}
