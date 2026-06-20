import { esc } from '../utils/esc.js';

class FamilyMember extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || '';
    const reversed = this.hasAttribute('reversed');
    const avatar = `<img src="/images/family/${esc(name.toLowerCase())}.svg" width="20" height="20" class="family-icon" alt="${esc(name)}">`;
    const label  = `<p class="family-member">${esc(name)}</p>`;
    this.innerHTML = reversed ? label + avatar : avatar + label;
  }
}

customElements.define('family-member', FamilyMember);
