import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..', '..', '..');
const inputArg = process.argv[2] ?? 'docs/architecture/schema.mmd';
const outputPath = path.join(projectRoot, 'docs', 'architecture', 'erd.svg');
function fail(message) {
    console.log('SYNTAX_ERROR:');
    console.log(message.trim());
    process.exit(1);
}
const inputPath = path.isAbsolute(inputArg) ? inputArg : path.resolve(projectRoot, inputArg);
mkdirSync(path.dirname(outputPath), {recursive: true});
const args = ['--no-install', 'mmdc', '-i', inputPath, '-o', outputPath];
const result = spawnSync('npx', args, {cwd: projectRoot, encoding: 'utf8'});
if (result.error) {
    fail(`Failed to launch mmdc: ${result.error.message}`);
}
if (result.status !== 0) {
    fail(result.stderr || result.stdout || `mmdc stopped with status ${result.status}`);
}
console.log('SUCCESS');
process.exit(0);
