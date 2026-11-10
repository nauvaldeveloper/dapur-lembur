/* =========================================================
   DAPUR LEMBUR — menu, pesan dari meja / bawa pulang / antar, reservasi
   ========================================================= */
(function () {
  'use strict';
  const R = window.RESTO;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rp = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const byId = (id) => R.MENU.find((m) => m.id === id);
  const validWa = (v) => /^(\+?62|0)8\d{7,12}$/.test(v.replace(/[\s-]/g, ''));
  const chili = '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2 9c3 1 7-1 8-6l-1-1c-1 3-4 5-7 5Z" fill="currentColor"/></svg>';

  // Nomor meja dari QR: ?meja=12
  const tableNo = (() => { const n = Number(new URLSearchParams(location.search).get('meja')); return n >= 1 && n <= R.TABLES_MAX ? n : null; })();

  const st = { q: '', flags: new Set(), order: new Map(), mode: tableNo ? 'meja' : 'ambil', name: '', wa: '', addr: '', sent: '' };

  /* ---------------- open state ---------------- */
  function renderOpen() {
    const now = new Date(), m = now.getHours() * 60 + now.getMinutes();
    const open = m >= 600 && m < 1260, kitchen = m < 1230;
    $('#openState').textContent = open ? (kitchen ? 'Buka sekarang' : 'Dapur sudah tutup') : 'Sedang tutup';
    $('#openHours').textContent = open ? (kitchen ? 'Sampai 21.00 · dapur tutup 20.30' : 'Minuman masih bisa dipesan sampai 21.00') : 'Buka setiap hari pukul 10.00';
    $('#vAddr').textContent = R.address; $('#vHours').textContent = R.hours;
  }

  /* ---------------- menu ---------------- */
  function visible(m) {
    const q = st.q.toLowerCase();
    if (q && !(m.name + ' ' + m.note).toLowerCase().includes(q)) return false;
    if (st.flags.has('best') && !m.best) return false;
    if (st.flags.has('veg') && !m.veg) return false;
    if (st.flags.has('mild') && m.spicy > 0) return false;
    return true;
  }
  function itemHTML(m) {
    const n = st.order.get(m.id) || 0;
    const meta = [m.spicy ? `<i title="Tingkat pedas ${m.spicy} dari 3" aria-label="pedas ${m.spicy}">${chili.repeat(m.spicy)}</i>` : '', m.veg ? '<i title="Tanpa daging/ikan">ⓥ</i>' : '', m.best ? '<i title="Paling laris">★</i>' : ''].join('');
    return `<div class="item">
      <div class="item__name">${esc(m.name)} ${meta ? `<span class="item__meta" style="border:0;flex:none;transform:none">${meta}</span>` : ''}<span aria-hidden="true"></span></div>
      <div class="item__price">${rp(m.price)}</div>
      <p class="item__note">${esc(m.note)}${m.serves ? ` · untuk ${m.serves} orang` : ''}</p>
      <div class="item__act">${n
        ? `<div class="qty"><button type="button" data-d="-1" data-id="${m.id}" aria-label="Kurangi ${esc(m.name)}">−</button><span>${n}</span><button type="button" data-d="1" data-id="${m.id}" aria-label="Tambah ${esc(m.name)}">+</button></div>`
        : `<button type="button" class="add" data-d="1" data-id="${m.id}" aria-label="Tambah ${esc(m.name)}">+ Pesan</button>`}</div>
    </div>`;
  }
  function renderMenu() {
    const html = R.CATEGORIES.map((c) => {
      const items = R.MENU.filter((m) => m.cat === c.id && visible(m));
      return items.length ? `<section class="group" id="cat-${c.id}"><h3>${esc(c.label)}</h3>${items.map(itemHTML).join('')}</section>` : '';
    }).join('');
    $('#sheet').innerHTML = html || '<p class="empty">Tidak ada menu yang cocok. Coba hapus pencarian atau saringan.</p>';
    $('#cats').innerHTML = R.CATEGORIES.filter((c) => R.MENU.some((m) => m.cat === c.id && visible(m))).map((c) => `<a href="#cat-${c.id}">${esc(c.label)}</a>`).join('');
  }

  /* ---------------- order ---------------- */
  const count = () => [...st.order.values()].reduce((a, b) => a + b, 0);
  function totals() {
    const sub = [...st.order].reduce((s, [id, n]) => s + byId(id).price * n, 0);
    const tax = Math.round(sub * R.TAX_PCT / 100);
    const fee = st.mode === 'antar' ? R.DELIVERY_FEE : 0;
    return { sub, tax, fee, total: sub + tax + fee };
  }
  function change(id, d) {
    const n = (st.order.get(id) || 0) + d;
    if (n <= 0) st.order.delete(id); else st.order.set(id, Math.min(n, 30));
    st.sent = '';
    $('#bagCount').textContent = count();
    if (d > 0) toast(`${byId(id).name} ditambahkan`);
  }

  function renderDrawer() {
    const body = $('#drBody'), foot = $('#drFoot');
    $('#drTitle').textContent = tableNo ? `Pesanan Meja ${tableNo}` : 'Pesanan';
    if (!st.order.size) { body.innerHTML = '<p class="empty-bag">Belum ada menu yang dipilih.</p>'; foot.innerHTML = '<button class="btn btn--leaf btn--block" type="button" data-close>Lihat menu</button>'; return; }
    if (st.sent) {
      body.innerHTML = `<p class="pv-label">Mode demo · pesan yang diterima ${st.mode === 'meja' ? 'kasir' : 'admin'}</p><div class="wa-preview"><div>${esc(st.sent)}</div></div>`;
      foot.innerHTML = '<button class="btn btn--leaf btn--block" type="button" id="editOrder">Ubah pesanan</button>'; return;
    }
    const t = totals();
    body.innerHTML = [...st.order].map(([id, n]) => { const m = byId(id); return `<div class="line"><b>${esc(m.name)}</b><span>${rp(m.price * n)}</span><small>${rp(m.price)} / porsi</small><div class="qty"><button type="button" data-d="-1" data-id="${id}" aria-label="Kurangi">−</button><span>${n}</span><button type="button" data-d="1" data-id="${id}" aria-label="Tambah">+</button></div></div>`; }).join('')
      + (tableNo ? '' : `<div class="modes" role="radiogroup" aria-label="Cara pesan">${[['ambil', 'Ambil sendiri'], ['antar', 'Pesan antar']].map(([v, l]) => `<button type="button" data-mode="${v}" aria-pressed="${st.mode === v}">${l}</button>`).join('')}</div>
        <label class="field">Nama<input id="o-name" value="${esc(st.name)}" autocomplete="name" /></label>
        <label class="field">No. WhatsApp<input id="o-wa" value="${esc(st.wa)}" inputmode="tel" placeholder="08xx" /></label>
        ${st.mode === 'antar' ? `<label class="field">Alamat antar (maks. 5 km)<input id="o-addr" value="${esc(st.addr)}" placeholder="Jalan, nomor, patokan" /></label>` : ''}`)
      + '<p class="err" id="oErr" hidden></p>';
    foot.innerHTML = `<div class="sum"><div><span>Subtotal</span><span>${rp(t.sub)}</span></div><div><span>PB1 ${R.TAX_PCT}%</span><span>${rp(t.tax)}</span></div>${t.fee ? `<div><span>Ongkir kurir resto</span><span>${rp(t.fee)}</span></div>` : ''}<div class="total"><span>Total</span><span>${rp(t.total)}</span></div></div>
      <button class="btn btn--red btn--block" type="button" id="sendOrder">${tableNo ? 'Kirim ke kasir' : 'Kirim pesanan via WhatsApp'}</button>`;
  }
  function keepForm() { if ($('#o-name')) { st.name = $('#o-name').value.trim(); st.wa = $('#o-wa').value.trim(); st.addr = $('#o-addr') ? $('#o-addr').value.trim() : st.addr; } }

  function orderMessage() {
    const t = totals(), lines = [...st.order].map(([id, n]) => `${n}× ${byId(id).name} (${rp(byId(id).price * n)})`);
    const head = tableNo ? `Pesanan MEJA ${tableNo} 🍽️` : `Halo ${R.name}, saya mau pesan ${st.mode === 'antar' ? 'antar' : 'untuk diambil'} 🍽️`;
    return [head, '', ...lines, '', `Subtotal: ${rp(t.sub)}`, `PB1 ${R.TAX_PCT}%: ${rp(t.tax)}`, ...(t.fee ? [`Ongkir: ${rp(t.fee)}`] : []), `Total: ${rp(t.total)}`,
      ...(tableNo ? ['', 'Bayar di kasir setelah makan.'] : ['', `Nama: ${st.name}`, `No. WA: ${st.wa}`, ...(st.mode === 'antar' ? [`Alamat: ${st.addr}`] : [])])].join('\n');
  }
  function sendOrder() {
    keepForm();
    const err = $('#oErr');
    const fail = (m) => { err.textContent = m; err.hidden = false; };
    if (!tableNo) {
      if (!st.name) return fail('Isi nama pemesan.');
      if (!validWa(st.wa)) return fail('Nomor WhatsApp belum valid, contoh 0812xxxxxxx.');
      if (st.mode === 'antar' && st.addr.length < 10) return fail('Tulis alamat antar yang lengkap.');
    }
    const msg = orderMessage();
    if (R.DEMO || !R.WA_NUMBER) { st.sent = msg; renderDrawer(); return; }
    window.open(`https://wa.me/${R.WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  }

  /* ---------------- reservation ---------------- */
  const rv = { date: null, time: null, area: 'saung' };
  function seeded(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return (h >>> 0) / 4294967296; }
  // contoh ketersediaan: akhir pekan & jam makan lebih penuh
  function freeTables(area, date, time) {
    const a = R.AREAS.find((x) => x.id === area), d = new Date(date + 'T00:00'), weekend = [0, 6].includes(d.getDay());
    const peak = /^(12|13|18|19)/.test(time);
    const load = seeded(area + date + time) * .6 + (weekend ? .3 : 0) + (peak ? .25 : 0);
    return Math.max(0, a.tables - Math.floor(a.tables * Math.min(load, 1)));
  }
  function renderResv() {
    const sel = $('#r-date');
    if (!sel.options.length) {
      const d0 = new Date(); d0.setHours(0, 0, 0, 0);
      sel.innerHTML = Array.from({ length: 14 }, (_, i) => { const d = new Date(d0); d.setDate(d0.getDate() + i); return `<option value="${iso(d)}">${i === 0 ? 'Hari ini, ' : i === 1 ? 'Besok, ' : ''}${d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</option>`; }).join('');
      $('#r-occ').innerHTML = R.OCCASIONS.map((o) => `<option>${esc(o)}</option>`).join('');
      $('#r-liwet').innerHTML += R.MENU.filter((m) => m.cat === 'liwet').map((m) => `<option value="${m.id}">${esc(m.name)} · ${rp(m.price)}</option>`).join('');
    }
    rv.date = sel.value;
    const pax = Number($('#r-pax').value) || 1;
    const now = new Date(), today = rv.date === iso(now), nowMin = now.getHours() * 60 + now.getMinutes();
    $('#times').innerHTML = R.SESSIONS.map((s) => `<div><small>${s.label}</small>${s.times.map((t) => {
      const [h, m] = t.split('.').map(Number), past = today && h * 60 + m <= nowMin + 30;
      return `<button type="button" class="t" data-time="${t}" aria-pressed="${rv.time === t}" ${past ? 'disabled' : ''}>${t}</button>`;
    }).join('')}</div>`).join('');
    if (rv.time && $(`.t[data-time="${rv.time}"]`)?.disabled) rv.time = null;
    $('#areas').innerHTML = R.AREAS.map((a) => {
      const fits = pax <= a.seats * (a.id === 'aula' ? 1 : 2);
      const free = rv.time ? freeTables(a.id, rv.date, rv.time) : null;
      const ok = fits && (free === null || free > 0);
      const info = !fits ? `Maks ${a.id === 'aula' ? a.seats : a.seats * 2} orang` : free === null ? 'Pilih jam dulu' : free ? `${free} meja tersedia` : 'Penuh di jam ini';
      return `<button type="button" class="a" data-area="${a.id}" aria-pressed="${rv.area === a.id && ok}" ${ok ? '' : 'disabled'}>${esc(a.label)}<small>${esc(a.note)}</small><em>${info}</em></button>`;
    }).join('');
    if (!$(`.a[data-area="${rv.area}"]`) || $(`.a[data-area="${rv.area}"]`).disabled) { const first = document.querySelector('.a:not([disabled])'); rv.area = first ? first.dataset.area : null; if (first) first.setAttribute('aria-pressed', 'true'); }
  }
  function sendResv(e) {
    e.preventDefault();
    const err = $('#rErr'), fail = (m) => { err.textContent = m; err.hidden = false; };
    const name = $('#r-name').value.trim(), wa = $('#r-wa').value.trim(), pax = Number($('#r-pax').value);
    if (!(pax >= 1 && pax <= 30)) return fail('Jumlah orang 1–30. Untuk lebih dari 30, hubungi admin.');
    if (!rv.time) return fail('Pilih jam kedatangan.');
    if (!rv.area) return fail('Tidak ada area yang muat di jam ini. Coba jam lain.');
    if (!name) return fail('Isi nama untuk reservasi.');
    if (!validWa(wa)) return fail('Nomor WhatsApp belum valid, contoh 0812xxxxxxx.');
    err.hidden = true;
    const a = R.AREAS.find((x) => x.id === rv.area), liwet = byId($('#r-liwet').value);
    const date = new Date(rv.date + 'T00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const msg = [`Halo ${R.name}, saya mau reservasi meja 📅`, '', `Tanggal: ${date}`, `Jam: ${rv.time}`, `Jumlah: ${pax} orang`, `Area: ${a.label}`, `Acara: ${$('#r-occ').value}`,
      ...(liwet ? [`Siapkan: ${liwet.name} (${rp(liwet.price)})`] : []), ...($('#r-note').value.trim() ? [`Catatan: ${$('#r-note').value.trim()}`] : []), '', `Nama: ${name}`, `No. WA: ${wa}`].join('\n');
    if (R.DEMO || !R.WA_NUMBER) { $('#rPreview').innerHTML = `<p class="pv-label">Mode demo · pesan untuk admin</p><div class="wa-preview"><div>${esc(msg)}</div></div>`; return; }
    window.open(`https://wa.me/${R.WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  }

  /* ---------------- ui ---------------- */
  let tt; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 1600); }
  function openDrawer() { renderDrawer(); $('#layer').hidden = false; document.body.style.overflow = 'hidden'; $('.x').focus(); }
  function closeDrawer() { $('#layer').hidden = true; document.body.style.overflow = ''; }

  function bind() {
    let qt; $('#q').addEventListener('input', (e) => { clearTimeout(qt); qt = setTimeout(() => { st.q = e.target.value.trim(); renderMenu(); }, 120); });
    document.querySelector('.toggles').addEventListener('click', (e) => {
      const b = e.target.closest('[data-flag]'); if (!b) return;
      const f = b.dataset.flag; st.flags.has(f) ? st.flags.delete(f) : st.flags.add(f);
      b.setAttribute('aria-pressed', String(st.flags.has(f))); renderMenu();
    });
    document.addEventListener('click', (e) => {
      const d = e.target.closest('[data-d]');
      if (d) { keepForm(); change(d.dataset.id, Number(d.dataset.d)); renderMenu(); if (!$('#layer').hidden) renderDrawer(); return; }
      const mo = e.target.closest('[data-mode]'); if (mo) { keepForm(); st.mode = mo.dataset.mode; renderDrawer(); return; }
      if (e.target.closest('#sendOrder')) return sendOrder();
      if (e.target.closest('#editOrder')) { st.sent = ''; renderDrawer(); return; }
      if (e.target.closest('[data-close]')) { closeDrawer(); return; }
      const t = e.target.closest('[data-time]'); if (t && !t.disabled) { rv.time = t.dataset.time; $('#rPreview').innerHTML = ''; renderResv(); return; }
      const a = e.target.closest('[data-area]'); if (a && !a.disabled) { rv.area = a.dataset.area; $('#rPreview').innerHTML = ''; renderResv(); }
    });
    $('#bagBtn').addEventListener('click', openDrawer);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#layer').hidden) closeDrawer(); });
    $('#r-date').addEventListener('change', renderResv);
    $('#r-pax').addEventListener('input', renderResv);
    $('#resvForm').addEventListener('submit', sendResv);
  }

  if (R.DEMO && !tableNo) { $('#demoBar').hidden = false; $('#demoLink').href = R.DEV_CONTACT_URL; }
  if (tableNo) { $('#tableBar').hidden = false; $('#tableNo').textContent = `Meja ${tableNo}`; $('#bagBtn span').textContent = `Meja ${tableNo}`; }
  $('#faqList').innerHTML = R.FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
  renderOpen(); renderMenu(); renderResv(); bind();
})();
