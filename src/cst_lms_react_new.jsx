import React, { useState, useEffect, useCallback, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  navy: "#0B1E3D", navy2: "#152E5A", navy3: "#1E3F7A",
  accent: "#2A6FDB", accent2: "#1A54B0", accentLight: "#E8F0FC",
  green: "#166534", greenBg: "#DCFCE7", greenMid: "#16A34A",
  amber: "#92400E", amberBg: "#FEF3C7", amberMid: "#D97706",
  red: "#991B1B", redBg: "#FEE2E2", redMid: "#DC2626",
  purple: "#5B21B6", purpleBg: "#EDE9FE",
  bg: "#F1F4F9", white: "#FFFFFF",
  border: "#E2E8F2", border2: "#CBD5E1",
  text: "#0B1E3D", text2: "#475569", text3: "#94A3B8",
  font: "'DM Sans', sans-serif",
};

// ─── SEED DATA ─────────────────────────────────────────────────────────────────
const SEED_LEARNERS = [
  { id:"L1", name:"Margaret Whitfield",  email:"margaret.whitfield@careplus.co.uk",  dept:"Care Workers",  initials:"MW", color:"#2A6FDB", status:"Active",  joined:"2025-03-12", progress:100 },
  { id:"L2", name:"James Thornton",      email:"j.thornton@careplus.co.uk",          dept:"Admin Staff",   initials:"JT", color:"#16A34A", status:"Active",  joined:"2025-03-15", progress:67  },
  { id:"L3", name:"Fiona Blackwood",     email:"f.blackwood@careplus.co.uk",         dept:"New Starters",  initials:"FB", color:"#DC2626", status:"Pending", joined:"2025-04-01", progress:14  },
  { id:"L5", name:"William Ashford",     email:"w.ashford@careplus.co.uk",           dept:"Care Workers",  initials:"WA", color:"#0891B2", status:"Active",  joined:"2025-02-03", progress:80  },
  { id:"L6", name:"Eleanor Pemberton",   email:"e.pemberton@careplus.co.uk",         dept:"Senior Carers", initials:"EP", color:"#BE185D", status:"Active",  joined:"2025-01-20", progress:55  },
  { id:"L7", name:"Robert Stanwick",     email:"r.stanwick@careplus.co.uk",          dept:"Admin Staff",   initials:"RS", color:"#059669", status:"Active",  joined:"2025-03-08", progress:30  },
  { id:"L8", name:"Patricia Hollingsworth", email:"p.hollingsworth@careplus.co.uk",  dept:"Volunteers",    initials:"PH", color:"#D97706", status:"Deactivated", joined:"2025-01-05", progress:45 },
];

const SEED_COURSES = [
  { id:"C1", name:"Safeguarding Adults",    emoji:"🛡️", duration:"3–4 hrs", enrolled:6, inProgress:2, completed:4, certs:4, dept:"Care Workers",  color:"#16A34A" },
  { id:"C2", name:"First Aid Essentials",   emoji:"🩺", duration:"2 hrs",   enrolled:4, inProgress:2, completed:2, certs:2, dept:"Senior Carers", color:"#2A6FDB" },
  { id:"C3", name:"Data Protection",        emoji:"🔒", duration:"1.5 hrs", enrolled:5, inProgress:3, completed:1, certs:1, dept:"Admin Staff",   color:"#DC2626" },
  { id:"C4", name:"Mental Health Awareness",emoji:"🧠", duration:"2.5 hrs", enrolled:3, inProgress:1, completed:2, certs:2, dept:"All",           color:"#7C3AED" },
  { id:"C5", name:"Fire Safety",            emoji:"🔥", duration:"1 hr",    enrolled:8, inProgress:0, completed:8, certs:8, dept:"All",           color:"#EA580C" },
  { id:"C6", name:"Food Hygiene Level 2",   emoji:"🍽️", duration:"2 hrs",   enrolled:2, inProgress:0, completed:2, certs:2, dept:"Catering",      color:"#0891B2" },
];

const SEED_CERTS = [
  { id:"CT1", learnerId:"L1", learnerName:"Margaret Whitfield",    courseId:"C2", courseName:"First Aid Essentials", claimedOn:"2026-04-21", status:"Active",  type:"Assignment" },
  { id:"CT2", learnerId:"L1", learnerName:"Margaret Whitfield",    courseId:"C5", courseName:"Fire Safety",          claimedOn:"2026-03-15", status:"Active",  type:"Self-enrolment" },
  { id:"CT4", learnerId:"L8", learnerName:"Patricia Hollingsworth",courseId:"C3", courseName:"Data Protection",      claimedOn:"2026-01-01", status:"Expired", type:"Assignment" },
];

const SEED_SETTINGS = {
  managerName:"Manager",
  companyName:"Codezen Technology",
  plan:"Team Plan", totalLicences:5, subExpiry:"2025-12-17",
  allowLearnerDownload:true, autoEmailCert:true, mfaEnabled:false,
  slackEnabled:false, teamsEnabled:false, genAIEnabled:true,
  departments:["Care Workers","Senior Carers","Admin Staff","Volunteers","New Starters","Catering"],
  certDownloadControl:"yes",
};

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
async function load(key, fallback) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : fallback; }
  catch { return fallback; }
}
async function save(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size=16, color="currentColor", style={} }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={style}>
    <path d={d} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ICONS = {
  grid:    "M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z",
  users:   "M14 15c0-2.5-1.8-4-4-4S6 12.5 6 15M10 8a3 3 0 100-6 3 3 0 000 6zM18 15c0-2-1.3-3.5-3-3.5M16 7a2.5 2.5 0 100-5",
  book:    "M4 4h12a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zM7 8h6M7 12h4",
  award:   "M10 2l1.8 4.5H16l-3.4 2.5 1.3 4.2L10 11l-3.9 2.2 1.3-4.2L4 6.5h4.2L10 2zM7 16l-1 4 4-1.5 4 1.5-1-4",
  chart:   "M3 17V8M8 17V4M13 17v-6M18 17V9",
  settings:"M10 13a3 3 0 100-6 3 3 0 000 6zM17 10a7 7 0 01-.1 1.2l2.2 1.7-2 3.5-2.6-.9c-.6.5-1.3.9-2 1.2l-.4 2.7h-4l-.4-2.7c-.7-.3-1.4-.7-2-1.2l-2.6.9-2-3.5 2.2-1.7A7 7 0 013 10a7 7 0 01.1-1.2L.9 7.1l2-3.5 2.6.9c.6-.5 1.3-.9 2-1.2L7.9 1h4l.4 2.3c.7.3 1.4.7 2 1.2l2.6-.9 2 3.5-2.2 1.7c.1.4.1.8.1 1.2",
  credit:  "M2 5h16a1 1 0 011 1v9a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1zM1 10h18M5 14h4",
  plus:    "M10 4v12M4 10h12",
  mail:    "M3 5h14l-7 7-7-7zM3 5v10h14V5",
  check:   "M4 10l5 5 8-9",
  x:       "M5 5l10 10M15 5L5 15",
  search:  "M9 17A8 8 0 109 1a8 8 0 000 16zM21 21l-4.4-4.4",
  bell:    "M10 2a6 6 0 00-6 6v4l-2 2v1h16v-1l-2-2V8a6 6 0 00-6-6zM8 17a2 2 0 004 0",
  down:    "M5 8l5 5 5-5",
  cert:    "M12 15l-2 2-2-2M10 3v14M4 7l1.4 1.4A7 7 0 0010 10a7 7 0 004.6-1.6L16 7",
  logout:  "M14 15l4-5-4-5M18 10H8M8 3H4a1 1 0 00-1 1v12a1 1 0 001 1h4",
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, type="success" }) {
  const bg = type==="success"?T.navy:type==="error"?T.redMid:T.amberMid;
  return (
    <div style={{position:"fixed",bottom:28,right:28,background:bg,color:"#fff",padding:"12px 20px",borderRadius:10,fontSize:13,fontWeight:500,zIndex:9999,boxShadow:"0 4px 20px rgba(0,0,0,.2)",animation:"fadeUp .3s ease",maxWidth:320}}>
      {msg}
    </div>
  );
}

// ─── PILL ─────────────────────────────────────────────────────────────────────
function Pill({ label, type="blue" }) {
  const map = { blue:[T.accentLight,T.accent2], green:[T.greenBg,T.greenMid], red:[T.redBg,T.redMid], amber:[T.amberBg,T.amberMid], gray:["#F1F5F9","#64748B"], purple:[T.purpleBg,T.purple] };
  const [bg,col] = map[type]||map.blue;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,background:bg,color:col,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{label}</span>;
}

// ─── AVATAR ───────────────────────────────────────────────────────────────────
function Av({ initials, color="#2A6FDB", size=32 }) {
  return (
    <div style={{width:size,height:size,borderRadius:8,background:color+"22",color:color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.35,fontWeight:700,flexShrink:0}}>
      {initials}
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, subColor=T.greenMid, onClick }) {
  return (
    <div onClick={onClick} style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,padding:"18px 20px",cursor:onClick?"pointer":"default",transition:"box-shadow .15s,transform .15s"}}
      onMouseEnter={e=>{if(onClick){e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,.08)";e.currentTarget.style.transform="translateY(-1px)"}}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}>
      <div style={{fontSize:11.5,color:T.text3,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>{label}</div>
      <div style={{fontSize:28,fontWeight:700,color:T.text,lineHeight:1}}>{value}</div>
      {sub && <div style={{fontSize:11.5,color:subColor,marginTop:6,fontWeight:500}}>{sub}</div>}
    </div>
  );
}

// ─── MODAL WRAPPER ────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width=520 }) {
  if (!open) return null;
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(11,30,61,.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:T.white,borderRadius:18,padding:28,width:"100%",maxWidth:width,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.2)",animation:"fadeUp .2s ease"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div style={{fontSize:17,fontWeight:700,color:T.text}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",padding:4,borderRadius:6,color:T.text3,fontSize:18,lineHeight:1}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── FORM INPUTS ──────────────────────────────────────────────────────────────
function Input({ label, ...props }) {
  return (
    <div style={{marginBottom:14}}>
      {label && <div style={{fontSize:12,fontWeight:600,color:T.text2,marginBottom:5}}>{label}</div>}
      <input {...props} style={{width:"100%",padding:"9px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,color:T.text,fontFamily:T.font,outline:"none",boxSizing:"border-box",...props.style}}
        onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border} />
    </div>
  );
}
function Select({ label, children, ...props }) {
  return (
    <div style={{marginBottom:14}}>
      {label && <div style={{fontSize:12,fontWeight:600,color:T.text2,marginBottom:5}}>{label}</div>}
      <select {...props} style={{width:"100%",padding:"9px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,color:T.text,fontFamily:T.font,outline:"none",background:T.white,boxSizing:"border-box",...props.style}}>
        {children}
      </select>
    </div>
  );
}

// ─── TOGGLE ───────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <div onClick={()=>onChange(!checked)} style={{width:40,height:22,borderRadius:11,background:checked?T.accent:"#CBD5E1",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
      <div style={{position:"absolute",top:3,left:checked?19:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.15)"}}/>
    </div>
  );
}

// ─── BTN ──────────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant="primary", sm, style={} }) {
  const base = {padding:sm?"6px 14px":"9px 18px",borderRadius:8,fontSize:sm?12:13,fontWeight:600,cursor:"pointer",fontFamily:T.font,border:"none",transition:"background .15s, transform .1s",display:"inline-flex",alignItems:"center",gap:6,...style};
  const vars = {
    primary:{background:T.navy,color:"#fff"},
    accent:{background:T.accent,color:"#fff"},
    outline:{background:"transparent",border:`1px solid ${T.border}`,color:T.text2},
    ghost:{background:"none",border:"none",color:T.accent,padding:0},
    red:{background:T.redMid,color:"#fff"},
  };
  return (
    <button onClick={onClick} style={{...base,...vars[variant]}}
      onMouseEnter={e=>{e.currentTarget.style.opacity=".85";e.currentTarget.style.transform="translateY(-1px)"}}
      onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="none"}}>
      {children}
    </button>
  );
}

// ─── PROGRESS BAR CELL ────────────────────────────────────────────────────────
function ProgCell({ pct }) {
  const col = pct>=100?T.greenMid:pct>=40?T.accent:pct>0?T.redMid:"#CBD5E1";
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{flex:1,height:6,background:T.bg,borderRadius:4,minWidth:60,overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:4,background:col,width:pct+"%",transition:"width .4s"}}/>
      </div>
      <span style={{fontSize:11.5,color:T.text3,width:32,textAlign:"right"}}>{pct}%</span>
    </div>
  );
}

