import { useState, useRef } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const POLES = [
  { id:"bar", label:"Bar", color:"#b45309", light:"#fef3c7", dark:"#92400e" },
  { id:"merch", label:"Merch", color:"#5b21b6", light:"#ede9fe", dark:"#4c1d95" },
  { id:"entree", label:"Entrée", color:"#1d4ed8", light:"#dbeafe", dark:"#1e3a8a" },
  { id:"parking", label:"Parking", color:"#854d0e", light:"#fef9c3", dark:"#713f12" },
  { id:"brigade", label:"Brigade Verte", color:"#15803d", light:"#dcfce7", dark:"#14532d" },
];

const STATUTS_BEN = [
  { id:"nouveau", label:"🆕 Nouveau", color:"#6366f1" },
  { id:"pas_contacte", label:"📋 Pas contacté", color:"#64748b" },
  { id:"en_discussion", label:"💬 En discussion", color:"#f59e0b" },
  { id:"dispo", label:"✅ Dispo", color:"#22c55e" },
  { id:"pas_dispo", label:"❌ Pas dispo", color:"#ef4444" },
  { id:"ne_sait_pas", label:"❓ Ne sait pas", color:"#8b5cf6" },
  { id:"ancien", label:"🗄️ Ancien", color:"#94a3b8" },
  { id:"banni", label:"🚫 Banni", color:"#dc2626" },
];

const STATUT_CR = {
  validé:  { bg:"#dcfce7", text:"#14532d", dot:"#22c55e", label:"✓ Validé" },
  envoyé:  { bg:"#fef9c3", text:"#713f12", dot:"#eab308", label:"⏳ Envoyé" },
  assigné: { bg:"#f1f5f9", text:"#475569", dot:"#94a3b8", label:"· Assigné" },
  vide:    { bg:"#fee2e2", text:"#991b1b", dot:"#ef4444", label:"Vide" },
};

const hLabel = h => {
  const r = h % 24;
  return `${String(Math.floor(r)).padStart(2,"0")}h${h%1?"30":""}`;
};

const fmtTel = t => t.replace(/\s/g,"").replace(/^0/,"33");

// ─── DONNÉES INIT ─────────────────────────────────────────────────────────────
const INIT_BENS = [
  { id:1,  nom:"Matou",          tel:"06 XX XX XX XX", email:"", poles:["bar"],            statut:"dispo", estRef:false, contraintes:"Pas avant 19h",             commentaires:[{date:"2026-02-21",event:"TWF 2026",texte:"Super impliqué, a fait un shift de plus"}] },
  { id:2,  nom:"Coulcoul",       tel:"06 XX XX XX XX", email:"", poles:["bar"],            statut:"dispo", estRef:false, contraintes:"",                           commentaires:[] },
  { id:3,  nom:"Victor",         tel:"06 XX XX XX XX", email:"", poles:["bar"],            statut:"dispo", estRef:true,  contraintes:"",                           commentaires:[{date:"2025-07-10",event:"Open Mind 2025",texte:"Très bon référent"}] },
  { id:4,  nom:"Valou",          tel:"06 XX XX XX XX", email:"", poles:["bar"],            statut:"dispo", estRef:false, contraintes:"Veut être avec Coulcoul",    commentaires:[] },
  { id:5,  nom:"Mélissa",        tel:"06 XX XX XX XX", email:"", poles:["merch"],          statut:"dispo", estRef:true,  contraintes:"",                           commentaires:[] },
  { id:6,  nom:"Camille",        tel:"06 XX XX XX XX", email:"", poles:["merch"],          statut:"dispo", estRef:false, contraintes:"Veut voir l'artiste 23h",    commentaires:[] },
  { id:7,  nom:"Roxane",         tel:"06 XX XX XX XX", email:"", poles:["merch"],          statut:"dispo", estRef:false, contraintes:"",                           commentaires:[] },
  { id:8,  nom:"Théo LG",        tel:"06 XX XX XX XX", email:"", poles:["entree"],         statut:"dispo", estRef:true,  contraintes:"",                           commentaires:[] },
  { id:9,  nom:"Bilel",          tel:"06 XX XX XX XX", email:"", poles:["entree"],         statut:"dispo", estRef:false, contraintes:"",                           commentaires:[] },
  { id:10, nom:"Théo DA",        tel:"06 XX XX XX XX", email:"", poles:["entree"],         statut:"en_discussion", estRef:false, contraintes:"",                   commentaires:[] },
  { id:11, nom:"Margot",         tel:"06 XX XX XX XX", email:"", poles:["entree"],         statut:"dispo", estRef:false, contraintes:"Pas après 2h",               commentaires:[] },
  { id:12, nom:"Floriant Castex",tel:"06 XX XX XX XX", email:"", poles:["parking"],        statut:"dispo", estRef:true,  contraintes:"",                           commentaires:[] },
  { id:13, nom:"Cyril Meillon",  tel:"06 XX XX XX XX", email:"", poles:["parking"],        statut:"dispo", estRef:false, contraintes:"",                           commentaires:[] },
  { id:14, nom:"Lola",           tel:"06 XX XX XX XX", email:"", poles:["brigade"],        statut:"dispo", estRef:true,  contraintes:"",                           commentaires:[] },
  { id:15, nom:"Enzo Castant",   tel:"0668604173",     email:"enzocastant@gmail.com", poles:["bar","entree"], statut:"banni", estRef:false, contraintes:"",        commentaires:[{date:"2025-11-27",event:"Revenge Birthday 2025",texte:"BANNI - a volé des vestes"}] },
];

const makePlanning = () => ({
  bar:[
    {id:"bar-1",debut:19,fin:21,places:[{id:"p1",benevoleId:1,statut:"vide"},{id:"p2",benevoleId:2,statut:"vide"},{id:"p3",benevoleId:null,statut:"vide"}]},
    {id:"bar-2",debut:20,fin:22,places:[{id:"p4",benevoleId:2,statut:"vide"},{id:"p5",benevoleId:null,statut:"vide"}]},
    {id:"bar-3",debut:21,fin:23,places:[{id:"p6",benevoleId:4,statut:"vide"},{id:"p7",benevoleId:1,statut:"vide"}]},
    {id:"bar-4",debut:22,fin:24,places:[{id:"p8",benevoleId:1,statut:"vide"},{id:"p9",benevoleId:2,statut:"vide"}]},
    {id:"bar-5",debut:23,fin:25,places:[{id:"p10",benevoleId:2,statut:"vide"},{id:"p11",benevoleId:null,statut:"vide"}]},
    {id:"bar-6",debut:24,fin:26,places:[{id:"p12",benevoleId:4,statut:"vide"}]},
    {id:"bar-7",debut:25,fin:27,places:[{id:"p13",benevoleId:1,statut:"vide"}]},
    {id:"bar-8",debut:26,fin:28.5,places:[{id:"p14",benevoleId:null,statut:"vide"},{id:"p15",benevoleId:null,statut:"vide"}]},
  ],
  merch:[
    {id:"merch-1",debut:21,fin:22.5,places:[{id:"p20",benevoleId:6,statut:"vide"},{id:"p21",benevoleId:null,statut:"vide"}]},
    {id:"merch-2",debut:22.5,fin:24,places:[{id:"p22",benevoleId:7,statut:"vide"}]},
    {id:"merch-3",debut:24,fin:25.5,places:[{id:"p23",benevoleId:6,statut:"vide"}]},
    {id:"merch-4",debut:25.5,fin:27,places:[{id:"p24",benevoleId:7,statut:"vide"},{id:"p25",benevoleId:null,statut:"vide"}]},
    {id:"merch-5",debut:27,fin:28.5,places:[{id:"p26",benevoleId:null,statut:"vide"}]},
  ],
  entree:[
    {id:"ent-1",debut:20,fin:22,places:[{id:"p30",benevoleId:9,statut:"vide"},{id:"p31",benevoleId:10,statut:"vide"}]},
    {id:"ent-2",debut:21,fin:23,places:[{id:"p32",benevoleId:9,statut:"vide"},{id:"p33",benevoleId:null,statut:"vide"}]},
    {id:"ent-3",debut:22,fin:24,places:[{id:"p34",benevoleId:10,statut:"vide"}]},
    {id:"ent-4",debut:23,fin:25,places:[{id:"p35",benevoleId:11,statut:"vide"}]},
    {id:"ent-5",debut:24,fin:26,places:[{id:"p36",benevoleId:9,statut:"vide"}]},
    {id:"ent-6",debut:25,fin:27,places:[{id:"p37",benevoleId:11,statut:"vide"}]},
  ],
  parking:[
    {id:"park-1",debut:15,fin:19,places:[{id:"p40",benevoleId:13,statut:"vide"},{id:"p41",benevoleId:null,statut:"vide"}]},
    {id:"park-2",debut:19,fin:22,places:[{id:"p42",benevoleId:13,statut:"vide"}]},
    {id:"park-3",debut:21.75,fin:23.75,places:[{id:"p43",benevoleId:null,statut:"vide"}]},
    {id:"park-4",debut:23.5,fin:25.5,places:[{id:"p44",benevoleId:13,statut:"vide"}]},
    {id:"park-5",debut:25.25,fin:27.25,places:[{id:"p45",benevoleId:null,statut:"vide"}]},
    {id:"park-6",debut:27,fin:29,places:[{id:"p46",benevoleId:13,statut:"vide"}]},
  ],
  brigade:[
    {id:"brig-1",debut:14,fin:17,places:[{id:"p50",benevoleId:null,statut:"vide"}]},
    {id:"brig-2",debut:17,fin:20,places:[{id:"p51",benevoleId:null,statut:"vide"}]},
    {id:"brig-3",debut:24,fin:26,places:[{id:"p52",benevoleId:null,statut:"vide"}]},
  ],
});

