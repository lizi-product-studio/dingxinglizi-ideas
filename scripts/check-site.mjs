import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(process.argv[2]||'outputs/lizi-site');
let errors=[];let links=0;
for(const name of fs.readdirSync(root)) {
  const file=path.join(root,name);
  if(name.endsWith('.js')) {try{new vm.Script(fs.readFileSync(file,'utf8'),{filename:name});}catch(e){errors.push(e.message);}}
  if(!name.endsWith('.html'))continue;
  const html=fs.readFileSync(file,'utf8');
  if(!/<title>[^<]+<\/title>/.test(html))errors.push(name+': missing title');
  if(!html.includes('name="viewport"'))errors.push(name+': missing viewport');
  for(const [,url] of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    if(/^(?:https?:|mailto:|tel:|data:|#)/.test(url))continue;
    const target=url.split(/[?#]/)[0];if(!target)continue;links++;
    if(!fs.existsSync(path.resolve(root,decodeURIComponent(target))))errors.push(name+': missing '+url);
  }
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Validated page metadata, ${links} local references and all top-level JavaScript syntax.`);
