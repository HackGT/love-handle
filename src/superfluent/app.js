import { html, define, render } from "hybrids";

const App = {
    name: {
        observe: (host) => {
            const { name } = host; 
            const app = document.createElement(name);
            host.appendChild(app);
        }
    },
    render: render(({ name }) => {
        return html`
            <tileos-app-header name=${name}></tileos-app-header>
        `;
    }, { shadowRoot: false })
};

const styles = html`
    <style>
        :host {
            display: block;
            width: 500px;
            height: 500px;
            background: black;
            color: white;
            border: 3px white solid;
        }
    </style>
`;

define("tileos-app", App);
