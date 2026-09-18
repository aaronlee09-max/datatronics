(()=>{
const BASE="https://media.githubusercontent.com/media/aaronlee09-max/datatronics/main/";
const cache=new Map();
async function load(card){const p=card.dataset.file;if(!p||!/\\.(ttf|otf|woff|woff2)$/i.test(p))return;const els=card.querySelectorAll("[data-preview]");if(!els.length)return;try{let fam=cache.get(p);if(!fam){const r=await fetch(new URL(p,BASE),{cache:"force-cache",credentials:"omit"});if(!r.ok)throw Error("HTTP "+r.status);const b=await r.arrayBuffer();if(b.byteLength<1024)throw Error("invalid font");fam="FontoryAsset-"+Math.random().toString(36).slice(2);const face=await new FontFace(fam,b).load();document.fonts.add(face);cache.set(p,fam)}els.forEach(e=>e.style.setProperty("font-family",`"${fam}",sans-serif`,"important"))}catch(e){console.warn("Font asset load failed",p,e)}}
function scan(){document.querySelectorAll("#fontGrid .font-card").forEach(load)}
new MutationObserver(scan).observe(document.querySelector("#fontGrid")||document.body,{childList:true,subtree:true});scan();
})();
