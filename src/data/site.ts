/**
 * Group-wide facts used across the site (footer, contact, privacy policy, front page).
 * Everything marked "Pladsholder" must be replaced with approved content before launch:
 *   grep -rn Pladsholder src
 */

export const site = {
  name: 'BA Group',
  description:
    'BA Group er en dansk koncern inden for anlæg og brolægning. Pladsholder: kort beskrivelse af koncernen.',
  address: {
    street: 'Pladsholder: Vejnavn 1',
    postalCode: '0000',
    city: 'Pladsholder: By',
  },
  cvr: '00000000', // Pladsholder
  phone: {
    display: '+45 00 00 00 00', // Pladsholder
    href: '+4500000000',
  },
  // The forward for info@baaps.dk must exist before launch (see CLAUDE.md → Mail).
  email: 'info@baaps.dk',
} as const;

export const nav = [
  { href: '/virksomheder/', label: 'Virksomheder' },
  { href: '/projekter/', label: 'Projekter' },
  { href: '/om-os/', label: 'Om os' },
  { href: '/kontakt/', label: 'Kontakt' },
] as const;

/**
 * Front page key figures. `computed: 'companyCount'` is filled in from the
 * companies collection, so it can never drift from the actual list.
 */
export const keyFigures = [
  { value: '00', label: 'Pladsholder: år i branchen' },
  { value: '000', label: 'Pladsholder: medarbejdere' },
  { value: '', label: 'Virksomheder i koncernen', computed: 'companyCount' },
  { value: '000', label: 'Pladsholder: projekter om året' },
] as const;

/** Project types used for filtering. Keep the list short and stable. */
export const projectTypes = [
  'Byrum og pladser',
  'Veje og stier',
  'Boligområder',
  'Erhverv',
] as const;
export type ProjectType = (typeof projectTypes)[number];

/** History timeline (Om os). */
export const timeline = [
  { year: '0000', title: 'Pladsholder: Grundlæggelse', text: 'Pladsholder: Hvordan det hele begyndte.' },
  { year: '0000', title: 'Pladsholder: Første opkøb', text: 'Pladsholder: Koncernen tager form.' },
  { year: '0000', title: 'Pladsholder: Ny virksomhed', text: 'Pladsholder: Endnu et selskab kommer til.' },
  { year: '0000', title: 'Pladsholder: I dag', text: 'Pladsholder: Hvor koncernen står nu.' },
] as const;

/** Management (Om os). Add photos only with documented rights. */
export const management = [
  { name: 'Pladsholder: Navn', role: 'Adm. direktør', email: '' },
  { name: 'Pladsholder: Navn', role: 'Økonomidirektør', email: '' },
  { name: 'Pladsholder: Navn', role: 'Pladsholder: Titel', email: '' },
] as const;

/** Values (Om os). */
export const values = [
  { title: 'Pladsholder: Værdi 1', text: 'Pladsholder: Hvad værdien betyder i praksis.' },
  { title: 'Pladsholder: Værdi 2', text: 'Pladsholder: Hvad værdien betyder i praksis.' },
  { title: 'Pladsholder: Værdi 3', text: 'Pladsholder: Hvad værdien betyder i praksis.' },
] as const;
