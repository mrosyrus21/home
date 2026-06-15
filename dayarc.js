(function(){
  "use strict";
  var DACFG=(window.DAYARC_CONFIG||{}); var HOSTID=DACFG.host||"view-today";
  var SVGNS="http://www.w3.org/2000/svg";
  var LAT=(DACFG.lat!=null?DACFG.lat:39.78), LNG=(DACFG.lng!=null?DACFG.lng:-104.75), RAD=Math.PI/180;
  var TZ=-(new Date().getTimezoneOffset())/60;   // user's local tz (Denver = -6/-7)
  var VW=640,PADL=28,PADR=28,HOR=108,TOP=14,VH=140,ELEV_REF=80;

  function dayOfYear(d){ return Math.floor((d-new Date(d.getFullYear(),0,0))/86400000); }
  function norm360(x){ x%=360; return x<0?x+360:x; }
  function solar(min,N){
    var hrs=min/60, gamma=2*Math.PI/365*((N)-1+(hrs-12)/24);
    var eq=229.18*(0.000075+0.001868*Math.cos(gamma)-0.032077*Math.sin(gamma)-0.014615*Math.cos(2*gamma)-0.040849*Math.sin(2*gamma));
    var decl=0.006918-0.399912*Math.cos(gamma)+0.070257*Math.sin(gamma)-0.006758*Math.cos(2*gamma)+0.000907*Math.sin(2*gamma)-0.002697*Math.cos(3*gamma)+0.00148*Math.sin(3*gamma);
    var off=eq+4*LNG-60*TZ, tst=min+off, ha=(tst/4-180)*RAD, latr=LAT*RAD;
    var cz=Math.sin(latr)*Math.sin(decl)+Math.cos(latr)*Math.cos(decl)*Math.cos(ha);
    var zen=Math.acos(Math.max(-1,Math.min(1,cz))), elev=90-zen/RAD;
    var azS=Math.atan2(Math.sin(ha),Math.cos(ha)*Math.sin(latr)-Math.tan(decl)*Math.cos(latr));
    var az=norm360(azS/RAD+180); return {elev:elev,az:az};
  }
  function julianDay(D0,min){ var Y=D0.getFullYear(),Mo=D0.getMonth()+1,Da=D0.getDate(),UT=min/60-TZ;
    if(Mo<=2){Y-=1;Mo+=12;} var A=Math.floor(Y/100),B=2-A+Math.floor(A/4);
    return Math.floor(365.25*(Y+4716))+Math.floor(30.6001*(Mo+1))+Da+B-1524.5+UT/24; }
  function moonPos(D0,min){ var jd=julianDay(D0,min),d=jd-2451545.0,r=RAD;
    var L=norm360(218.316+13.176396*d),Ma=norm360(134.963+13.064993*d),F=norm360(93.272+13.229350*d);
    var lon=L+6.289*Math.sin(Ma*r),lat=5.128*Math.sin(F*r);
    var Ls=norm360(280.460+0.9856474*d),g=norm360(357.528+0.9856003*d);
    var lonSun=Ls+1.915*Math.sin(g*r)+0.020*Math.sin(2*g*r);
    var elong=norm360(lon-lonSun),illum=(1-Math.cos(elong*r))/2,waxing=elong<180;
    var eps=23.439*r,lonr=lon*r,latr=lat*r;
    var dec=Math.asin(Math.sin(latr)*Math.cos(eps)+Math.cos(latr)*Math.sin(eps)*Math.sin(lonr));
    var ra=Math.atan2(Math.sin(lonr)*Math.cos(eps)-Math.tan(latr)*Math.sin(eps),Math.cos(lonr));
    var gmst=norm360(280.46061837+360.98564736629*d),lst=(gmst+LNG)*r,H=lst-ra,phi=LAT*r;
    var alt=Math.asin(Math.sin(phi)*Math.sin(dec)+Math.cos(phi)*Math.cos(dec)*Math.cos(H))/r;
    var az=norm360(Math.atan2(Math.sin(H),Math.cos(H)*Math.sin(phi)-Math.tan(dec)*Math.cos(phi))/r+180);
    var name=elong<11||elong>349?"New moon":elong<84?"Waxing crescent":elong<96?"First quarter":elong<174?"Waxing gibbous":elong<186?"Full moon":elong<264?"Waning gibbous":elong<276?"Last quarter":"Waning crescent";
    return {alt:alt,az:az,illum:illum,waxing:waxing,name:name}; }

  // recomputed each mount (date may roll over)
  var N_TODAY, SUN, MOONPATH, D0;
  function computeAstro(){
    D0=new Date(); N_TODAY=dayOfYear(D0);
    var prev=solar(0,N_TODAY).elev,sr=null,ss=null,peak=-90,pm=720;
    for(var m=1;m<=1440;m++){var e=solar(m,N_TODAY).elev; if(prev<0&&e>=0&&sr===null)sr=m; if(prev>=0&&e<0&&sr!==null&&ss===null)ss=m; if(e>peak){peak=e;pm=m;} prev=e;}
    if(sr===null)sr=336; if(ss===null)ss=1230;
    SUN={sunrise:sr,sunset:ss,noon:pm,azRise:solar(sr,N_TODAY).az,azSet:solar(ss,N_TODAY).az,maxElev:peak};
    MOONPATH=[]; var pa=moonPos(D0,0).alt,seg=null;
    for(var mm=0;mm<=1440;mm+=4){var p=moonPos(D0,mm); if(p.alt>0){ if(!seg){seg=[];MOONPATH.push(seg);} seg.push([mm,p.az,p.alt]); } else seg=null; pa=p.alt;}
  }

  function parseClock(s){ if(!s)return null; var m=String(s).match(/(\d{1,2}):(\d{2})\s*([AP]M)?/i); if(!m)return null;
    var h=+m[1],mn=+m[2],ap=(m[3]||"").toUpperCase(); if(ap==="PM"&&h<12)h+=12; if(ap==="AM"&&h===12)h=0; return h*60+mn; }
  function tasks(){
    if(DACFG.tasks) return DACFG.tasks.slice().sort(function(a,b){return a.m-b.m;});
    var RY=(typeof RHYTHM!=="undefined"&&RHYTHM)?RHYTHM:{breakfast:"8:00 AM",lunch:"12:30 PM",dinner:"6:30 PM",windDown:"10:00 PM",lightsOut:"11:00 PM"};
    function pc(s,f){var v=parseClock(s);return v==null?f:v;}
    return [
      {m:pc(RY.breakfast,480), ic:"🍳", label:"Breakfast", color:"#C084FC", find:"breakfast"},
      {m:pc(RY.lunch,750),     ic:"🥗", label:"Lunch",     color:"#2DB870", find:"lunch"},
      {m:pc(RY.dinner,1110),   ic:"🍽️", label:"Dinner",    color:"#C084FC", find:"dinner"},
      {m:pc(RY.windDown,1320), ic:"🌙", label:"Wind-down", color:"#A78BFA", find:"wind"},
      {m:pc(RY.lightsOut,1380),ic:"🛏️", label:"Bedtime",   color:"#38BDF8", find:"bedtime"}
    ].filter(function(t){return t.m!=null;}).sort(function(a,b){return a.m-b.m;});
  }
  var TL_A=5*60, TL_B=23.5*60;

  // weather: map WMO code -> sky condition; read hourly from WXF
  function codeToCond(c){ if(c==null)return "clear"; if(c>=95)return "rain"; if((c>=71&&c<=77)||(c>=85&&c<=86))return "cloudy";
    if((c>=51&&c<=67)||(c>=80&&c<=82))return "rain"; if(c>=45&&c<=48)return "cloudy"; if(c===3)return "cloudy"; if(c>=1)return "partly"; return "clear"; }
  function wxAt(min){ var h=Math.floor(((min%1440)+1440)%1440/60); var code=null,temp=null;
    if(DACFG.hourly){ var hw=DACFG.hourly[h%DACFG.hourly.length]; return {cond:codeToCond(hw.code),temp:(hw.temp!=null?hw.temp:null),code:hw.code}; }
    if(typeof WXF!=="undefined"&&WXF.ready){ if(WXF.hourlyCodes&&WXF.hourlyCodes.length>h){code=WXF.hourlyCodes[h];temp=WXF.hourlyTemp?WXF.hourlyTemp[h]:WXF.temp;} else {code=WXF.code;temp=WXF.temp;} }
    return {cond:codeToCond(code),temp:temp,code:code}; }
  function wxIc(cond,night){ return cond==="rain"?"⛈️":cond==="cloudy"?"☁️":cond==="partly"?"⛅":night?"🌙":"☀️"; }
  function wxLab(cond,night){ return cond==="rain"?"Storm":cond==="cloudy"?"Overcast":cond==="partly"?"Partly cloudy":night?"Clear":"Clear"; }

  // geometry
  function sx(az){ var f=(az-SUN.azRise)/(SUN.azSet-SUN.azRise); return PADL+(VW-PADL-PADR)*Math.max(-0.04,Math.min(1.04,f)); }
  function sy(elev){ return HOR-(Math.max(0,elev)/ELEV_REF)*(HOR-TOP); }
  function nightFactor(m){var a=SUN.sunrise-40,b=SUN.sunrise+25,c=SUN.sunset-25,d=SUN.sunset+45;if(m<a||m>d)return 1;if(m>b&&m<c)return 0;if(m>=a&&m<=b)return (b-m)/(b-a);return (m-c)/(d-c);}
  function skyFor(m){var dA=SUN.sunrise-55,dB=SUN.sunrise+70,kA=SUN.sunset-75,kB=SUN.sunset+55;
    if(m<dA||m>kB)return ["#070A18","#11173A"]; if(m<dB)return ["#241B3A","#E89066"];
    if(m/60<11)return ["#0F2348","#5A8FC0"]; if(m/60<15)return ["#11305A","#6AA6D6"];
    if(m<kA)return ["#163358","#B98A66"]; if(m<SUN.sunset)return ["#3A2A4E","#E8855A"]; return ["#1A1C3C","#7A4A58"];}
  function fmt(m){m=((m%1440)+1440)%1440;var h=Math.floor(m/60),mn=Math.floor(m%60),ap=h<12?"AM":"PM",hh=h%12;if(hh===0)hh=12;return hh+":"+(mn<10?"0":"")+mn+" "+ap;}
  function stateText(m){var h=m/60;if(m<SUN.sunrise)return "Before sunrise";if(h<9)return "Early";if(h<12)return "Mid-morning";if(h<14)return "Midday";if(h<17)return "Afternoon";if(m<SUN.sunset)return "Golden hour";if(h<22)return "Evening";return "Late";}

  var RIDGE_BACK=[[0,20],[34,30],[62,24],[92,38],[120,32],[150,30],[180,46],[200,56],[214,53],[232,44],[262,37],[296,46],[330,40],[360,40],[388,54],[410,58],[430,52],[456,42],[486,48],[516,38],[548,44],[582,33],[612,38],[640,34]];
  var RIDGE_MID=[[0,10],[48,20],[96,15],[140,26],[182,21],[224,30],[266,19],[306,26],[348,17],[388,28],[430,20],[470,26],[512,15],[556,22],[600,13],[640,17]];
  var RIDGE_FRNT=[[0,5],[58,15],[118,8],[178,17],[238,9],[300,16],[360,8],[420,15],[480,9],[540,14],[600,7],[640,11]];
  var RIDGE_FAR=[[0,26],[60,34],[120,28],[180,40],[240,30],[300,42],[360,32],[420,44],[480,30],[540,40],[600,30],[640,34]];

  function add(tag,attrs,parent){ var n=document.createElementNS(SVGNS,tag); if(attrs)for(var k in attrs)n.setAttribute(k,attrs[k]); (parent).appendChild(n); return n; }
  function rangePath(pts){ var d="M 0 "+VH+" L 0 "+(HOR-pts[0][1]); for(var i=0;i<pts.length;i++)d+=" L "+pts[i][0]+" "+(HOR-pts[i][1]); d+=" L "+VW+" "+VH+" Z"; return d; }
  function pct(m){ return Math.max(0,Math.min(100,((m-TL_A)/(TL_B-TL_A))*100)); }

  var svg,stars=[];
  function buildSvg(host){
    svg=add("svg",{"class":"da-svg",viewBox:"0 0 "+VW+" "+VH,"aria-hidden":"true"},host);
    var defs=add("defs",null,svg);
    defs.innerHTML='<linearGradient id="da_trail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E0795A"/><stop offset=".5" stop-color="#F5B830"/><stop offset="1" stop-color="#FCE3A6"/></linearGradient>'
      +'<radialGradient id="da_sun"><stop offset="0" stop-color="#FFFBEA"/><stop offset=".45" stop-color="#FBC55A"/><stop offset="1" stop-color="#F0A820"/></radialGradient>'
      +'<radialGradient id="da_moon"><stop offset="0" stop-color="#FCFDFF"/><stop offset="1" stop-color="#C6D2EE"/></radialGradient>'
      +'<radialGradient id="da_hz"><stop offset="0" stop-color="#FFD089" stop-opacity=".55"/><stop offset="1" stop-color="#FFD089" stop-opacity="0"/></radialGradient>'
      +'<linearGradient id="da_snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6FAFF"/><stop offset=".7" stop-color="#DCE6F6"/><stop offset="1" stop-color="#C2CFE6"/></linearGradient>'
      +'<linearGradient id="da_alpen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC089"/><stop offset=".5" stop-color="#FF9866"/><stop offset="1" stop-color="#FF9866" stop-opacity="0"/></linearGradient>'
      +'<linearGradient id="da_haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FB4D6" stop-opacity="0"/><stop offset="1" stop-color="#9FB4D6" stop-opacity=".22"/></linearGradient>'
      +'<radialGradient id="da_cloud" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="#FBFDFF" stop-opacity=".97"/><stop offset="60%" stop-color="#E9EFF8" stop-opacity=".86"/><stop offset="100%" stop-color="#D6DEEC" stop-opacity="0"/></radialGradient>'
      +'<filter id="da_soft" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="6"/></filter>'
      +'<filter id="da_soft2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>'
      +'<filter id="da_cblur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>'
      +'<clipPath id="da_mclip"><circle cx="0" cy="0" r="7"/></clipPath>';

    var sg=add("g",{id:"da_stars",opacity:"0"},svg); stars=[];
    for(var i=0;i<60;i++){ var x=8+Math.random()*(VW-16),y=8+Math.random()*Math.max(20,HOR-44),r=(Math.random()*1.2+.4),base=(Math.random()*.45+.55);
      var c=add("circle",{cx:x.toFixed(1),cy:y.toFixed(1),r:r.toFixed(2),fill:"#EAF2FF",opacity:base.toFixed(2)},sg);
      if(Math.random()<.55){ add("animate",{attributeName:"opacity",values:(base*.25).toFixed(2)+";"+base.toFixed(2)+";"+(base*.25).toFixed(2),dur:(2.5+Math.random()*3).toFixed(1)+"s",begin:(-Math.random()*4).toFixed(1)+"s",repeatCount:"indefinite"},c); }
      stars.push(c); }

    add("ellipse",{id:"da_hglow",rx:"140",ry:"50",cy:HOR,cx:sx(180),fill:"url(#da_hz)",opacity:"0"},svg);

    // sun path + trail (behind mountains)
    var d="M "+sx(SUN.azRise).toFixed(1)+" "+sy(0).toFixed(1);
    for(var mm=SUN.sunrise;mm<=SUN.sunset;mm+=6){var s=solar(mm,N_TODAY); d+=" L "+sx(s.az).toFixed(1)+" "+sy(s.elev).toFixed(1);}
    add("path",{id:"da_ahead",d:d,fill:"none",stroke:"rgba(255,255,255,.18)","stroke-width":"1.4","stroke-dasharray":"1 5","stroke-linecap":"round"},svg);
    add("path",{id:"da_glow",fill:"none",stroke:"url(#da_trail)","stroke-width":"6","stroke-linecap":"round",opacity:".32",filter:"url(#da_soft2)"},svg);
    add("path",{id:"da_line",fill:"none",stroke:"url(#da_trail)","stroke-width":"2.4","stroke-linecap":"round"},svg);
    // moon path
    var md=""; for(var si=0;si<MOONPATH.length;si++){var sgm=MOONPATH[si]; md+="M "+sx(sgm[0][1]).toFixed(1)+" "+sy(sgm[0][2]).toFixed(1); for(var pi=0;pi<sgm.length;pi++)md+=" L "+sx(sgm[pi][1]).toFixed(1)+" "+sy(sgm[pi][2]).toFixed(1);}
    add("path",{id:"da_mahead",d:md,fill:"none",stroke:"rgba(205,216,242,.28)","stroke-width":"1.2","stroke-dasharray":"1 5","stroke-linecap":"round",opacity:"0"},svg);
    add("path",{id:"da_mtrail",fill:"none",stroke:"rgba(216,224,248,.6)","stroke-width":"1.6","stroke-linecap":"round",opacity:"0"},svg);
    var body=add("g",{id:"da_body"},svg);
    body.innerHTML='<circle id="da_halo" r="16" fill="#F0A820" opacity=".28" filter="url(#da_soft)"/><circle id="da_core" r="8" fill="url(#da_sun)"/>';
    var mb=add("g",{id:"da_mbody",opacity:"0"},svg);
    mb.innerHTML='<circle id="da_mhalo" r="12" fill="#AEBEE8" opacity=".18" filter="url(#da_soft)"/><circle id="da_mcore" r="7" fill="url(#da_moon)"/><ellipse id="da_msh" cx="-2.6" cy="0" rx="5" ry="6.5" fill="#0A0E20" opacity="0" clip-path="url(#da_mclip)"/>';

    // mountains
    add("path",{id:"da_rfar",d:rangePath(RIDGE_FAR),fill:"#46557A",opacity:".55"},svg);
    add("path",{id:"da_rback",d:rangePath(RIDGE_BACK),fill:"#39476A"},svg);
    var cb=add("clipPath",{id:"da_clipB"},defs); add("path",{d:rangePath(RIDGE_BACK)},cb);
    add("rect",{id:"da_snow",x:0,y:0,width:VW,height:Math.max(0,HOR-46),fill:"url(#da_snow)","clip-path":"url(#da_clipB)"},svg);
    add("rect",{id:"da_alpen",x:0,y:0,width:VW,height:Math.max(0,HOR-38),fill:"url(#da_alpen)","clip-path":"url(#da_clipB)",opacity:"0"},svg);
    add("path",{id:"da_rmid",d:rangePath(RIDGE_MID),fill:"#27314C"},svg);
    add("rect",{id:"da_hazeb",x:0,y:HOR-26,width:VW,height:26,fill:"url(#da_haze)",opacity:".55"},svg);
    add("path",{id:"da_rfront",d:rangePath(RIDGE_FRNT),fill:"#121828"},svg);
    add("rect",{x:0,y:HOR,width:VW,height:VH-HOR,fill:"rgba(0,0,0,.2)"},svg);
    add("line",{x1:0,x2:VW,y1:HOR,y2:HOR,stroke:"rgba(255,255,255,.1)","stroke-width":"1"},svg);

    // clouds (front of peaks) + rain
    var cl=add("g",{id:"da_clouds",opacity:"0","class":"da-anim"},svg);
    var CLOUD_SHAPES=[
      [[0,0,22,12],[15,4,16,10],[-15,5,15,10],[8,-6,13,11],[-7,-5,12,10],[25,5,11,9],[-25,6,10,8]],
      [[0,0,18,11],[14,3,13,9],[-13,4,12,9],[6,-5,11,9],[-20,5,9,7]],
      [[0,1,26,10],[18,4,15,8],[-18,5,14,8],[10,-4,12,9],[-9,-4,11,9],[30,6,9,7]],
      [[0,0,15,10],[12,3,12,8],[-12,3,11,8],[5,-5,10,8],[-21,4,7,6]]
    ];
    [[24,1.05,72,.95,0],[18,1.3,96,.82,2],[34,.82,82,.88,1],[44,.68,110,.72,3],[54,.95,128,.6,0]].forEach(function(cf,idx){
      var wrap=add("g",{opacity:cf[3]},cl); var sc=add("g",{transform:"translate(0,"+cf[0]+") scale("+cf[1]+")"},wrap); var inner=add("g",{filter:"url(#da_cblur)"},sc);
      var shape=CLOUD_SHAPES[cf[4]],maxx=0;
      shape.forEach(function(e){add("ellipse",{cx:e[0],cy:e[1],rx:e[2],ry:e[3],fill:"url(#da_cloud)"},inner); maxx=Math.max(maxx,Math.abs(e[0])+e[2]);});
      add("rect",{x:-maxx*0.68,y:5,width:maxx*1.36,height:10,fill:"url(#da_cloud)"},inner);
      add("animateTransform",{attributeName:"transform",type:"translate",from:(-150)+" 0",to:(VW+150)+" 0",dur:cf[2]+"s",begin:(-idx*24)+"s",repeatCount:"indefinite"},wrap);
    });
    var rn=add("g",{id:"da_rain",opacity:"0","class":"da-anim"},svg);
    for(var ri=0;ri<48;ri++){ var rx=6+Math.random()*(VW+24),ry=4+Math.random()*Math.max(20,HOR-6),len=5+Math.random()*6,op=(.22+Math.random()*.4).toFixed(2);
      var ln=add("line",{x1:rx.toFixed(1),y1:ry.toFixed(1),x2:(rx-2).toFixed(1),y2:(ry+len).toFixed(1),stroke:"rgba(202,220,246,"+op+")","stroke-width":(Math.random()<.3?"1.1":"0.7")},rn);
      add("animateTransform",{attributeName:"transform",type:"translate",from:"0 -16",to:"5 24",dur:(.4+Math.random()*.35).toFixed(2)+"s",begin:(-Math.random()).toFixed(2)+"s",repeatCount:"indefinite"},ln); }
  }

  var TASKS=[];
  function buildTimeline(span){
    span.innerHTML="";
    [["Morning",TL_A,12*60],["Afternoon",12*60,17*60],["Evening",17*60,TL_B]].forEach(function(s,i){ var a=pct(s[1]),b=pct(s[2]); var d=document.createElement("div"); d.className="da-seg"; d.style.left=a+"%"; d.style.width=(b-a)+"%"; if(i===2)d.style.borderRight="none"; d.innerHTML="<span>"+s[0]+"</span>"; span.appendChild(d); });
    TASKS.forEach(function(t){ var mk=document.createElement("div"); mk.className="da-mk"; mk.style.left=pct(t.m)+"%"; mk.style.setProperty("--mc",t.color); mk.dataset.m=t.m; mk.title=t.label+" · "+fmt(t.m);
      mk.innerHTML='<span class="ic">'+t.ic+'</span><span class="dot"></span>';
      mk.addEventListener("click",function(ev){ ev.stopPropagation(); jumpTo(t.find); });
      span.appendChild(mk); });
    var nx=document.createElement("div"); nx.className="da-tl-next"; nx.id="da_next"; span.appendChild(nx);
    var nl=document.createElement("div"); nl.className="da-tl-now"; nl.id="da_now"; span.appendChild(nl);
  }

  function jumpTo(find){ try{ var host=document.getElementById(HOSTID); if(!host)return; var all=host.querySelectorAll("div"),target=null;
    for(var i=0;i<all.length;i++){ var n=all[i]; if(n.closest&&n.closest("#day-arc"))continue; var t=(n.textContent||"").toLowerCase(); if(t.indexOf(find)!==-1 && n.offsetHeight<260){ target=n; break; } }
    if(target){ window.scrollTo({top:target.getBoundingClientRect().top+window.pageYOffset-70,behavior:"smooth"}); var os=target.style.boxShadow; target.style.transition="box-shadow .4s"; target.style.boxShadow="0 0 0 2px rgba(240,168,32,.6)"; setTimeout(function(){target.style.boxShadow=os;},1100); } }catch(e){} }

  var $=function(id){return document.getElementById(id);};
  var userScrub=false, scrubM=0;
  function liveMin(){ var d=new Date(); return d.getHours()*60+d.getMinutes()+d.getSeconds()/60; }
  function curM(){ return userScrub?scrubM:liveMin(); }

  function update(){
    var root=$("day-arc"); if(!root||!svg)return;
    var m=curM(), sp=solar(m,N_TODAY), day=sp.elev>-0.5, w=wxAt(m), cond=w.cond, nf=nightFactor(m);
    var sky=skyFor(m);
    var bg="linear-gradient(180deg, "+sky[0]+" 0%, "+sky[1]+" 100%)";
    if(cond==="rain") bg="linear-gradient(rgba(18,24,40,.46),rgba(18,24,40,.46)), "+bg;
    else if(cond==="cloudy") bg="linear-gradient(rgba(120,128,142,.24),rgba(86,92,108,.2)), "+bg;
    root.querySelector(".da-sky").style.background=bg;

    if($("da_stars")) $("da_stars").setAttribute("opacity",nf.toFixed(2));
    if($("da_clouds")) $("da_clouds").setAttribute("opacity",((cond==="clear"?0:cond==="partly"?.55:cond==="cloudy"?.95:.85)*(1-nf*.45)).toFixed(2));
    if($("da_rain")) $("da_rain").setAttribute("opacity",cond==="rain"?"1":"0");
    if($("da_rback")){ var dk=nf;
      $("da_rfar").setAttribute("fill",dk>.5?"#232B47":"#46557A");
      $("da_rback").setAttribute("fill",dk>.5?"#1B2236":"#39476A");
      $("da_rmid").setAttribute("fill",dk>.5?"#141A2C":"#27314C");
      $("da_rfront").setAttribute("fill",dk>.5?"#080B14":"#121828");
      if($("da_snow"))$("da_snow").setAttribute("fill",dk>.5?"#9DAECF":"url(#da_snow)");
      if($("da_hazeb"))$("da_hazeb").setAttribute("opacity",dk>.5?".22":".55");
      var ag=day?Math.max(0,1-Math.abs(sp.elev)/11):0; if($("da_alpen"))$("da_alpen").setAttribute("opacity",(ag*.8).toFixed(2));
    }

    // sun
    var body=$("da_body"),halo=$("da_halo"),bx=0,by=0;
    if(day){ bx=sx(sp.az); by=sy(sp.elev); halo.setAttribute("opacity",(0.14+0.26*(sp.elev/SUN.maxElev)).toFixed(2)); body.style.opacity="1"; body.setAttribute("transform","translate("+bx+","+by+")");
      if($("da_hglow")){ $("da_hglow").setAttribute("cx",bx); $("da_hglow").setAttribute("opacity",(Math.max(0,1-sp.elev/14)*.9).toFixed(2)); }
    } else { body.style.opacity="0"; if($("da_hglow"))$("da_hglow").setAttribute("opacity","0"); }
    // moon
    var mp=moonPos(D0,m), mB=$("da_mbody");
    if(mB){ if(mp.alt>0){ mB.setAttribute("transform","translate("+sx(mp.az)+","+sy(mp.alt)+")");
        $("da_msh").setAttribute("cx",(mp.waxing?-2.6:2.6).toString()); $("da_msh").setAttribute("rx",(6.5*(1-mp.illum)+.5).toFixed(1)); $("da_msh").setAttribute("opacity",".92");
        mB.style.opacity=day?".4":(nf>.15?"1":".4");
      } else mB.style.opacity="0"; }
    // trails
    var glow=$("da_glow"),line=$("da_line");
    if(day){ var d="M "+sx(SUN.azRise).toFixed(1)+" "+sy(0).toFixed(1); for(var mm=SUN.sunrise;mm<=m;mm+=6){var s=solar(mm,N_TODAY); d+=" L "+sx(s.az).toFixed(1)+" "+sy(s.elev).toFixed(1);} d+=" L "+bx.toFixed(1)+" "+by.toFixed(1); glow.setAttribute("d",d); line.setAttribute("d",d); $("da_ahead").style.opacity="1"; }
    else { glow.setAttribute("d",""); line.setAttribute("d",""); $("da_ahead").style.opacity=".4"; }
    if($("da_mahead")){ $("da_mahead").style.opacity=MOONPATH.length?"1":"0"; var mt="";
      for(var k=0;k<MOONPATH.length;k++){var sgm=MOONPATH[k]; if(m>=sgm[0][0]&&m<=sgm[sgm.length-1][0]){ mt="M "+sx(sgm[0][1]).toFixed(1)+" "+sy(sgm[0][2]).toFixed(1); for(var pj=0;pj<sgm.length;pj++){ if(sgm[pj][0]<=m) mt+=" L "+sx(sgm[pj][1]).toFixed(1)+" "+sy(sgm[pj][2]).toFixed(1);} } }
      $("da_mtrail").setAttribute("d",mt); $("da_mtrail").style.opacity=mt?"1":"0"; }

    // timeline
    var tl=root.querySelector(".da-tl"), trackW=Math.max(0,tl.clientWidth-36);
    $("da_fill").style.width=((pct(m)/100)*trackW).toFixed(1)+"px";
    $("da_now").style.left=pct(m)+"%";
    var next=null; for(var ti=0;ti<TASKS.length;ti++){ if(TASKS[ti].m>m){next=TASKS[ti];break;} }
    var mks=root.querySelectorAll(".da-mk"); for(var mi=0;mi<mks.length;mi++){ var em=+mks[mi].dataset.m; mks[mi].classList.toggle("past",em<=m); mks[mi].classList.toggle("next",!!next&&em===next.m); }
    var nx=$("da_next");
    if(next){ nx.style.display="block"; var np=pct(next.m); nx.style.left=np+"%"; nx.style.transform=np>80?"translateX(-100%)":np<14?"translateX(0)":"translateX(-50%)"; nx.style.marginLeft=np>80?"10px":np<14?"-10px":"0"; nx.innerHTML=next.ic+" "+next.label+" · "+fmt(next.m).replace(":00",""); } else nx.style.display="none";

    // overlay + foot
    root.querySelector(".da-state").textContent=stateText(m);
    var tEl=root.querySelector(".da-wx .t"), cEl=root.querySelector(".da-wx .c");
    if(w.temp!=null){ tEl.textContent=w.temp+"°"; cEl.textContent=wxIc(cond,!day)+" "+wxLab(cond,!day); } else { tEl.textContent=""; cEl.textContent=""; }
    // forecast strip — next few hours, from the same data the sky uses
    var fc=root.querySelector(".da-fc");
    if(fc){ var fhtml="", baseH=Math.floor(m/60);
      for(var fk=1;fk<=4;fk++){ var fh=baseH+fk; if(fh>23)break; var fm=fh*60; var fw=wxAt(fm); var fnight=(fm<SUN.sunrise||fm>SUN.sunset);
        var h12=fh%12||12, ap=fh<12?"a":"p"; fhtml+="<span><b>"+wxIc(fw.cond,fnight)+"</b>"+h12+ap+"</span>"; }
      fc.innerHTML=fhtml; }
    root.querySelector(".da-now-l").textContent=stateText(m);
    root.querySelector(".da-next-l").innerHTML=next?"<b>"+next.ic+" "+next.label+"</b> · "+fmt(next.m):"<b>🌙 Rest</b> · until dawn";
    var dl; if(day){var L=SUN.sunset-m;dl="☀️ "+Math.floor(L/60)+"h "+(Math.round(L%60)<10?"0":"")+Math.round(L%60)+"m of daylight left";}
    else if(m<SUN.sunrise){var U=SUN.sunrise-m;dl="☾ sunrise in "+Math.floor(U/60)+"h "+(Math.round(U%60)<10?"0":"")+Math.round(U%60)+"m";}
    else dl="🌙 "+mp.name+" · "+Math.round(mp.illum*100)+"% lit";
    root.querySelector(".da-day-l").textContent=dl;
    var live=$("da_live"); if(live) live.style.display=userScrub?"block":"none";
  }

  function mount(){
    var host=document.getElementById(HOSTID); if(!host)return;
    if(host.firstElementChild && host.firstElementChild.id==="day-arc"){ update(); return; }
    computeAstro(); TASKS=tasks(); userScrub=false;
    var wrap=document.createElement("div"); wrap.id="day-arc";
    wrap.innerHTML='<div class="da-sky"></div>'
      +'<div class="da-head"><div class="da-state">—</div><div class="da-wx"><div class="t"></div><div class="c"></div><div class="da-fc"></div></div></div>'
      +'<div class="da-live" id="da_live">● Now</div>';
    var svgHost=document.createElement("div"); wrap.appendChild(svgHost);
    var tl=document.createElement("div"); tl.className="da-tl";
    tl.innerHTML='<div class="da-tl-track"></div><div class="da-tl-fill" id="da_fill"></div><div class="da-tl-span" id="da_span"></div><span class="da-anchor l">5 AM</span><span class="da-anchor r">11:30 PM</span>';
    wrap.appendChild(tl);
    var foot=document.createElement("div"); foot.className="da-foot";
    foot.innerHTML='<span class="da-now-l">—</span><span class="da-day-l"></span><span class="da-next-l"></span>';
    wrap.appendChild(foot);
    host.insertBefore(wrap, host.firstChild);
    buildSvg(svgHost); buildTimeline(document.getElementById("da_span"));
    wireInput(wrap, tl);
    update();
  }

  function wireInput(wrap, tl){
    var dragging=false, sX=0, sM=0;
    wrap.addEventListener("pointerdown",function(e){ if(e.target.closest(".da-mk")||e.target.closest(".da-live"))return; dragging=true; sX=e.clientX; sM=curM(); wrap.classList.add("grabbing"); try{wrap.setPointerCapture(e.pointerId);}catch(_){ } });
    wrap.addEventListener("pointermove",function(e){ if(!dragging)return; var W=wrap.clientWidth||640; var dt=(e.clientX-sX)/W*1440; userScrub=true; scrubM=Math.max(0,Math.min(1439,sM+dt)); update(); });
    function end(){ dragging=false; wrap.classList.remove("grabbing"); }
    wrap.addEventListener("pointerup",end); wrap.addEventListener("pointercancel",end);
    tl.addEventListener("pointerdown",function(e){ if(e.target.closest(".da-mk"))return; e.stopPropagation(); var r=tl.getBoundingClientRect(); var x=e.clientX-r.left-18,W=r.width-36; var frac=Math.max(0,Math.min(1,x/W)); userScrub=true; scrubM=TL_A+frac*(TL_B-TL_A); update(); });
    var live=document.getElementById("da_live"); if(live) live.addEventListener("click",function(e){ e.stopPropagation(); userScrub=false; update(); });
  }

  // re-mount after every Today render; keep the sun moving; reset to live on tab change
  if(typeof window.renderToday==="function"){ var _o=window.renderToday; window.renderToday=function(){ var r=_o.apply(this,arguments); try{ mount(); }catch(e){} return r; }; }
  setInterval(function(){ try{ if((typeof currentTab==="undefined"||currentTab==="today")){ if(!document.getElementById("day-arc")) mount(); else if(!userScrub) update(); } }catch(e){} }, 30000);
  document.addEventListener("DOMContentLoaded",function(){ setTimeout(function(){ try{mount();}catch(e){} },400); });
  setTimeout(function(){ try{ if(typeof currentTab==="undefined"||currentTab==="today") mount(); }catch(e){} }, 700);
})();