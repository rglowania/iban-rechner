/**
 * IBAN Library
 * Berechnung, Validierung und Aufschlüsselung von IBANs
 * Basiert auf ISO 13616 Standard
 */

'use strict';

// Länderspezifikationen: Länge, Format, SEPA-Zugehörigkeit
const IBAN_COUNTRIES = {
  AD: { name: 'Andorra',                      length: 24, format: 'ADkk BBBB SSSS CCCC CCCC CCCC', sepa: false },
  AE: { name: 'Verein. Arab. Emirate',        length: 23, format: 'AEkk BBBC CCCC CCCC CCCC CCC',  sepa: false },
  AL: { name: 'Albanien',                     length: 28, format: 'ALkk BBBS SSSK CCCC CCCC CCCC CCCC', sepa: false },
  AT: { name: 'Österreich',                   length: 20, format: 'ATkk BBBB BCCC CCCC CCCC', sepa: true,  bankLen: 5,  accountLen: 11 },
  AZ: { name: 'Aserbaidschan',                length: 28, format: 'AZkk BBBB CCCC CCCC CCCC CCCC CCCC', sepa: false },
  BA: { name: 'Bosnien-Herzegowina',          length: 20, format: 'BAkk BBBS SSCC CCCC CCXX', sepa: false },
  BE: { name: 'Belgien',                      length: 16, format: 'BEkk BBBC CCCC CCXX', sepa: true,  bankLen: 3,  accountLen: 7,  checkLen: 2 },
  BG: { name: 'Bulgarien',                    length: 22, format: 'BGkk BBBB SSSS TTCC CCCC CC', sepa: true  },
  BH: { name: 'Bahrain',                      length: 22, format: 'BHkk BBBB CCCC CCCC CCCC CC', sepa: false },
  BR: { name: 'Brasilien',                    length: 29, format: 'BRkk BBBB BBBB SSSS SCCC CCCC CCCT N', sepa: false },
  BY: { name: 'Belarus',                      length: 28, format: 'BYkk BBBB AAAA CCCC CCCC CCCC CCCC', sepa: false },
  CH: { name: 'Schweiz',                      length: 21, format: 'CHkk BBBB BCCC CCCC CCCC C', sepa: true,  bankLen: 5,  accountLen: 12 },
  CR: { name: 'Costa Rica',                   length: 22, format: 'CRkk 0BBB BCCC CCCC CCCC CC', sepa: false },
  CY: { name: 'Zypern',                       length: 28, format: 'CYkk BBBS SSSS CCCC CCCC CCCC CCCC', sepa: true  },
  CZ: { name: 'Tschechien',                   length: 24, format: 'CZkk BBBB SSSS SSCC CCCC CCCC', sepa: true  },
  DE: { name: 'Deutschland',                  length: 22, format: 'DEkk BBBB BBBB CCCC CCCC CC', sepa: true,  bankLen: 8,  accountLen: 10 },
  DK: { name: 'Dänemark',                     length: 18, format: 'DKkk BBBB CCCC CCCC CC', sepa: true  },
  DO: { name: 'Dominikanische Republik',      length: 28, format: 'DOkk BBBB CCCC CCCC CCCC CCCC CCCC', sepa: false },
  EE: { name: 'Estland',                      length: 20, format: 'EEkk BBSS CCCC CCCC CCCX', sepa: true  },
  EG: { name: 'Ägypten',                      length: 29, format: 'EGkk BBBB SSSS CCCC CCCC CCCC CCCC C', sepa: false },
  ES: { name: 'Spanien',                      length: 24, format: 'ESkk BBBB GGGG XXCC CCCC CCCC', sepa: true  },
  FI: { name: 'Finnland',                     length: 18, format: 'FIkk BBBB BBCC CCCC CX', sepa: true  },
  FO: { name: 'Färöer-Inseln',               length: 18, format: 'FOkk BBBB CCCC CCCC CC', sepa: false },
  FR: { name: 'Frankreich',                   length: 27, format: 'FRkk BBBB BGGG GGCC CCCC CCCC CXX', sepa: true,  bankLen: 5,  branchLen: 5, accountLen: 11, checkLen: 2 },
  GB: { name: 'Vereinigtes Königreich',       length: 22, format: 'GBkk BBBB SSSS SSCC CCCC CC', sepa: true  },
  GE: { name: 'Georgien',                     length: 22, format: 'GEkk BBCC CCCC CCCC CCCC CC', sepa: false },
  GI: { name: 'Gibraltar',                    length: 23, format: 'GIkk BBBB CCCC CCCC CCCC CCC', sepa: true  },
  GL: { name: 'Grönland',                     length: 18, format: 'GLkk BBBB CCCC CCCC CC', sepa: false },
  GR: { name: 'Griechenland',                 length: 27, format: 'GRkk BBBS SSSS CCCC CCCC CCCC CCC', sepa: true  },
  GT: { name: 'Guatemala',                    length: 28, format: 'GTkk BBBB MMTT CCCC CCCC CCCC CCCC', sepa: false },
  HR: { name: 'Kroatien',                     length: 21, format: 'HRkk BBBB BBBC CCCC CCCC C', sepa: true  },
  HU: { name: 'Ungarn',                       length: 28, format: 'HUkk BBBS SSSX CCCC CCCC CCCC CCCC', sepa: true  },
  IE: { name: 'Irland',                       length: 22, format: 'IEkk BBBB SSSS SSCC CCCC CC', sepa: true  },
  IL: { name: 'Israel',                       length: 23, format: 'ILkk BBBS SSCC CCCC CCCC CCC', sepa: false },
  IQ: { name: 'Irak',                         length: 23, format: 'IQkk BBBB SSSC CCCC CCCC CCC', sepa: false },
  IS: { name: 'Island',                       length: 26, format: 'ISkk BBBB SSCC CCCC CCXX XXXX XX', sepa: true  },
  IT: { name: 'Italien',                      length: 27, format: 'ITkk XCCC CCSS SSSC CCCC CCCC CCC', sepa: true  },
  JO: { name: 'Jordanien',                    length: 30, format: 'JOkk BBBB SSSS CCCC CCCC CCCC CCCC CC', sepa: false },
  KW: { name: 'Kuwait',                       length: 30, format: 'KWkk BBBB CCCC CCCC CCCC CCCC CCCC CC', sepa: false },
  KZ: { name: 'Kasachstan',                   length: 20, format: 'KZkk BBBC CCCC CCCC CCCC', sepa: false },
  LB: { name: 'Libanon',                      length: 28, format: 'LBkk BBBB CCCC CCCC CCCC CCCC CCCC', sepa: false },
  LC: { name: 'St. Lucia',                    length: 32, format: 'LCkk BBBB CCCC CCCC CCCC CCCC CCCC CCCC', sepa: false },
  LI: { name: 'Liechtenstein',                length: 21, format: 'LIkk BBBB BCCC CCCC CCCC C', sepa: true  },
  LT: { name: 'Litauen',                      length: 20, format: 'LTkk BBBB BCCC CCCC CCCC', sepa: true  },
  LU: { name: 'Luxemburg',                    length: 20, format: 'LUkk BBBC CCCC CCCC CCCC', sepa: true  },
  LV: { name: 'Lettland',                     length: 21, format: 'LVkk BBBB CCCC CCCC CCCC C', sepa: true  },
  LY: { name: 'Libyen',                       length: 25, format: 'LYkk BBBS SSCC CCCC CCCC CCCCC', sepa: false },
  MC: { name: 'Monaco',                       length: 27, format: 'MCkk BBBB BGGG GGCC CCCC CCCC CXX', sepa: true,  bankLen: 5,  branchLen: 5, accountLen: 11, checkLen: 2 },
  MD: { name: 'Moldawien',                    length: 24, format: 'MDkk BBCC CCCC CCCC CCCC CCCC', sepa: false },
  ME: { name: 'Montenegro',                   length: 22, format: 'MEkk BBBC CCCC CCCC CCXX', sepa: false },
  MK: { name: 'Nordmazedonien',               length: 19, format: 'MKkk BBBС CCCC CCCC XXX', sepa: false },
  MR: { name: 'Mauretanien',                  length: 27, format: 'MRkk BBBBB GGGGG CCCCCCCCCCC XX', sepa: false },
  MT: { name: 'Malta',                        length: 31, format: 'MTkk BBBB SSSS SCCC CCCC CCCC CCCC CCC', sepa: true  },
  MU: { name: 'Mauritius',                    length: 30, format: 'MUkk BBBB BBSS CCCC CCCC CCCC 000T TT', sepa: false },
  NL: { name: 'Niederlande',                  length: 18, format: 'NLkk BBBB CCCC CCCC CC', sepa: true,  bankLen: 4,  accountLen: 10 },
  NO: { name: 'Norwegen',                     length: 15, format: 'NOkk BBBB CCCC CCX', sepa: true  },
  PK: { name: 'Pakistan',                     length: 24, format: 'PKkk BBBB CCCC CCCC CCCC CCCC', sepa: false },
  PL: { name: 'Polen',                        length: 28, format: 'PLkk BBBS SSSX CCCC CCCC CCCC CCCC', sepa: true  },
  PS: { name: 'Palästina',                    length: 29, format: 'PSkk BBBB XXXX XXXX XCCC CCCC CCCC C', sepa: false },
  PT: { name: 'Portugal',                     length: 25, format: 'PTkk BBBB SSSS CCCC CCCC CCCK K', sepa: true  },
  QA: { name: 'Katar',                        length: 29, format: 'QAkk BBBB CCCC CCCC CCCC CCCC CCCC C', sepa: false },
  RO: { name: 'Rumänien',                     length: 24, format: 'ROkk BBBB CCCC CCCC CCCC CCCC', sepa: true  },
  RS: { name: 'Serbien',                      length: 22, format: 'RSkk BBBC CCCC CCCC CCXX', sepa: false },
  SA: { name: 'Saudi-Arabien',                length: 24, format: 'SAkk BBCC CCCC CCCC CCCC CCCC', sepa: false },
  SC: { name: 'Seychellen',                   length: 31, format: 'SCkk BBBB BBSS CCCC CCCC CCCC CCCC MMM', sepa: false },
  SE: { name: 'Schweden',                     length: 24, format: 'SEkk BBBC CCCC CCCC CCCC CCCC', sepa: true  },
  SI: { name: 'Slowenien',                    length: 19, format: 'SIkk BBSS SCCC CCCC CXX', sepa: true  },
  SK: { name: 'Slowakei',                     length: 24, format: 'SKkk BBBB SSSS SSCC CCCC CCCC', sepa: true  },
  SM: { name: 'San Marino',                   length: 27, format: 'SMkk XCCC CCSS SSSC CCCC CCCC CCC', sepa: true  },
  ST: { name: 'São Tomé und Príncipe',        length: 25, format: 'STkk BBBB SSSS CCCC CCCC CCCC CCC', sepa: false },
  SV: { name: 'El Salvador',                  length: 28, format: 'SVkk BBBB CCCC CCCC CCCC CCCC CCCC', sepa: false },
  TL: { name: 'Timor-Leste',                  length: 23, format: 'TLkk BBBC CCCC CCCC CCCC CXX', sepa: false },
  TN: { name: 'Tunesien',                     length: 24, format: 'TNkk BBSS SCCC CCCC CCCC CCCC', sepa: false },
  TR: { name: 'Türkei',                       length: 26, format: 'TRkk BBBB BRCC CCCC CCCC CCCC CC', sepa: false },
  UA: { name: 'Ukraine',                      length: 29, format: 'UAkk BBBB BBCC CCCC CCCC CCCC CCCC C', sepa: false },
  VA: { name: 'Vatikanstadt',                 length: 22, format: 'VAkk BBBC CCCC CCCC CCCC CC', sepa: true  },
  VG: { name: 'Brit. Jungferninseln',         length: 24, format: 'VGkk BBBB CCCC CCCC CCCC CCCC', sepa: false },
  XK: { name: 'Kosovo',                       length: 20, format: 'XKkk BBSS CCCC CCCC CCCC', sepa: false },
};

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

