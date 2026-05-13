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

const LOGO_B64 = "data:image/png;base64,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";

// ─── SEED DATA ─────────────────────────────────────────────────────────────────
const SEED_LEARNERS = [
  { id:"L1", name:"Ayan Ahmed",  email:"ayan.ahmed@careplus.co.uk",  dept:"Care Workers",  location:"London",     initials:"AA", color:"#2A6FDB", status:"Active",      joined:"2025-03-12", progress:100, lastLogin:"2 days ago",  access:"Learner", enrolments:{"Care Certificate Standards 1-16":100,"Level 3 Safeguarding Adults Training":100,"Infection Prevention and Control Training":100} },
  { id:"L2", name:"Alex Rivera", email:"alex.rivera@careplus.co.uk", dept:"Admin Staff",   location:"Bristol",    initials:"AR", color:"#16A34A", status:"Active",      joined:"2025-03-15", progress:67,  lastLogin:"Today",        access:"Learner", enrolments:{"Infection Prevention and Control Training":67,"Emergency First Aid at Work":67} },
  { id:"L3", name:"Fabian Cole", email:"fabian.cole@careplus.co.uk", dept:"New Starters",  location:"Manchester", initials:"FC", color:"#DC2626", status:"Pending",     joined:"2025-04-01", progress:14,  lastLogin:"Never",        access:"Learner", enrolments:{"Care Certificate Standards 1-16":14} },
  { id:"L5", name:"Maya Patel",  email:"maya.patel@careplus.co.uk",  dept:"Care Workers",  location:"Birmingham", initials:"MP", color:"#0891B2", status:"Active",      joined:"2025-02-03", progress:80,  lastLogin:"Yesterday",    access:"Learner", enrolments:{"Care Certificate Standards 1-16":80,"Moving and Handling People":80,"Infection Prevention and Control Training":80} },
  { id:"L6", name:"Lena Brooks", email:"lena.brooks@careplus.co.uk", dept:"Senior Carers", location:"Leeds",      initials:"LB", color:"#BE185D", status:"Active",      joined:"2025-01-20", progress:55,  lastLogin:"3 days ago",   access:"Training Reporter", enrolments:{"Level 3 Safeguarding Adults Training":55,"Medication Administration Level 4":55} },
  { id:"L7", name:"Omar Hassan", email:"omar.hassan@careplus.co.uk", dept:"Admin Staff",   location:"London",     initials:"OH", color:"#059669", status:"Active",      joined:"2025-03-08", progress:30,  lastLogin:"1 week ago",   access:"Learner", enrolments:{"Infection Prevention and Control Training":30} },
  { id:"L8", name:"Sara Kim",    email:"sara.kim@careplus.co.uk",    dept:"Volunteers",    location:"Edinburgh",  initials:"SK", color:"#D97706", status:"Deactivated", joined:"2025-01-05", progress:45,  lastLogin:"2 months ago", access:"Learner", enrolments:{"Moving and Handling People":45} },
];

const SEED_COURSES = [
  { id:"C1", name:"Care Certificate Standards 1-16",          emoji:"📋", duration:"8 hrs",   enrolled:6, inProgress:2, completed:4, certs:4, dept:"Care Workers",  color:"#16A34A" },
  { id:"C2", name:"Level 3 Safeguarding Adults Training",     emoji:"🛡️", duration:"3–4 hrs", enrolled:4, inProgress:2, completed:2, certs:2, dept:"Senior Carers", color:"#2A6FDB" },
  { id:"C3", name:"Moving and Handling People",               emoji:"🏋️", duration:"2 hrs",   enrolled:5, inProgress:3, completed:1, certs:1, dept:"Care Workers",  color:"#DC2626" },
  { id:"C4", name:"Medication Administration Level 4",        emoji:"💊", duration:"2.5 hrs", enrolled:3, inProgress:1, completed:2, certs:2, dept:"Senior Carers", color:"#7C3AED" },
  { id:"C5", name:"Infection Prevention and Control Training",emoji:"🦠", duration:"1.5 hrs", enrolled:8, inProgress:0, completed:8, certs:8, dept:"All",           color:"#EA580C" },
  { id:"C6", name:"Emergency First Aid at Work",              emoji:"🩺", duration:"2 hrs",   enrolled:2, inProgress:0, completed:2, certs:2, dept:"All",           color:"#0891B2" },
];

const SEED_CERTS = [
  { id:"CT1", learnerId:"L1", learnerName:"Ayan Ahmed", courseId:"C2", courseName:"Level 3 Safeguarding Adults Training",     claimedOn:"2026-04-21", status:"Active",  type:"Assignment" },
  { id:"CT2", learnerId:"L1", learnerName:"Ayan Ahmed", courseId:"C5", courseName:"Infection Prevention and Control Training", claimedOn:"2026-03-15", status:"Active",  type:"Self-enrolment" },
  { id:"CT4", learnerId:"L8", learnerName:"Sara Kim",   courseId:"C3", courseName:"Moving and Handling People",               claimedOn:"2026-01-01", status:"Expired", type:"Assignment" },
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
function Btn({ children, onClick, variant="primary", sm, style={}, disabled=false }) {
  const base = {padding:sm?"6px 14px":"9px 18px",borderRadius:8,fontSize:sm?12:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",fontFamily:T.font,border:"none",transition:"background .15s, transform .1s",display:"inline-flex",alignItems:"center",gap:6,opacity:disabled?.45:1,...style};
  const vars = {
    primary:{background:T.navy,color:"#fff"},
    accent:{background:T.accent,color:"#fff"},
    outline:{background:"transparent",border:`1px solid ${T.border}`,color:T.text2},
    ghost:{background:"none",border:"none",color:T.accent,padding:0},
    red:{background:T.redMid,color:"#fff"},
  };
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled} style={{...base,...vars[variant]}}
      onMouseEnter={e=>{if(!disabled){e.currentTarget.style.opacity=".85";e.currentTarget.style.transform="translateY(-1px)"}}}
      onMouseLeave={e=>{if(!disabled){e.currentTarget.style.opacity="1";e.currentTarget.style.transform="none"}}}>
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
  {id:"pricing",label:"Pricing",icon:"credit"},
  {id:"settings",  label:"Settings",     icon:"settings"},
];

function Sidebar({ page, setPage, learnerCount, settings, open, onClose }) {
  const [hovNav,setHovNav]=useState(null);
  return (
    <>
      {open && <div className={`cst-overlay${open?" open":""}`} onClick={onClose}/>}
    <aside className={`cst-sidebar${open?" open":""}`} style={{background:T.navy,display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0}}>
      <div style={{padding:"14px 16px",background:T.navy,borderBottom:`1px solid rgba(255,255,255,.08)`}}>
        <img src="data:image/png;base64,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"
          alt="Care Skills Training"
          style={{height:36,width:"auto",maxWidth:140,display:"block",margin:"0 auto 6px"}}/>
        <div style={{fontSize:9.5,color:"rgba(255,255,255,.45)",letterSpacing:".08em",textTransform:"uppercase",textAlign:"center"}}>Learning Management Suite</div>
      </div>
      <nav style={{flex:1,padding:"8px 0",overflowY:"auto"}}>
        {NAV.map(n=>{
          const isActive=page===n.id;
          const isHov=hovNav===n.id&&!isActive;
          return(
            <div key={n.id} onClick={()=>setPage(n.id)}
              onMouseEnter={()=>setHovNav(n.id)} onMouseLeave={()=>setHovNav(null)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 18px",cursor:"pointer",fontSize:12.5,
                color:isActive?"#fff":isHov?"rgba(255,255,255,.9)":"rgba(255,255,255,.55)",
                background:isActive?"rgba(42,111,219,.2)":isHov?"rgba(255,255,255,.07)":"transparent",
                borderLeft:`2px solid ${isActive?T.accent:"transparent"}`,
                transition:"background .15s, color .15s",fontWeight:isActive?600:400}}>
              <Icon d={ICONS[n.icon]} size={15} color={isActive?"#fff":isHov?"rgba(255,255,255,.9)":"rgba(255,255,255,.55)"}/>
              <span style={{flex:1}}>{n.label}</span>
              {n.badge && <span style={{background:T.accent,color:"#fff",fontSize:10,padding:"1px 6px",borderRadius:20,fontWeight:600}}>{learnerCount}</span>}
            </div>
          );
        })}
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
    </>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
const PAGE_TITLES = {dashboard:"Dashboard",learners:"Manage Learners",invite:"Invite Learners",courses:"Available Courses",assigned:"Assigned Courses",certs:"Certificates",reports:"Reports",pricing:"Pricing",settings:"Settings"};

function Topbar({ page, openInvite, openAssign, onMenuClick }) {
  return (
    <div style={{height:56,background:T.white,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",position:"sticky",top:0,zIndex:50}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button className="cst-hamburger" onClick={onMenuClick} aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke={T.navy} strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
        <span style={{fontSize:12,color:T.text3}}>Overview /</span>
        <span style={{fontSize:15,fontWeight:600,color:T.text,marginLeft:4}}>{PAGE_TITLES[page]}</span>
      </div>
      <div className="cst-topbar-actions" style={{display:"flex",gap:10}}>
        <Btn variant="outline" sm onClick={openInvite}><span className="cst-btn-label">+ Add Learner</span></Btn>
        {page!=="learners"&&<Btn variant="primary" sm onClick={openAssign}><span className="cst-btn-label">Assign Course</span></Btn>}
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
    <div className="cst-grid-2" style={{marginBottom:20}}>
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
            <span>All licences are used up. To add more learners, <strong style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>setPage("pricing")}>buy more licences</strong>.</span>
          </div>
        )}

        <div style={{display:"flex",gap:8,paddingTop:14,borderTop:`1px solid ${T.border}`}}>
          <Btn variant="outline" sm onClick={()=>setPage("learners")} style={{flex:1,justifyContent:"center"}}>View learners</Btn>
          <Btn variant={exhausted?"outline":"primary"} sm onClick={openInvite} style={{flex:1,justifyContent:"center",opacity:exhausted?.5:1,cursor:exhausted?"not-allowed":"pointer"}}>+ Invite</Btn>
        </div>
      </div>

      {/* Subscription card */}
      <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,padding:"18px 20px"}}>
        <div style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:".07em",marginBottom:12}}>Pricing</div>

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
          <Btn variant="outline" sm onClick={()=>setPage("pricing")} style={{flex:1,justifyContent:"center"}}>Manage plan</Btn>
          <Btn variant="primary" sm onClick={()=>setPage("pricing")} style={{flex:1,justifyContent:"center"}}>Buy licences</Btn>
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
      <div className="cst-grid-4" style={{marginBottom:20,alignItems:"stretch"}}>
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


      <div className="cst-alerts-sub" style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:16,marginBottom:20}}>
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
          <div style={{fontSize:13.5,fontWeight:700,color:T.text}}>Pricing</div>
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
            <Btn variant="outline" sm onClick={()=>setPage("pricing")} style={{flex:1,justifyContent:"center"}}>Manage plan</Btn>
            <Btn variant="primary" sm onClick={()=>setPage("pricing")} style={{flex:1,justifyContent:"center"}}>Buy licences</Btn>
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
      <div className="cst-grid-3" style={{gap:14}}>
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
const ACCESS_TYPES=["Learner","Training Reporter","Training Coordinator","Training Administrator","Training Service Owner"];

