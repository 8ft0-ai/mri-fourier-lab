const N = 128;
const source = document.querySelector('#source');
const spectrum = document.querySelector('#spectrum');
const reconstruction = document.querySelector('#reconstruction');
const keep = document.querySelector('#keep');
const pattern = document.querySelector('#pattern');
let pixels = new Float64Array(N * N);
let frequency = null;

function fft(re, im, inverse = false) {
  const n = re.length;
  for (let i=1,j=0;i<n;i++) { let bit=n>>1; for(;j&bit;bit>>=1) j^=bit; j^=bit; if(i<j){[re[i],re[j]]=[re[j],re[i]];[im[i],im[j]]=[im[j],im[i]];} }
  for(let len=2;len<=n;len<<=1){ const a=(inverse?2:-2)*Math.PI/len; const wr0=Math.cos(a),wi0=Math.sin(a); for(let i=0;i<n;i+=len){let wr=1,wi=0;for(let j=0;j<len/2;j++){const u=i+j,v=u+len/2,tr=re[v]*wr-im[v]*wi,ti=re[v]*wi+im[v]*wr;re[v]=re[u]-tr;im[v]=im[u]-ti;re[u]+=tr;im[u]+=ti;const x=wr*wr0-wi*wi0;wi=wr*wi0+wi*wr0;wr=x;}} }
  if(inverse) for(let i=0;i<n;i++){re[i]/=n;im[i]/=n;}
}

function fft2(input, inverse=false) {
  const re=Float64Array.from(input.re??input), im=Float64Array.from(input.im??new Float64Array(N*N));
  for(let y=0;y<N;y++){const r=re.slice(y*N,(y+1)*N),q=im.slice(y*N,(y+1)*N);fft(r,q,inverse);re.set(r,y*N);im.set(q,y*N);}
  for(let x=0;x<N;x++){const r=new Float64Array(N),q=new Float64Array(N);for(let y=0;y<N;y++){r[y]=re[y*N+x];q[y]=im[y*N+x];}fft(r,q,inverse);for(let y=0;y<N;y++){re[y*N+x]=r[y];im[y*N+x]=q[y];}}
  return {re,im};
}

function paint(canvas, data) { const ctx=canvas.getContext('2d'), image=ctx.createImageData(N,N); for(let i=0;i<data.length;i++){const v=Math.max(0,Math.min(255,Math.round(data[i])));image.data.set([v,v,v,255],i*4);}ctx.putImageData(image,0,0); }

function analyze() {
  frequency=fft2(pixels);
  const mags=new Float64Array(N*N); let max=0;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x,j=((y+N/2)%N)*N+(x+N/2)%N;const v=Math.log1p(Math.hypot(frequency.re[i],frequency.im[i]));mags[j]=v;max=Math.max(max,v);}
  paint(spectrum,Array.from(mags,v=>255*v/max)); update();
}

function update() {
  const pct=Number(keep.value); document.querySelector('#keepValue').textContent=pct+'%'; document.querySelector('#reconLabel').textContent=`Using the strongest ${pct}%`;
  const rank=Array.from(frequency.re,(v,i)=>({i,m:Math.hypot(v,frequency.im[i])})).sort((a,b)=>b.m-a.m); const count=Math.max(1,Math.floor(rank.length*pct/100));
  const re=new Float64Array(N*N),im=new Float64Array(N*N);for(let k=0;k<count;k++){const i=rank[k].i;re[i]=frequency.re[i];im[i]=frequency.im[i];}
  const out=fft2({re,im},true); paint(reconstruction,Array.from(out.re));
  let mse=0;for(let i=0;i<pixels.length;i++)mse+=(pixels[i]-out.re[i])**2;mse/=pixels.length;
  document.querySelector('#coefficientCount').textContent=`${count.toLocaleString()} / ${(N*N).toLocaleString()}`;
  document.querySelector('#discardedValue').textContent=`${100-pct}%`;
  document.querySelector('#errorValue').textContent=Math.sqrt(mse).toFixed(1)+' gray levels';
}

const lessons=[
  ['The spatial domain','An image is a grid of brightness values','Each pixel answers “how bright is this location?” The Fourier transform asks a different question: “how much of every possible repeating pattern is present?”','A pixel value','f(x, y)'],
  ['The forward transform','Test every frequency, direction, and phase','The transform correlates the image with waves. Each complex coefficient stores a wave’s strength (magnitude) and alignment (phase). Together, all coefficients preserve the complete image.','One coefficient','F(kx, ky) = magnitude × phase'],
  ['A compressed experiment','Keep the strongest contributors','The slider ranks coefficients by magnitude and removes the weakest. This is useful for intuition, although MRI usually selects locations in k-space rather than ranking their strength after acquisition.','Current experiment','keep strongest coefficients'],
  ['The inverse transform','Add the surviving waves together','The inverse Fourier transform adds each retained pattern with its stored magnitude and phase. Missing frequencies produce blur, ringing, or lost detail.','Reconstruction','f̂(x, y) = Σ F · wave']
];
function showLesson(i){document.querySelectorAll('.step').forEach((b,j)=>b.classList.toggle('active',i===j));const l=lessons[i];['lesson-kicker','lesson-heading','lesson-copy','equation-label','equation'].forEach((id,j)=>document.querySelector('#'+id).textContent=l[j]);}
document.querySelectorAll('.step').forEach((b,i)=>b.addEventListener('click',()=>showLesson(i)));