function statusPill(s) {
  const map={Active:"green",Pending:"amber",Deactivated:"gray",Completed:"green","In Progress":"blue","At Risk":"red","Not Started":"gray"};
  return <Pill label={s} type={map[s]||"blue"}/>;
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV = [
  {id:"dashboard", label:"Dashboard",    icon:"grid"},
  {id:"learners",  label:"Learners",     icon:"users",  badge:true},
  {id:"invite",    label:"Invite / Add", icon:"mail"},
  {id:"courses",   label:"Courses",      icon:"book"},
  {id:"assigned",  label:"Assigned",     icon:"chart"},
  {id:"certs",     label:"Certificates", icon:"award"},
  {id:"reports",   label:"Reports",      icon:"chart"},
  {id:"subscription",label:"Subscription",icon:"credit"},
  {id:"settings",  label:"Settings",     icon:"settings"},
];

function Sidebar({ page, setPage, learnerCount, settings }) {
  return (
    <aside style={{width:220,background:T.navy,display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,flexShrink:0}}>
      <div style={{padding:"16px 18px 14px",borderBottom:`1px solid rgba(255,255,255,.08)`}}>
        <img src="data:image/png;base64,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"
          alt="Care Skills Training"
          style={{width:"100%",maxWidth:160,height:"auto",display:"block",marginBottom:10}}/>
        <div style={{fontSize:9.5,color:"rgba(255,255,255,.35)",letterSpacing:".06em",textTransform:"uppercase",whiteSpace:"nowrap",paddingLeft:2}}>Learning Management Suite</div>
      </div>
      <nav style={{flex:1,padding:"8px 0",overflowY:"auto"}}>
        {NAV.map(n=>(
          <div key={n.id} onClick={()=>setPage(n.id)}
            style={{display:"flex",alignItems:"center",gap:10,padding:"9px 18px",cursor:"pointer",fontSize:12.5,color:page===n.id?"#fff":"rgba(255,255,255,.55)",background:page===n.id?"rgba(42,111,219,.2)":"transparent",borderLeft:`2px solid ${page===n.id?T.accent:"transparent"}`,transition:"all .12s"}}>
            <Icon d={ICONS[n.icon]} size={15} color={page===n.id?"#fff":"rgba(255,255,255,.55)"}/>
            <span style={{flex:1}}>{n.label}</span>
            {n.badge && <span style={{background:T.accent,color:"#fff",fontSize:10,padding:"1px 6px",borderRadius:20,fontWeight:600}}>{learnerCount}</span>}
          </div>
        ))}
      </nav>
      <div style={{padding:"14px 18px",borderTop:`1px solid rgba(255,255,255,.08)`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>CT</div>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:"#fff",lineHeight:1.2}}>{settings.companyName}</div>
            <div style={{fontSize:10.5,color:"rgba(255,255,255,.4)"}}>Admin · Manager</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
const PAGE_TITLES = {dashboard:"Dashboard",learners:"Manage Learners",invite:"Invite Learners",courses:"Available Courses",assigned:"Assigned Courses",certs:"Certificates",reports:"Reports",subscription:"Subscription",settings:"Settings"};

function Topbar({ page, openInvite, openAssign }) {
  return (
    <div style={{height:56,background:T.white,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",position:"sticky",top:0,zIndex:50}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:12,color:T.text3}}>Overview /</span>
        <span style={{fontSize:15,fontWeight:600,color:T.text,marginLeft:4}}>{PAGE_TITLES[page]}</span>
      </div>
      <div style={{display:"flex",gap:10}}>
        <Btn variant="outline" sm onClick={openInvite}>+ Add Learner</Btn>
        <Btn variant="primary" sm onClick={openAssign}>Assign Course</Btn>
      </div>
    </div>
  );
}

// ─── GREETING ─────────────────────────────────────────────────────────────────
function Greeting({ settings }) {
  const [time, setTime] = useState(new Date());
  useEffect(()=>{ const t=setInterval(()=>setTime(new Date()),1000); return()=>clearInterval(t); },[]);
  const h=parseInt(time.toLocaleString("en-GB",{timeZone:"Europe/London",hour:"2-digit",hour12:false}),10);
  const greet=h<12?"Good morning":h<17?"Good afternoon":"Good evening";
  const subtexts={
    morning:["Start the day right — check who needs a reminder.","Your team's learning activity awaits. Keep compliance on track.","Morning check-in: review progress and send pending reminders."],
    afternoon:["Midday update — see how your team is progressing.","Any at-risk learners? Now's a good time to reach out.","Keep momentum going — check assignments and certificate status."],
    evening:["End-of-day wrap-up — review today's completions and alerts.","Before you sign off, check pending invitations and expiring certs.","Good work today. Here's your team's learning snapshot."],
  };
  const pool=h<12?subtexts.morning:h<17?subtexts.afternoon:subtexts.evening;
  const sub=pool[time.getDate()%pool.length];
  const ukOpts={timeZone:"Europe/London"};
  const dateStr=time.toLocaleDateString("en-GB",{...ukOpts,weekday:"long",day:"numeric",month:"long",year:"numeric"});
  const timeStr=time.toLocaleTimeString("en-GB",{...ukOpts,hour:"2-digit",minute:"2-digit",hour12:false});
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
      <div>
        <div style={{fontSize:22,fontWeight:700,color:T.text}}>{greet}, {settings.managerName||settings.companyName}</div>
        <div style={{fontSize:13,color:T.text3,marginTop:4}}>{sub}</div>
      </div>
      <div style={{textAlign:"right",flexShrink:0}}>
        <div style={{fontSize:13,color:T.text2,fontWeight:500}}>{dateStr}</div>
        <div style={{fontSize:13,color:T.text3,marginTop:2}}>{timeStr}</div>
      </div>
    </div>
  );
}

// ─── OPS STRIP ────────────────────────────────────────────────────────────────
function OpsStrip({ learners, settings, setPage, openInvite }) {
  const TOTAL = settings.totalLicences;
  // A licence is consumed the moment a learner is added — deactivating doesn't free it
  const consumed = Math.min(learners.length, TOTAL);
  const free = Math.max(0, TOTAL - learners.length);
  const pct = TOTAL > 0 ? Math.min(100, Math.round((learners.length / TOTAL) * 100)) : 0;
  const exhausted = free === 0;
  const barColor = exhausted ? T.redMid : free === 1 ? T.amberMid : T.accent;
  const expiry = new Date(settings.subExpiry);
  const daysLeft = Math.max(0, Math.round((expiry - Date.now()) / 86400000));
  const expiryStr = expiry.toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"});
  const expiryColor = daysLeft < 60 ? T.red : daysLeft < 180 ? T.amber : T.text2;
  const expiryBg = daysLeft < 60 ? T.redBg : daysLeft < 180 ? T.amberBg : T.bg;

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
      {/* Licence card */}
      <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,padding:"18px 20px"}}>
        <div style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:".07em",marginBottom:12}}>Licences</div>

        <div style={{height:8,background:T.bg,borderRadius:4,overflow:"hidden",marginBottom:8}}>
          <div style={{height:"100%",width:pct+"%",background:barColor,borderRadius:4,transition:"width .4s"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{fontSize:13,fontWeight:600,color:T.text}}>{consumed} <span style={{fontWeight:400,color:T.text3}}>/ {TOTAL} used</span></span>
          <span style={{fontSize:12,fontWeight:600,color:barColor}}>{exhausted ? "None left" : `${free} remaining`}</span>
        </div>

        {exhausted && (
          <div style={{display:"flex",alignItems:"flex-start",gap:8,background:T.redBg,border:`1px solid #FECACA`,borderRadius:8,padding:"9px 12px",marginBottom:14,fontSize:12,color:T.red,lineHeight:1.5}}>
            <span style={{flexShrink:0}}>🚫</span>
            <span>All licences are used up. To add more learners, <strong style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>setPage("subscription")}>buy more licences</strong>.</span>
          </div>
        )}

        <div style={{display:"flex",gap:8,paddingTop:14,borderTop:`1px solid ${T.border}`}}>
          <Btn variant="outline" sm onClick={()=>setPage("learners")} style={{flex:1,justifyContent:"center"}}>View learners</Btn>
          <Btn variant={exhausted?"outline":"primary"} sm onClick={openInvite} style={{flex:1,justifyContent:"center",opacity:exhausted?.5:1,cursor:exhausted?"not-allowed":"pointer"}}>+ Invite</Btn>
        </div>
      </div>

      {/* Subscription card */}
      <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,padding:"18px 20px"}}>
        <div style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:".07em",marginBottom:12}}>Subscription</div>

        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <span style={{fontSize:13,fontWeight:700,color:T.text}}>⭐ {settings.plan}</span>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div style={{background:T.bg,borderRadius:10,padding:"10px 12px"}}>
            <div style={{fontSize:18,fontWeight:700,color:T.text}}>{TOTAL}</div>
            <div style={{fontSize:11,color:T.text3,marginTop:2}}>Total licences</div>
          </div>
          <div style={{background:expiryBg,borderRadius:10,padding:"10px 12px"}}>
            <div style={{fontSize:13,fontWeight:700,color:expiryColor,lineHeight:1.3}}>{daysLeft > 0 ? `${daysLeft}d left` : "Expired"}</div>
            <div style={{fontSize:11,color:expiryColor,opacity:.75,marginTop:2}}>Expires {expiryStr}</div>
          </div>
        </div>

        <div style={{display:"flex",gap:8,paddingTop:14,borderTop:`1px solid ${T.border}`}}>
          <Btn variant="outline" sm onClick={()=>setPage("subscription")} style={{flex:1,justifyContent:"center"}}>Manage plan</Btn>
          <Btn variant="primary" sm onClick={()=>setPage("subscription")} style={{flex:1,justifyContent:"center"}}>Buy licences</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function CourseCompletionsModal({ course, learners, onClose, onViewReport }) {
  if (!course) return null;
  const completed = learners.filter(l => l.progress >= 100 && l.status !== "Deactivated");
  const inProgress = learners.filter(l => l.progress > 0 && l.progress < 100 && l.status !== "Deactivated");
  const notStarted = learners.filter(l => l.progress === 0 && l.status !== "Deactivated");
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(11,30,61,.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:T.white,borderRadius:18,padding:28,width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.2)",animation:"fadeUp .2s ease"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div>
            <div style={{fontSize:11,color:T.text3,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>{course.emoji} {course.name}</div>
            <div style={{fontSize:17,fontWeight:700,color:T.text}}>Course Completions</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",padding:4,borderRadius:6,color:T.text3,fontSize:18,lineHeight:1}}>✕</button>
        </div>
        <div style={{display:"flex",gap:10,marginBottom:20}}>
          {[["Completed", completed.length,"green"],["In Progress", inProgress.length,"amber"],["Not Started", notStarted.length,"gray"]].map(([l,v,t])=>(
            <div key={l} style={{flex:1,background:T.bg,borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:700,color:T.text}}>{v}</div>
              <div style={{fontSize:11,color:T.text3,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
        {completed.length > 0 ? (
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:600,color:T.text3,marginBottom:10,textTransform:"uppercase",letterSpacing:".05em"}}>Completed Learners</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {completed.map(l=>(
                <div key={l.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.greenBg,borderRadius:10,border:"1px solid #86EFAC"}}>
                  <Av initials={l.initials} color={l.color} size={32}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:T.text}}>{l.name}</div>
                    <div style={{fontSize:11.5,color:T.text2}}>{l.dept}</div>
                  </div>
                  <Pill label="Done" type="green"/>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{textAlign:"center",padding:"24px 0",color:T.text3,fontSize:13,marginBottom:16}}>No learners have completed this course yet.</div>
        )}
        <div style={{display:"flex",gap:10,paddingTop:16,borderTop:"1px solid "+T.border}}>
          <Btn variant="outline" onClick={onClose} style={{flex:1,justifyContent:"center"}}>Close</Btn>
          <Btn variant="primary" onClick={onViewReport} style={{flex:1,justifyContent:"center"}}>View Full Report →</Btn>
        </div>
      </div>
    </div>
  );
}

function PageDashboard({ learners, courses, certs, settings, setPage, setReportCourse, openInvite, openAssign, showToast }) {
  const [activeCourse, setActiveCourse]=useState(null);
  const active=learners.filter(l=>l.status!=="Deactivated");
  const totalCompleted=courses.reduce((s,c)=>s+c.completed,0);
  const expiring=certs.filter(c=>c.status==="Expiring").length;
  const atRisk=learners.filter(l=>l.progress>0&&l.progress<30).length;
  const depts=[...new Set(learners.map(l=>l.dept))];
  const deptCompliance=depts.map(d=>{
    const dl=learners.filter(l=>l.dept===d&&l.status!=="Deactivated");
    const avg=dl.length?Math.round(dl.reduce((s,l)=>s+l.progress,0)/dl.length):0;
    return {dept:d,pct:avg};
  }).sort((a,b)=>b.pct-a.pct);

  return (
    <div style={{padding:"24px 28px"}}>
      <Greeting settings={settings}/>

      {/* Metrics */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20,alignItems:"stretch"}}>
        {/* Total Team Members */}
        {(()=>{
          const totalAdded=learners.length;
          const activeOnLMS=learners.filter(l=>l.status==="Active"&&l.progress>0).length;
          return (
            <div onClick={()=>setPage("learners")} style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden",cursor:"pointer",transition:"box-shadow .15s,transform .15s",display:"flex",flexDirection:"column"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.08)";e.currentTarget.style.transform="translateY(-1px)"}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}>
              <div style={{height:4,background:T.accent}}/>
              <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <div style={{width:36,height:36,borderRadius:10,background:T.navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon d={ICONS.users} size={17} color="#fff"/>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:T.text}}>Total Team Members</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:T.text2,marginBottom:7}}>
                  <span>Total members added</span><span style={{fontWeight:700,color:T.text}}>{totalAdded}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:T.text2,marginBottom:0}}>
                  <span>Active on LMS</span><span style={{fontWeight:700,color:T.text}}>{activeOnLMS}</span>
                </div>
                <div style={{marginTop:"auto",borderTop:`1px solid ${T.border}`,paddingTop:10,marginTop:14,fontSize:12.5,color:T.accent,fontWeight:600,cursor:"pointer"}} onClick={e=>{e.stopPropagation();setPage("learners");}}>Manage Team →</div>
              </div>
            </div>
          );
        })()}

        {/* Course Completions */}
        {(()=>{
          const inProgress=learners.filter(l=>l.status!=="Deactivated"&&l.progress>0&&l.progress<100).length;
          const completed=learners.filter(l=>l.status!=="Deactivated"&&l.progress>=100).length;
          return (
            <div onClick={()=>setPage("reports")} style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden",cursor:"pointer",transition:"box-shadow .15s,transform .15s",display:"flex",flexDirection:"column"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.08)";e.currentTarget.style.transform="translateY(-1px)"}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}>
              <div style={{height:4,background:"#06B6D4"}}/>
              <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <div style={{width:36,height:36,borderRadius:10,background:"#0E7490",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon d={ICONS.book} size={17} color="#fff"/>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:T.text}}>Course Completions</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:T.text2,marginBottom:7}}>
                  <span>Courses in progress</span><span style={{fontWeight:700,color:T.text}}>{inProgress}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:T.text2,marginBottom:0}}>
                  <span>Completed courses</span><span style={{fontWeight:700,color:T.text}}>{completed}</span>
                </div>
                <div style={{marginTop:"auto",borderTop:`1px solid ${T.border}`,paddingTop:10,marginTop:14,fontSize:12.5,color:"#0E7490",fontWeight:600,cursor:"pointer"}} onClick={e=>{e.stopPropagation();setPage("reports");}}>View Course Reports →</div>
              </div>
            </div>
          );
        })()}

        {/* Certificates */}
        {(()=>{
          const issued=certs.filter(c=>c.status!=="Expired").length;
          const expiringSoon=certs.filter(c=>c.status==="Expiring").length;
          return (
            <div onClick={()=>setPage("certs")} style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden",cursor:"pointer",transition:"box-shadow .15s,transform .15s",display:"flex",flexDirection:"column"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.08)";e.currentTarget.style.transform="translateY(-1px)"}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}>
              <div style={{height:4,background:T.greenMid}}/>
              <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <div style={{width:36,height:36,borderRadius:10,background:T.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon d={ICONS.award} size={17} color="#fff"/>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:T.text}}>Certificates</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:T.text2,marginBottom:7}}>
                  <span>Issued (active)</span><span style={{fontWeight:700,color:T.text}}>{issued}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:T.text2,marginBottom:0}}>
                  <span>Expiring soon</span><span style={{fontWeight:700,color:expiringSoon>0?T.amberMid:T.text}}>{expiringSoon}</span>
                </div>
                <div style={{marginTop:"auto",borderTop:`1px solid ${T.border}`,paddingTop:10,marginTop:14,fontSize:12.5,color:T.green,fontWeight:600,cursor:"pointer"}} onClick={e=>{e.stopPropagation();setPage("certs");}}>View Certificates →</div>
              </div>
            </div>
          );
        })()}

        {/* Compliance */}
        {(()=>{
          const activeL=learners.filter(l=>l.status!=="Deactivated");
          const total=activeL.length||1;
          const compliant=activeL.filter(l=>l.progress>=100).length;
          const nonCompliant=activeL.filter(l=>l.progress<100).length;
          const compliantPct=Math.round((compliant/total)*100);
          return (
            <div onClick={()=>setPage("reports")} style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden",cursor:"pointer",transition:"box-shadow .15s,transform .15s",display:"flex",flexDirection:"column"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.08)";e.currentTarget.style.transform="translateY(-1px)"}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}>
              <div style={{height:4,background:compliantPct>=80?T.greenMid:compliantPct>=50?T.amberMid:T.redMid}}/>
              <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <div style={{width:36,height:36,borderRadius:10,background:"#92400E",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon d={ICONS.chart} size={17} color="#fff"/>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:T.text}}>Compliance</span>
                </div>
                <div style={{display:"flex",borderRadius:6,overflow:"hidden",height:10,marginBottom:8}}>
                  <div style={{width:compliantPct+"%",background:T.greenMid,transition:"width .5s"}}/>
                  <div style={{flex:1,background:T.redBg}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11.5,color:T.text2}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:T.greenMid,display:"inline-block",flexShrink:0}}/>
                    <span>Compliant</span>
                    <strong style={{color:T.greenMid}}>{compliant}</strong>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11.5,color:T.text2}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:T.redMid,display:"inline-block",flexShrink:0}}/>
                    <span>Non-compliant</span>
                    <strong style={{color:T.redMid}}>{nonCompliant}</strong>
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:T.text2,marginBottom:0}}>
                  <span>Overall compliance</span>
                  <span style={{fontWeight:700,color:compliantPct>=80?T.greenMid:compliantPct>=50?T.amberMid:T.redMid}}>{compliantPct}%</span>
                </div>
                <div style={{marginTop:"auto",borderTop:`1px solid ${T.border}`,paddingTop:10,marginTop:14,fontSize:12.5,color:"#92400E",fontWeight:600,cursor:"pointer"}} onClick={e=>{e.stopPropagation();setPage("reports");}}>View Compliance Report →</div>
              </div>
            </div>
          );
        })()}
      </div>


      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:16,marginBottom:20}}>
        {/* Alerts */}
        <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:13.5,fontWeight:700,color:T.text}}>Alerts</div>
            <Btn variant="ghost" sm onClick={()=>showToast("📧 Bulk reminders sent!")}>Send All</Btn>
          </div>
          {learners.filter(l=>l.status!=="Deactivated"&&l.progress<40).slice(0,4).map(l=>(
            <div key={l.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:l.progress===0?T.redMid:T.amberMid,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12.5,color:T.text,fontWeight:500}}>{l.name} — <span style={{fontWeight:400,color:T.text2}}>{l.progress===0?"hasn't started yet":`${l.progress}% complete`}</span></div>
                <div style={{fontSize:11,color:T.text3,marginTop:2}}>{l.dept}</div>
              </div>
              <Btn variant="outline" sm onClick={()=>showToast(`✉️ Reminder sent to ${l.name.split(" ")[0]}!`)}>Remind</Btn>
            </div>
          ))}
          {learners.filter(l=>l.status!=="Deactivated"&&l.progress<40).length===0 && (
            <div style={{textAlign:"center",padding:"20px 0",color:T.text3,fontSize:13}}>✅ All learners are on track!</div>
          )}
        </div>

        {/* Quick subscription summary */}
        <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,padding:20,display:"flex",flexDirection:"column",gap:12}}>
          <div style={{fontSize:13.5,fontWeight:700,color:T.text}}>Subscription</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>⭐</span>
            <span style={{fontSize:13,fontWeight:600,color:T.text}}>{settings.plan}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{background:T.bg,borderRadius:10,padding:"10px 12px"}}>
              <div style={{fontSize:18,fontWeight:700,color:T.text}}>{settings.totalLicences}</div>
              <div style={{fontSize:11,color:T.text3,marginTop:2}}>Total licences</div>
            </div>
            <div style={{background:T.redBg,borderRadius:10,padding:"10px 12px"}}>
              <div style={{fontSize:13,fontWeight:700,color:T.redMid}}>Expired</div>
              <div style={{fontSize:11,color:T.redMid,marginTop:2}}>Dec 17, 2025</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:"auto"}}>
            <Btn variant="outline" sm onClick={()=>setPage("subscription")} style={{flex:1,justifyContent:"center"}}>Manage plan</Btn>
            <Btn variant="primary" sm onClick={()=>setPage("subscription")} style={{flex:1,justifyContent:"center"}}>Buy licences</Btn>
          </div>
        </div>
      </div>

      {/* Learner table preview */}
      <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,padding:20,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontSize:13.5,fontWeight:700,color:T.text}}>Learner Progress</div>
          <Btn variant="ghost" sm onClick={()=>setPage("learners")}>View all →</Btn>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Learner","Department","Progress","Status","Action"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",fontSize:11.5,color:T.text3,fontWeight:600,borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {learners.filter(l=>l.status!=="Deactivated").slice(0,5).map(l=>{
              const st=l.progress>=100?"Completed":l.progress>=40?"In Progress":l.progress>0?"At Risk":"Not Started";
              return (
                <tr key={l.id} style={{cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=T.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><Av initials={l.initials} color={l.color}/><span style={{fontSize:13,fontWeight:500}}>{l.name}</span></div></td>
                  <td style={{padding:"10px 12px",fontSize:12.5,color:T.text2}}>{l.dept}</td>
                  <td style={{padding:"10px 12px",minWidth:140}}><ProgCell pct={l.progress}/></td>
                  <td style={{padding:"10px 12px"}}>{statusPill(st)}</td>
                  <td style={{padding:"10px 12px"}}><Btn variant="outline" sm onClick={()=>showToast(`✉️ Reminder sent to ${l.name.split(" ")[0]}!`)}>Remind</Btn></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Course cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {courses.map(c=>(
          <div key={c.id} onClick={()=>setActiveCourse(c)} style={{background:T.white,border:"1px solid "+T.border,borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"box-shadow .15s,transform .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.09)";e.currentTarget.style.transform="translateY(-2px)"}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}>
            <div style={{height:5,background:c.color}}/>
            <div style={{padding:14}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:8}}>{c.emoji} {c.name}</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11.5,color:T.text3}}>
                <span>{c.enrolled} enrolled</span>
                <Pill label={c.completed+" done"} type={c.completed===c.enrolled?"green":"blue"}/>
              </div>
            </div>
          </div>
        ))}
      </div>
      {activeCourse&&<CourseCompletionsModal course={activeCourse} learners={learners} onClose={()=>setActiveCourse(null)} onViewReport={()=>{setReportCourse(activeCourse.id);setActiveCourse(null);setPage("reports");}}/>}
    </div>
  );
}

// ─── LEARNERS PAGE ────────────────────────────────────────────────────────────
function PageLearners({ learners, setLearners, settings, showToast, openInvite }) {
  const [tab, setTab]=useState("all");
  const [q, setQ]=useState("");
  const [deptFilter, setDeptFilter]=useState("All");
  const filtered=learners.filter(l=>{
    const matchQ=l.name.toLowerCase().includes(q.toLowerCase())||l.email.toLowerCase().includes(q.toLowerCase());
    const matchD=deptFilter==="All"||l.dept===deptFilter;
    const matchT=tab==="all"||tab===l.status.toLowerCase();
    return matchQ&&matchD&&matchT;
  });

  return (
    <div style={{padding:"24px 28px"}}>
      <div style={{display:"flex",gap:12,marginBottom:20,alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 14px",flex:1,maxWidth:320}}>
          <Icon d={ICONS.search} size={14} color={T.text3}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name, email, dept…" style={{border:"none",background:"transparent",outline:"none",fontSize:13,color:T.text,fontFamily:T.font,flex:1}}/>
        </div>
        <select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)} style={{padding:"8px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:T.font,background:T.white,color:T.text}}>
          <option>All</option>
          {settings.departments.map(d=><option key={d}>{d}</option>)}
        </select>
        <Btn variant="primary" sm onClick={openInvite}>+ Invite Learners</Btn>
      </div>

      <div style={{display:"flex",gap:2,background:T.bg,borderRadius:10,padding:4,width:"fit-content",marginBottom:20}}>
        {[["all","All"],["active","Active"],["pending","Pending"],["deactivated","Deactivated"]].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={{padding:"7px 18px",borderRadius:8,fontSize:12.5,fontWeight:500,cursor:"pointer",border:"none",background:tab===v?T.white:"transparent",color:tab===v?T.text:T.text3,boxShadow:tab===v?"0 1px 4px rgba(0,0,0,.1)":"none",fontFamily:T.font}}>{l} ({learners.filter(l2=>v==="all"||l2.status.toLowerCase()===v).length})</button>
        ))}
      </div>

      <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Learner","Email","Department","Status","Joined","Progress","Actions"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 16px",fontSize:11.5,color:T.text3,fontWeight:600,borderBottom:`1px solid ${T.border}`,background:T.bg}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(l=>(
              <tr key={l.id} onMouseEnter={e=>e.currentTarget.style.background=T.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"12px 16px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><Av initials={l.initials} color={l.color}/><span style={{fontSize:13,fontWeight:500}}>{l.name}</span></div></td>
                <td style={{padding:"12px 16px",fontSize:12.5,color:T.text2}}>{l.email}</td>
                <td style={{padding:"12px 16px",fontSize:12.5,color:T.text2}}>{l.dept}</td>
                <td style={{padding:"12px 16px"}}>{statusPill(l.status)}</td>
                <td style={{padding:"12px 16px",fontSize:12,color:T.text3}}>{new Date(l.joined).toLocaleDateString("en-GB")}</td>
                <td style={{padding:"12px 16px",minWidth:140}}><ProgCell pct={l.progress}/></td>
                <td style={{padding:"12px 16px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <Btn variant="outline" sm onClick={()=>showToast(`✉️ Reminder sent to ${l.name.split(" ")[0]}!`)}>Remind</Btn>
                    {l.status==="Deactivated"
                      ? <Btn variant="accent" sm onClick={()=>{setLearners(prev=>prev.map(x=>x.id===l.id?{...x,status:"Active"}:x));showToast("✅ Learner reactivated!");}}>Reactivate</Btn>
                      : <Btn variant="outline" sm onClick={()=>{setLearners(prev=>prev.map(x=>x.id===l.id?{...x,status:"Deactivated"}:x));showToast("⬛ Learner deactivated.");}}>Deactivate</Btn>
                    }
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0&&<tr><td colSpan={7} style={{textAlign:"center",padding:"30px",color:T.text3,fontSize:13}}>No learners found</td></tr>}
          </tbody>
        </table>
        <div style={{padding:"12px 16px",fontSize:12,color:T.text3,borderTop:`1px solid ${T.border}`}}>Showing {filtered.length} of {learners.length} learners</div>
      </div>
    </div>
  );
}

// ─── LICENCE BANNER ───────────────────────────────────────────────────────────
function LicenceBanner({ activeLearners, settings, compact=false, onUpgrade }) {
  const used = activeLearners;
  const total = settings.totalLicences;
  const remaining = total - used;
  const isOver = remaining <= 0;
  const isLow = !isOver && remaining <= 1;

  if (isOver) {
    return (
      <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:compact?"10px 12px":"12px 14px",background:T.redBg,border:`1px solid ${T.redMid}`,borderRadius:10,marginBottom:16}}>
        <span style={{fontSize:16,flexShrink:0}}>🚫</span>
        <div>
          <div style={{fontSize:12.5,fontWeight:700,color:T.red}}>Licence limit reached</div>
          <div style={{fontSize:12,color:T.red,opacity:.85,marginTop:2}}>
            All {total} licence{total>1?"s":""} are in use. You cannot add new learners until you{" "}
            <span style={{textDecoration:"underline",cursor:"pointer",fontWeight:600}} onClick={onUpgrade}>upgrade your plan</span>.
          </div>
        </div>
      </div>
    );
  }
  if (isLow) {
    return (
      <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:compact?"10px 12px":"12px 14px",background:T.amberBg,border:`1px solid ${T.amberMid}`,borderRadius:10,marginBottom:16}}>
        <span style={{fontSize:16,flexShrink:0}}>⚠️</span>
        <div>
          <div style={{fontSize:12.5,fontWeight:700,color:T.amber}}>Almost at licence limit</div>
          <div style={{fontSize:12,color:T.amber,opacity:.85,marginTop:2}}>{remaining} licence slot{remaining>1?"s":""} remaining out of {total}.</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,padding:compact?"8px 12px":"10px 14px",background:T.greenBg,border:`1px solid ${T.greenMid}`,borderRadius:10,marginBottom:16}}>
      <span style={{fontSize:15,flexShrink:0}}>✅</span>
      <div style={{fontSize:12,color:T.green,fontWeight:500}}>
        <strong>{remaining} licence slot{remaining!==1?"s":""} available</strong> · {used} of {total} used
      </div>
    </div>
  );
}