function LearnerProfileModal({user,courses,onSave,onClose,showToast}){
  const [email,setEmail]=useState(user.email);
  const [name,setName]=useState(user.name);
  const [dept,setDept]=useState(user.dept||"");
  const [location,setLocation]=useState(user.location||"");
  const [access,setAccess]=useState(user.access||"Learner");
  const [enrolments,setEnrolments]=useState(user.enrolments||{});

  const toggleCourse=(cname)=>{
    setEnrolments(prev=>{
      const next={...prev};
      if(next[cname]!==undefined){delete next[cname];}
      else{next[cname]=user.enrolments?.[cname]??0;}
      return next;
    });
  };

  const handleSave=()=>{
    if(!email.trim()||!name.trim()){showToast("Email and name required.","error");return;}
    onSave({...user,email:email.trim(),name:name.trim(),dept:dept.trim(),location:location.trim(),access,enrolments,events:[...(user.events||[]),"Profile updated"]});
    showToast("✅ Profile saved.");
    onClose();
  };

  const handleArchive=()=>{
    const nextStatus=user.status==="Deactivated"?"Active":"Deactivated";
    const label=nextStatus==="Deactivated"?"Archived":"Unarchived";
    onSave({...user,status:nextStatus,events:[...(user.events||[]),label]});
    showToast(`${label}.`);
    onClose();
  };

  return(
    <Modal open onClose={onClose} title={`Profile — ${user.name}`}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <Input label="Full name" value={name} onChange={e=>setName(e.target.value)}/>
        <Input label="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <Input label="Department" value={dept} onChange={e=>setDept(e.target.value)}/>
        <Input label="Location" value={location} onChange={e=>setLocation(e.target.value)}/>
        <div style={{gridColumn:"1/-1"}}>
          <div style={{fontSize:12,fontWeight:600,color:T.text2,marginBottom:5}}>Access type</div>
          <select value={access} onChange={e=>setAccess(e.target.value)} style={{width:"100%",padding:"8px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:T.font,color:T.text}}>
            {ACCESS_TYPES.map(a=><option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div style={{marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:600,color:T.text2,marginBottom:8}}>Course enrolments</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {courses.map(c=>{
            const enrolled=enrolments[c.name]!==undefined;
            const pct=enrolled?enrolments[c.name]:0;
            return(
              <label key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",border:`1px solid ${enrolled?T.accent:T.border}`,borderRadius:8,cursor:"pointer",background:enrolled?T.accentLight:"transparent",transition:"all .15s"}}>
                <input type="checkbox" checked={enrolled} onChange={()=>toggleCourse(c.name)} style={{accentColor:T.accent}}/>
                <span style={{flex:1,fontSize:13,color:T.text}}>{c.emoji} {c.name}</span>
                {enrolled&&<span style={{fontSize:11,color:T.accent,fontWeight:600}}>{pct}% complete</span>}
              </label>
            );
          })}
        </div>
      </div>

      {user.events?.length>0&&(
        <div style={{marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:600,color:T.text2,marginBottom:6}}>Activity</div>
          <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:100,overflowY:"auto"}}>
            {user.events.map((ev,i)=><div key={i} style={{fontSize:11.5,color:T.text3,padding:"4px 0",borderBottom:`1px solid ${T.border}`}}>{ev}</div>)}
          </div>
        </div>
      )}

      <div style={{display:"flex",justifyContent:"space-between",paddingTop:16,borderTop:`1px solid ${T.border}`}}>
        <Btn variant="outline" onClick={handleArchive} style={{color:T.red,borderColor:T.red}}>
          {user.status==="Deactivated"?"Unarchive":"Archive user"}
        </Btn>
        <div style={{display:"flex",gap:8}}>
          <Btn variant="outline" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={handleSave}>Save changes</Btn>
        </div>
      </div>
    </Modal>
  );
}

function AddUsersModal({onClose,learners,setLearners,showToast,settings,setPage}){
  const [tab,setTab]=useState("bulk");
  const [hovTab,setHovTab]=useState(null);
  // bulk by email
  const [bulkEmails,setBulkEmails]=useState(["","",""]);
  const [bulkStep,setBulkStep]=useState(1);
  const [bulkMsg,setBulkMsg]=useState(`Good news! ${settings?.companyName||"Your organisation"} has invited you to the Care Skills Training platform.`);
  // single learner
  const [sFirst,setSFirst]=useState("");
  const [sLast,setSLast]=useState("");
  const [sEmail,setSEmail]=useState("");
  const [sDept,setSDept]=useState(settings?.departments?.[0]||"");
  // import csv
  const [csvMode,setCsvMode]=useState("text");
  const [textVal,setTextVal]=useState("");
  const [csvText,setCsvText]=useState("");
  const [fileName,setFileName]=useState("No file selected");
  const [parsedRows,setParsedRows]=useState([]);
  const [showMapping,setShowMapping]=useState(false);
  const [mapping]=useState(["email","name","dept","location"]);
  const [sendWelcome,setSendWelcome]=useState(true);

  const activeLearners=learners.filter(l=>l.status!=="Deactivated").length;
  const licenceExhausted=settings&&(activeLearners>=settings.totalLicences);
  const COLORS=["#2A6FDB","#16A34A","#DC2626","#7C3AED","#0891B2","#BE185D","#059669"];
  const FIELD_OPTS=["email","name","dept","location","skip"];
  const parseRows=(src)=>src.split(/\r?\n/).map(l=>l.trim()).filter(Boolean).map(l=>l.split(",").map(c=>c.trim().replace(/^"|"$/g,"")));

  const makeUser=(rec,prev)=>{
    const nm=(rec.name||rec.email).trim();
    const parts=nm.split(" ");
    const init=(parts[0]?.[0]+(parts[1]?.[0]||"")).toUpperCase();
    return{id:"L"+Date.now()+Math.random(),name:nm,email:rec.email,dept:rec.dept||"Unassigned",location:rec.location||"",initials:init,color:COLORS[prev.length%COLORS.length],status:"Active",joined:new Date().toISOString().split("T")[0],progress:0,access:"Learner",enrolments:{},events:[sendWelcome?"Welcome email queued":"Imported"]};
  };

  const handleFile=(e)=>{
    const f=e.target.files[0];if(!f)return;
    setFileName(f.name);
    new FileReader().onload=ev=>{setCsvText(ev.target.result);setShowMapping(false);};
    const r=new FileReader();r.onload=ev=>{setCsvText(ev.target.result);setShowMapping(false);};r.readAsText(f);
  };

  const handleImport=()=>{
    const src=csvMode==="text"?textVal:csvText;
    const rows=parseRows(src);
    if(!rows.length){showToast("Add at least one row.","error");return;}
    if(!showMapping){setParsedRows(rows);setShowMapping(true);showToast("Check column mapping, then start upload again.");return;}
    const cols=[...document.querySelectorAll("[data-map-sel]")].map(s=>s.value);
    const fm=cols.length?cols:mapping;
    let added=0,updated=0;
    setLearners(prev=>{
      const next=[...prev];
      for(const row of parsedRows){
        const rec={};fm.forEach((f,i)=>{if(f!=="skip")rec[f]=row[i]||"";});
        if(!rec.email)continue;
        const ex=next.find(u=>u.email.toLowerCase()===rec.email.toLowerCase());
        if(ex){Object.assign(ex,{name:rec.name||ex.name,dept:rec.dept||ex.dept,location:rec.location||ex.location,events:[...(ex.events||[]),"Updated by import"]});updated++;}
        else{next.push(makeUser(rec,next));added++;}
      }
      return next;
    });
    showToast(`${added} added, ${updated} updated.`);onClose();
  };

  const handleSingle=()=>{
    if(!sEmail){showToast("Email required.","error");return;}
    const nm=`${sFirst} ${sLast}`.trim()||sEmail;
    const parts=nm.split(" ");
    const init=(parts[0]?.[0]+(parts[1]?.[0]||"")).toUpperCase();
    setLearners(prev=>[...prev,{id:"L"+Date.now(),name:nm,email:sEmail,dept:sDept||"Unassigned",initials:init,color:COLORS[prev.length%COLORS.length],status:"Pending",joined:new Date().toISOString().split("T")[0],progress:0,access:"Learner",enrolments:{},events:["Added individually"]}]);
    showToast(`✅ ${nm} added.`);onClose();
  };

  const handleBulkNext=()=>{
    const valid=bulkEmails.filter(e=>e.trim());
    if(!valid.length){showToast("Enter at least one email.","error");return;}
    setBulkStep(2);
  };

  const handleBulkSend=()=>{
    const valid=bulkEmails.filter(e=>e.trim());
    showToast(`✉️ ${valid.length} invitation${valid.length>1?"s":""} sent!`);onClose();
  };

  const TABS=[["bulk","Bulk by Email"],["single","Single Learner"],["csv","Import CSV"]];

  const Panel=({children})=>(
    <div style={{padding:"0 28px 24px"}}>{children}</div>
  );

  const Footer=({left,right})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:16,borderTop:`1px solid ${T.border}`,marginTop:8}}>
      {left}<div style={{display:"flex",gap:8}}>{right}</div>
    </div>
  );

  return(
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(11,30,61,.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:T.white,borderRadius:18,width:"100%",maxWidth:540,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.2)",animation:"fadeUp .2s ease"}}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:"24px 28px 16px"}}>
          <div>
            <p style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".09em",color:T.accent,marginBottom:6}}>Add/update users</p>
            <h2 style={{fontSize:20,fontWeight:700,color:T.text,margin:0}}>Import learners</h2>
          </div>
          <button onClick={onClose} style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,cursor:"pointer",padding:"5px 10px",fontSize:14,color:T.text3,lineHeight:1,marginTop:2}}>✕</button>
        </div>

        {/* Licence banner */}
        {settings&&<div style={{padding:"0 28px 12px"}}>
          <LicenceBanner activeLearners={activeLearners} settings={settings} onUpgrade={()=>{onClose();setPage("pricing");}}/>
        </div>}

        {/* Tabs */}
        <div style={{padding:"0 28px 16px"}}>
          <div style={{display:"flex",gap:0,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden",width:"fit-content"}}>
            {TABS.map(([v,l],i)=>{
              const isAct=tab===v;
              const isHov=hovTab===v;
              return(
                <button key={v} onClick={()=>{setTab(v);setShowMapping(false);setBulkStep(1);}}
                  onMouseEnter={()=>setHovTab(v)} onMouseLeave={()=>setHovTab(null)}
                  style={{padding:"8px 18px",fontSize:13,fontWeight:isAct?700:500,cursor:"pointer",
                    border:"none",borderRight:i<TABS.length-1?`1px solid ${T.border}`:"none",
                    background:isAct?T.navy:isHov?T.bg:T.white,
                    color:isAct?"#fff":isHov?T.text:T.text2,
                    fontFamily:T.font,transition:"background .15s,color .15s",whiteSpace:"nowrap"}}>
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Bulk by Email ── */}
        {tab==="bulk"&&bulkStep===1&&<Panel>
          <p style={{fontSize:13,color:T.text3,marginBottom:14}}>Enter emails to invite multiple learners at once:</p>
          {bulkEmails.map((e,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
              <Av initials={String(i+1)} color={T.navy} size={28}/>
              <input value={e} onChange={ev=>{const a=[...bulkEmails];a[i]=ev.target.value;setBulkEmails(a);}}
                placeholder="Type user email" disabled={licenceExhausted}
                style={{flex:1,padding:"8px 12px",border:`1px solid ${licenceExhausted?T.redMid:T.border}`,borderRadius:8,fontSize:13,fontFamily:T.font,outline:"none",background:licenceExhausted?"#FFF5F5":T.white}}/>
            </div>
          ))}
          <Btn variant="ghost" sm onClick={()=>setBulkEmails([...bulkEmails,""])} style={{marginTop:4,marginBottom:20,opacity:licenceExhausted?.4:1}}>+ Add more</Btn>
          <Footer left={<Btn variant="outline" onClick={onClose}>Cancel</Btn>} right={[
            <Btn key="next" variant="primary" onClick={handleBulkNext} style={{opacity:licenceExhausted?.5:1}}>Next →</Btn>
          ]}/>
        </Panel>}

        {tab==="bulk"&&bulkStep===2&&<Panel>
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            <div style={{flex:1,height:4,borderRadius:4,background:T.accent}}/>
            <div style={{flex:1,height:4,borderRadius:4,background:T.accent}}/>
          </div>
          <div style={{fontSize:12,color:T.text3,marginBottom:16}}>Step 2 of 2 — Customise the invitation message</div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:600,color:T.text2,marginBottom:5}}>Custom message</div>
            <textarea value={bulkMsg} onChange={e=>setBulkMsg(e.target.value)} rows={3}
              style={{width:"100%",padding:"9px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:T.font,resize:"vertical",boxSizing:"border-box",outline:"none"}}/>
          </div>
          <Footer left={<Btn variant="outline" onClick={()=>setBulkStep(1)}>← Back</Btn>} right={[
            <Btn key="send" variant="primary" onClick={handleBulkSend}>Send Invitations</Btn>
          ]}/>
        </Panel>}

        {/* ── Single Learner ── */}
        {tab==="single"&&<Panel>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,opacity:licenceExhausted?.5:1,pointerEvents:licenceExhausted?"none":"auto"}}>
            <Input label="First name" value={sFirst} onChange={e=>setSFirst(e.target.value)} placeholder="First name"/>
            <Input label="Last name" value={sLast} onChange={e=>setSLast(e.target.value)} placeholder="Last name"/>
          </div>
          <div style={{opacity:licenceExhausted?.5:1,pointerEvents:licenceExhausted?"none":"auto"}}>
            <Input label="Email address" type="email" value={sEmail} onChange={e=>setSEmail(e.target.value)} placeholder="email@company.com"/>
            <Select label="Department" value={sDept} onChange={e=>setSDept(e.target.value)}>
              {(settings?.departments||[]).map(d=><option key={d}>{d}</option>)}
            </Select>
          </div>
          <Footer left={<Btn variant="outline" onClick={onClose}>Cancel</Btn>} right={[
            <Btn key="add" variant="primary" onClick={handleSingle} style={{opacity:licenceExhausted?.5:1}}>Invite & Add</Btn>
          ]}/>
        </Panel>}

        {/* ── Import CSV ── */}
        {tab==="csv"&&<Panel>
          {/* sub-toggle */}
          <div style={{display:"flex",gap:2,background:T.bg,borderRadius:10,padding:3,width:"fit-content",marginBottom:16}}>
            {[["text","Text entry"],["sheet","Spreadsheet"]].map(([v,l])=>(
              <button key={v} onClick={()=>{setCsvMode(v);setShowMapping(false);}}
                style={{padding:"6px 16px",borderRadius:8,fontSize:12.5,fontWeight:500,cursor:"pointer",border:"none",background:csvMode===v?T.white:"transparent",color:csvMode===v?T.text:T.text3,fontFamily:T.font,boxShadow:csvMode===v?"0 1px 4px rgba(0,0,0,.08)":"none"}}>
                {l}
              </button>
            ))}
          </div>

          {csvMode==="text"&&(
            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:600,color:T.text2,marginBottom:6}}>Enter one user per row</div>
              <textarea value={textVal} onChange={e=>{setTextVal(e.target.value);setShowMapping(false);}} rows={6}
                style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:12.5,fontFamily:"monospace",resize:"vertical",outline:"none"}}/>
              <div style={{fontSize:12,color:T.text3,marginTop:5}}>Format: email, name, department, location</div>
            </div>
          )}

          {csvMode==="sheet"&&(
            <div style={{marginBottom:12}}>
              <label htmlFor="csvFileInput" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"24px 20px",border:`2px dashed ${T.border}`,borderRadius:10,background:T.bg,cursor:"pointer",marginBottom:10,textAlign:"center"}}>
                <div style={{fontSize:13,fontWeight:700,color:T.text}}>Select CSV file</div>
                <div style={{fontSize:12,color:T.text3}}>{fileName}</div>
                <input id="csvFileInput" type="file" accept=".csv,text/csv" style={{fontSize:13}} onChange={handleFile}/>
              </label>
              <textarea value={csvText} onChange={e=>{setCsvText(e.target.value);setShowMapping(false);}} rows={4}
                placeholder="Or paste CSV content here"
                style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:12.5,fontFamily:"monospace",resize:"vertical",outline:"none"}}/>
            </div>
          )}

          {showMapping&&parsedRows[0]?.length>0&&(
            <div style={{marginBottom:14,padding:"12px",background:T.bg,borderRadius:8,border:`1px solid ${T.border}`}}>
              <div style={{fontSize:12,fontWeight:700,color:T.text2,marginBottom:8}}>Map columns</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {parsedRows[0].map((cell,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{fontSize:12,color:T.text,background:T.white,border:`1px solid ${T.border}`,borderRadius:6,padding:"4px 10px",minWidth:140,fontFamily:"monospace"}}>{cell||`Column ${i+1}`}</div>
                    <select data-map-sel defaultValue={mapping[i]||"skip"} style={{padding:"4px 8px",border:`1px solid ${T.border}`,borderRadius:6,fontSize:12,fontFamily:T.font}}>
                      {FIELD_OPTS.map(f=><option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          <label style={{display:"flex",alignItems:"center",gap:8,marginBottom:18,cursor:"pointer",fontSize:13,color:T.text2}}>
            <input type="checkbox" checked={sendWelcome} onChange={e=>setSendWelcome(e.target.checked)} style={{accentColor:T.accent,width:15,height:15}}/>
            Send users a training suite welcome email
          </label>

          <Footer left={<Btn variant="outline" onClick={onClose}>Cancel</Btn>} right={[
            <Btn key="up" variant="primary" onClick={handleImport}>Start upload</Btn>
          ]}/>
        </Panel>}

      </div>
    </div>
  );
}

function HdrActions({ openAssign, openImport }) {
  const [hov,setHov]=useState(null);
  const btns=[["import","Add / update users",openImport],["assign","Assign Course",openAssign]];
  return(
    <div style={{display:"flex",gap:2,background:T.bg,borderRadius:10,padding:3,flexShrink:0}}>
      {btns.map(([key,label,action])=>{
        const isHov=hov===key;
        return(
          <button key={key} onClick={action}
            onMouseEnter={()=>setHov(key)} onMouseLeave={()=>setHov(null)}
            style={{padding:"7px 18px",borderRadius:8,fontSize:12.5,fontWeight:500,cursor:"pointer",border:"none",
              background:T.white,
              color:isHov?T.text:T.text2,
              boxShadow:isHov?"0 2px 8px rgba(0,0,0,.13)":"0 1px 3px rgba(0,0,0,.08)",
              fontFamily:T.font,transition:"color .15s ease, box-shadow .15s ease",whiteSpace:"nowrap"}}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

function PageLearners({ learners, setLearners, courses, settings, showToast, openInvite, openAssign, setPage }) {
  const [tab,setTab]=useState("active");
  const [hovTab,setHovTab]=useState(null);
  const [q,setQ]=useState("");
  const [courseFilter,setCourseFilter]=useState("all");
  const [profileUser,setProfileUser]=useState(null);
  const [showImport,setShowImport]=useState(false);

  const activeCount=learners.filter(l=>l.status==="Active").length;
  const pendingCount=learners.filter(l=>l.status==="Pending").length;
  const archivedCount=learners.filter(l=>l.status==="Deactivated").length;
  const completionRate=activeCount?Math.round(learners.filter(l=>l.status==="Active").reduce((s,l)=>s+(l.progress||0),0)/activeCount):0;

  const statusForTab=(t)=>t==="active"?"Active":t==="pending"?"Pending":"Deactivated";
  const filtered=learners.filter(l=>{
    const statusMatch=l.status===statusForTab(tab);
    const qLow=q.toLowerCase();
    const queryMatch=!q||[l.name,l.email,l.dept||"",l.location||""].some(v=>v.toLowerCase().includes(qLow));
    const courseMatch=courseFilter==="all"||(l.enrolments&&l.enrolments[courseFilter]!==undefined);
    return statusMatch&&queryMatch&&courseMatch;
  });

  const handleSaveProfile=(updated)=>{
    setLearners(prev=>prev.map(l=>l.id===updated.id?updated:l));
  };

  const handleApprove=(id)=>{
    setLearners(prev=>prev.map(l=>l.id===id?{...l,status:"Active",events:[...(l.events||[]),"Approved by administrator"]}:l));
    showToast("✅ Learner approved.");
  };

  const handleExportCSV=()=>{
    const rows=[["Name","Email","Department","Location","Access","Status","Progress","Last Login"]];
    learners.forEach(l=>rows.push([l.name,l.email,l.dept||"",l.location||"",l.access||"Learner",l.status,`${l.progress||0}%`,l.lastLogin||"Never"]));
    const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="learners.csv";a.click();
    showToast("CSV exported.");
  };

  const TABS=[["active","Active",activeCount],["pending","Pending",pendingCount],["archived","Archived",archivedCount]];

  return(
    <div style={{padding:"28px 32px"}}>

      {/* Page header */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28,gap:16}}>
        <div>
          <p style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".09em",color:T.text3,marginBottom:0}}>User management</p>
        </div>
        <HdrActions openAssign={openAssign} openImport={()=>setShowImport(true)}/>
      </div>

      {/* Metric cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        {[["Active users",activeCount,T.accent],["Pending approval",pendingCount,T.amberMid],["Archived",archivedCount,T.text3],["Completion rate",`${completionRate}%`,T.greenMid]].map(([label,val,color])=>(
          <div key={label} style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,padding:"18px 20px"}}>
            <div style={{fontSize:12,color:T.text3,marginBottom:8}}>{label}</div>
            <div style={{fontSize:28,fontWeight:700,color,lineHeight:1}}>{val}</div>
          </div>
        ))}
      </div>

      {/* Workspace */}
      <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>

        {/* Toolbar */}
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",flexWrap:"wrap",gap:"12px 20px",alignItems:"flex-end"}}>
          {/* Status tabs */}
          <div style={{display:"flex",gap:2,background:T.bg,borderRadius:10,padding:3}}>
            {TABS.map(([v,l,count])=>{
              const isActive=tab===v;
              const isHov=hovTab===v;
              const otherHov=hovTab&&hovTab!==v;
              const color=isActive?(otherHov?T.text3:T.text):isHov?T.text:T.text3;
              const bg=isActive&&!otherHov?T.white:isHov?"rgba(255,255,255,0.6)":"transparent";
              return(
                <button key={v} onClick={()=>setTab(v)} onMouseEnter={()=>setHovTab(isActive?null:v)} onMouseLeave={()=>setHovTab(null)}
                  style={{padding:"7px 18px",borderRadius:8,fontSize:12.5,fontWeight:500,cursor:"pointer",border:"none",background:bg,color,boxShadow:isActive&&!otherHov?"0 1px 4px rgba(0,0,0,.1)":"none",fontFamily:T.font,transition:"color .2s ease, background .2s ease",whiteSpace:"nowrap"}}>
                  {l} <span style={{opacity:.7}}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* Labeled search — flex-grow, right side */}
          <label style={{display:"flex",flexDirection:"column",gap:4,flex:1,minWidth:220}}>
            <span style={{fontSize:11,fontWeight:600,color:T.text3,lineHeight:1}}>Search</span>
            <div style={{display:"flex",alignItems:"center",gap:8,background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 12px"}}>
              <Icon d={ICONS.search} size={14} color={T.text3}/>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Name, email, department, location" style={{border:"none",background:"transparent",outline:"none",fontSize:13,color:T.text,fontFamily:T.font,flex:1,minWidth:0}}/>
            </div>
          </label>

          {/* Course filter + Export CSV — own row */}
          <div style={{flexBasis:"100%",display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
            <select value={courseFilter} onChange={e=>setCourseFilter(e.target.value)}
              style={{flex:1,minWidth:160,padding:"8px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:T.font,background:T.white,color:T.text,cursor:"pointer"}}>
              <option value="all">All courses</option>
              {courses.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <Btn variant="outline" onClick={handleExportCSV}>Export CSV</Btn>
          </div>
        </div>

        {/* Table */}
        <div className="cst-table-scroll">
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
            <thead>
              <tr>{["Name","Profile","Segment","Courses","Progress","Last login","Actions"].map(h=>(
                <th key={h} style={{textAlign:h==="Actions"?"center":"left",padding:"11px 18px",fontSize:11.5,color:T.text3,fontWeight:600,borderBottom:`1px solid ${T.border}`,background:T.bg,whiteSpace:"nowrap"}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(l=>{
                const courseCount=Object.keys(l.enrolments||{}).length;
                return(
                  <tr key={l.id} onMouseEnter={e=>e.currentTarget.style.background=T.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"13px 18px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:11}}>
                        <Av initials={l.initials} color={l.color}/>
                        <div>
                          <div style={{fontSize:13,fontWeight:600,color:T.text}}>{l.name}</div>
                          <div style={{fontSize:11.5,color:T.text3,marginTop:1}}>{l.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{padding:"13px 18px"}}>
                      <span style={{fontSize:11.5,fontWeight:600,padding:"3px 9px",borderRadius:20,background:l.access&&l.access!=="Learner"?T.accentLight:T.bg,color:l.access&&l.access!=="Learner"?T.accent:T.text3}}>{l.access||"Learner"}</span>
                    </td>
                    <td style={{padding:"13px 18px"}}>
                      <div style={{fontSize:12.5,fontWeight:500,color:T.text2}}>{l.dept||"—"}</div>
                      <div style={{fontSize:11.5,color:T.text3,marginTop:2}}>{l.location||"—"}</div>
                    </td>
                    <td style={{padding:"13px 18px",fontSize:13,color:T.text2}}>{courseCount>0?`${courseCount} enrolled`:"—"}</td>
                    <td style={{padding:"13px 18px",minWidth:130}}><ProgCell pct={l.progress||0}/></td>
                    <td style={{padding:"13px 18px",fontSize:12,color:T.text3,whiteSpace:"nowrap"}}>{l.lastLogin||"Never"}</td>
                    <td style={{padding:"13px 18px",textAlign:"center"}}>
                      <div style={{display:"inline-flex",gap:6,flexWrap:"nowrap"}}>
                        {l.status==="Pending"&&<Btn variant="accent" sm onClick={()=>handleApprove(l.id)}>Approve</Btn>}
                        <Btn variant="outline" sm onClick={()=>setProfileUser(l)}>Profile</Btn>
                        {l.status==="Deactivated"
                          ?<Btn variant="outline" sm onClick={()=>{setLearners(prev=>prev.map(x=>x.id===l.id?{...x,status:"Active",events:[...(x.events||[]),"Unarchived"]}:x));showToast("✅ Learner restored.");}}>Unarchive</Btn>
                          :<Btn variant="outline" sm onClick={()=>{setLearners(prev=>prev.map(x=>x.id===l.id?{...x,status:"Deactivated",events:[...(x.events||[]),"Archived"]}:x));showToast("Learner archived.");}}>Archive</Btn>
                        }
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length===0&&<tr><td colSpan={7} style={{textAlign:"center",padding:"36px",color:T.text3,fontSize:13}}>No learners match this view</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{padding:"11px 18px",fontSize:12,color:T.text3,borderTop:`1px solid ${T.border}`}}>Showing {filtered.length} of {learners.length} learners</div>
      </div>

      {profileUser&&<LearnerProfileModal user={profileUser} courses={courses} onSave={handleSaveProfile} onClose={()=>setProfileUser(null)} showToast={showToast}/>}
      {showImport&&<AddUsersModal onClose={()=>setShowImport(false)} learners={learners} setLearners={setLearners} showToast={showToast} settings={settings} setPage={setPage}/>}
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
      <LicenceBanner activeLearners={activeLearners} settings={settings} onUpgrade={()=>{onClose();setPage("pricing");}}/>

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
      <LicenceBanner activeLearners={activeLearners} settings={settings} compact onUpgrade={()=>{onClose();setPage("pricing");}}/>
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
      <div className="cst-grid-3" style={{gap:16}}>
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
      <div className="cst-table-scroll" style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
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

      <div className="cst-grid-4" style={{marginBottom:20}}>
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
function PageReports({ courses, learners, certs, showToast }) {
  const [view, setView] = useState(null); // null | 'compliance' | 'spreadsheet' | 'records' | 'certs'
  // compliance filters
  const [passMark, setPassMark] = useState(80);
  const [statusFilter, setStatusFilter] = useState('all');
  // spreadsheet filters
  const [ssStart, setSsStart] = useState('2025-01-01');
  const [ssEnd, setSsEnd] = useState(new Date().toISOString().slice(0,10));
  const [ssDept, setSsDept] = useState('all');
  const [ssCourse, setSsCourse] = useState('all');
  const [ssArchived, setSsArchived] = useState('all');
  const [ssTrainee, setSsTrainee] = useState('all');
  // records filters
  const [recLearner, setRecLearner] = useState('all');

  // ── helpers ──────────────────────────────────────────────────────────────
  function dlCSV(filename, rows) {
    const BOM = '﻿'; // UTF-8 BOM for Excel compatibility
    const csv = BOM + rows.map(r=>r.map(c=>`"${String(c??'').replace(/"/g,'""')}"`).join(',')).join('\r\n');
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
    showToast(`Downloaded: ${filename}`);
  }

  // per-learner per-course status
  function lStatus(l, c) {
    if (l.status==='Deactivated') return 'Archived';
    const idx = courses.indexOf(c);
    const band = 100 / courses.length;
    const done = l.progress >= (idx+1)*band;
    const started = l.progress > idx*band;
    if (done) return 'Passed';
    if (started) return 'In Progress';
    return 'Not Started';
  }
  function statusStyle(s) {
    if (s==='Passed')      return {bg:'#DCFCE7',color:'#166534'};
    if (s==='In Progress') return {bg:'#FEF3C7',color:'#92400E'};
    if (s==='Archived')    return {bg:T.bg,     color:T.text3};
    return {bg:T.bg, color:T.text3};
  }

  // ── aggregate stats ──────────────────────────────────────────────────────
  const active = learners.filter(l=>l.status!=='Deactivated');
  const totalEnrolled   = courses.reduce((s,c)=>s+c.enrolled,0);
  const totalCompleted  = courses.reduce((s,c)=>s+c.completed,0);
  const totalInProgress = courses.reduce((s,c)=>s+c.inProgress,0);
  const totalFailed     = totalEnrolled - totalCompleted - totalInProgress;
  const compliancePct   = totalEnrolled>0 ? Math.round(totalCompleted/totalEnrolled*100) : 0;

  // ── CSV generators ───────────────────────────────────────────────────────
  // shared helper: course-level completion per learner
  function courseCompleted(l, courseIdx) {
    const band = 100 / courses.length;
    return l.progress >= (courseIdx + 1) * band;
  }
  function courseScore(l, courseIdx) {
    return courseCompleted(l, courseIdx) ? l.progress : '';
  }

  function dlComplianceMatrix() {
    // Matrix format: learners as rows, courses as columns
    const header = ['First name','Last name','Department','Status',
      ...courses.map(c=>c.name),'Overall %',
      '','Enrolments','Passed','Compliance %'];
    const rows = learners.map(l=>{
      const [fn,...rest]=l.name.split(' ');
      const statuses = courses.map((c,i)=>courseCompleted(l,i)?'Completed':'Not completed');
      const passed = courses.filter((_,i)=>courseCompleted(l,i)).length;
      return [fn,rest.join(' '),l.dept,l.status,...statuses,
        `${Math.round(passed/courses.length*100)}%`,
        '','','',''];
    });
    const blank = Array(4+courses.length+5).fill('');
    const enrol = [...Array(4).fill(''),...courses.map(c=>c.enrolled),'','','Total',totalEnrolled,''];
    const passd = [...Array(4).fill(''),...courses.map(c=>c.completed),'','','Passed',totalCompleted,''];
    const pct   = [...Array(4).fill(''),...courses.map(c=>`${Math.round(c.completed/Math.max(c.enrolled,1)*100)}%`),'','','Compliance %',`${compliancePct}%`,''];
    dlCSV('cst-compliance-matrix.csv',[header,...rows,blank,enrol,passd,pct]);
  }

  function dlTraineeSpreadsheet() {
    const hdr = ['Surname','First name','Email','Department','Account status',
      'Course','Enrolled date','Completed','Score (%)','Last activity'];
    const rows = [];
    learners.forEach(l=>{
      const [fn,...rest]=l.name.split(' ');
      courses.forEach((c,i)=>{
        const done = courseCompleted(l,i);
        rows.push([rest.join(' '), fn, l.email, l.dept, l.status, c.name,
          new Date(l.joined).toLocaleDateString('en-GB'),
          done?'Yes':'No',
          courseScore(l,i),
          new Date(l.joined).toLocaleDateString('en-GB')]);
      });
    });
    dlCSV('cst-trainee-spreadsheet.csv',[hdr,...rows]);
  }

  function dlTrainingRecords() {
    const hdr = ['Trainee','Email','Department','Status','Course',
      'Enrolled','Completed','Score (%)','Certificate date'];
    const rows = [];
    learners.forEach(l=>{
      courses.forEach((c,i)=>{
        const done = courseCompleted(l,i);
        const cert = certs.find(ct=>ct.learnerId===l.id&&ct.courseId===c.id);
        rows.push([l.name, l.email, l.dept, l.status, c.name,
          new Date(l.joined).toLocaleDateString('en-GB'),
          done?'Yes':'No',
          courseScore(l,i),
          cert ? new Date(cert.claimedOn).toLocaleDateString('en-GB') : '']);
      });
    });
    dlCSV('cst-training-records.csv',[hdr,...rows]);
  }

  function dlCertRegister() {
    const hdr = ['Certificate ID','Learner name','Email','Department',
      'Course','Date issued','Status','Enrolment type'];
    const rows = certs.map(ct=>{
      const l = learners.find(x=>x.id===ct.learnerId);
      return [ct.id, ct.learnerName, l?.email??'', l?.dept??'',
        ct.courseName, new Date(ct.claimedOn).toLocaleDateString('en-GB'),
        ct.status, ct.type];
    });
    dlCSV('cst-certificate-register.csv',[hdr,...rows]);
  }

  const DEPTS = ['all',...new Set(learners.map(l=>l.dept))];
  const STATUS_OPTS = [
    {v:'all',        label:'All statuses'},
    {v:'failed',     label:'Failed'},
    {v:'enrolled',   label:'Enrolled'},
    {v:'passed12',   label:'Passed over 12 months ago'},
    {v:'passedrecent',label:'Passed in last 12 months'},
    {v:'passedany',  label:'Passed any time'},
  ];

  // rich status per learner per course
  function richStatus(l, c) {
    if(l.status==='Deactivated') return 'archived';
    const idx=courses.indexOf(c);
    const band=100/courses.length;
    const done=l.progress>=(idx+1)*band;
    const started=l.progress>idx*band;
    if(!started && !done) return 'notenrolled';
    if(done) {
      const cert=certs.find(ct=>ct.learnerId===l.id&&ct.courseId===c.id);
      const date=cert?new Date(cert.claimedOn):new Date(l.joined);
      const twelveMonthsAgo=new Date(); twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear()-1);
      if(l.progress>=passMark) return date<twelveMonthsAgo?'passed12':'passedrecent';
      return 'failed';
    }
    return 'enrolled';
  }

  function cellStyle(rs) {
    if(rs==='failed')       return {bg:'#DC2626',color:'#fff'};
    if(rs==='enrolled')     return {bg:'#D97706',color:'#fff'};
    if(rs==='passed12')     return {bg:'#166534',color:'#fff'};
    if(rs==='passedrecent') return {bg:'#16A34A',color:'#fff'};
    if(rs==='notenrolled')  return {bg:'transparent',color:T.text3};
    return {bg:T.bg,color:T.text3};
  }

  function cellLabel(rs) {
    if(rs==='failed')       return 'Overdue';
    if(rs==='enrolled')     return 'Due soon';
    if(rs==='passed12')     return 'Completed';
    if(rs==='passedrecent') return 'Completed';
    return '—';
  }

  // ── filtered matrix rows ─────────────────────────────────────────────────
  const matrixRows = learners.filter(l=>{
    const rs=courses.map(c=>richStatus(l,c));
    if(statusFilter==='all') return true;
    if(statusFilter==='failed')      return rs.some(s=>s==='failed');
    if(statusFilter==='enrolled')    return rs.some(s=>s==='enrolled');
    if(statusFilter==='passed12')    return rs.some(s=>s==='passed12');
    if(statusFilter==='passedrecent')return rs.some(s=>s==='passedrecent');
    if(statusFilter==='passedany')   return rs.some(s=>s==='passed12'||s==='passedrecent');
    return true;
  });

  const sel = {background:T.accentLight,border:`1px solid ${T.accent}`,color:T.accent,fontWeight:700};
  const unsel = {background:T.white,border:`1px solid ${T.border}`,color:T.text2,fontWeight:500};
  const fldStyle = {padding:"7px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:T.font,color:T.text,background:T.white,outline:"none",cursor:"pointer"};

  // ── back button ───────────────────────────────────────────────────────────
  const BackBtn = ()=>(
    <button onClick={()=>setView(null)} style={{display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:T.text2,fontSize:13,fontFamily:T.font,marginBottom:20,padding:0}}>
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      Back to Reports
    </button>
  );

  // ── CQC cell renderer ────────────────────────────────────────────────────
  function CQCCell({rs, joined}) {
    if(rs==='archived') return(
      <td style={{textAlign:"center",padding:"10px 6px"}}>
        <span style={{display:"inline-block",padding:"4px 14px",borderRadius:20,border:`1px solid ${T.border}`,fontSize:12,color:T.text3}}>N/A</span>
      </td>
    );
    if(rs==='notenrolled') return(
      <td style={{textAlign:"center",padding:"10px 6px"}}>
        <span style={{display:"inline-block",padding:"4px 12px",borderRadius:20,border:`1px solid ${T.border}`,fontSize:12,color:T.text3,whiteSpace:"nowrap"}}>Not enrolled</span>
      </td>
    );
    if(rs==='passed12'||rs==='passedrecent') return(
      <td style={{textAlign:"center",padding:"10px 6px"}}>
        <span style={{display:"inline-block",padding:"4px 16px",borderRadius:20,background:"#DCFCE7",fontSize:12.5,fontWeight:600,color:"#166534"}}>Completed</span>
      </td>
    );
    if(rs==='enrolled') {
      const due=new Date(joined); due.setMonth(due.getMonth()+6);
      const label=`Due ${due.toLocaleDateString('en-GB',{day:'numeric',month:'short'})}`;
      return(
        <td style={{textAlign:"center",padding:"10px 6px"}}>
          <span style={{display:"inline-block",padding:"4px 12px",borderRadius:20,background:"#FEF3C7",fontSize:12.5,fontWeight:600,color:"#92400E",whiteSpace:"nowrap"}}>{label}</span>
        </td>
      );
    }
    if(rs==='failed') return(
      <td style={{textAlign:"center",padding:"10px 6px"}}>
        <span style={{display:"inline-block",padding:"4px 16px",borderRadius:20,background:"#FEE2E2",fontSize:12.5,fontWeight:600,color:"#DC2626"}}>Overdue</span>
      </td>
    );
    return <td style={{textAlign:"center",padding:"10px 6px",color:T.text3}}>—</td>;
  }

  const [matrixTab, setMatrixTab] = useState('training');

  // ══ DETAIL: COMPLIANCE MATRIX ════════════════════════════════════════════
  if(view==='compliance') return (
    <div style={{padding:"28px 32px",maxWidth:1060,margin:"0 auto"}}>
      <BackBtn/>
      <div style={{display:"flex",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        {[{v:'training',l:'Training matrix'},{v:'cqc',l:'CQC compliance'},{v:'certs',l:'Certificates'}].map(t=>(
          <button key={t.v} onClick={()=>setMatrixTab(t.v)}
            style={{padding:"8px 20px",borderRadius:20,border:`1.5px solid ${matrixTab===t.v?T.text:T.border}`,background:matrixTab===t.v?T.text:"transparent",color:matrixTab===t.v?'#fff':T.text2,fontSize:13.5,fontWeight:600,cursor:"pointer",fontFamily:T.font,transition:"all .15s",flexShrink:0}}>
            {t.l}
          </button>
        ))}
        <div style={{marginLeft:"auto",flexShrink:0}}>
          <Btn variant="primary" sm onClick={matrixTab==='certs'?dlCertRegister:dlComplianceMatrix}>
            ⬇ {matrixTab==='certs'?'Download Certificate Register':'Download CSV'}
          </Btn>
        </div>
      </div>

      {/* ── CQC COMPLIANCE TAB ── */}
      {matrixTab==='cqc'&&(()=>{
        const courseStats = courses.map(c=>{
          const pct = Math.round(c.completed / Math.max(c.enrolled,1) * 100);
          const barColor = pct>=passMark?'#16A34A':pct>=65?'#D97706':'#DC2626';
          return {name:c.name, pct, barColor};
        }).sort((a,b)=>b.pct-a.pct);
        return(
          <div>
            <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:20}}>
              CQC regulation 18 — staffing compliance by course
            </div>
            <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,padding:"8px 0"}}>
              {courseStats.map(({name,pct,barColor},i)=>(
                <div key={name} style={{display:"flex",alignItems:"center",gap:16,padding:"14px 24px",borderBottom:i<courseStats.length-1?`1px solid ${T.border}`:"none"}}>
                  <div style={{width:180,fontSize:13.5,color:T.text,flexShrink:0}}>{name}</div>
                  <div style={{flex:1,height:8,background:'#E5E7EB',borderRadius:4,overflow:"hidden"}}>
                    <div style={{width:`${pct}%`,height:"100%",background:barColor,borderRadius:4,transition:"width .4s ease"}}/>
                  </div>
                  <div style={{width:48,textAlign:"right",fontSize:13.5,fontWeight:700,color:barColor,flexShrink:0}}>{pct}%</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── CERTIFICATES TAB ── */}
      {matrixTab==='certs'&&(()=>{
        function genCode(){return`${Math.floor(1000+Math.random()*9000)}-${Math.floor(10000+Math.random()*90000)}-${Math.floor(1000+Math.random()*9000)}`;}
        function openCert(ct){
          const code=genCode();
          const waveSVG=(side)=>`<svg xmlns="http://www.w3.org/2000/svg" width="90" height="900" style="position:absolute;${side}:0;top:0;height:100%;pointer-events:none;opacity:.18"><path d="M${side==='left'?70:20},0 C${side==='left'?20:70},80 ${side==='left'?80:10},160 ${side==='left'?30:60},240 C${side==='left'?-10:90},320 ${side==='left'?80:10},400 ${side==='left'?30:60},480 C${side==='left'?-10:90},560 ${side==='left'?80:10},640 ${side==='left'?30:60},720 C${side==='left'?-10:90},800 ${side==='left'?70:20},880 ${side==='left'?40:50},900" stroke="#4A7BB5" stroke-width="2" fill="none"/><path d="M${side==='left'?55:35},0 C${side==='left'?5:85},80 ${side==='left'?65:25},160 ${side==='left'?15:75},240 C${side==='left'?-25:105},320 ${side==='left'?65:25},400 ${side==='left'?15:75},480 C${side==='left'?-25:105},560 ${side==='left'?65:25},640 ${side==='left'?15:75},720 C${side==='left'?-25:105},800 ${side==='left'?55:35},880 ${side==='left'?25:65},900" stroke="#4A7BB5" stroke-width="1.5" fill="none"/><path d="M${side==='left'?40:50},0 C${side==='left'?-10:100},80 ${side==='left'?50:40},160 ${side==='left'?0:90},240 C${side==='left'?-40:120},320 ${side==='left'?50:40},400 ${side==='left'?0:90},480 C${side==='left'?-40:120},560 ${side==='left'?50:40},640 ${side==='left'?0:90},720 C${side==='left'?-40:120},800 ${side==='left'?40:50},880 ${side==='left'?10:80},900" stroke="#4A7BB5" stroke-width="1" fill="none"/></svg>`;
          const cpdLogo=`<svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58"><circle cx="29" cy="29" r="27" fill="#fff" stroke="#1B3A6B" stroke-width="2.5"/><circle cx="29" cy="29" r="23" fill="none" stroke="#1B3A6B" stroke-width="1"/><text x="29" y="23" text-anchor="middle" font-family="Arial Black,Arial" font-size="12" font-weight="900" fill="#1B3A6B">CPD</text><text x="29" y="33" text-anchor="middle" font-family="Arial,sans-serif" font-size="6.5" font-weight="700" fill="#1B3A6B" letter-spacing="1">CERTIFIED</text><text x="29" y="43" text-anchor="middle" font-family="Arial,sans-serif" font-size="5" fill="#666">The CPD Certification</text><text x="29" y="50" text-anchor="middle" font-family="Arial,sans-serif" font-size="5" fill="#666">Service</text></svg>`;
          const ukrlpLogo=`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="58" viewBox="0 0 80 58"><rect width="80" height="58" rx="4" fill="#fff" stroke="#1B3A6B" stroke-width="1.5"/><text x="40" y="17" text-anchor="middle" font-family="Arial Black,Arial" font-size="11" font-weight="900" fill="#1B3A6B">UKRLP</text><line x1="8" y1="22" x2="72" y2="22" stroke="#1B3A6B" stroke-width="0.8"/><text x="40" y="31" text-anchor="middle" font-family="Arial,sans-serif" font-size="5.5" fill="#333">UK Register of</text><text x="40" y="39" text-anchor="middle" font-family="Arial,sans-serif" font-size="5.5" fill="#333">Learning Providers</text><text x="40" y="50" text-anchor="middle" font-family="Arial,sans-serif" font-size="5" fill="#666">UKPRN: 10094979</text></svg>`;
          const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificate — ${ct.learner}</title><style>
*{margin:0;padding:0;box-sizing:border-box;}
@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap');
body{width:100%;min-height:100vh;background:#D8DCE8;display:flex;align-items:center;justify-content:center;padding:20px;font-family:Georgia,serif;}
.page{width:680px;min-height:960px;background:#E8EBF2;position:relative;padding:52px 68px 36px;display:flex;flex-direction:column;align-items:center;text-align:center;overflow:hidden;}
.pattern{position:absolute;inset:0;background-image:repeating-linear-gradient(45deg,rgba(60,80,130,.055) 0,rgba(60,80,130,.055) 1px,transparent 0,transparent 50%),repeating-linear-gradient(-45deg,rgba(60,80,130,.055) 0,rgba(60,80,130,.055) 1px,transparent 0,transparent 50%);background-size:14px 14px;pointer-events:none;z-index:0;}
.content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;width:100%;flex:1;}
.logo{height:78px;width:auto;display:block;margin:0 auto 28px;}
.cert-title{font-size:62px;font-weight:900;letter-spacing:5px;text-transform:uppercase;color:#1B3A6B;font-family:'Arial Black',Arial,sans-serif;line-height:1;margin-bottom:6px;}
.cert-sub{display:flex;align-items:center;gap:14px;color:#1B3A6B;font-size:12px;letter-spacing:6px;text-transform:uppercase;margin-bottom:38px;width:100%;}
.cert-sub::before,.cert-sub::after{content:'';flex:1;height:1.5px;background:#1B3A6B;}
.presented{font-size:15px;color:#555;font-style:italic;margin-bottom:10px;font-family:Georgia,serif;}
.name{font-size:40px;font-weight:700;color:#1B3A6B;margin-bottom:16px;font-family:'Arial Black',Arial,sans-serif;}
.recognition{font-size:14px;color:#555;font-style:italic;margin-bottom:12px;}
.course{font-size:21px;font-weight:700;color:#1B3A6B;margin-bottom:36px;line-height:1.5;max-width:500px;}
.issued{font-size:14.5px;color:#555;margin-bottom:8px;}
.issued b,.code b{color:#2A6FDB;font-size:15px;}
.code{font-size:14.5px;color:#555;}
.spacer{flex:1;}
.footer{display:flex;justify-content:space-between;align-items:flex-end;width:100%;margin-top:36px;padding-top:16px;border-top:1px solid rgba(27,58,107,.2);font-size:10px;color:#555;position:relative;z-index:1;}
.addr{text-align:left;line-height:2;}
.addr span{display:block;}
.logos{display:flex;gap:10px;align-items:center;}
.sig{text-align:right;}
.sig-script{font-family:'Dancing Script',cursive,'Comic Sans MS',cursive;font-size:26px;color:#222;margin-bottom:2px;line-height:1;}
.sig-line{width:110px;height:1px;background:#999;margin:4px 0 6px auto;}
.sig-name{font-weight:700;font-size:11px;color:#1B3A6B;}
.sig-title{font-size:10px;color:#555;}
@media print{body{background:#E8EBF2;margin:0;padding:0;}@page{size:A4 portrait;margin:0;}.page{width:210mm;min-height:297mm;}}
</style></head><body>
<div class="page">
  <div class="pattern"></div>
  ${waveSVG('left')}
  ${waveSVG('right')}
  <div class="content">
    <img class="logo" src="${LOGO_B64}" alt="Care Skills Training"/>
    <div class="cert-title">Certificate</div>
    <div class="cert-sub">of achievement</div>
    <p class="presented">This certificate is proudly presented to</p>
    <p class="name">${ct.learner}</p>
    <p class="recognition">in recognition of successful completion of the course</p>
    <p class="course">${ct.course}</p>
    <p class="issued">This certificate is issued on <b>${ct.completed}</b></p>
    <p class="code">Certificate code <b>${code}</b></p>
    <div class="spacer"></div>
    <div class="footer">
      <div class="addr">
        <span>📍 71-75 Shelton Street, Covent Garden</span>
        <span>&nbsp;&nbsp;&nbsp;WC2H 9JQ, London, United Kingdom</span>
        <span>✉ info@careskillstraining.org</span>
        <span>🌐 www.careskillstraining.org</span>
      </div>
      <div class="logos">
        ${cpdLogo}
        ${ukrlpLogo}
      </div>
      <div class="sig">
        <div class="sig-script">Alex Fuller</div>
        <div class="sig-line"></div>
        <div class="sig-name">Alex Fuller</div>
        <div class="sig-title">Director of Certification</div>
        <div class="sig-title">Care Skills Training</div>
      </div>
    </div>
  </div>
</div>
<script>window.onload=()=>{setTimeout(()=>window.print(),500);}</script>
</body></html>`;
          const blob=new Blob([html],{type:'text/html'});
          const url=URL.createObjectURL(blob);
          window.open(url,'_blank');
        }

        const now = new Date();
        const allCerts = [];
        learners.forEach(l=>{
          courses.forEach((c,i)=>{
            if(!courseCompleted(l,i)) return;
            const issued = new Date(l.joined);
            issued.setMonth(issued.getMonth() + Math.floor((i+1)*2));
            const explicit = certs.find(ct=>ct.learnerId===l.id&&ct.courseId===c.id);
            const issuedFinal = explicit ? new Date(explicit.claimedOn) : issued;
            const expiresFinal = new Date(issuedFinal); expiresFinal.setFullYear(expiresFinal.getFullYear()+1);
            const valid = expiresFinal > now;
            allCerts.push({
              learner:l.name, course:c.name,
              completed:issuedFinal.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}),
              score:l.progress,
              expires:expiresFinal.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}),
              valid,
            });
          });
        });
        allCerts.sort((a,b)=>b.valid-a.valid);
        return(
          <div>
            <div style={{fontSize:13.5,color:T.text3,marginBottom:16}}>Click any card to download the certificate as PDF.</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {allCerts.map((ct,i)=>(
                <div key={i} onClick={()=>openCert(ct)} style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,padding:"20px 22px",cursor:"pointer",transition:"box-shadow .15s,border-color .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.1)";e.currentTarget.style.borderColor=T.accent;}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=T.border;}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:2}}>
                    <div style={{fontSize:14,fontWeight:700,color:T.text}}>{ct.learner}</div>
                    <span style={{fontSize:11,color:T.accent,fontWeight:600}}>⬇ PDF</span>
                  </div>
                  <div style={{fontSize:12.5,color:T.text3,marginBottom:14}}>{ct.course}</div>
                  {[{label:'Completed',value:ct.completed},{label:'Score',value:`${ct.score}%`},{label:'Expires',value:ct.expires}].map(({label,value})=>(
                    <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
                      <span style={{fontSize:13,color:T.text2}}>{label}</span>
                      <span style={{fontSize:13,fontWeight:600,color:T.text}}>{value}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",marginTop:2}}>
                    <span style={{fontSize:13,color:T.text2}}>Status</span>
                    <span style={{padding:"3px 12px",borderRadius:20,fontSize:12.5,fontWeight:600,background:ct.valid?'#DCFCE7':'#FEE2E2',color:ct.valid?'#166534':'#DC2626'}}>{ct.valid?'Valid':'Expired'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── TRAINING MATRIX TAB ── */}
      {matrixTab==='training'&&<>
      {/* legend */}
      <div style={{display:"flex",gap:22,marginBottom:18,flexWrap:"wrap"}}>
        {[{c:'#16A34A',l:'Completed'},{c:'#D97706',l:'Due soon'},{c:'#DC2626',l:'Overdue'},{c:'#94A3B8',l:'Not enrolled'}].map(({c,l})=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:T.text2}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:c,flexShrink:0}}/>
            {l}
          </div>
        ))}
      </div>

      {/* filters row */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:13,color:T.text2}}>Pass mark:</span>
          <select value={passMark} onChange={e=>setPassMark(Number(e.target.value))} style={fldStyle}>
            {[60,70,75,80,85,90,100].map(v=><option key={v} value={v}>{v}%</option>)}
          </select>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:13,color:T.text2}}>Status:</span>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={fldStyle}>
            {STATUS_OPTS.map(o=><option key={o.v} value={o.v}>{o.label}</option>)}
          </select>
        </div>
        <span style={{fontSize:12,color:T.text3}}>{matrixRows.length} staff member{matrixRows.length!==1?'s':''}</span>
      </div>

      {/* table */}
      <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
        <div className="cst-table-scroll">
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:640}}>
            <thead>
              <tr style={{background:T.bg,borderBottom:`1px solid ${T.border}`}}>
                <th style={{textAlign:"left",padding:"12px 18px",fontSize:12.5,fontWeight:700,color:T.text,minWidth:160}}>Staff member</th>
                <th style={{textAlign:"left",padding:"12px 14px",fontSize:12.5,fontWeight:700,color:T.text,minWidth:120}}>Role</th>
                {courses.map(c=>(
                  <th key={c.id} title={c.name} style={{textAlign:"center",padding:"12px 8px",fontSize:12,fontWeight:700,color:T.text,minWidth:110,lineHeight:1.3}}>
                    {c.name.split(' ').length>2?<>{c.name.split(' ').slice(0,Math.ceil(c.name.split(' ').length/2)).join(' ')}<br/>{c.name.split(' ').slice(Math.ceil(c.name.split(' ').length/2)).join(' ')}</>:c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixRows.map(l=>{
                const rs=courses.map(c=>richStatus(l,c));
                const isManager=l.dept==='Admin Staff';
                return(
                  <tr key={l.id} style={{borderBottom:`1px solid ${T.border}`}}
                    onMouseEnter={e=>e.currentTarget.style.background='#FAFAFA'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{padding:"12px 18px",fontSize:13.5,fontWeight:500,color:T.text}}>{l.name}</td>
                    <td style={{padding:"12px 14px",fontSize:13}}>
                      {isManager
                        ?<span style={{display:"inline-block",padding:"3px 12px",borderRadius:20,background:T.accentLight,color:T.accent,fontSize:12.5,fontWeight:600}}>{l.dept}</span>
                        :<span style={{color:T.text2}}>{l.dept}</span>}
                    </td>
                    {rs.map((s,i)=><CQCCell key={i} rs={s} joined={l.joined}/>)}
                  </tr>
                );
              })}
              {/* compliance footer */}
              <tr style={{background:'#F8FBF8',borderTop:`2px solid ${T.border}`}}>
                <td colSpan={2} style={{padding:"11px 18px",fontSize:12.5,fontWeight:700,color:T.text2}}>Compliance %</td>
                {courses.map(c=>{
                  const pct=Math.round(c.completed/Math.max(c.enrolled,1)*100);
                  return <td key={c.id} style={{textAlign:"center",padding:"11px 8px",fontSize:13,fontWeight:800,color:pct>=passMark?'#166534':'#DC2626'}}>{pct}%</td>;
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </>}
    </div>
  );

  // ══ DETAIL: TRAINEE SPREADSHEET ══════════════════════════════════════════
  if(view==='spreadsheet') return (
    <div style={{padding:"28px 32px",maxWidth:860,margin:"0 auto"}}>
      <BackBtn/>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24,gap:14}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:700,color:T.text,margin:"0 0 4px"}}>Trainee Spreadsheet</h2>
          <p style={{fontSize:13,color:T.text3,margin:0}}>Download a spreadsheet of all trainee courses for a date range.</p>
        </div>
        <Btn variant="primary" sm onClick={dlTraineeSpreadsheet}>⬇ Download CSV</Btn>
      </div>
      <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,padding:"24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
          <div>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:T.text2,marginBottom:6,textTransform:"uppercase",letterSpacing:".04em"}}>Start date</label>
            <input type="date" value={ssStart} onChange={e=>setSsStart(e.target.value)} style={{...fldStyle,width:"100%"}}/>
          </div>
          <div>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:T.text2,marginBottom:6,textTransform:"uppercase",letterSpacing:".04em"}}>End date</label>
            <input type="date" value={ssEnd} onChange={e=>setSsEnd(e.target.value)} style={{...fldStyle,width:"100%"}}/>
          </div>
          <div>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:T.text2,marginBottom:6,textTransform:"uppercase",letterSpacing:".04em"}}>Course / Bundle</label>
            <select value={ssCourse} onChange={e=>setSsCourse(e.target.value)} style={{...fldStyle,width:"100%"}}>
              <option value="all">All courses</option>
              <optgroup label="── Enrolled courses ──">
                {courses.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
              <optgroup label="── Full catalogue ──">
                {COURSE_CATALOGUE.map(c=><option key={c.id} value={`cat_${c.id}`}>{c.name}</option>)}
              </optgroup>
            </select>
          </div>
          <div>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:T.text2,marginBottom:6,textTransform:"uppercase",letterSpacing:".04em"}}>Progress</label>
            <select value={ssArchived} onChange={e=>setSsArchived(e.target.value)} style={{...fldStyle,width:"100%"}}>
              <option value="all">All course progress</option>
              <option value="active">Active courses only</option>
              <option value="archived">Archived courses only</option>
              <option value="done">Completed only</option>
              <option value="inprogress">In progress only</option>
            </select>
          </div>
          <div>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:T.text2,marginBottom:6,textTransform:"uppercase",letterSpacing:".04em"}}>Department</label>
            <select value={ssDept} onChange={e=>setSsDept(e.target.value)} style={{...fldStyle,width:"100%"}}>
              {DEPTS.map(d=><option key={d} value={d}>{d==='all'?'All departments':d}</option>)}
            </select>
          </div>
          <div>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:T.text2,marginBottom:6,textTransform:"uppercase",letterSpacing:".04em"}}>Trainee</label>
            <select value={ssTrainee} onChange={e=>setSsTrainee(e.target.value)} style={{...fldStyle,width:"100%"}}>
              <option value="all">All trainees</option>
              {learners.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
        </div>
        {/* preview table */}
        {(()=>{
          const filteredLearners = learners.filter(l=>{
            if(ssDept!=='all'&&l.dept!==ssDept) return false;
            if(ssTrainee!=='all'&&l.id!==ssTrainee) return false;
            if(ssArchived==='active'&&l.status==='Deactivated') return false;
            if(ssArchived==='archived'&&l.status!=='Deactivated') return false;
            return true;
          });
          const filteredCourses = ssCourse==='all' ? courses :
            ssCourse.startsWith('cat_') ? [] :
            courses.filter(c=>c.id===ssCourse);
          const previewRows = [];
          filteredLearners.forEach(l=>{
            (filteredCourses.length>0?filteredCourses:courses).forEach((c,i)=>{
              const done=courseCompleted(l,courses.indexOf(c));
              previewRows.push({l,c,done});
            });
          });
          const selectedCourseName = ssCourse==='all'?null:
            ssCourse.startsWith('cat_')?COURSE_CATALOGUE.find(c=>`cat_${c.id}`===ssCourse)?.name:
            courses.find(c=>c.id===ssCourse)?.name;
          return(
            <div style={{borderTop:`1px solid ${T.border}`,paddingTop:20}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:".04em"}}>
                  Preview — {selectedCourseName?`"${selectedCourseName}"`:filteredCourses.length>0?`${filteredCourses.length} course(s)`:'All courses'} · {filteredLearners.length} learner{filteredLearners.length!==1?'s':''}
                </div>
              </div>
              {ssCourse.startsWith('cat_')?(
                <div style={{background:T.accentLight,borderRadius:10,padding:"16px 20px",fontSize:13,color:T.accent2,border:`1px solid ${T.border}`}}>
                  💡 This course is from our full catalogue. Learners will be shown once enrolled. Click <strong>Download CSV</strong> to export a template.
                </div>
              ):(
                <div className="cst-table-scroll">
                  <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
                    <thead><tr style={{background:T.bg}}>
                      {['Surname','First name','Email','Department','Course','Enrolled','Completed','Score'].map(h=>(
                        <th key={h} style={{textAlign:"left",padding:"9px 12px",fontSize:11,fontWeight:700,color:T.text2,borderBottom:`1px solid ${T.border}`}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {previewRows.slice(0,8).map(({l,c,done},ri)=>{
                        const [fn,...rest]=l.name.split(' ');
                        return <tr key={ri} style={{borderBottom:`1px solid ${T.border}`}}>
                          <td style={{padding:"9px 12px",fontSize:12.5,color:T.text}}>{rest.join(' ')}</td>
                          <td style={{padding:"9px 12px",fontSize:12.5,color:T.text}}>{fn}</td>
                          <td style={{padding:"9px 12px",fontSize:12,color:T.text3}}>{l.email}</td>
                          <td style={{padding:"9px 12px",fontSize:12,color:T.text3}}>{l.dept}</td>
                          <td style={{padding:"9px 12px",fontSize:12,color:T.text}}>{c.name}</td>
                          <td style={{padding:"9px 12px",fontSize:12,color:T.text3}}>{new Date(l.joined).toLocaleDateString('en-GB')}</td>
                          <td style={{padding:"9px 12px",fontSize:12}}><span style={{color:done?'#166534':'#DC2626',fontWeight:600}}>{done?'Yes':'No'}</span></td>
                          <td style={{padding:"9px 12px",fontSize:12,color:T.text3}}>{done?`${l.progress}%`:''}</td>
                        </tr>;
                      })}
                    </tbody>
                  </table>
                  {previewRows.length>8&&<div style={{padding:"10px 12px",fontSize:12,color:T.text3}}>…and {previewRows.length-8} more rows in the download.</div>}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );

  // ══ DETAIL: TRAINING RECORDS ══════════════════════════════════════════════
  if(view==='records') return (
    <div style={{padding:"28px 32px",maxWidth:860,margin:"0 auto"}}>
      <BackBtn/>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24,gap:14}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:700,color:T.text,margin:"0 0 4px"}}>Training Records</h2>
          <p style={{fontSize:13,color:T.text3,margin:0}}>Full per-learner training history. Suitable for CQC inspection.</p>
        </div>
        <Btn variant="primary" sm onClick={dlTrainingRecords}>⬇ Download CSV</Btn>
      </div>
      <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,padding:"24px",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{flex:1}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:T.text2,marginBottom:6,textTransform:"uppercase",letterSpacing:".04em"}}>Trainee</label>
            <select value={recLearner} onChange={e=>setRecLearner(e.target.value)} style={{...fldStyle,width:"100%"}}>
              <option value="all">All trainees</option>
              {learners.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
        </div>
        <div className="cst-table-scroll">
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
            <thead><tr style={{background:T.bg}}>
              {['Trainee','Department','Course','Enrolled','Completed','Score (%)','Certificate'].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"9px 12px",fontSize:11,fontWeight:700,color:T.text2,borderBottom:`1px solid ${T.border}`}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {learners.filter(l=>recLearner==='all'||l.id===recLearner).map(l=>
                courses.map((c,ci)=>{
                  const s=lStatus(l,c);
                  const cert=certs.find(ct=>ct.learnerId===l.id&&ct.courseId===c.id);
                  return <tr key={`${l.id}-${c.id}`} style={{borderBottom:`1px solid ${T.border}`}}>
                    {ci===0&&<td rowSpan={courses.length} style={{padding:"11px 12px",fontSize:13,fontWeight:600,color:T.text,verticalAlign:"top",borderRight:`1px solid ${T.border}`}}>{l.name}<br/><span style={{fontSize:11,color:T.text3,fontWeight:400}}>{l.dept}</span></td>}
                    {ci===0&&<td rowSpan={courses.length} style={{padding:"11px 12px",fontSize:12,color:T.text3,verticalAlign:"top",borderRight:`1px solid ${T.border}`}}>{l.dept}</td>}
                    <td style={{padding:"9px 12px",fontSize:12.5,color:T.text}}>{c.name}</td>
                    <td style={{padding:"9px 12px",fontSize:12,color:T.text3}}>{new Date(l.joined).toLocaleDateString('en-GB')}</td>
                    <td style={{padding:"9px 12px",fontSize:12}}><span style={{color:s==='Passed'?'#166534':'#92400E',fontWeight:600}}>{s==='Passed'?'Yes':'No'}</span></td>
                    <td style={{padding:"9px 12px",fontSize:12,color:T.text3}}>{s==='Passed'?`${l.progress}%`:''}</td>
                    <td style={{padding:"9px 12px",fontSize:12,color:T.text3}}>{cert?new Date(cert.claimedOn).toLocaleDateString('en-GB'):'—'}</td>
                  </tr>;
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ══ LANDING: CARDS ════════════════════════════════════════════════════════
  const CARDS=[
    {id:'compliance',title:'Compliance Matrix',desc:'View the full compliance status across all learners and courses. Filter by pass mark and status. CQC-ready.',icon:ICONS.check},
    {id:'spreadsheet',title:'Trainee Spreadsheet',desc:'Download a spreadsheet of all your trainees\' courses for a set date range.',icon:ICONS.book},
    {id:'records',title:'Training Records',desc:'Download a full training history per learner — suitable for CQC inspection folders.',icon:ICONS.cert},
  ];

  return (
    <div style={{padding:"28px 32px",maxWidth:860,margin:"0 auto"}}>
      <div style={{marginBottom:28}}>
        <h1 style={{fontSize:22,fontWeight:700,color:T.text,margin:"0 0 5px"}}>Reports & Records</h1>
        <p style={{fontSize:13.5,color:T.text2,margin:0}}>CQC-ready compliance reports and trainee activity exports.</p>
      </div>
      {/* stat row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:32}}>
        {[
          {label:'Total Enrolments',value:totalEnrolled,color:T.accent},
          {label:'Completed',value:totalCompleted,color:'#166534'},
          {label:'In Progress',value:totalInProgress,color:'#92400E'},
          {label:'Compliance Rate',value:`${compliancePct}%`,color:compliancePct>=80?'#166534':'#92400E'},
        ].map(s=>(
          <div key={s.label} style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,padding:"18px 20px"}}>
            <div style={{fontSize:26,fontWeight:800,color:s.color,marginBottom:4}}>{s.value}</div>
            <div style={{fontSize:12,color:T.text3}}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* report cards */}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {CARDS.map(card=>(
          <div key={card.id} onClick={()=>setView(card.id)}
            style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,padding:"22px 24px",display:"flex",alignItems:"center",gap:20,cursor:"pointer",transition:"box-shadow .15s,border-color .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.08)";e.currentTarget.style.borderColor=T.accent;}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=T.border;}}>
            <div style={{width:48,height:48,borderRadius:12,background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon d={card.icon} size={20} color={T.accent}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:4}}>{card.title}</div>
              <div style={{fontSize:13,color:T.text3,lineHeight:1.6}}>{card.desc}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke={T.text3} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SUBSCRIPTION PAGE ────────────────────────────────────────────────────────

const COURSE_CATALOGUE = [
  {id:"C01",name:"Care Certificate Standards 1-16",price:19.99},
  {id:"C02",name:"Mandatory Training for Care Staff",price:19.99},
  {id:"C03",name:"Level 2 Safeguarding Children and Vulnerable Adults",price:19.99},
  {id:"C04",name:"Care Planning and Record Keeping",price:19.00},
  {id:"C05",name:"Family Support Worker Training",price:29.99},
  {id:"C06",name:"Training for Care Workers (Complete Package)",price:49.00},
  {id:"C07",name:"Care Certificate + Level 2 & 3 Diploma Bundle",price:39.00},
  {id:"C08",name:"Mandatory Training for Care Home Staff",price:39.00},
  {id:"C09",name:"Medical Assistant UK Training",price:19.99},
  {id:"C10",name:"Moving and Handling People",price:19.00},
  {id:"C11",name:"Medication Administration Level 4",price:25.00},
  {id:"C12",name:"Phlebotomy Training Online",price:19.00},
  {id:"C13",name:"Health and Social Care Level 3 Diploma",price:29.99},
  {id:"C14",name:"Level 5 Diploma in Health and Social Care",price:39.99},
  {id:"C15",name:"Level 2 and 3 Diploma in Health and Social Care",price:29.99},
  {id:"C16",name:"Designated Safeguarding Lead (Level 3)",price:29.00},
  {id:"C17",name:"Level 3 Safeguarding Adults Training",price:29.99},
  {id:"C18",name:"Level 5 Designated Safeguarding Lead (DSL)",price:49.99},
  {id:"C19",name:"Safeguarding Level 4 Training",price:29.00},
  {id:"C20",name:"Safeguarding Children Level 3",price:29.99},
  {id:"C21",name:"Emergency First Aid at Work",price:19.00},
  {id:"C22",name:"Paediatric First Aid Course",price:19.00},
  {id:"C23",name:"Mental Health First Aid for Workplace",price:25.00},
  {id:"C24",name:"Basic Cardiac Life Support Course",price:25.00},
  {id:"C25",name:"First Aid for Sports and Athletes",price:19.00},
  {id:"C26",name:"Trauma-Informed Care Training",price:39.00},
  {id:"C27",name:"Cognitive Behavioural Therapy Training",price:25.00},
  {id:"C28",name:"ADHD Awareness Training",price:19.99},
  {id:"C29",name:"Dementia, Mental Health and Learning Disability Awareness",price:29.00},
  {id:"C30",name:"Stress Management Diploma",price:29.00},
  {id:"C31",name:"Mental Health Awareness Training",price:29.00},
  {id:"C32",name:"Dementia Care Training",price:29.00},
  {id:"C33",name:"Level 3 Child Psychology Diploma",price:19.99},
  {id:"C34",name:"Substance Misuse Awareness Course",price:20.00},
  {id:"C35",name:"Grief and Bereavement Counselling Training",price:19.00},
  {id:"C36",name:"Level 1 Food Hygiene and Safety",price:19.00},
  {id:"C37",name:"Level 2 Food Safety and Hygiene for Catering",price:19.00},
  {id:"C38",name:"Level 2 HACCP Training",price:19.00},
  {id:"C39",name:"Level 3 HACCP",price:19.99},
  {id:"C40",name:"Diabetes Awareness Training",price:25.00},
  {id:"C41",name:"Infection Prevention and Control Training",price:29.00},
  {id:"C42",name:"Fire Safety for Care Homes Training",price:19.99},
  {id:"C43",name:"Asbestos Awareness Training (Category B)",price:19.99},
  {id:"C44",name:"Working at Height Training",price:19.00},
  {id:"C45",name:"Childcare and EYFS Training Level 3",price:25.00},
  {id:"C46",name:"Early Childhood Education Training",price:29.99},
  {id:"C47",name:"Youth Work Training",price:25.00},
  {id:"C48",name:"Elderly Home Care Diploma",price:19.99},
  {id:"C49",name:"PEG Feeding Training",price:25.00},
  {id:"C50",name:"Safeguarding Adults Level 3",price:29.99},
];

const VOL_TIERS = [
  {min:1,   max:4,        pct:0,  label:"Standard"},
  {min:5,   max:9,        pct:20, label:"20% off"},
  {min:10,  max:24,       pct:25, label:"25% off"},
  {min:25,  max:49,       pct:30, label:"30% off"},
  {min:50,  max:99,       pct:35, label:"35% off"},
  {min:100, max:249,      pct:40, label:"40% off"},
  {min:250, max:499,      pct:45, label:"45% off"},
  {min:500, max:Infinity, pct:50, label:"50% off"},
];
const COURSE_TIERS = [
  {min:1,   max:4,        pct:0,  label:"Standard"},
  {min:5,   max:9,        pct:20, label:"20% off"},
  {min:10,  max:24,       pct:25, label:"25% off"},
  {min:25,  max:49,       pct:30, label:"30% off"},
  {min:50,  max:99,       pct:35, label:"35% off"},
  {min:100, max:249,      pct:40, label:"40% off"},
  {min:250, max:499,      pct:45, label:"45% off"},
  {min:500, max:Infinity, pct:50, label:"50% off"},
];
function getTier(qty){return VOL_TIERS.find(t=>qty>=t.min&&qty<=t.max)||VOL_TIERS[0];}
function getCourseTier(qty){return COURSE_TIERS.find(t=>qty>=t.min&&qty<=t.max)||COURSE_TIERS[0];}

function QuoteSuccessModal({onClose}){
  return(
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:20,padding:"44px 36px 36px",maxWidth:420,width:"100%",boxShadow:"0 24px 60px rgba(0,0,0,.18)",animation:"fadeUp .2s ease",textAlign:"center"}}>
        <div style={{width:72,height:72,borderRadius:"50%",border:"2px solid #86EFAC",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px"}}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16l8 8 12-14" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:16}}>Quote request sent</div>
        <div style={{fontSize:14,color:T.text2,lineHeight:1.7,marginBottom:10}}>
          Once your quote request has been processed, it will be sent to your email address.
        </div>
        <div style={{fontSize:14,color:T.text2,lineHeight:1.7,marginBottom:32}}>
          If you haven't received this email, please contact:{" "}
          <strong>info@careskillstraining.org</strong>
        </div>
        <button onClick={onClose} style={{padding:"12px 48px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bg,color:T.text2,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Close</button>
      </div>
    </div>
  );
}

function VATContactModal({onClose}){
  return(
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:20,padding:"44px 36px 36px",maxWidth:420,width:"100%",boxShadow:"0 24px 60px rgba(0,0,0,.18)",animation:"fadeUp .2s ease",textAlign:"center"}}>
        <div style={{width:72,height:72,borderRadius:"50%",border:"2px solid #FCD34D",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px",fontSize:30}}>🌍</div>
        <div style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:16}}>VAT enquiry</div>
        <div style={{fontSize:14,color:T.text2,lineHeight:1.7,marginBottom:10}}>
          Our orders include VAT at the current UK rate (20%).
        </div>
        <div style={{fontSize:14,color:T.text2,lineHeight:1.7,marginBottom:32}}>
          If you are based outside of the UK and need VAT adjusted, please contact us at:{" "}
          <strong>info@careskillstraining.org</strong>
        </div>
        <button onClick={onClose} style={{padding:"12px 48px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bg,color:T.text2,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Close</button>
      </div>
    </div>
  );
}

function DiscountModal({onClose}){
  return(
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:20,padding:"36px 32px",maxWidth:400,width:"100%",boxShadow:"0 24px 60px rgba(0,0,0,.2)",animation:"fadeUp .2s ease"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:24}}>🏷️</div>
          <div style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:8}}>Bigger orders = bigger discounts</div>
          <div style={{fontSize:13.5,color:T.text2,lineHeight:1.6}}>Lock in a better price and access training whenever you need it.</div>
        </div>
        {VOL_TIERS.map(t=>(
          <div key={t.min} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:13.5,color:T.text2}}>{t.max===Infinity ? `${t.min}+ licences` : `${t.min}${t.max>t.min?"-"+t.max:""} licence${t.max>1?"s":""}`}</span>
            <span style={{fontSize:13.5,fontWeight:700,color:t.pct===null?T.purple:t.pct===0?T.text3:T.greenMid}}>{t.pct===null?"Custom pricing":t.pct===0?"Standard price":`${t.pct}% off`}</span>
          </div>
        ))}
        <button onClick={onClose} style={{width:"100%",marginTop:20,padding:"13px",borderRadius:10,border:"none",background:T.navy,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Got it</button>
      </div>
    </div>
  );
}

function CourseShop({showToast,onShowDiscount}){
  const [search,setSearch]=useState("");
  const [dropOpen,setDropOpen]=useState(false);
  const [cart,setCart]=useState([]);
  const [quoteModal,setQuoteModal]=useState(false);
  const [customQuoteModal,setCustomQuoteModal]=useState(false);
  const [vatModal,setVatModal]=useState(false);
  const [qtyInputs,setQtyInputs]=useState({});
  const dropRef=React.useRef(null);
  const inputRef=React.useRef(null);
  React.useEffect(()=>{
    const h=(e)=>{if(dropRef.current&&!dropRef.current.contains(e.target))setDropOpen(false);};
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[]);
  React.useEffect(()=>{
    setDropOpen(true);
    setTimeout(()=>inputRef.current?.focus(),50);
  },[]);
  React.useEffect(()=>{
    if(cart.length===0){setDropOpen(true);setTimeout(()=>inputRef.current?.focus(),50);}
  },[cart.length]);
  const totalQty=cart.reduce((s,i)=>s+(qtyInputs[i.course.id]===''?1:i.qty),0);
  const tier=getCourseTier(totalQty);
  const courseNextTier=COURSE_TIERS.find(t=>t.min>totalQty);
  const courseNeeded=courseNextTier?courseNextTier.min-totalQty:0;
  const addCourse=(course)=>{setCart(prev=>{const ex=prev.find(i=>i.course.id===course.id);if(ex)return prev.map(i=>i.course.id===course.id?{...i,qty:i.qty+1}:i);return[...prev,{course,qty:1}];});setDropOpen(false);setSearch("");};
  const updateQty=(id,delta)=>setCart(prev=>prev.map(i=>i.course.id===id?{...i,qty:Math.max(0,i.qty+delta)}:i).filter(i=>i.qty>0));
  const removeItem=(id)=>setCart(prev=>prev.filter(i=>i.course.id!==id));
  const filtered=COURSE_CATALOGUE.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())).slice(0,30);
  const subtotal=cart.reduce((s,i)=>s+i.course.price*(qtyInputs[i.course.id]===''?1:i.qty),0);
  const discountAmt=tier.pct?subtotal*(tier.pct/100):0;
  const afterDiscount=subtotal-discountAmt;
  const vat=afterDiscount*0.2;
  const total=afterDiscount+vat;
  return(
    <div style={{padding:"32px 28px",maxWidth:960,margin:"0 auto"}}>
      {cart.length>0&&(
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:16,fontSize:12.5,color:"#4F6EF7"}}>
          <span>💡</span>
          <span>You can add multiple courses in a single order.</span>
        </div>
      )}
      <div ref={dropRef} style={{position:"relative",marginBottom:cart.length>0?10:28}}>
        <div onClick={()=>setDropOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:12,border:`1.5px solid ${dropOpen?"#4F6EF7":T.border}`,borderRadius:50,padding:"10px 10px 10px 22px",background:T.white,cursor:"pointer",transition:"border-color .18s, box-shadow .18s",boxShadow:dropOpen?"0 0 0 3px rgba(79,110,247,.1)":"0 1px 4px rgba(0,0,0,.06)"}}>
          <input ref={inputRef} value={search} onChange={e=>{setSearch(e.target.value);setDropOpen(true);}} placeholder="Search for a course..." style={{flex:1,border:"none",outline:"none",fontSize:15,fontFamily:T.font,color:T.text,background:"transparent",cursor:"text"}}/>
          <div style={{width:38,height:38,borderRadius:"50%",background:"#4F6EF7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .18s",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="#3D5CE8"} onMouseLeave={e=>e.currentTarget.style.background="#4F6EF7"}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#fff" strokeWidth="1.8"/><path d="M10 10l3 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </div>
        </div>
        {dropOpen&&(
          <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:T.white,border:`1px solid ${T.border}`,borderRadius:12,boxShadow:"0 8px 32px rgba(0,0,0,.12)",zIndex:50,maxHeight:300,overflowY:"auto"}}>
            {filtered.length>0?filtered.map(c=>(
              <div key={c.id} onClick={()=>addCourse(c)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",cursor:"pointer",borderBottom:`1px solid ${T.border}`}} onMouseEnter={e=>e.currentTarget.style.background=T.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{fontSize:13.5,color:T.text}}>{c.name}</span>
                <span style={{fontSize:13,color:T.text3,fontWeight:600,flexShrink:0,marginLeft:16}}>£{c.price.toFixed(2)}</span>
              </div>
            )):<div style={{padding:20,textAlign:"center",color:T.text3,fontSize:13}}>No courses found</div>}
          </div>
        )}
      </div>
      {cart.length>0&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:20,alignItems:"start"}}>
          <div>
            <div className="cst-table-scroll" style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",marginBottom:courseNextTier?10:0}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:480}}>
                <thead>
                  <tr style={{background:T.bg}}>
                    <th style={{textAlign:"left",padding:"12px 16px",fontSize:12,fontWeight:700,color:T.text2,borderBottom:`1px solid ${T.border}`}}>Course</th>
                    <th style={{textAlign:"center",padding:"12px 16px",fontSize:12,fontWeight:700,color:T.text2,borderBottom:`1px solid ${T.border}`}}>Quantity</th>
                    <th style={{textAlign:"right",padding:"12px 16px",fontSize:12,fontWeight:700,color:T.text2,borderBottom:`1px solid ${T.border}`}}>{tier.pct===null?"":"Price"}</th>
                    <th style={{width:40,borderBottom:`1px solid ${T.border}`}}></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(({course,qty})=>(
                    <tr key={course.id} style={{borderBottom:`1px solid ${T.border}`}}>
                      <td style={{padding:"14px 16px",fontSize:13.5,color:T.text}}>{course.name}</td>
                      <td style={{padding:"14px 16px",textAlign:"center"}}>
                        <div style={{display:"inline-flex",alignItems:"center",border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden"}}>
                          <button onClick={()=>updateQty(course.id,-1)} style={{width:32,height:32,border:"none",background:T.bg,cursor:"pointer",fontSize:18,color:T.text,lineHeight:1}}>−</button>
                          <input type="number" value={course.id in qtyInputs?qtyInputs[course.id]:qty} min={1} max={999} onChange={e=>{setQtyInputs(p=>({...p,[course.id]:e.target.value}));const v=parseInt(e.target.value);if(!isNaN(v)&&v>=1&&v<=999)updateQty(course.id,v-qty);}} onBlur={()=>setQtyInputs(p=>{const n={...p};delete n[course.id];return n;})} style={{width:36,height:32,border:"none",textAlign:"center",fontSize:14,fontWeight:600,fontFamily:T.font,outline:"none",color:T.text,background:"transparent"}}/>
                          <button onClick={()=>updateQty(course.id,1)} style={{width:32,height:32,border:"none",background:T.bg,cursor:"pointer",fontSize:18,color:T.text,lineHeight:1}}>+</button>
                        </div>
                      </td>
                      <td style={{padding:"14px 16px",textAlign:"right"}}>
                        {tier.pct>0?(
                          <span style={{fontSize:13.5,fontWeight:600,color:T.text}}>£{(course.price*(1-tier.pct/100)).toFixed(2)}/licence</span>
                        ):(
                          <span style={{fontSize:13.5,fontWeight:600,color:T.text}}>£{course.price.toFixed(2)}/licence</span>
                        )}
                      </td>
                      <td style={{padding:"14px 16px",textAlign:"center"}}><button onClick={()=>removeItem(course.id)} style={{background:"none",border:"none",cursor:"pointer",color:T.text3,fontSize:20,lineHeight:1,padding:0}}>×</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {courseNextTier&&(
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,background:"linear-gradient(135deg,#E6F9FA 0%,#D4F5F7 100%)",border:"1px solid #45cedd",borderRadius:10,padding:"12px 18px",fontSize:13,color:"#0b5159",fontWeight:500}}>
                <span style={{display:"flex",alignItems:"center",gap:8}}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}><path d="M8 1v14M1 8h14" stroke="#16c2d5" strokeWidth="2" strokeLinecap="round"/></svg>
                  Add{" "}<strong style={{color:"#095159",fontWeight:700}}>{courseNeeded}</strong>{" "}more licence{courseNeeded>1?"s":""} to get{" "}<strong style={{color:"#095159",fontWeight:700}}>{courseNextTier.pct}% off</strong>
                </span>
                <span style={{fontSize:12,color:"#16c2d5",fontWeight:700,flexShrink:0,letterSpacing:".02em"}}>{totalQty} / {courseNextTier.min} licences</span>
              </div>
            )}
          </div>
          {tier.pct===null&&totalQty>=50?(
            <div style={{background:T.purpleBg,border:`1px solid #C4B5FD`,borderRadius:12,padding:"24px 22px",position:"sticky",top:72}}>
              <div style={{fontSize:14,fontWeight:700,color:T.purple,marginBottom:8}}>50+ courses — Custom pricing</div>
              <div style={{fontSize:13,color:T.purple,opacity:.8,lineHeight:1.6,marginBottom:16}}>For bulk orders, we offer tailored pricing with dedicated account management.</div>
              <Btn variant="outline" onClick={()=>setCustomQuoteModal(true)}>Request Custom Quote</Btn>
            </div>
          ):(
            <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,padding:"20px 22px",position:"sticky",top:72}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:16,paddingBottom:12,borderBottom:`1px solid ${T.border}`}}>Order summary</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13.5,marginBottom:8,color:T.text2}}><span>Subtotal</span><span style={{fontWeight:600,color:T.text}}>£{afterDiscount.toFixed(2)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13.5,marginBottom:14,color:T.text2}}><span>VAT (UK, 20%)</span><span style={{fontWeight:600,color:T.text}}>£{vat.toFixed(2)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800,color:T.text,paddingTop:12,borderTop:`2px solid ${T.border}`}}><span>TOTAL</span><span>£{total.toFixed(2)}</span></div>
              {tier.pct>0&&(
                <div style={{marginTop:14,paddingTop:12,borderTop:`1px solid ${T.border}`,fontSize:12.5,color:T.greenMid,fontWeight:600,textAlign:"center"}}>
                  🎉 You saved £{discountAmt.toFixed(2)} on this order
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {cart.length>0&&(
        <div style={{marginTop:28,paddingTop:20,borderTop:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginBottom:10}}>
            <Btn variant="outline" onClick={()=>setQuoteModal(true)}>Request a quote</Btn>
            <Btn variant="accent" onClick={()=>showToast("Redirecting to checkout...")} style={{background:"#EA580C"}}>🔒 Continue to checkout</Btn>
          </div>
          <div style={{textAlign:"right",fontSize:11,color:T.text3,lineHeight:1.5}}>VAT at UK rate (20%). Outside the UK? <button onClick={()=>setVatModal(true)} style={{background:"none",border:"none",color:T.text3,fontWeight:600,fontSize:11,cursor:"pointer",padding:0,fontFamily:T.font,textDecoration:"underline"}}>Contact us</button></div>
        </div>
      )}
      {quoteModal&&<QuoteSuccessModal onClose={()=>setQuoteModal(false)}/>}
      {customQuoteModal&&<CustomQuoteModal onClose={()=>setCustomQuoteModal(false)}/>}
      {vatModal&&<VATContactModal onClose={()=>setVatModal(false)}/>}
    </div>
  );
}

function CustomQuoteModal({onClose}){
  return(
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:20,padding:"44px 36px 36px",maxWidth:420,width:"100%",boxShadow:"0 24px 60px rgba(0,0,0,.18)",animation:"fadeUp .2s ease",textAlign:"center"}}>
        <div style={{width:72,height:72,borderRadius:"50%",border:"2px solid #86EFAC",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px"}}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16l8 8 12-14" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:8}}>Custom quote request sent</div>
        <div style={{display:"inline-block",background:T.accentLight,color:T.accent2,fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:20,marginBottom:16}}>50+ Licences — Enterprise</div>
        <div style={{fontSize:14,color:T.text2,lineHeight:1.7,marginBottom:10}}>
          Our team will review your requirements and prepare a tailored quote for your organisation.
        </div>
        <div style={{fontSize:14,color:T.text2,lineHeight:1.7,marginBottom:8}}>
          You can expect to hear from us within <strong>1 business day</strong>.
        </div>
        <div style={{fontSize:14,color:T.text2,lineHeight:1.7,marginBottom:32}}>
          For urgent enquiries, contact us directly at{" "}
          <strong>info@careskillstraining.org</strong>
        </div>
        <button onClick={onClose} style={{padding:"12px 48px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bg,color:T.text2,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Close</button>
      </div>
    </div>
  );
}

function LicenceShop({showToast}){
  const [qty,setQty]=useState(1);
  const [qtyInput,setQtyInput]=useState(null);
  const [quoteModal,setQuoteModal]=useState(false);
  const [customQuoteModal,setCustomQuoteModal]=useState(false);
  const [vatModal,setVatModal]=useState(false);
  const BASE=59;
  const displayQty=qtyInput===''?1:qty;
  const tier=getTier(displayQty);
  const unitPrice=BASE*(1-tier.pct/100);
  const subtotal=unitPrice*displayQty;
  const vat=subtotal*0.2;
  const total=subtotal+vat;
  const saving=tier.pct?BASE*displayQty-subtotal:0;
  return(
    <div style={{padding:"40px 28px",maxWidth:860,margin:"0 auto"}}>
      <div style={{background:"#F0F4FF",borderRadius:8,padding:"10px 16px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
        <span style={{fontSize:13.5,fontWeight:500,color:"#1a1a2e"}}>
          Give your team every care course they need
        </span>
        <span style={{fontSize:13,fontWeight:700,color:"#4F6EF7",flexShrink:0,whiteSpace:"nowrap"}}>From £{(BASE*(1-Math.max(...VOL_TIERS.map(t=>t.pct))/100)/12).toFixed(2)}<span style={{fontWeight:400,fontSize:11,color:"#6B7280"}}> /user/mo · billed annually</span></span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:20,alignItems:"start"}}>
        <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,padding:"24px"}}>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:18}}>How many licences do you need?</div>

          {/* Stepper + unit price */}
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden",flexShrink:0}}>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:44,height:44,border:"none",background:T.bg,cursor:"pointer",fontSize:22,color:T.text2,lineHeight:1}}>−</button>
              <input type="number" value={qtyInput!==null?qtyInput:qty} min={1}
                onChange={e=>{setQtyInput(e.target.value);const v=parseInt(e.target.value);if(!isNaN(v)&&v>=1)setQty(v);}}
                onBlur={()=>{setQtyInput(null);if(!qty||qty<1)setQty(1);}}
                style={{width:70,height:44,border:"none",textAlign:"center",fontSize:16,fontWeight:700,fontFamily:T.font,outline:"none",color:T.text}}/>
              <button onClick={()=>setQty(q=>q+1)} style={{width:44,height:44,border:"none",background:T.bg,cursor:"pointer",fontSize:22,color:T.text2,lineHeight:1}}>+</button>
            </div>
            <span style={{fontSize:13.5,color:T.text2}}>× <strong style={{color:T.text}}>£{unitPrice.toFixed(2)}</strong>/user/yr <span style={{opacity:.55,fontSize:12}}>(£{(unitPrice/12).toFixed(2)}/user/mo, billed annually)</span></span>
          </div>

          {/* Piecewise-linear slider — labels evenly spaced, positions match values */}
          {(()=>{
            const TICKS=[[0,1],[20,10],[40,50],[60,100],[80,250],[100,500]];
            const sToQ=s=>{for(let i=0;i<TICKS.length-1;i++){const[s1,q1]=TICKS[i],[s2,q2]=TICKS[i+1];if(s>=s1&&s<=s2)return Math.round(q1+(s-s1)/(s2-s1)*(q2-q1));}return 500;};
            const qToS=q=>{const cq=Math.min(Math.max(q,1),500);for(let i=0;i<TICKS.length-1;i++){const[s1,q1]=TICKS[i],[s2,q2]=TICKS[i+1];if(cq>=q1&&cq<=q2)return Math.round(s1+(cq-q1)/(q2-q1)*(s2-s1));}return 100;};
            return(<>
              <input type="range" min={0} max={100} value={qToS(qty)}
                onChange={e=>setQty(sToQ(Number(e.target.value)))}
                style={{width:"100%",accentColor:T.accent,cursor:"pointer",marginBottom:6}}/>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                {TICKS.map(([,lbl])=>(
                  <span key={lbl} onClick={()=>setQty(lbl)}
                    style={{fontSize:11,color:T.text3,cursor:"pointer",userSelect:"none"}}>
                    {lbl===500?"500+":lbl}
                  </span>
                ))}
              </div>
            </>);
          })()}
          {(()=>{
            const nextTier=VOL_TIERS.find(t=>t.min>displayQty&&t.pct!==null);
            if(!nextTier)return null;
            const needed=nextTier.min-displayQty;
            return(
              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"linear-gradient(135deg,#E6F9FA 0%,#D4F5F7 100%)",border:"1px solid #45cedd",borderRadius:8,padding:"9px 14px",fontSize:13,color:"#0b5159",fontWeight:500}}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M1 8h14" stroke="#16c2d5" strokeWidth="2" strokeLinecap="round"/></svg>
                Add <strong style={{color:"#095159",margin:"0 2px"}}>{needed}</strong> more licence{needed>1?"s":""} to get <strong style={{color:"#095159",margin:"0 2px"}}>{nextTier.pct}% off</strong> — only <strong style={{color:"#095159",margin:"0 2px"}}>£{(BASE*(1-nextTier.pct/100)/12).toFixed(2)}/user/mo</strong>
              </div>
            );
          })()}
        </div>
        {total!==null&&(
          <div style={{position:"sticky",top:72,display:"flex",flexDirection:"column",gap:10}}>
            <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,padding:"20px 22px"}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:16,paddingBottom:12,borderBottom:`1px solid ${T.border}`}}>Order summary</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13.5,marginBottom:8,color:T.text2}}><span>{displayQty} licence{displayQty>1?"s":""}</span><span style={{fontWeight:600,color:T.text}}>£{subtotal.toFixed(2)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13.5,marginBottom:14,color:T.text2}}><span>VAT (UK, 20%)</span><span style={{fontWeight:600,color:T.text}}>£{vat.toFixed(2)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800,color:T.text,paddingTop:12,borderTop:`2px solid ${T.border}`}}><span>TOTAL</span><span>£{total.toFixed(2)}</span></div>
              {tier.pct>0&&(
                <div style={{marginTop:14,paddingTop:12,borderTop:`1px solid ${T.border}`,fontSize:12.5,color:T.greenMid,fontWeight:600,textAlign:"center"}}>
                  🎉 You saved £{saving.toFixed(2)} on this order
                </div>
              )}
            </div>
            <Btn variant="outline" onClick={()=>setQuoteModal(true)} style={{width:"100%",justifyContent:"center"}}>Request a quote</Btn>
            <Btn variant="accent" onClick={()=>showToast("Redirecting to checkout...")} style={{background:"#EA580C",width:"100%",justifyContent:"center"}}>🔒 Continue to checkout</Btn>
            <div style={{textAlign:"center",fontSize:11,color:T.text3}}>VAT at UK rate (20%). Outside the UK? <button onClick={()=>setVatModal(true)} style={{background:"none",border:"none",color:T.text3,fontWeight:600,fontSize:11,cursor:"pointer",padding:0,fontFamily:T.font,textDecoration:"underline"}}>Contact us</button></div>
          </div>
        )}
      </div>
      {quoteModal&&<QuoteSuccessModal onClose={()=>setQuoteModal(false)}/>}
      {customQuoteModal&&<CustomQuoteModal onClose={()=>setCustomQuoteModal(false)}/>}
      {vatModal&&<VATContactModal onClose={()=>setVatModal(false)}/>}
    </div>
  );
}

function PageSubscription({settings,setSettings,learners,setPage,showToast}){
  const [tab,setTab]=useState("courses");
  const [showDiscount,setShowDiscount]=useState(false);
  const [hovTab,setHovTab]=useState(null);
  return(
    <div style={{background:T.bg,minHeight:"100vh"}}>
      <div style={{background:T.white,borderBottom:`1px solid ${T.border}`,padding:"24px 28px 0",textAlign:"center"}}>
        <div style={{fontSize:11,fontWeight:700,color:T.accent,letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>Pricing</div>
        <h1 style={{fontSize:28,fontWeight:800,color:T.text,marginBottom:8,letterSpacing:"-.6px",lineHeight:1.2,fontFamily:T.font}}>Simple, transparent pricing</h1>
        <p style={{fontSize:14,color:T.text2,maxWidth:460,margin:"0 auto 16px",lineHeight:1.6}}>Each licence covers one learner — assign a single course or open up the full 300+ library. You choose.</p>
        <button onClick={()=>setShowDiscount(true)}
          style={{display:"inline-flex",alignItems:"center",gap:7,border:`1.5px solid ${T.accent}`,borderRadius:20,padding:"8px 20px",background:`${T.accent}12`,cursor:"pointer",fontSize:13,fontWeight:600,color:T.accent,marginBottom:28,fontFamily:T.font,transition:"background .15s, box-shadow .15s, transform .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=`${T.accent}22`;e.currentTarget.style.boxShadow=`0 2px 10px ${T.accent}33`;e.currentTarget.style.transform="translateY(-1px)";}}
          onMouseLeave={e=>{e.currentTarget.style.background=`${T.accent}12`;e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
          🏷️ Bulk discounts up to 50% off
        </button>
        <div style={{display:"flex",justifyContent:"center",paddingBottom:32}}>
          <div style={{display:"inline-flex",background:"#ECEAE8",borderRadius:10,padding:3,gap:0}}>
            {[["courses","Single Course"],["licences","All Courses"]].map(([v,l])=>{
              const active=tab===v;
              const otherHovered=hovTab!==null&&hovTab!==v;
              const thisHovered=hovTab===v;
              const color=active?(otherHovered?"#888888":"#1A1A1A"):thisHovered?"#1A1A1A":"#888888";
              const activePillOpacity=active?(otherHovered?0:1):0;
              const ghostOpacity=!active&&thisHovered?1:0;
              return(
                <button key={v} onClick={()=>setTab(v)} onMouseEnter={()=>setHovTab(active?null:v)} onMouseLeave={()=>setHovTab(null)}
                  style={{position:"relative",zIndex:1,padding:"9px 28px",fontSize:14,fontWeight:500,color,background:"none",border:"none",borderRadius:8,cursor:"pointer",fontFamily:T.font,transition:"color .25s ease",whiteSpace:"nowrap",letterSpacing:"-.01em"}}>
                  {l}
                  {v==="licences"&&<span style={{fontSize:10,fontWeight:700,color:"#6366F1",background:"#EEF2FF",borderRadius:10,padding:"2px 7px",marginLeft:5,letterSpacing:".02em"}}>Popular</span>}
                  {/* active white pill — dims but stays visible when other hovered */}
                  <span style={{position:"absolute",inset:0,background:"#FFFFFF",borderRadius:8,boxShadow:"0 1px 4px rgba(0,0,0,.12),0 0 0 0.5px rgba(0,0,0,.06)",zIndex:-1,opacity:activePillOpacity,transition:"opacity .25s ease"}}/>
                  {/* hover ghost — near-white so hover→active is seamless */}
                  <span style={{position:"absolute",inset:0,background:"rgba(255,255,255,.65)",borderRadius:8,zIndex:-1,opacity:ghostOpacity,transition:"opacity .2s ease"}}/>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {tab==="courses"?<CourseShop showToast={showToast} onShowDiscount={()=>setShowDiscount(true)}/>:<LicenceShop showToast={showToast}/>}
      {showDiscount&&<DiscountModal onClose={()=>setShowDiscount(false)}/>}
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
            <div style={{gridColumn:"1/-1",textAlign:"right"}}><Btn variant="primary" sm onClick={()=>showToast("Appearance saved!")}>Save Changes</Btn></div>
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
              <span style={{background:T.text,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>LOCKED</span>
            </div>
            {[["Email certificate on completion","autoEmailCert"]].map(([l,k])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
                <div><div style={{fontSize:13,fontWeight:500}}>{l}</div><div style={{fontSize:11.5,color:T.text3}}>Certificates are emailed automatically on completion</div></div>
                <Toggle checked={settings[k]} onChange={v=>{save(k,v);showToast("Saved!");}}/>
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
                    <Btn variant="outline" sm onClick={()=>showToast("Edit "+d)}>Edit</Btn>
                    <Btn variant="red" sm onClick={()=>{save("departments",settings.departments.filter(x=>x!==d));showToast(d+" removed");}}>Remove</Btn>
                  </div>
                </div>
              ))}
            </div>
          </>
        )},
        {title:"Setup & Reset",content:(
          <div style={{background:T.redBg,border:`1px solid #FECACA`,borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontSize:13,fontWeight:700,color:T.redMid,marginBottom:4}}>Re-run Onboarding Wizard</div>
            <div style={{fontSize:12.5,color:T.text2,marginBottom:12,lineHeight:1.5}}>This will clear your setup preferences and show the first-run wizard again. Your learners and course data will be preserved.</div>
            <Btn variant="red" sm onClick={resetOnboarding}>Reset & Re-run Setup Wizard</Btn>
          </div>
        )},
        {title:"Security",content:(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0"}}>
            <div><div style={{fontSize:13,fontWeight:500}}>Multi-factor Authentication (MFA)</div><div style={{fontSize:11.5,color:T.text3}}>Require a verification code on login (Non-SSO accounts)</div></div>
            <Toggle checked={settings.mfaEnabled} onChange={v=>{save("mfaEnabled",v);showToast(v?"MFA enabled":"MFA disabled");}}/>
          </div>
        )},
        {title:"Integrations",content:(
          <>
            {[["Slack Integration","slackEnabled","Share course updates on Slack"],["Microsoft Teams","teamsEnabled","Integrate with MS Teams"],["GenAI Features","genAIEnabled","AI-powered recommendations"]].map(([l,k,d])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
                <div><div style={{fontSize:13,fontWeight:500}}>{l}</div><div style={{fontSize:11.5,color:T.text3}}>{d}</div></div>
                <Toggle checked={settings[k]} onChange={v=>{save(k,v);showToast(v?`${l} enabled!`:`${l} disabled`);}}/>
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

// ─── ONBOARDING WIZARD ────────────────────────────────────────────────────────
const STEPS = [
  { id:"welcome", title:"Welcome to Care Skills Training", sub:"Let's get you set up." },
  { id:"name",    title:"What should we call you?",        sub:"This is how your name will appear on the platform." },
  { id:"org",     title:"About your organisation",         sub:"This helps us personalise your dashboard." },
  { id:"cert",    title:"Certificate download control",    sub:"" },
  { id:"done",    title:"You're all set!",                  sub:"Your dashboard is ready. Let's go!" },
];

function OnboardingWizard({ onComplete }) {
  const [step, setStep]=useState(0);
  const [answers, setAnswers]=useState({ managerName:"", companyName:"", companySize:"", licences:5, certControl:"yes" });
  const set=(k,v)=>setAnswers(a=>({...a,[k]:v}));
  const next=()=>step<STEPS.length-1?setStep(s=>s+1):onComplete(answers);
  const canNext=()=>{
    if(step===0) return true; // welcome — no input
    if(step===1) return answers.managerName.trim().length>0;
    if(step===2) return answers.companyName.trim().length>0&&!!answers.companySize;
    return true;
  };

  // Dark theme tokens
  const D={
    bg:"#1C1C1E", surface:"#2C2C2E", surface2:"#3A3A3C",
    border:"#3C3C3C", borderHover:"#555",
    blue:"#0A84FF", blueHover:"#0071E3",
    text:"#F5F5F7", text2:"#AEAEB2", text3:"#636366",
    red:"#FF453A", redBg:"rgba(255,69,58,.12)",
    green:"#30D158", greenBg:"rgba(48,209,88,.12)",
    selected:"rgba(10,132,255,.15)", selectedBorder:"#0A84FF",
  };

  const inputStyle={width:"100%",padding:"11px 14px",background:D.surface,border:`1px solid ${D.border}`,borderRadius:8,fontSize:14,fontFamily:T.font,outline:"none",color:D.text,boxSizing:"border-box",transition:"border .15s"};

  return (
    <div style={{position:"fixed",inset:0,background:D.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",paddingTop:step===0?"27vh":"10vh",paddingBottom:"7vh",zIndex:1000,fontFamily:T.font}}>
      <style>{`
        .ob-input:focus{border-color:${D.blue}!important;}
        .ob-select{color-scheme:dark;}
        .ob-next:hover{background:${D.blueHover}!important;}
        .ob-next:disabled{opacity:.4;cursor:not-allowed;}
        .ob-opt:hover{border-color:${D.borderHover}!important;}
      `}</style>

      {/* Upper zone */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>
        {/* Logo — only on welcome step */}
        {step===0&&(
          <div style={{marginBottom:36,textAlign:"center"}}>
            <div style={{width:90,height:90,overflow:"hidden",margin:"0 auto",display:"flex",alignItems:"center"}}>
              <img src={LOGO_B64} alt="Care Skills Training" style={{height:90,width:"auto",display:"block",flexShrink:0}}/>
            </div>
          </div>
        )}

        {/* Step title */}
        <div style={{textAlign:"center",marginBottom:36,maxWidth:600,padding:"0 24px"}}>
          <h1 style={{fontSize:step===0?22:26,fontWeight:step===0?300:700,color:D.text,margin:"0 0 12px",letterSpacing:step===0?"0.06em":"-.5px",whiteSpace:step===0?"nowrap":"normal",fontFamily:T.font}}>{STEPS[step].title}</h1>
          {STEPS[step].sub&&<p style={{fontSize:15,color:D.text2,margin:0,lineHeight:1.7}}>{STEPS[step].sub}</p>}
        </div>

        {/* Content card */}
        <div style={{width:"100%",maxWidth:500,padding:"0 24px"}}>

        {/* Step 0 — Welcome only, no content */}

        {/* Step 1 — Name */}
        {step===1&&(
          <div>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:D.text2,marginBottom:6,letterSpacing:".04em",textTransform:"uppercase"}}>Your name</label>
            <input autoFocus className="ob-input" value={answers.managerName} onChange={e=>set("managerName",e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&canNext()&&next()}
              placeholder="e.g. Sarah, Dr. Ahmed, Manager..."
              style={{...inputStyle}}/>
          </div>
        )}

        {/* Step 2 — Organisation */}
        {step===2&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:D.text2,marginBottom:6,letterSpacing:".04em",textTransform:"uppercase"}}>Organisation name</label>
              <input autoFocus className="ob-input" value={answers.companyName} onChange={e=>set("companyName",e.target.value)}
                placeholder="e.g. Sunrise Care Ltd, CQC Services..."
                style={{...inputStyle}}/>
              <div style={{fontSize:12,color:D.text3,marginTop:6}}>Displayed throughout your dashboard.</div>
            </div>
            <div>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:D.text2,marginBottom:6,letterSpacing:".04em",textTransform:"uppercase"}}>Company size</label>
              <select id="sizeSelect" className="ob-input ob-select"
                value={answers.companySize||""}
                onChange={e=>{const v=e.target.value;const map={"1-10":10,"11-49":25,"50-99":60,"100-249":120,"250+":250};set("companySize",v);set("licences",map[v]||5);}}
                style={{...inputStyle,cursor:"pointer",appearance:"none",WebkitAppearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 20 20'%3E%3Cpath d='M5 8l5 5 5-5' stroke='%23636366' stroke-width='1.6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center",paddingRight:40,color:answers.companySize?D.text:D.text3}}>
                <option value="" disabled style={{color:D.text3}}>Select company size...</option>
                {[["1-10","1 – 10 employees"],["11-49","11 – 49 employees"],["50-99","50 – 99 employees"],["100-249","100 – 249 employees"],["250+","250+ employees"]].map(([v,l])=>(
                  <option key={v} value={v} style={{background:D.surface,color:D.text}}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3 — Certificate control */}
        {step===3&&(
          <div>
            <div style={{background:D.redBg,border:`1px solid rgba(255,69,58,.25)`,borderRadius:8,padding:"11px 14px",fontSize:12.5,color:D.red,marginBottom:20,lineHeight:1.6}}>
              <strong>This decision is permanent.</strong> This setting cannot be changed after setup. Choose carefully.
            </div>
            <div style={{fontSize:13,color:D.text2,marginBottom:14}}>Should trainees be able to download their own certificate?</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                {val:"yes",label:"Yes — Trainees can self-download certificates",desc:"After completing a course, trainees download their certificate directly. No action needed from you."},
                {val:"no", label:"No — Manager downloads and distributes only",desc:"Only you can download certificates. Trainees see a 'Certificate pending' message until you send it."},
              ].map(opt=>{
                const sel=answers.certControl===opt.val;
                return(
                  <div key={opt.val} onClick={()=>set("certControl",opt.val)} className={sel?"":"ob-opt"}
                    style={{padding:"14px 16px",borderRadius:10,border:`1.5px solid ${sel?D.selectedBorder:D.border}`,background:sel?D.selected:"transparent",cursor:"pointer",transition:"all .15s"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:sel?6:0}}>
                      <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${sel?D.blue:D.text3}`,background:sel?D.blue:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
                        {sel&&<div style={{width:6,height:6,borderRadius:"50%",background:"#fff"}}/>}
                      </div>
                      <span style={{fontSize:13.5,fontWeight:sel?600:400,color:sel?D.text:D.text2}}>{opt.label}</span>
                    </div>
                    {sel&&<div style={{fontSize:12,color:D.text3,lineHeight:1.55,paddingLeft:30}}>{opt.desc}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4 — Done */}
        {step===4&&(
          <div style={{textAlign:"center"}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:D.greenBg,border:`2px solid rgba(48,209,88,.3)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14l7 7 11-12" stroke={D.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20,textAlign:"left"}}>
              {[
                ["Name",answers.managerName],
                ["Organisation",answers.companyName],
                ["Team size",answers.companySize?answers.companySize+" employees":"—"],
                ["Certificates",answers.certControl==="yes"?"Trainee self-download":"Manager only"],
              ].map(([l,v])=>(
                <div key={l} style={{background:D.surface,borderRadius:10,padding:"12px 14px",border:`1px solid ${D.border}`}}>
                  <div style={{fontSize:11,color:D.text3,marginBottom:4,textTransform:"uppercase",letterSpacing:".04em"}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:600,color:D.text}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:12.5,color:D.text3,lineHeight:1.7}}>Your dashboard is configured and ready. Certificate download control is now <span style={{color:D.red}}>locked</span> and cannot be changed.</div>
          </div>
        )}
        </div>{/* /content card */}
      </div>{/* /upper zone */}

      {/* Bottom nav */}
      <div style={{width:"100%",maxWidth:500,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        {/* Back */}
        <button onClick={()=>setStep(s=>s-1)} disabled={step===0}
          style={{background:"none",border:"none",cursor:step===0?"default":"pointer",color:step===0?"transparent":D.text2,fontSize:14,fontFamily:T.font,padding:"8px 0",transition:"color .15s"}}>
          Back
        </button>

        {/* Dots */}
        <div style={{display:"flex",gap:7,alignItems:"center"}}>
          {STEPS.map((_,i)=>(
            <div key={i} style={{width:i===step?20:7,height:7,borderRadius:4,background:i===step?D.blue:i<step?"rgba(10,132,255,.4)":D.surface2,transition:"all .3s ease"}}/>
          ))}
        </div>

        {/* Next */}
        <button className="ob-next" onClick={next} disabled={!canNext()}
          style={{background:D.blue,color:"#fff",border:"none",borderRadius:8,padding:"10px 22px",fontSize:14,fontWeight:600,fontFamily:T.font,cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"background .15s",opacity:canNext()?1:.4}}>
          {step===0?"Get Started":step===STEPS.length-1?"Launch Dashboard":"Next"}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onAuth }) {
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const [showPw, setShowPw]=useState(false);
  const [error, setError]=useState("");
  const [loading, setLoading]=useState(false);

  const handleSubmit=(e)=>{
    e.preventDefault();
    setError("");
    if(!email.trim()||!password.trim()){setError("Please enter your email and password.");return;}
    const DEMO_EMAIL="admin@careskillstraining.org";
    const DEMO_PASS="Care2026!";
    if(email.trim()!==DEMO_EMAIL||password!==DEMO_PASS){setError("Incorrect email or password.");return;}
    setLoading(true);
    setTimeout(()=>{ setLoading(false); onAuth(email.trim()); },600);
  };

  return(
    <div style={{minHeight:"100vh",background:"#F1F4F9",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:T.font,padding:24}}>
      {/* Card */}
      <div style={{background:"#fff",borderRadius:16,padding:"40px 40px 36px",width:"100%",maxWidth:400,boxShadow:"0 4px 24px rgba(11,30,61,.10)",border:"1px solid #E2E8F2"}}>
        {/* Logo + brand */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <img src="/logo-full.png" alt="Care Skills Training" style={{height:60,marginBottom:12,objectFit:"contain"}}/>
          <div style={{fontSize:11,fontWeight:600,color:T.text3,letterSpacing:".1em",textTransform:"uppercase"}}>Learning Management Suite</div>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Username */}
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:12.5,fontWeight:600,color:T.text2,marginBottom:6}}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={e=>{setEmail(e.target.value);setError("");}}
              placeholder="you@organisation.co.uk"
              autoFocus
              style={{width:"100%",boxSizing:"border-box",border:`1.5px solid ${error?"#DC2626":T.border}`,borderRadius:8,padding:"10px 14px",fontSize:14,fontFamily:T.font,color:T.text,outline:"none",transition:"border .15s"}}
              onFocus={e=>e.target.style.borderColor=T.accent}
              onBlur={e=>e.target.style.borderColor=error?"#DC2626":T.border}
            />
          </div>

          {/* Password */}
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:12.5,fontWeight:600,color:T.text2,marginBottom:6}}>Password</label>
            <div style={{position:"relative"}}>
              <input
                type={showPw?"text":"password"}
                value={password}
                onChange={e=>{setPassword(e.target.value);setError("");}}
                placeholder="Enter your password"
                style={{width:"100%",boxSizing:"border-box",border:`1.5px solid ${error?"#DC2626":T.border}`,borderRadius:8,padding:"10px 40px 10px 14px",fontSize:14,fontFamily:T.font,color:T.text,outline:"none",transition:"border .15s"}}
                onFocus={e=>e.target.style.borderColor=T.accent}
                onBlur={e=>e.target.style.borderColor=error?"#DC2626":T.border}
              />
              <button type="button" onClick={()=>setShowPw(p=>!p)}
                style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.text3,display:"flex",alignItems:"center",padding:4}}>
                {showPw
                  ? <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.6"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.6"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Error */}
          {error&&<div style={{background:"#FEE2E2",border:"1px solid #FECACA",borderRadius:8,padding:"9px 13px",fontSize:12.5,color:"#991B1B",marginBottom:16}}>{error}</div>}

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{width:"100%",background:loading?"#94A3B8":T.navy,color:"#fff",border:"none",borderRadius:8,padding:"11px",fontSize:14,fontWeight:600,fontFamily:T.font,cursor:loading?"not-allowed":"pointer",transition:"background .15s",letterSpacing:"-.1px"}}>
            {loading?"Signing in…":"Sign In"}
          </button>
        </form>

        <div style={{textAlign:"center",marginTop:20}}>
          <a href="mailto:support@careskillstraining.org" style={{fontSize:12.5,color:T.accent,textDecoration:"none"}}>Having trouble signing in?</a>
        </div>
      </div>

    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
// BUILD: v3 — storage keys reset, dropdown wizard step
export default function CSTApp() {
  const [authed, setAuthed]=useState(true); // login disabled temporarily
  const [ready, setReady]=useState(false);
  const [sidebarOpen, setSidebarOpen]=useState(false);
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

  const handleAuth=(username)=>{
    sessionStorage.setItem("cst:authed","1");
    setAuthed(true);
  };

  if(!authed) return <LoginScreen onAuth={handleAuth}/>;

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}
        input[type=number]{-moz-appearance:textfield;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .cst-sidebar{width:220px;flex-shrink:0;}
        .cst-hamburger{display:none;background:none;border:none;cursor:pointer;padding:6px;border-radius:6px;align-items:center;justify-content:center;}
        .cst-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99;}
        .cst-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
        .cst-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
        .cst-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .cst-pricing-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px;}
        .cst-table-scroll{overflow-x:auto!important;-webkit-overflow-scrolling:touch;}
        .cst-table-scroll table{min-width:560px;}
        @media(max-width:1100px){.cst-pricing-grid{grid-template-columns:repeat(2,1fr)!important;}}
        @media(max-width:900px){
          .cst-grid-4{grid-template-columns:repeat(2,1fr)!important;}
          .cst-grid-3{grid-template-columns:repeat(2,1fr)!important;}
          .cst-alerts-sub{grid-template-columns:1fr!important;}
        }
        @media(max-width:768px){
          .cst-sidebar{position:fixed!important;left:-240px;top:0;height:100vh;z-index:100;transition:left .25s ease;width:220px!important;}
          .cst-sidebar.open{left:0!important;}
          .cst-overlay.open{display:block!important;}
          .cst-hamburger{display:flex!important;}
          .cst-grid-4{grid-template-columns:repeat(2,1fr)!important;}
          .cst-grid-3{grid-template-columns:1fr!important;}
          .cst-grid-2{grid-template-columns:1fr!important;}
          .cst-pricing-grid{grid-template-columns:1fr!important;}
        }
        @media(max-width:480px){.cst-grid-4{grid-template-columns:1fr!important;}}
      `}</style>

      <Sidebar page={page} setPage={(p)=>{setPage(p);setSidebarOpen(false);}} learnerCount={learners.filter(l=>l.status!=="Deactivated").length} settings={settings} open={sidebarOpen} onClose={()=>setSidebarOpen(false)}/>

      <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:"100vh",overflowY:"auto"}}>
        {page!=="learners"&&<Topbar page={page} openInvite={()=>setShowInvite(true)} openAssign={()=>setShowAssign(true)} onMenuClick={()=>setSidebarOpen(o=>!o)}/>}

        {page==="dashboard"&&<PageDashboard {...commonProps} openInvite={()=>setShowInvite(true)} openAssign={()=>setShowAssign(true)} setReportCourse={setReportCourse}/>}
        {page==="learners"&&<PageLearners {...commonProps} courses={courses} setLearners={setLearners} openInvite={()=>setShowInvite(true)} openAssign={()=>setShowAssign(true)}/>}
        {page==="invite"&&<div style={{padding:"24px 28px",maxWidth:600}}><div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,padding:24}}><div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Invite Learners</div><div style={{fontSize:13,color:T.text3,marginBottom:20}}>Click the button below to open the invite dialog.</div><Btn variant="primary" onClick={()=>setShowInvite(true)}>Open Invite Dialog</Btn></div></div>}
        {page==="courses"&&<PageCourses {...commonProps} openAssign={()=>setShowAssign(true)} setReportCourse={setReportCourse}/>}
        {page==="assigned"&&<PageAssigned {...commonProps} openAssign={()=>setShowAssign(true)}/>}
        {page==="certs"&&<PageCerts {...commonProps} setCerts={setCerts} setSettings={setSettings}/>}
        {page==="reports"&&<PageReports {...commonProps} initialCourseId={reportCourse} clearReportCourse={()=>setReportCourse(null)}/>}
        {page==="pricing"&&<PageSubscription {...commonProps} setSettings={setSettings}/>}
        {page==="settings"&&<PageSettings {...commonProps} setSettings={setSettings} resetOnboarding={resetOnboarding}/>}
        {page==="billing"&&<PageBilling showToast={showToast}/>}
      </div>

      <InviteModal open={showInvite} onClose={()=>setShowInvite(false)} learners={learners} setLearners={setLearners} settings={settings} showToast={showToast} setPage={setPage}/>
      <AssignModal open={showAssign} onClose={()=>setShowAssign(false)} courses={courses} setCourses={setCourses} learners={learners} setLearners={setLearners} settings={settings} showToast={showToast} setPage={setPage}/>

      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
}
