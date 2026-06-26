(function(){
  "use strict";
  var DACFG=(window.DAYARC_CONFIG||{}); var HOSTID=DACFG.host||"view-today"; var APPENDSEL=DACFG.appendHost||null;
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
    D0=DACFG.demoDate?new Date(DACFG.demoDate):new Date(); N_TODAY=dayOfYear(D0);
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
  // shared compass mapping (E~left → S~center → W~right) so the sun AND moon each sit at their
  // true sky position and visibly diverge whenever they aren't on the same path.
  function sx(az){ var f=(az-45)/(315-45); return PADL+(VW-PADL-PADR)*Math.max(-0.03,Math.min(1.03,f)); }
  function sy(elev){ return HOR-(Math.max(0,elev)/ELEV_REF)*(HOR-TOP); }
  function nightFactor(m){var a=SUN.sunrise-40,b=SUN.sunrise+25,c=SUN.sunset-25,d=SUN.sunset+45;if(m<a||m>d)return 1;if(m>b&&m<c)return 0;if(m>=a&&m<=b)return (b-m)/(b-a);return (m-c)/(d-c);}
  function skyFor(m){var dA=SUN.sunrise-50,dB=SUN.sunrise+22,kA=SUN.sunset-75,kB=SUN.sunset+55;
    if(m<dA||m>kB)return ["#0B1026","#141C40","#26305C"]; if(m<dB)return ["#243156","#8A6486","#F0A766"];
    if(m/60<11)return ["#1E5BA8","#3E86C8","#A8CFEC"]; if(m/60<15)return ["#1A60B6","#3F8FD2","#AAD0EE"];
    if(m<kA)return ["#2A66A6","#5E96C4","#DCCBA6"]; if(m<SUN.sunset)return ["#54487E","#C4796A","#F0A24E"]; return ["#222A58","#5A4670","#C2766A"];}
  function fmt(m){m=((m%1440)+1440)%1440;var h=Math.floor(m/60),mn=Math.floor(m%60),ap=h<12?"AM":"PM",hh=h%12;if(hh===0)hh=12;return hh+":"+(mn<10?"0":"")+mn+" "+ap;}
  function stateText(m){var h=m/60;if(m<SUN.sunrise)return "Before sunrise";if(h<9)return "Early";if(h<12)return "Mid-morning";if(h<14)return "Midday";if(h<17)return "Afternoon";if(m<SUN.sunset)return "Golden hour";if(h<22)return "Evening";return "Late";}

  var RIDGE_BACK=[[0,10.0],[9,11.0],[18,11.0],[27,16.0],[36,20.9],[44,21.9],[53,25.9],[62,29.5],[71,39.5],[80,45.4],[89,45.4],[98,46.7],[107,44.1],[116,37.1],[124,37.1],[133,33.5],[142,32.8],[151,32.8],[160,37.1],[169,44.8],[178,48.1],[187,48.1],[196,48.7],[204,48.7],[213,48.1],[222,44.8],[231,41.4],[240,40.1],[249,41.1],[258,56.3],[267,56.3],[276,56.3],[284,44.8],[293,58.0],[302,44.8],[311,45.1],[320,44.1],[329,45.1],[338,54.0],[347,55.7],[356,54.7],[364,49.7],[373,49.7],[382,47.7],[391,40.1],[400,38.5],[409,35.8],[418,35.8],[427,46.4],[436,51.4],[444,51.4],[453,37.8],[462,34.5],[471,33.8],[480,33.5],[489,30.5],[498,31.5],[507,37.5],[516,49.4],[524,37.5],[533,28.9],[542,28.9],[551,29.9],[560,29.9],[569,24.6],[578,22.2],[587,22.2],[596,24.2],[604,24.9],[613,22.2],[622,19.3],[631,20.6],[640,18.3]];  // real Front Range skyline traced from reference photo (Indian Peaks / Mt Audubon)
  var RIDGE_MID=[[0,5.3],[9,6.0],[18,6.9],[27,8.1],[36,9.6],[44,11.4],[53,13.8],[62,16.2],[71,18.6],[80,20.6],[89,22.1],[98,21.9],[107,21.0],[116,19.9],[124,18.5],[133,17.3],[142,17.3],[151,18.1],[160,19.6],[169,21.1],[178,22.7],[187,23.8],[196,24.2],[204,23.8],[213,23.2],[222,22.3],[231,21.6],[240,22.4],[249,23.5],[258,25.0],[267,25.5],[276,27.2],[284,26.0],[293,24.9],[302,23.7],[311,23.7],[320,23.3],[329,24.4],[338,25.4],[347,25.9],[356,26.4],[364,25.8],[373,24.2],[382,22.6],[391,21.2],[400,19.8],[409,19.7],[418,20.8],[427,22.1],[436,22.3],[444,22.1],[453,20.9],[462,19.1],[471,17.0],[480,16.4],[489,16.7],[498,18.2],[507,18.6],[516,18.5],[524,18.2],[533,17.5],[542,15.5],[551,14.2],[560,13.5],[569,12.9],[578,12.3],[587,11.8],[596,11.6],[604,11.3],[613,11.1],[622,10.5],[631,10.1],[640,9.7]];
  var RIDGE_FRNT=[[0,4.1],[9,4.5],[18,5.0],[27,5.5],[36,6.2],[44,7.4],[53,8.5],[62,9.7],[71,10.6],[80,11.2],[89,11.7],[98,11.9],[107,12.1],[116,11.8],[124,11.6],[133,11.5],[142,11.6],[151,11.7],[160,12.1],[169,12.5],[178,13.0],[187,13.4],[196,13.7],[204,13.8],[213,13.6],[222,13.9],[231,14.2],[240,14.4],[249,14.3],[258,14.6],[267,14.6],[276,14.8],[284,14.9],[293,15.0],[302,15.0],[311,14.9],[320,14.9],[329,15.0],[338,14.8],[347,14.9],[356,14.7],[364,14.5],[373,14.2],[382,13.6],[391,13.3],[400,13.2],[409,13.2],[418,12.8],[427,12.4],[436,12.2],[444,12.0],[453,11.8],[462,11.7],[471,11.4],[480,11.3],[489,10.9],[498,10.6],[507,10.4],[516,10.3],[524,10.1],[533,9.9],[542,9.6],[551,9.1],[560,8.3],[569,7.9],[578,7.6],[587,7.3],[596,7.0],[604,6.6],[613,6.5],[622,6.5],[631,6.5],[640,6.3]];
  var RIDGE_FAR=[[0,16.7],[9,18.3],[18,20.6],[27,23.1],[36,25.1],[44,26.9],[53,28.3],[62,30.3],[71,32.3],[80,34.1],[89,35.4],[98,36.3],[107,37.5],[116,38.9],[124,40.3],[133,41.0],[142,41.3],[151,41.5],[160,41.6],[169,41.7],[178,42.0],[187,42.2],[196,42.8],[204,44.6],[213,46.4],[222,47.9],[231,47.9],[240,48.7],[249,48.4],[258,48.1],[267,47.8],[276,47.6],[284,48.3],[293,49.4],[302,50.5],[311,51.1],[320,50.6],[329,50.0],[338,48.7],[347,48.2],[356,46.5],[364,45.8],[373,45.9],[382,46.5],[391,47.0],[400,45.7],[409,44.1],[418,42.5],[427,41.3],[436,39.8],[444,38.5],[453,38.3],[462,39.2],[471,39.3],[480,38.8],[489,37.4],[498,35.8],[507,34.1],[516,33.1],[524,32.2],[533,31.3],[542,30.6],[551,30.1],[560,29.4],[569,28.0],[578,25.8],[587,24.3],[596,23.9],[604,23.5],[613,22.8],[622,22.1],[631,21.7],[640,21.7]];
  var RIDGE_SCALE=0.55; // lower the ridgelines so the sun rides above the peaks through the afternoon (visual fix for "sun sets too early")

  function add(tag,attrs,parent){ var n=document.createElementNS(SVGNS,tag); if(attrs)for(var k in attrs)n.setAttribute(k,attrs[k]); (parent).appendChild(n); return n; }
  function rangePath(pts){ var d="", n=pts.length, tiles=[-3,-2,-1,0,1,2,3];
    var x0=(-3)*VW+pts[0][0], y0=HOR-pts[0][1]*RIDGE_SCALE;
    d="M "+x0+" "+VH+" L "+x0+" "+y0;
    tiles.forEach(function(t,ti){ var off=t*VW; for(var i=(ti>0?1:0);i<n;i++){ d+=" L "+(pts[i][0]+off)+" "+(HOR-pts[i][1]*RIDGE_SCALE); } });
    var xe=3*VW+pts[n-1][0];
    d+=" L "+xe+" "+VH+" Z"; return d; }
  function pct(m){ return Math.max(0,Math.min(100,((m-TL_A)/(TL_B-TL_A))*100)); }

  var svg,stars=[];
  function buildSvg(host){
    svg=add("svg",{"class":"da-svg",viewBox:"0 0 "+VW+" "+VH,preserveAspectRatio:"xMidYMax meet","aria-hidden":"true"},host);
    var defs=add("defs",null,svg);
    defs.innerHTML='<linearGradient id="da_trail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E0795A"/><stop offset=".5" stop-color="#F5B830"/><stop offset="1" stop-color="#FCE3A6"/></linearGradient>'
      +'<radialGradient id="da_sun"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".32" stop-color="#FFF3C0"/><stop offset=".68" stop-color="#FDBE3B"/><stop offset="1" stop-color="#F39410"/></radialGradient><radialGradient id="da_corona"><stop offset="0" stop-color="#FFE08A" stop-opacity=".85"/><stop offset=".4" stop-color="#FFC247" stop-opacity=".32"/><stop offset="1" stop-color="#FFB020" stop-opacity="0"/></radialGradient>'
      +'<radialGradient id="da_moon" cx="42%" cy="38%" r="64%"><stop offset="0" stop-color="#F6F4EE"/><stop offset=".6" stop-color="#DADCE2"/><stop offset="1" stop-color="#A6ABBA"/></radialGradient>'
      +'<radialGradient id="da_hz"><stop offset="0" stop-color="#FFD089" stop-opacity=".55"/><stop offset="1" stop-color="#FFD089" stop-opacity="0"/></radialGradient>'
      +'<linearGradient id="da_snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6FAFF"/><stop offset=".7" stop-color="#DCE6F6"/><stop offset="1" stop-color="#C2CFE6"/></linearGradient>'
      +'<linearGradient id="da_alpen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC089"/><stop offset=".5" stop-color="#FF9866"/><stop offset="1" stop-color="#FF9866" stop-opacity="0"/></linearGradient>'
      +'<linearGradient id="da_haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FB4D6" stop-opacity="0"/><stop offset="1" stop-color="#9FB4D6" stop-opacity=".22"/></linearGradient>'
      +'<radialGradient id="da_cloud" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="#FBFDFF" stop-opacity=".97"/><stop offset="60%" stop-color="#E9EFF8" stop-opacity=".86"/><stop offset="100%" stop-color="#D6DEEC" stop-opacity="0"/></radialGradient>'
      +'<filter id="da_soft" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="6"/></filter>'
      +'<filter id="da_soft2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>'
      +'<filter id="da_cblur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>'
      +'<radialGradient id="da_bloom"><stop offset="0" stop-color="#FFF6D8" stop-opacity=".6"/><stop offset=".4" stop-color="#FFD98A" stop-opacity=".22"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient>'+'<filter id="da_cloudf" x="-20%" y="-8%" width="140%" height="116%"><feTurbulence type="fractalNoise" baseFrequency="0.009 0.02" numOctaves="5" seed="4" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.4 -1.15"/></filter>'+'<filter id="da_rockf"><feTurbulence type="fractalNoise" baseFrequency="0.05 0.10" numOctaves="4" seed="11" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.1 -0.42"/></filter>'+'<filter id="da_snowf"><feTurbulence type="fractalNoise" baseFrequency="0.07 0.12" numOctaves="3" seed="5" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.8 -0.35"/></filter>'+'<clipPath id="da_mclip"><circle cx="0" cy="0" r="7"/></clipPath>';

    var sg=add("g",{id:"da_stars",opacity:"0"},svg); stars=[];
    add("image",{id:"da_starsimg","href":"images/hdr_stars.webp",x:-VW,y:0,width:3*VW,height:HOR,preserveAspectRatio:"none"},sg);

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
    body.innerHTML='<image id="da_sunimg" href="images/hdr_sun.webp" x="-34" y="-34" width="68" height="68"/>';
    var mb=add("g",{id:"da_mbody",opacity:"0"},svg);
    mb.innerHTML='<image id="da_moonimg" href="images/hdr_moon.webp" x="-13" y="-13" width="26" height="26"/>';

    // clouds — fractal-noise sky clouds, BEHIND the peaks
    var cl=add("g",{id:"da_clouds",opacity:"0","class":"da-anim"},svg);
    var clw=add("g",{},cl);
    add("rect",{x:-2*VW,y:1,width:5*VW,height:46,fill:"#ffffff",filter:"url(#da_cloudf)"},clw);
    add("animateTransform",{attributeName:"transform",type:"translate",from:"0 0",to:VW+" 0",dur:"260s",repeatCount:"indefinite"},clw);

    // mountains come from the real photo layer (.da-mtns), added in mount()


    // (clouds are rendered behind the mountains, above)
    var rn=add("g",{id:"da_rain",opacity:"0","class":"da-anim"},svg);
    var RAIN_X0=-1.5*VW, RAIN_SPAN=4*VW; // tile rain across the FULL header width (the 640 viewBox is meet-centered inside a much wider header)
    for(var ri=0;ri<150;ri++){ var rx=RAIN_X0+Math.random()*RAIN_SPAN,ry=4+Math.random()*Math.max(20,HOR-6),len=5+Math.random()*6,op=(.22+Math.random()*.4).toFixed(2);
      var ln=add("line",{x1:rx.toFixed(1),y1:ry.toFixed(1),x2:(rx-2).toFixed(1),y2:(ry+len).toFixed(1),stroke:"rgba(202,220,246,"+op+")","stroke-width":(Math.random()<.3?"1.1":"0.7")},rn);
      add("animateTransform",{attributeName:"transform",type:"translate",from:"0 -16",to:"5 24",dur:(.4+Math.random()*.35).toFixed(2)+"s",begin:(-Math.random()).toFixed(2)+"s",repeatCount:"indefinite"},ln); }
  }

  var TASKS=[];
  function buildTimeline(span){
    span.innerHTML="";
    TASKS.forEach(function(t){ var mk=document.createElement("div"); mk.className="da-mk"; mk.style.left=pct(t.m)+"%"; mk.style.setProperty("--mc",t.color); mk.dataset.m=t.m; mk.title=t.label+" · "+fmt(t.m);
      mk.innerHTML='<span class="ic">'+t.ic+'</span><span class="dot"></span>';
      mk.addEventListener("click",function(ev){ ev.stopPropagation(); jumpTo(t.find); });
      span.appendChild(mk); });
    var nl=document.createElement("div"); nl.className="da-tl-now"; nl.id="da_now"; span.appendChild(nl);
  }

  function jumpTo(find){ try{ var host=document.getElementById(HOSTID); if(!host)return; var all=host.querySelectorAll("div"),target=null;
    for(var i=0;i<all.length;i++){ var n=all[i]; if(n.closest&&n.closest("#day-arc"))continue; var t=(n.textContent||"").toLowerCase(); if(t.indexOf(find)!==-1 && n.offsetHeight<260){ target=n; break; } }
    if(target){ window.scrollTo({top:target.getBoundingClientRect().top+window.pageYOffset-70,behavior:"smooth"}); var os=target.style.boxShadow; target.style.transition="box-shadow .4s"; target.style.boxShadow="0 0 0 2px rgba(240,168,32,.6)"; setTimeout(function(){target.style.boxShadow=os;},1100); } }catch(e){} }

  var $=function(id){return document.getElementById(id);};
  var userScrub=false, scrubM=0;
  function liveMin(){ var d=new Date(); return d.getHours()*60+d.getMinutes()+d.getSeconds()/60; }
  function curM(){ if(userScrub) return scrubM; if(DACFG.demoMin!=null) return DACFG.demoMin; return liveMin(); }

  function update(){
    var root=$("day-arc"); if(!root||!svg)return;
    var m=curM(), sp=solar(m,N_TODAY), day=sp.elev>-0.5, w=wxAt(m), cond=w.cond, nf=nightFactor(m);
    var sky=skyFor(m);
    var bg="linear-gradient(180deg, "+(sky.length>2?sky[0]+" 0%, "+sky[1]+" 52%, "+sky[2]+" 100%":sky[0]+" 0%, "+sky[1]+" 100%")+")";
    if(cond==="rain") bg="linear-gradient(rgba(18,24,40,.46),rgba(18,24,40,.46)), "+bg;
    else if(cond==="cloudy") bg="linear-gradient(rgba(120,128,142,.24),rgba(86,92,108,.2)), "+bg;
    root.querySelector(".da-sky").style.background=bg;
    // CRITICAL: when embedded in the app header, the header's own dark gradient paints over .da-sky.
    // Paint the sky straight onto the header element so it's always the visible background.
    if(root.classList.contains("da-inheader") && root.parentElement){ root.parentElement.style.setProperty("background", bg, "important"); }

    if($("da_stars")) $("da_stars").setAttribute("opacity",nf.toFixed(2));
    if($("da_clouds")) $("da_clouds").setAttribute("opacity",((cond==="clear"?0:cond==="partly"?.55:cond==="cloudy"?.95:.85)*(1-nf*.45)).toFixed(2));
    if($("da_rain")) $("da_rain").setAttribute("opacity",cond==="rain"?"1":"0");
    var _mt=root.querySelector(".da-mtns"); if(_mt){ _mt.style.filter="brightness("+(1-nf*0.62).toFixed(2)+") saturate("+(1-nf*0.4).toFixed(2)+")"; }

    // sun
    var body=$("da_body"),halo=$("da_halo"),bx=0,by=0;
    if(day){ bx=sx(sp.az); by=sy(sp.elev); if(halo)halo.setAttribute("opacity",(0.14+0.26*(sp.elev/SUN.maxElev)).toFixed(2)); body.style.opacity="1"; body.setAttribute("transform","translate("+bx+","+by+")");
      if($("da_hglow")){ $("da_hglow").setAttribute("cx",bx); $("da_hglow").setAttribute("opacity",(Math.max(0,1-sp.elev/14)*.9).toFixed(2)); }
    } else { body.style.opacity="0"; if($("da_hglow"))$("da_hglow").setAttribute("opacity","0"); }
    // moon
    var mp=moonPos(D0,m), mB=$("da_mbody");
    if(mB){ if(mp.alt>0){ mB.setAttribute("transform","translate("+sx(mp.az)+","+sy(mp.alt)+")");
        var sh=$("da_msh"); if(sh){ sh.setAttribute("cx",(mp.waxing?-2.6:2.6).toString()); sh.setAttribute("rx",(6.5*(1-mp.illum)+.5).toFixed(1)); sh.setAttribute("opacity",".92"); }
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
    if(nx){ if(next){ nx.style.display="block"; var np=pct(next.m); nx.style.left=np+"%"; nx.style.transform=np>80?"translateX(-100%)":np<14?"translateX(0)":"translateX(-50%)"; nx.style.marginLeft=np>80?"10px":np<14?"-10px":"0"; nx.innerHTML=next.ic+" "+next.label+" · "+fmt(next.m).replace(":00",""); } else nx.style.display="none"; }

    // overlay + foot
    var stEl=root.querySelector(".da-state"); if(stEl) stEl.textContent=stateText(m);
    var tEl=root.querySelector(".da-wx .t"), cEl=root.querySelector(".da-wx .c");
    if(tEl){ if(w.temp!=null){ tEl.textContent=w.temp+"°"; cEl.textContent=wxIc(cond,!day)+" "+wxLab(cond,!day); } else { tEl.textContent=""; cEl.textContent=""; } }
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
      +(append?'':'<div class="da-head"><div class="da-state">—</div><div class="da-wx"><div class="t"></div><div class="c"></div><div class="da-fc"></div></div></div>')
      +'';
    var svgHost=document.createElement("div"); svgHost.className="da-svgwrap"; wrap.appendChild(svgHost);
    var mtns=document.createElement("div"); mtns.className="da-mtns"; mtns.style.cssText="position:absolute;left:0;right:0;top:0;bottom:94px;z-index:1;background:url(\'images/hdr_mountains.webp\') no-repeat center top;background-size:cover;pointer-events:none"; wrap.appendChild(mtns);
    var tl=document.createElement("div"); tl.className="da-tl";
    tl.innerHTML='<div class="da-tl-track"></div><div class="da-tl-fill" id="da_fill"></div><div class="da-tl-span" id="da_span"></div><span class="da-anchor l">5 AM</span><span class="da-anchor r">11:30 PM</span>';
    wrap.appendChild(tl);
    var foot=document.createElement("div"); foot.className="da-foot";
    foot.innerHTML='<span class="da-now-l">—</span><span class="da-day-l"></span><span class="da-next-l"></span>';
    wrap.appendChild(foot);
    if(append) host.appendChild(wrap); else host.insertBefore(wrap, host.firstChild);
    buildSvg(svgHost); buildTimeline(document.getElementById("da_span"));
    wireInput(wrap, tl);
    update();
  }

  function wireInput(wrap, tl){
    var dragging=false, sX=0, sM=0;
    wrap.addEventListener("pointerdown",function(e){ if(e.target.closest(".da-mk")||e.target.closest(".da-live")||e.target.closest(".da-foot")||e.target.closest(".da-tl"))return; dragging=true; sX=e.clientX; sM=curM(); wrap.classList.add("grabbing"); try{wrap.setPointerCapture(e.pointerId);}catch(_){ } });
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

  // re-mount after every Today render; keep the sun moving; reset to live on tab change
  if(typeof window.renderToday==="function"){ var _o=window.renderToday; window.renderToday=function(){ var r=_o.apply(this,arguments); try{ mount(); }catch(e){} return r; }; }
  setInterval(function(){ try{ if(APPENDSEL||typeof currentTab==="undefined"||currentTab==="today"){ if(!document.getElementById("day-arc")) mount(); else if(!userScrub) update(); } }catch(e){} }, 30000);
  document.addEventListener("DOMContentLoaded",function(){ setTimeout(function(){ try{mount();}catch(e){} },400); });
  setTimeout(function(){ try{ mount(); }catch(e){} }, 700);
})();
