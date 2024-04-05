import * as fsp from 'fs/promises';
import simpleGit from 'simple-git';

/**
 * @typedef {ReturnType<typeof getExtendedGit>} ExtendedGit
 */

/**@param {import('simple-git').SimpleGit} git Git 操作对象 */
function getExtendedGit(git) {
	const instance = {};
	/**
	 * 获取提交的差异索引
	 * @param {string} commit 提交
	 * @param {string} file 文件
	 */
	instance.diffIndex = async function (commit, file = '') {
		return await git.raw('diff-index', ...file ? [commit, file] : [commit]);
	};
	/**
	 * 查看一个文件本次提交是否是新建或修改过
	 * @param {string} file 文件路径
	 */
	instance.isChanged = async function (file) {
		return await instance.diffIndex('HEAD^', file) !== '';
	};
	/**
	 * 查看一个文件本次提交是否是新建
	 * @param {string} file 文件路径
	 */
	instance.isNewed = async function (file) {
		return (await instance.diffIndex('HEAD^', file)).slice(1, 7) === '000000';
	};
	/**
	 * 读取特定提交的文件
	 * @param {string} commit 提交
	 * @param {string} file 文件
	 */
	instance.checkoutFile = async function (commit, file) {
		await git.checkout(commit, ['--', file]);
		const content = await fsp.readFile(file);
		await git.checkout('HEAD', ['--', file]);
		return content;
	};

	return instance;
}

/**
 * 获得拓展过的 Git 操作对象
 * @param {string} root Git 仓库地址
 * @returns {ExtendedGit & import('simple-git').SimpleGit}
 */
export default function getGit(root) {
	const sgit = simpleGit(root);
	const git = getExtendedGit(sgit);
	for (const key in sgit) {
		// @ts-ignore
		if (typeof sgit[key] === 'function') {
			// @ts-ignore
			git[key] = (...args) => sgit[key](...args);
		}
	}
	// @ts-ignore
	return git;
}

