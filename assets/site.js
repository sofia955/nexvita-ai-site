/* NexVita AI — formulário e atribuição de campanha.
   Enquanto não houver endpoint configurado, o envio abre o e-mail do visitante (mailto).
   Para ligar a um receptor real, defina data-endpoint no <form> (POST JSON). */
(function(){
  var KEYS=["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid","li_fat_id"];
  var qs=new URLSearchParams(location.search), saved={};
  try{saved=JSON.parse(sessionStorage.getItem("nv_attr")||"{}")}catch(e){}
  KEYS.forEach(function(k){if(qs.get(k))saved[k]=qs.get(k)});
  if(!saved.landing)saved.landing=location.pathname;
  try{sessionStorage.setItem("nv_attr",JSON.stringify(saved))}catch(e){}

  document.querySelectorAll("form.contato").forEach(function(f){
    var st=f.querySelector(".status");
    f.addEventListener("submit",function(ev){
      ev.preventDefault();
      if(f.querySelector(".hp input").value){return}
      if(!f.reportValidity())return;
      var d={};new FormData(f).forEach(function(v,k){if(k!=="website")d[k]=v});
      d.oferta=f.dataset.oferta||"geral";d.atribuicao=saved;d.pagina=location.href;
      var ep=f.dataset.endpoint;
      function ok(){st.className="status ok";st.textContent="Recebido. Respondemos em até um dia útil.";f.reset();
        if(window.gtag)gtag("event","generate_lead",{oferta:d.oferta});
        if(window.fbq)fbq("track","Lead",{content_name:d.oferta});}
      if(!ep){
        var corpo="Nome: "+d.nome+"\nEmpresa: "+d.empresa+"\nCargo: "+(d.cargo||"")+"\nFuncionários: "+(d.porte||"")+"\nE-mail: "+d.email+"\nTelefone: "+(d.telefone||"")+"\n\nProcesso:\n"+(d.processo||"")+"\n\nOferta: "+d.oferta+"\nOrigem: "+JSON.stringify(saved);
        location.href="mailto:contato@nexvita.ai?subject="+encodeURIComponent("Conversa NexVita AI — "+d.empresa)+"&body="+encodeURIComponent(corpo);
        ok();return;
      }
      st.className="status";st.textContent="Enviando…";
      fetch(ep,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)})
        .then(function(r){if(!r.ok)throw 0;ok()})
        .catch(function(){st.className="status erro";st.textContent="Não foi possível enviar. Escreva para contato@nexvita.ai."});
    });
  });
})();

/* WhatsApp direto (número de Mori). Botão flutuante + atalho ao lado do formulário. */
(function(){
  var NUM="5511948818000";
  function link(origem){
    var t="Olá, vim pelo site da NexVita AI ("+origem+") e quero conversar sobre um processo da minha empresa.";
    return "https://wa.me/"+NUM+"?text="+encodeURIComponent(t);
  }
  var pagina=(location.pathname.replace(/\/+$/,"").split("/").pop())||"inicio";
  function rastrear(local){
    if(window.gtag)gtag("event","contato_whatsapp",{local:local,pagina:pagina});
    if(window.fbq)fbq("track","Contact",{content_name:pagina});
  }
  var a=document.createElement("a");
  a.className="nv-wa";a.href=link(pagina);a.target="_blank";a.rel="noopener";
  a.setAttribute("aria-label","Conversar no WhatsApp");
  a.innerHTML='<svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5v-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.7 5 .8.4 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg><span>WhatsApp</span>';
  a.addEventListener("click",function(){rastrear("flutuante")});
  document.body.appendChild(a);
  if("IntersectionObserver" in window){
    var vis=new Set();
    var io=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?vis.add(e.target):vis.delete(e.target)});a.classList.toggle("oculto",vis.size>0)},{threshold:0.15});
    document.querySelectorAll("form.contato").forEach(function(f){io.observe(f)});
  }
  document.querySelectorAll("form.contato .form-rodape").forEach(function(r){
    var w=document.createElement("a");
    w.className="nv-wa-alt";w.href=link(pagina);w.target="_blank";w.rel="noopener";
    w.textContent="Prefere WhatsApp? Fale direto";
    w.addEventListener("click",function(){rastrear("formulario")});
    r.appendChild(w);
  });
})();
