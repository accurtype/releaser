import { dir } from './helper.js';
import getGit from '../lib/git.js';

// const releaser = new Releaser(dir);

const { isChanged, isNewed } = getGit(dir);
console.log(await isChanged('packages/accureleaser/test/init.js'));
console.log(await isChanged('packages/accureleaser/lib/index.js'));
console.log(await isChanged('packages/accureleaser/package.json'));
console.log(await isNewed('packages/accureleaser/test/init.js'));
console.log(await isNewed('packages/accureleaser/lib/index.js'));
console.log(await isNewed('packages/accureleaser/package.json'));