/** Modulo 97 für große Zahlen (als String) */
function mod97(numStr) {
  let remainder = 0;
  for (let i = 0; i < numStr.length; i++) {
    remainder = (remainder * 10 + parseInt(numStr[i])) % 97;
  }
  return remainder;
}

/** Buchstaben in Zahlen umwandeln: A=10, B=11, ..., Z=35 */
function toNumericString(str) {
  return str.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return (code - 55).toString();
    return c;
  }).join('');
}

/** IBAN-Prüfziffern berechnen */
function calcCheckDigits(countryCode, bban) {
  const rearranged = bban + countryCode + '00';
  const numeric = toNumericString(rearranged);
  const remainder = mod97(numeric);
  return (98 - remainder).toString().padStart(2, '0');
}

// ─── Öffentliche API ──────────────────────────────────────────────────────────

/**
 * IBAN validieren
 * @returns {object} { valid, error?, iban, countryCode, checkDigits, bban, country, formatted }
 */
function validateIBAN(rawIban) {
  const iban = rawIban.replace(/[\s\-]/g, '').toUpperCase();

  if (iban.length < 5) {
    return { valid: false, error: 'IBAN zu kurz.' };
  }

  const countryCode = iban.slice(0, 2);
  const checkDigits = iban.slice(2, 4);
  const bban = iban.slice(4);

  if (!/^[A-Z]{2}$/.test(countryCode)) {
    return { valid: false, error: 'Ungültiger Ländercode (erste 2 Zeichen müssen Buchstaben sein).' };
  }

  if (!/^\d{2}$/.test(checkDigits)) {
    return { valid: false, error: 'Prüfziffern (Position 3–4) müssen Ziffern sein.' };
  }

  const country = IBAN_COUNTRIES[countryCode];
  if (!country) {
    return { valid: false, error: `Unbekannter Ländercode: ${countryCode}` };
  }

  if (iban.length !== country.length) {
    return {
      valid: false,
      error: `Falsche Länge: ${iban.length} Zeichen (erwartet für ${country.name}: ${country.length})`,
    };
  }

  if (!/^[A-Z0-9]+$/.test(iban)) {
    return { valid: false, error: 'Ungültige Zeichen in der IBAN (nur A–Z und 0–9 erlaubt).' };
  }

  // Modulo-97-Prüfung
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = toNumericString(rearranged);
  if (mod97(numeric) !== 1) {
    return { valid: false, error: 'Prüfziffer ungültig (Modulo-97-Prüfung fehlgeschlagen).' };
  }

  return {
    valid: true,
    iban,
    formatted: formatIBAN(iban),
    countryCode,
    checkDigits,
    bban,
    country,
  };
}

