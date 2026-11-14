const assert=require('assert/strict');const {fixture}=require('./starter-workout.test.js');
const f=fixture(),c=f.c;c.meals=0;c.bottles=0;
const expected=['counter-pushup.png','mini-squat.png','supported-row.png','hip-hinge.png','suitcase-hold.png'];
const fs=require('fs'),path=require('path');for(const name of expected){const bytes=fs.readFileSync(path.join(__dirname,'..','images','starter-form',name));assert.equal(bytes.subarray(1,4).toString(),'PNG');assert.equal(bytes.readUInt32BE(16),800);assert.equal(bytes.readUInt32BE(20),420);}
assert.equal(c.starterConfig().exercises.length,4);assert.equal(c.starterConfig().startDate,'2026-11-14');
for(let i=0;i<5;i++){c.starterNavigate(1);assert.match(c.surface,new RegExp('images/starter-form/'+expected[i].replace('.','\\.')));assert.match(c.surface,/width="800" height="420" loading="eager"/);assert.match(c.surface,/<figcaption>[^<]+<\/figcaption>/);assert.match(c.surface,/alt="[^"]{40,}"/);assert.equal(f.writes.length,0,'images and gated previews never log completion');}
assert.match(c.surface,/Not a fifth required exercise/);assert.equal((c.surface.match(/suitcase-hold\.png/g)||[]).length,1);assert.equal(c.starterUi('2026-11-14').step,5);assert.equal(c.starterCanBegin('2026-11-14'),false);assert.doesNotMatch(c.starterFormHtml('unknown'),/img/);
console.log('Form image integration: four inline steps plus optional Finish hold, intrinsic dimensions/alt/cues and gated no-write previews passed');
