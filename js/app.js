/**
 * IBAN-Rechner – Haupt-Anwendungslogik
 * Tabs: Berechnen · Validieren · Aufschlüsseln · BLZ/BIC-Suche ·
 *       Massenverarbeitung · GiroCode · Länder & Formate
 */

'use strict';

// ─── Tab-Navigation ───────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + target).classList.add('active');
  });
});

// ─── Hilfsfunktionen ──────────────────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add('copied');
    btn.textContent = '✓ Kopiert';
    setTimeout(() => { btn.classList.remove('copied'); btn.textContent = '⎘ Kopieren'; }, 2000);
  });
}

function sepaBadge(sepa) {
  return sepa
    ? `<span class="badge badge-sepa">✓ SEPA</span>`
    : `<span class="badge badge-nosepa">Kein SEPA</span>`;
}

function instantBadge(instant) {
  return instant ? `<span class="badge badge-instant">⚡ Instant</span>` : '';
}

function bankInfoHtml(blz) {
  const b = lookupBLZ(blz);
  if (!b) return '';
  return `
    <tr><th>Bank</th><td>${escHtml(b.name)}</td></tr>
    <tr><th>Stadt</th><td>${escHtml(b.city)}</td></tr>
    <tr><th>BIC / SWIFT</th><td class="mono">${escHtml(b.bic)}</td></tr>
    <tr><th>Status</th><td>${sepaBadge(b.sepa)} ${instantBadge(b.instant)}</td></tr>
  `;
}

// ─── 1. IBAN BERECHNEN ────────────────────────────────────────────────────────
(function () {
  const countrySelect = document.getElementById('calc-country');
  const deFields      = document.getElementById('calc-de-fields');
  const genericFields = document.getElementById('calc-generic-fields');
  const blzInput      = document.getElementById('calc-blz');
  const kontoInput    = document.getElementById('calc-konto');
  const bbanInput     = document.getElementById('calc-bban');
  const bbanHint      = document.getElementById('calc-bban-hint');
  const resultDiv     = document.getElementById('calc-result');

  // Länder-Dropdown befüllen
  getAllCountries().forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = `${c.code} – ${c.name}`;
    if (c.code === 'DE') opt.selected = true;
    countrySelect.appendChild(opt);
  });

  function updateFields() {
    const code = countrySelect.value;
    const info = getCountryInfo(code);
    if (code === 'DE') {
      deFields.classList.remove('hidden');
      genericFields.classList.add('hidden');
    } else {
      deFields.classList.add('hidden');
      genericFields.classList.remove('hidden');
      if (info) {
        const bbanLen = info.length - 4;
        bbanHint.textContent = `(${bbanLen} Zeichen für ${info.name})`;
        bbanInput.placeholder = '0'.repeat(bbanLen);
        bbanInput.maxLength = bbanLen;
      }
    }
    resultDiv.innerHTML = '';
  }

  countrySelect.addEventListener('change', updateFields);
  updateFields();

  // Auto-Format BLZ (Leerzeichen entfernen)
  blzInput?.addEventListener('input', () => {
    blzInput.value = blzInput.value.replace(/\D/g, '').slice(0, 8);
  });
  kontoInput?.addEventListener('input', () => {
    kontoInput.value = kontoInput.value.replace(/\D/g, '').slice(0, 10);
  });

  document.getElementById('calc-form').addEventListener('submit', e => {
    e.preventDefault();
    const code = countrySelect.value;
    let result;

    if (code === 'DE') {
      result = calculateGermanIBAN(blzInput.value, kontoInput.value);
    } else {
      result = calculateIBAN(code, bbanInput.value.toUpperCase().trim());
    }

    if (!result.success) {
      resultDiv.innerHTML = `
        <div class="result-box error">
          <div class="result-title">✗ Fehler</div>
          ${escHtml(result.error)}
        </div>`;
      return;
    }

    const blzVal = code === 'DE' ? blzInput.value : '';
    const bankRows = blzVal ? bankInfoHtml(blzVal) : '';

    resultDiv.innerHTML = `
      <div class="result-box success">
        <div class="result-title">✓ IBAN erfolgreich berechnet</div>
        <div class="iban-display">
          <span class="iban-value">${escHtml(result.formatted)}</span>
          <button class="copy-btn" onclick="copyText('${escHtml(result.iban)}', this)">⎘ Kopieren</button>
        </div>
        <table class="detail-table">
          <tr><th>IBAN (kompakt)</th><td>${escHtml(result.iban)}</td></tr>
          <tr><th>IBAN (formatiert)</th><td>${escHtml(result.formatted)}</td></tr>
          <tr><th>Prüfziffern</th><td>${escHtml(result.checkDigits)}</td></tr>
          <tr><th>BBAN</th><td>${escHtml(result.bban)}</td></tr>
          <tr><th>Land</th><td>${escHtml(result.country.name)} ${sepaBadge(result.country.sepa)}</td></tr>
          ${bankRows}
        </table>
      </div>`;
  });

  document.getElementById('calc-reset').addEventListener('click', () => {
    document.getElementById('calc-form').reset();
    resultDiv.innerHTML = '';
    updateFields();
  });
})();