/**
 * IBAN aus Ländercode + BBAN berechnen
 */
function calculateIBAN(countryCode, bban) {
  countryCode = countryCode.toUpperCase().trim();
  bban = bban.toUpperCase().trim();

  const country = IBAN_COUNTRIES[countryCode];
  if (!country) {
    return { success: false, error: `Unbekannter Ländercode: ${countryCode}` };
  }

  const expectedBbanLen = country.length - 4;
  if (bban.length !== expectedBbanLen) {
    return {
      success: false,
      error: `Falsche BBAN-Länge: ${bban.length} Zeichen (erwartet: ${expectedBbanLen} für ${country.name})`,
    };
  }

  if (!/^[A-Z0-9]+$/.test(bban)) {
    return { success: false, error: 'BBAN enthält ungültige Zeichen.' };
  }

  const checkDigits = calcCheckDigits(countryCode, bban);
  const iban = countryCode + checkDigits + bban;

  return {
    success: true,
    iban,
    formatted: formatIBAN(iban),
    checkDigits,
    bban,
    country,
  };
}

/**
 * Deutsche IBAN aus BLZ + Kontonummer berechnen
 */
function calculateGermanIBAN(blz, kontonummer) {
  blz = blz.replace(/\s/g, '');
  kontonummer = kontonummer.replace(/\s/g, '');

  if (!/^\d{8}$/.test(blz)) {
    return { success: false, error: 'Die BLZ muss genau 8 Ziffern haben.' };
  }
  if (!/^\d+$/.test(kontonummer)) {
    return { success: false, error: 'Die Kontonummer darf nur Ziffern enthalten.' };
  }
  if (kontonummer.length > 10) {
    return { success: false, error: 'Die Kontonummer darf maximal 10 Ziffern haben.' };
  }

  const paddedKonto = kontonummer.padStart(10, '0');
  const bban = blz + paddedKonto;
  return calculateIBAN('DE', bban);
}

