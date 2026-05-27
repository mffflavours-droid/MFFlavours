import { useState, useEffect } from "react";

const tg = window.Telegram?.WebApp;
const SUPA_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function db(path) {
  const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
  });
  return res.json();
}

// ── THEME ─────────────────────────────────────────────────────────────────────
const G="#C9A84C",GL="#F0D98A",GD="#8B6914";
const BG="#0A0A0A",S1="#111",S2="#161616",S3="#1E1E1E",S4="#2A2A2A";
const T="#F5EDD6",MT="#777";

// ── ICONS ─────────────────────────────────────────────────────────────────────
const Ico=({d,size=20})=>(<svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d={d}/></svg>);
const PH={
  cart:"M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13M10 19a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z",
  back:"M15 19l-7-7 7-7",
  plus:"M12 4v16m8-8H4",
  minus:"M20 12H4",
  menu:"M4 6h16M4 12h16M4 18h16",
  tg:"M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z",
  sig:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z",
};

// ── PARTICLES ─────────────────────────────────────────────────────────────────
function Particles() {
  const dots = [...Array(12)].map(() => ({
    x: 10+Math.random()*80, y: 10+Math.random()*80,
    s: .5+Math.random()*2, d: 4+Math.random()*5, del: Math.random()*4,
  }));
  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
      {dots.map((d,i)=>(
        <div key={i} style={{position:"absolute",left:`${d.x}%`,top:`${d.y}%`,width:d.s,height:d.s,borderRadius:"50%",background:G,animation:`spark ${d.d}s ${d.del}s infinite`}}/>
      ))}
    </div>
  );
}

function BadgePill({text}) {
  const col={HOT:"#ef4444",TOP:G,PREMIUM:"#a855f7",NEW:"#22c55e"}[text]||G;
  return <div style={{position:"absolute",top:8,left:8,zIndex:2,background:col,color:["TOP","PREMIUM"].includes(text)?"#000":"#fff",fontSize:8,fontWeight:800,letterSpacing:1.5,padding:"3px 8px",borderRadius:20,textTransform:"uppercase",boxShadow:`0 2px 8px ${col}88`}}>{text}</div>;
}

