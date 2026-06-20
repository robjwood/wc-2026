import { esc } from './esc.js';

export function teamBlock(name, crest, familyMember, reversed = false) {
  if (name === 'TBC') return '';
  return `
    <p>${esc(name)}</p>
    <family-member name="${esc(familyMember)}"${reversed ? ' reversed' : ''}></family-member>`;
}
