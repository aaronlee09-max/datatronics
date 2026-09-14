const fonts=[
  {name:"호승쌤체",category:"Handwriting",preview:"오늘도 예쁘게 기록해요",description:"손글씨 느낌의 폰트",file:null},
  {name:"폰트 준비 중",category:"Coming soon",preview:"Aa 가나다 123",description:"다음 폰트를 순차적으로 추가 예정",file:null}
];
const selected=new Set();
const grid=document.querySelector('#fontGrid'),count=document.querySelector('#count'),empty=document.querySelector('#empty'),search=document.querySelector('#search');

function render(){
 const q=search.value.trim().toLowerCase();
 const list=fonts.filter(f=>`${f.name} ${f.category} ${f.description}`.toLowerCase().includes(q));
 count.textContent=`${list.length} font${list.length===1?'':'s'}`;
 empty.hidden=list.length!==0;
 grid.innerHTML=list.map((f,i)=>`<article class="font-card ${selected.has(f.name)?'selected':''}">
  <label class="select-row"><input class="font-check" type="checkbox" data-font="${escapeAttr(f.name)}" ${selected.has(f.name)?'checked':''} ${!f.file?'disabled':''}><span>담기</span></label>
  <div class="font-meta"><span class="font-name">${escapeHtml(f.name)}</span><span class="tag">${escapeHtml(f.category)}</span></div>
  <div class="preview">${escapeHtml(f.preview)}</div><div class="font-info">${escapeHtml(f.description)}</div>
  <div class="actions">${f.file?`<a class="download" href="${encodeURI(f.file)}" download>다운로드</a>`:'<button class="download" type="button" disabled style="opacity:.45">파일 준비 중</button>'}<button class="details" type="button" data-copy="${escapeAttr(f.name)}">이름 복사</button></div>
 </article>`).join('');
 grid.querySelectorAll('.font-check').forEach(b=>b.addEventListener('change',()=>{b.checked?selected.add(b.dataset.font):selected.delete(b.dataset.font);render();}));
 grid.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);const old=b.textContent;b.textContent='복사됨 ✓';setTimeout(()=>b.textContent=old,1000)}catch{}}));
 updateBuilder();
}
function updateBuilder(){
 const bar=document.querySelector('#selectionBar'),names=document.querySelector('#selectedNames'),btn=document.querySelector('#makeProfile');
 if(!bar)return; const chosen=fonts.filter(f=>selected.has(f.name)&&f.file);
 bar.hidden=chosen.length===0; names.textContent=chosen.length?`${chosen.length}개 선택 · ${chosen.map(f=>f.name).join(', ')}`:'';
 btn.disabled=chosen.length===0;
}
async function makeMobileConfig(){
 const chosen=fonts.filter(f=>selected.has(f.name)&&f.file); if(!chosen.length)return;
 const payloads=[];
 for(const f of chosen){const r=await fetch(f.file);if(!r.ok)throw new Error(`${f.name} 파일을 불러오지 못했습니다.`);const blob=await r.blob();const base64=await blobToBase64(blob);payloads.push({name:f.name,data:base64,mime:blob.type||'font/ttf'});}
 const uuid=()=>crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`;
 const fontPayloads=payloads.map(p=>`<dict><key>PayloadType</key><string>com.apple.font</string><key>PayloadVersion</key><integer>1</integer><key>PayloadIdentifier</key><string>fonts.${escapeXml(uuid())}</string><key>PayloadUUID</key><string>${escapeXml(uuid())}</string><key>PayloadDisplayName</key><string>${escapeXml(p.name)}</string><key>PayloadContent</key><data>${p.data}</data></dict>`).join('');
 const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict><key>PayloadContent</key><array>${fontPayloads}</array><key>PayloadDisplayName</key><string>iPhone Fonts · 선택한 폰트</string><key>PayloadIdentifier</key><string>datatronics.iphone-fonts.${uuid()}</string><key>PayloadOrganization</key><string>iPhone Fonts</string><key>PayloadRemovalDisallowed</key><false/><key>PayloadType</key><string>Configuration</string><key>PayloadUUID</key><string>${uuid()}</string><key>PayloadVersion</key><integer>1</integer></dict></plist>`;
 const blob=new Blob([xml],{type:'application/x-apple-aspen-config'}); const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='iPhone-Fonts.mobileconfig';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function blobToBase64(blob){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result).split(',')[1]);r.onerror=reject;r.readAsDataURL(blob);});}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function escapeAttr(s){return escapeHtml(s)}function escapeXml(s){return escapeHtml(s)}
search.addEventListener('input',render);document.querySelector('#themeBtn').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('font-theme',document.body.classList.contains('dark')?'dark':'light')});document.querySelector('#makeProfile')?.addEventListener('click',()=>makeMobileConfig().catch(e=>alert(e.message)));
if(localStorage.getItem('font-theme')==='dark')document.body.classList.add('dark');render();