// ─── 2. IBAN VALIDIEREN ───────────────────────────────────────────────────────
(function () {
  const input     = document.getElementById('val-iban');
  const resultDiv = document.getElementById('val-result');

  // Groß-/Kleinschreibung & Leerzeichen auto-formatieren
  input.addEventListener('input', () => {
    const cursor = input.selectionStart;
    const clean  = input.value.replace(/\s/g, '').toUpperCase();
    const formatted = clean.match(/.{1,4}/g)?.join(' ') ?? clean;
    input.value = formatted;
  });

  function run() {
    const raw = input.value.trim();
    if (!raw) { resultDiv.innerHTML = ''; return; }

    const res = validateIBAN(raw);

    if (!res.valid) {
      resultDiv.innerHTML = `
        <div class="result-box error">
          <div class="result-title">✗ Ungültige IBAN</div>
          ${escHtml(res.error)}
        </div>`;
      return;
    }

    const parsed = parseIBAN(raw);
    const bankRows = res.countryCode === 'DE' && parsed.components['Bankleitzahl (BLZ)']
      ? bankInfoHtml(parsed.components['Bankleitzahl (BLZ)']) : '';

    let compRows = '';
    if (parsed.valid && res.countryCode !== 'XX') {
      compRows = Object.entries(parsed.components)
        .map(([k, v]) => `<tr><th>${escHtml(k)}</th><td>${escHtml(v)}</td></tr>`)
        .join('');
    }

    resultDiv.innerHTML = `
      <div class="result-box success">
        <div class="result-title">✓ IBAN ist gültig</div>
        <div class="iban-display">
          <span class="iban-value">${escHtml(res.formatted)}</span>
          <button class="copy-btn" onclick="copyText('${escHtml(res.iban)}', this)">⎘ Kopieren</button>
        </div>
        <table class="detail-table">
          <tr><th>Ländercode</th><td>${escHtml(res.countryCode)} – ${escHtml(res.country.name)}</td></tr>
          <tr><th>Prüfziffern</th><td>${escHtml(res.checkDigits)}</td></tr>
          <tr><th>BBAN</th><td>${escHtml(res.bban)}</td></tr>
          <tr><th>IBAN-Länge</th><td>${res.country.length} Zeichen</td></tr>
          <tr><th>SEPA-Raum</th><td>${sepaBadge(res.country.sepa)}</td></tr>
          ${compRows}
          ${bankRows}
        </table>
      </div>`;
  }

  document.getElementById('val-form').addEventListener('submit', e => { e.preventDefault(); run(); });
  document.getElementById('val-reset').addEventListener('click', () => {
    input.value = ''; resultDiv.innerHTML = '';
  });
})();

