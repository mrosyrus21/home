(function(){
  "use strict";
  var DACFG=(window.DAYARC_CONFIG||{}); var HOSTID=DACFG.host||"view-today"; var APPENDSEL=DACFG.appendHost||null;
  var ASSET=(DACFG.assets||"dayarc-assets")+"/";
  var LAT=(DACFG.lat!=null?DACFG.lat:39.78), LNG=(DACFG.lng!=null?DACFG.lng:-104.75), RAD=Math.PI/180;
  var TZ=-(new Date().getTimezoneOffset())/60;   // user's local tz (Denver = -6/-7)

  // ---------- astronomy (unchanged) ----------
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

  var N_TODAY, SUN, MOONPATH, D0;
  function computeAstro(){
    D0=DACFG.demoDate?new Date(DACFG.demoDate):new Date(); N_TODAY=dayOfYear(D0);
    var prev=solar(0,N_TODAY).elev,sr=null,ss=null,peak=-90,pm=720;
    for(var m=1;m<=1440;m++){var e=solar(m,N_TODAY).elev; if(prev<0&&e>=0&&sr===null)sr=m; if(prev>=0&&e<0&&sr!==null&&ss===null)ss=m; if(e>peak){peak=e;pm=m;} prev=e;}
    if(sr===null)sr=336; if(ss===null)ss=1230;
    SUN={sunrise:sr,sunset:ss,noon:pm,azRise:solar(sr,N_TODAY).az,azSet:solar(ss,N_TODAY).az,maxElev:peak};
    MOONPATH=[]; var seg=null;
    for(var mm=0;mm<=1440;mm+=4){var p=moonPos(D0,mm); if(p.alt>0){ if(!seg){seg=[];MOONPATH.push(seg);} seg.push([mm,p.az,p.alt]); } else seg=null; }
  }
  // current moon up-period (rise->set minutes + peak altitude) so the moon traces a real arc, not a vertical drop
  function moonArc(m){ for(var i=0;i<MOONPATH.length;i++){ var seg=MOONPATH[i]; var a=seg[0][0], b=seg[seg.length-1][0];
      if(m>=a-25 && m<=b+25){ var mx=0; for(var j=0;j<seg.length;j++){ if(seg[j][2]>mx)mx=seg[j][2]; } return {rise:a,set:b,maxAlt:mx}; } } return null; }

  // ---------- reminders (unchanged data wiring) ----------
  function parseClock(s){ if(!s)return null; var m=String(s).match(/(\d{1,2}):(\d{2})\s*([AP]M)?/i); if(!m)return null;
    var h=+m[1],mn=+m[2],ap=(m[3]||"").toUpperCase(); if(ap==="PM"&&h<12)h+=12; if(ap==="AM"&&h===12)h=0; return h*60+mn; }
  function tasks(){
    if(DACFG.tasks) return DACFG.tasks.slice().sort(function(a,b){return a.m-b.m;});
    var RY=(typeof RHYTHM!=="undefined"&&RHYTHM)?RHYTHM:{breakfast:"8:00 AM",lunch:"12:30 PM",dinner:"6:30 PM",windDown:"10:00 PM",lightsOut:"11:00 PM"};
    function pc(s,f){var v=parseClock(s);return v==null?f:v;}
    return [
      {m:pc(RY.breakfast,480), ic:"\u{1F373}", label:"Breakfast", color:"#C084FC", find:"breakfast"},
      {m:pc(RY.lunch,750),     ic:"\u{1F957}", label:"Lunch",     color:"#2DB870", find:"lunch"},
      {m:pc(RY.dinner,1110),   ic:"\u{1F37D}️", label:"Dinner", color:"#C084FC", find:"dinner"},
      {m:pc(RY.windDown,1320), ic:"\u{1F319}", label:"Wind-down", color:"#A78BFA", find:"wind"},
      {m:pc(RY.lightsOut,1380),ic:"\u{1F6CF}️", label:"Bedtime", color:"#38BDF8", find:"bedtime"}
    ].filter(function(t){return t.m!=null;}).sort(function(a,b){return a.m-b.m;});
  }
  var TL_A=0, TL_B=24*60;   // full 24-hour timeline (midnight to midnight)

  // ---------- weather: WMO code -> condition + intensity, read hourly from WXF ----------
  function codeToCond(c){ if(c==null)return "clear"; if(c>=95)return "rain"; if((c>=71&&c<=77)||(c>=85&&c<=86))return "snow";
    if((c>=51&&c<=67)||(c>=80&&c<=82))return "rain"; if(c>=45&&c<=48)return "cloudy"; if(c===3)return "cloudy"; if(c>=1)return "partly"; return "clear"; }
  function wxAt(min){ var h=Math.floor(((min%1440)+1440)%1440/60); var code=null,temp=null;
    if(DACFG.hourly){ var hw=DACFG.hourly[h%DACFG.hourly.length]; return {cond:codeToCond(hw.code),temp:(hw.temp!=null?hw.temp:null),code:hw.code}; }
    if(typeof WXF!=="undefined"&&WXF.ready){ if(WXF.hourlyCodes&&WXF.hourlyCodes.length>h){code=WXF.hourlyCodes[h];temp=WXF.hourlyTemp?WXF.hourlyTemp[h]:WXF.temp;} else {code=WXF.code;temp=WXF.temp;} }
    return {cond:codeToCond(code),temp:temp,code:code}; }
  // intensity levels for the photo layers: cloud 0-3, rain 0-3, snow 0-3
  function wxLevel(w){ var c=w.code, cond=w.cond, cl=0,rn=0,sn=0;
    if(cond==="partly")cl=1; else if(cond==="cloudy")cl=3; else if(cond==="rain"||cond==="snow")cl=2;
    if(cond==="rain"){ rn = (c===51||c===56||c===61||c===80)?1 : (c===55||c===57||c===65||c===67||c===82||c>=95)?3 : 2; }
    if(cond==="snow"){ sn = (c===71||c===77||c===85)?1 : (c===75||c===86)?3 : 2; }
    return {cloud:cl,rain:rn,snow:sn}; }
  function wxIc(cond,night){ return cond==="rain"?"⛈️":cond==="snow"?"\u{1F328}️":cond==="cloudy"?"☁️":cond==="partly"?(night?"\u{1F319}":"⛅"):(night?"\u{1F319}":"☀️"); }
  function wxLab(cond,night){ return cond==="rain"?"Rain":cond==="snow"?"Snow":cond==="cloudy"?"Overcast":cond==="partly"?"Partly cloudy":(night?"Clear":"Clear"); }

  // ---------- scene helpers ----------
  function nightFactor(m){var a=SUN.sunrise-40,b=SUN.sunrise+25,c=SUN.sunset-25,d=SUN.sunset+45;if(m<a||m>d)return 1;if(m>b&&m<c)return 0;if(m>=a&&m<=b)return (b-m)/(b-a);return (m-c)/(d-c);}
  function skyFor(m){var dA=SUN.sunrise-50,dB=SUN.sunrise+22,kA=SUN.sunset-75,kB=SUN.sunset+55;
    if(m<dA||m>kB)return ["#0A0E22","#141C40","#26305C"]; if(m<dB)return ["#243156","#8A6486","#F0A766"];
    if(m/60<11)return ["#1E5BA8","#3E86C8","#A8CFEC"]; if(m/60<15)return ["#1A60B6","#3F8FD2","#AAD0EE"];
    if(m<kA)return ["#2A66A6","#5E96C4","#DCCBA6"]; if(m<SUN.sunset)return ["#54487E","#C4796A","#F0A24E"]; return ["#222A58","#5A4670","#C2766A"];}
  function fmt(m){m=((m%1440)+1440)%1440;var h=Math.floor(m/60),mn=Math.floor(m%60),ap=h<12?"AM":"PM",hh=h%12;if(hh===0)hh=12;return hh+":"+(mn<10?"0":"")+mn+" "+ap;}
  function stateText(m){var h=m/60;if(m<SUN.sunrise)return "Before sunrise";if(h<9)return "Early";if(h<12)return "Mid-morning";if(h<14)return "Midday";if(h<17)return "Afternoon";if(m<SUN.sunset)return "Golden hour";if(h<22)return "Evening";return "Late";}
  function pct(m){ return Math.max(0,Math.min(100,((m-TL_A)/(TL_B-TL_A))*100)); }

  // photo geometry: sky position -> scene %. Sun/moon set behind the mountain ridge.
  var HORIZON=0.52;   // ridge line as a fraction of scene height (sun/moon hit elev 0 here)
  function posLeftPct(az){ var f=(az-60)/240; return 4+Math.max(-0.06,Math.min(1.06,f))*92; }

  // ---------- build the photo scene ----------
  var sceneHost=null, E={};
  function mk(parent,cls){ var d=document.createElement("div"); d.className=cls; parent.appendChild(d); return d; }
  function buildScene(host){
    sceneHost=host; host.innerHTML=""; host.classList.add("da-scene");
    E.stars=mk(host,"da-stars"); E.stars.style.backgroundImage="url('"+ASSET+"stars.jpg')";
    E.sun=mk(host,"da-sun");  E.sun.innerHTML='<img src="'+ASSET+'sun.png" alt="">';
    E.moon=mk(host,"da-moon"); E.moon.innerHTML='<img src="'+ASSET+'moon.png" alt="">';
    E.clouds=mk(host,"da-clouds-layer");
    E.mtnDay=mk(host,"da-mtn"); E.mtnDay.style.backgroundImage="url('"+ASSET+"mtn-day.png')";
    E.mtnDusk=mk(host,"da-mtn"); E.mtnDusk.style.backgroundImage="url('"+ASSET+"mtn-dusk.png')"; E.mtnDusk.style.opacity="0";
    E.mtnNight=mk(host,"da-mtn"); E.mtnNight.style.backgroundImage="url('"+ASSET+"mtn-night.png')"; E.mtnNight.style.opacity="0";
    E.rain=mk(host,"da-rain-layer");
    E.snow=mk(host,"da-snow-layer");
  }

  var TASKS=[];
  function buildTimeline(span){
    span.innerHTML="";
    TASKS.forEach(function(t){ var mk2=document.createElement("div"); mk2.className="da-mk"; mk2.style.left=pct(t.m)+"%"; mk2.style.setProperty("--mc",t.color); mk2.dataset.m=t.m; mk2.title=t.label+" · "+fmt(t.m);
      mk2.innerHTML='<span class="ic">'+t.ic+'</span><span class="dot"></span>';
      mk2.addEventListener("click",function(ev){ ev.stopPropagation(); jumpTo(t.find); });
      span.appendChild(mk2); });
    var nl=document.createElement("div"); nl.className="da-tl-now"; nl.id="da_now"; span.appendChild(nl);
  }

  function jumpTo(find){ try{ var host=document.getElementById(HOSTID); if(!host)return; var all=host.querySelectorAll("div"),target=null;
    for(var i=0;i<all.length;i++){ var n=all[i]; if(n.closest&&n.closest("#day-arc"))continue; var t=(n.textContent||"").toLowerCase(); if(t.indexOf(find)!==-1 && n.offsetHeight<260){ target=n; break; } }
    if(target){ window.scrollTo({top:target.getBoundingClientRect().top+window.pageYOffset-70,behavior:"smooth"}); var os=target.style.boxShadow; target.style.transition="box-shadow .4s"; target.style.boxShadow="0 0 0 2px rgba(240,168,32,.6)"; setTimeout(function(){target.style.boxShadow=os;},1100); } }catch(e){} }

  var $=function(id){return document.getElementById(id);};
  var userScrub=false, scrubM=0;
  function liveMin(){ var d=new Date(); return d.getHours()*60+d.getMinutes()+d.getSeconds()/60; }
  function curM(){ if(userScrub) return scrubM; if(DACFG.demoMin!=null) return DACFG.demoMin; return liveMin(); }

  var CLOUD_FILE=["","clouds-light.png","clouds-medium.png","clouds-overcast.png"];
  var RAIN_FILE=["","rain-light.png","rain-medium.png","rain-heavy.png"];
  var SNOW_FILE=["","snow-light.png","snow-medium.png","snow-heavy.png"];

  function update(){
    var root=$("day-arc"); if(!root||!sceneHost)return;
    var m=curM(), sp=solar(m,N_TODAY), day=sp.elev>-0.8, w=wxAt(m), cond=w.cond, nf=nightFactor(m);
    var lv=wxLevel(w), night=(m<SUN.sunrise||m>SUN.sunset);

    var sky=skyFor(m);
    var bg="linear-gradient(180deg, "+sky[0]+" 0%, "+sky[1]+" 52%, "+sky[2]+" 100%)";
    if(cond==="rain") bg="linear-gradient(rgba(18,24,40,.5),rgba(18,24,40,.5)), "+bg;
    else if(cond==="cloudy") bg="linear-gradient(rgba(120,128,142,.26),rgba(86,92,108,.22)), "+bg;
    else if(cond==="snow") bg="linear-gradient(rgba(150,160,180,.28),rgba(120,130,150,.22)), "+bg;
    var skyEl=root.querySelector(".da-sky"); if(skyEl) skyEl.style.background=bg;
    if(root.classList.contains("da-inheader") && root.parentElement){ root.parentElement.style.setProperty("background", bg, "important"); }

    var W=sceneHost.clientWidth||640, H=sceneHost.clientHeight||(W*0.34); if(H<10)H=W*0.34;
    var ridge=H*HORIZON, topPad=H*0.06;
    function arcXY(p,peak){ var x=4+p*92; if(p>1)x+=(p-1)*240; else if(p<0)x+=p*240;
      var y; if(p>=0&&p<=1){ y=ridge - Math.sin(p*Math.PI)*(ridge-topPad)*peak; }
      else { var bel=(p>1)?(p-1):(-p); y=ridge + Math.min(1,bel/0.045)*(H-ridge+H*0.12); } return [x,y]; }

    if(E.stars) E.stars.style.opacity=nf.toFixed(2);
    // mountain set cross-fade: day layer always opaque underneath, dusk+night fade on top -> never blanks on a swap
    if(E.mtnDusk) E.mtnDusk.style.opacity=Math.max(0,Math.min(1,(nf-0.10)/0.20)).toFixed(2);
    if(E.mtnNight) E.mtnNight.style.opacity=Math.max(0,Math.min(1,(nf-0.45)/0.30)).toFixed(2);

    if(E.sun){ if(sp.elev>-9){ var ss=Math.max(24,Math.min(H*0.55,W*0.15)); E.sun.style.width=ss+"px"; E.sun.style.height=ss+"px";
        var pS=(m-SUN.sunrise)/Math.max(1,SUN.sunset-SUN.sunrise), sPk=Math.min(1,Math.max(0.4,SUN.maxElev/70)), xyS=arcXY(pS,sPk);
        E.sun.style.left=xyS[0]+"%"; E.sun.style.top=xyS[1]+"px"; E.sun.style.opacity="1"; }
      else E.sun.style.opacity="0"; }
    var mp=moonPos(D0,m), marc=moonArc(m);
    if(E.moon){ if(mp.alt>-9 && marc){ var ms=Math.max(15,Math.min(H*0.34,W*0.09)); E.moon.style.width=ms+"px"; E.moon.style.height=ms+"px";
        var pM=(m-marc.rise)/Math.max(1,marc.set-marc.rise), mPk=Math.min(1,Math.max(0.35,marc.maxAlt/70)), xyM=arcXY(pM,mPk);
        E.moon.style.left=xyM[0]+"%"; E.moon.style.top=xyM[1]+"px";
        E.moon.style.opacity=(day?0.35:(nf>0.15?1:0.4)).toFixed(2); }
      else E.moon.style.opacity="0"; }

    var cl=lv.cloud; if(cl<1 && (cond==="rain"||cond==="snow")) cl=2;
    if(E.clouds){ if(cl>0){ E.clouds.style.backgroundImage="url('"+ASSET+CLOUD_FILE[cl]+"')";
        if(cl>=3){ E.clouds.style.backgroundSize="cover"; E.clouds.style.backgroundPosition="center"; E.clouds.style.backgroundRepeat="no-repeat"; E.clouds.classList.remove("drift"); E.clouds.style.opacity=(0.95*(1-nf*0.18)).toFixed(2); }
        else { E.clouds.style.backgroundSize="520px auto"; E.clouds.style.backgroundPosition="0 6%"; E.clouds.style.backgroundRepeat="repeat-x"; E.clouds.classList.add("drift"); E.clouds.style.opacity=([0,.6,.85][cl]*(1-nf*0.3)).toFixed(2); } }
      else { E.clouds.style.opacity="0"; E.clouds.classList.remove("drift"); } }
    if(E.rain){ if(lv.rain>0){ E.rain.style.backgroundImage="url('"+ASSET+RAIN_FILE[lv.rain]+"')";
        E.rain.style.opacity=[0,.34,.52,.72][lv.rain]; E.rain.classList.add("on"); }
      else { E.rain.style.opacity="0"; E.rain.classList.remove("on"); } }
    if(E.snow){ if(lv.snow>0){ E.snow.style.backgroundImage="url('"+ASSET+SNOW_FILE[lv.snow]+"')";
        E.snow.style.opacity=[0,.7,.9,1][lv.snow]; E.snow.classList.add("on"); }
      else { E.snow.style.opacity="0"; E.snow.classList.remove("on"); } }

    var tl=root.querySelector(".da-tl"), trackW=Math.max(0,tl.clientWidth-36);
    $("da_fill").style.width=((pct(m)/100)*trackW).toFixed(1)+"px";
    $("da_now").style.left=pct(m)+"%";
    var next=null; for(var ti=0;ti<TASKS.length;ti++){ if(TASKS[ti].m>m){next=TASKS[ti];break;} }
    var mks=root.querySelectorAll(".da-mk"); for(var mi=0;mi<mks.length;mi++){ var em=+mks[mi].dataset.m; mks[mi].classList.toggle("past",em<=m); mks[mi].classList.toggle("next",!!next&&em===next.m); }
    var nx=$("da_next");
    if(nx){ if(next){ nx.style.display="block"; var np=pct(next.m); nx.style.left=np+"%"; nx.style.transform=np>80?"translateX(-100%)":np<14?"translateX(0)":"translateX(-50%)"; nx.style.marginLeft=np>80?"10px":np<14?"-10px":"0"; nx.innerHTML=next.ic+" "+next.label+" · "+fmt(next.m).replace(":00",""); } else nx.style.display="none"; }

    var stEl=root.querySelector(".da-state"); if(stEl) stEl.textContent=stateText(m);
    var tEl=root.querySelector(".da-wx .t"), cEl=root.querySelector(".da-wx .c");
    if(tEl){ if(w.temp!=null){ tEl.textContent=w.temp+"°"; cEl.textContent=wxIc(cond,!day)+" "+wxLab(cond,!day); } else { tEl.textContent=""; cEl.textContent=""; } }
    var fc=root.querySelector(".da-fc");
    if(fc){ var fhtml="", baseH=Math.floor(m/60);
      for(var fk=1;fk<=4;fk++){ var fh=baseH+fk; if(fh>23)break; var fm=fh*60; var fw=wxAt(fm); var fnight=(fm<SUN.sunrise||fm>SUN.sunset);
        var h12=fh%12||12, ap=fh<12?"a":"p"; fhtml+="<span><b>"+wxIc(fw.cond,fnight)+"</b>"+h12+ap+"</span>"; }
      fc.innerHTML=fhtml; }

    root.querySelector(".da-now-l").textContent=stateText(m);
    root.querySelector(".da-next-l").innerHTML=next?"<b>"+next.ic+" "+next.label+"</b> · "+fmt(next.m):"<b>\u{1F319} Rest</b> · until dawn";
    var dl; if(day){var L=SUN.sunset-m;dl="☀️ "+Math.floor(L/60)+"h "+(Math.round(L%60)<10?"0":"")+Math.round(L%60)+"m of daylight left";}
    else if(m<SUN.sunrise){var U=SUN.sunrise-m;dl="☾ sunrise in "+Math.floor(U/60)+"h "+(Math.round(U%60)<10?"0":"")+Math.round(U%60)+"m";}
    else dl="\u{1F319} "+mp.name+" · "+Math.round(mp.illum*100)+"% lit";
    var dEl=root.querySelector(".da-day-l");
    if(userScrub){ dEl.innerHTML="↩ Go to NOW"; dEl.classList.add("da-gonow"); }
    else { dEl.textContent=dl; dEl.classList.remove("da-gonow"); }
  }

  function mount(){
    var append=!!APPENDSEL, host=append?document.querySelector(APPENDSEL):document.getElementById(HOSTID);
    if(!host)return;
    if(document.getElementById("day-arc")){ update(); return; }
    computeAstro(); TASKS=tasks(); userScrub=false;
    var wrap=document.createElement("div"); wrap.id="day-arc"; if(append) wrap.className="da-inheader";
    wrap.innerHTML='<div class="da-sky"></div>'
      +(append?'':'<div class="da-head"><div class="da-state">—</div><div class="da-wx"><div class="t"></div><div class="c"></div><div class="da-fc"></div></div></div>');
    var svgHost=document.createElement("div"); svgHost.className="da-svgwrap"; wrap.appendChild(svgHost);
    var tl=document.createElement("div"); tl.className="da-tl";
    tl.innerHTML='<div class="da-tl-track"></div><div class="da-tl-fill" id="da_fill"></div><div class="da-tl-span" id="da_span"></div><span class="da-anchor l">12 AM</span><span class="da-anchor r">12 AM</span>';
    wrap.appendChild(tl);
    var foot=document.createElement("div"); foot.className="da-foot";
    foot.innerHTML='<span class="da-now-l">—</span><span class="da-day-l"></span><span class="da-next-l"></span>';
    wrap.appendChild(foot);
    if(append) host.appendChild(wrap); else host.insertBefore(wrap, host.firstChild);
    buildScene(svgHost); buildTimeline(document.getElementById("da_span"));
    wireInput(wrap, tl);
    update();
  }

  function wireInput(wrap, tl){
    var dragging=false, sX=0, sM=0;
    wrap.addEventListener("pointerdown",function(e){ if(e.target.closest(".da-mk")||e.target.closest(".da-foot")||e.target.closest(".da-tl"))return; dragging=true; sX=e.clientX; sM=curM(); wrap.classList.add("grabbing"); try{wrap.setPointerCapture(e.pointerId);}catch(_){ } });
    wrap.addEventListener("pointermove",function(e){ if(!dragging)return; var W=wrap.clientWidth||640; var dt=(e.clientX-sX)/W*1440; userScrub=true; scrubM=Math.max(0,Math.min(1439,sM+dt)); update(); });
    function end(){ dragging=false; wrap.classList.remove("grabbing"); }
    wrap.addEventListener("pointerup",end); wrap.addEventListener("pointercancel",end);
    var tld=false;
    function seekTl(cx){ var r=tl.getBoundingClientRect(); var x=cx-r.left-18,W=r.width-36; var frac=Math.max(0,Math.min(1,x/W)); userScrub=true; scrubM=TL_A+frac*(TL_B-TL_A); update(); }
    tl.addEventListener("pointerdown",function(e){ if(e.target.closest(".da-mk"))return; e.stopPropagation(); tld=true; try{tl.setPointerCapture(e.pointerId);}catch(_){ } seekTl(e.clientX); });
    tl.addEventListener("pointermove",function(e){ if(tld) seekTl(e.clientX); });
    tl.addEventListener("pointerup",function(){ tld=false; });
    tl.addEventListener("pointercancel",function(){ tld=false; });
    var dEl2=wrap.querySelector(".da-day-l"); if(dEl2) dEl2.addEventListener("click",function(e){ if(!userScrub)return; e.stopPropagation(); userScrub=false; update(); });
  }

  if(typeof window.renderToday==="function"){ var _o=window.renderToday; window.renderToday=function(){ var r=_o.apply(this,arguments); try{ mount(); }catch(e){} return r; }; }
  setInterval(function(){ try{ if(APPENDSEL||typeof currentTab==="undefined"||currentTab==="today"){ if(!document.getElementById("day-arc")) mount(); else if(!userScrub) update(); } }catch(e){} }, 30000);
  document.addEventListener("DOMContentLoaded",function(){ setTimeout(function(){ try{mount();}catch(e){} },400); });
  setTimeout(function(){ try{ mount(); }catch(e){} }, 700);
})();
