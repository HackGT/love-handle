import { html, parent, define } from "hybrids";
import { BabySharkDoDoDoDo } from "../tileos";
import { openApp } from "../taskManager";

const renderIcons = registered => {
    return registered.map(
        ({ name, icon }) =>
            html`
                <tileos-icon name=${name} icon=${icon} ondblclick=${(host) => openApp(host.store, { name, icon })}></tileos-icon>
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
