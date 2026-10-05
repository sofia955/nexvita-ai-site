/* NexVita AI — consentimento de cookies (LGPD).
   Nada de medição é carregado antes de o visitante aceitar.
   Escolha guardada em localStorage "nv_consent" = "sim" | "nao". */
(function(){
  var GA_ID="G-KE4MM800WH", KEY="nv_consent";
  function get(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function set(v){try{localStorage.setItem(KEY,v)}catch(e){}}

  function loadGA(){
    if(window.__nvGA)return; window.__nvGA=1;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){dataLayer.push(arguments)};
    gtag("js",new Date());
    gtag("config",GA_ID,{anonymize_ip:true});
    var s=document.createElement("script");
    s.async=true; s.src="https://www.googletagmanager.com/gtag/js?id="+GA_ID;
    document.head.appendChild(s);
  }

  function banner(){
    if(document.getElementById("nv-cookies"))return;
    var priv=(document.querySelector('a[href$="privacidade/"]')||{}).getAttribute
      ? document.querySelector('a[href$="privacidade/"]').getAttribute("href") : "/privacidade/";
    var b=document.createElement("div");
    b.id="nv-cookies"; b.setAttribute("role","dialog"); b.setAttribute("aria-label","Aviso de cookies");
    b.innerHTML='<p>Usamos cookies de medição (Google Analytics) para entender o uso do site, só com a sua permissão. '+
      '<a href="'+priv+'">Política de privacidade</a>.</p>'+
      '<div class="nv-cookies-acoes"><button type="button" class="nv-recusar">Recusar</button>'+
      '<button type="button" class="nv-aceitar">Aceitar</button></div>';
    document.body.appendChild(b);
    b.querySelector(".nv-aceitar").onclick=function(){set("sim");b.remove();loadGA()};
    b.querySelector(".nv-recusar").onclick=function(){set("nao");b.remove()};
  }

  function init(){
    var c=get();
    if(c==="sim")loadGA(); else if(c!=="nao")banner();
    document.querySelectorAll("[data-cookies]").forEach(function(a){
      a.addEventListener("click",function(ev){ev.preventDefault();
        try{localStorage.removeItem(KEY)}catch(e){}
        if(window.__nvGA){location.reload();return}
        banner();});
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init); else init();
})();
