import { html, define, parent, render } from "hybrids";
import { BabySharkDoDoDoDo } from "../tileos";

function minimize(host, event) {
    event.stopPropagation();
    host.parentNode.style.display = "none";
    host.store.focus = undefined;
}

function close(host) {
    // get app id
    const id = host.parentNode.id;

    // remove the app from `open` list
    host.store.open = host.store.open.filter(
        ({ id }) => id !== host.parentNode.id
    );

    // unmount the app
    const app = host.store.querySelector(`[id="${id}"]`);
    app.remove();
}

export const Header = {
    name: "[no-name]",
    store: parent(BabySharkDoDoDoDo),
    render: render(({ name }) => {
        return html`
            <div>${name}</div>
            <div style="display: flex;">
                <button aria-label="Minimize" onclick=${minimize}></button>
                <button aria-label="Close" onclick=${close}></button>
            </div>
        `;
    }, { shadowRoot: false })
};

define("tileos-app-header", Header);