// ── BOTTOM NAV ────────────────────────────────────────────────────────────────
function BottomNav({active, onTab, tgUrl, sigUrl}) {
  return (
    <div style={{
      position:"fixed",bottom:0,left:0,right:0,
      background:"rgba(6,6,6,0.97)",
      backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
      borderTop:`1px solid ${S4}`,
      display:"flex",
      paddingBottom:"max(env(safe-area-inset-bottom,0px),6px)",
      zIndex:999,
    }}>
      {[
        {id:"menu",label:"MENU",icon:PH.menu},
        {id:"telegram",label:"TELEGRAM",icon:PH.tg},
        {id:"signal",label:"SIGNAL",icon:PH.sig},
      ].map(t=>(
        <button key={t.id} onClick={()=>onTab(t.id)} style={{
          flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          gap:3,padding:"11px 0 7px",background:"none",border:"none",cursor:"pointer",
          color:active===t.id?G:"#363636",transition:"color .2s",position:"relative",minWidth:0,
        }}>
          {active===t.id&&<div style={{position:"absolute",top:0,left:"25%",right:"25%",height:2,background:`linear-gradient(90deg,transparent,${G},transparent)`,borderRadius:2}}/>}
          <Ico d={t.icon} size={active===t.id?19:17}/>
          <span style={{fontSize:"clamp(7px,2vw,9px)",fontWeight:700,letterSpacing:1.2,fontFamily:"sans-serif"}}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── CONTACT MODAL ─────────────────────────────────────────────────────────────
function ContactModal({type, onClose, tgUrl, sigUrl}) {
  const isTg = type==="telegram";
  const col = isTg?"#229ED9":"#3A76F0";
  const label = isTg?"Telegram":"Signal";
  const url = isTg?(tgUrl||"https://t.me/MFFlavours"):(sigUrl||"https://signal.me");
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.9)",backdropFilter:"blur(10px)",display:"flex",alignItems:"flex-end",zIndex:1000}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",background:S2,borderRadius:"20px 20px 0 0",border:`1px solid ${S4}`,borderBottom:"none",padding:"24px 20px",paddingBottom:"calc(24px + max(env(safe-area-inset-bottom,0px),10px))",animation:"slideUp .3s cubic-bezier(.34,1.56,.64,1)"}}>
        <div style={{width:36,height:4,background:S4,borderRadius:2,margin:"0 auto 20px"}}/>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <div style={{width:50,height:50,borderRadius:14,background:`${col}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{isTg?"✈️":"🔵"}</div>
          <div>
            <div style={{fontSize:18,fontWeight:700,color:T}}>Chat on {label}</div>
            <div style={{fontSize:12,color:MT,marginTop:1}}>Opens {label} directly</div>
          </div>
        </div>
        <p style={{fontSize:13,color:MT,lineHeight:1.65,marginBottom:20}}>Tap below to start a conversation with MFFlavours. We typically reply within minutes.</p>
        <a href={url} target="_blank" rel="noopener noreferrer" style={{display:"block",textAlign:"center",padding:"14px",background:`linear-gradient(135deg,${col},${col}BB)`,borderRadius:13,color:"#fff",fontSize:15,fontWeight:700,textDecoration:"none",letterSpacing:.5,boxShadow:`0 6px 20px ${col}44`}}>
          Open {label} →
        </a>
        <button onClick={onClose} style={{width:"100%",marginTop:9,padding:"12px",background:"none",border:`1px solid ${S4}`,borderRadius:13,color:MT,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
      </div>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function Home({cats, products, cart, onAdd, onProduct, onCart, firstName}) {
  const [cat,setCat]=useState("all");
  const count=Object.values(cart).reduce((a,b)=>a+b.qty,0);
  const filtered=cat==="all"?products:products.filter(p=>p.category_id===cat);

  return (
    <div style={{background:BG,minHeight:"100%",fontFamily:"'Cormorant Garamond',Georgia,serif",paddingBottom:"calc(80px + max(env(safe-area-inset-bottom,0px),0px))"}}>
      <div style={{padding:"clamp(14px,4vw,20px)",paddingTop:"clamp(22px,6vw,32px)",position:"relative"}}>
        <Particles/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative"}}>
          <div>
            <div style={{fontSize:"clamp(8px,2vw,10px)",letterSpacing:4,color:MT,textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:3}}>Premium Selection</div>
            <div style={{fontSize:"clamp(22px,6vw,28px)",fontWeight:700,letterSpacing:3,background:`linear-gradient(135deg,${T} 0%,${G} 50%,${T} 100%)`,backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 4s linear infinite",lineHeight:1}}>MFFLAVOURS</div>
            <div style={{fontSize:"clamp(10px,2.5vw,12px)",color:MT,marginTop:3}}>Welcome, {firstName}</div>
          </div>
          <button onClick={onCart} style={{background:S2,border:`1px solid ${count>0?G+"88":S4}`,borderRadius:"clamp(10px,2.5vw,14px)",color:count>0?G:MT,cursor:"pointer",padding:"clamp(8px,2vw,11px) clamp(10px,2.5vw,14px)",display:"flex",alignItems:"center",gap:6,animation:count>0?"pulse 2s infinite":"none",flexShrink:0}}>
            <Ico d={PH.cart} size={18}/>
            {count>0&&<span style={{background:`linear-gradient(135deg,${G},${GL})`,color:BG,borderRadius:9,padding:"1px 7px",fontSize:11,fontWeight:800}}>{count}</span>}
          </button>
        </div>
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${G}88,${GL},${G}88,transparent)`,margin:"clamp(12px,3vw,18px) 0",position:"relative"}}>
          <div style={{position:"absolute",top:-3,left:"50%",transform:"translateX(-50%)",width:6,height:6,borderRadius:"50%",background:G,animation:"glow 2s infinite"}}/>
        </div>
      </div>

      {/* Categories */}
      <div style={{display:"flex",gap:7,overflowX:"auto",padding:"0 clamp(14px,4vw,20px) clamp(12px,3vw,16px)"}}>
        <button onClick={()=>setCat("all")} style={{flexShrink:0,padding:"clamp(6px,1.5vw,8px) clamp(12px,3vw,16px)",borderRadius:24,border:`1px solid ${cat==="all"?G:S4}`,background:cat==="all"?`linear-gradient(135deg,${GD},${G})`:S2,color:cat==="all"?BG:MT,fontSize:"clamp(10px,2.5vw,12px)",fontWeight:700,cursor:"pointer",boxShadow:cat==="all"?`0 4px 14px ${G}44`:"none",transition:"all .2s"}}>
          ✦ All
        </button>
        {cats.map(c=>(
          <button key={c.id} onClick={()=>setCat(c.id)} style={{flexShrink:0,padding:"clamp(6px,1.5vw,8px) clamp(12px,3vw,16px)",borderRadius:24,border:`1px solid ${cat===c.id?G:S4}`,background:cat===c.id?`linear-gradient(135deg,${GD},${G})`:S2,color:cat===c.id?BG:MT,fontSize:"clamp(10px,2.5vw,12px)",fontWeight:700,cursor:"pointer",boxShadow:cat===c.id?`0 4px 14px ${G}44`:"none",transition:"all .2s"}}>
            {c.emoji&&<span style={{marginRight:4}}>{c.emoji}</span>}{c.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(8px,2.5vw,12px)",padding:"0 clamp(10px,3vw,14px)"}}>
        {filtered.map((p,i)=>{
          const inCart=Object.keys(cart).some(k=>k.startsWith(p.id+"__"));
          const totalInCart=Object.entries(cart).filter(([k])=>k.startsWith(p.id+"__")).reduce((s,[,v])=>s+v.qty,0);
          const variants=p.variants||[];
          const lowestPrice=variants.length?Math.min(...variants.map(v=>v.price)):0;
          return (
            <div key={p.id} onClick={()=>onProduct(p)} style={{background:`linear-gradient(160deg,${S2},${S1})`,borderRadius:"clamp(12px,3vw,18px)",overflow:"hidden",border:`1px solid ${inCart?G+"66":S4}`,cursor:"pointer",boxShadow:inCart?`0 4px 20px ${G}22`:"0 2px 10px rgba(0,0,0,.4)",animation:`fadeUp .4s ${i*.05}s both",transition:"transform .15s`}}>
              <div style={{height:"clamp(100px,26vw,130px)",background:S3,overflow:"hidden",position:"relative"}}>
                {p.image_url&&<img src={p.image_url} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>}
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(10,10,10,.75) 0%,transparent 55%)"}}/>
                {p.badge&&<BadgePill text={p.badge}/>}
                {p.thc_content&&<div style={{position:"absolute",bottom:6,right:6,background:"rgba(0,0,0,.8)",border:`1px solid ${S4}`,borderRadius:7,padding:"2px 6px",fontSize:8,color:G,fontWeight:700}}>THC {p.thc_content}%</div>}
                {variants.length>0&&<div style={{position:"absolute",bottom:6,left:6,background:"rgba(0,0,0,.75)",border:`1px solid ${S4}`,borderRadius:7,padding:"2px 6px",fontSize:8,color:MT}}>{variants.length} sizes</div>}
              </div>
              <div style={{padding:"clamp(8px,2vw,10px) clamp(10px,2.5vw,12px) clamp(10px,2.5vw,12px)"}}>
                <div style={{fontSize:"clamp(11px,2.8vw,13px)",fontWeight:700,color:T,marginBottom:1}}>{p.name}</div>
                {p.strain&&<div style={{fontSize:"clamp(9px,2vw,10px)",color:MT,marginBottom:6}}>{p.strain}</div>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:"clamp(7px,1.8vw,9px)",color:MT,letterSpacing:.5}}>FROM</div>
                    <div style={{fontSize:"clamp(13px,3.5vw,16px)",fontWeight:700,background:`linear-gradient(135deg,${G},${GL})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>€{lowestPrice}</div>
                  </div>
                  <div style={{width:"clamp(26px,6.5vw,30px)",height:"clamp(26px,6.5vw,30px)",borderRadius:"50%",background:inCart?`linear-gradient(135deg,${G},${GL})`:S3,border:inCart?"none":`1px solid ${S4}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:inCart?11:13,color:inCart?BG:G,boxShadow:inCart?`0 4px 12px ${G}44`:"none"}}>
                    {inCart?totalInCart:<Ico d={PH.plus} size={13}/>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{textAlign:"center",padding:"20px 0 6px",fontSize:"clamp(7px,1.8vw,9px)",color:S4,letterSpacing:4,fontFamily:"sans-serif",textTransform:"uppercase"}}>MFFLAVOURS · 2026</div>
    </div>
  );
}

// ── PRODUCT DETAIL ────────────────────────────────────────────────────────────
function ProductDetail({p, cart, onAdd, onRemove, onBack, onCart}) {
  const [selVar, setSelVar] = useState((p.variants||[])[0]||null);
  const count = Object.values(cart).reduce((a,b)=>a+b.qty,0);
  const cartKey = selVar?`${p.id}__${selVar.id}`:null;
  const qty = cartKey?(cart[cartKey]?.qty||0):0;

  return (
    <div style={{background:BG,minHeight:"100%",fontFamily:"'Cormorant Garamond',Georgia,serif",paddingBottom:"calc(80px + max(env(safe-area-inset-bottom,0px),0px))"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"clamp(14px,4vw,18px) clamp(14px,4vw,20px)",paddingTop:"clamp(22px,5vw,30px)"}}>
        <button onClick={onBack} style={{background:S2,border:`1px solid ${S4}`,borderRadius:12,color:G,cursor:"pointer",padding:"clamp(8px,2vw,10px)"}}><Ico d={PH.back} size={16}/></button>
        <button onClick={onCart} style={{background:S2,border:`1px solid ${count>0?G+"88":S4}`,borderRadius:12,color:count>0?G:MT,cursor:"pointer",padding:"clamp(8px,2vw,9px) clamp(12px,3vw,14px)",display:"flex",alignItems:"center",gap:6}}>
          <Ico d={PH.cart} size={18}/>
          {count>0&&<span style={{background:`linear-gradient(135deg,${G},${GL})`,color:BG,borderRadius:8,padding:"1px 6px",fontSize:11,fontWeight:800}}>{count}</span>}
        </button>
      </div>

      <div style={{height:"clamp(180px,45vw,230px)",margin:"0 clamp(12px,3.5vw,16px)",borderRadius:20,overflow:"hidden",position:"relative",boxShadow:`0 18px 48px rgba(0,0,0,.6)`}}>
        {p.image_url&&<img src={p.image_url} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.88) 0%,transparent 50%)"}}/>
        {p.badge&&<BadgePill text={p.badge}/>}
        <div style={{position:"absolute",bottom:13,left:16}}>
          <div style={{fontSize:"clamp(18px,5vw,24px)",fontWeight:700,color:T,letterSpacing:1,textShadow:"0 2px 8px rgba(0,0,0,.8)"}}>{p.name}</div>
          {p.strain&&<div style={{fontSize:"clamp(11px,2.5vw,13px)",color:G,letterSpacing:1,fontWeight:600,marginTop:2}}>{p.strain}</div>}
        </div>
      </div>

      <div style={{padding:"clamp(16px,4vw,22px) clamp(14px,4vw,20px) 0"}}>
        {p.thc_content&&<div style={{display:"inline-flex",alignItems:"center",gap:6,background:S2,border:`1px solid ${S4}`,borderRadius:9,padding:"5px 13px",marginBottom:14}}><div style={{fontSize:9,color:MT,letterSpacing:2}}>THC</div><div style={{fontSize:17,fontWeight:700,color:G}}>{p.thc_content}%</div></div>}
        {p.description&&<p style={{fontSize:"clamp(12px,3vw,14px)",color:MT,lineHeight:1.75,marginBottom:18}}>{p.description}</p>}
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${G}55,transparent)`,marginBottom:18}}/>

        {/* Variant selector */}
        {p.variants&&p.variants.length>0&&(
          <div style={{marginBottom:18}}>
            <div style={{fontSize:"clamp(8px,2vw,10px)",color:MT,letterSpacing:3,textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:10}}>Select Size</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {p.variants.map(v=>{
                const isActive=selVar?.id===v.id;
                const varQty=cart[`${p.id}__${v.id}`]?.qty||0;
                return (
                  <button key={v.id} onClick={()=>setSelVar(v)} style={{padding:"clamp(8px,2vw,10px) clamp(12px,3vw,16px)",borderRadius:11,border:`1.5px solid ${isActive?G:S4}`,background:isActive?`linear-gradient(135deg,${GD},${G})`:S2,color:isActive?BG:MT,cursor:"pointer",fontFamily:"'Cormorant Garamond',Georgia,serif",display:"flex",flexDirection:"column",alignItems:"center",gap:2,boxShadow:isActive?`0 4px 14px ${G}44`:"none",minWidth:"clamp(58px,16vw,74px)",position:"relative",transition:"all .2s"}}>
                    <span style={{fontSize:"clamp(12px,3vw,14px)",fontWeight:700}}>{v.label}</span>
                    <span style={{fontSize:"clamp(12px,3vw,14px)",fontWeight:800,color:isActive?BG:G}}>€{v.price}</span>
                    {varQty>0&&<div style={{position:"absolute",top:-6,right:-6,width:17,height:17,borderRadius:"50%",background:G,color:BG,fontSize:8,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{varQty}</div>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selVar&&(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:S2,borderRadius:13,padding:"clamp(12px,3vw,16px) clamp(14px,3.5vw,18px)",marginBottom:16,border:`1px solid ${G}33`}}>
            <div>
              <div style={{fontSize:9,color:MT,letterSpacing:2,textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:1}}>Selected</div>
              <div style={{fontSize:"clamp(12px,3.5vw,14px)",fontWeight:600,color:T}}>{p.name} · {selVar.label}</div>
            </div>
            <div style={{fontSize:"clamp(22px,6vw,28px)",fontWeight:700,background:`linear-gradient(135deg,${G},${GL})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>€{selVar.price}</div>
          </div>
        )}

        {selVar&&(qty>0?(
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"clamp(16px,5vw,24px)",background:S2,borderRadius:14,padding:"clamp(12px,3vw,14px)",border:`1px solid ${G}44`}}>
            <button onClick={()=>onRemove(cartKey)} style={{width:"clamp(38px,9vw,44px)",height:"clamp(38px,9vw,44px)",borderRadius:12,background:S3,border:`1px solid ${S4}`,color:T,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ico d={PH.minus} size={16}/></button>
            <span style={{fontSize:"clamp(20px,5vw,24px)",fontWeight:700,color:T,minWidth:28,textAlign:"center"}}>{qty}</span>
            <button onClick={()=>onAdd(cartKey,selVar,p)} style={{width:"clamp(38px,9vw,44px)",height:"clamp(38px,9vw,44px)",borderRadius:12,background:S3,border:`1px solid ${S4}`,color:T,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ico d={PH.plus} size={16}/></button>
          </div>
        ):(
          <button onClick={()=>onAdd(cartKey,selVar,p)} style={{width:"100%",padding:"clamp(14px,3.5vw,17px)",background:`linear-gradient(135deg,${GD} 0%,${G} 40%,${GL} 100%)`,border:"none",borderRadius:14,color:BG,fontSize:"clamp(13px,3.5vw,15px)",fontWeight:700,cursor:"pointer",letterSpacing:1.5,textTransform:"uppercase",boxShadow:`0 8px 24px ${G}44`,fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
            Add to Cart
          </button>
        ))}
      </div>
    </div>
  );
}

// ── CART ──────────────────────────────────────────────────────────────────────
function Cart({cart, onAdd, onRemove, onBack}) {
  const [done, setDone] = useState(false);
  const [notes, setNotes] = useState("");
  const entries = Object.entries(cart).filter(([,v])=>v.qty>0);
  const total = entries.reduce((s,[,v])=>s+v.price*v.qty,0).toFixed(2);

  async function placeOrder() {
    const items = entries.map(([,v])=>({name:v.name,varLabel:v.varLabel,price:v.price,qty:v.qty}));
    const payload = JSON.stringify({items, total, notes});
    if (tg?.sendData) {
      tg.sendData(payload);
    }
    setDone(true);
  }

  if (done) return (
    <div style={{background:BG,minHeight:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,fontFamily:"'Cormorant Garamond',Georgia,serif",padding:"0 24px",paddingBottom:"calc(80px + max(env(safe-area-inset-bottom,0px),0px))"}}>
      <div style={{width:76,height:76,borderRadius:"50%",background:`linear-gradient(135deg,${GD},${G},${GL})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,boxShadow:`0 0 40px ${G}66`,animation:"pulse 2s infinite"}}>✓</div>
      <div style={{fontSize:24,fontWeight:700,color:T,letterSpacing:1}}>Order Placed!</div>
      <div style={{fontSize:13,color:MT,textAlign:"center",lineHeight:1.7,maxWidth:250}}>We'll confirm via Telegram shortly. Usually within minutes.</div>
      <div style={{background:S2,border:`1px solid ${S4}`,borderRadius:13,padding:"12px 24px",textAlign:"center"}}>
        <div style={{fontSize:9,color:MT,letterSpacing:2,marginBottom:2}}>ORDER TOTAL</div>
        <div style={{fontSize:22,fontWeight:700,background:`linear-gradient(135deg,${G},${GL})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>€{total}</div>
      </div>
    </div>
  );

  return (
    <div style={{background:BG,minHeight:"100%",fontFamily:"'Cormorant Garamond',Georgia,serif",paddingBottom:"calc(80px + max(env(safe-area-inset-bottom,0px),0px))"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"clamp(14px,4vw,18px) clamp(14px,4vw,20px)",paddingTop:"clamp(22px,5vw,30px)"}}>
        <button onClick={onBack} style={{background:S2,border:`1px solid ${S4}`,borderRadius:12,color:G,cursor:"pointer",padding:"clamp(8px,2vw,10px)"}}><Ico d={PH.back} size={16}/></button>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:"clamp(14px,3.5vw,17px)",fontWeight:700,color:T,letterSpacing:1}}>Your Cart</div>
          <div style={{fontSize:"clamp(10px,2.5vw,11px)",color:MT}}>{entries.length} item{entries.length!==1?"s":""}</div>
        </div>
        <div style={{width:40}}/>
      </div>
      <div style={{height:1,background:`linear-gradient(90deg,transparent,${G}44,transparent)`,margin:"0 clamp(14px,4vw,20px) clamp(12px,3vw,16px)"}}/>

      <div style={{padding:"0 clamp(12px,3.5vw,16px)"}}>
        {entries.length===0?(
          <div style={{textAlign:"center",padding:"60px 0",color:MT}}><div style={{fontSize:44,marginBottom:10}}>🛒</div><div>Your cart is empty</div></div>
        ):(
          <>
            {entries.map(([key,item])=>(
              <div key={key} style={{display:"flex",alignItems:"center",gap:"clamp(10px,2.5vw,12px)",background:S2,borderRadius:14,padding:"clamp(10px,2.5vw,13px) clamp(12px,3vw,14px)",marginBottom:9,border:`1px solid ${S4}`}}>
                <div style={{width:"clamp(48px,11vw,54px)",height:"clamp(48px,11vw,54px)",borderRadius:11,overflow:"hidden",background:S3,flexShrink:0}}>
                  {item.img&&<img src={item.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:"clamp(12px,3vw,14px)",fontWeight:700,color:T,marginBottom:1}}>{item.name}</div>
                  <div style={{fontSize:"clamp(10px,2.5vw,11px)",color:MT,marginBottom:2}}>{item.varLabel}</div>
                  <div style={{fontSize:"clamp(12px,3vw,14px)",fontWeight:700,background:`linear-gradient(135deg,${G},${GL})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>€{(item.price*item.qty).toFixed(2)}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
                  <button onClick={()=>onRemove(key)} style={{width:27,height:27,borderRadius:"50%",background:S3,border:`1px solid ${S4}`,color:T,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ico d={PH.minus} size={12}/></button>
                  <span style={{fontSize:"clamp(12px,3vw,14px)",fontWeight:700,color:T,minWidth:20,textAlign:"center"}}>{item.qty}</span>
                  <button onClick={()=>onAdd(key,{price:item.price,label:item.varLabel},{name:item.name,img:item.img})} style={{width:27,height:27,borderRadius:"50%",background:S3,border:`1px solid ${S4}`,color:T,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ico d={PH.plus} size={12}/></button>
                </div>
              </div>
            ))}

            <div style={{marginTop:8,marginBottom:14}}>
              <div style={{fontSize:9,color:MT,letterSpacing:2,textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:6}}>Order Notes</div>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Address, delivery preferences..." rows={2}
                style={{width:"100%",background:S2,border:`1px solid ${S4}`,borderRadius:11,padding:"9px 12px",color:T,fontSize:13,resize:"none",fontFamily:"inherit"}}/>
            </div>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"clamp(12px,3vw,16px) 0 clamp(12px,3vw,14px)",borderTop:`1px solid ${S4}`}}>
              <div>
                <div style={{fontSize:9,color:MT,letterSpacing:2,textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:1}}>Total</div>
                <div style={{fontSize:"clamp(24px,6vw,28px)",fontWeight:700,background:`linear-gradient(135deg,${G},${GL})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>€{total}</div>
              </div>
              <div style={{fontSize:"clamp(11px,2.5vw,13px)",color:MT}}>{entries.length} item{entries.length!==1?"s":""}</div>
            </div>

            <button onClick={placeOrder} style={{width:"100%",padding:"clamp(14px,3.5vw,17px)",background:`linear-gradient(135deg,${GD} 0%,${G} 40%,${GL} 100%)`,border:"none",borderRadius:14,color:BG,fontSize:"clamp(13px,3.5vw,15px)",fontWeight:700,cursor:"pointer",letterSpacing:1.5,textTransform:"uppercase",boxShadow:`0 8px 26px ${G}44`,fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── LOADING ───────────────────────────────────────────────────────────────────
function Loading() {
  return (
    <div style={{background:BG,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}>
      <div style={{fontSize:28,fontWeight:700,letterSpacing:4,background:`linear-gradient(135deg,${T},${G},${T})`,backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 2s linear infinite"}}>MFFLAVOURS</div>
      <div style={{display:"flex",gap:8}}>
        {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:G,animation:`spark ${1}s ${i*.2}s infinite`}}/>)}
      </div>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [screen, setScreen] = useState("home");
  const [product, setProduct] = useState(null);
  const [tab, setTab] = useState("menu");
  const [modal, setModal] = useState(null);
  const [cart, setCart] = useState({});

  const user = tg?.initDataUnsafe?.user;
  const firstName = user?.first_name || "Guest";

  useEffect(()=>{
    tg?.ready();
    tg?.expand();
    tg?.setHeaderColor?.("#0A0A0A");
    tg?.setBackgroundColor?.("#0A0A0A");
    loadData();
  },[]);

  async function loadData() {
    try {
      const [catsData, prodsData, settingsData] = await Promise.all([
        db("categories?select=*&order=sort_order.asc"),
        db("products?select=*,variants:product_variants(*)&is_available=eq.true&order=name.asc"),
        db("settings?select=key,value"),
      ]);
      setCats(Array.isArray(catsData)?catsData:[]);
      setProducts(Array.isArray(prodsData)?prodsData:[]);
      const s = {};
      if(Array.isArray(settingsData)) settingsData.forEach(r=>s[r.key]=r.value);
      setSettings(s);
    } catch(e) {
      console.error("Load error:", e);
    }
    setLoading(false);
  }

  const addToCart = (key, variant, prod) => setCart(c=>({
    ...c,
    [key]: { qty:(c[key]?.qty||0)+1, price:variant.price, name:prod?.name||c[key]?.name, varLabel:variant.label||variant.varLabel, img:prod?.image_url||c[key]?.img }
  }));

  const removeFromCart = key => setCart(c=>{
    const n={...c};
    if(!n[key])return n;
    if(n[key].qty>1) n[key]={...n[key],qty:n[key].qty-1};
    else delete n[key];
    return n;
  });

  const handleTab = t => {
    setTab(t);
    if(t==="menu") setScreen("home");
    else setModal(t);
  };

  if(loading) return <Loading/>;

  return (
    <div style={{background:BG,minHeight:"100vh",position:"relative",overflow:"hidden"}}>
      {screen==="home"&&<Home cats={cats} products={products} cart={cart} onAdd={addToCart} onProduct={p=>{setProduct(p);setScreen("product");}} onCart={()=>setScreen("cart")} firstName={firstName}/>}
      {screen==="product"&&product&&<ProductDetail p={product} cart={cart} onAdd={addToCart} onRemove={removeFromCart} onBack={()=>setScreen("home")} onCart={()=>setScreen("cart")}/>}
      {screen==="cart"&&<Cart cart={cart} onAdd={addToCart} onRemove={removeFromCart} onBack={()=>setScreen("home")}/>}
      <BottomNav active={tab} onTab={handleTab} tgUrl={settings.telegram_url} sigUrl={settings.signal_url}/>
      {modal&&<ContactModal type={modal} onClose={()=>{setModal(null);setTab("menu");}} tgUrl={settings.telegram_url} sigUrl={settings.signal_url}/>}
    </div>
  );
}
