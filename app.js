const app = document.getElementById("app");

// forza logo topbar chiaro
(() => {
  const img = document.querySelector(".brand img");
  if (img) img.src = "./images/logo-light.png";
})();

const state = {};
const DATA = {
  sports:[
    {key:"calcio", name:"Calcio", img:"./images/calcio.jpg"},
    {key:"futsal", name:"Futsal", img:"./images/futsal.jpg"},
    {key:"basket", name:"Basket", img:"./images/basket.jpg"},
    {key:"volley", name:"Volley", img:"./images/volley.jpg"},
    {key:"rugby", name:"Rugby", img:"./images/rugby.jpg"},
    {key:"pallanuoto", name:"Pallanuoto", img:"./images/pallanuoto.jpg"}
  ],
  regions:["Lazio","Lombardia","Sicilia","Piemonte","Veneto","Emilia-Romagna"],
  leagues:["Eccellenza","Promozione","Serie C"],
  clubs:["ASD Roma Nord","Polisportiva Milano"],
  clubProfiles:{
    "ASD Roma Nord":{
      logo:"./images/logo-light.png",
      contacts:{email:"info@romasport.it",tel:"06123456"},
      gallery:["./images/calcio.jpg","./images/basket.jpg"],
      matches:[
        {home:"Prima Squadra", when:"31/08/2025 14:07", where:"Roma — Stadio Olimpico"},
        {home:"Juniores", when:"01/09/2025 18:30", where:"Roma — Campo Test"}
      ]
    }
  }
};

function clearMain(){ app.innerHTML=""; }
function h(tag,props={},children=[]){
  const el=document.createElement(tag);
  for(let [k,v] of Object.entries(props)){
    if(k==="class") el.className=v;
    else if(k==="onclick") el.onclick=v;
    else if(k==="style") Object.assign(el.style,v);
    else el.setAttribute(k,v);
  }
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(typeof c==="string") el.appendChild(document.createTextNode(c)); else if(c) el.appendChild(c);
  });
  return el;
}
function sectionTitle(t,sub=""){ 
  const box=h("div",{class:"container"},[]);
  box.appendChild(h("div",{class:"h1"},t));
  if(sub) box.appendChild(h("div",{class:"sub"},sub));
  return box;
}
function gridCard(item,onclick){
  return h("div",{class:"card",onclick},[
    h("img",{src:item.img||"./images/logo-icon.png",alt:item.name}),
    h("div",{class:"title"},item.name)
  ]);
}
function chip(label,active=false,onclick){
  const el=h("div",{class:"chip"+(active?" active":""),onclick},label);
  return el;
}

// Pagine
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport","Seleziona per iniziare"));
  const grid=h("div",{class:"container grid"}, DATA.sports.map(s=>gridCard(s,()=>{ state.sport=s.key; setTimeout(()=>pageGender(),120);})));
  app.appendChild(grid);
}
function pageGender(){
  clearMain();
  app.appendChild(sectionTitle("Seleziona il genere"));
  const row=h("div",{class:"container chips"},[
    chip("Maschile", state.gender==="Maschile", e=>{ state.gender="Maschile"; [...row.children].forEach(c=>c.classList.remove("active")); e.currentTarget.classList.add("active"); setTimeout(()=>pageRegions(),120); }),
    chip("Femminile", state.gender==="Femminile", e=>{ state.gender="Femminile"; [...row.children].forEach(c=>c.classList.remove("active")); e.currentTarget.classList.add("active"); setTimeout(()=>pageRegions(),120); })
  ]);
  app.appendChild(row);
  app.appendChild(h("div",{class:"container actions"},[h("button",{class:"btn",onclick:()=>pageSports()},"Indietro")]));
}
function pageRegions(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la regione"));
  const wrap=h("div",{class:"container chips"}, DATA.regions.map(r=>chip(r,state.region===r,e=>{ state.region=r; [...wrap.children].forEach(c=>c.classList.remove("active")); e.currentTarget.classList.add("active"); setTimeout(()=>pageLeagues(),120); })));
  app.appendChild(wrap);
  app.appendChild(h("div",{class:"container actions"},[h("button",{class:"btn",onclick:()=>pageGender()},"Indietro")]));
}
function pageLeagues(){
  clearMain();
  app.appendChild(sectionTitle("Seleziona il campionato"));
  const wrap=h("div",{class:"container chips"}, DATA.leagues.map(l=>chip(l,state.league===l,e=>{ state.league=l; [...wrap.children].forEach(c=>c.classList.remove("active")); e.currentTarget.classList.add("active"); setTimeout(()=>pageClubs(),120); })));
  app.appendChild(wrap);
  app.appendChild(h("div",{class:"container actions"},[h("button",{class:"btn",onclick:()=>pageRegions()},"Indietro")]));
}
function pageClubs(){
  clearMain();
  app.appendChild(sectionTitle("Seleziona la società"));
  const wrap=h("div",{class:"container chips"}, DATA.clubs.map(c=>chip(c,state.club===c,e=>{ state.club=c; [...wrap.children].forEach(x=>x.classList.remove("active")); e.currentTarget.classList.add("active"); setTimeout(()=>pageClubProfile(c),120); })));
  app.appendChild(wrap);
  app.appendChild(h("div",{class:"container actions"},[h("button",{class:"btn",onclick:()=>pageLeagues()},"Indietro")]));
}

