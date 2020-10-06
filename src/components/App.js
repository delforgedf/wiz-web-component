import { html } from 'lit-html'
import { component } from 'haunted'
import ClientFooterDefault from './footer/footer-modules.json'

const App = () => html`
    <main class="container">
        <wiz-form></wiz-form>    
        <wiz-footer 
            containerElement="${ClientFooterDefault.containerElement}" 
            menuOpts = ${JSON.stringify(ClientFooterDefault.menuOpts)}
        </wiz-footer>
        
    </main>
`
customElements.define('wiz-app', component(App))