// ─── INVITE MODAL ─────────────────────────────────────────────────────────────
function InviteModal({ open, onClose, learners, setLearners, settings, showToast, setPage }) {
  const [step, setStep]=useState(1);
  const [emails, setEmails]=useState(["","",""]);
  const [firstName, setFirstName]=useState("");
  const [lastName, setLastName]=useState("");
  const [email, setEmail]=useState("");
  const [dept, setDept]=useState(settings.departments[0]);
  const [tab, setTab]=useState("email");
  const [msg, setMsg]=useState(`Good news! ${settings.companyName} has invited you to the Care Skills Training platform.`);

  const activeLearners = learners.filter(l=>l.status!=="Deactivated").length;
  const licencesRemaining = settings.totalLicences - activeLearners;
  const licenceExhausted = licencesRemaining <= 0;

  const reset=()=>{setStep(1);setEmails(["","",""]);setFirstName("");setLastName("");setEmail("");setStep(1);};
  const close=()=>{reset();onClose();};

  const sendInvites=()=>{
    if(licenceExhausted){showToast("🚫 No licences available. Upgrade your plan first.","error");return;}
    const valid=tab==="single"
      ? firstName&&email?[{firstName,lastName,email,dept}]:[]
      : emails.filter(e=>e.trim());
    if(!valid.length){showToast("⚠️ Please enter at least one email","error");return;}
    if(tab==="single"){
      const init=(firstName[0]+(lastName[0]||"")).toUpperCase();
      const cols=["#2A6FDB","#16A34A","#DC2626","#7C3AED","#0891B2","#BE185D","#059669"];
      setLearners(prev=>[...prev,{id:"L"+Date.now(),name:`${firstName} ${lastName}`.trim(),email,dept,initials:init,color:cols[prev.length%cols.length],status:"Pending",joined:new Date().toISOString().split("T")[0],progress:0}]);
      showToast(`✅ ${firstName} invited successfully!`);
    } else {
      showToast(`✉️ ${valid.length} invitation${valid.length>1?"s":""} sent!`);
    }
    close();
  };

  return (
    <Modal open={open} onClose={close} title="Invite New Learners">
      {/* Licence status banner always visible */}
      <LicenceBanner activeLearners={activeLearners} settings={settings} onUpgrade={()=>{onClose();setPage("subscription");}}/>

      <div style={{display:"flex",gap:2,background:T.bg,borderRadius:10,padding:4,marginBottom:20,width:"fit-content"}}>
        {[["email","Bulk by Email"],["single","Single Learner"],["csv","Import CSV"]].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={{padding:"6px 14px",borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",border:"none",background:tab===v?T.white:"transparent",color:tab===v?T.text:T.text3,fontFamily:T.font}}>
            {l}
          </button>
        ))}
      </div>

      {tab==="email"&&step===1&&(<>
        <p style={{fontSize:13,color:T.text3,marginBottom:16}}>Enter emails to invite multiple learners at once:</p>
        {emails.map((e,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
            <Av initials={String(i+1)} color={T.navy} size={28}/>
            <input value={e} onChange={ev=>{const a=[...emails];a[i]=ev.target.value;setEmails(a);}} placeholder="Type user email" disabled={licenceExhausted} style={{flex:1,padding:"8px 12px",border:`1px solid ${licenceExhausted?T.redMid:T.border}`,borderRadius:8,fontSize:13,fontFamily:T.font,outline:"none",background:licenceExhausted?"#FFF5F5":"white",color:licenceExhausted?T.text3:T.text,cursor:licenceExhausted?"not-allowed":"text"}}/>
          </div>
        ))}
        <Btn variant="ghost" sm onClick={()=>setEmails([...emails,""])} style={{marginTop:6,marginBottom:20,opacity:licenceExhausted?.4:1,cursor:licenceExhausted?"not-allowed":"pointer"}}>+ Add more</Btn>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:16,paddingTop:16,borderTop:`1px solid ${T.border}`}}>
          <Btn variant="outline" onClick={close}>Cancel</Btn>
          <Btn variant="primary" onClick={()=>licenceExhausted?showToast("🚫 No licences available","error"):setStep(2)} style={{opacity:licenceExhausted?.5:1,cursor:licenceExhausted?"not-allowed":"pointer"}}>Next →</Btn>
        </div>
      </>)}

      {tab==="email"&&step===2&&(<>
        <div style={{display:"flex",gap:6,marginBottom:16}}>
          <div style={{flex:1,height:4,borderRadius:4,background:T.accent}}/>
          <div style={{flex:1,height:4,borderRadius:4,background:T.accent}}/>
        </div>
        <div style={{fontSize:12,color:T.text3,marginBottom:16}}>Step 2 of 2 — Customise the invitation message</div>
        <Select label="Invite language"><option>English</option><option>Welsh</option></Select>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:600,color:T.text2,marginBottom:5}}>Custom message</div>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={3} style={{width:"100%",padding:"9px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:T.font,resize:"vertical",boxSizing:"border-box"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:16,paddingTop:16,borderTop:`1px solid ${T.border}`}}>
          <Btn variant="outline" onClick={()=>setStep(1)}>← Back</Btn>
          <Btn variant="accent" onClick={sendInvites}>Send Invitations</Btn>
        </div>
      </>)}

      {tab==="single"&&(<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,opacity:licenceExhausted?.5:1,pointerEvents:licenceExhausted?"none":"auto"}}>
          <Input label="First name" value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="First name"/>
          <Input label="Last name" value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Last name"/>
        </div>
        <div style={{opacity:licenceExhausted?.5:1,pointerEvents:licenceExhausted?"none":"auto"}}>
          <Input label="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@company.com"/>
          <Select label="Department" value={dept} onChange={e=>setDept(e.target.value)}>
            {settings.departments.map(d=><option key={d}>{d}</option>)}
          </Select>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:8,paddingTop:16,borderTop:`1px solid ${T.border}`}}>
          <Btn variant="outline" onClick={close}>Cancel</Btn>
          <Btn variant="accent" onClick={sendInvites} style={{opacity:licenceExhausted?.5:1,cursor:licenceExhausted?"not-allowed":"pointer"}}>Invite & Add</Btn>
        </div>
      </>)}

      {tab==="csv"&&(<>
        <p style={{fontSize:13,color:T.text3,marginBottom:16}}>Upload a CSV file to bulk-import learners. <a href="#" style={{color:T.accent}} onClick={e=>{e.preventDefault();showToast("📖 CSV format guide")}}>Learn how →</a></p>
        <div style={{display:"flex",gap:10,marginBottom:12}}>
          <input readOnly placeholder="No file selected" style={{flex:1,padding:"9px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:T.font}}/>
          <Btn variant="outline" onClick={()=>showToast("📂 File browser opened")}>Select file</Btn>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:16}}><input type="checkbox" style={{marginTop:3}}/><label style={{fontSize:12.5,color:T.text2}}>Allow CSV import to remove users from groups</label></div>
        <Select label="Invite language"><option>English</option><option>Welsh</option></Select>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:8,paddingTop:16,borderTop:`1px solid ${T.border}`}}>
          <Btn variant="outline" onClick={close}>Cancel</Btn>
          <Btn variant="primary" onClick={()=>{showToast("📤 Users imported!");close();}}>Import Users</Btn>
        </div>
      </>)}
    </Modal>
  );
}

