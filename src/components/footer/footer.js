import { render } from 'lit-html'


export default class Footer extends HTMLElement {
  

  constructor() {
    super();
    this._menuOpts = new Object;
    this._containerElement = null;
    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
  }

  connectedCallback(){
    this._containerElement = this.getAttribute('containerElement')
    this._menuOpts = JSON.parse(this.getAttribute('menuOpts'));
    const template = document.querySelector(`#${this._containerElement}`);
    const content = template.content;
    const list =  content.querySelector('#menu-list')
    this._menuOpts.map( item => {
      const li = document.createElement('li')
      li.classList.add("item-menu");
      const anchor = document.createElement('a')
      anchor.title = item.name;
      anchor.innerHTML = item.name;
      anchor.href = item.urlPath;
      li.appendChild(anchor);
      list.appendChild(li)
    })
    render(content, this._shadowRoot, {eventContext: this});
  }
}

customElements.define('wiz-footer', Footer)
