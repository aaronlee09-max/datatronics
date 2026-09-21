(()=>{
  const BASE="https://media.githubusercontent.com/media/aaronlee09-max/datatronics/main/";
  const cache=new Map();
  const urlFor=(path)=>new URL(path,BASE).href;
  const familyFor=(path)=>"FontoryReal-"+btoa(unescape(encodeURIComponent(path))).replace(/[^a-zA-Z0-9]/g,"").slice(0,40);
  async function apply(card){
    const path=card.dataset.file; if(!path || !/\.(ttf|otf|woff|woff2)$/i.test(path)) return;
    const els=card.querySelectorAll("[data-preview]"); if(!els.length) return;
    const family=familyFor(path);
    try{
      if(!cache.has(path)){
        const r=await fetch(urlFor(path),{mode:"cors",credentials:"omit",cache:"force-cache"});
        if(!r.ok) throw new Error("HTTP "+r.status);
        const buf=await r.arrayBuffer();
        if(buf.byteLength<1024) throw new Error("invalid font data");
        const face=new FontFace(family,buf,{style:"normal",weight:"400"});
        const loaded=await face.load();
        if(loaded.status!=="loaded") throw new Error("font load failed");
        document.fonts.add(loaded); cache.set(path,family);
      }
      els.forEach(el=>{el.style.fontFamily=`"${family}", sans-serif`;el.classList.remove("preview-failed");});
    }catch(e){
      els.forEach(el=>{el.classList.add("preview-failed");});
      console.warn("Fontory real preview failed",path,e);
    }
  }
  function scan(){document.querySelectorAll("#fontGrid .font-card").forEach(apply);}
  const grid=document.querySelector("#fontGrid");
  if(grid) new MutationObserver(scan).observe(grid,{childList:true,subtree:true});
  scan();
})();
