import * as fsp from 'fs/promises';
import simpleGit from 'simple-git';

class ExtendedGit {
	/**@param {import('simple-git').SimpleGit} git Git 操作对象 */
	constructor(git) {
		this.git = git;
	}

	/**
	 * 获取提交的差异索引
	 * @param {string} commit 提交
	 * @param {string} file 文件
	 */
	diffIndex = async (commit, file = '') => {
		return await this.git.raw('diff-index', ...file ? [commit, file] : [commit]);
	};
	/**
	 * 查看一个文件本次提交是否是新建或修改过
	 * @param {string} file 文件路径
	 */
	isChanged = async file => {
		return await this.diffIndex('HEAD^', file) !== '';
	};
	/**
	 * 查看一个文件本次提交是否是新建
	 * @param {string} file 文件路径
	 */
	isNewed = async file => {
		return (await this.diffIndex('HEAD^', file)).slice(1, 7) === '000000';
	};
	/**
	 * 读取特定提交的文件
	 * @param {string} commit 提交
	 * @param {string} file 文件
	 */
	checkoutFile = async (commit, file) => {
		await this.git.checkout(commit, ['--', file]);
		const content = await fsp.readFile(file);
		await this.git.checkout('HEAD', ['--', file]);
		return content;
	};
}

/**
 * 获得拓展过的 Git 操作对象
 * @param {string} root Git 仓库地址
 */
export default function getGit(root) {
	const git = simpleGit(root);
	return Object.assign(git, new ExtendedGit(git));
}

