import fs from 'fs';

const readFile = location => new Promise((resolve, reject) => fs.readFile(location, 'utf-8', (err, data) => {
    if (err) return reject(err)
    resolve(data.toString())
}));

const writeFile = location => new Promise((resolve, reject) => fs.writeFile(location, data, err => {
    if (err) return reject(err)
    resolve()
}));

;(async () => {
    let argv = process.argv.slice(2);
    const debug = argv.includes('--dbg');
    argv = argv.filter(cmd => cmd !== '--dbg');

    const location = argv[0];
    if (location) {
        const program = await readFile(location);
        console.log(program);
    } else {

    }
})()