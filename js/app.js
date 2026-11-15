// Moolchand's Grocery Store - main code (shop, cart, WhatsApp order, owner panel)
// Demo data lives in the browser (localStorage). The Node.js version stores it on the server.
const seed = [
 ["Basmati Rice","Grains",120,150,"1 kg",40,"🍚",4.5,1284],["Toor Dal","Grains",150,180,"1 kg",25,"🫘",4.3,860],
 ["Atta (Wheat Flour)","Grains",55,70,"1 kg",60,"🌾",4.6,2210],["Poha","Grains",42,50,"500 g",30,"🥣",4.2,402],
 ["Sugar","Essentials",48,55,"1 kg",8,"🧂",4.4,950],["Tata Salt","Essentials",28,30,"1 kg",50,"🧂",4.7,3100],
 ["Sunflower Oil","Essentials",160,210,"1 L",30,"🛢️",4.4,1720],["Turmeric Powder","Essentials",45,60,"200 g",35,"🟡",4.5,640],
 ["Full Cream Milk","Dairy",33,35,"500 ml",20,"🥛",4.6,2900],["Paneer","Dairy",90,110,"200 g",6,"🧀",4.4,780],
 ["Butter","Dairy",58,64,"100 g",22,"🧈",4.7,1500],["Curd","Dairy",30,35,"400 g",18,"🥣",4.3,520],
 ["Tea Powder","Beverages",130,160,"250 g",18,"🍵",4.6,2050],["Instant Coffee","Beverages",165,210,"100 g",12,"☕",4.5,830],
 ["Masala Chips","Snacks",20,20,"1 pack",70,"🥔",4.2,1900],["Biscuits","Snacks",30,35,"1 pack",55,"🍪",4.4,1400],
 ["Namkeen Mix","Snacks",60,80,"400 g",9,"🥜",4.3,470],["Maggi Noodles","Snacks",14,15,"1 pack",80,"🍜",4.7,5200]
].map((p,i)=>({id:i+1,name:p[0],category:p[1],price:p[2],mrp:p[3],unit:p[4],stock:p[5],icon:p[6],rating:p[7],reviews:p[8]}));
const FREE_ABOVE = 299, FEE = 30;
// Original illustrated pack pictures. [shape, colour, label on pack, label colour]
const ART = {
 "Basmati Rice":["sack","#f3e2b3","BASMATI","#7a4b00"],"Toor Dal":["sack","#f2c94c","TOOR DAL","#6b4a00"],
 "Atta (Wheat Flour)":["sack","#e7c999","ATTA","#6b3f00"],"Poha":["pack","#f4a261","POHA","#7a2e00"],
 "Sugar":["sack","#e8f1ff","SUGAR","#1d4ed8"],"Tata Salt":["sack","#e0f2fe","SALT","#0369a1"],
 "Sunflower Oil":["bottle","#fde047","OIL","#854d0e"],"Turmeric Powder":["box","#f59e0b","TURMERIC","#78350f"],
 "Full Cream Milk":["carton","#bfdbfe","MILK","#1e3a8a"],"Paneer":["pack","#fef3c7","PANEER","#92400e"],
 "Butter":["pack","#fde68a","BUTTER","#b45309"],"Curd":["tub","#e0f2fe","CURD","#0c4a6e"],
 "Tea Powder":["box","#d97706","TEA","#7c2d12"],"Instant Coffee":["jar","#6b3b1f","COFFEE","#4a2511"],
 "Masala Chips":["pack","#ef4444","CHIPS","#991b1b"],"Biscuits":["pack","#3b82f6","BISCUITS","#1e3a8a"],
 "Namkeen Mix":["pack","#f97316","NAMKEEN","#7c2d12"],"Maggi Noodles":["pack","#facc15","MAGGI","#b91c1c"]
};
// Picture for a product: the owner's uploaded photo if there is one, otherwise the illustration
function art(p){
  if(p.photo) return `<img src="${p.photo}" alt="${p.name}">`;
  const [t,c,label,ink] = ART[p.name] || ["pack","#94a3b8",p.name.slice(0,8).toUpperCase(),"#1e293b"];
  const st=`fill="${c}" stroke="#0003" stroke-width="2"`;
  const lab=(y)=>`<rect x="29" y="${y}" width="42" height="24" rx="4" fill="#fff"/><text x="50" y="${y+15}" text-anchor="middle" font-size="7.5" font-weight="800" font-family="Nunito Sans,Arial,sans-serif" fill="${ink}">${label}</text>`;
  const S={
   sack:`<path d="M24 32 Q50 20 76 32 L83 88 Q50 96 17 88Z" ${st}/><path d="M36 32 Q50 8 64 32Z" ${st}/>${lab(50)}`,
   bottle:`<rect x="40" y="8" width="20" height="12" rx="3" fill="#f59e0b"/><path d="M36 20 h28 q10 8 10 22 v46 q0 6-6 6 H32 q-6 0-6-6 V42 q0-14 10-22z" ${st}/>${lab(48)}`,
   carton:`<rect x="28" y="32" width="44" height="58" ${st}/><path d="M28 32 L50 12 L72 32Z" ${st}/><path d="M50 12 L72 32 H50Z" fill="#0002"/>${lab(46)}`,
   tub:`<path d="M22 42 H78 L72 90 H28Z" ${st}/><rect x="20" y="33" width="60" height="10" rx="3" fill="#fff" stroke="#0003" stroke-width="2"/>${lab(54)}`,
   box:`<rect x="22" y="18" width="56" height="72" rx="5" ${st}/><rect x="22" y="18" width="56" height="10" rx="4" fill="#0003"/>${lab(44)}`,
   jar:`<rect x="30" y="10" width="40" height="14" rx="3" fill="#1f2937"/><rect x="24" y="24" width="52" height="66" rx="9" ${st}/>${lab(44)}`,
   pack:`<path d="M22 16 l4 6 4-6 4 6 4-6 4 6 4-6 4 6 4-6 4 6 4-6 4 6 4-6 4 6 4-6 V90 H22Z" ${st}/><rect x="22" y="78" width="56" height="12" fill="#0003"/>${lab(40)}`
  };
  return `<svg viewBox="0 0 100 100" role="img" aria-label="${p.name}"><ellipse cx="50" cy="94" rx="30" ry="4" fill="#0002"/>${S[t]||S.pack}</svg>`;
}
// Owner uploads a real photo: shrink it, then keep it in the browser storage
function photo(id,file){
  if(!file) return;
  const r=new FileReader();
  r.onload=()=>{ const im=new Image(); im.onload=()=>{
    const k=Math.min(1,400/Math.max(im.width,im.height)), c=document.createElement("canvas");
    c.width=im.width*k; c.height=im.height*k; c.getContext("2d").drawImage(im,0,0,c.width,c.height);
    products.find(x=>x.id===id).photo=c.toDataURL("image/jpeg",.8); save("mg_products_v4",products); drawAdmin();
  }; im.src=r.result; };
  r.readAsDataURL(file);
}

