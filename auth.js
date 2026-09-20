(()=>{
  const USER_HASH="ef8236567ac1d6f219fbea81a0793cd9cbcdc3e1bce3c526b4bf89955cb82585";
  const PASS_HASH="616a9175d6b1ac13f79a1d982424ad84356ea4d9e0fd376a662751e73ec187a5";
  const KEY="fontory-auth-v1";
  const esc=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const hash=async s=>{
    const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
  };
  const ok=()=>sessionStorage.getItem(KEY)==='ok';
  function mount(){
    document.body.classList.add('auth-locked');
    const box=document.createElement('div');
    box.id='fontoryAuth';
    box.innerHTML='<div class="auth-card"><div class="auth-mark">FONTORY</div><h1>글꼴 보관소</h1><p>사이트에 접속하려면 아이디와 비밀번호를 입력하세요.</p><form id="authForm"><label>아이디<input id="authUser" autocomplete="username" required></label><label>비밀번호<input id="authPass" type="password" autocomplete="current-password" required></label><button type="submit">접속하기</button><div id="authError" role="alert"></div></form><small>Fontory · private access</small></div>';
    document.body.appendChild(box);
    document.querySelector('#authUser').focus();
    document.querySelector('#authForm').addEventListener('submit',async e=>{
      e.preventDefault();
      const u=document.querySelector('#authUser').value.trim();
      const p=document.querySelector('#authPass').value;
      const [uh,ph]=await Promise.all([hash(u),hash(p)]);
      if(uh===USER_HASH&&ph===PASS_HASH){sessionStorage.setItem(KEY,'ok');unlock();}
      else document.querySelector('#authError').textContent='아이디 또는 비밀번호가 올바르지 않습니다.';
    });
  }
  function unlock(){
    document.body.classList.remove('auth-locked');
    document.querySelector('#fontoryAuth')?.remove();
    const logout=document.createElement('button');
    logout.type='button'; logout.className='auth-logout'; logout.textContent='로그아웃';
    logout.addEventListener('click',()=>{sessionStorage.removeItem(KEY);location.reload();});
    document.querySelector('.topbar')?.appendChild(logout);
  }
  if(ok()){
    document.addEventListener('DOMContentLoaded',unlock,{once:true});
  }else{
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount,{once:true}); else mount();
  }
})();
