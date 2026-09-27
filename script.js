/* =======================================================
   EDIT DI SINI: nama, usia, dan isi pesan surat
   ======================================================= */
const config = {
  name: "Aisah",
  age: 27,
  message: `Halo, Aisah.

Semoga hari ini kamu bangun dengan perasaan baik, dan semoga sepanjang hari nanti banyak hal kecil yang bikin kamu senyum sendiri tanpa sadar.

Aku cuma mau bilang, selamat ulang tahun. Semoga di umur yang baru ini kamu makin sehat, makin tenang sama pilihan-pilihan hidupmu, dan makin sayang sama diri sendiri.

Semoga kerja keras kamu selama ini pelan-pelan kebayar, semoga rejekimu lancar, dan semoga kamu selalu dikelilingi orang-orang yang bikin kamu ngerasa aman buat jadi diri sendiri.

Kalau hari ini capek, semoga ada waktu buat istirahat. Kalau lagi seneng, semoga makin banyak momen kayak gitu yang datang.

Selamat ulang tahun, Aisah. Semoga selalu baik-baik aja, di mana pun dan sama siapa pun kamu nanti 🐾💙`,
  subtitle: "Semoga tahun ini penuh hal baik & banyak kucing gemas ✨"
};
/* ======================================================= */

document.getElementById('env-name').textContent = config.name;
document.getElementById('letter-name').textContent = config.name;
document.getElementById('title-name').textContent = config.name;
document.getElementById('subtitle-text').textContent = config.subtitle;
const ageStr = String(config.age).padStart(2,'0');
document.getElementById('age-d1').textContent = ageStr[0];
document.getElementById('age-d2').textContent = ageStr[1];

/* ---------- cat GIFs are loaded as local files (see index.html <img src="assets/...">).
   Taruh 3 file gambar di folder assets/ (sejajar dengan index.html) dengan nama:
   assets/cat1.gif, assets/cat2.gif, assets/cat-happy.gif
   Kalau formatnya bukan .gif (misal .webp/.png/.jpg), ganti ekstensinya langsung
   di index.html pada tag <img> yang berisi id="gif-1", "gif-2", dan "gif-happy".
   Kalau file belum ada / gagal dimuat, stiker itu otomatis sembunyi (tidak
   menampilkan ikon gambar rusak). ---------- */

/* ---------- ambient bubbles ---------- */
const bubbleWrap = document.getElementById('bubbles');
for(let i=0;i<14;i++){
  const b = document.createElement('div');
  b.className='bubble';
  const size = 5+Math.random()*14;
  b.style.width=b.style.height=size+'px';
  b.style.left=Math.random()*100+'%';
  b.style.setProperty('--x',(Math.random()*60-30)+'px');
  b.style.animationDuration=(7+Math.random()*8)+'s';
  b.style.animationDelay=(Math.random()*8)+'s';
  bubbleWrap.appendChild(b);
}

/* ---------- 3D parallax: stickers + envelope tilt toward cursor (desktop/mouse only) ---------- */
const stickers = document.querySelectorAll('.sticker, .gif-sticker');
const envelope = document.getElementById('envelope');
const finePointer = window.matchMedia('(pointer: fine)').matches;
window.addEventListener('pointermove', (e)=>{
  const px = e.clientX/innerWidth - 0.5, py = e.clientY/innerHeight - 0.5;
  stickers.forEach(s=>{
    const depth = parseFloat(s.dataset.depth)||0.4;
    s.style.transform = `translate3d(${-px*40*depth}px, ${-py*40*depth}px, 0) rotate(${px*10*depth}deg)`;
  });
  if(finePointer && envelope && !envelope.classList.contains('open')){
    envelope.style.transform = `rotateY(${px*18}deg) rotateX(${-py*18}deg)`;
  }
});

