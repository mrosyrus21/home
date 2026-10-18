"use strict";
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const data=fs.readFileSync(path.join(root,'data.js'),'utf8');
const box=fs.readFileSync(path.join(root,'recipes.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const c=vm.createContext({});
vm.runInContext(data+'\n'+box,c);
const all=vm.runInContext('RECIPES',c);
const id='r_trial_tofu_sausage_spaghetti_no_sage';
const matches=all.filter(r=>r.id===id);
assert.equal(matches.length,1,'new recipe must merge once, not duplicate');
const r=matches[0];
assert.equal(r.trial,true);assert.ok(!r.dog&&!r.draft);
assert.equal(r.fixedBatch,true);
assert.equal(r.servings,'About 3 servings');
assert.match(r.blurb,/About 3 servings/);
const expected=[
  '1 block firm or extra-firm tofu, 14-16 oz, drained',
  '8 oz dry spaghetti','2 cups marinara sauce',
  '2 tbsp olive oil, plus a little more only if the skillet is dry',
  '1 tbsp soy sauce','1 tsp fennel seeds, lightly crushed','1 tsp smoked paprika',
  '3/4 tsp dried oregano','1/4-1/2 tsp red pepper flakes, to taste',
  '1/2 tsp black pepper','3 garlic cloves, minced','Optional: fresh basil',
  'Optional: Parmesan-style cheese made with vegetarian rennet, or a plant-based alternative'
];
assert.deepEqual(Array.from(r.ingredients),expected);
assert.doesNotMatch(r.ingredients.join(' '),/sage/i);
assert.equal(r.steps.length,6);
assert.match(r.steps[0],/pea-to-bean-size pieces, not fine crumbs/);
assert.match(r.steps[1],/2 tbsp[\s\S]*4-5 minutes[\s\S]*5-7 minutes[\s\S]*two batches/);
assert.match(r.steps[2],/20 seconds[\s\S]*30 seconds[\s\S]*soy sauce[\s\S]*1-2 minutes/);
assert.match(r.steps[3],/Reserve 1\/2 cup pasta water before draining/);
assert.match(r.steps[4],/one-third[\s\S]*marinara[\s\S]*3-5 minutes/);
assert.match(r.steps[5],/reserved browned tofu[\s\S]*optional vegetarian cheese/);
for(const phrase of ['Crushed fennel is the main Italian-sausage flavor; no sage is needed.',
  'Brown the tofu before adding soy sauce or marinara.',
  'Reserve some tofu for topping so it keeps its browned texture.',
  'Fresh basil is a finishing herb, not a replacement for the fennel.',
  'Allergens: Soy; wheat in ordinary spaghetti and many soy sauces; milk if dairy cheese is used.'])assert.ok(r.note.includes(phrase));
vm.runInContext(html.slice(html.indexOf('function recipeCategory('),html.indexOf('function recipeCatEmoji(')),c);
assert.equal(c.recipeCategory(r),'Italian & Pasta');
const page={innerHTML:'',style:{}};
Object.assign(c,{recipeServ:{},document:{getElementById:()=>page},window:{scrollTo(){}}});
vm.runInContext(html.slice(html.indexOf('function baseServ('),html.indexOf('function closeRecipe(')),c);
c.openRecipe(id);
assert.match(page.innerHTML,/HAVEN'T TRIED YET/);
assert.match(page.innerHTML,/About 3 servings/);
for(const text of [...expected,...Array.from(r.steps),r.note])assert.ok(page.innerHTML.includes(text),'full source content must render');
assert.doesNotMatch(page.innerHTML,/fewer servings|more servings/,'source-sized recipe must not offer inconsistent ingredient-only scaling');
c.setServings(id,1);assert.deepEqual(c.recipeServ,{});
assert.match(html,/recipes\.js\?v=20261017200646-tofu-spaghetti/,'changed recipe bundle needs a fresh version');
console.log('Sage-free tofu recipe quantity, six-step, trial-shelf/category and complete-detail checks passed.');
