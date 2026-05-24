// ── Reset All ──
function resetAll(btn){
  if(!confirm('Reset all data? This will clear all uploaded files, form fields, and generated reports.')) return;

  // Clear 9xxx
  data9.mno = null; data9.iptsp = null;
  data9.mno_file = null; data9.iptsp_file = null;
  data9.mno_pivot = null; data9.iptsp_pivot = null;
  document.getElementById('status-9mno').textContent = '';
  document.getElementById('status-9iptsp').textContent = '';
  document.getElementById('zone-9mno').classList.remove('loaded');
  document.getElementById('zone-9iptsp').classList.remove('loaded');
  document.getElementById('pivot-9mno').innerHTML = '<div class="no-data">Upload MNO CSV to generate pivot table</div>';
  document.getElementById('pivot-9iptsp').innerHTML = '<div class="no-data">Upload IPTSP CSV to generate pivot table</div>';
  document.getElementById('ss-9mno').className = 'screenshot-card';
  document.getElementById('ss-9iptsp').className = 'screenshot-card';

  // Clear 1xxx
  data1.mno = null; data1.iptsp = null;
  data1.mno_file = null; data1.iptsp_file = null;
  data1.mno_pivot = null; data1.iptsp_pivot = null;
  document.getElementById('status-1mno').textContent = '';
  document.getElementById('status-1iptsp').textContent = '';
  document.getElementById('zone-1mno').classList.remove('loaded');
  document.getElementById('zone-1iptsp').classList.remove('loaded');
  document.getElementById('pivot-1mno').innerHTML = '<div class="no-data">Upload MNO CSV to generate pivot table</div>';
  document.getElementById('pivot-1iptsp').innerHTML = '<div class="no-data">Upload IPTSP CSV to generate pivot table</div>';
  document.getElementById('ss-1mno').className = 'screenshot-card';
  document.getElementById('ss-1iptsp').className = 'screenshot-card';

  // Clear DLR
  dlrData = {};
  document.getElementById('status-dlr').textContent = '';
  document.getElementById('zone-dlr').classList.remove('loaded');
  document.getElementById('dlr-counts-box').innerHTML = '';
  document.getElementById('dlr-manual-box').innerHTML = '';
  document.getElementById('ss-dlr').className = 'screenshot-card';

  // Clear HTTP source inputs
  HTTP_SOURCES.forEach(s => {
    HTTP_CODES.forEach(c => {
      const el = document.getElementById(`hc-${s}-${c}`);
      if(el) el.value = '';
    });
    const block = document.getElementById(`src-${s}`);
    if(block) block.classList.remove('has-data','open');
    const totalEl = document.getElementById(`htotal-${s}`);
    if(totalEl){ totalEl.textContent = '—'; totalEl.style.color = ''; }
  });
  const httpZone = document.getElementById('zone-http');
  if(httpZone) httpZone.classList.remove('loaded');
  const httpStatus = document.getElementById('status-http');
  if(httpStatus) httpStatus.textContent = '';

  // Reset all datetimes
  ['9xxx','1xxx','http','dlr'].forEach(p => initDT(p));

  // Reset all reporters and statuses
  ['9mno','9iptsp','1mno','1iptsp','http','dlr'].forEach(p => {
    const rep = document.getElementById(`${p}-reporter`);
    if(rep) rep.value = 'Rizvi';
    setSt(p, 'Normal');
  });

  // Reset file inputs
  document.querySelectorAll('input[type=file]').forEach(f => { f.value = ''; });

  // Refresh previews
  refreshHTTP();
  const httpOut = document.getElementById('http-output');
  if(httpOut) httpOut.style.display = 'none';

  // Reset Drive Backup list
  const list = document.getElementById('save-file-list');
  if(list) list.innerHTML = '';

  const orig = btn.textContent;
  btn.textContent = 'Done ✓';
  setTimeout(() => { btn.textContent = orig; }, 2000);
}

