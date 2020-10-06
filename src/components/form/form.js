import { html , render } from 'lit-html'
import Cleave from 'cleave.js'

export default class Form extends HTMLElement {
  
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    this._submit = false;
  }

  connectedCallback(){
    render(this.template(), this._shadowRoot, {eventContext: this});
    this.refs = {
      form: this._shadowRoot.querySelector('form'),
      has_companion: this._shadowRoot.querySelector('#has_companion'),
      companion_container: this._shadowRoot.querySelector('.companion'),
      button: this._shadowRoot.querySelector('button'),
      estado:this._shadowRoot.querySelector('#estado'),
      pais:this._shadowRoot.querySelector('#pais'),
      first_name: this._shadowRoot.querySelector('#first_name'),
      last_name: this._shadowRoot.querySelector('#last_name'),
      cpf: this._shadowRoot.querySelector('#cpf'),
      dt_nascimento: this._shadowRoot.querySelector('#dt_nascimento'),
      email: this._shadowRoot.querySelector('#email'),
      first_name_companion: this._shadowRoot.querySelector('#first_name_companion'),
      last_name_companion: this._shadowRoot.querySelector('#last_name_companion'),
      cpf_companion: this._shadowRoot.querySelector('#cpf_companion'),
      dt_nascimento_companion: this._shadowRoot.querySelector('#dt_nascimento_companion'),
      email_companion: this._shadowRoot.querySelector('#email_companion'),
      cep: this._shadowRoot.querySelector('#cep'),
      endereco: this._shadowRoot.querySelector('#endereco'),
      cidade: this._shadowRoot.querySelector('#cidade'),
      telefone: this._shadowRoot.querySelector('#telefone')
    }
    this.refs.has_companion.addEventListener( 'click' , (e) => {
      this._shadowRoot.querySelectorAll('.input-companion').forEach( input => input.required = ! input.required)
      this.refs.companion_container.classList.toggle('companion_active')
    })

    this.refs.form.addEventListener("submit", (e) => {
      e.preventDefault();
      // send form to api
    });
    // Mask form
    new Cleave(this.refs.endereco, {
      creditCard: true
    });
    new Cleave(this.refs.dt_nascimento, {
      date: true,
      delimiter: '/',
      datePattern: ['d', 'm', 'Y']
    });
    new Cleave(this.refs.dt_nascimento_companion, {
      date: true,
      delimiter: '/',
      datePattern: ['d', 'm', 'Y']
    });
    new Cleave(this.refs.cpf, {
      delimiters: ['.', '.', '-'],
      blocks: [3, 3, 3, 2],
      uppercase: true
    });
    new Cleave(this.refs.cep, {
      delimiters: ['.', '-'],
      blocks: [2, 3, 3],
      uppercase: true
    });
    new Cleave(this.refs.telefone, {
      delimiters: [' ', '-'],
      blocks: [2, 4, 4],
      uppercase: true
    });

    const inputs = this.refs.form.querySelectorAll('input')
    inputs.forEach(el => {
      el.addEventListener('change', () => {
        const inputs = Object.values(this.refs.form)
                        .filter( el => {
                          if(el.type != 'submit'){
                              if(this.refs.has_companion.checked){
                                return el.value == ''
                              }else{
                                return !el.classList.contains('input-companion') && el.value == ''
                              }
                              
                          }
                        })
        this.refs.button.disabled = ( inputs.length > 0 ) ? true :  false ;
      });
    })
  }

  buscacep(el){
    const cep = el.target.value.replace(/()-/g,'');
    const resCep = fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json()) // retorna uma promise  .then(result => { 
    .catch(err => { 
      console.error('Failed retrieving information', err); 
    });
    
    resCep.then( res => {
      this.refs.endereco.value = `${res.logradouro} ${res.bairro}`

    })

  }

  template(){
      return html`
        <div class="container">
            <h2>Formulário</h2>
            <form>
            <input type="text" name="first_name" id="first_name" placeholder="Primeiro nome" required />
            <input type="text" name="last_name" id="last_name" placeholder="Último nome" required />
            <input type="text" name="cpf" id="cpf" placeholder="Cpf" required />
            <input type="text" name="dt_nascimento" id="dt_nascimento" placeholder="Data de nascimento" required />
            <input type="email" name="email" id="email" placeholder="Email" required />
            <input type="checkbox" name="has_companion" id="has_companion" />
            <div class="companion">
              <input type="text" class="input-companion" name="first_name_companion" id="first_name_companion" placeholder="Primeiro nome"  />
              <input type="text" class="input-companion" name="last_name_companion" id="last_name_companion" placeholder="Último nome"  />
              <input type="text" class="input-companion" name="cpf_companion" id="cpf_companion" placeholder="Cpf"  />
              <input type="text" class="input-companion" name="dt_nascimento_companion" id="dt_nascimento_companion" placeholder="Data de nascimento"  />
              <input type="text" class="input-compaemail" name="email_companion" id="email_companion" placeholder="Email"  />
            </div>
            <input type="text" @change=${this.buscacep} name="cep" id="cep" placeholder="Cep" required />
            <input type="text" name="endereco" id="endereco" placeholder="Endereço" required />
            <select name="pais">
                <option>Pais</option>
                <option>Brasil</option>
            </select>
            <select name="estado" id="estado">
                <option>Estado</option>
                <option value="q">Estado</option>
            </select>
            <input type="text" name="cidade" id="cidade" placeholder="Cidade" required />
            <input type="tel" name="telefone" id="telefone" placeholder="Telefone" required />
            <button type="submit" disabled>Submit</button>
        </form>
        </div>
      `;
  }
}

customElements.define('wiz-form', Form)
