const { execSync } = require('child_process');


let HEAD = execSync(`git rev-parse HEAD`).toString()
HEAD = HEAD.slice(0, HEAD - 1);

execSync(`ember build --evironment=production`);
execSync(`mv dist baseline-dist`);
execSync(``);