// ── Clock ──
function updateClock(){
  const n = new Date();
  document.getElementById('clock').textContent =
    n.toLocaleDateString('en-BD',{weekday:'short',month:'short',day:'numeric'}) + '  ' +
    n.toLocaleTimeString('en-BD',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
}
setInterval(updateClock, 1000); updateClock();

// ── Init datetimes ──
function pad(n){ return String(n).padStart(2,'0'); }
function initDT(prefix, offsetHrs=0){
  const n = new Date();
  const from = new Date(n); from.setHours(from.getHours() - (offsetHrs||2));
  const toD = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const toT = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  document.getElementById(`${prefix}-from-date`).value = toD(from);
  document.getElementById(`${prefix}-from-time`).value = toT(from);
  document.getElementById(`${prefix}-to-date`).value = toD(n);
  document.getElementById(`${prefix}-to-time`).value = toT(n);
}
document.addEventListener('DOMContentLoaded', () => {
  ['9xxx','1xxx','http','dlr'].forEach(p => initDT(p));
});

// ── Tab switching ──
function switchTab(id, el){
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-'+id).classList.add('active');
  el.classList.add('active');
  if(id==='4xx5xx') refreshHTTP();
  if(id==='savefiles') refreshSaveFiles();
}

// ── Sub tab ──
function show9sub(which, el){
  document.getElementById('9sub-mno').style.display = which==='mno'?'block':'none';
  document.getElementById('9sub-iptsp').style.display = which==='iptsp'?'block':'none';
  el.closest('.sub-tabs').querySelectorAll('.sub-tab').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
}
function show1sub(which, el){
  document.getElementById('1sub-mno').style.display = which==='mno'?'block':'none';
  document.getElementById('1sub-iptsp').style.display = which==='iptsp'?'block':'none';
  el.closest('.sub-tabs').querySelectorAll('.sub-tab').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
}

// ── Status toggle ──
const statusMap = {};
function setSt(prefix, val){
  statusMap[prefix] = val;
  const bn = document.getElementById(`${prefix}-btn-n`);
  const bi = document.getElementById(`${prefix}-btn-i`);
  const box = document.getElementById(`${prefix}-issue-box`);
  if(val==='Normal'){
    bn.className='st-btn normal-on'; bi.className='st-btn';
    if(box) box.style.display='none';
  } else {
    bi.className='st-btn issue-on'; bn.className='st-btn';
    if(box){ box.style.display='block'; box.querySelector('textarea').focus(); }
  }
}
['9mno','9iptsp','1mno','1iptsp','http','dlr'].forEach(p => { statusMap[p]='Normal'; });

// ── CSV Parser ──
function parseCSV(text){
  const lines = text.split(/\r?\n/).filter(Boolean);
  if(!lines.length) return [];
  // Detect delimiter
  const delim = lines[0].includes('\t') ? '\t' : ',';
  const headers = lines[0].split(delim).map(h=>h.replace(/^"|"$/g,'').trim());
  return lines.slice(1).map(line => {
    const vals = splitCSVLine(line, delim);
    const obj = {};
    headers.forEach((h,i) => { obj[h] = (vals[i]||'').replace(/^"|"$/g,'').trim(); });
    return obj;
  }).filter(r => Object.values(r).some(v=>v));
}

function splitCSVLine(line, delim){
  const result = []; let cur=''; let inQ=false;
  for(let i=0;i<line.length;i++){
    if(line[i]==='"'){ inQ=!inQ; }
    else if(line[i]===delim && !inQ){ result.push(cur); cur=''; }
    else { cur+=line[i]; }
  }
  result.push(cur);
  return result;
}

// ── 9xxx Data store ──
const data9 = { mno: null, iptsp: null, mno_file: null, iptsp_file: null };

function parse9xxx(file, which){
  if(!file) return;
  data9[`${which}_file`] = file; // store raw file
  const reader = new FileReader();
  reader.onload = e => {
    const rows = parseCSV(e.target.result);
    const statusEl = document.getElementById(`status-9${which}`);
    const zoneEl = document.getElementById(`zone-9${which}`);

    // Find columns
    const sample = rows[0]||{};
    const clientKey = findKey(sample, ['clientId','client_id','ClientId','client']);
    const codeKey = findKey(sample, ['a2pResponseCode','a2presponsecode','a2pResponsecode','responseCode']);

    if(!clientKey || !codeKey){
      statusEl.textContent = `⚠ Columns not found (need clientId, a2pResponseCode)`;
      return;
    }

    data9[which] = rows;
    statusEl.textContent = `✓ ${rows.length} rows loaded`;
    zoneEl.classList.add('loaded');
    renderPivot9(which, rows, clientKey, codeKey);
  };
  reader.readAsText(file);
}

function findKey(obj, options){
  const keys = Object.keys(obj).map(k=>k.trim());
  for(const opt of options){
    const found = keys.find(k=>k.toLowerCase()===opt.toLowerCase());
    if(found) return found;
  }
  return null;
}

function renderPivot9(which, rows, clientKey, codeKey){
  // Build pivot: row=clientId, col=a2pResponseCode
  const clients = new Set();
  const codes = new Set();
  const counts = {};

  rows.forEach(r => {
    const client = r[clientKey]||'null';
    const code = r[codeKey]||'null';
    clients.add(client);
    codes.add(code);
    const k = `${client}::${code}`;
    counts[k] = (counts[k]||0) + 1;
  });

  const sortedClients = [...clients].sort();
  const sortedCodes = [...codes].sort();

  // Build dark pivot (for tool view)
  let html = `<table class="pivot-table"><thead><tr>
    <th>Row Labels</th>`;
  sortedCodes.forEach(c => { html += `<th>${c}</th>`; });
  html += `<th>Grand Total</th></tr></thead><tbody>`;

  const colTotals = {};
  sortedCodes.forEach(c => { colTotals[c]=0; });
  let grandTotal = 0;

  sortedClients.forEach(client => {
    let rowTotal = 0;
    let rowHtml = `<tr><td>${client}</td>`;
    sortedCodes.forEach(c => {
      const v = counts[`${client}::${c}`]||0;
      colTotals[c] += v;
      rowTotal += v;
      rowHtml += `<td class="${v===0?'zero':'has-val'}">${v===0?'':v}</td>`;
    });
    grandTotal += rowTotal;
    rowHtml += `<td class="has-val">${rowTotal||''}</td></tr>`;
    html += rowHtml;
  });

  // Grand total row
  html += `<tr class="grand-row"><td>Grand Total</td>`;
  sortedCodes.forEach(c => { html += `<td>${colTotals[c]||''}</td>`; });
  html += `<td>${grandTotal}</td></tr>`;
  html += `</tbody></table>`;

  document.getElementById(`pivot-9${which}`).innerHTML = html;

  // Store for screenshot
  data9[`${which}_pivot`] = { sortedClients, sortedCodes, counts, colTotals, grandTotal };
}

// ── Build screenshot view (white/clean) for 9xxx ──
function buildScreenshot(prefix){
  const which = prefix.replace('9','');
  const pivot = data9[`${which}_pivot`];
  const ssEl = document.getElementById(`ss-${prefix}`);

  if(!pivot){
    alert('Please upload CSV first');
    return;
  }

  const { sortedClients, sortedCodes, counts, colTotals, grandTotal } = pivot;
  const reporter = document.getElementById(`${prefix}-reporter`).value || '—';
  const status = statusMap[prefix] || 'Normal';
  const issue = document.getElementById(`${prefix}-issue`)?.value.trim() || '';
  const statusStr = status === 'Normal' ? 'Normal' : (issue||'Issue');

  const fromDate = document.getElementById('9xxx-from-date').value;
  const fromTime = document.getElementById('9xxx-from-time').value;
  const toDate = document.getElementById('9xxx-to-date').value;
  const toTime = document.getElementById('9xxx-to-time').value;
  const period = `${fmtDT(fromDate, fromTime)} - ${fmtDT(toDate, toTime)}`;

  const typeLabel = which === 'mno' ? 'MNO' : 'IPTSP';

  // Build count label for column header
  let tableHtml = `<table class="ss-table"><thead><tr>
    <th>Count of a2pResponseCode</th>
    <th colspan="${sortedCodes.length}" style="text-align:center;background:#e8e8e8;">Column Labels</th>
    <th>Grand Total</th>
  </tr><tr>
    <th>Row Labels</th>`;
  sortedCodes.forEach(c => { tableHtml += `<th>${c}</th>`; });
  tableHtml += `<th>Grand Total</th></tr></thead><tbody>`;

  sortedClients.forEach(client => {
    let rowTotal = 0;
    let rowHtml = `<tr><td>${client}</td>`;
    sortedCodes.forEach(c => {
      const v = counts[`${client}::${c}`]||0;
      rowTotal += v;
      rowHtml += `<td class="${v===0?'zero':''}">${v===0?'':v}</td>`;
    });
    rowHtml += `<td>${rowTotal||''}</td></tr>`;
    tableHtml += rowHtml;
  });

  tableHtml += `<tr class="grand-row"><td>Grand Total</td>`;
  sortedCodes.forEach(c => { tableHtml += `<td>${colTotals[c]||''}</td>`; });
  tableHtml += `<td>${grandTotal}</td></tr></tbody></table>`;

  const statusClass = status==='Normal' ? 'ss-status-normal' : 'ss-status-issue';

  ssEl.innerHTML = `
    <div class="ss-inner" id="ss-inner-${prefix}">
      <div class="ss-header">
        <div>
          <div class="ss-title">9xxx Error Report — ${typeLabel}</div>
          <div class="ss-meta">${period}</div>
        </div>
      </div>
      ${tableHtml}
      <div class="ss-footer">
        <div><strong>Reporter:</strong> ${reporter}</div>
        <div><strong>Status:</strong> <span class="${statusClass}">${statusStr}</span></div>
      </div>
    </div>
    <div class="ss-actions">
      <button class="btn-copy-img" onclick="copyAsImage('ss-inner-${prefix}', this)">📋 Copy as Image</button>
      <button class="btn-copy-img" onclick="copyReportText('${typeLabel}','${period.replace(/'/g,"\\'")}','${reporter}','${statusStr}', this)">📄 Copy Text</button>
    </div>`;

  ssEl.classList.add('show');
  setTimeout(() => ssEl.scrollIntoView({behavior:'smooth', block:'nearest'}), 100);
}

// ── 1xxx Data store ──
const data1 = { mno: null, iptsp: null, mno_file: null, iptsp_file: null };

function parse1xxx(file, which){
  if(!file) return;
  data1[`${which}_file`] = file; // store raw file
  const reader = new FileReader();
  reader.onload = e => {
    const rows = parseCSV(e.target.result);
    const statusEl = document.getElementById(`status-1${which}`);
    const zoneEl = document.getElementById(`zone-1${which}`);

    const sample = rows[0]||{};
    const clientKey = findKey(sample, ['clientId','client_id','ClientId','client']);
    const gwKey = findKey(sample, ['applicableSmsGateway','applicablesmsgateway','smsGateway','gateway','applicableSmsGateway.keyword']);
    const codeKey = findKey(sample, ['ansResponseCode','ansresponsecode','ansResponsecode','ansResponse']);

    if(!clientKey || !codeKey){
      statusEl.textContent = `⚠ Columns not found (need clientId, applicableSmsGateway, ansResponseCode)`;
      return;
    }

    data1[which] = rows;
    statusEl.textContent = `✓ ${rows.length} rows loaded`;
    zoneEl.classList.add('loaded');
    renderPivot1(which, rows, clientKey, gwKey, codeKey);
  };
  reader.readAsText(file);
}

function renderPivot1(which, rows, clientKey, gwKey, codeKey){
  // Columns: gateway grouped, with sub-codes, then grand total
  // Rows: clientId
  const clients = new Set();
  const gwCodeCols = []; // [{gw, code}] unique combos
  const gwCodeSet = new Set();
  const gateways = new Set();
  const codes = new Set();
  const counts = {}; // key: clientId::gw::code

  rows.forEach(r => {
    const client = r[clientKey]||'null';
    const gw = gwKey ? (r[gwKey]||'null') : 'null';
    const code = r[codeKey]||'null';
    clients.add(client);
    gateways.add(gw);
    codes.add(code);
    const combo = `${gw}::${code}`;
    if(!gwCodeSet.has(combo)){
      gwCodeSet.add(combo);
      gwCodeCols.push({gw, code});
    }
    const k = `${client}::${gw}::${code}`;
    counts[k] = (counts[k]||0) + 1;
  });

  // Sort: by gw then code
  gwCodeCols.sort((a,b) => a.gw.localeCompare(b.gw)||a.code.localeCompare(b.code));
  const sortedClients = [...clients].sort();
  const sortedGWs = [...new Set(gwCodeCols.map(x=>x.gw))];

  // Build header row 1: gw groups with colspan
  const gwGroups = {};
  gwCodeCols.forEach(({gw}) => { gwGroups[gw]=(gwGroups[gw]||0)+1; });

  // DARK PIVOT
  let html = `<table class="pivot-table"><thead>`;
  // Row 1: gw headers
  html += `<tr><th rowspan="2">Row Labels</th>`;
  sortedGWs.forEach(gw => {
    html += `<th colspan="${gwGroups[gw]+1}" style="text-align:center;border-bottom:1px solid #333;">${gw}</th>`;
  });
  html += `<th rowspan="2">Grand Total</th></tr>`;
  // Row 2: code sub-headers + total per gw
  html += `<tr>`;
  sortedGWs.forEach(gw => {
    gwCodeCols.filter(x=>x.gw===gw).forEach(({code}) => { html += `<th>${code}</th>`; });
    html += `<th>${gw} Total</th>`;
  });
  html += `</tr></thead><tbody>`;

  const colTotals = {}; // gw::code -> total
  const gwTotals = {};  // gw -> total
  gwCodeCols.forEach(({gw,code}) => { colTotals[`${gw}::${code}`]=0; });
  sortedGWs.forEach(gw => { gwTotals[gw]=0; });
  let grandTotal = 0;

  sortedClients.forEach(client => {
    let rowTotal = 0;
    let rowHtml = `<tr><td>${client}</td>`;
    sortedGWs.forEach(gw => {
      let gwRow = 0;
      gwCodeCols.filter(x=>x.gw===gw).forEach(({code}) => {
        const v = counts[`${client}::${gw}::${code}`]||0;
        colTotals[`${gw}::${code}`] += v;
        gwTotals[gw] += v;
        gwRow += v;
        rowHtml += `<td class="${v===0?'zero':'has-val'}">${v===0?'':v}</td>`;
      });
      rowTotal += gwRow;
      rowHtml += `<td class="${gwRow===0?'zero':'has-val'}">${gwRow||''}</td>`;
    });
    grandTotal += rowTotal;
    rowHtml += `<td class="has-val">${rowTotal||''}</td></tr>`;
    html += rowHtml;
  });

  // Grand total row
  html += `<tr class="grand-row"><td>Grand Total</td>`;
  sortedGWs.forEach(gw => {
    gwCodeCols.filter(x=>x.gw===gw).forEach(({code}) => { html += `<td>${colTotals[`${gw}::${code}`]||''}</td>`; });
    html += `<td>${gwTotals[gw]||''}</td>`;
  });
  html += `<td>${grandTotal}</td></tr></tbody></table>`;

  document.getElementById(`pivot-1${which}`).innerHTML = html;
  data1[`${which}_pivot`] = { sortedClients, gwCodeCols, sortedGWs, gwGroups, counts, colTotals, gwTotals, grandTotal };
}

function buildScreenshot1(prefix){
  const which = prefix.replace('1','');
  const pivot = data1[`${which}_pivot`];
  const ssEl = document.getElementById(`ss-${prefix}`);

  if(!pivot){ alert('Please upload CSV first'); return; }

  const { sortedClients, gwCodeCols, sortedGWs, gwGroups, counts, colTotals, gwTotals, grandTotal } = pivot;
  const reporter = document.getElementById(`${prefix}-reporter`).value || '—';
  const status = statusMap[prefix] || 'Normal';
  const issue = document.getElementById(`${prefix}-issue`)?.value.trim() || '';
  const statusStr = status === 'Normal' ? 'Normal' : (issue||'Issue');
  const fromDate = document.getElementById('1xxx-from-date').value;
  const fromTime = document.getElementById('1xxx-from-time').value;
  const toDate = document.getElementById('1xxx-to-date').value;
  const toTime = document.getElementById('1xxx-to-time').value;
  const period = `${fmtDT(fromDate, fromTime)} - ${fmtDT(toDate, toTime)}`;
  const typeLabel = which === 'mno' ? 'MNO' : 'IPTSP';

  let tableHtml = `<table class="ss-table"><thead>`;
  tableHtml += `<tr><th rowspan="2">Count of ansResponseCode</th>`;
  sortedGWs.forEach(gw => {
    tableHtml += `<th colspan="${gwGroups[gw]+1}" style="text-align:center;background:#e0e0e0;">${gw}</th>`;
  });
  tableHtml += `<th rowspan="2">Grand Total</th></tr><tr>`;
  sortedGWs.forEach(gw => {
    gwCodeCols.filter(x=>x.gw===gw).forEach(({code}) => { tableHtml += `<th>${code}</th>`; });
    tableHtml += `<th>${gw} Total</th>`;
  });
  tableHtml += `</tr></thead><tbody>`;

  sortedClients.forEach(client => {
    let rowTotal = 0;
    let rh = `<tr><td>${client}</td>`;
    sortedGWs.forEach(gw => {
      let gwRow = 0;
      gwCodeCols.filter(x=>x.gw===gw).forEach(({code}) => {
        const v = counts[`${client}::${gw}::${code}`]||0;
        gwRow += v; rowTotal += v;
        rh += `<td class="${v===0?'zero':''}">${v===0?'':v}</td>`;
      });
      rh += `<td>${gwRow||''}</td>`;
    });
    rh += `<td>${rowTotal||''}</td></tr>`;
    tableHtml += rh;
  });

  tableHtml += `<tr class="grand-row"><td>Grand Total</td>`;
  sortedGWs.forEach(gw => {
    gwCodeCols.filter(x=>x.gw===gw).forEach(({code}) => { tableHtml += `<td>${colTotals[`${gw}::${code}`]||''}</td>`; });
    tableHtml += `<td>${gwTotals[gw]||''}</td>`;
  });
  tableHtml += `<td>${grandTotal}</td></tr></tbody></table>`;

  const statusClass = status==='Normal' ? 'ss-status-normal' : 'ss-status-issue';
  ssEl.innerHTML = `
    <div class="ss-inner" id="ss-inner-${prefix}">
      <div class="ss-header">
        <div>
          <div class="ss-title">1xxx Error Report — ${typeLabel}</div>
          <div class="ss-meta">${period}</div>
        </div>
      </div>
      ${tableHtml}
      <div class="ss-footer">
        <div><strong>Reporter:</strong> ${reporter}</div>
        <div><strong>Status:</strong> <span class="${statusClass}">${statusStr}</span></div>
      </div>
    </div>
    <div class="ss-actions">
      <button class="btn-copy-img" onclick="copyAsImage('ss-inner-${prefix}', this)">📋 Copy as Image</button>
      <button class="btn-copy-img" onclick="copyReportText('${typeLabel}','${period.replace(/'/g,"\\'")}','${reporter}','${statusStr}', this)">📄 Copy Text</button>
    </div>`;
  ssEl.classList.add('show');
  setTimeout(() => ssEl.scrollIntoView({behavior:'smooth', block:'nearest'}), 100);
}

// ── HTTP 4xx/5xx ──
const HTTP_SOURCES = ["GP","RB","BL","TT","ADN","FN","MN","BR","RT","AIT","MTN","PRM","RCO","BN","WBL","RDT","BOS","BTC","LNK","ICO","AGI","ICC"];
const HTTP_CODES   = ["400","401","402","403","404","500","501","502","503","504"];

function buildHTTPSources(){
  const sl = document.getElementById('http-source-list');
  HTTP_SOURCES.forEach(s => {
    const block = document.createElement('div');
    block.className = 'src-block';
    block.id = `src-${s}`;
    const codesHtml = HTTP_CODES.map(c =>
      `<div class="code-item"><label>${c}</label>
       <input type="number" id="hc-${s}-${c}" placeholder="0" min="0" oninput="updateHTTPTotal('${s}');refreshHTTP()"></div>`
    ).join('');
    block.innerHTML = `
      <div class="src-header" onclick="toggleSrc('${s}')">
        <span class="src-name">${s}</span>
        <span style="display:flex;align-items:center;gap:4px;">
          <span class="src-total" id="htotal-${s}">—</span>
          <span class="src-arrow">▼</span>
        </span>
      </div>
      <div class="src-codes"><div class="codes-grid">${codesHtml}</div></div>`;
    sl.appendChild(block);
  });
}
buildHTTPSources();

function toggleSrc(s){
  document.getElementById(`src-${s}`).classList.toggle('open');
}

// ── HTTP CSV Parse ──
const HTTP_SOURCE_MAP = {
  'GP': 'gp', 'RB': 'rb', 'BL': 'bl', 'TT': 'tt', 'ADN': 'adn',
  'FN': 'fn', 'MN': 'mn', 'BR': 'br', 'RT': 'rt', 'AIT': 'ait',
  'MTN': 'mtn', 'PRM': 'prm', 'RCO': 'rco', 'BN': 'bn', 'WBL': 'wbl',
  'RDT': 'rdt', 'BOS': 'bos', 'BTC': 'btc', 'LNK': 'lnk', 'ICO': 'ico',
  'AGI': 'agi', 'ICC': 'icc'
};

function matchSource(ansType){
  const val = (ansType||'').toLowerCase();
  // Split ans_type by separators to get tokens, then match against source names
  const tokens = val.split(/[-\/_ ]/);
  const sorted = HTTP_SOURCES.slice().sort((a,b) => b.length - a.length);
  for(const src of sorted){
    const s = src.toLowerCase();
    // Check if any token starts with or equals the source name
    if(tokens.some(t => t === s || t.startsWith(s))) return src;
  }
  return null;
}

function parseHTTPcsv(file){
  if(!file) return;
  const statusEl = document.getElementById('status-http');
  const zoneEl = document.getElementById('zone-http');
  const reader = new FileReader();
  reader.onload = e => {
    const rows = parseCSV(e.target.result);
    const sample = rows[0]||{};
    const ansKey = findKey(sample, ['ans_type','ansType','ans_Type']);
    // event.original may have dot — check all keys directly
    const evtKey = Object.keys(sample).find(k =>
      k.toLowerCase().includes('event') || k.toLowerCase() === 'original'
    ) || findKey(sample, ['event.original','eventOriginal','event_original','original']);

    if(!ansKey || !evtKey){
      statusEl.textContent = '⚠ Columns not found (need ans_type, event.original)';
      return;
    }

    // Count per source per HTTP code
    const counts = {}; // source -> code -> count
    HTTP_SOURCES.forEach(s => { counts[s] = {}; });

    rows.forEach(r => {
      const src = matchSource(r[ansKey]);
      if(!src) return;
      const evt = r[evtKey]||'';
      // Extract HTTP code by splitting on space and finding token after HTTP/x.x
      const parts = evt.split(' ');
      let code = null;
      for(let i = 0; i < parts.length; i++){
        if(parts[i].startsWith('HTTP/') && i+1 < parts.length){
          const c = parts[i+1];
          if(c && c.length === 3 && !isNaN(c)) { code = c; break; }
        }
      }
      if(!code) return;
      if(!['400','401','402','403','404','500','501','502','503','504'].includes(code)) return;
      counts[src][code] = (counts[src][code]||0) + 1;
    });

    // Fill inputs
    HTTP_SOURCES.forEach(s => {
      HTTP_CODES.forEach(c => {
        const el = document.getElementById(`hc-${s}-${c}`);
        if(el){
          const v = counts[s][c]||0;
          el.value = v > 0 ? v : '';
        }
      });
      updateHTTPTotal(s);
    });

    statusEl.textContent = `✓ ${rows.length} rows parsed — sources auto-filled`;
    zoneEl.classList.add('loaded');
    refreshHTTP();
  };
  reader.readAsText(file);
}


function toggleSrc(s){
  document.getElementById(`src-${s}`).classList.toggle('open');
}

function getHVal(s,c){
  const v=parseInt(document.getElementById(`hc-${s}-${c}`).value);
  return isNaN(v)?0:v;
}

function updateHTTPTotal(s){
  const total = HTTP_CODES.reduce((sum,c)=>sum+getHVal(s,c),0);
  const el = document.getElementById(`htotal-${s}`);
  const block = document.getElementById(`src-${s}`);
  if(total > 0){
    el.textContent = `${total} hits`;
    el.style.color = 'var(--accent)';
    block.classList.add('has-data');
  } else {
    el.textContent = '—';
    el.style.color = '';
    block.classList.remove('has-data');
  }
}

function fmtDT(dateVal, timeVal){
  if(!dateVal) return '—';
  const [y,m,d] = dateVal.split('-').map(Number);
  const [h,mn] = (timeVal||'00:00').split(':').map(Number);
  const mo=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${mo[m-1]} ${pad(d)}, ${y} @ ${pad(h)}:${pad(mn)}:00.000`;
}

function fmtTimeNow(){ const n=new Date(); return `${pad(n.getHours())}:${pad(n.getMinutes())}`; }

function buildHTTPReport(){
  const fromDate = document.getElementById('http-from-date').value;
  const fromTime = document.getElementById('http-from-time').value;
  const toDate   = document.getElementById('http-to-date').value;
  const toTime   = document.getElementById('http-to-time').value;
  const reporter = document.getElementById('http-reporter').value||'—';
  const status   = statusMap['http']||'Normal';
  const issue    = document.getElementById('http-issue').value.trim();
  const statusStr= status==='Normal'?'Normal':(issue||'—');
  const period   = `${fmtDT(fromDate,fromTime)} - ${fmtDT(toDate,toTime)}`;

  const lines = HTTP_SOURCES.map(s => {
    const parts = [];
    HTTP_CODES.forEach(c => { const v=getHVal(s,c); if(v>0) parts.push(`${c}-${v}`); });
    const total = parts.reduce((sum,p)=>sum+parseInt(p.split('-')[1]),0);
    const padS = s.padEnd(5,' ');
    return total===0 ? `${padS}: 0 hits` : `${padS}: ${total} hits (${parts.join(', ')})`;
  });

  return { period, srcLines: lines.join('\n'), reporter, statusStr };
}

function generateHTTP(){
  refreshHTTP();
  const output = document.getElementById('http-output');
  output.style.display = 'block';
  setTimeout(() => output.scrollIntoView({behavior:'smooth', block:'nearest'}), 100);
}

function refreshHTTP(){
  const r = buildHTTPReport();
  const periodEl = document.getElementById('http-ss-period');
  const reporterEl = document.getElementById('http-ss-reporter');
  const statusEl = document.getElementById('http-ss-status');
  const srcEl = document.getElementById('http-copy-text');
  const fullEl = document.getElementById('http-full-text');
  if(periodEl) periodEl.textContent = r.period;
  if(srcEl) srcEl.textContent = r.srcLines;
  if(fullEl) fullEl.textContent = `${r.period}\n\`\`\`\n${r.srcLines}\n\`\`\`\nReporter: ${r.reporter}\nStatus  : ${r.statusStr}`;
  if(reporterEl) reporterEl.innerHTML = `<strong>Reporter:</strong> ${r.reporter}`;
  if(statusEl){
    const cls = (statusMap['http']||'Normal')==='Normal' ? 'ss-status-normal' : 'ss-status-issue';
    statusEl.innerHTML = `<strong>Status:</strong> <span class="${cls}">${r.statusStr}</span>`;
  }
}
refreshHTTP();


// ── DLR ──
const DLR_KNOWN = {
  '1000': 'Success',
  '1020': 'Internal Server Error',
  '1052': 'Submission record not found'
};
// Dynamic store: key = statusCode string, value = count
let dlrData = {};

function parseDLR(file){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const rows = parseCSV(e.target.result);
    const statusEl = document.getElementById('status-dlr');
    const sample = rows[0]||{};
    const bodyKey = findKey(sample, ['message_body','messageBody','body','message_Body']);
    if(!bodyKey){
      statusEl.textContent = `⚠ message_body column not found`;
      return;
    }

    dlrData = {};
    rows.forEach(r => {
      const body = r[bodyKey]||'';
      const match = body.match(/statusCode=(\d+)/);
      if(match){
        const code = match[1];
        dlrData[code] = (dlrData[code]||0) + 1;
      }
    });

    renderDLRCounts();
    statusEl.textContent = `✓ ${rows.length} rows parsed`;
    document.getElementById('zone-dlr').classList.add('loaded');
  };
  reader.readAsText(file);
}

