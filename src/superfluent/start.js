import { html, parent, define, render } from "hybrids";
import { BabySharkDoDoDoDo } from "../tileos";
import { openApp } from "../taskManager";
import { tileosFs } from "../fs";

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

            const getFileTree = folder => {
                return folder.nodes.map(node => {
                    const { name } = node;
                    if (node.content) {
                        return {
                            name,
                            icon:
                                "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.icons8.com%2Fcotton%2F2x%2Fdocument.png&f=1&nofb=1",
                            children: () => {
                                openApp(
                                    store,
                                    { name: "doof-pad" },
                                    { content: node.content }
                                );
                                store.showStartMenu = false;
                            }
                        };
                    } else {
                        return {
                            name,
                            icon:
                                "https://lh3.googleusercontent.com/proxy/LyG0-2-H_FL9wu8JGyw3iAWtJ1mcdc9jvY6t4xZ3pWZvAax_RMrnfIiIBxJkuWNK95Yw1F6D3sh08QFYtJKfvPuEhe1KY-zn",
                            children: getFileTree(node)
                        };
                    }
                });
            };
            const menu = [
                {
                    name: "programs",
                    icon:
                        "https://cdn3.iconfinder.com/data/icons/common-apps-1/1024/folder-512.png",
                    children: registered.map(({ name, icon }) => {
                        return {
                            name,
                            icon,
                            children: () => {
                                openApp(store, { name, icon });
                                store.showStartMenu = false;
                            }
                        };
                    })
                },
                {
                    name: "documents",
                    icon:
                        "https://lh3.googleusercontent.com/proxy/LyG0-2-H_FL9wu8JGyw3iAWtJ1mcdc9jvY6t4xZ3pWZvAax_RMrnfIiIBxJkuWNK95Yw1F6D3sh08QFYtJKfvPuEhe1KY-zn",
                    children: getFileTree(tileosFs.tree)
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
