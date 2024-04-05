import { exec as execCb } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execCb);

/**获取包信息 */
export async function view(name: string) {
	const rslt = await exec(`npm view --json ${name}`);
	return JSON.parse(rslt.stdout);
}
