const IS_VISITOR = true;
const LOGOS = {
  light:"./images/logo-light.png",
  dark:"./images/logo-dark.png",
  icon:"./images/logo-icon.png",
};

/* ---- Dati ---- */
const DATA = {
  sports:[
    {key:"calcio",name:"Calcio",img:"./images/calcio.jpg"},
    {key:"futsal",name:"Futsal",img:"./images/futsal.jpg"},
    {key:"basket",name:"Basket",img:"./images/basket.jpg"},
    {key:"volley",name:"Volley",img:"./images/volley.jpg"},
    {key:"rugby",name:"Rugby",img:"./images/rugby.jpg"},
    {key:"pallanuoto",name:"Pallanuoto",img:"./images/pallanuoto.jpg"},
  ],
  genders:["Maschile","Femminile"],
  regions:["Lazio","Lombardia","Sicilia","Piemonte","Veneto","Emilia-Romagna"],
  leaguesBy:{
    "Lazio":["Serie A","Eccellenza","Promozione","Scuola Calcio"],
    "Lombardia":["Serie C Silver","Serie D","Scuola Calcio"],
    "Sicilia":["Serie C","Promozione","Scuola Calcio"],
    "Piemonte":["Eccellenza","Scuola Calcio"],
    "Veneto":["Serie B Interregionale","Scuola Calcio"],
    "Emilia-Romagna":["Promozione","Scuola Calcio"],
  },
  clubsByLeague:{
    "Serie A":["ASD Roma Nord","Sporting Tuscolano"],
    "Eccellenza":["Virtus Marino","Borghesiana FC"],
    "Promozione":["Atletico Ostia"],
    "Scuola Calcio":["Accademia Ragazzi","Junior Sporting"],
    "Serie C Silver":[], "Serie D":[], "Serie C":[], "Serie B Interregionale":[]
  },
  clubProfiles:{
    "ASD Roma Nord": club("ASD Roma Nord"),
    "Sporting Tuscolano": club("Sporting Tuscolano"),
    "Virtus Marino": club("Virtus Marino"),
    "Borghesiana FC": club("Borghesiana FC"),
    "Atletico Ostia": club("Atletico Ostia"),
    "Accademia Ragazzi": club("Accademia Ragazzi"),
    "Junior Sporting": club("Junior Sporting"),
  }
};
function club(name){
  return {
    logo:LOGOS.icon,
    uniforms:{casa:"#e74a3c",trasferta:"#2c3e50",terza:"#2980b9"},
    gallery:["./images/calcio.jpg","./images/volley.jpg"],
    sponsors:["Hotel Demo","Ristorante Demo"],
    contacts:{email:"info@societa.demo",tel:"+39 000 000 0000"},
    matches:[
      {home:name,when:"31/08/2025 14:07",where:"Roma — Stadio Demo"},
      {home:"Juniores",when:"01/09/2025 18:30",where:"Roma — Campo Test"},
    ]
  };
}

/* ---- Stato ---- */
const state={sport:null,gender:null,region:null,league:null,club:null};

/* ---- DOM helpers ---- */
const app=document.getElementById("app");
function h(tag,attrs={},children=[]){
  const el=document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==="class")el.className=v;
    else if(k==="onclick")el.addEventListener("click",v);
    else if(k==="oninput")el.addEventListener("input",v);
    else if(k==="onchange")el.addEventListener("change",v);
    else if(k==="style")Object.assign(el.style,v);
    else el.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(c==null)return;
    el.appendChild(typeof c==="string"?document.createTextNode(c):c);
  });
  return el;
}
function clearMain(){app.innerHTML="";}
function sectionTitle(t,sub){return h("div",{class:"container"},[
  h("div",{class:"h1"},t), h("div",{class:"sub"},sub||"")
]);}

/* ---- UI widgets ---- */
function gridCard(item,onClick){
  const img=h("img",{
    src:item.img, alt:item.name, loading:"lazy",
    onerror(){
      // fallback placeholder SVG scuro
      this.onerror=null;
      const svg=`data:image/svg+xml;charset=utf-8,`+
      `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>`+
      `<rect width='100%' height='100%' fill='%230b0f14'/>`+
      `<text x='50%' y='50%' fill='%238a94a6' font-size='22' dominant-baseline='middle' text-anchor='middle'>`+
      `${item.name}</text></svg>`;
      this.src=svg;
    }
  });
  const card=h("div",{class:"card"},[
    img,
    h("div",{class:"title"},item.name)
  ]);
  card.addEventListener("click",()=>{
    card.classList.add("flash");
    setTimeout(()=>onClick(),220);
  });
  return card;
}
function chip(text,active,onClick){
  return h("div",{class:"chip"+(active?" active":""),onclick:onClick},text);
}