// Pagina società
function pageClubProfile(clubName){
  clearMain();
  const club=DATA.clubProfiles[clubName]||{logo:"./images/logo-icon.png",contacts:{},gallery:[],matches:[]};
  app.appendChild(sectionTitle(clubName,`${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  const hero=h("div",{class:"container club-hero"},[
    h("div",{class:"club-logo"},[h("img",{src:club.logo,alt:clubName})]),
    h("div",{},[
      h("button",{class:"pm-fab",onclick:()=>openPrematchModal(club)},[h("img",{src:"./images/logo-icon.png",alt:"PM"})]),
      h("div",{class:"pm-fab-label"},"Crea PreMatch")
    ])
  ]);
  app.appendChild(hero);

  const panel=h("div",{class:"container panel"});
  panel.appendChild(h("div",{class:"h2",style:{fontWeight:"800",color:"var(--accent)"}}, "Prossime partite"));
  (club.matches.length?club.matches:[{home:"—",when:"—",where:"—"}]).forEach(m=>{
    panel.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"}, m.home+" vs —"),
      h("div",{class:"meta"}, `${m.when} — ${m.where}`)
    ]));
  });
  app.appendChild(panel);

  // accordion info/gallery/match
  const acc=h("div",{class:"container acc"});
  const info=h("div",{class:"acc-item"},[
    h("div",{class:"acc-hd",onclick:()=>info.classList.toggle("open")},"Informazioni"),
    h("div",{class:"acc-bd"},[
      h("div",{},"Email: "+(club.contacts.email||"-")),
      h("div",{},"Tel: "+(club.contacts.tel||"-")),
      h("div",{},"Impianto: "+(club.matches[0]?.where||"—"))
    ])
  ]);
  const gal=h("div",{class:"acc-item"},[
    h("div",{class:"acc-hd",onclick:()=>gal.classList.toggle("open")},"Galleria foto"),
    h("div",{class:"acc-bd"},club.gallery.length?h("div",{class:"gallery-grid"},club.gallery.map(src=>h("img",{src,alt:"Foto"}))):h("div",{class:"sub"},"Nessuna foto caricata."))
  ]);
  const cal=h("div",{class:"acc-item"},[
    h("div",{class:"acc-hd",onclick:()=>cal.classList.toggle("open")},"Match in programma nel centro"),
    h("div",{class:"acc-bd"},club.matches.length?h("ul",{},club.matches.map(m=>h("li",{},`${m.when} — ${m.where}`))):h("div",{class:"sub"},"Nessun match in programma."))
  ]);
  acc.appendChild(info); acc.appendChild(gal); acc.appendChild(cal);
  app.appendChild(acc);

  app.appendChild(h("div",{class:"container actions"},[h("button",{class:"btn",onclick:()=>pageClubs()},"Indietro")]));
}

// Modale prematch
function openPrematchModal(club){
  const overlay=h("div",{class:"overlay"});
  const sheet=h("div",{class:"sheet"},[
    h("div",{class:"hd"},"Crea PreMatch")
  ]);
  const body=h("div",{class:"bd"});
  sheet.appendChild(body);

  const sel={maglia
