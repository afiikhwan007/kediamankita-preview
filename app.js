/* ===== KediamanKita shared script ===== */
var WA_NUMBER = '60123456789'; // << TUKAR kepada nombor WhatsApp sebenar
var fmt = new Intl.NumberFormat('ms-MY', {style:'currency', currency:'MYR', maximumFractionDigits:0});
function money(n){ return fmt.format(Math.max(0, Math.round(n))).replace('RM','RM '); }
function waLink(msg){ return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg); }
function val(id){ var e=document.getElementById(id); return e ? e.value.trim() : ''; }
function radioVal(name){ var e=document.querySelector('input[name="'+name+'"]:checked'); return e ? e.value : '-'; }

document.addEventListener('DOMContentLoaded', function(){

  /* mobile menu */
  var burger=document.getElementById('burger');
  if(burger) burger.addEventListener('click', function(){ document.body.classList.toggle('menu-open'); });
  document.querySelectorAll('#mobileMenu a').forEach(function(a){ a.addEventListener('click', function(){ document.body.classList.remove('menu-open'); }); });

  /* reveal on scroll */
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, {threshold:.12});
  document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });

  /* project filter */
  document.querySelectorAll('.filt').forEach(function(b){ b.addEventListener('click', function(){
    document.querySelectorAll('.filt').forEach(function(x){ x.classList.remove('active'); });
    b.classList.add('active');
    var f=b.dataset.f;
    document.querySelectorAll('.proj').forEach(function(p){ p.style.display=(f==='all'||p.dataset.cat===f)?'':'none'; });
  }); });

  /* FAQ accordion */
  document.querySelectorAll('.faq-q').forEach(function(q){ q.addEventListener('click', function(){
    var item=q.parentElement, a=item.querySelector('.faq-a');
    var open=item.classList.toggle('open');
    a.style.maxHeight = open ? a.scrollHeight + 'px' : null;
  }); });

  /* radio option cards */
  document.querySelectorAll('.opt').forEach(function(o){ o.addEventListener('click', function(){
    var inp=o.querySelector('input'); if(!inp) return;
    document.querySelectorAll('.opt input[name="'+inp.name+'"]').forEach(function(i){ i.closest('.opt').classList.remove('sel'); });
    inp.checked=true; o.classList.add('sel');
  }); });

  /* generic WhatsApp links */
  var gen=waLink('Hai KediamanKita! Saya berminat untuk mengetahui lebih lanjut.');
  document.querySelectorAll('.js-wa').forEach(function(e){ e.href=gen; e.target='_blank'; e.rel='noopener'; });

  /* Bina Banglo lead form */
  var bBanglo=document.getElementById('btnBanglo');
  if(bBanglo) bBanglo.addEventListener('click', function(){
    var msg='Hai KediamanKita! Saya mahu konsultasi Bina Banglo.%0A'
      +'Nama: '+val('bg_nama')+'%0ANo Telefon: '+val('bg_tel')
      +'%0ALokasi Tanah: '+val('bg_lokasi')+'%0AKeluasan Tanah: '+val('bg_luas')
      +'%0AStatus Tanah: '+radioVal('bg_status')+'%0AJenis Rumah: '+radioVal('bg_jenis');
    window.open('https://wa.me/'+WA_NUMBER+'?text='+msg, '_blank');
  });

  /* Bina Kelayakan lead form */
  var bKel=document.getElementById('btnKelayakan');
  if(bKel) bKel.addEventListener('click', function(){
    var msg='Hai KediamanKita! Saya mahu Semak Kelayakan LPPSA.%0A'
      +'Nama: '+val('bk_nama')+'%0ANo Telefon: '+val('bk_tel')
      +'%0AJabatan: '+val('bk_jab')+'%0AGaji Kasar: RM'+val('bk_gaji')
      +'%0APilihan: '+radioVal('bk_pilih');
    window.open('https://wa.me/'+WA_NUMBER+'?text='+msg, '_blank');
  });

  /* LPPSA calculator */
  if(document.getElementById('gaji')) initCalc();
});

function initCalc(){
  var gaji=document.getElementById('gaji'), gajiVal=document.getElementById('gajiVal'),
      elaun=document.getElementById('elaun'), komitmen=document.getElementById('komitmen'),
      umur=document.getElementById('umur'), ratio=0.6;

  document.querySelectorAll('#seg button').forEach(function(b){ b.addEventListener('click', function(){
    document.querySelectorAll('#seg button').forEach(function(x){ x.classList.remove('on'); });
    b.classList.add('on'); ratio=parseFloat(b.dataset.r); calc();
  }); });

  function num(el){ var v=parseFloat(el.value); return isNaN(v)?0:v; }

  function calc(){
    var gp=num(gaji), el=num(elaun), km=num(komitmen), ag=num(umur);
    gajiVal.textContent=money(gp);
    var pendapatan=gp+el;
    var tempoh=Math.min(35, 60-ag); if(tempoh<1)tempoh=1; if(tempoh>35)tempoh=35;
    var ansuran=Math.min(pendapatan*ratio, pendapatan*0.80 - km);
    var dsr=pendapatan>0 ? (km/pendapatan*100) : 0;
    var dsrPill=document.getElementById('dsrPill');
    dsrPill.textContent=Math.round(dsr)+'%';
    dsrPill.className='pill '+(dsr<40?'good':(dsr<=60?'mid':'bad'));
    var alert=document.getElementById('alert'), loan=0, capPct=ratio*100;
    if(ansuran<=0||pendapatan<=0){ loan=0; alert.classList.add('show'); }
    else { var r=0.04/12, n=tempoh*12; loan=ansuran*(1-Math.pow(1+r,-n))/r; alert.classList.toggle('show', dsr>capPct); }
    document.getElementById('resBig').textContent=money(loan);
    document.getElementById('rAnsuran').textContent=money(Math.max(0,ansuran));
    document.getElementById('rTempoh').textContent=tempoh+' tahun';
    document.getElementById('rPendapatan').textContent=money(pendapatan);
    var msg='Hai KediamanKita! Saya guna kalkulator LPPSA: Gaji RM'+gp+', Elaun RM'+el+', Komitmen RM'+km+', Umur '+ag+'. Anggaran kelayakan saya '+money(loan)+'. Boleh bantu semak lebih tepat?';
    document.getElementById('waBtn').href=waLink(msg);
  }
  [gaji,elaun,komitmen,umur].forEach(function(el){ el.addEventListener('input', calc); });
  calc();
}
