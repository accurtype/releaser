/**
 * 精确类型自动构建脚本
 * @license MIT
 * @packageDocumentation @package
 */

import { getPackages } from '@manypkg/get-packages';
import filenamify from 'filenamify';
import * as fsp from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { myPackageJSON } from './constant.js';
import getGit from './git.js';
import safe from './safe-do-fn.js';
import * as Types from './types.js';
import { view } from './npm.js';

if (!Types.imported) throw Error('Cannot load type definitions');

export default class Releaser {
	/**@param {string} rootDir 项目的根目录 */
	constructor(rootDir) {
		this.initer = this.init(rootDir);
	}

	/**
	 * 初始化
	 * @param {string} rootDir 项目的根目录
	 * @private
	 */
	async init(rootDir) {
		const osNotRealTempDir = await safe.osNotRealTempDir(os.tmpdir);
		const osTempDir = `${await safe.osTempDir(fsp.realpath, [osNotRealTempDir])}`;
		const tempDir = `${await safe.tempDir(fsp.mkdtemp, [path.join(osTempDir, `${filenamify(myPackageJSON.name)}-`)])}`;
		await safe.moveGit(fsp.cp, [path.join(rootDir, '.git'), path.join(tempDir, '.git'), { recursive: true }]);
		const git = getGit(tempDir);
		await safe.recoverGit(() => git.raw('restore', '.'));
		const packages = await safe.packages(getPackages, [tempDir]);
		return { osNotRealTempDir, osTempDir, tempDir, git, packages, rootDir };
	}
	/**
	 * 清理临时文件
	 *
	 * 请在实例被使用完后再调用此方法！
	 */
	async cleanTemp() {
		const { tempDir } = await this.initer;
		await safe.cleanTemp(fsp.rm, [tempDir, { recursive: true, force: true }]);
	}

	[Symbol.dispose] = () => this.cleanTemp();
	[Symbol.asyncDispose] = () => this.cleanTemp();

	/**
	 * 获得上次提交的包描述
	 * @param {string} dir 包地址
	 * @returns {Promise<Types.PackageJSON>}
	 * @protected
	 */
	async checkoutPackageJson(dir) {
		const { git } = await this.initer;
		return JSON.parse(`${await safe.checkoutPackage(() => git.checkoutFile('HEAD^', `${dir}/package.json`))}`);
	}
	/**
	 * 检查当前提交的版本是否需要被发布
	 * @type {(info: Types.Package) => Promise<boolean>} packageInfo 包信息
	 */
	async isUniqueVersion({ dir, packageJson: { version, name } }) {
		if ((await this.checkoutPackageJson(dir)).version === version) return false;
		if ((await safe.getNpmInfo(view, [name])).versions.include(version)) return false;
		return true;
	}
	/**
	 * 获得本提交里被标记的包
	 */
	async getSignedPackages() {
		const { packages, git } = await this.initer;
		/**@type {Set<Types.Package>} */
		const signeds = new Set();
		for (const packageInfo of packages.packages) {
			if (packageInfo.packageJson.private ?? false) continue;
			if (
				await safe.checkPackage(() => git.isNewed(`${packageInfo.dir}/package.json`))
				|| await this.isUniqueVersion(packageInfo)
			) signeds.add(packageInfo);
		}
		return signeds;
	}

	// /**
	//  * 发布开发版本
	//  */
	// releaseDev() {
	// }
}
