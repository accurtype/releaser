import Releaser from '../lib/index.js';
import { dir } from './helper.js';

const releaser = new Releaser(dir);

console.log(await releaser.initer);

await new Promise(res => setTimeout(res, 2000));
await releaser.cleanTemp();