/* ---------- GSAP entrance choreography ---------- */
if(window.gsap){
  gsap.set(['.st1','.st2','.st3','.st4','.st5','.st6','.st7','.st8','.gg1','.gg2'], {opacity:0, scale:.3});
  gsap.to(['.st1','.st2','.st3','.st4','.st5','.st6','.st7','.st8','.gg1','.gg2'], {
    opacity:.92, scale:1, duration:.9, stagger:0.08, delay:.3, ease:'back.out(2.2)'
  });
  gsap.fromTo('.tap-text', {opacity:0,y:10}, {opacity:.9,y:0,duration:.6,delay:1.1});
}

/* ---------- paw-print cursor trail ---------- */
const pawWrap = document.getElementById('pawtrail');
let lastPaw = 0, pawFlip = 1;
window.addEventListener('pointermove', (e)=>{
  const now = Date.now();
  if(now - lastPaw < 140) return;
  lastPaw = now; pawFlip *= -1;
  const p = document.createElement('div');
  p.className='paw-mark';
  p.style.left = e.clientX+'px'; p.style.top = e.clientY+'px';
  p.style.transform = `translate(-50%,-50%) scale(.6) scaleX(${pawFlip})`;
  p.innerHTML = '<svg width="16" height="16" viewBox="0 0 64 64" fill="currentColor"><ellipse cx="32" cy="42" rx="16" ry="13"/><circle cx="14" cy="22" r="7.5"/><circle cx="32" cy="14" r="8"/><circle cx="50" cy="22" r="7.5"/></svg>';
  pawWrap.appendChild(p);
  setTimeout(()=>p.remove(),900);
});

/* ---------- floating hearts helper ---------- */
const heartsWrap = document.getElementById('hearts-float');
function spawnHeart(x,y){
  const h = document.createElement('div');
  h.className='float-heart'; h.textContent = Math.random()>.5?'💗':'✨';
  h.style.left = x+'px'; h.style.top = y+'px';
  heartsWrap.appendChild(h);
  setTimeout(()=>h.remove(),2500);
}

/* ---------- audio (Web Audio, no external files) ---------- */
let audioCtx;
function ensureAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==='suspended') audioCtx.resume();
}
function tone(freq,dur=0.18,type='sine',vol=0.14,delay=0){
  if(!audioCtx) return;
  const t0=audioCtx.currentTime+delay;
  const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
  osc.type=type; osc.frequency.value=freq;
  gain.gain.setValueAtTime(0,t0);
  gain.gain.linearRampToValueAtTime(vol,t0+0.02);
  gain.gain.exponentialRampToValueAtTime(0.001,t0+dur);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t0); osc.stop(t0+dur+0.05);
}
function whoosh(){
  ensureAudio(); if(!audioCtx) return;
  const len=audioCtx.sampleRate*0.35;
  const buf=audioCtx.createBuffer(1,len,audioCtx.sampleRate);
  const data=buf.getChannelData(0);
  for(let i=0;i<len;i++) data[i]=(Math.random()*2-1)*(1-i/len);
  const src=audioCtx.createBufferSource(); src.buffer=buf;
  const filt=audioCtx.createBiquadFilter(); filt.type='bandpass'; filt.frequency.value=900;
  const gain=audioCtx.createGain(); gain.gain.value=0.18;
  src.connect(filt).connect(gain).connect(audioCtx.destination);
  src.start();
}
function meow(){ tone(660,.12,'triangle',.12,0); tone(880,.14,'triangle',.1,.09); }
function nomSound(){ tone(320,.08,'square',.08,0); }
function blowSound(){ ensureAudio(); if(!audioCtx) return; const len=audioCtx.sampleRate*0.25; const buf=audioCtx.createBuffer(1,len,audioCtx.sampleRate); const d=buf.getChannelData(0); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*(1-i/len)*.6; const src=audioCtx.createBufferSource(); src.buffer=buf; const g=audioCtx.createGain(); g.gain.value=.2; src.connect(g).connect(audioCtx.destination); src.start(); }
function chime(){ [523,659,784,1047].forEach((f,i)=>tone(f,0.5,'triangle',0.11,i*0.12)); }