// ─── ASSIGN MODAL ─────────────────────────────────────────────────────────────
function AssignModal({ open, onClose, courses, setCourses, learners, setLearners, settings, showToast, setPage }) {
  const [courseId, setCourseId]=useState(courses[0]?.id||"");
  const [assignTo, setAssignTo]=useState("all");
  const [dept, setDept]=useState("All");
  const [selectedIds, setSelectedIds]=useState(new Set());
  const [dueDate, setDueDate]=useState("");
  const [q, setQ]=useState("");

  const activeLearners = learners.filter(l=>l.status!=="Deactivated").length;
  const licencesRemaining = settings.totalLicences - activeLearners;
  const licenceExhausted = licencesRemaining <= 0;

  const toggle=(id)=>setSelectedIds(prev=>{const s=new Set(prev);s.has(id)?s.delete(id):s.add(id);return s;});
  const filtered=learners.filter(l=>l.status!=="Deactivated"&&(l.name.toLowerCase().includes(q.toLowerCase())||l.email.toLowerCase().includes(q.toLowerCase())));

  const submit=()=>{
    const c=courses.find(x=>x.id===courseId);
    if(!c)return;
    if(licenceExhausted){showToast("🚫 No licences available. Upgrade your plan to assign courses to new learners.","error");return;}
    let added=0;
    if(assignTo==="specific"){
      if(!selectedIds.size){showToast("⚠️ Select at least one learner","error");return;}
      added=selectedIds.size;
    } else if(assignTo==="all"){
      added=learners.filter(l=>l.status!=="Deactivated").length;
    } else {
      added=learners.filter(l=>l.status!=="Deactivated"&&l.dept===dept).length;
    }
    setCourses(prev=>prev.map(x=>x.id===courseId?{...x,enrolled:x.enrolled+added,inProgress:x.inProgress+added}:x));
    if(assignTo==="specific"){
      setLearners(prev=>prev.map(l=>selectedIds.has(l.id)?{...l,progress:l.progress===0?5:l.progress}:l));
    }
    showToast(`📚 "${c.name}" assigned to ${added} learner${added>1?"s":""}!`);
    setSelectedIds(new Set());onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Assign Course">
      <LicenceBanner activeLearners={activeLearners} settings={settings} compact onUpgrade={()=>{onClose();setPage("subscription");}}/>
      <Select label="Select Course" value={courseId} onChange={e=>setCourseId(e.target.value)}>
        {courses.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
      </Select>
      <Select label="Assign to" value={assignTo} onChange={e=>setAssignTo(e.target.value)}>
        <option value="all">All learners</option>
        <option value="specific">Specific team members</option>
        <option value="dept">By department</option>
      </Select>

      {assignTo==="dept"&&(
        <Select label="Department" value={dept} onChange={e=>setDept(e.target.value)}>
          {settings.departments.map(d=><option key={d}>{d}</option>)}
        </Select>
      )}

      {assignTo==="specific"&&(
        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:600,color:T.text2,marginBottom:6}}>Select Learners</div>
          <div style={{border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderBottom:`1px solid ${T.border}`,background:T.bg}}>
              <Icon d={ICONS.search} size={13} color={T.text3}/>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search learners…" style={{border:"none",background:"transparent",outline:"none",fontSize:12.5,fontFamily:T.font,flex:1}}/>
            </div>
            <div style={{maxHeight:200,overflowY:"auto"}}>
              {filtered.map(l=>(
                <div key={l.id} onClick={()=>toggle(l.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",cursor:"pointer",borderBottom:`1px solid ${T.border}`,background:selectedIds.has(l.id)?T.accentLight:"transparent"}}
                  onMouseEnter={e=>{if(!selectedIds.has(l.id))e.currentTarget.style.background=T.bg;}}
                  onMouseLeave={e=>{if(!selectedIds.has(l.id))e.currentTarget.style.background="transparent";}}>
                  <input type="checkbox" readOnly checked={selectedIds.has(l.id)} style={{accentColor:T.accent}}/>
                  <Av initials={l.initials} color={l.color} size={28}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:500,color:T.text}}>{l.name}</div>
                    <div style={{fontSize:11,color:T.text3}}>{l.email} · {l.dept}</div>
                  </div>
                  {selectedIds.has(l.id)&&<Pill label="✓ Selected" type="green"/>}
                </div>
              ))}
            </div>
            <div onClick={()=>showToast("Use the Invite tab to add a new learner first")} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",cursor:"pointer",color:T.accent,fontSize:13,fontWeight:500,background:T.accentLight,borderTop:`1px solid #B3D4F5`}}>
              <Icon d={ICONS.plus} size={14} color={T.accent}/>+ Add a new learner
            </div>
          </div>
          {selectedIds.size>0&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
              {[...selectedIds].map(id=>{const l=learners.find(x=>x.id===id);return l?<span key={id} style={{display:"inline-flex",alignItems:"center",gap:5,background:T.accentLight,color:T.accent2,fontSize:12,fontWeight:500,padding:"3px 10px",borderRadius:20}}>{l.initials} {l.name.split(" ")[0]}<button onClick={()=>toggle(id)} style={{background:"none",border:"none",cursor:"pointer",color:T.accent,fontSize:14,lineHeight:1,padding:0}}>×</button></span>:null;})}
            </div>
          )}
        </div>
      )}

      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:T.text2,marginBottom:5}}>Due Date <span style={{fontWeight:400,color:T.text3}}>(optional)</span></div>
        <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} style={{width:"100%",padding:"9px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:T.font,boxSizing:"border-box"}}/>
      </div>

      <div style={{display:"flex",justifyContent:"flex-end",gap:10,paddingTop:16,borderTop:`1px solid ${T.border}`}}>
        <Btn variant="outline" onClick={onClose}>Cancel</Btn>
        <Btn variant={licenceExhausted?"outline":"primary"} onClick={submit} style={{opacity:licenceExhausted?.5:1,cursor:licenceExhausted?"not-allowed":"pointer"}}>
          {licenceExhausted?"🚫 No Licences Available":"Assign Course"}
        </Btn>
      </div>
    </Modal>
  );
}

