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