/* ---------- confetti: hearts, paws & real cat emoji via canvas-confetti shapes ---------- */
const confettiCanvas = document.getElementById('confetti-canvas');
const myConfetti = window.confetti ? confetti.create(confettiCanvas, {resize:true, useWorker:true}) : null;
let catShape=null, pawShape=null, heartShape=null;
if(myConfetti && confetti.shapeFromText){
  catShape = confetti.shapeFromText({text:'🐱', scalar:2.6});
  pawShape = confetti.shapeFromText({text:'🐾', scalar:2.2});
  heartShape = confetti.shapeFromText({text:'💗', scalar:2.2});
}
function burstConfetti(big){
  if(!myConfetti) return;
  const base = {origin:{y:.4}, gravity:.9, startVelocity: big?52:36, ticks:220};
  if(catShape){
    myConfetti({...base, particleCount: big?28:10, shapes:[catShape,pawShape,heartShape], scalar:1});
  }
  myConfetti({...base, particleCount: big?60:24, colors:['#ffafc7','#9b7fd4','#f7c873','#fff6ea']});
}

/* ---------- balloons (heart / paw emoji) ---------- */
function launchBalloons(){
  const wrap=document.getElementById('balloons');
  const emojis=['🎈','💗','🐾'];
  for(let i=0;i<12;i++){
    const el=document.createElement('div');
    el.className='balloon'; el.textContent=emojis[i%emojis.length];
    el.style.left=(5+Math.random()*90)+'%';
    el.style.setProperty('--bx',(Math.random()*80-40)+'px');
    el.style.setProperty('--br',(Math.random()*40-20)+'deg');
    el.style.animationDuration=(6+Math.random()*5)+'s';
    el.style.animationDelay=(Math.random()*2)+'s';
    wrap.appendChild(el);
  }
}

/* ---------- stage flow ---------- */
const stageEnvelope=document.getElementById('stage-envelope');
const stageLetter=document.getElementById('stage-letter');
const stageCake=document.getElementById('stage-cake');
const letterPaper=document.getElementById('letter-paper');
const letterText=document.getElementById('letter-text');

let typing=false, typeTimer=null;

envelope.addEventListener('click',()=>{
  if(envelope.classList.contains('open')) return;
  ensureAudio(); whoosh(); meow();
  envelope.classList.add('open');
  envelope.style.transform='';
  if(window.gsap){
    gsap.to(envelope,{y:-26,scale:1.06,rotateY:0,rotateX:0,duration:.5,ease:'power2.out'});
  }
  burstConfetti(false);
  setTimeout(()=>{
    stageEnvelope.classList.add('hidden');
    stageLetter.classList.remove('hidden');
    if(window.gsap) gsap.fromTo('#letter-paper',{y:50,scale:.8,rotate:-3,opacity:0},{y:0,scale:1,rotate:0,opacity:1,duration:.8,ease:'back.out(1.6)'});
    startTyping();
  },900);
});

function startTyping(){
  typing=true; letterText.textContent=''; let i=0;
  const text=config.message; const rect=()=>letterPaper.getBoundingClientRect();
  typeTimer=setInterval(()=>{
    letterText.textContent+=text[i]; i++;
    if(i%18===0){ const r=rect(); spawnHeart(r.left+r.width*Math.random(), r.top+20); }
    if(i>=text.length){ clearInterval(typeTimer); typing=false; }
  },30);
}

const letterNextBtn = document.getElementById('letter-next-btn');
letterNextBtn.addEventListener('click',()=>{
  if(typing){
    clearInterval(typeTimer);
    letterText.textContent=config.message;
    typing=false;
    return; // biarkan orang baca dulu, baru tap lagi buat lanjut
  }
  closeLetter();
});

function closeLetter(){
  if(window.gsap){
    gsap.to('#letter-paper',{y:60,scale:.6,rotate:6,opacity:0,duration:.55,ease:'power2.in'});
  } else {
    letterPaper.style.transition='transform .55s ease, opacity .55s ease';
    letterPaper.style.transform='translateY(60px) scale(.7)';
    letterPaper.style.opacity='0';
  }
  setTimeout(()=>{
    stageLetter.classList.add('hidden');
    stageCake.classList.remove('hidden');
    try{ startFeedGame(); }catch(err){ console.error('[feed-game] gagal mulai:', err); }
  },650);
}