function texNumber(value){if(Math.abs(value)>=10000||Math.abs(value)<.01&&value!==0){const [m,e]=value.toExponential(2).split('e');return `${m}\\times10^{${Number(e)}}`;}return value.toFixed(2);}
function updateSelectedMath(fx,fy,i){const re=frequency.re[i],im=frequency.im[i],magnitude=Math.hypot(re,im),phase=Math.atan2(im,re),sign=im<0?'-':'+',phaseTerm=phase<0?`-${Math.abs(phase).toFixed(3)}`:`+${phase.toFixed(3)}`;document.querySelector('#selectedMathTitle').textContent=`Selected coefficient (${fx}, ${fy})`;document.querySelector('#selectedMathCopy').textContent=`This coefficient has magnitude ${magnitude.toFixed(2)} and phase ${phase.toFixed(3)} radians. Its wave repeats ${Math.abs(fx)} time(s) horizontally and ${Math.abs(fy)} time(s) vertically.`;const box=document.querySelector('#selectedMathTex');if(window.MathJax?.typesetClear)window.MathJax.typesetClear([box]);box.textContent=`\\[\\begin{aligned}F(${fx},${fy})&=${texNumber(re)}${sign}${texNumber(Math.abs(im))}i\\\\|F(${fx},${fy})|&=${texNumber(magnitude)}\\\\\\phi&=${phase.toFixed(3)}\\;\\text{rad}\\\\w_{${fx},${fy}}(x,y)&=\\cos\\!\\left(2\\pi\\left(\\frac{${fx}x}{${N}}+\\frac{${fy}y}{${N}}\\right)${phaseTerm}\\right)\\end{aligned}\\]`;if(window.MathJax?.typesetPromise)window.MathJax.typesetPromise([box]);}
function inspectFrequency(clientX,clientY){const r=spectrum.getBoundingClientRect(),sx=Math.max(0,Math.min(N-1,Math.floor((clientX-r.left)*N/r.width))),sy=Math.max(0,Math.min(N-1,Math.floor((clientY-r.top)*N/r.height))),fx=sx-N/2,fy=sy-N/2,i=((fy+N)%N)*N+((fx+N)%N),strength=Math.hypot(frequency.re[i],frequency.im[i]),dc=Math.max(1,Math.hypot(frequency.re[0],frequency.im[0]));const wave=new Float64Array(N*N);for(let y=0;y<N;y++)for(let x=0;x<N;x++)wave[y*N+x]=127.5+127.5*Math.cos(2*Math.PI*(fx*x+fy*y)/N);paint(pattern,wave);document.querySelector('#freqX').textContent=fx;document.querySelector('#freqY').textContent=fy;document.querySelector('#freqStrength').textContent=(100*strength/dc).toFixed(2)+'% of DC';const zero=fx===0&&fy===0;document.querySelector('#patternTitle').textContent=zero?'Constant brightness':`${Math.abs(fx)} × ${Math.abs(fy)} cycle pattern`;document.querySelector('#patternCopy').textContent=zero?'The centre point is the average image brightness (zero frequency).':`This wave repeats ${Math.abs(fx)} time(s) horizontally and ${Math.abs(fy)} time(s) vertically across the image.`;updateSelectedMath(fx,fy,i);}
spectrum.addEventListener('click',e=>inspectFrequency(e.clientX,e.clientY));

function drawExample(){const c=source.getContext('2d');c.fillStyle='#050505';c.fillRect(0,0,N,N);const g=c.createRadialGradient(66,58,5,64,64,54);g.addColorStop(0,'#f7f7f7');g.addColorStop(.45,'#bdbdbd');g.addColorStop(.47,'#353535');g.addColorStop(.7,'#8b8b8b');g.addColorStop(1,'#111');c.fillStyle=g;c.beginPath();c.ellipse(64,64,48,58,0,0,Math.PI*2);c.fill();c.fillStyle='#202020';c.beginPath();c.ellipse(51,64,12,30,-.12,0,Math.PI*2);c.ellipse(77,64,12,30,.12,0,Math.PI*2);c.fill();readCanvas();}
function readCanvas(){const d=source.getContext('2d').getImageData(0,0,N,N).data;for(let i=0;i<pixels.length;i++)pixels[i]=.299*d[i*4]+.587*d[i*4+1]+.114*d[i*4+2];analyze();}
document.querySelector('#file').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const img=new Image();img.onload=()=>{const c=source.getContext('2d');c.fillStyle='#000';c.fillRect(0,0,N,N);const s=Math.min(N/img.width,N/img.height),w=img.width*s,h=img.height*s;c.drawImage(img,(N-w)/2,(N-h)/2,w,h);readCanvas();URL.revokeObjectURL(img.src)};img.src=URL.createObjectURL(f);});
keep.addEventListener('input',update);document.querySelector('#example').addEventListener('click',drawExample);drawExample();inspectFrequency(spectrum.getBoundingClientRect().left+spectrum.clientWidth/2,spectrum.getBoundingClientRect().top+spectrum.clientHeight/2);
