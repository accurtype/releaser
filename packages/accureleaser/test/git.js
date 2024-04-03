import { dir } from './helper.js';
import getGit from '../lib/git.js';

// const releaser = new Releaser(dir);

const git = getGit(dir);
console.log(await git.isChanged('utilities/accurtype-releaser/test/init.js'));
console.log(await git.isChanged('utilities/accurtype-releaser/lib/index.js'));
console.log(await git.isChanged('utilities/accurtype-releaser/package.json'));
console.log(await git.isNewed('utilities/accurtype-releaser/test/init.js'));
console.log(await git.isNewed('utilities/accurtype-releaser/lib/index.js'));
console.log(await git.isNewed('utilities/accurtype-releaser/package.json'));