/* ---- Pagine ---- */
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport","Seleziona per iniziare"));
  const grid=h("div",{class:"container grid"});
  DATA.sports.forEach(s=>{
    grid.appendChild(gridCard(s,()=>{state.sport=s.key;pageGender();}));
  });
  app.appendChild(grid);
}
function pageGender(){
  clearMain();
  app.appendChild(sectionTitle("Seleziona il genere",""));
  const box=h("div",{class:"container panel"});
  const row=h("div",{class:"chips"});
  DATA.genders.forEach(g=>{
    row.appendChild(chip(g,state.gender===g,(ev)=>{
      state.gender=g;
      [...row.children].forEach(c=>c.classList.remove("active"));
      ev.currentTarget.classList.add("active");
      setTimeout(pageRegions,160);
    }));
  });
  box.appendChild(row);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:pageSports},"Indietro")
  ]));
  app.appendChild(box);
}
function pageRegions(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la regione",""));
  const box=h("div",{class:"container panel"});
  const wrap=h("div",{class:"chips"});
  DATA.regions.forEach(r=>{
    wrap.appendChild(chip(r,state.region===r,(ev)=>{
      state.region=r;
      [...wrap.children].forEach(c=>c.classList.remove("active"));
      ev.currentTarget.classList.add("active");
      setTimeout(pageLeagues,160);
    }));
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:pageGender},"Indietro")
  ]));
  app.appendChild(box);
}
function pageLeagues(){
  clearMain();
  app.appendChild(sectionTitle("Scegli il campionato",state.region||""));
  const leagues=DATA.leaguesBy[state.region]||[];
  const box=h("div",{class:"container panel"});
  const wrap=h("div",{class:"chips"});
  leagues.forEach(l=>{
    wrap.appendChild(chip(l,state.league===l,(ev)=>{
      state.league=l;
      [...wrap.children].forEach(c=>c.classList.remove("active"));
      ev.currentTarget.classList.add("active");
      setTimeout(pageClubs,160);
    }));
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:pageRegions},"Indietro")
  ]));
  app.appendChild(box);
}
function pageClubs(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la società",state.league||""));
  const clubs=DATA.clubsByLeague[state.league]||["Società Dimostrativa"];
  const box=h("div",{class:"container panel"});
  const wrap=h("div",{class:"chips"});
  clubs.forEach(c=>{
    wrap.appendChild(chip(c,state.club===c,(ev)=>{
      state.club=c;
      [...wrap.children].forEach(x=>x.classList.remove("active"));
      ev.currentTarget.classList.add("active");
      setTimeout(()=>pageClubProfile(c),160);
    }));
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:pageLeagues},"Indietro")
  ]));
  app.appendChild(box);
}