/* ---------- Stage 3a: tap-to-pet mini game (simple, low-risk interaction) ---------- */
const gameArea = document.getElementById('game-area');
const catSprite = document.getElementById('cat-sprite');
const scoreCountEl = document.getElementById('score-count');
const scoreTarget = parseInt(document.getElementById('score-target').textContent,10);
const loveFillEl = document.getElementById('love-fill');
let score=0, gameOn=false;

function startFeedGame(){
  if(!gameArea){ console.error('[pet-game] #game-area tidak ditemukan di HTML — cek id nya cocok atau nggak.'); return; }
  score=0; scoreCountEl.textContent='0'; gameOn=true;
  updateLoveFill();
  gameArea.addEventListener('click', handleCatTap);
  gameArea.addEventListener('touchend', handleTouchTap, {passive:true});
}
function handleTouchTap(e){
  e.preventDefault?.();
  handleCatTap();
}
function handleCatTap(){
  if(!gameOn) return;
  score++; scoreCountEl.textContent=score;
  ensureAudio(); nomSound();
  catSprite.classList.add('nom');
  setTimeout(()=>catSprite.classList.remove('nom'),160);
  const r=catSprite.getBoundingClientRect();
  spawnHeart(r.left+r.width/2+(Math.random()*40-20), r.top+Math.random()*10);
  updateLoveFill();
  if(score>=scoreTarget) finishGame();
}
function updateLoveFill(){
  if(!loveFillEl) return;
  loveFillEl.style.width = Math.min(100,(score/scoreTarget)*100)+'%';
}
function finishGame(){
  gameOn=false;
  gameArea.removeEventListener('click', handleCatTap);
  gameArea.removeEventListener('touchend', handleTouchTap);
  const game=document.getElementById('feed-game');
  const content=document.getElementById('cake-content');
  if(window.gsap){
    gsap.to(game,{opacity:0,scale:.8,duration:.4,onComplete:()=>{game.style.display='none';}});
  } else { game.style.display='none'; }
  setTimeout(()=>{
    content.classList.remove('hidden');
    if(window.gsap){
      gsap.fromTo('.bday-title',{opacity:0,y:-20,rotateX:60},{opacity:1,y:0,rotateX:0,duration:.7,ease:'back.out(1.8)'});
      gsap.fromTo('.cake-wrap',{opacity:0,scale:.4,rotateY:100},{opacity:1,scale:1,rotateY:0,duration:1,delay:.15,ease:'back.out(1.7)'});
      gsap.fromTo('.candle-hint',{opacity:0},{opacity:1,duration:.6,delay:.7});
    }
    chime();
  },450);
}

/* ---------- blow out candles → final reveal ---------- */
let blownCount=0;
document.querySelectorAll('.candle').forEach(c=>{
  c.addEventListener('click',()=>{
    if(c.classList.contains('blown')) return;
    ensureAudio(); blowSound();
    c.classList.add('blown'); blownCount++;
    if(window.gsap) gsap.fromTo(c,{y:0},{y:-6,duration:.15,yoyo:true,repeat:1});
    if(blownCount>=2){
      setTimeout(()=>{
        const box=document.getElementById('reveal-box');
        box.classList.remove('hidden');
        if(window.gsap){
          gsap.fromTo(box,{opacity:0,y:20,scale:.85},{opacity:1,y:0,scale:1,duration:.7,ease:'back.out(1.6)'});
        }
        chime(); burstConfetti(true); launchBalloons();
      },300);
    }
  });
});

document.getElementById('cake-wrap').addEventListener('click',(e)=>{
  if(e.target.closest('.candle')) return;
  ensureAudio();
  if(window.gsap) gsap.fromTo('.cake-wrap',{rotate:0},{rotate:2,duration:.1,yoyo:true,repeat:3,ease:'power1.inOut'});
});