// ─── 3. IBAN AUFSCHLÜSSELN ────────────────────────────────────────────────────
(function () {
  const input     = document.getElementById('parse-iban');
  const resultDiv = document.getElementById('parse-result');

  input.addEventListener('input', () => {
    const clean = input.value.replace(/\s/g, '').toUpperCase();
    input.value = clean.match(/.{1,4}/g)?.join(' ') ?? clean;
  });

  function run() {
    const raw = input.value.trim();
    if (!raw) { resultDiv.innerHTML = ''; return; }

    const res = parseIBAN(raw);

    if (!res.valid) {
      resultDiv.innerHTML = `
        <div class="result-box error">
          <div class="result-title">✗ Aufschlüsselung fehlgeschlagen</div>
          ${escHtml(res.error)}
        </div>`;
      return;
    }

    const bankRows = res.countryCode === 'DE' && res.components['Bankleitzahl (BLZ)']
      ? bankInfoHtml(res.components['Bankleitzahl (BLZ)']) : '';

    const compRows = Object.entries(res.components)
      .map(([k, v]) => `<tr><th>${escHtml(k)}</th><td>${escHtml(v)}</td></tr>`)
      .join('');

    const country = getCountryInfo(res.countryCode);
    const formatRow = country
      ? `<tr><th>IBAN-Format</th><td class="format-code">${escHtml(country.format)}</td></tr>` : '';

    resultDiv.innerHTML = `
      <div class="result-box info">
        <div class="result-title">⊞ IBAN-Aufschlüsselung</div>
        <div class="iban-display">
          <span class="iban-value">${escHtml(res.formatted)}</span>
        </div>
        <table class="detail-table">
          <tr><th>Land</th><td>${escHtml(res.countryName)} (${escHtml(res.countryCode)}) ${sepaBadge(res.sepa)}</td></tr>
          <tr><th>Prüfziffern</th><td>${escHtml(res.checkDigits)}</td></tr>
          ${compRows}
          ${bankRows}
          ${formatRow}
          <tr><th>IBAN-Länge</th><td>${res.ibanLength} Zeichen</td></tr>
        </table>
      </div>`;
  }

  document.getElementById('parse-form').addEventListener('submit', e => { e.preventDefault(); run(); });
  document.getElementById('parse-reset').addEventListener('click', () => {
    input.value = ''; resultDiv.innerHTML = '';
  });
})();

// ─── 4. BLZ / BIC SUCHE ──────────────────────────────────────────────────────
(function () {
  const input      = document.getElementById('blz-query');
  const resultDiv  = document.getElementById('blz-result');

  function run() {
    const q = input.value.trim();
    if (q.length < 2) { resultDiv.innerHTML = '<p class="text-muted text-sm">Mindestens 2 Zeichen eingeben.</p>'; return; }

    // Exakte BLZ?
    const exact = lookupBLZ(q);
    if (exact && /^\d{8}$/.test(q)) {
      resultDiv.innerHTML = renderBankCard(q, exact, true);
      return;
    }

    const results = searchBanks(q);
    if (!results.length) {
      resultDiv.innerHTML = `<div class="result-box warning">Keine Bank gefunden für „${escHtml(q)}".</div>`;
      return;
    }

    resultDiv.innerHTML = `
      <p class="text-sm text-muted mt-1">${results.length} Treffer</p>
      <div class="search-results">
        ${results.map(b => renderBankCard(b.blz, b, false)).join('')}
      </div>`;
  }

  function renderBankCard(blz, b, large) {
    if (large) {
      return `
        <div class="result-box info">
          <div class="result-title">🏦 ${escHtml(b.name)}</div>
          <table class="detail-table">
            <tr><th>BLZ</th><td class="mono">${escHtml(blz)}</td></tr>
            <tr><th>BIC / SWIFT</th><td class="mono">${escHtml(b.bic)}</td></tr>
            <tr><th>Stadt</th><td>${escHtml(b.city)}</td></tr>
            <tr><th>Status</th><td>${sepaBadge(b.sepa)} ${instantBadge(b.instant)}</td></tr>
          </table>
        </div>`;
    }
    return `
      <div class="bank-card">
        <div class="bank-card-name">${escHtml(b.name)}</div>
        <div class="bank-card-meta">
          <span>🏷 BLZ: <strong class="mono">${escHtml(blz)}</strong></span>
          <span>🔑 BIC: <strong class="mono">${escHtml(b.bic)}</strong></span>
          <span>📍 ${escHtml(b.city)}</span>
          <span>${sepaBadge(b.sepa)} ${instantBadge(b.instant)}</span>
        </div>
      </div>`;
  }

  document.getElementById('blz-form').addEventListener('submit', e => { e.preventDefault(); run(); });
  input.addEventListener('input', () => { if (input.value.length >= 2) run(); else resultDiv.innerHTML = ''; });
})();