// Planning référents séparé : { poleId: [{id, debut, fin, benevoleId, statut}] }
const makeRefPlanning = () => ({
  bar:     [{id:"rb1",debut:19,fin:28.5,benevoleId:3,statut:"vide"}],
  merch:   [{id:"rm1",debut:21,fin:28.5,benevoleId:5,statut:"vide"}],
  entree:  [{id:"re1",debut:20,fin:27,benevoleId:8,statut:"vide"}],
  parking: [{id:"rp1",debut:15,fin:29,benevoleId:12,statut:"vide"}],
  brigade: [{id:"rbr1",debut:14,fin:26,benevoleId:14,statut:"vide"}],
});

const INIT_EVENT = {
  id:"evt-1", nom:"TechnoWinter Festival 2026", nbJours:2, jours:["vendredi","samedi"],
  planning:{ vendredi:makePlanning(), samedi:{bar:[],merch:[],entree:[],parking:[],brigade:[]} },
  refPlanning:{ vendredi:makeRefPlanning(), samedi:{bar:[],merch:[],entree:[],parking:[],brigade:[]} },
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const inp = { width:"100%",border:"1.5px solid #e2e8f0",borderRadius:8,padding:"8px 12px",fontSize:14,marginBottom:12,outline:"none",boxSizing:"border-box",fontFamily:"inherit",background:"#f8fafc" };
const lbl = { display:"block",fontWeight:700,fontSize:11,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:0.5 };
const btn = (bg,color,extra={}) => ({ border:"none",borderRadius:8,padding:"9px 16px",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit",background:bg,color,...extra });

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ onClose, children, width=400 }) {
  return (
    <div style={{position:"fixed",inset:0,background:"#0009",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:16,width,maxWidth:"95vw",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 12px 60px #0004"}} onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ─── WHATSAPP HELPERS ─────────────────────────────────────────────────────────
const buildConfirmMsg = (nom, creneaux, eventNom) => {
  const lignes = creneaux.map(c=>`  • ${c.pole} : ${hLabel(c.debut)}–${hLabel(c.fin)}`).join("\n");
  return `Salut ${nom} ! 👋\n\nVoici tes horaires pour ${eventNom} :\n${lignes}\n\nEst-ce que ces horaires te conviennent ? Réponds-moi par OUI ou dis-moi si tu as un souci 🙏`;
};

const openWA = (tel, msg) => {
  const url = `https://wa.me/${fmtTel(tel)}?text=${encodeURIComponent(msg)}`;
  window.open(url,"_blank");
};

// ─── PLANNING RÉFÉRENTS TIMELINE ──────────────────────────────────────────────
function RefTimeline({ refPlanning, benevoles, jour, onAddRef, onClickRef }) {
  const MIN_H=14, MAX_H=30, TOTAL=MAX_H-MIN_H;
  const getB=id=>benevoles.find(b=>b.id===id);
  const heures=Array.from({length:MAX_H-MIN_H+1},(_,i)=>i+MIN_H);
  const refs=benevoles.filter(b=>b.estRef);

  return (
    <div style={{background:"#fff",borderRadius:12,padding:16,boxShadow:"0 1px 6px #0001",marginBottom:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{fontWeight:800,fontSize:15,color:"#1e293b",display:"flex",alignItems:"center",gap:8}}>
          ★ Planning Référents
          <span style={{fontSize:12,color:"#64748b",fontWeight:500}}>({refs.length} référent{refs.length>1?"s":""})</span>
        </div>
        <button onClick={onAddRef} style={{...btn("#0f172a","#fff"),padding:"6px 12px",fontSize:12}}>+ Ajouter un créneau ref</button>
      </div>
      <div style={{overflowX:"auto"}}>
        <div style={{minWidth:750}}>
          {/* Axe horaire */}
          <div style={{display:"flex",marginLeft:116,marginBottom:4}}>
            {heures.map(h=>(
              <div key={h} style={{flex:1,fontSize:10,color:"#94a3b8",fontWeight:700,fontFamily:"monospace",textAlign:"center",borderLeft:"1px solid #f1f5f9"}}>
                {hLabel(h)}
              </div>
            ))}
          </div>
          {/* Ligne par pôle */}
          {POLES.map(pole=>{
            const creneaux=(refPlanning[pole.id]||[]);
            return (
              <div key={pole.id} style={{display:"flex",alignItems:"center",marginBottom:4}}>
                <div style={{width:116,minWidth:116,background:pole.color,color:"#fff",borderRadius:"8px 0 0 8px",padding:"0 10px",height:40,display:"flex",alignItems:"center",fontWeight:800,fontSize:12,flexShrink:0}}>
                  {pole.label}
                </div>
                <div style={{flex:1,position:"relative",height:40,background:pole.light,borderRadius:"0 8px 8px 0",overflow:"hidden"}}>
                  {heures.map(h=>(
                    <div key={h} style={{position:"absolute",left:`${((h-MIN_H)/TOTAL)*100}%`,top:0,bottom:0,borderLeft:"1px solid #0000000a",pointerEvents:"none"}}/>
                  ))}
                  {creneaux.map(c=>{
                    const b=getB(c.benevoleId);
                    const cfg=STATUT_CR[c.statut]||STATUT_CR.vide;
                    const x=((Math.max(c.debut,MIN_H)-MIN_H)/TOTAL)*100;
                    const w=((Math.min(c.fin,MAX_H)-Math.max(c.debut,MIN_H))/TOTAL)*100;
                    return (
                      <div key={c.id} onClick={()=>onClickRef(c,pole)}
                        style={{position:"absolute",left:`${x}%`,width:`${w}%`,top:4,bottom:4,background:b?cfg.bg:"#fff",border:`2px solid ${b?pole.color+"88":"#fca5a5"}`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",boxSizing:"border-box"}}>
                        <span style={{fontSize:11,fontWeight:800,color:b?cfg.text:"#fca5a5",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",padding:"0 6px"}}>
                          {b?b.nom:"— vide —"}
                        </span>
                        {b&&<div style={{width:5,height:5,borderRadius:99,background:cfg.dot,flexShrink:0,marginRight:4}}/>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{display:"flex",gap:12,marginTop:10,flexWrap:"wrap"}}>
        {Object.entries(STATUT_CR).map(([k,v])=>(
          <div key={k} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#64748b"}}>
            <div style={{width:7,height:7,borderRadius:99,background:v.dot}}/><span style={{textTransform:"capitalize"}}>{k}</span>
          </div>
        ))}
        <span style={{fontSize:11,color:"#94a3b8",marginLeft:"auto"}}>Cliquer sur un bloc pour modifier</span>
      </div>
    </div>
  );
}

// ─── MODAL CRÉNEAU RÉFÉRENT ───────────────────────────────────────────────────
function ModalRefCreneau({ creneau, pole, setPole, benevoles, onClose, onSave, onDelete, isNew, eventNom, onSent }) {
  const [poleId, setPoleId] = useState(pole?.id||"bar");
  const [debut, setDebut] = useState(creneau?.debut??19);
  const [fin, setFin] = useState(creneau?.fin??28);
  const [bid, setBid] = useState(creneau?.benevoleId??null);
  const [statut, setStatut] = useState(creneau?.benevoleId?(creneau?.statut??"assigné"):"vide");

  const currentPole = POLES.find(p=>p.id===poleId)||POLES[0];
  const refs = benevoles.filter(b=>b.estRef && b.poles.includes(poleId));

  const b = benevoles.find(b=>b.id===bid);
  const creneauxMsg = bid ? [{pole:currentPole.label,debut,fin}] : [];
  const waMsg = b ? buildConfirmMsg(b.nom, creneauxMsg, eventNom) : "";

  const handleSend = () => {
    if(!b)return;
    openWA(b.tel, waMsg);
    onSent && onSent(bid);
    onSave({...creneau, poleId, debut, fin, benevoleId:bid, statut:"envoyé"});
  };

  return (
    <Modal onClose={onClose} width={380}>
      <div style={{padding:24}}>
        <h3 style={{margin:"0 0 18px",fontWeight:800,fontSize:17,color:"#1e293b"}}>{isNew?"Nouveau créneau référent":"Modifier créneau référent"}</h3>
        {isNew&&<><label style={lbl}>Pôle</label>
          <select value={poleId} onChange={e=>setPoleId(e.target.value)} style={inp}>
            {POLES.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
          </select></>}
        <label style={lbl}>Début</label>
        <select value={debut} onChange={e=>setDebut(Number(e.target.value))} style={inp}>
          {Array.from({length:33},(_,i)=>i+14).map(h=><option key={h} value={h}>{hLabel(h)}</option>)}
        </select>
        <label style={lbl}>Fin</label>
        <select value={fin} onChange={e=>setFin(Number(e.target.value))} style={inp}>
          {Array.from({length:33},(_,i)=>i+14).map(h=><option key={h} value={h}>{hLabel(h)}</option>)}
        </select>
        <label style={lbl}>Référent</label>
        <select value={bid||""} onChange={e=>setBid(e.target.value?Number(e.target.value):null)} style={inp}>
          <option value="">— non assigné —</option>
          {refs.map(b=><option key={b.id} value={b.id}>{b.nom}</option>)}
          {refs.length===0&&<option disabled>Aucun référent sur ce pôle</option>}
        </select>
        <label style={lbl}>Statut</label>
        <select value={statut} onChange={e=>setStatut(e.target.value)} style={inp}>
          <option value="assigné">· Assigné (pas encore envoyé)</option>
          <option value="envoyé">⏳ Envoyé</option>
          <option value="validé">✓ Validé</option>
          <option value="vide">Vide</option>
        </select>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
          {bid&&b?.tel&&(
            <button onClick={handleSend} style={{...btn("#25d366","#fff"),display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              📱 Envoyer confirmation WhatsApp → passe en "Envoyé"
            </button>
          )}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>onSave({...creneau,poleId,debut,fin,benevoleId:bid,statut:bid?(statut==="vide"?"assigné":statut):"vide"})} style={{...btn(currentPole.color,"#fff"),flex:1}}>{isNew?"Ajouter":"Enregistrer"}</button>
            {!isNew&&<button onClick={onDelete} style={btn("#fee2e2","#b91c1c")}>🗑</button>}
            <button onClick={onClose} style={btn("#f1f5f9","#475569")}>Annuler</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── MODAL ASSIGNER BÉNÉVOLE ─────────────────────────────────────────────────
function ModalAssigner({ place, creneau, pole, benevoles, eventNom, onClose, onSave, onStatutChange }) {
  const [bid, setBid] = useState(place.benevoleId??null);
  const [statut, setStatut] = useState(place.statut==="vide"||place.statut==="assigné"?"assigné":place.statut);

  // Seuls les bénévoles dispo, non référents, sur ce pôle
  const dispos = benevoles.filter(b=>b.poles.includes(pole.id)&&b.statut==="dispo"&&!b.estRef);
  const b = benevoles.find(b=>b.id===bid);

  const creneauxMsg = bid ? [{pole:pole.label,debut:creneau.debut,fin:creneau.fin}] : [];
  const waMsg = b ? buildConfirmMsg(b.nom, creneauxMsg, eventNom) : "";

  const handleSend = () => {
    if(!b)return;
    openWA(b.tel, waMsg);
    onSave({...place, benevoleId:bid||null, statut:"envoyé"});
  };

  return (
    <Modal onClose={onClose} width={360}>
      <div style={{padding:24}}>
        <h3 style={{margin:"0 0 4px",fontWeight:800,fontSize:16,color:"#1e293b"}}>Assigner un bénévole</h3>
        <p style={{margin:"0 0 16px",fontSize:13,color:"#64748b"}}>{pole.label} · {hLabel(creneau.debut)}–{hLabel(creneau.fin)}</p>
        <label style={lbl}>Bénévole (dispo uniquement)</label>
        <select value={bid||""} onChange={e=>setBid(e.target.value?Number(e.target.value):null)} style={inp}>
          <option value="">— poste vide —</option>
          {dispos.map(b=>(
            <option key={b.id} value={b.id}>{b.nom}{b.contraintes?` ⚠ ${b.contraintes}`:""}</option>
          ))}
        </select>
        {dispos.length===0&&<p style={{fontSize:12,color:"#94a3b8",margin:"-8px 0 12px"}}>Aucun bénévole disponible sur ce pôle pour l'instant.</p>}
        <label style={lbl}>Statut</label>
        <select value={statut} onChange={e=>setStatut(e.target.value)} style={inp}>
          <option value="assigné">· Assigné (pas encore envoyé)</option>
          <option value="envoyé">⏳ Envoyé</option>
          <option value="validé">✓ Validé</option>
          <option value="vide">Vide</option>
        </select>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
          {bid&&b?.tel&&(
            <button onClick={handleSend} style={{...btn("#25d366","#fff"),display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              📱 Envoyer confirmation WhatsApp → passe en "Envoyé"
            </button>
          )}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>onSave({...place,benevoleId:bid||null,statut:bid?(statut==="vide"?"assigné":statut):"vide"})} style={{...btn(pole.color,"#fff"),flex:1}}>Enregistrer sans envoyer</button>
            <button onClick={onClose} style={btn("#f1f5f9","#475569")}>Annuler</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── MODAL CRÉNEAU BÉNÉVOLE ───────────────────────────────────────────────────
function ModalCreneau({ creneau, pole, benevoles, onClose, onSave, onDelete, isNew }) {
  const [debut, setDebut] = useState(creneau?.debut??20);
  const [fin, setFin] = useState(creneau?.fin??22);
  const [nbPlaces, setNbPlaces] = useState(creneau?.places?.length??2);
  return (
    <Modal onClose={onClose} width={360}>
      <div style={{padding:24}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
          <div style={{width:12,height:12,borderRadius:3,background:pole.color}}/>
          <h3 style={{margin:0,fontWeight:800,fontSize:17,color:"#1e293b"}}>{isNew?"Nouveau créneau":"Modifier"} — {pole.label}</h3>
        </div>
        <label style={lbl}>Début</label>
        <select value={debut} onChange={e=>setDebut(Number(e.target.value))} style={inp}>
          {Array.from({length:33},(_,i)=>i+14).map(h=><option key={h} value={h}>{hLabel(h)}</option>)}
        </select>
        <label style={lbl}>Fin</label>
        <select value={fin} onChange={e=>setFin(Number(e.target.value))} style={inp}>
          {Array.from({length:33},(_,i)=>i+14).map(h=><option key={h} value={h}>{hLabel(h)}</option>)}
        </select>
        <label style={lbl}>Nombre de places</label>
        <div style={{display:"flex",gap:6,marginBottom:16}}>
          {[1,2,3,4,5,6].map(n=>(
            <button key={n} onClick={()=>setNbPlaces(n)} style={{...btn(nbPlaces===n?pole.color:"#f1f5f9",nbPlaces===n?"#fff":"#475569"),flex:1,padding:"8px 0"}}>
              {n}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{
            let places;
            if(isNew){
              places=Array.from({length:nbPlaces},(_,i)=>({id:`p-${Date.now()}-${i}`,benevoleId:null,statut:"vide"}));
            } else {
              const curr=creneau.places||[];
              if(nbPlaces>curr.length) places=[...curr,...Array.from({length:nbPlaces-curr.length},(_,i)=>({id:`p-${Date.now()}-${i}`,benevoleId:null,statut:"vide"}))];
              else places=curr.slice(0,nbPlaces);
            }
            onSave({...creneau,debut,fin,places});
          }} style={{...btn(pole.color,"#fff"),flex:1}}>{isNew?"Ajouter":"Enregistrer"}</button>
          {!isNew&&<button onClick={onDelete} style={btn("#fee2e2","#b91c1c")}>🗑</button>}
          <button onClick={onClose} style={btn("#f1f5f9","#475569")}>Annuler</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── PLANNING BÉNÉVOLES LISTE ─────────────────────────────────────────────────
function PlanningBenListe({ planning, benevoles, pole, onEditCreneau, onAssigner, modePrePlanning }) {
  const creneaux=planning[pole.id]||[];
  const getB=id=>benevoles.find(b=>b.id===id);
  const totalVides=creneaux.flatMap(c=>c.places).filter(p=>p.statut==="vide"&&!p.benevoleId).length;

  return (
    <div style={{marginBottom:20}}>
      <div style={{background:pole.color,color:"#fff",borderRadius:"10px 10px 0 0",padding:"9px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontWeight:800,fontSize:14}}>{pole.label}</span>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {totalVides>0&&<span style={{background:"rgba(255,255,255,0.2)",borderRadius:99,padding:"1px 8px",fontSize:11,fontWeight:700,color:"#fca5a5"}}>{totalVides} vide{totalVides>1?"s":""}</span>}
          <button onClick={()=>onEditCreneau(null,pole)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,padding:"2px 10px",cursor:"pointer",fontWeight:800,fontSize:15}}>+</button>
        </div>
      </div>
      <div style={{background:pole.light,borderRadius:"0 0 10px 10px",padding:"10px 10px 12px"}}>
        {creneaux.length===0&&<p style={{color:"#94a3b8",fontSize:13,fontStyle:"italic",margin:0}}>Aucun créneau</p>}
        {creneaux.map(creneau=>(
          <div key={creneau.id} style={{display:"flex",alignItems:"stretch",gap:8,marginBottom:8}}>
            {/* Horaire */}
            <div onClick={()=>onEditCreneau(creneau,pole)} style={{minWidth:84,background:pole.color+"22",border:`1.5px solid ${pole.color}44`,borderRadius:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:"6px 8px",flexShrink:0}}>
              <span style={{fontFamily:"monospace",fontWeight:800,fontSize:11,color:pole.dark,textAlign:"center",lineHeight:1.3}}>
                {hLabel(creneau.debut)}<br/>–{hLabel(creneau.fin)}
              </span>
              <span style={{fontSize:9,color:pole.color,marginTop:2,fontWeight:600}}>{creneau.places.length}p</span>
            </div>
            {/* Cases */}
            <div style={{display:"flex",gap:5,flexWrap:"wrap",flex:1,alignItems:"center"}}>
              {creneau.places.map(place=>{
                const b=getB(place.benevoleId);
                const cfg=STATUT_CR[place.statut];
                if(modePrePlanning){
                  return (
                    <div key={place.id} onClick={()=>onAssigner(place,creneau,pole)}
                      style={{minWidth:72,flex:1,maxWidth:130,background:"#fff",border:`2px dashed ${pole.color}88`,borderRadius:8,padding:"10px 6px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:pole.color,fontWeight:900,fontSize:18}}>—</div>
                  );
                }
                return (
                  <div key={place.id} onClick={()=>onAssigner(place,creneau,pole)}
                    style={{minWidth:72,flex:1,maxWidth:140,background:b?cfg.bg:"#fff",border:`2px solid ${b?pole.color+"55":"#fca5a5"}`,borderRadius:8,padding:"7px 8px",cursor:"pointer",display:"flex",flexDirection:"column",gap:3}}>
                    <span style={{fontWeight:800,fontSize:12,color:b?cfg.text:"#fca5a5",fontStyle:b?"normal":"italic",lineHeight:1.2}}>
                      {b?b.nom:"— vide —"}
                    </span>
                    <div style={{display:"flex",alignItems:"center",gap:3}}>
                      <div style={{width:5,height:5,borderRadius:99,background:cfg.dot,flexShrink:0}}/>
                      <span style={{fontSize:9,color:cfg.text,fontWeight:600}}>{cfg.label}</span>
                    </div>
                    {b?.contraintes&&<span style={{fontSize:9,color:"#92400e",background:"#fffbeb",borderRadius:3,padding:"1px 4px",lineHeight:1.2}}>⚠ {b.contraintes}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ENVOI GROUPÉ ─────────────────────────────────────────────────────────────
function EnvoiGroupe({ planning, benevoles, eventNom, jours, onSent, onClose }) {
  const getB=id=>benevoles.find(b=>b.id===id);
  // Regrouper par bénévole
  const parBen = {};
  jours.forEach(jour=>{
    POLES.forEach(pole=>{
      (planning[jour]?.[pole.id]||[]).forEach(c=>{
        c.places.filter(p=>p.benevoleId).forEach(p=>{
          if(!parBen[p.benevoleId]) parBen[p.benevoleId]={creneaux:[]};
          parBen[p.benevoleId].creneaux.push({pole:pole.label,debut:c.debut,fin:c.fin,jour,placeId:p.id,poleId:pole.id});
        });
      });
    });
  });
  const bens=Object.keys(parBen).map(id=>({b:getB(Number(id)),...parBen[id]})).filter(x=>x.b&&x.b.tel&&x.b.statut!=="banni");

  return (
    <Modal onClose={onClose} width={480}>
      <div style={{padding:24}}>
        <h3 style={{margin:"0 0 4px",fontWeight:800,fontSize:18,color:"#1e293b"}}>📤 Envoi groupé</h3>
        <p style={{margin:"0 0 20px",fontSize:13,color:"#64748b"}}>{bens.length} bénévole{bens.length>1?"s":""} avec des créneaux assignés</p>
        <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:"60vh",overflowY:"auto"}}>
          {bens.map(({b,creneaux})=>{
            const msg=buildConfirmMsg(b.nom,creneaux,eventNom);
            return (
              <div key={b.id} style={{background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,fontSize:14,color:"#1e293b"}}>{b.nom}</div>
                  <div style={{fontSize:12,color:"#64748b"}}>{creneaux.length} créneau{creneaux.length>1?"x":""}</div>
                </div>
                <button onClick={()=>{openWA(b.tel,msg);onSent(b.id);}} style={{...btn("#25d366","#fff"),padding:"7px 14px",fontSize:12,whiteSpace:"nowrap"}}>
                  📱 WhatsApp
                </button>
              </div>
            );
          })}
        </div>
        <p style={{fontSize:12,color:"#94a3b8",marginTop:14,marginBottom:0}}>Chaque bouton ouvre WhatsApp avec le message pré-rédigé. Le statut passe automatiquement en "Envoyé".</p>
      </div>
    </Modal>
  );
}

// ─── FICHE BÉNÉVOLE ───────────────────────────────────────────────────────────
function FicheBenevole({ benevole, onClose, onSave }) {
  const [d,setD]=useState({...benevole});
  const [nc,setNc]=useState({event:"",texte:""});
  const set=(k,v)=>setD(p=>({...p,[k]:v}));
  const addC=()=>{if(!nc.texte)return;setD(p=>({...p,commentaires:[...p.commentaires,{date:new Date().toISOString().slice(0,10),event:nc.event,texte:nc.texte}]}));setNc({event:"",texte:""});};
  const togglePole=pid=>setD(p=>({...p,poles:p.poles.includes(pid)?p.poles.filter(x=>x!==pid):[...p.poles,pid]}));

  return (
    <Modal onClose={onClose} width={480}>
      <div style={{background:d.statut==="banni"?"#7f1d1d":"#0f172a",color:"#fff",borderRadius:"16px 16px 0 0",padding:"18px 22px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontWeight:900,fontSize:19}}>{d.nom}</div>
          <div style={{fontSize:12,opacity:0.6,marginTop:2}}>{d.tel}</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:8}}>
            {d.poles.map(pid=>{const p=POLES.find(p=>p.id===pid);return p?<span key={pid} style={{background:p.color,borderRadius:99,padding:"2px 8px",fontSize:10,fontWeight:700}}>{p.label}</span>:null;})}
            {d.estRef&&<span style={{background:"#f59e0b",borderRadius:99,padding:"2px 8px",fontSize:10,fontWeight:700,color:"#1e293b"}}>★ Référent</span>}
          </div>
        </div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontWeight:700}}>✕</button>
      </div>
      <div style={{padding:20,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div><label style={lbl}>Nom</label><input value={d.nom} onChange={e=>set("nom",e.target.value)} style={inp}/></div>
          <div><label style={lbl}>Téléphone</label><input value={d.tel} onChange={e=>set("tel",e.target.value)} style={inp}/></div>
          <div style={{gridColumn:"1/-1"}}><label style={lbl}>Email</label><input value={d.email} onChange={e=>set("email",e.target.value)} style={inp}/></div>
        </div>
        {/* Pôles multi-select */}
        <div>
          <label style={lbl}>Pôles</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {POLES.map(p=>(
              <button key={p.id} onClick={()=>togglePole(p.id)} style={{...btn(d.poles.includes(p.id)?p.color:"#f1f5f9",d.poles.includes(p.id)?"#fff":"#475569"),padding:"6px 12px",fontSize:12}}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div><label style={lbl}>Statut</label>
          <select value={d.statut} onChange={e=>set("statut",e.target.value)} style={inp}>
            {STATUTS_BEN.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontWeight:700,fontSize:14,color:"#1e293b"}}>
          <input type="checkbox" checked={d.estRef} onChange={e=>set("estRef",e.target.checked)} style={{width:16,height:16}}/>★ Référent de pôle
        </label>
        <div style={{background:"#fffbeb",border:"1.5px solid #fde68a",borderRadius:10,padding:12}}>
          <label style={{...lbl,color:"#92400e"}}>⚠ Contraintes planning</label>
          <textarea value={d.contraintes} onChange={e=>set("contraintes",e.target.value)} style={{...inp,marginBottom:0,minHeight:54,resize:"vertical"}} placeholder="Ex: Pas avant 20h, veut être avec X..."/>
        </div>
        {/* Historique */}
        <div>
          <div style={{fontWeight:800,fontSize:14,color:"#1e293b",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
            💬 Historique <span style={{background:"#e2e8f0",borderRadius:99,padding:"1px 8px",fontSize:12,fontWeight:700,color:"#475569"}}>{d.commentaires.length}</span>
          </div>
          {d.commentaires.map((c,i)=>(
            <div key={i} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"9px 11px",marginBottom:7,position:"relative"}}>
              <div style={{display:"flex",gap:7,marginBottom:4}}>
                <span style={{fontSize:11,fontWeight:700,color:"#6366f1",background:"#eef2ff",borderRadius:4,padding:"1px 6px"}}>{c.event||"Sans événement"}</span>
                <span style={{fontSize:11,color:"#94a3b8"}}>{c.date}</span>
              </div>
              <div style={{fontSize:13,color:"#334155",lineHeight:1.5}}>{c.texte}</div>
              <button onClick={()=>setD(p=>({...p,commentaires:p.commentaires.filter((_,j)=>j!==i)}))} style={{position:"absolute",top:8,right:8,background:"none",border:"none",cursor:"pointer",color:"#cbd5e1",fontSize:13}}>✕</button>
            </div>
          ))}
          <div style={{background:"#f0fdf4",border:"1.5px dashed #86efac",borderRadius:10,padding:11}}>
            <label style={{...lbl,color:"#166534"}}>Événement</label>
            <input value={nc.event} onChange={e=>setNc(n=>({...n,event:e.target.value}))} style={{...inp,marginBottom:8}} placeholder="Ex: TWF 2026..."/>
            <label style={{...lbl,color:"#166534"}}>Commentaire</label>
            <textarea value={nc.texte} onChange={e=>setNc(n=>({...n,texte:e.target.value}))} style={{...inp,marginBottom:8,minHeight:54,resize:"vertical"}} placeholder="Note sur ce bénévole..."/>
            <button onClick={addC} style={{...btn("#16a34a","#fff"),width:"100%"}}>+ Ajouter</button>
          </div>
        </div>
        {d.tel&&d.statut!=="banni"&&(
          <a href={`https://wa.me/${fmtTel(d.tel)}`} target="_blank" rel="noopener noreferrer"
            style={{...btn("#25d366","#fff"),display:"block",textAlign:"center",textDecoration:"none"}}>
            📱 Ouvrir WhatsApp
          </a>
        )}
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>onSave(d)} style={{...btn("#0f172a","#fff"),flex:1}}>Enregistrer</button>
          <button onClick={onClose} style={btn("#f1f5f9","#475569")}>Annuler</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── IMPORT TALLY CSV ─────────────────────────────────────────────────────────
function ImportTally({ onImport, onClose }) {
  const [csv,setCsv]=useState("");
  const [preview,setPreview]=useState([]);

  const parseCSV=(text)=>{
    const lines=text.trim().split("\n");
    if(lines.length<2)return [];
    const headers=lines[0].split(",").map(h=>h.trim().replace(/"/g,"").toLowerCase());
    return lines.slice(1).map(line=>{
      const vals=line.split(",").map(v=>v.trim().replace(/"/g,""));
      const obj={};
      headers.forEach((h,i)=>obj[h]=vals[i]||"");
      return obj;
    });
  };

  const handlePreview=()=>{
    const rows=parseCSV(csv);
    setPreview(rows.slice(0,3));
  };

  const handleImport=()=>{
    const rows=parseCSV(csv);
    const newBens=rows.map((row,i)=>({
      id:Date.now()+i,
      nom:(row["nom"]||row["name"]||row["prénom"]||"Inconnu")+" "+(row["prénom"]||""),
      tel:row["telephone"]||row["téléphone"]||row["phone"]||"",
      email:row["email"]||row["mail"]||"",
      poles:["bar"],
      statut:"nouveau",
      estRef:false,
      contraintes:row["contraintes"]||row["restrictions"]||"",
      commentaires:[{date:new Date().toISOString().slice(0,10),event:"Import Tally",texte:`Inscrit via formulaire. Missions souhaitées: ${row["mission"]||row["missions"]||"N/A"}`}],
    }));
    onImport(newBens);
    onClose();
  };

  return (
    <Modal onClose={onClose} width={500}>
      <div style={{padding:24}}>
        <h3 style={{margin:"0 0 4px",fontWeight:800,fontSize:18,color:"#1e293b"}}>📥 Importer depuis Tally</h3>
        <p style={{margin:"0 0 16px",fontSize:13,color:"#64748b"}}>Dans Tally → Résultats → Exporter CSV, puis colle le contenu ici.</p>
        <label style={lbl}>Contenu CSV</label>
        <textarea value={csv} onChange={e=>setCsv(e.target.value)} style={{...inp,minHeight:120,resize:"vertical",fontFamily:"monospace",fontSize:12}} placeholder="Colle ici le contenu de l'export CSV Tally..."/>
        <div style={{display:"flex",gap:8,marginBottom:preview.length?14:0}}>
          <button onClick={handlePreview} style={{...btn("#f1f5f9","#475569"),flex:1}}>Prévisualiser</button>
          <button onClick={handleImport} style={{...btn("#0f172a","#fff"),flex:1}}>Importer tout</button>
          <button onClick={onClose} style={btn("#fee2e2","#b91c1c")}>Annuler</button>
        </div>
        {preview.length>0&&(
          <div style={{marginTop:12,background:"#f8fafc",borderRadius:8,padding:12}}>
            <div style={{fontWeight:700,fontSize:12,color:"#64748b",marginBottom:8}}>Aperçu (3 premières lignes) :</div>
            {preview.map((r,i)=>(
              <div key={i} style={{fontSize:12,color:"#334155",marginBottom:4}}>
                <strong>{r.nom||r.name||"?"}</strong> · {r.telephone||r.phone||"?"} · {r.email||"?"}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── VUE BESOINS ─────────────────────────────────────────────────────────────
function VueBesoins({ planning, benevoles, jours, eventNom }) {
  const besoins=[];
  jours.forEach(jour=>{
    POLES.forEach(pole=>{
      (planning[jour]?.[pole.id]||[]).forEach(c=>{
        c.places.filter(p=>p.statut==="vide"&&!p.benevoleId).forEach(p=>{
          besoins.push({jour,pole,creneau:c,place:p});
        });
      });
    });
  });
  const genMsg=()=>{
    if(!besoins.length)return"Tous les postes sont pourvus ! 🎉";
    const lignes=besoins.map(b=>`• ${b.pole.label} (${b.jour}) : ${hLabel(b.creneau.debut)}–${hLabel(b.creneau.fin)}`);
    return `Salut ! Il reste des postes disponibles pour ${eventNom} 🙌\n\n${lignes.join("\n")}\n\nDis-moi si l'un de ces créneaux t'intéresse !`;
  };
  return (
    <div style={{padding:20}}>
      <h2 style={{fontWeight:800,fontSize:20,marginBottom:4,color:"#1e293b"}}>Postes à pourvoir</h2>
      <p style={{color:"#64748b",fontSize:14,marginBottom:18}}>{besoins.length===0?"🎉 Tout est complet !":`${besoins.length} place${besoins.length>1?"s":""} vide${besoins.length>1?"s":""}`}</p>
      {besoins.map(({jour,pole,creneau,place})=>(
        <div key={place.id} style={{background:"#fff",border:`2px dashed ${pole.color}88`,borderRadius:10,padding:"9px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:7}}>
          <span style={{background:pole.color,color:"#fff",borderRadius:99,padding:"2px 8px",fontSize:11,fontWeight:700}}>{pole.label}</span>
          <span style={{fontWeight:700,color:"#64748b",fontSize:12,textTransform:"capitalize"}}>{jour}</span>
          <span style={{fontFamily:"monospace",fontWeight:700,color:"#1e293b",fontSize:13}}>{hLabel(creneau.debut)}–{hLabel(creneau.fin)}</span>
        </div>
      ))}
      {besoins.length>0&&(
        <div style={{marginTop:18,background:"#f0fdf4",border:"1.5px solid #86efac",borderRadius:12,padding:14}}>
          <div style={{fontWeight:700,fontSize:13,color:"#166534",marginBottom:8}}>📋 Message WhatsApp — liste des besoins</div>
          <textarea readOnly value={genMsg()} style={{...inp,marginBottom:10,minHeight:130,background:"#fff",resize:"vertical"}}/>
          <button onClick={()=>navigator.clipboard?.writeText(genMsg())} style={btn("#16a34a","#fff")}>📋 Copier</button>
        </div>
      )}
    </div>
  );
}

// ─── POINTEUSE (conservée) ────────────────────────────────────────────────────
function VuePointeuse({ planning, benevoles, jour }) {
  const getB=id=>benevoles.find(b=>b.id===id);
  return (
    <div style={{padding:20}}>
      <h2 style={{fontWeight:800,fontSize:20,marginBottom:4,color:"#1e293b"}}>Feuille pointeuse</h2>
      <p style={{color:"#64748b",fontSize:14,marginBottom:18,textTransform:"capitalize"}}>{jour}</p>
      {POLES.map(pole=>{
        const rows=[];
        (planning[pole.id]||[]).forEach(c=>{
          c.places.filter(p=>p.benevoleId).forEach(p=>{
            const b=getB(p.benevoleId);
            if(b)rows.push({heure:`${hLabel(c.debut)}-${hLabel(c.fin)}`,nom:b.nom,tel:b.tel,estRef:b.estRef});
          });
        });
        if(!rows.length)return null;
        return (
          <div key={pole.id} style={{marginBottom:20,border:`2px solid ${pole.color}`,borderRadius:12,overflow:"hidden"}}>
            <div style={{background:pole.color,color:"#fff",padding:"9px 14px",fontWeight:800,fontSize:13}}>{pole.label} — <span style={{textTransform:"capitalize"}}>{jour}</span></div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:pole.light}}>
                {["Horaire","Bénévole","Téléphone","Arrivée","Départ","Commentaire"].map(h=>(
                  <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:11,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:0.4,borderBottom:`1px solid ${pole.color}33`}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{rows.map((r,i)=>(
                <tr key={i} style={{background:i%2===0?"#fff":pole.light+"44",borderTop:`1px solid ${pole.color}22`}}>
                  <td style={{padding:"11px 10px",fontFamily:"monospace",fontWeight:700,fontSize:12}}>{r.heure}</td>
                  <td style={{padding:"11px 10px",fontSize:13,fontWeight:700}}>{r.nom}{r.estRef?" ★":""}</td>
                  <td style={{padding:"11px 10px",fontSize:12,color:"#64748b"}}>{r.tel}</td>
                  <td style={{padding:"11px 10px"}}><div style={{border:"1.5px solid #cbd5e1",borderRadius:4,height:26,width:55}}/></td>
                  <td style={{padding:"11px 10px"}}><div style={{border:"1.5px solid #cbd5e1",borderRadius:4,height:26,width:55}}/></td>
                  <td style={{padding:"11px 10px"}}><div style={{border:"1.5px solid #cbd5e1",borderRadius:4,height:26,minWidth:110}}/></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        );
      })}
      <button onClick={()=>window.print()} style={{...btn("#0f172a","#fff"),marginTop:4}}>🖨️ Imprimer</button>
    </div>
  );
}

// ─── MODAL ÉVÉNEMENT ─────────────────────────────────────────────────────────
function ModalEvent({ event, onClose, onSave }) {
  const [nom,setNom]=useState(event?.nom??"Nouvel événement");
  const [nbJours,setNbJours]=useState(event?.nbJours??1);
  const [jours,setJours]=useState(event?.jours??["vendredi"]);
  const JOURS_DISPO=["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"];
  return (
    <Modal onClose={onClose} width={370}>
      <div style={{padding:26}}>
        <h3 style={{margin:"0 0 18px",fontWeight:800,fontSize:17,color:"#1e293b"}}>⚙️ Paramètres événement</h3>
        <label style={lbl}>Nom</label>
        <input value={nom} onChange={e=>setNom(e.target.value)} style={inp}/>
        <label style={lbl}>Nombre de jours</label>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {[1,2,3].map(n=>(
            <button key={n} onClick={()=>{setNbJours(n);setJours(JOURS_DISPO.slice(0,n));}} style={{...btn(nbJours===n?"#0f172a":"#f1f5f9",nbJours===n?"#fff":"#475569"),flex:1}}>
              {n} jour{n>1?"s":""}
            </button>
          ))}
        </div>
        {Array.from({length:nbJours},(_,i)=>(
          <div key={i}>
            <label style={lbl}>Jour {i+1}</label>
            <select value={jours[i]||""} onChange={e=>{const j=[...jours];j[i]=e.target.value;setJours(j);}} style={inp}>
              {JOURS_DISPO.map(j=><option key={j} value={j}>{j.charAt(0).toUpperCase()+j.slice(1)}</option>)}
            </select>
          </div>
        ))}
        <div style={{display:"flex",gap:8,marginTop:4}}>
          <button onClick={()=>onSave({nom,nbJours,jours:jours.slice(0,nbJours)})} style={{...btn("#0f172a","#fff"),flex:1}}>Enregistrer</button>
          <button onClick={onClose} style={btn("#f1f5f9","#475569")}>Annuler</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [event,setEvent]=useState(INIT_EVENT);
  const [bens,setBens]=useState(INIT_BENS);
  const [vue,setVue]=useState("planning");
  const [jourActif,setJourActif]=useState("vendredi");
  const [modePrePlan,setModePrePlan]=useState(false);
  const [editCr,setEditCr]=useState(null);
  const [editRefCr,setEditRefCr]=useState(null);
  const [assignM,setAssignM]=useState(null);
  const [ficheBen,setFicheBen]=useState(null);
  const [filtreStatut,setFiltreStatut]=useState("tous");
  const [recherche,setRecherche]=useState("");
  const [modeBen,setModeBen]=useState("benevoles");
  const [showEventModal,setShowEventModal]=useState(false);
  const [showReset,setShowReset]=useState(false);
  const [showEnvoiGroupe,setShowEnvoiGroupe]=useState(false);
  const [showTally,setShowTally]=useState(false);

  const planning=event.planning;
  const refPlanning=event.refPlanning;

  // Stats
  const allPlaces=event.jours.flatMap(j=>POLES.flatMap(p=>(planning[j]?.[p.id]||[]).flatMap(c=>c.places)));
  const nbV=allPlaces.filter(p=>p.statut==="validé").length;
  const nbE=allPlaces.filter(p=>p.statut==="envoyé").length;
  const nbVide=allPlaces.filter(p=>p.statut==="vide").length;

  const updPlan=(jour,poleId,creneaux)=>setEvent(ev=>({...ev,planning:{...ev.planning,[jour]:{...ev.planning[jour],[poleId]:creneaux}}}));
  const updRef=(jour,poleId,creneaux)=>setEvent(ev=>({...ev,refPlanning:{...ev.refPlanning,[jour]:{...ev.refPlanning[jour],[poleId]:creneaux}}}));

  const handleSaveCr=(updated)=>{
    const{jour,poleId,isNew}=editCr;
    const curr=planning[jour]?.[poleId]||[];
    if(isNew) updPlan(jour,poleId,[...curr,{...updated,id:`${poleId}-${Date.now()}`}]);
    else updPlan(jour,poleId,curr.map(c=>c.id===updated.id?updated:c));
    setEditCr(null);
  };
  const handleDelCr=()=>{
    const{jour,poleId,creneau}=editCr;
    updPlan(jour,poleId,(planning[jour]?.[poleId]||[]).filter(c=>c.id!==creneau.id));
    setEditCr(null);
  };

  const handleSaveRefCr=(updated)=>{
    const{jour,poleId,isNew}=editRefCr;
    const targetPole=updated.poleId||poleId;
    const curr=refPlanning[jour]?.[targetPole]||[];
    if(isNew) updRef(jour,targetPole,[...curr,{...updated,id:`ref-${Date.now()}`}]);
    else updRef(jour,targetPole,curr.map(c=>c.id===updated.id?updated:c));
    setEditRefCr(null);
  };
  const handleDelRefCr=()=>{
    const{jour,poleId,creneau}=editRefCr;
    updRef(jour,poleId,(refPlanning[jour]?.[poleId]||[]).filter(c=>c.id!==creneau.id));
    setEditRefCr(null);
  };

  const handleAssign=(updated)=>{
    const{jour,poleId,creneauId}=assignM;
    const curr=planning[jour]?.[poleId]||[];
    updPlan(jour,poleId,curr.map(c=>c.id===creneauId?{...c,places:c.places.map(p=>p.id===updated.id?updated:p)}:c));
    setAssignM(null);
  };

  // Quand on envoie un WA depuis l'envoi groupé → passe les places en "envoyé"
  const handleSentGroupe=(benId)=>{
    setEvent(ev=>{
      const next=JSON.parse(JSON.stringify(ev));
      ev.jours.forEach(j=>{
        POLES.forEach(pole=>{
          (next.planning[j]?.[pole.id]||[]).forEach(c=>{
            c.places.forEach(p=>{if(p.benevoleId===benId)p.statut="envoyé";});
          });
        });
      });
      return next;
    });
  };

  const handleSaveEvent=({nom,nbJours,jours})=>{
    const newPlan={},newRef={};
    jours.forEach(j=>{
      newPlan[j]=planning[j]||{bar:[],merch:[],entree:[],parking:[],brigade:[]};
      newRef[j]=refPlanning[j]||{bar:[],merch:[],entree:[],parking:[],brigade:[]};
    });
    setEvent(ev=>({...ev,nom,nbJours,jours,planning:newPlan,refPlanning:newRef}));
    if(!jours.includes(jourActif))setJourActif(jours[0]);
    setShowEventModal(false);
  };

  const resetStatuts=()=>{
    setBens(prev=>prev.map(b=>b.statut==="banni"||b.statut==="ancien"?b:{...b,statut:"pas_contacte"}));
    setShowReset(false);
  };

  const bensFiltres=bens
    .filter(b=>{
      if(modeBen==="benevoles")return !b.estRef&&b.statut!=="banni"&&b.statut!=="ancien";
      if(modeBen==="referents")return b.estRef;
      if(modeBen==="bannis")return b.statut==="banni"||b.statut==="ancien";
      return true;
    })
    .filter(b=>filtreStatut==="tous"||b.statut===filtreStatut)
    .filter(b=>!recherche||b.nom.toLowerCase().includes(recherche.toLowerCase()));

  const NAVS=[["planning","📋 Planning"],["benevoles","👥 Bénévoles"],["besoins","🔴 Besoins"],["pointeuse","🖨️ Pointeuse"]];

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",minHeight:"100vh",background:"#f1f5f9"}}>
      {/* Header */}
      <div style={{background:"#0f172a",color:"#fff",padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>🎪</span>
          <div>
            <div style={{fontWeight:900,fontSize:16,lineHeight:1.1}}>{event.nom}</div>
            <button onClick={()=>setShowEventModal(true)} style={{background:"none",border:"none",color:"#475569",fontSize:10,cursor:"pointer",padding:0,fontFamily:"inherit"}}>⚙️ Modifier</button>
          </div>
        </div>
        <div style={{display:"flex",gap:5}}>
          {[["✓",nbV,"#22c55e"],["⏳",nbE,"#eab308"],["✗",nbVide,"#ef4444"]].map(([icon,n,color])=>(
            <div key={icon} style={{textAlign:"center",background:"#ffffff0f",borderRadius:7,padding:"4px 9px",minWidth:40}}>
              <div style={{fontWeight:900,fontSize:14,color}}>{n}</div>
              <div style={{fontSize:9,color:"#475569"}}>{icon}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div style={{background:"#fff",borderBottom:"1.5px solid #e2e8f0",padding:"0 14px",display:"flex",overflowX:"auto"}}>
        {NAVS.map(([key,label])=>(
          <button key={key} onClick={()=>setVue(key)} style={{border:"none",background:"none",padding:"11px 13px",fontWeight:vue===key?800:500,color:vue===key?"#0f172a":"#64748b",borderBottom:vue===key?"3px solid #0f172a":"3px solid transparent",cursor:"pointer",fontSize:13,fontFamily:"inherit",whiteSpace:"nowrap"}}>
            {label}
          </button>
        ))}
      </div>

      {/* PLANNING */}
      {vue==="planning"&&(
        <div style={{padding:14}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
            {event.jours.map(j=>(
              <button key={j} onClick={()=>setJourActif(j)} style={{border:"2px solid #0f172a",borderRadius:8,padding:"6px 16px",fontWeight:800,fontSize:13,cursor:"pointer",background:jourActif===j?"#0f172a":"#fff",color:jourActif===j?"#fff":"#0f172a",textTransform:"capitalize",fontFamily:"inherit"}}>
                {j}
              </button>
            ))}
            <button onClick={()=>setModePrePlan(!modePrePlan)} style={{...btn(modePrePlan?"#eef2ff":"#f8fafc",modePrePlan?"#4338ca":"#64748b"),border:`2px solid ${modePrePlan?"#6366f1":"#e2e8f0"}`,fontSize:12}}>
              {modePrePlan?"📐 Pré-planning":"✅ Planning complet"}
            </button>
            <button onClick={()=>setShowEnvoiGroupe(true)} style={{...btn("#25d366","#fff"),fontSize:12,marginLeft:"auto"}}>
              📤 Envoi groupé
            </button>
          </div>

          {/* Référents */}
          <RefTimeline
            refPlanning={refPlanning[jourActif]||{}}
            benevoles={bens}
            jour={jourActif}
            onAddRef={()=>setEditRefCr({creneau:{debut:19,fin:28,benevoleId:null,statut:"vide"},pole:POLES[0],poleId:"bar",jour:jourActif,isNew:true})}
            onClickRef={(c,pole)=>setEditRefCr({creneau:c,pole,poleId:pole.id,jour:jourActif,isNew:false})}
          />

          {/* Bénévoles */}
          <div style={{fontWeight:800,fontSize:14,color:"#1e293b",marginBottom:10}}>👤 Planning Bénévoles</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
            {POLES.map(pole=>(
              <PlanningBenListe
                key={pole.id}
                planning={planning[jourActif]||{}}
                benevoles={bens}
                pole={pole}
                modePrePlanning={modePrePlan}
                onEditCreneau={(creneau,pole)=>{
                  if(creneau) setEditCr({creneau,pole,jour:jourActif,poleId:pole.id,isNew:false});
                  else setEditCr({creneau:{debut:20,fin:22,places:[]},pole,jour:jourActif,poleId:pole.id,isNew:true});
                }}
                onAssigner={(place,creneau,pole)=>setAssignM({place,creneau,creneauId:creneau.id,pole,jour:jourActif,poleId:pole.id})}
              />
            ))}
          </div>
        </div>
      )}

      {/* BÉNÉVOLES */}
      {vue==="benevoles"&&(
        <div style={{padding:14}}>
          <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
            {[["benevoles","👤 Bénévoles"],["referents","★ Référents"],["bannis","🚫 Bannis"],["tous","Tous"]].map(([k,l])=>(
              <button key={k} onClick={()=>setModeBen(k)} style={{border:`2px solid ${modeBen===k?"#0f172a":"#e2e8f0"}`,borderRadius:8,padding:"5px 10px",fontWeight:modeBen===k?800:600,background:modeBen===k?"#0f172a":"#fff",color:modeBen===k?"#fff":"#64748b",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>
                {l}
              </button>
            ))}
            <select value={filtreStatut} onChange={e=>setFiltreStatut(e.target.value)} style={{...inp,marginBottom:0,width:"auto",fontSize:12}}>
              <option value="tous">Tous statuts</option>
              {STATUTS_BEN.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <input value={recherche} onChange={e=>setRecherche(e.target.value)} placeholder="Rechercher..." style={{...inp,marginBottom:0,width:140,fontSize:12}}/>
            <button onClick={()=>setShowReset(true)} style={{...btn("#fef3c7","#92400e"),border:"1.5px solid #fde68a",fontSize:12}}>🔄 Réinitialiser</button>
            <button onClick={()=>setShowTally(true)} style={{...btn("#eef2ff","#4338ca"),border:"1.5px solid #c7d2fe",fontSize:12}}>📥 Import Tally</button>
            <button onClick={()=>{const nb={id:Date.now(),nom:"Nouveau bénévole",tel:"",email:"",poles:["bar"],statut:"nouveau",estRef:false,contraintes:"",commentaires:[]};setBens(p=>[nb,...p]);setFicheBen(nb);}} style={{...btn("#0f172a","#fff"),fontSize:12}}>+ Ajouter</button>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:9}}>
            {bensFiltres.map(b=>{
              const si=STATUTS_BEN.find(s=>s.id===b.statut);
              return (
                <div key={b.id} onClick={()=>setFicheBen(b)} style={{background:"#fff",border:b.statut==="banni"?"2px solid #fca5a5":"1.5px solid #e2e8f0",borderRadius:11,padding:"13px 14px",cursor:"pointer",boxShadow:"0 1px 4px #0001",opacity:b.statut==="ancien"||b.statut==="banni"?0.7:1,position:"relative"}}>
                  {b.estRef&&<div style={{position:"absolute",top:10,right:12,color:"#f59e0b",fontSize:13}}>★</div>}
                  <div style={{fontWeight:800,fontSize:14,color:"#1e293b",marginBottom:2,paddingRight:18}}>{b.nom}</div>
                  <div style={{fontSize:11,color:"#64748b",marginBottom:7}}>{b.tel}</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:7}}>
                    {b.poles.map(pid=>{const p=POLES.find(p=>p.id===pid);return p?<span key={pid} style={{background:p.color,color:"#fff",borderRadius:99,padding:"1px 7px",fontSize:10,fontWeight:700}}>{p.label}</span>:null;})}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{background:si.color+"22",color:si.color,borderRadius:6,padding:"2px 7px",fontSize:10,fontWeight:700}}>{si.label}</span>
                    {b.commentaires.length>0&&<span style={{fontSize:10,color:"#64748b"}}>💬 {b.commentaires.length}</span>}
                  </div>
                  {b.contraintes&&<div style={{marginTop:7,fontSize:10,color:"#92400e",background:"#fffbeb",borderRadius:5,padding:"2px 7px"}}>⚠ {b.contraintes}</div>}
                </div>
              );
            })}
            {bensFiltres.length===0&&<p style={{color:"#94a3b8",fontSize:14}}>Aucun bénévole trouvé.</p>}
          </div>
        </div>
      )}

      {vue==="besoins"&&<VueBesoins planning={planning} benevoles={bens} jours={event.jours} eventNom={event.nom}/>}
      {vue==="pointeuse"&&<VuePointeuse planning={planning[jourActif]||{}} benevoles={bens} jour={jourActif}/>}

      {/* MODALS */}
      {editCr&&<ModalCreneau creneau={editCr.creneau} pole={editCr.pole} benevoles={bens} onClose={()=>setEditCr(null)} onSave={handleSaveCr} onDelete={handleDelCr} isNew={editCr.isNew}/>}
      {editRefCr&&<ModalRefCreneau creneau={editRefCr.creneau} pole={editRefCr.pole} benevoles={bens} eventNom={event.nom} onClose={()=>setEditRefCr(null)} onSave={handleSaveRefCr} onDelete={handleDelRefCr} isNew={editRefCr.isNew} onSent={(bid)=>setBens(prev=>prev.map(b=>b.id===bid?{...b}:b))}/>}
      {assignM&&<ModalAssigner place={assignM.place} creneau={assignM.creneau} pole={assignM.pole} benevoles={bens} eventNom={event.nom} onClose={()=>setAssignM(null)} onSave={handleAssign}/>}
      {ficheBen&&<FicheBenevole benevole={ficheBen} onClose={()=>setFicheBen(null)} onSave={b=>{setBens(prev=>prev.map(x=>x.id===b.id?b:x));setFicheBen(null);}}/>}
      {showEventModal&&<ModalEvent event={event} onClose={()=>setShowEventModal(false)} onSave={handleSaveEvent}/>}
      {showTally&&<ImportTally onImport={newBens=>setBens(prev=>[...newBens,...prev])} onClose={()=>setShowTally(false)}/>}
      {showEnvoiGroupe&&<EnvoiGroupe planning={planning} benevoles={bens} eventNom={event.nom} jours={event.jours} onSent={handleSentGroupe} onClose={()=>setShowEnvoiGroupe(false)}/>}

      {showReset&&(
        <Modal onClose={()=>setShowReset(false)} width={340}>
          <div style={{padding:26,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:10}}>🔄</div>
            <h3 style={{fontWeight:800,fontSize:16,color:"#1e293b",marginBottom:7}}>Réinitialiser les statuts ?</h3>
            <p style={{color:"#64748b",fontSize:13,marginBottom:18}}>Tous les bénévoles actifs passeront en "Pas contacté". Bannis et anciens non modifiés.</p>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={resetStatuts} style={btn("#0f172a","#fff")}>Confirmer</button>
              <button onClick={()=>setShowReset(false)} style={btn("#f1f5f9","#475569")}>Annuler</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