/**
 * IBAN in Bestandteile aufschlüsseln
 */
function parseIBAN(rawIban) {
  const validation = validateIBAN(rawIban);
  if (!validation.valid) return validation;

  const { iban, countryCode, checkDigits, bban, country } = validation;
  let components = {};

  switch (countryCode) {
    case 'DE':
      components = {
        'Bankleitzahl (BLZ)': bban.slice(0, 8),
        'Kontonummer':        bban.slice(8).replace(/^0+/, '') || '0',
        'Kontonummer (aufgefüllt)': bban.slice(8),
      };
      break;
    case 'AT':
      components = {
        'Bankleitzahl': bban.slice(0, 5),
        'Kontonummer':  bban.slice(5),
      };
      break;
    case 'CH':
      components = {
        'Bankleitzahl':              bban.slice(0, 5),
        'Kontonummer (Clearing-Nr)': bban.slice(5),
      };
      break;
    case 'NL':
      components = {
        'Bankcode':    bban.slice(0, 4),
        'Kontonummer': bban.slice(4),
      };
      break;
    case 'BE':
      components = {
        'Bankcode':    bban.slice(0, 3),
        'Kontonummer': bban.slice(3, 10),
        'Prüfziffern': bban.slice(10),
      };
      break;
    case 'FR':
    case 'MC':
      components = {
        'Bankleitzahl (Code banque)':   bban.slice(0, 5),
        'Filialcode (Code guichet)':    bban.slice(5, 10),
        'Kontonummer (Numéro de compte)': bban.slice(10, 21),
        'Prüfziffern (Clé RIB)':       bban.slice(21),
      };
      break;
    case 'ES':
      components = {
        'Bankcode':    bban.slice(0, 4),
        'Filialcode':  bban.slice(4, 8),
        'Prüfziffer':  bban.slice(8, 10),
        'Kontonummer': bban.slice(10),
      };
      break;
    case 'IT':
      components = {
        'CIN-Zeichen': bban.slice(0, 1),
        'ABI (Bank)':  bban.slice(1, 6),
        'CAB (Filiale)': bban.slice(6, 11),
        'Kontonummer': bban.slice(11),
      };
      break;
    case 'PL':
      components = {
        'Bankleitzahl (Routing)': bban.slice(0, 8),
        'Kontonummer':            bban.slice(8),
      };
      break;
    default:
      components = { 'BBAN': bban };
  }

  return {
    valid: true,
    iban,
    formatted: formatIBAN(iban),
    countryCode,
    countryName: country.name,
    checkDigits,
    bban,
    components,
    sepa: country.sepa,
    ibanLength: country.length,
  };
}

/** IBAN mit Leerzeichen formatieren (Gruppen à 4) */
function formatIBAN(iban) {
  const clean = iban.replace(/\s/g, '').toUpperCase();
  return clean.match(/.{1,4}/g)?.join(' ') ?? clean;
}

/** Alle unterstützten Länder sortiert nach Name */
function getAllCountries() {
  return Object.entries(IBAN_COUNTRIES)
    .map(([code, info]) => ({ code, ...info }))
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));
}

/** Länderinformationen abrufen */
function getCountryInfo(countryCode) {
  return IBAN_COUNTRIES[countryCode.toUpperCase()] ?? null;
}
