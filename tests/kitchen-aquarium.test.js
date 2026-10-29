const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),c=vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root,'data.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'recipes.js'),'utf8'),c);
const all=vm.runInContext('RECIPES',c),r=all.find(r=>r.id==='r_trial_smoky_black_bean_poblano_tomatillo_soup');
assert(r&&r.trial&&r.fixedBatch);assert.equal(r.ingredients.length,16);assert.equal(r.steps.length,7);
assert.match(r.ingredients[0],/3 cans black beans, 15 oz EACH before draining/);
assert.match(r.steps[0],/Do NOT use parchment/);assert.match(r.steps[3],/Turn off the heat[\s\S]*sealed personal blender/);
assert.match(r.note,/within 2 hours[\s\S]*165 F[\s\S]*not yet cooked/);
const page={innerHTML:''};Object.assign(c,{document:{getElementById:()=>page},checked:{},shopping:{},laundry:{},todayKey:()=> '2026-10-29'});
const a=html.indexOf('function renderShopping()'),b=html.indexOf('\nfunction ',a+1);vm.runInContext(html.slice(a,b),c);
for(const tank of ['bluedream','tall','wide','dry']){c.tankSub=tank;c.renderShopping();assert.match(page.innerHTML,tank==='dry'?/June 10, 2026/:/October 29, 2026/);for(const m of page.innerHTML.matchAll(/src="(images\/[^\"]+)"/g))assert(fs.existsSync(path.join(root,m[1])));}
c.tankSub='wide';c.renderShopping();assert.match(page.innerHTML,/Two berried cherry females/);assert.match(page.innerHTML,/completion is not yet confirmed/);
c.tankSub='tall';c.renderShopping();assert.match(page.innerHTML,/Fish are visible/);assert.match(page.innerHTML,/Wide is not confirmed fish-free/);
c.tankSub='bluedream';c.renderShopping();assert.match(page.innerHTML,/not a verified census/);
assert.match(html,/\["zoey","🐶 Zoey"\]/);assert.match(html,/__components/);assert.match(html,/__trusted/);
console.log('Soup source, kitchen destinations and all four dated aquarium renders passed');
