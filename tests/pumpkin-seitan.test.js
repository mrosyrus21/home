"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const c=vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root,'data.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'recipes.js'),'utf8'),c);
const all=vm.runInContext('RECIPES',c);
const pie=all.find(r=>r.id==='r_trial_roasted_pumpkin_pie_butter_crust');
const wings=all.find(r=>r.id==='r_trial_miso_japanese_bbq_seitan_wings');
const base=all.find(r=>r.id==='r_trial_homemade_seitan_bbq_wings');
for(const r of [pie,wings,base]){
  assert(r);assert.equal(all.filter(x=>x.id===r.id).length,1);
  assert.equal(r.trial,true);assert.equal(r.fixedBatch,true);assert.ok(!r.dog&&!r.draft);
  assert.ok(r.ingredients.every(i=>!/^INGREDIENTS|^(PUMPKIN|FILLING|WINGS|GLAZE)$/.test(i)),'group headings must not become grocery ingredients');
}
assert.equal(pie.ingredients.length,18);assert.equal(pie.steps.length,8);
assert.deepEqual(Array.from(pie.ingredientGroups,g=>g.start),[0,2,7]);
assert.deepEqual(Array.from(pie.ingredientGroups,g=>g.title),['Pumpkin','Single Butter Crust','Filling']);
assert.match(pie.blurb,/9-inch deep-dish pie; 8 slices[\s\S]*6 hours total[\s\S]*day ahead/);
assert.match(pie.ingredients[1],/15 oz \/ 425 g[\s\S]*1 3\/4 cups/);
assert.match(pie.steps[1],/Cool, THEN weigh 425 g[\s\S]*Do not assume the whole pumpkin/);
assert.match(pie.steps[4],/20 minutes[\s\S]*7-10 minutes[\s\S]*350 F/);
assert.match(pie.steps[6],/175 F[\s\S]*altitude/);
assert.match(pie.steps[7],/within 2 hours[\s\S]*at least 3 hours[\s\S]*3-4 days/);
assert.match(pie.note,/9-inch deep-dish metal pie pan[\s\S]*untested recipe[\s\S]*Wheat, milk, eggs/);
assert.match(pie.note,/href="https:\/\/www\.fda\.gov\/consumers\/consumer-updates\/food-safety-tips-healthy-holidays"/);
assert.equal(wings.ingredients.length,17);assert.equal(wings.steps.length,6);
assert.deepEqual(Array.from(wings.ingredientGroups,g=>g.start),[0,8]);
assert.match(wings.blurb,/3 main-dish servings or 4 appetizer servings[\s\S]*35-45 minutes/);
assert.match(wings.ingredients[0],/1 lb \/ 454 g plain cooked seitan/);
assert.match(wings.note,/fully COOKED seitan[\s\S]*not 1 lb dry vital wheat gluten/);
assert.match(wings.note,/Use 1\/3 cup of that sauce and OMIT the separate miso paste/);
assert.match(wings.note,/390 F[\s\S]*10-15 minutes[\s\S]*1-2 minutes at 375 F/);
assert.match(wings.note,/within 2 hours[\s\S]*3-4 days[\s\S]*165 F[\s\S]*Refrigerate leftover glaze too/);
assert.match(wings.note,/fish\/dashi, anchovy[\s\S]*Vegan if[\s\S]*wheat\/gluten[\s\S]*Not suitable for a gluten-free diet/);
assert.match(wings.steps[4],/HALF the glaze[\s\S]*3-5 minutes[\s\S]*sugary sauce burns fast/);
assert.match(wings.steps[0],/Homemade pieces already steamed in wing shapes do not need tearing again/);
assert.match(wings.note,/openRecipe\('r_trial_homemade_seitan_bbq_wings'\)/);
assert.equal(base.ingredients.length,11);assert.equal(base.steps.length,7);
assert.deepEqual(Array.from(base.ingredientGroups,g=>g.start),[0,6]);
assert.match(base.ingredients[0],/180 g vital wheat gluten[\s\S]*1 1\/2 cups/);
assert.match(base.ingredients[1],/30 g chickpea flour[\s\S]*1\/4 cup/);
assert.match(base.steps[1],/60-90 seconds[\s\S]*teaspoon at a time/);
assert.match(base.steps[3],/water BELOW[\s\S]*Food should not sit in the water/);
assert.match(base.steps[4],/35-45 minutes[\s\S]*never let the pot boil dry[\s\S]*5-10 minutes/);
assert.match(base.steps[5],/20 minutes[\s\S]*overnight[\s\S]*within 2 hours/);
assert.match(base.steps[6],/openRecipe\('r_trial_miso_japanese_bbq_seitan_wings'\)[\s\S]*14-18 oz[\s\S]*Steam FIRST/);
assert.match(base.note,/stovetop steaming, not pressure cooking[\s\S]*Replace the purchased cooked-seitan item[\s\S]*Not gluten-free[\s\S]*165 F/);
const page={innerHTML:'',style:{}};
Object.assign(c,{recipeServ:{},document:{getElementById:()=>page},window:{scrollTo(){}}});
vm.runInContext(html.slice(html.indexOf('function baseServ('),html.indexOf('function closeRecipe(')),c);
vm.runInContext(html.slice(html.indexOf('function recipeCategory('),html.indexOf('function recipeCatEmoji(')),c);
assert.equal(c.recipeCategory(pie),'Baking & Sweets');assert.equal(c.recipeCategory(wings),'Asian-Inspired');
for(const r of [pie,wings,base]){
  c.openRecipe(r.id);assert.match(page.innerHTML,/HAVEN'T TRIED YET/);
  for(const text of [...r.ingredients,...r.steps])assert.ok(page.innerHTML.includes(text),'every quantity and direction must render');
  assert.ok(page.innerHTML.includes(r.note),'full method/storage/allergen notes must render');
  assert.equal((page.innerHTML.match(/data-ingredient-group="true"/g)||[]).length,r.ingredientGroups.length);
  assert.doesNotMatch(page.innerHTML,/fewer servings|more servings/);
  c.setServings(r.id,1);assert.deepEqual(c.recipeServ,{});
}
for(const r of all.filter(r=>!r.ingredientGroups)){
  const old=(r.ingredients||[]).map(i=>'<li style="margin-bottom:6px;font-size:13px;color:var(--text);font-family:\'Lora\',serif;line-height:1.5">'+c.scaleIngredient(i,1)+'</li>').join('');
  assert.equal(c.recipeIngredientsHtml(r,1),old,'all ungrouped recipe ingredient markup must stay unchanged');
}
const recipeVersion=html.match(/recipes\.js\?v=(\d{14})/)?.[1];
assert.equal(recipeVersion,html.match(/HG_BUILD_STAMP='(\d{14})'/)?.[1]);
console.log('Pumpkin pie and seitan wings complete-detail, grouping, quantities, trial status and legacy-render checks passed.');
