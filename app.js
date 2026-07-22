const N = 128;
const source = document.querySelector('#source');
const spectrum = document.querySelector('#spectrum');
const reconstruction = document.querySelector('#reconstruction');
const keep = document.querySelector('#keep');
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
}

function drawExample(){const c=source.getContext('2d');c.fillStyle='#050505';c.fillRect(0,0,N,N);const g=c.createRadialGradient(66,58,5,64,64,54);g.addColorStop(0,'#f7f7f7');g.addColorStop(.45,'#bdbdbd');g.addColorStop(.47,'#353535');g.addColorStop(.7,'#8b8b8b');g.addColorStop(1,'#111');c.fillStyle=g;c.beginPath();c.ellipse(64,64,48,58,0,0,Math.PI*2);c.fill();c.fillStyle='#202020';c.beginPath();c.ellipse(51,64,12,30,-.12,0,Math.PI*2);c.ellipse(77,64,12,30,.12,0,Math.PI*2);c.fill();readCanvas();}
function readCanvas(){const d=source.getContext('2d').getImageData(0,0,N,N).data;for(let i=0;i<pixels.length;i++)pixels[i]=.299*d[i*4]+.587*d[i*4+1]+.114*d[i*4+2];analyze();}
document.querySelector('#file').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const img=new Image();img.onload=()=>{const c=source.getContext('2d');c.fillStyle='#000';c.fillRect(0,0,N,N);const s=Math.min(N/img.width,N/img.height),w=img.width*s,h=img.height*s;c.drawImage(img,(N-w)/2,(N-h)/2,w,h);readCanvas();URL.revokeObjectURL(img.src)};img.src=URL.createObjectURL(f);});
keep.addEventListener('input',update);document.querySelector('#example').addEventListener('click',drawExample);drawExample();