// ─── 5. MASSENVERARBEITUNG ────────────────────────────────────────────────────
(function () {
  const textarea  = document.getElementById('bulk-input');
  const resultDiv = document.getElementById('bulk-result');
  const modeSelect = document.getElementById('bulk-mode');

  document.getElementById('bulk-form').addEventListener('submit', e => {
    e.preventDefault();
    const lines = textarea.value.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) return;

    const mode = modeSelect.value;
    const rows = [];
    let okCount = 0, errCount = 0;

    lines.forEach((line, i) => {
      if (mode === 'validate') {
        const res = validateIBAN(line);
        rows.push({ nr: i + 1, input: line, status: res.valid ? '✓' : '✗',
          info: res.valid ? res.formatted : res.error, ok: res.valid });
        res.valid ? okCount++ : errCount++;
      } else if (mode === 'parse') {
        const res = parseIBAN(line);
        const info = res.valid
          ? Object.values(res.components).join(' | ')
          : res.error;
        rows.push({ nr: i + 1, input: line, status: res.valid ? '✓' : '✗', info, ok: res.valid });
        res.valid ? okCount++ : errCount++;
      } else if (mode === 'de-convert') {
        // Erwartet: BLZ,Kontonummer
        const parts = line.split(/[,;\t]/);
        if (parts.length < 2) {
          rows.push({ nr: i + 1, input: line, status: '✗', info: 'Format: BLZ,Kontonummer', ok: false });
          errCount++;
          return;
        }
        const res = calculateGermanIBAN(parts[0].trim(), parts[1].trim());
        rows.push({ nr: i + 1, input: line, status: res.success ? '✓' : '✗',
          info: res.success ? res.formatted : res.error, ok: res.success });
        res.success ? okCount++ : errCount++;
      }
    });

    // CSV-Export vorbereiten
    const csvData = rows.map(r => `${r.nr},"${r.input}","${r.status}","${r.info}"`).join('\n');

    resultDiv.innerHTML = `
      <div class="stats-row">
        <div class="stat-chip"><span class="num">${rows.length}</span> Zeilen</div>
        <div class="stat-chip" style="color:var(--green)"><span class="num" style="color:var(--green)">${okCount}</span> OK</div>
        <div class="stat-chip" style="color:var(--red)"><span class="num" style="color:var(--red)">${errCount}</span> Fehler</div>
        <button class="btn btn-sm btn-secondary" onclick="downloadCSV(this)">⬇ CSV herunterladen</button>
      </div>
      <div class="bulk-results">
        <table>
          <thead><tr><th>#</th><th>Eingabe</th><th>Status</th><th>Ergebnis</th></tr></thead>
          <tbody>
            ${rows.map(r => `
              <tr class="${r.ok ? 'row-ok' : 'row-err'}">
                <td>${r.nr}</td>
                <td>${escHtml(r.input)}</td>
                <td>${r.status}</td>
                <td>${escHtml(r.info)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

    resultDiv.querySelector('button').dataset.csv = csvData;
  });

  window.downloadCSV = function (btn) {
    const csv = 'Nr,Eingabe,Status,Ergebnis\n' + btn.dataset.csv;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'iban-ergebnisse.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  document.getElementById('bulk-reset').addEventListener('click', () => {
    textarea.value = ''; resultDiv.innerHTML = '';
  });
})();

