import { html, parent, define, render } from "hybrids";
import { BabySharkDoDoDoDo } from "../tileos";
import { openApp } from "../taskManager";

function renderMenu(menu) {
    return html`
        <ul>
            ${menu.map(({ name, icon, children }) => {
                if (typeof children === "function") {
                    return html`
                        <li onclick=${children}>
                            <div class="name">
                                <img src=${icon} />
                                ${name}
                            </div>
                        </li>
                    `;
                } else {
                    return html`
                        <li class="parent">
                            <div>
                                <img src=${icon} />
                                <span class="name">${name}</span>
                                <span>&gt;</span>
                            </div>
                            ${renderMenu(children)}
                        </li>
                    `;
                }
            })}
        </ul>
    `;
}

export const Start = {
    store: parent(BabySharkDoDoDoDo),
    render: render(
        ({ store }) => {
            const { showStartMenu, registered } = store;

            const menu = [
                {
                    name: "programs",
                    icon: "https://cdn3.iconfinder.com/data/icons/common-apps-1/1024/folder-512.png",
                    children: registered.map(({ name, icon }) => {
                        return {
                            name,
                            icon,
                            children: () => { openApp(store, { name, icon }); store.showStartMenu = false;}
                        };
                    })
                },
                {
                    name: "documents",
                    icon: "https://lh3.googleusercontent.com/proxy/LyG0-2-H_FL9wu8JGyw3iAWtJ1mcdc9jvY6t4xZ3pWZvAax_RMrnfIiIBxJkuWNK95Yw1F6D3sh08QFYtJKfvPuEhe1KY-zn",
                    children: () => alert("document")
                }
            ];

            return html`
                <div
                    id="start"
                    style="visibility: ${showStartMenu ? "visible" : "hidden"}"
                >
                    <div id="status">
                        <div id="os-text">
                            TileOS &trade;
                        </div>
                    </div>
                    <div class="content">
                        ${renderMenu(menu)}
                    </div>
                </div>
            `;
        },
        { shadowRoot: false }
    )
};

define("tileos-start-menu", Start);
