export function clientRuntime() {
  return `(function(){
"use strict";
var C=window.__EXPLAINER__||{};
var meta=C.localeMeta||{languages:[{code:"en",label:"English",dir:"ltr"}],fallback:"en",storageKey:"html-explainer-lang"};
var strings=C.strings||{};
var cmap={red:["var(--red)","var(--red-bg)","var(--red-line)"],amber:["var(--amber)","var(--amber-bg)","var(--amber-line)"],blue:["var(--blue)","var(--blue-bg)","var(--blue-line)"],green:["var(--green)","var(--green-bg)","var(--green-line)"]};

function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function qs(sel,root){return (root||document).querySelector(sel);}
function qsa(sel,root){return Array.prototype.slice.call((root||document).querySelectorAll(sel));}
function on(node,evt,fn){node.addEventListener(evt,fn);}

function pickString(map,loc){
  if(!map)return "";
  if(typeof map==="string")return map;
  if(map[loc])return map[loc];
  var primary=loc.split("-")[0];
  if(map[primary])return map[primary];
  if(map[meta.fallback])return map[meta.fallback];
  var keys=Object.keys(map);
  return keys.length?map[keys[0]]:"";
}

function resolveLocale(){
  try{
    var stored=localStorage.getItem(meta.storageKey);
    if(stored&&C.localeData&&C.localeData[stored])return stored;
  }catch(e){}
  var nav=(navigator.language||navigator.userLanguage||meta.fallback||"en").toLowerCase();
  if(C.localeData&&C.localeData[nav])return nav;
  var primary=nav.split("-")[0];
  if(C.localeData&&C.localeData[primary])return primary;
  return meta.fallback||"en";
}

function localeDir(code){
  var langs=meta.languages||[];
  for(var i=0;i<langs.length;i++){if(langs[i].code===code)return langs[i].dir||"ltr";}
  return "ltr";
}

function applyStaticLocale(loc){
  document.documentElement.lang=loc;
  document.documentElement.dir=localeDir(loc);
  document.documentElement.classList.remove("i18n-pending");
  qsa("[data-i18n]").forEach(function(node){
    var path=node.getAttribute("data-i18n");
    var val=pickString(strings[path],loc);
    if(node.hasAttribute("data-i18n-rich"))node.innerHTML=val;
    else node.textContent=val;
  });
  qsa("[data-i18n-html]").forEach(function(node){
    var path=node.getAttribute("data-i18n-html");
    node.innerHTML=pickString(strings[path],loc);
  });
  var titleEl=qs("title[data-i18n]");
  if(titleEl){titleEl.textContent=pickString(strings["meta.title"],loc);document.title=titleEl.textContent;}
  qsa("[data-lang]").forEach(function(btn){
    btn.setAttribute("aria-pressed",btn.getAttribute("data-lang")===loc?"true":"false");
  });
}

var ctx={qs:qs,qsa:qsa,on:on,locale:meta.fallback,fmtEuro:function(n){if(n>=1e9)return "€"+(n/1e9).toFixed(2).replace(/\\.00$/,"")+"B";if(n>=1e6)return "€"+(n/1e6).toFixed(1).replace(/\\.0$/,"")+"M";return "€"+n.toLocaleString();}};

function clearNode(sel){var n=qs(sel);if(n)n.innerHTML="";}

function initTierCards(data){
  Object.keys(data||{}).forEach(function(key){
    var mount=qs('[data-tier-cards="'+key+'"]');
    if(!mount)return;
    mount.innerHTML="";
    (data[key]||[]).forEach(function(t){
      var row=el("div","tier-row "+(t.cls||"")+" "+(t.width||t.w||""));
      row.setAttribute("aria-expanded","false");
      var head=el("button","tier-head");
      head.setAttribute("aria-label","Toggle "+t.name);
      head.innerHTML='<span class="tag">'+t.tag+'</span><span><span class="tname">'+t.name+'</span><div class="tsub">'+t.sub+'</div></span><svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg>';
      var body=el("div","body",'<ul>'+(t.body||[]).map(function(b){return "<li>"+b+"</li>";}).join("")+'</ul>'+(t.note?'<div class="note">'+t.note+"</div>":""));
      on(head,"click",function(){var open=row.getAttribute("aria-expanded")==="true";row.setAttribute("aria-expanded",open?"false":"true");});
      row.appendChild(head);row.appendChild(body);mount.appendChild(row);
    });
  });
}

function initFilterList(cfg){
  var casesMount=qs('[data-filter-list-cases="'+cfg.id+'"]');
  var resultMount=qs('[data-filter-list-result="'+cfg.id+'"]');
  if(!casesMount||!resultMount)return;
  casesMount.innerHTML="";
  var whyLabel=pickString(strings["ui.filterWhy"],ctx.locale)||"Why:";
  (cfg.props.cases||[]).forEach(function(c){
    var b=el("button",null,c.label||c.t);
    b.setAttribute("aria-pressed","false");
    on(b,"click",function(){
      qsa("button",casesMount).forEach(function(x){x.setAttribute("aria-pressed","false");});
      b.setAttribute("aria-pressed","true");
      var col=cmap[c.color||c.c]||cmap.amber;
      resultMount.innerHTML='<span class="verdict-tag" style="background:'+col[0]+'">'+(c.verdict||c.title)+'</span><div class="verdict"><h3 style="color:'+col[0]+'">'+(c.label||c.t)+'</h3><div class="why" style="background:'+col[1]+';border-color:'+col[2]+';color:var(--ink-2)"><strong style="color:'+col[0]+'">'+whyLabel+' </strong>'+(c.why||"")+"</div></div>";
    });
    casesMount.appendChild(b);
  });
}

function initSlider(cfg){
  var root=qs('[data-demo-id="'+cfg.id+'"]');
  if(!root)return;
  var input=qs("[data-slider-input]",root);
  var readout=qs("[data-slider-readout]",root);
  var out=qs("[data-slider-out]",root);
  var p=cfg.props||{};
  var format=p.format||"number";
  var threshold=p.threshold;
  function render(v){
    if(format==="power"){
      var sup={"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹",".":"."};
      var disp=v%1===0?String(v):Number(v).toFixed(1);
      readout.textContent="10"+disp.split("").map(function(ch){return sup[ch]||ch;}).join("");
    }else{readout.textContent=String(v);}
    var above=threshold!=null&&Number(v)>=threshold;
    var msg=above?(p.aboveText||""):(p.belowText||"");
    out.className="out "+(above?"out-yes":"out-no");
    out.innerHTML=msg;
  }
  on(input,"input",function(){render(input.value);});
  render(input.value);
}

function initFilterMatrix(key,data){
  var domains=qs('[data-filter-matrix-domains="'+key+'"]');
  var list=qs('[data-filter-matrix-list="'+key+'"]');
  var reqs=qs('[data-filter-matrix-reqs="'+key+'"]');
  if(!domains||!list||!reqs)return;
  domains.innerHTML="";list.innerHTML="";reqs.innerHTML="";
  var allLabel=pickString(strings["ui.allAreas"],ctx.locale)||"All areas";
  function render(filter){
    list.innerHTML="";
    (data.areas||[]).filter(function(a){return !filter||a.key===filter;}).forEach(function(a){
      list.appendChild(el("div","hr-item",'<h4><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2l9 4v6c0 5-3.8 8.5-9 10-5.2-1.5-9-5-9-10V6z"/></svg>'+(a.title||a.t)+'</h4><p>'+(a.description||a.d)+'</p>'));
    });
  }
  var allBtn=el("button",null,allLabel);
  allBtn.setAttribute("aria-pressed","true");
  on(allBtn,"click",function(){qsa("button",domains).forEach(function(x){x.setAttribute("aria-pressed","false");});allBtn.setAttribute("aria-pressed","true");render(null);});
  domains.appendChild(allBtn);
  (data.areas||[]).forEach(function(a){
    var b=el("button",null,a.key);
    b.setAttribute("aria-pressed","false");
    on(b,"click",function(){qsa("button",domains).forEach(function(x){x.setAttribute("aria-pressed","false");});b.setAttribute("aria-pressed","true");render(a.key);});
    domains.appendChild(b);
  });
  render(null);
  (data.requirements||[]).forEach(function(r){
    reqs.appendChild(el("div","req",'<div class="rt">'+(r.title||r[0])+'</div><div class="rd">'+(r.body||r[1])+"</div>"));
  });
}

function initQuiz(questions, rootSel){
  var quizEl=qs(rootSel||"[data-quiz-root]");
  if(!quizEl||!questions||!questions.length)return;
  quizEl.innerHTML="";
  var answered=0,correct=0;
  var scoreEl=el("div","score");
  var whyLabel=pickString(strings["ui.quizWhy"],ctx.locale)||"Why:";
  questions.forEach(function(q,qi){
    var block=el("div","q");
    block.innerHTML='<div class="qq"><span class="qn">'+(qi+1)+'.</span><span>'+q.q+'</span></div>';
    var opts=el("div","opts");
    var options=q.options||q.opts||[];
    var answer=q.answer!=null?q.answer:q.a;
    var exp=el("div","exp","<strong>"+whyLabel+"</strong> "+(q.why||""));
    options.forEach(function(o,oi){
      var b=el("button",null,o);
      on(b,"click",function(){
        if(block.dataset.done)return;
        block.dataset.done="1";answered++;
        qsa("button",opts).forEach(function(x,xi){x.disabled=true;if(xi===answer)x.classList.add("correct");});
        if(oi===answer)correct++;else b.classList.add("wrong");
        exp.classList.add("show");
        if(answered===questions.length){
          scoreEl.classList.add("show");
          scoreEl.textContent="You got "+correct+" of "+questions.length+" right.";
        }
      });
      opts.appendChild(b);
    });
    block.appendChild(opts);block.appendChild(exp);quizEl.appendChild(block);
  });
  quizEl.appendChild(scoreEl);
}

function mountInteractive(loc){
  var data=(C.localeData&&C.localeData[loc])||{};
  ctx.locale=loc;
  initTierCards(data.tierCards||{});
  Object.keys(data.filterMatrix||{}).forEach(function(key){initFilterMatrix(key,data.filterMatrix[key]);});
  (data.demos||[]).forEach(function(cfg){
    if(cfg.type==="filter-list") initFilterList(cfg);
    else if(cfg.type==="slider") initSlider(cfg);
    else if(cfg.type==="custom"){
      var root=qs('[data-demo-id="'+cfg.id+'"]');
      if(!root||!cfg.props||!cfg.props.init)return;
      try{var fn=new Function("root","ctx",cfg.props.init);fn(root,ctx);}catch(err){console.error("Custom demo failed:",cfg.id,err);}
    }
  });
  if(data.quiz&&data.quiz.length)initQuiz(data.quiz,'[data-quiz-root="'+(C.quizRoot||"quiz")+'"]');
}

function setLocale(loc){
  if(!C.localeData||!C.localeData[loc])loc=meta.fallback;
  applyStaticLocale(loc);
  mountInteractive(loc);
  try{localStorage.setItem(meta.storageKey,loc);}catch(e){}
}

var current=resolveLocale();
setLocale(current);

qsa("[data-lang-switch] [data-lang]").forEach(function(btn){
  on(btn,"click",function(){setLocale(btn.getAttribute("data-lang"));});
});

var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.12});
qsa(".reveal").forEach(function(e){io.observe(e);});
setTimeout(function(){qsa(".reveal").forEach(function(e){e.classList.add("in");});},2500);
})();`;
}
