'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const output=path.resolve(root,'_site');
if(path.relative(root,output)!=='_site')throw new Error('Unexpected build destination');
// Refuse to follow a user-created symlink when replacing the generated folder.
if(fs.existsSync(output)&&fs.lstatSync(output).isSymbolicLink())throw new Error('_site must not be a symbolic link');
fs.rmSync(output,{recursive:true,force:true});
fs.mkdirSync(output,{recursive:true});
for(const name of ['index.html','styles.css','404.html'])fs.copyFileSync(path.join(root,name),path.join(output,name));
fs.cpSync(path.join(root,'src'),path.join(output,'src'),{recursive:true});
fs.writeFileSync(path.join(output,'.nojekyll'),'');
console.log('Built GitHub Pages site: _site/');
