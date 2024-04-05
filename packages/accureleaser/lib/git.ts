import * as fsp from 'fs/promises';
import simpleGit, { SimpleGit } from 'simple-git';

type ExtendedGit = ReturnType<typeof getExtendedGit>;

function getExtendedGit(git: SimpleGit) {
	/**获取提交的差异索引 */
	async function diffIndex(commit: string, file = '') {
		return await git.raw('diff-index', ...file ? [commit, file] : [commit]);
	}
	/**查看一个文件本次提交是否是新建或修改过 */
	async function isChanged(file: string) {
		return await diffIndex('HEAD^', file) !== '';
	}
	/**查看一个文件本次提交是否是新建 */
	async function isNewed(file: string) {
		return (await diffIndex('HEAD^', file)).slice(1, 7) === '000000';
	}
	/**读取特定提交的文件 */
	async function checkoutFile(commit: string, file: string) {
		await git.checkout(commit, ['--', file]);
		const content = await fsp.readFile(file);
		await git.checkout('HEAD', ['--', file]);
		return content;
	}

	return {
		diffIndex,
		isChanged,
		isNewed,
		checkoutFile,
	};
}

/**获得拓展过的 Git 操作对象 */
export default function getGit(root: string): ExtendedGit & SimpleGit {
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

