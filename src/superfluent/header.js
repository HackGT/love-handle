import { html, define } from "hybrids";

const Header = {
    name: "[no-name]",
    render: ({ name }) => {
        return html`
            <div>${name}</div>
        `;
    }
};

define("tileos-app-header", Header);