function renderDLRCounts(){
  // Rebuild the counts display and manual override boxes dynamically
  const countsBox = document.getElementById('dlr-counts-box');
  const manualBox = document.getElementById('dlr-manual-box');

  const allCodes = Object.keys(dlrData).sort();

  // Counts display
  countsBox.innerHTML = allCodes.map(code => `
    <div class="dlr-val-box">
      <div class="dlr-code">statusCode=${code}</div>
      <div class="dlr-count">${dlrData[code]}</div>
      <div class="dlr-label">${DLR_KNOWN[code]||'Unknown'}</div>
    </div>`).join('');

  // Manual override
  manualBox.innerHTML = `<div class="card-label">Manual Override (if needed)</div>
    <div class="field-grid-3" style="margin-top:6px;">
      ${allCodes.map(code => `
        <div class="field-block">
          <label>${code}</label>
          <input type="number" id="dlr-m-${code}" value="${dlrData[code]}" min="0" oninput="updateDLRManual('${code}')">
        </div>`).join('')}
    </div>`;
}

function updateDLRManual(code){
  const v = parseInt(document.getElementById(`dlr-m-${code}`).value)||0;
  dlrData[code] = v;
  // Update count display if element exists
  const countsBox = document.getElementById('dlr-counts-box');
  const countEl = countsBox.querySelectorAll('.dlr-count');
  const allCodes = Object.keys(dlrData).sort();
  const idx = allCodes.indexOf(code);
  if(countEl[idx]) countEl[idx].textContent = v;
}

