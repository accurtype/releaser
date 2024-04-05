/**@enum {string} */
const errId = {
	myPackageJSON: 'Failed to read the package.json of accurtype-releaser',
	osNotRealTempDir: 'Cannot get OS\' temp dir',
	osTempDir: 'Cannot get the real path of OS\' temp dir',
	tempDir: 'Cannot make the temp dir',
	moveGit: 'Cannot copy the git folder of the project',
	packages: 'Cannot get packages of the project',
	cleanTemp: 'Cannot delete the temp dir, please do that by your hand',
	recoverGit: 'Cannot recover files in temp git repo',
	checkPackage: 'Cannot check the package.json is new or not',
	checkoutPackage: 'Cannot get the package.json of last commit',
	getNpmInfo: 'Cannot get npm info of the package',
};

/**
 * 方便地安全使用函数
 * @typedef {<T, P extends any[]>(fn: (...args: P) => T) => (...args: P) => Promise<T>} SafeDoer
 */

/**
 * 生成安全函数
 * @param {errId} msg 错误提示
 * @returns {SafeDoer}
 */
function genSafeDoer(msg) {
	return fn => {
		return async (...args) => {
			try {
				return await fn(...args);
			} catch (cause) {
				throw Error(msg, { cause });
			}
		};
	};
}

/**@type {{[I in keyof typeof errId]: SafeDoer}} */
// @ts-ignore
const safe = {};
/**@type {(keyof typeof errId)[]} */
// @ts-ignore
const keys = Object.keys(errId);
keys.forEach(k => safe[k] = genSafeDoer(errId[k]));

export default safe;
