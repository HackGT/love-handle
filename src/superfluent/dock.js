import { html, parent, define, render } from "hybrids";
import { BabySharkDoDoDoDo } from "../tileos";

function bringAppToFront(id) {
    return host => {
        host.store.focus = id;
    };
}

const renderAppTabs = (openApps, focus) => {
    return openApps.map(
        ({ id, name }) =>
            html`
                <button
                    class=${id === focus && "focus"}
                    onclick=${bringAppToFront(id)}
                >
                    ${name}
                </button>
            `
    );
};

export const Dock = {
    store: parent(BabySharkDoDoDoDo),
    render: render(
        ({ store: { open, focus } }) => html`
            <button aria-label="Start button">
                <div style="height: 15px; padding-right: 5px;"></div>
                    start 
            </button>
            <div class="divider"></div>
            ${renderAppTabs(open, focus)}
        `,
        { shadowRoot: false }
    )
};

define("tileos-dock", Dock);
