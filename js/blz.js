/**
 * Deutsche BLZ-Datenbank (Auszug)
 * Quelle: Deutsche Bundesbank – Bankleitzahlen
 * Enthält die wichtigsten deutschen Kreditinstitute mit BIC, Stadt,
 * SEPA-Teilnahme und SEPA-Instant-Status.
 */

'use strict';

const BLZ_DATA = {
  // ── Bundesbank ──────────────────────────────────────────────────────────────
  '10000000': { name: 'Deutsche Bundesbank',                  bic: 'MARKDEFF',    city: 'Berlin',            sepa: true,  instant: false },

  // ── Deutsche Bank ───────────────────────────────────────────────────────────
  '10070000': { name: 'Deutsche Bank',                        bic: 'DEUTDEDB',    city: 'Berlin',            sepa: true,  instant: true  },
  '20070000': { name: 'Deutsche Bank',                        bic: 'DEUTDEDB',    city: 'Hamburg',           sepa: true,  instant: true  },
  '25070024': { name: 'Deutsche Bank',                        bic: 'DEUTDEDB',    city: 'Hannover',          sepa: true,  instant: true  },
  '28070024': { name: 'Deutsche Bank',                        bic: 'DEUTDEDB',    city: 'Bremen',            sepa: true,  instant: true  },
  '30070010': { name: 'Deutsche Bank',                        bic: 'DEUTDEDB',    city: 'Düsseldorf',        sepa: true,  instant: true  },
  '37070060': { name: 'Deutsche Bank',                        bic: 'DEUTDEDD',    city: 'Köln',              sepa: true,  instant: true  },
  '44070024': { name: 'Deutsche Bank',                        bic: 'DEUTDEDB',    city: 'Dortmund',          sepa: true,  instant: true  },
  '50070010': { name: 'Deutsche Bank',                        bic: 'DEUTDEDB',    city: 'Frankfurt am Main', sepa: true,  instant: true  },
  '54070040': { name: 'Deutsche Bank',                        bic: 'DEUTDEDB',    city: 'Mannheim',          sepa: true,  instant: true  },
  '57070045': { name: 'Deutsche Bank',                        bic: 'DEUTDEDB',    city: 'Karlsruhe',         sepa: true,  instant: true  },
  '60070070': { name: 'Deutsche Bank',                        bic: 'DEUTDEDB',    city: 'Stuttgart',         sepa: true,  instant: true  },
  '66070024': { name: 'Deutsche Bank',                        bic: 'DEUTDEDB',    city: 'Freiburg i. Br.',   sepa: true,  instant: true  },
  '70070010': { name: 'Deutsche Bank',                        bic: 'DEUTDEMM',    city: 'München',           sepa: true,  instant: true  },
  '76070012': { name: 'Deutsche Bank',                        bic: 'DEUTDEDB',    city: 'Nürnberg',          sepa: true,  instant: true  },
  '80070024': { name: 'Deutsche Bank',                        bic: 'DEUTDEDB',    city: 'Dresden',           sepa: true,  instant: true  },
  '86070000': { name: 'Deutsche Bank',                        bic: 'DEUTDEDB',    city: 'Leipzig',           sepa: true,  instant: true  },

  // ── Commerzbank ─────────────────────────────────────────────────────────────
  '20040000': { name: 'Commerzbank',                          bic: 'COBADEFFXXX', city: 'Hamburg',           sepa: true,  instant: true  },
  '25040066': { name: 'Commerzbank',                          bic: 'COBADEFFXXX', city: 'Hannover',          sepa: true,  instant: true  },
  '28040046': { name: 'Commerzbank',                          bic: 'COBADEFFXXX', city: 'Bremen',            sepa: true,  instant: true  },
  '30040000': { name: 'Commerzbank',                          bic: 'COBADEFFXXX', city: 'Düsseldorf',        sepa: true,  instant: true  },
  '37040044': { name: 'Commerzbank',                          bic: 'COBADEFFXXX', city: 'Köln',              sepa: true,  instant: true  },
  '44040037': { name: 'Commerzbank',                          bic: 'COBADEFFXXX', city: 'Dortmund',          sepa: true,  instant: true  },
  '50040000': { name: 'Commerzbank',                          bic: 'COBADEFFXXX', city: 'Frankfurt am Main', sepa: true,  instant: true  },
  '52040021': { name: 'Commerzbank',                          bic: 'COBADEFFXXX', city: 'Kassel',            sepa: true,  instant: true  },
  '54040042': { name: 'Commerzbank',                          bic: 'COBADEFFXXX', city: 'Mannheim',          sepa: true,  instant: true  },
  '57040044': { name: 'Commerzbank',                          bic: 'COBADEFFXXX', city: 'Karlsruhe',         sepa: true,  instant: true  },
  '60040060': { name: 'Commerzbank',                          bic: 'COBADEFFXXX', city: 'Stuttgart',         sepa: true,  instant: true  },
  '70040041': { name: 'Commerzbank',                          bic: 'COBADEFFXXX', city: 'München',           sepa: true,  instant: true  },
  '76040061': { name: 'Commerzbank',                          bic: 'COBADEFFXXX', city: 'Nürnberg',          sepa: true,  instant: true  },
  '80040000': { name: 'Commerzbank',                          bic: 'COBADEFFXXX', city: 'Dresden',           sepa: true,  instant: true  },
  '86040000': { name: 'Commerzbank',                          bic: 'COBADEFFXXX', city: 'Leipzig',           sepa: true,  instant: true  },

  // ── Postbank ────────────────────────────────────────────────────────────────
  '10010010': { name: 'Postbank',                             bic: 'PBNKDEFFXXX', city: 'Berlin',            sepa: true,  instant: false },
  '20010020': { name: 'Postbank',                             bic: 'PBNKDEFFXXX', city: 'Hamburg',           sepa: true,  instant: false },
  '25010030': { name: 'Postbank',                             bic: 'PBNKDEFFXXX', city: 'Hannover',          sepa: true,  instant: false },
  '44010046': { name: 'Postbank',                             bic: 'PBNKDEFFXXX', city: 'Dortmund',          sepa: true,  instant: false },
  '50010060': { name: 'Postbank',                             bic: 'PBNKDEFFXXX', city: 'Frankfurt am Main', sepa: true,  instant: false },
  '70010080': { name: 'Postbank',                             bic: 'PBNKDEFFXXX', city: 'München',           sepa: true,  instant: false },
  '86010090': { name: 'Postbank',                             bic: 'PBNKDEFFXXX', city: 'Leipzig',           sepa: true,  instant: false },

  // ── HypoVereinsbank / UniCredit ─────────────────────────────────────────────
  '10020890': { name: 'UniCredit Bank (HypoVereinsbank)',     bic: 'HYVEDEMM',    city: 'Berlin',            sepa: true,  instant: true  },
  '20030000': { name: 'UniCredit Bank (HypoVereinsbank)',     bic: 'HYVEDEMM',    city: 'Hamburg',           sepa: true,  instant: true  },
  '30020900': { name: 'UniCredit Bank (HypoVereinsbank)',     bic: 'HYVEDEMM',    city: 'Düsseldorf',        sepa: true,  instant: true  },
  '37020090': { name: 'UniCredit Bank (HypoVereinsbank)',     bic: 'HYVEDEMM',    city: 'Köln',              sepa: true,  instant: true  },
  '50020000': { name: 'UniCredit Bank (HypoVereinsbank)',     bic: 'HYVEDEMM',    city: 'Frankfurt am Main', sepa: true,  instant: true  },
  '70020270': { name: 'UniCredit Bank (HypoVereinsbank)',     bic: 'HYVEDEMMXXX', city: 'München',           sepa: true,  instant: true  },
  '76020214': { name: 'UniCredit Bank (HypoVereinsbank)',     bic: 'HYVEDEMM',    city: 'Nürnberg',          sepa: true,  instant: true  },

  // ── Sparkassen ──────────────────────────────────────────────────────────────
  '10050000': { name: 'Berliner Sparkasse',                   bic: 'BELADEBEXXX', city: 'Berlin',            sepa: true,  instant: true  },
  '20050550': { name: 'Hamburger Sparkasse (Haspa)',          bic: 'HASPDEHHXXX', city: 'Hamburg',           sepa: true,  instant: true  },
  '25050180': { name: 'Sparkasse Hannover',                   bic: 'SPKHDE2HXXX', city: 'Hannover',          sepa: true,  instant: true  },
  '29050101': { name: 'Sparkasse Bremen',                     bic: 'SBREDE22XXX', city: 'Bremen',            sepa: true,  instant: true  },
  '37050198': { name: 'Sparkasse KölnBonn',                   bic: 'COLSDE33XXX', city: 'Köln',              sepa: true,  instant: true  },
  '38050000': { name: 'Stadtsparkasse Düsseldorf',            bic: 'DUSSDEDDXXX', city: 'Düsseldorf',        sepa: true,  instant: true  },
  '44050199': { name: 'Sparkasse Dortmund',                   bic: 'DORTDE33XXX', city: 'Dortmund',          sepa: true,  instant: true  },
  '50050201': { name: 'Frankfurter Sparkasse',                bic: 'HELADEF1822', city: 'Frankfurt am Main', sepa: true,  instant: true  },
  '55050000': { name: 'Kreissparkasse Kaiserslautern',        bic: 'MALADE51KAI', city: 'Kaiserslautern',    sepa: true,  instant: true  },
  '60050101': { name: 'Baden-Württembergische Bank (BW-Bank)',bic: 'SOLADEST600', city: 'Stuttgart',         sepa: true,  instant: true  },
  '67050505': { name: 'Sparkasse Freiburg – Nördlicher BW',  bic: 'FRSPDE66XXX', city: 'Freiburg i. Br.',   sepa: true,  instant: true  },
  '70050000': { name: 'Stadtsparkasse München',               bic: 'SSKMDEMMXXX', city: 'München',           sepa: true,  instant: true  },
  '76050101': { name: 'Sparkasse Nürnberg',                   bic: 'SSKNDE77XXX', city: 'Nürnberg',          sepa: true,  instant: true  },
  '85050300': { name: 'Ostsächsische Sparkasse Dresden',      bic: 'OSDDDE81XXX', city: 'Dresden',           sepa: true,  instant: true  },
  '86055592': { name: 'Sparkasse Leipzig',                    bic: 'WELADE8LXXX', city: 'Leipzig',           sepa: true,  instant: true  },

  // ── Volksbanken / Raiffeisenbanken ──────────────────────────────────────────
  '10090000': { name: 'Berliner Volksbank',                   bic: 'BEVODEBB',    city: 'Berlin',            sepa: true,  instant: true  },
  '20069217': { name: 'Hamburger Volksbank',                  bic: 'GENODEF1HH2', city: 'Hamburg',           sepa: true,  instant: true  },
  '25090300': { name: 'Volksbank Hannover',                   bic: 'VOHADE2HXXX', city: 'Hannover',          sepa: true,  instant: true  },
  '37060590': { name: 'Volksbank Köln Bonn',                  bic: 'GENODED1VBK', city: 'Köln',              sepa: true,  instant: true  },
  '47620090': { name: 'Volksbank Dortmund-Nordwest',          bic: 'GENODEM1DNW', city: 'Dortmund',          sepa: true,  instant: true  },
  '50090900': { name: 'Frankfurter Volksbank',                bic: 'FFVBDEFFXXX', city: 'Frankfurt am Main', sepa: true,  instant: true  },
  '60090100': { name: 'Volksbank Stuttgart',                  bic: 'VBSTDE61XXX', city: 'Stuttgart',         sepa: true,  instant: true  },
  '70090100': { name: 'Münchener Bank',                       bic: 'GENODEM1M01', city: 'München',           sepa: true,  instant: true  },
  '76090500': { name: 'VR Bank Nürnberg',                     bic: 'GENODEF1N02', city: 'Nürnberg',          sepa: true,  instant: true  },
  '85090000': { name: 'Volksbank Dresden-Bautzen',            bic: 'GENODEF1DRS', city: 'Dresden',           sepa: true,  instant: true  },

  // ── DKB ─────────────────────────────────────────────────────────────────────
  '12030000': { name: 'Deutsche Kreditbank (DKB)',            bic: 'SSKMDEMMXXX', city: 'Berlin',            sepa: true,  instant: true  },

  // ── ING ─────────────────────────────────────────────────────────────────────
  '50010517': { name: 'ING-DiBa',                             bic: 'INGBDEFFXXX', city: 'Frankfurt am Main', sepa: true,  instant: true  },

  // ── N26 ─────────────────────────────────────────────────────────────────────
  '10011001': { name: 'N26 Bank',                             bic: 'NTSBDEB1XXX', city: 'Berlin',            sepa: true,  instant: false },

  // ── Comdirect ───────────────────────────────────────────────────────────────
  '20041133': { name: 'Comdirect Bank',                       bic: 'COBADEHDXXX', city: 'Quickborn',         sepa: true,  instant: true  },

  // ── Santander ───────────────────────────────────────────────────────────────
  '33010000': { name: 'Santander Consumer Bank',              bic: 'SCFBDE33XXX', city: 'Mönchengladbach',   sepa: true,  instant: false },

  // ── TARGOBANK ───────────────────────────────────────────────────────────────
  '30020500': { name: 'TARGOBANK',                            bic: 'CMCIDEDDXXX', city: 'Düsseldorf',        sepa: true,  instant: false },

  // ── DZ BANK ─────────────────────────────────────────────────────────────────
  '50060400': { name: 'DZ BANK',                              bic: 'GENODEFFXXX', city: 'Frankfurt am Main', sepa: true,  instant: false },

  // ── KfW ─────────────────────────────────────────────────────────────────────
  '50020400': { name: 'KfW Bankengruppe',                     bic: 'KFWIDEFFXXX', city: 'Frankfurt am Main', sepa: true,  instant: false },

  // ── Landesbanken ────────────────────────────────────────────────────────────
  '55050000': { name: 'Landesbank Baden-Württemberg (LBBW)',  bic: 'SOLADESTXXX', city: 'Stuttgart',         sepa: true,  instant: false },
  '70050000': { name: 'Bayerische Landesbank (BayernLB)',     bic: 'BYLADEMMXXX', city: 'München',           sepa: true,  instant: false },
  '20050000': { name: 'Hamburg Commercial Bank',              bic: 'HSHNDEHHXXX', city: 'Hamburg',           sepa: true,  instant: false },
  '30030000': { name: 'Landesbank NRW (NRW.BANK)',            bic: 'NRWBDEDMXXX', city: 'Düsseldorf',        sepa: true,  instant: false },
  '50050000': { name: 'Landesbank Hessen-Thüringen (Helaba)', bic: 'HELADEFFXXX', city: 'Frankfurt am Main', sepa: true,  instant: false },

  // ── Oldenburgische Landesbank ───────────────────────────────────────────────
  '28020050': { name: 'Oldenburgische Landesbank (OLB)',      bic: 'OLBODEH2XXX', city: 'Oldenburg',         sepa: true,  instant: true  },

  // ── Consorsbank ────────────────────────────────────────────────────────────
  '76030080': { name: 'Consorsbank (BNP Paribas)',            bic: 'CSDBDE71XXX', city: 'Nürnberg',          sepa: true,  instant: false },

  // ── Münchener Hypothekenbank ─────────────────────────────────────────────────
  '70069601': { name: 'Münchener Hypothekenbank',             bic: 'MHYPDEMMXXX', city: 'München',           sepa: true,  instant: false },

  // ── Aareal Bank ─────────────────────────────────────────────────────────────
  '51070021': { name: 'Aareal Bank',                          bic: 'AARBDE5WXXX', city: 'Wiesbaden',         sepa: true,  instant: false },

  // ── Sparkasse Pforzheim Calw ────────────────────────────────────────────────
  '66650085': { name: 'Sparkasse Pforzheim Calw',             bic: 'PZHSDE66XXX', city: 'Pforzheim',         sepa: true,  instant: true  },
};

// ─── Öffentliche API ──────────────────────────────────────────────────────────

/** BLZ nachschlagen */
function lookupBLZ(blz) {
  return BLZ_DATA[blz.replace(/\s/g, '')] ?? null;
}

/** Banken nach Name, BLZ, BIC oder Stadt suchen */
function searchBanks(query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();
  return Object.entries(BLZ_DATA)
    .filter(([blz, b]) =>
      blz.includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.bic.toLowerCase().includes(q)
    )
    .map(([blz, b]) => ({ blz, ...b }))
    .sort((a, b) => a.name.localeCompare(b.name, 'de'))
    .slice(0, 50);
}
