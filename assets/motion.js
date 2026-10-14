/* NexVita AI — movimento (reveal, parallax, demo, vídeo). Só apresentação; não toca no formulário. */
(function(){
  var reduz = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var doc = document.documentElement;

  // Foto do topo: zoom suave de entrada
  requestAnimationFrame(function(){
    document.querySelectorAll(".hero-foto,.foto-topo").forEach(function(el){el.classList.add("ativo")});
  });

  // Reveal on scroll
  var alvos = document.querySelectorAll(".rv,.passos,.demo");
  if (!("IntersectionObserver" in window) || reduz) {
    alvos.forEach(function(el){el.classList.add("visivel");if(el.classList.contains("demo"))el.classList.add("rodando")});
  } else {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var el = e.target;
        el.classList.add("visivel");
        if (el.classList.contains("demo")) iniciaDemo(el);
        io.unobserve(el);
      });
    }, {threshold:0.12, rootMargin:"0px 0px -6% 0px"});
    alvos.forEach(function(el){io.observe(el)});
  }

  // Demo antes → depois: roda e repete a cada 11 s
  function iniciaDemo(el){
    el.classList.add("rodando");
    setInterval(function(){
      if (document.hidden) return;
      el.classList.remove("rodando"); void el.offsetWidth; el.classList.add("rodando");
    }, 11000);
  }

  // Parallax leve em [data-parallax]
  var px = [].slice.call(document.querySelectorAll("[data-parallax]"));
  if (px.length && !reduz) {
    var pend = false;
    function aplica(){
      pend = false;
      var vh = window.innerHeight;
      px.forEach(function(img){
        var box = (img.parentElement || img).getBoundingClientRect();
        if (box.bottom < -200 || box.top > vh + 200) return;
        // f = deslocamento máximo como fração da altura do bloco; progresso limitado a [-1, 1]
        var f = parseFloat(img.getAttribute("data-parallax")) || 0.08;
        var prog = (box.top + box.height/2 - vh/2) / (vh/2 + box.height/2);
        prog = Math.max(-1, Math.min(1, prog));
        img.style.transform = "translate3d(0," + (-prog * f * box.height).toFixed(1) + "px,0)";
      });
    }
    window.addEventListener("scroll", function(){ if(!pend){pend=true;requestAnimationFrame(aplica)} }, {passive:true});
    window.addEventListener("resize", aplica);
    aplica();
  }

  // Vídeo: só toca com clique (com som), sem autoplay
  document.querySelectorAll(".video-moldura").forEach(function(m){
    var v = m.querySelector("video"), b = m.querySelector(".video-play");
    if (!v || !b) return;
    b.addEventListener("click", function(){
      m.classList.add("tocando"); v.setAttribute("controls",""); v.play();
      if (window.gtag) gtag("event","video_play",{video:"r04p"});
    });
  });

  // Esconde o WhatsApp flutuante (criado por site.js) enquanto os botões do topo estão na tela,
  // para não cobrir o CTA no celular. Usa classe própria; não mexe na lógica de site.js.
  var wa = document.querySelector(".nv-wa"), topo = document.querySelector(".hero .acoes, .oferta-topo .acoes");
  if (wa && topo && "IntersectionObserver" in window) {
    new IntersectionObserver(function(es){ wa.classList.toggle("nv-wa-topo", es[0].isIntersecting) }, {threshold:0}).observe(topo);
  }

  // Rastreio dos botões de WhatsApp do conteúdo (o flutuante é rastreado em site.js)
  var pagina = (location.pathname.replace(/\/+$/,"").split("/").pop()) || "inicio";
  document.querySelectorAll("a[data-wa]").forEach(function(a){
    a.addEventListener("click", function(){
      if (window.gtag) gtag("event","contato_whatsapp",{local:a.getAttribute("data-wa"),pagina:pagina});
      if (window.fbq) fbq("track","Contact",{content_name:pagina});
    });
  });
})();
