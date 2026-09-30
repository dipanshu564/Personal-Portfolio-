import './styles.css'
import * as THREE from 'three'

const RM=matchMedia('(prefers-reduced-motion: reduce)').matches, MOB=innerWidth<820;
setTimeout(()=>document.getElementById('load').classList.add('gone'),RM?0:900);
// nav
const nav=document.getElementById('nav'),bg=document.getElementById('burger');
bg.onclick=()=>{const o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',String(o))};
nav.querySelectorAll<HTMLAnchorElement>('a').forEach(a=>a.onclick=()=>{nav.classList.remove('open');bg.setAttribute('aria-expanded','false')});
const links=[...nav.querySelectorAll<HTMLAnchorElement>('a')];
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
document.querySelectorAll('section[id]').forEach(s=>so.observe(s));
// reveal
const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll<HTMLElement>('.rv').forEach(el=>ro.observe(el));
// projects expand
document.querySelectorAll<HTMLElement>('.pc .h').forEach(b=>b.onclick=()=>{const c=b.parentElement,o=c.classList.toggle('open');b.setAttribute('aria-expanded',String(o))});
// tilt + magnetic
if(!RM&&matchMedia('(hover:hover)').matches){
 document.querySelectorAll<HTMLElement>('.pc').forEach(c=>{c.onmousemove=e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(900px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`};c.onmouseleave=()=>c.style.transform=''});
 document.querySelectorAll<HTMLElement>('.mag').forEach(b=>{b.onmousemove=e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.15}px,${(e.clientY-r.top-r.height/2)*.25}px)`};b.onmouseleave=()=>b.style.transform=''});
}
// 3D
(function(){
 
 const cv=document.getElementById('bg'),r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:false});
 r.setPixelRatio(Math.min(devicePixelRatio,1.5));
 const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,100);cam.position.z=8;
 const N=MOB?350:900,pos=new Float32Array(N*3);
 for(let i=0;i<N*3;i++)pos[i]=(Math.random()-.5)*(i%3==2?16:26);
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));
 const pts=new THREE.Points(g,new THREE.PointsMaterial({color:0x8fb8ff,size:.035,transparent:true,opacity:.7}));sc.add(pts);
 const mk=(geo:THREE.BufferGeometry,c:number,x:number,y:number,z:number)=>{const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:c,wireframe:true,transparent:true,opacity:.22}));m.position.set(x,y,z);sc.add(m);return m};
 const a=mk(new THREE.IcosahedronGeometry(2,1),0x7fd6c9,4.2,.4,-3),b=mk(new THREE.TorusGeometry(1.1,.02,8,60),0x8b9cff,-5,-2,-2),c=mk(new THREE.OctahedronGeometry(1),0x8b9cff,-3.5,2.5,-4);
 let mx=0,my=0,sy=0;
 addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;const p=document.getElementById('pt');if(!RM&&p)p.style.transform=`perspective(800px) rotateY(${mx*8}deg) rotateX(${-my*6}deg)`});
 function size(){r.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
 addEventListener('resize',size);size();
 let vis=true;document.addEventListener('visibilitychange',()=>{vis=!document.hidden;if(vis)loop()});
 function loop(t:number=0){if(!vis)return;const s=t*.0001;
  if(!RM){pts.rotation.y=s*.6;a.rotation.set(s*2,s*3,0);b.rotation.set(s*4,s*2,0);c.rotation.set(s*3,0,s*2);
   sy+=(scrollY/innerHeight-sy)*.06;cam.position.x+=(mx*1.2-cam.position.x)*.04;cam.position.y+=(-my*.8-sy*.6-cam.position.y)*.04;cam.lookAt(0,-sy*.6,0)}
  r.render(sc,cam);if(!RM)requestAnimationFrame(loop)}
 loop();
})();
