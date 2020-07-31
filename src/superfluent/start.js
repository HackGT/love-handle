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
                                "https://lh3.googleusercontent.com/proxy/4C3UaY2HYJDYmnTJTfa7sWgEFPJGVbH4aE_KoPGWGUgi3mfYmVqcziKtsFgDLuEcGQTZUvZ34lEXnM-dABndA6i7JhpWKmUx",
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
                        "https://lh3.googleusercontent.com/proxy/4C3UaY2HYJDYmnTJTfa7sWgEFPJGVbH4aE_KoPGWGUgi3mfYmVqcziKtsFgDLuEcGQTZUvZ34lEXnM-dABndA6i7JhpWKmUx",
                    children: getFileTree(tileosFs.tree)
                },
                {
                    name: "there",
                    icon:
                        "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn130.picsart.com%2F258778191001212.png&f=1&nofb=1",
                    children: [
                        {
                            name: "nanda",
                            icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2F1YR16fsYib4%2Fmaxresdefault.jpg&f=1&nofb=1",
                            children: () => window.alert("do you like anime?")
                        },
                        {
                            name: "are",
                            icon:
                                "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn130.picsart.com%2F258778191001212.png&f=1&nofb=1",
                            children: [
                                {
                                    name: "korewa",
                                    icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FRa1S4HWNzak%2Fmaxresdefault.jpg&f=1&nofb=1",
                                    children: () =>
                                        window.alert("what about phineas and ferb?")
                                },
                                {
                                    name: "hints",
                                    icon:
                                        "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn130.picsart.com%2F258778191001212.png&f=1&nofb=1",

                                    children: [
                                        {
                                            name: "tsk",
                                            icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FrMyw6IW_lQE%2Fmaxresdefault.jpg&f=1&nofb=1",
                                            children: () =>
                                                window.alert(
                                                    "roku?"
                                                )
                                        },
                                        {
                                            name: "here",
                                            icon:
                                                "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/237/face-with-open-mouth_1f62e.png",
                                            children: () =>
                                                window.open(
                                                    "https://1ntegr8.github.io/pronkz/"
                                                )
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
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
