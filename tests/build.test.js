'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
test('Pages build publishes only game assets and preserves project-relative URLs',()=>{
  execFileSync(process.execPath,[path.join(root,'scripts/build.js')],{cwd:root});
  const output=path.join(root,'_site');
  assert.deepEqual(fs.readdirSync(output).sort(),['.nojekyll','404.html','index.html','src','styles.css'].sort());
  assert.deepEqual(fs.readdirSync(path.join(output,'src')).sort(),['app.js','art.js','engine.js','levels.js']);
  const html=fs.readFileSync(path.join(output,'index.html'),'utf8');
  const refs=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
  for(const ref of refs){assert.ok(!ref.startsWith('/'),'Assets must support Pages project subdirectories');assert.ok(fs.existsSync(path.join(output,ref)),ref+' must be packaged');}
  assert.equal(fs.readFileSync(path.join(output,'src/app.js'),'utf8'),fs.readFileSync(path.join(root,'src/app.js'),'utf8'));
  assert.match(fs.readFileSync(path.join(output,'404.html'),'utf8'),/回到咔哒小镇/);
});
