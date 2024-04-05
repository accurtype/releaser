import Releaser from '../lib/index';
import { dir } from './helper';

const releaser = new Releaser(dir);

console.log(await releaser.initer);

await new Promise(res => setTimeout(res, 2000));
await releaser.cleanTemp();
