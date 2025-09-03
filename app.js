// Thème + bouton
(function () {
  const html = document.documentElement;
  const saved = localStorage.getItem("theme");
  html.setAttribute(
    "data-theme",
    saved === "light" || saved === "dark"
      ? saved
      : matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );
  const btn = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const label = document.getElementById("themeLabel");
  function update() {
    const dark = html.getAttribute("data-theme") === "dark";
    if (icon) icon.textContent = dark ? "🌙" : "🌞";
    if (label) label.textContent = dark ? "Mode sombre" : "Mode clair";
  }
  if (btn) {
    btn.addEventListener("click", () => {
      const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      update();
    });
  }
  update();
})();

// Apparition au scroll
(function revealOnScroll(){
  const els=[...document.querySelectorAll('.reveal')];
  if(!els.length) return;
  if(!('IntersectionObserver' in window)){ els.forEach(el=>el.classList.add('in')); return; }
  const io=new IntersectionObserver((entries)=>{ entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }); },{threshold:.15});
  els.forEach(el=>io.observe(el));
})();

// Tilt subtil sur les .panel
(function tilt(){
  document.querySelectorAll('.panel').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
      const rx=((y/r.height)-.5)*4, ry=((x/r.width)-.5)*-4;
      card.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave',()=> card.style.transform='');
  });
})();

// Ripple léger sur tous les <button>
(function rippleAll(){
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const r=document.createElement('span'); const rect=btn.getBoundingClientRect();
    Object.assign(r.style,{
      position:'absolute', borderRadius:'999px', pointerEvents:'none', transform:'translate(-50%, -50%)',
      left:(e.clientX-rect.left)+'px', top:(e.clientY-rect.top)+'px',
      width:Math.max(rect.width,rect.height)*1.2+'px', height:Math.max(rect.width,rect.height)*1.2+'px',
      background:'rgba(255,255,255,.35)', opacity:'0', transition:'opacity .6s ease',
    });
    btn.appendChild(r);
    requestAnimationFrame(()=>{r.style.opacity='1'; setTimeout(()=>{r.style.opacity='0'; setTimeout(()=>r.remove(),600)},180)});
  });
})();

// Fonds jour/nuit par data-attributes sur <body>
(async function setBackgrounds(){
  const body = document.body;
  const day = document.querySelector('.page-bg');
  const night = document.querySelector('.page-bg-night');
  if(!day || !night) return;
  const DAY_PRIMARY = body.getAttribute('data-bg-day') || 'camping.jpg';
  const NIGHT_PRIMARY = body.getAttribute('data-bg-night') || 'camping-nuit.jpg';
  const DAY_FALLBACK = 'camping.jpg';
  const NIGHT_FALLBACK = 'camping-nuit.jpg';

  function canLoad(src){ return new Promise(res=>{ const im=new Image(); im.onload=()=>res(true); im.onerror=()=>res(false); im.src=src+'?v='+Date.now(); });}

  const daySrc   = (await canLoad(DAY_PRIMARY))   ? DAY_PRIMARY   : DAY_FALLBACK;
  const nightSrc = (await canLoad(NIGHT_PRIMARY)) ? NIGHT_PRIMARY : NIGHT_FALLBACK;

  day.style.backgroundImage = `url("${daySrc}")`;
  night.style.backgroundImage = `url("${nightSrc}")`;
})();

// --- Netlify Identity: Sign up / Sign in / Sign out ---
(function identityInit(){
  function byId(id){ return document.getElementById(id); }
  const btn = byId('accountBtn');
  const nameSpan = byId('userName');

  function updateUser(user){
    if(!btn) return;
    if(user){
      const label = (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || user.email;
      if(nameSpan) nameSpan.textContent = label;
      btn.textContent = 'Se déconnecter';
      btn.onclick = () => window.netlifyIdentity && netlifyIdentity.logout();
    }else{
      if(nameSpan) nameSpan.textContent = '';
      btn.textContent = 'Se connecter';
      btn.onclick = () => window.netlifyIdentity && netlifyIdentity.open('login');
    }
  }

  if(!window.netlifyIdentity){ return; }
  netlifyIdentity.on('init',   user => updateUser(user));
  netlifyIdentity.on('login',  user => { updateUser(user); netlifyIdentity.close(); });
  netlifyIdentity.on('signup', user => { updateUser(user); netlifyIdentity.close(); });
  netlifyIdentity.on('logout', ()   => { updateUser(null); });

  netlifyIdentity.init();
})();