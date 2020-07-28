import { html, parent, define } from "hybrids";
import { BabySharkDoDoDoDo } from "../tileos";
import { v4 as uuidv4 } from "uuid";

function openApp(host, event) {
    const name = event.target.name;
    const id = uuidv4();

    // create the app
    const app = document.createElement("tileos-app");
    app.name = name;
    app.id = id;

    app.addEventListener("click", () => {
        host.store.focus = app.id;
    });

    host.parentNode.appendChild(app);
    host.store.open = [...host.store.open, { id, name }];
    host.store.focus = id;
}

const renderIcons = registered => {
    return registered.map(
        ({ name, icon }) =>
            html`
                <tileos-icon name=${name} icon=${icon} ondblclick=${openApp}></tileos-icon>
            `
    );
};

export const Desktop = {
    store: parent(BabySharkDoDoDoDo),
    render: ({ store: { registered } }) => html`
        ${renderIcons(registered)}
    `
};

define("tileos-desktop", Desktop);
