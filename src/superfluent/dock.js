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
            <button>
                <img
                    src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F1%2F1e%2FWindows_Logo_1995.svg%2F1181px-Windows_Logo_1995.svg.png&f=1&nofb=1"
                    style="height: 15px; padding-right: 5px;"
                />start
            </button>
            <div class="divider"></div>
            ${renderAppTabs(open, focus)}
        `,
        { shadowRoot: false }
    )
};

define("tileos-dock", Dock);