// ─── 6. GIROCODE-GENERATOR ───────────────────────────────────────────────────
(function () {
  const form      = document.getElementById('giro-form');
  const resultDiv = document.getElementById('giro-result');
  const canvas    = document.getElementById('qr-canvas');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const iban        = document.getElementById('giro-iban').value.replace(/\s/g, '').toUpperCase();
    const bic         = document.getElementById('giro-bic').value.toUpperCase().trim();
    const name        = document.getElementById('giro-name').value.trim();
    const betrag      = parseFloat(document.getElementById('giro-betrag').value || '0');
    const zweck       = document.getElementById('giro-zweck').value.trim();
    const referenz    = document.getElementById('giro-referenz').value.trim();

    // Validierung
    const valRes = validateIBAN(iban);
    if (!valRes.valid) {
      resultDiv.innerHTML = `<div class="result-box error">✗ Ungültige IBAN: ${escHtml(valRes.error)}</div>`;
      return;
    }
    if (!name) {
      resultDiv.innerHTML = `<div class="result-box error">✗ Name des Empfängers ist erforderlich.</div>`;
      return;
    }

    // EPC QR-Code Format (GiroCode / EPC069-12)
    const betragStr = betrag > 0 ? `EUR${betrag.toFixed(2)}` : 'EUR';
    const epcLines = [
      'BCD',           // Service Tag
      '002',           // Version
      '1',             // Encoding: UTF-8
      'SCT',           // Identification: SEPA Credit Transfer
      bic,             // BIC (optional ab v002, kann leer sein)
      name,            // Name des Begünstigten
      iban,            // IBAN
      betragStr,       // Betrag (EUR oder leer)
      '',              // Purpose (optional)
      referenz || '',  // Remittance reference (strukturiert, z. B. RF)
      zweck || '',     // Remittance info (unstrukturiert)
    ];

    const epcData = epcLines.join('\n');

    // QR-Code generieren
    if (typeof QRCode !== 'undefined') {
      canvas.innerHTML = '';
      new QRCode(canvas, {
        text: epcData,
        width: 220,
        height: 220,
        correctLevel: QRCode.CorrectLevel.M,
      });
    } else {
      canvas.innerHTML = '<p class="text-muted text-sm">QR-Code-Bibliothek nicht geladen.</p>';
    }

    resultDiv.classList.remove('hidden');
    document.getElementById('epc-preview').textContent = epcData;

    document.getElementById('giro-download').onclick = () => {
      const imgEl = canvas.querySelector('img') || canvas.querySelector('canvas');
      if (!imgEl) return;
      const src = imgEl.tagName === 'CANVAS' ? imgEl.toDataURL() : imgEl.src;
      const a = document.createElement('a'); a.href = src; a.download = 'girocode.png'; a.click();
    };
  });

  document.getElementById('giro-reset').addEventListener('click', () => {
    form.reset(); resultDiv.classList.add('hidden'); canvas.innerHTML = '';
  });

  // Auto-Format IBAN
  document.getElementById('giro-iban').addEventListener('input', function () {
    const clean = this.value.replace(/\s/g, '').toUpperCase();
    this.value = clean.match(/.{1,4}/g)?.join(' ') ?? clean;
  });
})();

// ─── 7. LÄNDER & FORMATE ─────────────────────────────────────────────────────
(function () {
  const tbody     = document.getElementById('country-tbody');
  const filterInput = document.getElementById('country-filter');
  const showSepa  = document.getElementById('filter-sepa');
  let sortCol = 'name', sortAsc = true;

  function render() {
    let data = getAllCountries();
    const q = filterInput.value.toLowerCase();
    if (q) data = data.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
    if (showSepa.checked) data = data.filter(c => c.sepa);

    data.sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ?  1 : -1;
      return 0;
    });

    tbody.innerHTML = data.map(c => `
      <tr>
        <td><strong>${escHtml(c.code)}</strong></td>
        <td>${escHtml(c.name)}</td>
        <td style="text-align:center">${c.length}</td>
        <td class="format-code">${escHtml(c.format)}</td>
        <td style="text-align:center">${sepaBadge(c.sepa)}</td>
      </tr>`).join('');

    document.getElementById('country-count').textContent = `${data.length} Länder`;
  }

  document.querySelectorAll('.country-table thead th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.sort;
      if (sortCol === col) { sortAsc = !sortAsc; }
      else { sortCol = col; sortAsc = true; }
      document.querySelectorAll('.country-table thead th .sort-icon').forEach(i => i.textContent = '');
      th.querySelector('.sort-icon').textContent = sortAsc ? ' ↑' : ' ↓';
      render();
    });
  });

  filterInput.addEventListener('input', render);
  showSepa.addEventListener('change', render);
  render();
})();
