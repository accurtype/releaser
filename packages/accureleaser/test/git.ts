import { dir } from './helper';
import getGit from '../lib/git';

// const releaser = new Releaser(dir);

const { isChanged, isNewed } = getGit(dir);
console.log(await isChanged('packages/accureleaser/test/init.ts'));
console.log(await isChanged('packages/accureleaser/lib/index.ts'));
console.log(await isChanged('packages/accureleaser/package.json'));
console.log(await isNewed('packages/accureleaser/test/init.ts'));
console.log(await isNewed('packages/accureleaser/lib/index.ts'));
console.log(await isNewed('packages/accureleaser/package.json'));

