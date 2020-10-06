import { html , render } from 'lit-html'

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
      endereco:this._shadowRoot.querySelector('#endereco'),
      estado:this._shadowRoot.querySelector('#estado'),
    }
    this.refs.has_companion.addEventListener( 'click' , (e) => {
      this._shadowRoot.querySelectorAll('.input-companion').forEach( input => input.required = ! input.required)
      this.refs.companion_container.classList.toggle('companion_active')
    })

    this.refs.form.addEventListener("submit", (e) => {
      e.preventDefault();
      // send form to api
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
    const cep = el.target.value;
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
            <input type="text" name="first-name" placeholder="Primeiro nome" required />
            <input type="text" name="last-name" placeholder="Último nome" required />
            <input type="text" name="cpf" placeholder="Cpf" required />
            <input type="text" name="dt-nascimento" placeholder="Data de nascimento" required />
            <input type="text" name="email" placeholder="Email" required />
            <input type="checkbox" name="has_companion" id="has_companion" />
            <div class="companion">
              <input type="text" class="input-companion" name="first-name" placeholder="Primeiro nome"  />
              <input type="text" class="input-companion" name="last-name" placeholder="Último nome"  />
              <input type="text" class="input-companion" name="cpf" placeholder="Cpf"  />
              <input type="text" class="input-companion" name="dt-nascimento" placeholder="Data de nascimento"  />
              <input type="text" class="input-companion" name="email" placeholder="Email"  />
            </div>
            <input type="text" @change=${this.buscacep} name="cep" placeholder="Cep" required />
            <input type="text" name="endereco" id="endereco" placeholder="Endereço" required />
            <select name="pais">
                <option>Pais</option>
                <option>Brasil</option>
            </select>
            <select name="estado" id="estado">
                <option>Estado</option>
                <option value="q">Estado</option>
            </select>
            <input type="text" name="cidade" placeholder="Cidade" required />
            <input type="text" name="telefone" placeholder="Telefone" required />
            <button type="submit" disabled>Submit</button>
        </form>
        </div>
      `;
  }
}

customElements.define('wiz-form', Form)