const IC = {
 phone:'<path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11 11 0 003.4.55 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.2.2 2.3.55 3.4a1 1 0 01-.25 1z"/>',
 wa:'<path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 2a8 8 0 11-4.2 14.800l-.3-.2-2.600.7.7-2.500-.2-.3A8 8 0 0112 4z"/><g transform="translate(7 7) scale(.42)"><path d="M6.600 10.800a15 15 0 006.600 6.600l2.200-2.200a1 1 0 011-.25 11 11 0 003.400.55 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.500a1 1 0 011 1c0 1.200.2 2.300.55 3.400a1 1 0 01-.25 1z"/></g>',
 pin:'<path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.500A2.500 2.500 0 1112 6.500a2.500 2.500 0 010 5z"/>',
 ig:'<path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm5 3.500a4.500 4.500 0 110 9 4.500 4.500 0 010-9zm0 2a2.500 2.500 0 100 5 2.500 2.500 0 000-5zM17.200 5.800a1 1 0 110 2 1 1 0 010-2z"/>',
};
const $ = s => document.querySelector(s);
function load(k,f){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):f; }catch(e){ return f; } }
function save(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
let products = load("mg_products_v4", seed), orders = load("mg_orders_v4", []), cart = {}, isAdmin = false, activeCat = "";

// icons + contact links
document.querySelectorAll("svg[data-i]").forEach(s => s.innerHTML = IC[s.dataset.i]);
$("#waIco").innerHTML = IC.wa;
const waLink = t => "https://wa.me/" + WA_NUMBER + (t ? "?text=" + encodeURIComponent(t) : "");
["#heroWa","#fWa","#floatWa"].forEach(s => $(s).href = waLink("Hello Moolchand’s, I want to place an order."));
$("#fCall").href = "tel:+" + WA_NUMBER; $("#fPhone").textContent = PHONE_TEXT;
$("#fMap").href = MAPS_LINK; $("#fAddr").textContent = ADDRESS;

function go(v){
  $("#shop").hidden = v!=="shop"; $("#admin").hidden = v!=="admin"; $("#floatWa").hidden = v!=="shop";
  $("#tShop").classList.toggle("on", v==="shop"); $("#tAdmin").classList.toggle("on", v==="admin");
  v==="shop" ? drawShop() : drawAdmin(); scrollTo(0,0);
}
function cartOpen(o){ $("#cart").classList.toggle("open", o); }
const off = p => p.mrp > p.price ? Math.round((p.mrp-p.price)/p.mrp*100) : 0;

function cardHtml(p){
  const d = off(p);
  const badge = p.stock===0 ? '<span class="badge out">Out of stock</span>' : p.stock<=10 ? `<span class="badge low">Only ${p.stock} left</span>` : `<span class="badge">${p.stock} in stock</span>`;
  return `<div class="card">${d?`<span class="off">${d}% OFF</span>`:""}<div class="pic">${art(p)}</div><h3>${p.name}</h3>
    <span class="muted">${p.unit}</span>
    <div class="rate"><b>${p.rating.toFixed(1)} ★</b><span class="muted">(${p.reviews.toLocaleString("en-IN")})</span></div>
    <div class="price">₹${p.price} ${d?`<s>₹${p.mrp}</s> <em>${d}% off</em>`:""}</div>
    <span class="fast">⚡ Delivery in 30 min</span>${badge}
    <button ${(cart[p.id]||0)>=p.stock?"disabled":""} onclick="add(${p.id})">${p.stock===0?"Unavailable":"Add to cart"}</button></div>`;
}
function drawShop(){
  $("#maxOff").textContent = Math.max(0,...products.map(off)) + "%";
  const deals = [...products].filter(p=>p.stock>0).sort((a,b)=>off(b)-off(a)).slice(0,4);
  $("#deals").innerHTML = deals.map(cardHtml).join("");
  const cats = ["", ...new Set(products.map(p=>p.category))];
  $("#chips").innerHTML = cats.map(c=>`<button class="chip ${c===activeCat?"on":""}" onclick="setCat('${c}')">${c||"All"}</button>`).join("");
  const q = $("#q").value.toLowerCase();
  const list = products.filter(p => p.name.toLowerCase().includes(q) && (!activeCat || p.category===activeCat));
  $("#grid").innerHTML = list.length ? list.map(cardHtml).join("") : "<p>No items found. Try another search.</p>";
  drawCart();
}
function setCat(c){ activeCat = c; drawShop(); }
function add(id){ cart[id]=(cart[id]||0)+1; drawShop(); }
function change(id,d){ cart[id]+=d; if(cart[id]<1) delete cart[id]; drawShop(); }
function totals(){
  let sub=0,count=0; Object.entries(cart).forEach(([id,q])=>{ const p=products.find(x=>x.id==id); if(p){ sub+=p.price*q; count+=q; } });
  const fee = sub===0 || sub>=FREE_ABOVE ? 0 : FEE; return {sub,count,fee,total:sub+fee};
}
function drawCart(){
  $("#lines").innerHTML = Object.entries(cart).map(([id,qty])=>{
    const p = products.find(x=>x.id==id); if(!p) return "";
    return `<div class="line"><span>${p.icon} ${p.name}</span><span><button onclick="change(${id},-1)">−</button> ${qty}
      <button onclick="change(${id},1)" ${qty>=p.stock?"disabled":""}>+</button></span></div>`;
  }).join("") || '<p class="muted">Your cart is empty. Add items from the shop.</p>';
  const t = totals();
  $("#count").textContent = t.count; $("#total").textContent = t.total; $("#fee").textContent = t.fee ? "₹"+t.fee : "FREE";
  $("#freeMsg").textContent = t.sub && t.sub<FREE_ABOVE ? `Add ₹${FREE_ABOVE-t.sub} more for free delivery` : "";
}
function placeOrder(){
  const name=$("#name").value.trim(), phone=$("#phone").value.trim(), addr=$("#addr").value.trim(), t=totals();
  const fail = x => { $("#msg").className="msg err"; $("#msg").textContent=x; };
  if(!t.count) return fail("Your cart is empty. Add items first.");
  if(!name||!phone||!addr) return fail("Enter your name, phone and address.");
  const lines=[];
  for(const [id,qty] of Object.entries(cart)){
    const p=products.find(x=>x.id==id);
    if(qty>p.stock) return fail(`Only ${p.stock} left of ${p.name}.`);
    lines.push({name:p.name,unit:p.unit,qty,price:p.price});
  }
  Object.entries(cart).forEach(([id,qty])=>products.find(x=>x.id==id).stock-=qty);
  orders.unshift({name,phone,items:lines,total:t.total,time:new Date().toISOString()});
  save("mg_products_v4",products); save("mg_orders_v4",orders);
  const text = "New order - Moolchand’s Grocery Store\n" + lines.map(l=>`${l.qty} x ${l.name} (${l.unit}) = ₹${l.qty*l.price}`).join("\n")
    + `\nDelivery: ${t.fee?"₹"+t.fee:"FREE"}\nTotal: ₹${t.total}\nName: ${name}\nPhone: ${phone}\nAddress: ${addr}`;
  cart = {}; drawShop();
  window.open(waLink(text), "_blank");
  $("#msg").className="msg ok";
  $("#msg").innerHTML = `Order ready! If WhatsApp did not open, <a href="${waLink(text)}" target="_blank" rel="noopener"><u>tap here to send it</u></a>.`;
}

/* ---------- Owner panel ---------- */
function login(e){ e.preventDefault(); if($("#pw").value==="moolchand123"){ isAdmin=true; drawAdmin(); } else $("#loginMsg").textContent="Wrong password. Try again."; }
function drawAdmin(){
  $("#login").hidden=isAdmin; $("#panelBox").hidden=!isAdmin; if(!isAdmin) return;
  $("#rows").innerHTML = products.map(p=>`<tr>
    <td><div style="display:flex;gap:10px;align-items:center"><span class="thumb">${art(p)}</span><span>${p.name}<br><span class="muted">${p.category} · ${p.unit}</span></span></div></td>
    <td><input id="price${p.id}" type="number" min="0" value="${p.price}"></td>
    <td><div class="sb"><button onclick="nudge(${p.id},-1)">−</button><input id="stock${p.id}" type="number" min="0" value="${p.stock}"><button onclick="nudge(${p.id},1)">+</button></div></td>
    <td><button onclick="saveRow(${p.id})">Save</button> <button class="danger" onclick="del(${p.id})">Delete</button> <label class="btn alt" style="padding:8px 12px">📷 Photo<input type="file" accept="image/*" hidden onchange="photo(${p.id},this.files[0])"></label></td></tr>`).join("");
  $("#orders").innerHTML = orders.slice(0,15).map(o=>`<tr><td>${new Date(o.time).toLocaleString()}</td><td>${o.name} (${o.phone})</td>
    <td>${o.items.map(i=>i.qty+" × "+i.name).join(", ")}</td><td>₹${o.total}</td></tr>`).join("") || "<tr><td>No orders yet.</td></tr>";
}
function saveRow(id){
  const p=products.find(x=>x.id===id);
  p.price=Math.max(0,Number($("#price"+id).value)||0); p.stock=Math.max(0,Math.floor(Number($("#stock"+id).value)||0));
  if(p.mrp<p.price) p.mrp=p.price; save("mg_products_v4",products); drawAdmin();
}
function nudge(id,d){ const el=$("#stock"+id); el.value=Math.max(0,Number(el.value)+d); saveRow(id); }
function del(id){ if(confirm("Delete this product?")){ products=products.filter(x=>x.id!==id); save("mg_products_v4",products); drawAdmin(); } }
function addProduct(e){
  e.preventDefault(); const pr=Number($("#p").value);
  products.push({id:Math.max(0,...products.map(x=>x.id))+1,name:$("#n").value,category:$("#c").value,price:pr,mrp:Math.max(pr,Number($("#m").value)||pr),
    unit:$("#u").value||"1 pc",stock:Math.floor(Number($("#s").value)),icon:$("#i").value||"🛒",rating:4.2,reviews:0});
  save("mg_products_v4",products); e.target.reset(); drawAdmin();
}
function resetDemo(){ if(confirm("Reset all demo data?")){ products=JSON.parse(JSON.stringify(seed)); orders=[]; save("mg_products_v4",products); save("mg_orders_v4",orders); drawAdmin(); } }
drawShop();