/* ---- Pagina società ---- */
function pageClubProfile(clubName){
  clearMain();
  const club=DATA.clubProfiles[clubName]||club(clubName);
  app.appendChild(sectionTitle(clubName,`${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  const header=h("div",{class:"container club-header"},[
    h("div",{class:"club-logo"},[h("img",{src:club.logo||LOGOS.icon,alt:clubName})]),
    h("div",{style:{display:"grid",placeItems:"center"}},[createPmRoundButton()])
  ]);
  app.appendChild(header);

  const acc=h("div",{class:"container acc"});
  acc.appendChild(accItem("Informazioni",[
    row("Email",club.contacts.email),
    row("Telefono",club.contacts.tel),
    row("Impianto","Via dello Sport 1, Roma (esempio)"),
  ]));
  acc.appendChild(accItem("Galleria foto",gallery(club.gallery)));
  acc.appendChild(accItem("Match in programma",matches(club.matches)));
  app.appendChild(acc);
}
function row(l,v){return h("div",{class:"row"},[h("div",{class:"team"},l),h("div",{class:"meta"},v||"—")]);}
function accItem(t,body){
  const it=h("div",{class:"item"});
  const hd=h("div",{class:"hd"},t);
  const bd=h("div",{class:"bd"});
  (Array.isArray(body)?body:[body]).forEach(el=>bd.appendChild(el));
  hd.addEventListener("click",()=>it.classList.toggle("open"));
  it.appendChild(hd);it.appendChild(bd);
  return it;
}
function gallery(list){
  if(!list||!list.length)return h("div",{class:"sub"},"Nessuna foto caricata.");
  const g=h("div",{class:"grid"});
  list.forEach(src=>g.appendChild(h("img",{src,alt:"Foto",style:{width:"100%",height:"140px",objectFit:"cover",borderRadius:"12px"}})));
  return g;
}
function matches(list){
  const box=h("div",{class:"panel"});
  (list&&list.length?list:[{home:"—",when:"—",where:"—"}]).forEach(m=>{
    box.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"},`${m.home} vs —`),
      h("div",{class:"meta"},`${m.when} — ${m.where}`)
    ]));
  });
  return box;
}

/* ---- Bottone PM ---- */
function createPmRoundButton(){
  const wrap=h("div");
  const btn=h("button",{class:"pm-round",title:"Crea PreMatch"},[h("img",{src:LOGOS.icon,alt:"PM"})]);
  btn.addEventListener("click",openPrematchModal);
  wrap.appendChild(btn);
  wrap.appendChild(h("div",{class:"pm-cta"},"Crea PreMatch"));
  return wrap;
}

/* ---- Modale PM ---- */
function openPrematchModal(){
  const overlay=h("div",{class:"overlay"});
  const sheet=h("div",{class:"sheet"});
  overlay.appendChild(sheet);

  const hd=h("div",{class:"hd"},"Crea PreMatch");
  const bd=h("div",{class:"bd"});
  const bar=h("div",{class:"bar"});

  const tipoLbl=h("div",{class:"sub"},"Tipo gara");
  const tipoSel=h("select",{class:"input-light"},[
    h("option",{value:"Campionato"},"Campionato"),
    h("option",{value:"Coppa"},"Coppa"),
    h("option",{value:"Torneo"},"Torneo"),
    h("option",{value:"Amichevole"},"Amichevole"),
  ]);

  const clrLbl=h("div",{class:"sub",style:{marginTop:"4px"}},"Colore maglia (ospite)");
  const palette=h("div",{class:"palette"});
  const colors=["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"];
  let selColor=null;
  colors.forEach(hex=>{
    const d=h("button",{class:"dot",style:{backgroundColor:hex}});
    d.addEventListener("click",ev=>{
      selColor=hex;
      [...palette.children].forEach(x=>x.classList.remove("sel"));
      ev.currentTarget.classList.add("sel");
    });
    palette.appendChild(d);
  });

  const d1=h("div",{class:"sub"},"Data & Ora");
  const dt=h("input",{type:"datetime-local",class:"input"});
  const l1=h("div",{class:"sub"},"Luogo (indirizzo)");
  const place=h("input",{type:"text",placeholder:"Via dello Sport 1, Città",class:"input"});

  bd.appendChild(tipoLbl); bd.appendChild(tipoSel);
  bd.appendChild(clrLbl);  bd.appendChild(palette);
  bd.appendChild(d1);      bd.appendChild(dt);
  bd.appendChild(l1);      bd.appendChild(place);

  const annulla=h("button",{class:"btn",onclick:()=>document.body.removeChild(overlay)},"Annulla");
  const conferma=h("button",{class:"btn primary",onclick:()=>{
    if(!selColor){alert("Seleziona il colore della maglia.");return;}
    document.body.removeChild(overlay);
    toast("Richiesta PreMatch inviata ✅");
  }},"Conferma");

  bar.appendChild(annulla);bar.appendChild(conferma);
  sheet.appendChild(hd);sheet.appendChild(bd);sheet.appendChild(bar);
  document.body.appendChild(overlay);
}

/* ---- Toast ---- */
function toast(msg){
  const t=h("div",{style:{
    position:"fixed",left:"50%",bottom:"22px",transform:"translateX(-50%)",
    background:"var(--accent)",color:"#0b1115",padding:"10px 14px",
    borderRadius:"10px",fontWeight:"700",zIndex:1200}},msg);
  document.body.appendChild(t); setTimeout(()=>t.remove(),1800);
}

/* ---- Start ---- */
pageSports();
