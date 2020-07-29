import { html, parent, define, render } from "hybrids";
import { BabySharkDoDoDoDo } from "../tileos";

function bringAppToFront(id) {
    return host => {
        host.store.focus = id;
    };
}

function toggleStartMenu() {
    return host => {
        host.store.showStartMenu = !host.store.showStartMenu;
    };
}

const renderAppTabs = (openApps, focus) => {
    return openApps.map(
        ({ id, name, icon }) =>
            html`
                <button
                    class=${id === focus && "focus"}
                    onclick=${bringAppToFront(id)}
                >
                    <img src=${icon} style="height: 15px; width: 15px; padding-right: 5px;"></img>
                    ${name}
                </button>
            `
    );
};

const getTime = () => new Date(Date.now()).toLocaleTimeString();

export const Dock = {
    store: parent(BabySharkDoDoDoDo),
    render: render(
        ({ store: { open, focus } }) => html`
            <button aria-label="Start button" onclick=${toggleStartMenu()}>
                <div style="height: 10%; padding-right: 5px;"></div>
                    start 
            </button>
            <div class="divider"></div>
            ${renderAppTabs(open, focus)}
            <div class="datetime">${getTime()}</div>
        `,
        { shadowRoot: false }
    )
};

setInterval(() => {
    for (let time of document.querySelectorAll('.datetime')) {
        time.textContent = getTime();
    }
}, 1000)

define("tileos-dock", Dock);