function buildDLRScreenshot(){
  const fromDate = document.getElementById('dlr-from-date').value;
  const fromTime = document.getElementById('dlr-from-time').value;
  const toDate   = document.getElementById('dlr-to-date').value;
  const toTime   = document.getElementById('dlr-to-time').value;
  const reporter = document.getElementById('dlr-reporter').value||'—';
  const status   = statusMap['dlr']||'Normal';
  const issue    = document.getElementById('dlr-issue').value.trim();
  const statusStr= status==='Normal'?'Normal':(issue||'—');
  const period   = `${fmtDT(fromDate,fromTime)} - ${fmtDT(toDate,toTime)}`;
  const statusClass = status==='Normal'?'ss-status-normal':'ss-status-issue';

  const allCodes = Object.keys(dlrData).sort();

  const rows = allCodes.length > 0
    ? allCodes.map(code => `
        <tr>
          <td>${code}</td>
          <td style="text-align:left;">${DLR_KNOWN[code]||'—'}</td>
          <td>${dlrData[code]||''}</td>
        </tr>`).join('')
    : `<tr><td colspan="3" style="text-align:center;color:#aaa;">No data</td></tr>`;

  const tableHtml = `
    <table class="ss-table">
      <thead>
        <tr>
          <th style="text-align:left;">Status Code</th>
          <th style="text-align:left;">Error Description</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;

  const ssEl = document.getElementById('ss-dlr');
  ssEl.innerHTML = `
    <div class="ss-inner" id="ss-inner-dlr">
      <div class="ss-header">
        <div>
          <div class="ss-title">DLR Report</div>
          <div class="ss-meta">${period}</div>
        </div>
      </div>
      ${tableHtml}
      <div class="ss-footer">
        <div><strong>Reporter:</strong> ${reporter}</div>
        <div><strong>Status:</strong> <span class="${statusClass}">${statusStr}</span></div>
      </div>
    </div>
    <div class="ss-actions">
      <button class="btn-copy-img" onclick="copyAsImage('ss-inner-dlr', this)">📋 Copy as Image</button>
      <button class="btn-copy-img" onclick="copyReportText('DLR','${period.replace(/'/g,"\\'")}','${reporter}','${statusStr}', this)">📄 Copy Text</button>
    </div>`;

  ssEl.classList.add('show');
  setTimeout(() => ssEl.scrollIntoView({behavior:'smooth', block:'nearest'}), 100);
}


// ── Copy text 9xxx ──
function copyText9(which){
  const pivot = data9[`${which}_pivot`];
  if(!pivot){ alert('No data yet'); return; }
  const { sortedClients, sortedCodes, counts, colTotals, grandTotal } = pivot;
  const prefix = `9${which}`;
  const reporter = document.getElementById(`${prefix}-reporter`).value||'—';
  const status = statusMap[prefix]||'Normal';
  const issue = document.getElementById(`${prefix}-issue`)?.value.trim()||'';
  const statusStr = status==='Normal'?'Normal':(issue||'—');
  const fromDate = document.getElementById('9xxx-from-date').value;
  const fromTime = document.getElementById('9xxx-from-time').value;
  const toDate   = document.getElementById('9xxx-to-date').value;
  const toTime   = document.getElementById('9xxx-to-time').value;
  const period   = `${fmtDT(fromDate,fromTime)} - ${fmtDT(toDate,toTime)}`;
  const typeLabel = which==='mno'?'MNO':'IPTSP';

  // Build monospace table
  const colW = 8;
  let header = 'clientId'.padEnd(24);
  sortedCodes.forEach(c=>{ header += c.padStart(colW); });
  header += 'Total'.padStart(colW);
  const sep = '-'.repeat(header.length);

  let rows = sortedClients.map(cl => {
    let row = cl.padEnd(24);
    let total=0;
    sortedCodes.forEach(c=>{ const v=counts[`${cl}::${c}`]||0; total+=v; row+=String(v||'').padStart(colW); });
    row += String(total).padStart(colW);
    return row;
  }).join('\n');

  let gtRow = 'Grand Total'.padEnd(24);
  sortedCodes.forEach(c=>{ gtRow+=String(colTotals[c]||'').padStart(colW); });
  gtRow += String(grandTotal).padStart(colW);

  const text = `9xxx Report — ${typeLabel}\n${period}\n\n${header}\n${sep}\n${rows}\n${sep}\n${gtRow}\n\nReporter: ${reporter}\nStatus  : ${statusStr}`;
  navigator.clipboard.writeText(text).then(()=>alert('Copied!')).catch(()=>{ prompt('Copy this:', text); });
}

function copyText1(which){
  const pivot = data1[`${which}_pivot`];
  if(!pivot){ alert('No data yet'); return; }
  const prefix = `1${which}`;
  const reporter = document.getElementById(`${prefix}-reporter`).value||'—';
  const status = statusMap[prefix]||'Normal';
  const issue = document.getElementById(`${prefix}-issue`)?.value.trim()||'';
  const statusStr = status==='Normal'?'Normal':(issue||'—');
  const fromDate = document.getElementById('1xxx-from-date').value;
  const fromTime = document.getElementById('1xxx-from-time').value;
  const toDate   = document.getElementById('1xxx-to-date').value;
  const toTime   = document.getElementById('1xxx-to-time').value;
  const period   = `${fmtDT(fromDate,fromTime)} - ${fmtDT(toDate,toTime)}`;
  const typeLabel = which==='mno'?'MNO':'IPTSP';

  const { sortedClients, gwCodeCols, sortedGWs, counts, gwTotals, grandTotal } = pivot;

  let lines = [`1xxx Report — ${typeLabel}`, period, ''];
  sortedGWs.forEach(gw => {
    const gwCodes = gwCodeCols.filter(x=>x.gw===gw);
    lines.push(`[ ${gw} ]`);
    let header = 'clientId'.padEnd(24) + gwCodes.map(({code})=>code.padStart(8)).join('') + '  Total';
    lines.push(header);
    lines.push('-'.repeat(header.length));
    sortedClients.forEach(cl => {
      let row = cl.padEnd(24); let t=0;
      gwCodes.forEach(({code}) => { const v=counts[`${cl}::${gw}::${code}`]||0; t+=v; row+=String(v||'').padStart(8); });
      row += String(t).padStart(8);
      lines.push(row);
    });
    lines.push(`Grand Total`.padEnd(24) + gwCodes.map(({gw:g,code})=>{
      return String(pivot.colTotals[`${g}::${code}`]||'').padStart(8);
    }).join('') + String(gwTotals[gw]).padStart(8));
    lines.push('');
  });
  lines.push(`Reporter: ${reporter}`);
  lines.push(`Status  : ${statusStr}`);

  const text = lines.join('\n');
  navigator.clipboard.writeText(text).then(()=>alert('Copied!')).catch(()=>{ prompt('Copy this:', text); });
}

// ── Generic copy ──
function doCopy(id, btn){
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(()=>{
    const orig = btn.textContent;
    btn.textContent = 'Copied ✓';
    setTimeout(()=>{ btn.textContent=orig; }, 2000);
  });
}

// ── Auto-refresh HTTP preview on field changes ──
['http-from-date','http-from-time','http-to-date','http-to-time','http-reporter','http-issue'].forEach(id=>{
  const el = document.getElementById(id);
  if(el) el.addEventListener('input', () => {
    // Only refresh if output already visible
    const output = document.getElementById('http-output');
    if(output && output.style.display !== 'none') refreshHTTP();
  });
});
// ── Renamed CSV Download ──
function downloadReport9(which){
  const file = data9[`${which}_file`];
  if(!file){ alert('No file found'); return; }
  const fromDate = document.getElementById('9xxx-from-date').value;
  const fromTime = document.getElementById('9xxx-from-time').value;
  const ansType = which === 'mno' ? 'M' : 'I';
  const fileName = buildFileName('X9', ansType, fromDate, fromTime);
  downloadRenamedCSV(file, fileName);
}

function downloadReport1(which){
  const file = data1[`${which}_file`];
  if(!file){ alert('No file found'); return; }
  const fromDate = document.getElementById('1xxx-from-date').value;
  const fromTime = document.getElementById('1xxx-from-time').value;
  const ansType = which === 'mno' ? 'M' : 'I';
  const fileName = buildFileName('X1', ansType, fromDate, fromTime);
  downloadRenamedCSV(file, fileName);
}

function buildFileName(errorType, ansType, fromDate, fromTime){
  // errorType: 'X9' or 'X1', ansType: 'M' or 'I'
  // fromDate: '2026-01-31', fromTime: '00:00'
  if(!fromDate) return `${errorType}_${ansType}_unknown.csv`;
  const d = fromDate.replace(/-/g,''); // 20260131
  const h = (fromTime||'00:00').split(':')[0].padStart(2,'0'); // 00
  return `${errorType}_${ansType}_${d}_${h}.csv`;
}

function downloadRenamedCSV(file, fileName){
  if(!file) return;
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Save Files Tab ──
function refreshSaveFiles(){
  const fromDate9 = document.getElementById('9xxx-from-date').value;
  const fromTime9 = document.getElementById('9xxx-from-time').value;
  const fromDate1 = document.getElementById('1xxx-from-date').value;
  const fromTime1 = document.getElementById('1xxx-from-time').value;

  const files = [
    { key: 'X9_M', file: data9['mno_file'],   name: buildFileName('X9','M', fromDate9, fromTime9), label: '9xxx MNO' },
    { key: 'X9_I', file: data9['iptsp_file'],  name: buildFileName('X9','I', fromDate9, fromTime9), label: '9xxx IPTSP' },
    { key: 'X1_M', file: data1['mno_file'],    name: buildFileName('X1','M', fromDate1, fromTime1), label: '1xxx MNO' },
    { key: 'X1_I', file: data1['iptsp_file'],  name: buildFileName('X1','I', fromDate1, fromTime1), label: '1xxx IPTSP' },
  ];

  const list = document.getElementById('save-file-list');
  list.innerHTML = files.map(f => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;">
      <div>
        <div style="font-family:var(--mono);font-size:12px;color:var(--text);">${f.name}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px;">${f.label} · ${f.file ? '<span style="color:var(--accent);">Ready</span>' : '<span style="color:var(--text3);">No file uploaded</span>'}</div>
      </div>
      ${f.file ? `<button class="btn-copy-img" onclick="downloadRenamedCSV(${f.key.includes('9')?'data9':'data1'}['${f.key.includes('M')?'mno':'iptsp'}_file'], '${f.name}')">⬇</button>` : ''}
    </div>`).join('');
}