// ─── COURSES PAGE ─────────────────────────────────────────────────────────────
function PageCourses({ courses, openAssign, setPage, setReportCourse }) {
  return (
    <div style={{padding:"24px 28px"}}>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:20}}>
        <Btn variant="primary" sm onClick={openAssign}>+ Assign Course</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        {courses.map(c=>(
          <div key={c.id} onClick={()=>{setReportCourse(c.id);setPage("reports");}} style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden",cursor:"pointer",transition:"box-shadow .15s,transform .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,.1)";e.currentTarget.style.transform="translateY(-2px)"}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}>
            <div style={{height:6,background:c.color}}/>
            <div style={{padding:18}}>
              <div style={{fontSize:16,marginBottom:4}}>{c.emoji}</div>
              <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4}}>{c.name}</div>
              <div style={{fontSize:12,color:T.text3,marginBottom:14}}>{c.duration} · Certificate</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
                {[["Enrolled",c.enrolled,"blue"],["In Progress",c.inProgress,"amber"],["Completed",c.completed,"green"]].map(([l,v,t])=>(
                  <div key={l} style={{background:T.bg,borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
                    <div style={{fontSize:16,fontWeight:700,color:T.text}}>{v}</div>
                    <div style={{fontSize:10.5,color:T.text3}}>{l}</div>
                  </div>
                ))}
              </div>
              <ProgCell pct={c.enrolled>0?Math.round((c.completed/c.enrolled)*100):0}/>
              <div style={{marginTop:10,fontSize:11.5,color:T.accent,fontWeight:600,textAlign:"right"}}>View Report →</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ASSIGNED PAGE ────────────────────────────────────────────────────────────
function PageAssigned({ courses, openAssign, showToast }) {
  return (
    <div style={{padding:"24px 28px"}}>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:20}}>
        <Btn variant="primary" sm onClick={openAssign}>Assign New Course</Btn>
      </div>
      <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Course","Assigned","Dept","In Progress","Completed","Certs","Actions"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 16px",fontSize:11.5,color:T.text3,fontWeight:600,borderBottom:`1px solid ${T.border}`,background:T.bg}}>{h}</th>)}</tr></thead>
          <tbody>
            {courses.map(c=>(
              <tr key={c.id} onMouseEnter={e=>e.currentTarget.style.background=T.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"12px 16px"}}><div style={{fontWeight:600,fontSize:13}}>{c.emoji} {c.name}</div><div style={{fontSize:11,color:T.text3}}>{c.duration} · Certificate</div></td>
                <td style={{padding:"12px 16px",fontWeight:700,fontSize:14}}>{c.enrolled}</td>
                <td style={{padding:"12px 16px",fontSize:12.5,color:T.text2}}>{c.dept}</td>
                <td style={{padding:"12px 16px",fontSize:13}}>{c.inProgress}</td>
                <td style={{padding:"12px 16px",fontSize:13}}>{c.completed}</td>
                <td style={{padding:"12px 16px",fontSize:13}}>{c.certs}</td>
                <td style={{padding:"12px 16px"}}><div style={{display:"flex",gap:6}}><Btn variant="outline" sm onClick={()=>showToast(`📊 ${c.name} report`)}>Report</Btn><Btn variant="outline" sm onClick={openAssign}>Reassign</Btn></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── CERTS PAGE ───────────────────────────────────────────────────────────────
function PageCerts({ certs, setCerts, settings, setSettings, showToast }) {
  const isYes = settings.certDownloadControl === "yes";
  return (
    <div style={{padding:"24px 28px"}}>

      {/* Locked cert control hint — replaces editable dropdown */}
      <div style={{display:"flex",alignItems:"flex-start",gap:14,background:isYes?T.greenBg:T.amberBg,border:`1px solid ${isYes?"#86EFAC":"#FCD34D"}`,borderRadius:12,padding:"16px 20px",marginBottom:20}}>
        <div style={{fontSize:28,flexShrink:0}}>{isYes?"🟢":"🔒"}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <div style={{fontSize:13.5,fontWeight:700,color:isYes?T.green:T.amber}}>
              {isYes?"Learners can self-download certificates":"Only you can download certificates"}
            </div>
            <span style={{display:"inline-flex",alignItems:"center",gap:4,background:isYes?T.green:T.amber,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>
              🔒 LOCKED
            </span>
          </div>
          <div style={{fontSize:12.5,color:isYes?T.green:T.amber,lineHeight:1.6,opacity:.9}}>
            {isYes
              ? "After completing a course, learners can download their own certificate directly from their My Learning page. No action needed from you — certificates are distributed automatically."
              : "Certificates will not be visible to learners. Once a learner completes a course, you'll see it flagged here — download and distribute manually. Learners see a 'Certificate pending' message."}
          </div>
          <div style={{marginTop:8,fontSize:11.5,color:isYes?T.green:T.amber,fontWeight:600,opacity:.7}}>
            ℹ️ This was set during initial setup and cannot be changed.
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        <StatCard label="Claimed" value={certs.filter(c=>c.status!=="Expired").length} sub="total certificates"/>
        <StatCard label="Active" value={certs.filter(c=>c.status==="Active").length} sub="all current" subColor={T.greenMid}/>
        <StatCard label="Expiring Soon" value={certs.filter(c=>c.status==="Expiring").length} sub="action needed" subColor={T.amberMid}/>
        <StatCard label="Expired" value={certs.filter(c=>c.status==="Expired").length} sub="renewal needed" subColor={T.redMid}/>
      </div>

      <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{fontSize:14,fontWeight:700,color:T.text}}>Certificate Records</div>
          <Btn variant="outline" sm onClick={()=>showToast("📥 Certificate report downloaded!")}>Download Report</Btn>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Learner","Course","Claimed On","Type","Status","Download"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 16px",fontSize:11.5,color:T.text3,fontWeight:600,borderBottom:`1px solid ${T.border}`,background:T.bg}}>{h}</th>)}</tr></thead>
          <tbody>
            {certs.map(c=>(
              <tr key={c.id} onMouseEnter={e=>e.currentTarget.style.background=T.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"12px 16px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Av initials={c.learnerName.split(" ").map(w=>w[0]).join("").slice(0,2)} color={T.accent}/><span style={{fontSize:13,fontWeight:500}}>{c.learnerName}</span></div></td>
                <td style={{padding:"12px 16px",fontSize:12.5}}>{c.courseName}</td>
                <td style={{padding:"12px 16px",fontSize:12,color:T.text3}}>{new Date(c.claimedOn).toLocaleDateString("en-GB")}</td>
                <td style={{padding:"12px 16px"}}><Pill label={c.type} type="blue"/></td>
                <td style={{padding:"12px 16px"}}>{statusPill(c.status==="Active"?"Active":c.status==="Expiring"?"Pending":"Deactivated")}</td>
                <td style={{padding:"12px 16px"}}><Btn variant="outline" sm onClick={()=>showToast("📄 Certificate downloaded!")}>⬇ Download</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TEAM MEMBERS REPORT ─────────────────────────────────────────────────────
function TeamMembersReport({ learners, courses, showToast }) {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDept, setFilterDept] = useState("All");

  const getCourseStatus = (learnerProgress, courseIdx, total) => {
    const threshold = (courseIdx + 1) / total * 100;
    const prev = courseIdx / total * 100;
    if (learnerProgress >= threshold) return "Completed";
    if (learnerProgress > prev) return "In Progress";
    return "Not Started";
  };

  const getCompletedDate = (l) => {
    if (l.progress < 100) return "—";
    const d = new Date(l.joined); d.setMonth(d.getMonth()+2);
    return d.toLocaleDateString("en-GB");
  };
  const getAllocatedDate = (l) => {
    const d = new Date(l.joined); d.setDate(d.getDate()+3);
    return d.toLocaleDateString("en-GB");
  };
  const getLastAccessed = (l) => {
    const d = new Date(l.joined); d.setMonth(d.getMonth()+2); d.setDate(d.getDate()+5);
    return d.toLocaleDateString("en-GB");
  };

  // Build flat rows: one per learner × course
  const allRows = [];
  learners.forEach(l => {
    courses.forEach((c, i) => {
      const cs = getCourseStatus(l.progress, i, courses.length);
      const statusLabel = cs === "Completed" ? "Certificate Sent" : cs === "In Progress" ? "In Progress" : "Not Started";
      const pct = cs === "Completed" ? 100 : cs === "In Progress" ? Math.round(((l.progress - (i/courses.length*100)) / (100/courses.length))) : 0;
      allRows.push({ l, c, cs, statusLabel, pct: Math.min(100, Math.max(0, pct)) });
    });
  });

  const depts = ["All", ...Array.from(new Set(learners.map(l=>l.dept)))];
  const statuses = ["All","Completed","In Progress","Not Started"];

  const filtered = allRows.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.l.name.toLowerCase().includes(q) || r.l.email.toLowerCase().includes(q) || r.c.name.toLowerCase().includes(q);
    const matchStatus = filterStatus === "All" || r.cs === filterStatus;
    const matchDept = filterDept === "All" || r.l.dept === filterDept;
    return matchSearch && matchStatus && matchDept;
  });

  const uniqueLearners = new Set(filtered.map(r=>r.l.id)).size;
  const uniqueCourses = new Set(filtered.map(r=>r.c.id)).size;

  const inpStyle = {width:"100%",padding:"10px 40px 10px 14px",border:"1px solid "+T.border,borderRadius:8,fontSize:13,color:T.text,outline:"none",background:T.white};
  const selStyle = {padding:"8px 12px",border:"1px solid "+T.border,borderRadius:8,fontSize:12.5,color:T.text,background:T.white,outline:"none",cursor:"pointer"};

  return (
    <div style={{background:T.white,border:"1px solid "+T.border,borderRadius:12,overflow:"hidden"}}>
      {/* Title */}
      <div style={{padding:"20px 24px 0"}}>
        <div style={{fontSize:18,fontWeight:700,color:T.text,marginBottom:16}}>Reports: All Users</div>
        {/* Search + buttons */}
        <div style={{display:"flex",gap:10,marginBottom:12}}>
          <div style={{flex:1,position:"relative"}}>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Enter Learner Name Or Username To Search"
              style={inpStyle}/>
            <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:T.text3,fontSize:15,pointerEvents:"none"}}>🔍</span>
          </div>
          <Btn variant="outline" sm onClick={()=>showToast("📥 Report exported!")}>⬇ Export Report</Btn>
          <button onClick={()=>setShowFilters(f=>!f)} style={{padding:"8px 16px",background:showFilters?T.accent:"#F97316",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            {showFilters?"▲":"▼"} Show Filters
          </button>
        </div>
        {/* Filters row */}
        {showFilters&&(
          <div style={{display:"flex",gap:12,marginBottom:12,padding:"12px 0",borderTop:"1px solid "+T.border}}>
            <div>
              <div style={{fontSize:11,color:T.text3,marginBottom:4,fontWeight:600}}>STATUS</div>
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={selStyle}>
                {statuses.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:11,color:T.text3,marginBottom:4,fontWeight:600}}>DEPARTMENT</div>
              <select value={filterDept} onChange={e=>setFilterDept(e.target.value)} style={selStyle}>
                {depts.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div style={{alignSelf:"flex-end"}}>
              <Btn variant="outline" sm onClick={()=>{setFilterStatus("All");setFilterDept("All");setSearch("");}}>Reset</Btn>
            </div>
          </div>
        )}
        {/* Record count */}
        <div style={{fontSize:12.5,color:T.text2,paddingBottom:12,borderBottom:"1px solid "+T.border}}>
          This report contains <strong>{filtered.length}</strong> record(s) from <strong>{uniqueLearners}</strong> learner(s) on <strong>{uniqueCourses}</strong> courses.
        </div>
      </div>
      {/* Table */}
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead>
          <tr>{["Name","Email","Course","Status","Progress","Completed","Allocated","Last Accessed"].map(h=>(
            <th key={h} style={{textAlign:"left",padding:"10px 16px",fontSize:12,color:T.text2,fontWeight:700,borderBottom:"1px solid "+T.border,background:T.bg,whiteSpace:"nowrap"}}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {filtered.length===0?(
            <tr><td colSpan={8} style={{padding:"32px",textAlign:"center",color:T.text3,fontSize:13}}>No records match your search.</td></tr>
          ):filtered.map((r,idx)=>(
            <tr key={r.l.id+"-"+r.c.id}
              style={{borderBottom:"1px solid "+T.border,background:idx%2===0?T.white:T.bg}}
              onMouseEnter={e=>e.currentTarget.style.background=T.accentLight}
              onMouseLeave={e=>e.currentTarget.style.background=idx%2===0?T.white:T.bg}>
              <td style={{padding:"12px 16px",fontSize:13,fontWeight:500,color:T.text,whiteSpace:"nowrap"}}>{r.l.name}</td>
              <td style={{padding:"12px 16px",fontSize:12.5,color:T.text2}}>{r.l.email}</td>
              <td style={{padding:"12px 16px",fontSize:12.5,color:T.text}}>{r.c.emoji} {r.c.name}</td>
              <td style={{padding:"12px 16px"}}>
                <span style={{fontSize:12,fontWeight:600,color:r.cs==="Completed"?T.greenMid:r.cs==="In Progress"?T.accent:T.text3}}>{r.statusLabel}</span>
              </td>
              <td style={{padding:"12px 16px"}}>
                <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",background:r.cs==="Completed"?"#16A34A":r.cs==="In Progress"?T.accent:T.text3,color:"#fff",borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:700,minWidth:48}}>
                  {r.pct}%
                </div>
              </td>
              <td style={{padding:"12px 16px",fontSize:12.5,color:T.text2,whiteSpace:"nowrap"}}>{r.cs==="Completed"?getCompletedDate(r.l):"—"}</td>
              <td style={{padding:"12px 16px",fontSize:12.5,color:T.text2,whiteSpace:"nowrap"}}>{getAllocatedDate(r.l)}</td>
              <td style={{padding:"12px 16px",fontSize:12.5,color:T.text2,whiteSpace:"nowrap"}}>{getLastAccessed(r.l)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
function PageReports({ courses, learners, certs, showToast, initialCourseId, clearReportCourse }) {
  const [rtab, setRtab]=useState("course");
  const [highlightId, setHighlightId]=useState(initialCourseId||null);
  useEffect(()=>{ if(initialCourseId){ setRtab("course"); setHighlightId(initialCourseId); clearReportCourse&&clearReportCourse(); } },[initialCourseId]);
  const tabs=[["course","Course Reports"],["team","Team Members"],["cert","Certificates"],["activity","User Activity"]];
  const active=learners.filter(l=>l.status!=="Deactivated");

  return (
    <div style={{padding:"24px 28px"}}>
      <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,marginBottom:20}}>
        {tabs.map(([v,l])=>(
          <div key={v} onClick={()=>setRtab(v)} style={{padding:"10px 18px",fontSize:13,cursor:"pointer",borderBottom:`2px solid ${rtab===v?T.accent:"transparent"}`,color:rtab===v?T.accent:T.text3,fontWeight:rtab===v?600:400,marginBottom:-1,transition:"all .15s"}}>{l}</div>
        ))}
      </div>

      {rtab==="course"&&(
        <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"flex-end",padding:"14px 20px",borderBottom:`1px solid ${T.border}`}}>
            <Btn variant="outline" sm onClick={()=>showToast("📥 Course report exported!")}>⬇ Download</Btn>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["Course","Assigned","In Progress","Completed","Certs"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 16px",fontSize:11.5,color:T.text3,fontWeight:600,borderBottom:`1px solid ${T.border}`,background:T.bg}}>{h}</th>)}</tr></thead>
            <tbody>{courses.map(c=>{
              const isHL=highlightId===c.id;
              return(
              <tr key={c.id} style={{background:isHL?T.accentLight:"transparent",transition:"background .2s"}}
                onMouseEnter={e=>e.currentTarget.style.background=isHL?T.accentLight:T.bg}
                onMouseLeave={e=>e.currentTarget.style.background=isHL?T.accentLight:"transparent"}>
                <td style={{padding:"12px 16px",fontWeight:isHL?700:500,color:isHL?T.accent2:T.text}}>
                  {isHL&&<span style={{marginRight:6,fontSize:11,background:T.accent,color:"#fff",padding:"2px 7px",borderRadius:10,verticalAlign:"middle"}}>Selected</span>}
                  {c.emoji} {c.name}
                </td>
                <td style={{padding:"12px 16px",fontWeight:700}}>{c.enrolled}</td>
                <td style={{padding:"12px 16px"}}>{c.inProgress}</td>
                <td style={{padding:"12px 16px"}}>{c.completed}/{c.enrolled}</td>
                <td style={{padding:"12px 16px"}}>{c.certs}</td>
              </tr>);
            })}</tbody>
          </table>
        </div>
      )}

      {rtab==="team"&&<TeamMembersReport learners={learners} courses={courses} showToast={showToast}/>}

      {rtab==="cert"&&(
        <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["Course","Claimed by","Dept","Date","Status"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 12px",fontSize:11.5,color:T.text3,fontWeight:600,borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{certs.map(c=>(<tr key={c.id}>
              <td style={{padding:"11px 12px",fontSize:12.5}}>{c.courseName}</td>
              <td style={{padding:"11px 12px",fontSize:12.5,fontWeight:500}}>{c.learnerName}</td>
              <td style={{padding:"11px 12px",fontSize:12,color:T.text3}}>—</td>
              <td style={{padding:"11px 12px",fontSize:12,color:T.text3}}>{new Date(c.claimedOn).toLocaleDateString("en-GB")}</td>
              <td style={{padding:"11px 12px"}}>{statusPill(c.status==="Active"?"Active":c.status==="Expiring"?"Pending":"Deactivated")}</td>
            </tr>))}</tbody>
          </table>
        </div>
      )}

      {rtab==="activity"&&(
        <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[["Avg. watch/user","48m"],["Active users",active.length],["Total visits","2"],["Most active","CT"]].map(([l,v])=>(
              <div key={l} style={{background:T.bg,borderRadius:10,padding:14,textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:700,color:T.text}}>{v}</div>
                <div style={{fontSize:11.5,color:T.text3,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{background:T.bg,borderRadius:10,padding:20,textAlign:"center",color:T.text3,fontSize:13}}>📈 Activity trend — check back after more learners join.</div>
        </div>
      )}
    </div>
  );
}

// ─── SUBSCRIPTION PAGE ────────────────────────────────────────────────────────
const TIERS = [
  {
    name:"Starter", seats:"1 – 9 Seats", price:59, unit:"licence", color:"#6B21A8", gradient:"linear-gradient(135deg,#7C3AED,#6B21A8)",
    best:"Suitable for individuals and small teams",
    features:["Effortless Course Management","Dedicated Learner Support","Regular Content Updates"],
  },
  {
    name:"Growth", seats:"10 – 24 Seats", price:44, unit:"licence", color:"#1A54B0", gradient:"linear-gradient(135deg,#2A6FDB,#1A54B0)",
    best:"Suitable for growing care organisations",
    features:["Effortless Course Management","Dedicated Learner Support","Dedicated Account Manager","Regular Content Updates"],
  },
  {
    name:"Professional", seats:"25 – 99 Seats", price:38, unit:"licence", color:"#0891B2", gradient:"linear-gradient(135deg,#06B6D4,#0891B2)",
    best:"Suitable for small to medium businesses",
    features:["Effortless Course Management","Dedicated Learner Support","Dedicated Account Manager","Regular Content Updates","CQC Compliance Reporting"],
    popular:true,
  },
  {
    name:"Enterprise", seats:"100+ Seats", price:null, unit:null, color:"#BE185D", gradient:"linear-gradient(135deg,#EC4899,#BE185D)",
    best:"Suitable for medium to large businesses",
    features:["Effortless Course Management","Dedicated Learner Support","Dedicated Account Manager","Regular Content Updates","CQC Compliance Reporting","Custom Onboarding & Training"],
    contact:true,
  },
];

function PricingCard({ tier }) {
  return (
    <div style={{background:T.white,borderRadius:16,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.08)",border:`1px solid ${T.border}`,display:"flex",flexDirection:"column",transition:"transform .2s,box-shadow .2s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 32px ${tier.color}33`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.08)";}}>

      {/* Coloured header */}
      <div style={{background:tier.gradient,padding:"22px 22px 20px",position:"relative",overflow:"hidden"}}>
        {tier.popular&&(
          <div style={{position:"absolute",top:10,right:10,background:"rgba(255,255,255,.25)",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,letterSpacing:".06em",textTransform:"uppercase",backdropFilter:"blur(4px)"}}>
            Most Popular
          </div>
        )}
        <div style={{position:"absolute",bottom:-20,right:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,.08)"}}/>
        <div style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:10}}>{tier.seats}</div>
        <div style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,.85)",lineHeight:1.4}}>{tier.best}</div>
      </div>

      {/* Features */}
      <div style={{padding:"20px 22px",flex:1}}>
        {tier.features.map((f,i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
            <div style={{width:18,height:18,borderRadius:"50%",background:tier.color+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke={tier.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{fontSize:12.5,color:T.text2,lineHeight:1.4}}>{f}</span>
          </div>
        ))}
      </div>

      {/* Price / CTA */}
      <div style={{padding:"16px 22px 22px",borderTop:`1px solid ${T.border}`}}>
        {tier.contact
          ? <button style={{width:"100%",padding:"11px 0",borderRadius:10,border:`2px solid ${tier.color}`,background:"transparent",color:tier.color,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:T.font,transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=tier.color;e.currentTarget.style.color="#fff";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=tier.color;}}>
              Contact us
            </button>
          : <div>
              <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:10}}>(£{tier.price}/licence)</div>
              <button style={{width:"100%",padding:"11px 0",borderRadius:10,border:"none",background:tier.gradient,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>
                Select Plan →
              </button>
            </div>
        }
      </div>
    </div>
  );
}

function LicenceCalculator({ showToast }) {
  const [qty, setQty]=useState(21);
  const getPrice=(n)=> n>=100?null: n>=25?38: n>=10?44:59;
  const price=getPrice(qty);
  const total=price?price*qty:null;
  const tierName=qty>=100?"Enterprise":qty>=25?"Professional":qty>=10?"Growth":"Starter";
  const tierColor=qty>=100?"#BE185D":qty>=25?"#0891B2":qty>=10?"#1A54B0":"#6B21A8";

  return (
    <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:16,padding:"28px 32px",marginBottom:24,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:40,alignItems:"center"}}>

        {/* Left: slider */}
        <div>
          <div style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:4}}>Choose Licences</div>
          <div style={{fontSize:13,fontWeight:600,color:"#E11D48",marginBottom:24}}>*1 licence = 1 course for 1 team member</div>

          {/* Slider */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:32,height:32,borderRadius:8,border:`1px solid ${T.border}`,background:T.white,cursor:"pointer",fontSize:18,color:T.text2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>−</button>
            <input type="range" min={1} max={249} value={qty} onChange={e=>setQty(Number(e.target.value))}
              style={{flex:1,accentColor:"#E11D48",height:6,cursor:"pointer"}}/>
            <button onClick={()=>setQty(q=>Math.min(249,q+1))} style={{width:32,height:32,borderRadius:8,border:`1px solid ${T.border}`,background:T.white,cursor:"pointer",fontSize:18,color:T.text2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>+</button>
          </div>

          {/* Stepper */}
          <div style={{display:"flex",alignItems:"center",gap:0,width:"fit-content",border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
            <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:40,height:40,border:"none",background:T.white,cursor:"pointer",fontSize:16,color:T.text2,borderRight:`1px solid ${T.border}`}}>−</button>
            <input type="number" min={1} max={249} value={qty} onChange={e=>setQty(Math.min(249,Math.max(1,Number(e.target.value)||1)))}
              style={{width:60,height:40,border:"none",textAlign:"center",fontSize:15,fontWeight:700,color:T.text,fontFamily:T.font,outline:"none"}}/>
            <button onClick={()=>setQty(q=>Math.min(249,q+1))} style={{width:40,height:40,border:"none",background:T.white,cursor:"pointer",fontSize:16,color:T.text2,borderLeft:`1px solid ${T.border}`}}>+</button>
          </div>

          {/* Tier badge */}
          <div style={{marginTop:16,display:"inline-flex",alignItems:"center",gap:8,background:tierColor+"18",border:`1px solid ${tierColor}44`,borderRadius:20,padding:"5px 14px"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:tierColor}}/>
            <span style={{fontSize:12.5,fontWeight:600,color:tierColor}}>{tierName} tier — {qty>=100?"Custom pricing":"£"+getPrice(qty)+" per licence"}</span>
          </div>
        </div>

        {/* Right: total + CTA */}
        <div style={{textAlign:"center",minWidth:200}}>
          <div style={{fontSize:13,fontWeight:600,color:T.text3,marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Total Price</div>
          {total
            ? <div style={{fontSize:48,fontWeight:800,color:"#E11D48",lineHeight:1,marginBottom:6}}>£{total.toLocaleString()}</div>
            : <div style={{fontSize:24,fontWeight:800,color:"#E11D48",marginBottom:6}}>Contact Us</div>
          }
          {total&&<div style={{fontSize:12,color:T.text3,marginBottom:20}}>£{getPrice(qty)}/licence × {qty} licences / year</div>}
          {!total&&<div style={{fontSize:12,color:T.text3,marginBottom:20}}>Tailored pricing for 100+ seats</div>}
          <button
            onClick={()=>showToast(total?`🛒 ${qty} licences added to checkout!`:"📧 Contact request sent!")}
            style={{width:"100%",padding:"14px 0",borderRadius:12,border:"none",background:"linear-gradient(135deg,#E11D48,#BE185D)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:T.font,boxShadow:"0 4px 16px rgba(225,29,72,.35)"}}>
            {total?"Buy Now":"Get in Touch"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PageSubscription({ settings, setSettings, learners, setPage, showToast }) {
  const used=learners.filter(l=>l.status!=="Deactivated").length;
  const pct=Math.min(100, Math.round((used/settings.totalLicences)*100));
  return (
    <div style={{padding:"24px 28px"}}>

      {/* Current plan bar */}
      <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,padding:"20px 28px",marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:0,flexWrap:"wrap"}}>

          {/* Plan info */}
          <div style={{flex:"0 0 220px",paddingRight:24,borderRight:`1px solid ${T.border}`}}>
            <div style={{fontSize:12,color:T.text3,marginBottom:3,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em"}}>Current Plan</div>
            <div style={{fontSize:16,fontWeight:800,color:T.accent}}>{settings.plan}</div>
            <div style={{fontSize:12,color:T.text3,marginTop:2}}>Ends {new Date(settings.subExpiry).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
          </div>

          {/* Stats */}
          {[
            ["Total Licences", settings.totalLicences, T.text],
            ["Seats Used",     Math.min(used, settings.totalLicences), T.text],
            ["Seats Free",     Math.max(0, settings.totalLicences - used), Math.max(0, settings.totalLicences - used) === 0 ? T.redMid : T.greenMid],
          ].map(([l,v,c])=>(
            <div key={l} style={{flex:"0 0 120px",textAlign:"center",padding:"0 20px",borderRight:`1px solid ${T.border}`}}>
              <div style={{fontSize:24,fontWeight:800,color:c}}>{v}</div>
              <div style={{fontSize:11.5,color:T.text3,marginTop:2}}>{l}</div>
            </div>
          ))}

          {/* Progress bar */}
          <div style={{flex:1,padding:"0 24px",borderRight:`1px solid ${T.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:7}}>
              <span style={{color:T.text2,fontWeight:500}}>Licence usage</span>
              <span style={{fontWeight:700,color:pct>=100?T.redMid:pct>=80?T.amberMid:T.greenMid}}>{Math.min(pct,100)}%</span>
            </div>
            <div style={{height:8,background:T.bg,borderRadius:20,overflow:"hidden",position:"relative"}}>
              <div style={{height:"100%",width:Math.min(pct,100)+"%",background:pct>=100?"linear-gradient(90deg,#DC2626,#EF4444)":pct>=80?"linear-gradient(90deg,#D97706,#F59E0B)":"linear-gradient(90deg,#2A6FDB,#06B6D4)",borderRadius:20,transition:"width .4s"}}/>
            </div>
            <div style={{fontSize:11,color:T.text3,marginTop:5}}>{Math.min(used,settings.totalLicences)} of {settings.totalLicences} seats occupied</div>
          </div>

          {/* Status chip */}
          <div style={{padding:"0 0 0 24px"}}>
            {pct>=100
              ? <div style={{background:T.redBg,border:`1px solid #FECACA`,borderRadius:10,padding:"10px 16px",textAlign:"center"}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.redMid}}>🚫 No seats left</div>
                  <button onClick={()=>showToast("🛒 Buy more licences!")} style={{fontSize:11.5,color:T.redMid,background:"none",border:"none",cursor:"pointer",textDecoration:"underline",fontFamily:T.font,marginTop:3}}>Buy more licences</button>
                </div>
              : pct>=80
              ? <div style={{background:T.amberBg,border:`1px solid #FCD34D`,borderRadius:10,padding:"10px 16px",textAlign:"center"}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.amberMid}}>⚠️ Almost full</div>
                  <button onClick={()=>showToast("🛒 Buy more licences!")} style={{fontSize:11.5,color:T.amberMid,background:"none",border:"none",cursor:"pointer",textDecoration:"underline",fontFamily:T.font,marginTop:3}}>Add more seats</button>
                </div>
              : <div style={{background:T.greenBg,border:`1px solid #86EFAC`,borderRadius:10,padding:"10px 16px",textAlign:"center"}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.greenMid}}>✅ Expiring soon</div>
                  <button onClick={()=>showToast("🔄 Renewal initiated!")} style={{fontSize:11.5,color:T.greenMid,background:"none",border:"none",cursor:"pointer",textDecoration:"underline",fontFamily:T.font,marginTop:3}}>Renew plan</button>
                </div>
            }
          </div>

        </div>
      </div>

      {/* Pricing cards */}
      <div style={{marginBottom:8}}>
        <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:2}}>Licence Plans</div>
        <div style={{fontSize:13,color:T.text3,marginBottom:20}}>Volume discounts applied automatically. All prices per licence per year.</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:32}}>
          {TIERS.map(t=><PricingCard key={t.name} tier={t}/>)}
        </div>
      </div>

      {/* Interactive calculator */}
      <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:16}}>Calculate Your Price</div>
      <LicenceCalculator showToast={showToast}/>

    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function PageSettings({ settings, setSettings, showToast, resetOnboarding }) {
  const [newDept, setNewDept]=useState("");
  const save=(k,v)=>setSettings(s=>({...s,[k]:v}));

  return (
    <div style={{padding:"24px 28px",maxWidth:680}}>
      {[
        {title:"Appearance",content:(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Company Name" value={settings.companyName} onChange={e=>save("companyName",e.target.value)}/>
            <Input label="Platform Subdomain" defaultValue="codezen.caresk.com"/>
            <div style={{gridColumn:"1/-1",textAlign:"right"}}><Btn variant="primary" sm onClick={()=>showToast("✅ Appearance saved!")}>Save Changes</Btn></div>
          </div>
        )},
        {title:"Certificate Download Control",content:(
          <>
            <div style={{display:"flex",alignItems:"center",gap:12,background:settings.certDownloadControl==="yes"?T.greenBg:T.amberBg,border:`1px solid ${settings.certDownloadControl==="yes"?"#86EFAC":"#FCD34D"}`,borderRadius:10,padding:"12px 16px",marginBottom:12}}>
              <span style={{fontSize:20}}>{settings.certDownloadControl==="yes"?"🟢":"🔒"}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:settings.certDownloadControl==="yes"?T.green:T.amber}}>{settings.certDownloadControl==="yes"?"Learner self-download enabled":"Manager-only download"}</div>
                <div style={{fontSize:11.5,color:T.text3,marginTop:2}}>Set during initial setup · <strong style={{color:T.redMid}}>cannot be changed</strong></div>
              </div>
              <span style={{background:T.text,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>🔒 LOCKED</span>
            </div>
            {[["Email certificate on completion","autoEmailCert"]].map(([l,k])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
                <div>
                  <div style={{fontSize:13,fontWeight:500}}>{l}</div>
                  <div style={{fontSize:11.5,color:T.text3}}>Certificates are emailed automatically on completion</div>
                </div>
                <Toggle checked={settings[k]} onChange={v=>{save(k,v);showToast("✅ Saved!");}}/>
              </div>
            ))}
          </>
        )},
        {title:"Departments",content:(
          <>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <input value={newDept} onChange={e=>setNewDept(e.target.value)} placeholder="New department name" style={{flex:1,padding:"8px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:T.font,outline:"none"}}/>
              <Btn variant="primary" sm onClick={()=>{if(newDept.trim()){save("departments",[...settings.departments,newDept.trim()]);setNewDept("");showToast(`+ ${newDept} added`);}}}> + Add</Btn>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {settings.departments.map(d=>(
                <div key={d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:T.bg,borderRadius:8,padding:"10px 14px"}}>
                  <span style={{fontSize:13,fontWeight:500}}>{d}</span>
                  <div style={{display:"flex",gap:6}}>
                    <Btn variant="outline" sm onClick={()=>showToast("✏️ Edit "+d)}>Edit</Btn>
                    <Btn variant="red" sm onClick={()=>{save("departments",settings.departments.filter(x=>x!==d));showToast("🗑 "+d+" removed");}}>Remove</Btn>
                  </div>
                </div>
              ))}
            </div>
          </>
        )},
        {title:"⚙️ Setup & Reset",content:(
          <div>
            <div style={{background:T.redBg,border:`1px solid #FECACA`,borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontSize:13,fontWeight:700,color:T.redMid,marginBottom:4}}>Re-run Onboarding Wizard</div>
              <div style={{fontSize:12.5,color:T.text2,marginBottom:12,lineHeight:1.5}}>This will clear your setup preferences and show the first-run wizard again. Your learners and course data will be preserved.</div>
              <Btn variant="red" sm onClick={()=>{ resetOnboarding(); }}>🔄 Reset & Re-run Setup Wizard</Btn>
            </div>
          </div>
        )},
        {title:"Security",content:(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0"}}>
            <div>
              <div style={{fontSize:13,fontWeight:500}}>Multi-factor Authentication (MFA)</div>
              <div style={{fontSize:11.5,color:T.text3}}>Require a verification code on login (Non-SSO accounts)</div>
            </div>
            <Toggle checked={settings.mfaEnabled} onChange={v=>{save("mfaEnabled",v);showToast(v?"🔐 MFA enabled":"🔓 MFA disabled");}}/>
          </div>
        )},
        {title:"Integrations",content:(
          <>
            {[["Slack Integration","slackEnabled","Share course updates on Slack"],["Microsoft Teams","teamsEnabled","Integrate with MS Teams"],["GenAI Features","genAIEnabled","AI-powered recommendations"]].map(([l,k,d])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
                <div><div style={{fontSize:13,fontWeight:500}}>{l}</div><div style={{fontSize:11.5,color:T.text3}}>{d}</div></div>
                <Toggle checked={settings[k]} onChange={v=>{save(k,v);showToast(v?`✅ ${l} enabled!`:`⬛ ${l} disabled`);}}/>
              </div>
            ))}
          </>
        )},
      ].map(({title,content})=>(
        <div key={title} style={{marginBottom:24}}>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:12,paddingBottom:10,borderBottom:`1px solid ${T.border}`}}>{title}</div>
          {content}
        </div>
      ))}
    </div>
  );
}

