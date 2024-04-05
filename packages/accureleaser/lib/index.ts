/**
 * 精确类型自动构建脚本
 * @license MIT
 * @packageDocumentation @package
 */

import { Package, getPackages } from '@manypkg/get-packages';
import filenamify from 'filenamify';
import * as fsp from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { myPackageJSON } from './constant';
import getGit from './git';
import { view } from './npm';
import safe from './safe-do-fn';
import { PackageJSON } from './types';

export default class Releaser {
	initer: ReturnType<typeof this.init>;
	constructor(rootDir: string) {
		this.initer = this.init(rootDir);
	}

	/**初始化 */
	private async init(rootDir: string) {
		const osNotRealTempDir = await safe.osNotRealTempDir(os.tmpdir)();
		const osTempDir = `${await safe.osTempDir(fsp.realpath)(osNotRealTempDir)}`;
		const tempDir = `${await safe.tempDir(fsp.mkdtemp)(path.join(osTempDir, `${filenamify(myPackageJSON.name)}-`))}`;
		await safe.moveGit(fsp.cp)(path.join(rootDir, '.git'), path.join(tempDir, '.git'), { recursive: true });
		const git = getGit(tempDir);
		await safe.recoverGit(() => git.raw('restore', '.'))();
		const packages = await safe.packages(getPackages)(tempDir);
		return {
			osNotRealTempDir,
			osTempDir,
			tempDir,
			git,
			packages,
			rootDir,
		};
	}
	/**
	 * 清理临时文件
	 *
	 * 请在实例被使用完后再调用此方法！
	 */
	async cleanTemp() {
		const { tempDir } = await this.initer;
		await safe.cleanTemp(fsp.rm)(tempDir, { recursive: true, force: true });
	}

	[Symbol.dispose] = () => this.cleanTemp();
	[Symbol.asyncDispose] = () => this.cleanTemp();

	/**获得上次提交的包描述 */
	protected async checkoutPackageJson(dir: string): Promise<PackageJSON> {
		const { git } = await this.initer;
		return JSON.parse(`${await safe.checkoutPackage(git.checkoutFile)('HEAD^', `${dir}/package.json`)}`);
	}
	/**检查当前提交的版本是否需要被发布 */
	async isUniqueVersion({ dir, packageJson: { version, name } }: Package) {
		if ((await this.checkoutPackageJson(dir)).version === version) return false;
		if ((await safe.getNpmInfo(view)(name)).versions.include(version)) return false;
		return true;
	}
	/**获得本提交里被标记的包 */
	async getSignedPackages() {
		const { packages, git } = await this.initer;
		const signeds = new Set<Package>();
		for (const packageInfo of packages.packages) {
			if (packageInfo.packageJson.private ?? false) continue;
			if (
				await safe.checkPackage(git.isNewed)(`${packageInfo.dir}/package.json`)
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