function downloadAllFiles(){
  const fromDate9 = document.getElementById('9xxx-from-date').value;
  const fromTime9 = document.getElementById('9xxx-from-time').value;
  const fromDate1 = document.getElementById('1xxx-from-date').value;
  const fromTime1 = document.getElementById('1xxx-from-time').value;

  const files = [
    { file: data9['mno_file'],  name: buildFileName('X9','M', fromDate9, fromTime9) },
    { file: data9['iptsp_file'],name: buildFileName('X9','I', fromDate9, fromTime9) },
    { file: data1['mno_file'],  name: buildFileName('X1','M', fromDate1, fromTime1) },
    { file: data1['iptsp_file'],name: buildFileName('X1','I', fromDate1, fromTime1) },
  ];

  const available = files.filter(f => f.file);
  if(available.length === 0){ alert('No files uploaded yet.'); return; }

  available.forEach((f, i) => {
    setTimeout(() => downloadRenamedCSV(f.file, f.name), i * 400);
  });
}

// ── Copy report caption text ──
function copyReportText(typeLabel, period, reporter, statusStr, btn) {
  const text = `${typeLabel},\n${period}\n\nReporter: ${reporter}\nStatus  : ${statusStr}`;
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  }).catch(() => { prompt('Copy this:', text); });
}

// ── Copy as Image ──
async function copyAsImage(innerId, btn) {
  const el = document.getElementById(innerId);
  if (!el) return;
  const orig = btn.textContent;
  btn.textContent = 'Generating…';
  btn.disabled = true;
  try {
    const rect = el.getBoundingClientRect();
    const canvas = await html2canvas(el, {
      backgroundColor: '#ffffff',
      scale: 3,
      useCORS: true,
      logging: false,
      width: el.scrollWidth,
      height: el.scrollHeight,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
    });
    canvas.toBlob(async blob => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        btn.textContent = '✓ Image Copied!';
      } catch (err) {
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report-table.png';
        a.click();
        btn.textContent = '✓ Downloaded!';
      }
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
      }, 2500);
    }, 'image/png');
  } catch (err) {
    btn.textContent = 'Error — try again';
    btn.disabled = false;
  }
}