// ─── BILLING PAGE ─────────────────────────────────────────────────────────────
function PageBilling({ showToast }) {
  const orders=[{id:"INV_2797456",date:"07/04/2026",amount:"£680.40",status:"Unpaid",name:"Lucy Dawson"},{id:"1-2663960",date:"14/11/2025",amount:"£24.00",status:"Paid",name:"Youth Link"}];
  return (
    <div style={{padding:"24px 28px",maxWidth:720}}>
      <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,padding:24,marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Order History</div>
        <div style={{fontSize:12.5,color:T.text3,marginBottom:16}}>For full history, contact <a href="mailto:accounts@highspeedtraining.co.uk" style={{color:T.accent}}>accounts@highspeedtraining.co.uk</a></div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Order Ref","Date","Amount","Status","Name","Actions"].map(h=><th key={h} style={{textAlign:"left",padding:"9px 12px",fontSize:11.5,color:T.text3,fontWeight:600,borderBottom:`1px solid ${T.border}`,background:T.bg}}>{h}</th>)}</tr></thead>
          <tbody>{orders.map(o=>(
            <tr key={o.id} onMouseEnter={e=>e.currentTarget.style.background=T.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"11px 12px",fontSize:12,fontFamily:"monospace"}}>{o.id}</td>
              <td style={{padding:"11px 12px",fontSize:12.5}}>{o.date}</td>
              <td style={{padding:"11px 12px",fontSize:13,fontWeight:600}}>{o.amount}</td>
              <td style={{padding:"11px 12px"}}><Pill label={o.status} type={o.status==="Paid"?"green":"red"}/></td>
              <td style={{padding:"11px 12px",fontSize:12.5}}>{o.name}</td>
              <td style={{padding:"11px 12px"}}><div style={{display:"flex",gap:6}}><Btn variant="ghost" sm onClick={()=>showToast("📄 Invoice")}>Invoice</Btn><Btn variant="ghost" sm onClick={()=>showToast("🧾 Receipt")}>Receipt</Btn></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div style={{background:T.redBg,border:`1px solid #FECACA`,borderRadius:14,padding:24}}>
        <div style={{fontSize:14,fontWeight:700,color:T.redMid,marginBottom:10}}>⚠️ Cancel Subscription</div>
        <p style={{fontSize:13,color:T.text2,marginBottom:14}}>If you cancel, your team keeps access until <strong>Dec 17, 2025</strong>. After that you'll lose course access, analytics, and progress tracking.</p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn variant="outline" onClick={()=>showToast("✅ Subscription kept!")}>Keep Subscription</Btn>
          <Btn variant="red" onClick={()=>showToast("⚠️ Cancellation confirmed")}>Confirm Cancellation</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── ONBOARDING WIZARD ────────────────────────────────────────────────────────
const STEPS = [
  { id:"name",    emoji:"👋", title:"Welcome to Care Skills Training", sub:"Let's get your account set up. It only takes 60 seconds." },
  { id:"org",     emoji:"🏢", title:"About your organisation",         sub:"This helps us personalise your dashboard." },
  { id:"cert",    emoji:"🏅", title:"Certificate download control",    sub:"" },
  { id:"done",    emoji:"🎉", title:"You're all set!",                  sub:"Your dashboard is ready. Let's go!" },
];

function OnboardingWizard({ onComplete }) {
  const [step, setStep]=useState(0);
  const [answers, setAnswers]=useState({ managerName:"", companyName:"", companySize:"", licences:5, certControl:"yes" });
  const [certHovered, setCertHovered]=useState(null);
  const set=(k,v)=>setAnswers(a=>({...a,[k]:v}));
  const next=()=>step<STEPS.length-1?setStep(s=>s+1):onComplete(answers);
  const canNext=()=>{
    if(step===0) return answers.managerName.trim().length>0;
    if(step===1) return answers.companyName.trim().length>0 && !!answers.companySize;
    return true;
  };

  const s=STEPS[step];
  const progress=Math.round((step/( STEPS.length-1))*100);

  return (
    <div style={{position:"fixed",inset:0,background:"linear-gradient(135deg,#0B1E3D 0%,#1E3F7A 100%)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,fontFamily:T.font}}>
      {/* Ambient blobs */}
      <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",background:"rgba(42,111,219,.15)",top:-80,right:-80,filter:"blur(60px)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",background:"rgba(42,111,219,.1)",bottom:-60,left:-60,filter:"blur(50px)",pointerEvents:"none"}}/>

      <div style={{width:"100%",maxWidth:520,background:T.white,borderRadius:24,boxShadow:"0 32px 80px rgba(0,0,0,.35)",overflow:"hidden",animation:"fadeUp .3s ease"}}>

        {/* Progress bar */}
        <div style={{height:4,background:T.bg}}>
          <div style={{height:"100%",width:progress+"%",background:T.accent,transition:"width .4s ease",borderRadius:4}}/>
        </div>

        {/* Header */}
        <div style={{background:`linear-gradient(135deg,${T.navy} 0%,${T.navy2} 100%)`,padding:"28px 32px 24px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:10,animation:"fadeUp .3s ease"}}>{s.emoji}</div>
          <div style={{fontSize:19,fontWeight:700,color:"#fff",marginBottom:6}}>{s.title}</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>{s.sub}</div>
          <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:18}}>
            {STEPS.map((_,i)=>(
              <div key={i} style={{width:i===step?22:8,height:8,borderRadius:4,background:i<=step?"#fff":"rgba(255,255,255,.25)",transition:"all .3s"}}/>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{padding:"28px 32px 24px"}}>

          {/* Step 0: What to call you */}
          {step===0&&(
            <div>
              <div style={{fontSize:13,fontWeight:600,color:T.text2,marginBottom:8}}>What should we call you?</div>
              <input autoFocus value={answers.managerName} onChange={e=>set("managerName",e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&canNext()&&next()}
                placeholder="e.g. Sarah, Dr. Ahmed, Manager…"
                style={{width:"100%",padding:"12px 16px",border:`2px solid ${T.border}`,borderRadius:10,fontSize:15,fontFamily:T.font,outline:"none",transition:"border .15s",boxSizing:"border-box"}}
                onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
              <div style={{fontSize:12,color:T.text3,marginTop:8}}>This is how your name will appear in the platform.</div>
            </div>
          )}

          {/* Step 1: Organisation name + company size (merged) */}
          {step===1&&(
            <div>
              <div style={{marginBottom:18}}>
                <div style={{fontSize:13,fontWeight:600,color:T.text2,marginBottom:8}}>Organisation name</div>
                <input autoFocus value={answers.companyName} onChange={e=>set("companyName",e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&answers.companyName.trim()&&document.getElementById("sizeSelect")?.focus()}
                  placeholder="e.g. Sunrise Care Ltd, CQC Services…"
                  style={{width:"100%",padding:"12px 16px",border:`2px solid ${T.border}`,borderRadius:10,fontSize:15,fontFamily:T.font,outline:"none",transition:"border .15s",boxSizing:"border-box"}}
                  onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
                <div style={{fontSize:12,color:T.text3,marginTop:6}}>Displayed throughout your dashboard.</div>
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:T.text2,marginBottom:8}}>What is your company size?</div>
                <select id="sizeSelect"
                  value={answers.companySize||""}
                  onChange={e=>{
                    const v=e.target.value;
                    const map={"1–10":10,"11–49":25,"50–99":60,"100–249":120,"250+":250};
                    set("companySize",v);
                    set("licences",map[v]||5);
                  }}
                  style={{width:"100%",padding:"12px 16px",border:`2px solid ${answers.companySize?T.accent:T.border}`,borderRadius:10,fontSize:14,fontFamily:T.font,outline:"none",background:T.white,color:answers.companySize?T.text:"#94A3B8",cursor:"pointer",appearance:"none",WebkitAppearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 20 20'%3E%3Cpath d='M5 8l5 5 5-5' stroke='%2394A3B8' stroke-width='1.6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center",paddingRight:40,transition:"border-color .15s",boxSizing:"border-box"}}>
                  <option value="" disabled>Select company size…</option>
                  {[["1–10","1–10 employees"],["11–49","11–49 employees"],["50–99","50–99 employees"],["100–249","100–249 employees"],["250+","250+ employees"]].map(([v,l])=>(
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
                {answers.companySize&&(
                  <div style={{marginTop:10,background:T.accentLight,border:`1px solid #B3D4F5`,borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:16}}>🪑</span>
                    <div style={{fontSize:12.5,fontWeight:600,color:T.accent2}}>Suggested: {answers.licences} seats — you can always buy more later.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Cert control */}
          {step===2&&(
            <div>
              <div style={{background:T.redBg,border:`1px solid #FECACA`,borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"flex-start",gap:10,marginBottom:20}}>
                <span style={{fontSize:16,flexShrink:0}}>⚠️</span>
                <div style={{fontSize:12.5,color:T.redMid,lineHeight:1.5}}>
                  <strong>This decision is permanent.</strong> Once you complete setup, this setting cannot be changed. Choose carefully.
                </div>
              </div>
              <div style={{fontSize:13,fontWeight:600,color:T.text2,marginBottom:14}}>Would you like trainees to be able to download their own certificate?</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {[
                  { val:"yes", icon:"🟢", label:"Yes — Allow trainees to download certificates (Default)", desc:"After completing a course, trainees can download their own certificate directly from their My Learning page." },
                  { val:"no",  icon:"🔒", label:"No — Only the manager will be able to download certificates", desc:"Only you (the manager) can download and distribute certificates. You will also receive relevant information by email. Trainees will see a 'Certificate pending' message." },
                ].map(opt=>{
                  const sel=answers.certControl===opt.val;
                  return (
                    <div key={opt.val} onClick={()=>set("certControl",opt.val)}
                      onMouseEnter={()=>setCertHovered(opt.val)} onMouseLeave={()=>setCertHovered(null)}
                      style={{padding:"16px 18px",borderRadius:12,border:`2px solid ${sel?T.accent:certHovered===opt.val?T.border2:T.border}`,background:sel?T.accentLight:T.white,cursor:"pointer",transition:"all .15s"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                        <span style={{fontSize:18,flexShrink:0}}>{opt.icon}</span>
                        <div style={{fontSize:13,fontWeight:700,color:sel?T.accent:T.text,lineHeight:1.4}}>{opt.label}</div>
                        {sel&&<span style={{marginLeft:"auto",flexShrink:0}}><Pill label="Selected" type="green"/></span>}
                      </div>
                      <div style={{fontSize:12.5,color:T.text3,lineHeight:1.55,paddingLeft:28}}>{opt.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Done */}
          {step===3&&(
            <div style={{padding:"8px 0 4px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
                {[
                  ["👤 Name",answers.managerName],
                  ["🏢 Organisation",answers.companyName],
                  ["👥 Team size",answers.companySize?(answers.companySize+" employees"):"—"],
                  ["🏅 Certificates",answers.certControl==="yes"?"Trainee self-download":"Manager only"],
                ].map(([l,v])=>(
                  <div key={l} style={{background:T.bg,borderRadius:10,padding:"12px 14px"}}>
                    <div style={{fontSize:11,color:T.text3,marginBottom:3}}>{l}</div>
                    <div style={{fontSize:13,fontWeight:600,color:T.text}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:13,color:T.text3,lineHeight:1.6,textAlign:"center"}}>Your dashboard is configured and ready. All settings have been saved — the certificate control is now <strong style={{color:T.redMid}}>locked</strong>.</div>
            </div>
          )}

          {/* Footer */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:24,paddingTop:20,borderTop:`1px solid ${T.border}`}}>
            <div style={{fontSize:12,color:T.text3}}>Step {step+1} of {STEPS.length}</div>
            <div style={{display:"flex",gap:10}}>
              {step>0&&step<STEPS.length-1&&(
                <Btn variant="outline" onClick={()=>setStep(s=>s-1)}>← Back</Btn>
              )}
              <Btn variant={step===STEPS.length-1?"accent":"primary"} onClick={next} style={{opacity:canNext()?1:.5,cursor:canNext()?"pointer":"not-allowed"}}>
                {step===STEPS.length-1?"Launch Dashboard →":"Continue →"}
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
// BUILD: v3 — storage keys reset, dropdown wizard step
export default function CSTApp() {
  const [ready, setReady]=useState(false);
  const [onboarded, setOnboarded]=useState(true); // assume done until storage says otherwise
  const [page, setPage]=useState("dashboard");
  const [learners, setLearners]=useState(SEED_LEARNERS);
  const [courses, setCourses]=useState(SEED_COURSES);
  const [certs, setCerts]=useState(SEED_CERTS);
  const [settings, setSettings]=useState(SEED_SETTINGS);
  const [toast, setToast]=useState(null);
  const [showInvite, setShowInvite]=useState(false);
  const [showAssign, setShowAssign]=useState(false);
  const [reportCourse, setReportCourse]=useState(null);
  const toastTimer=useRef(null);

  // Load from storage on mount
  useEffect(()=>{
    (async()=>{
      const [sl,sc,sct,ss,ob]=await Promise.all([
        load("cst3:learners",SEED_LEARNERS),
        load("cst3:courses",SEED_COURSES),
        load("cst3:certs",SEED_CERTS),
        load("cst3:settings",SEED_SETTINGS),
        load("cst3:onboarded",false),
      ]);
      setLearners(sl); setCourses(sc); setCerts(sct); setSettings(ss);
      setOnboarded(ob);
      setReady(true);
    })();
  },[]);

  // Persist on change
  useEffect(()=>{ if(ready) save("cst3:learners",learners); },[learners,ready]);
  useEffect(()=>{ if(ready) save("cst3:courses",courses); },[courses,ready]);
  useEffect(()=>{ if(ready) save("cst3:certs",certs); },[certs,ready]);
  useEffect(()=>{ if(ready) save("cst3:settings",settings); },[settings,ready]);

  const resetOnboarding = useCallback(async () => {
    await save("cst3:onboarded", false);
    await save("cst3:settings", SEED_SETTINGS);
    setSettings(SEED_SETTINGS);
    setOnboarded(false);
  }, []);

  const showToast=useCallback((msg,type="success")=>{
    setToast({msg,type});
    clearTimeout(toastTimer.current);
    toastTimer.current=setTimeout(()=>setToast(null),2800);
  },[]);

  // Called when wizard completes
  const handleOnboardingComplete=(answers)=>{
    const updated={
      ...settings,
      managerName: answers.managerName,
      companyName: answers.companyName,
      totalLicences: answers.licences,
      certDownloadControl: answers.certControl,
      certControlLocked: true,
    };
    setSettings(updated);
    save("cst3:settings",updated);
    save("cst3:onboarded",true);
    setOnboarded(true);
    showToast(`🎉 Welcome, ${answers.managerName}! Dashboard is ready.`);
  };

  if(!ready) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:T.font,background:T.bg}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:12}}>🏥</div>
        <div style={{fontSize:14,color:T.text3}}>Loading Care Skills Training…</div>
      </div>
    </div>
  );

  // Show wizard on first visit
  if(!onboarded) return <OnboardingWizard onComplete={handleOnboardingComplete}/>;

  const commonProps={learners,courses,certs,settings,setPage,showToast};

  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:T.font,background:T.bg,fontSize:14,color:T.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0;}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <Sidebar page={page} setPage={setPage} learnerCount={learners.filter(l=>l.status!=="Deactivated").length} settings={settings}/>

      <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:"100vh",overflowY:"auto"}}>
        <Topbar page={page} openInvite={()=>setShowInvite(true)} openAssign={()=>setShowAssign(true)}/>

        {page==="dashboard"&&<PageDashboard {...commonProps} openInvite={()=>setShowInvite(true)} openAssign={()=>setShowAssign(true)} setReportCourse={setReportCourse}/>}
        {page==="learners"&&<PageLearners {...commonProps} setLearners={setLearners} openInvite={()=>setShowInvite(true)}/>}
        {page==="invite"&&<div style={{padding:"24px 28px",maxWidth:600}}><div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,padding:24}}><div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Invite Learners</div><div style={{fontSize:13,color:T.text3,marginBottom:20}}>Click the button below to open the invite dialog.</div><Btn variant="primary" onClick={()=>setShowInvite(true)}>Open Invite Dialog</Btn></div></div>}
        {page==="courses"&&<PageCourses {...commonProps} openAssign={()=>setShowAssign(true)} setReportCourse={setReportCourse}/>}
        {page==="assigned"&&<PageAssigned {...commonProps} openAssign={()=>setShowAssign(true)}/>}
        {page==="certs"&&<PageCerts {...commonProps} setCerts={setCerts} setSettings={setSettings}/>}
        {page==="reports"&&<PageReports {...commonProps} initialCourseId={reportCourse} clearReportCourse={()=>setReportCourse(null)}/>}
        {page==="subscription"&&<PageSubscription {...commonProps} setSettings={setSettings}/>}
        {page==="settings"&&<PageSettings {...commonProps} setSettings={setSettings} resetOnboarding={resetOnboarding}/>}
        {page==="billing"&&<PageBilling showToast={showToast}/>}
      </div>

      <InviteModal open={showInvite} onClose={()=>setShowInvite(false)} learners={learners} setLearners={setLearners} settings={settings} showToast={showToast} setPage={setPage}/>
      <AssignModal open={showAssign} onClose={()=>setShowAssign(false)} courses={courses} setCourses={setCourses} learners={learners} setLearners={setLearners} settings={settings} showToast={showToast} setPage={setPage}/>

      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
}
