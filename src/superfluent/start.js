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

function renderEssentialsTiles() {
    const haiku =
        "i shall be victor for no dare will defeat me i like haikus too 💖 💮";
    const divs = haiku.split(" ");
    return html`
        ${divs.map(
            (txt, i) =>
                html`
                    <div class="neato" id=${"essentials-" + i}>${txt}</div>
                `
        )}
    `;
}

export const Start = {
    store: parent(BabySharkDoDoDoDo),
    render: render(
        ({ store }) => {
            const { showStartMenu, registered } = store;

            function renderAppTiles(apps) {
                return apps.map(({ name, icon }, i) => {
                    return html`
                        <div
                            id=${"apps-" + i}
                            onclick=${() => {
                                openApp(store, { name, icon });
                                store.showStartMenu = false;
                            }}
                        >
                            <img src="${icon}" />
                            <span class="name">${name}</span>
                        </div>
                    `;
                });
            }

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
                                "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ficons.iconarchive.com%2Ficons%2Fwilnichols%2Falumin-folders%2F512%2FBurn-Metal-Folder-icon.png&f=1&nofb=1",
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
                        "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ficons.iconarchive.com%2Ficons%2Fwilnichols%2Falumin-folders%2F512%2FBurn-Metal-Folder-icon.png&f=1&nofb=1",
                    children: getFileTree(tileosFs.tree)
                },
                {
                    name: "there",
                    icon:
                        "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn130.picsart.com%2F258778191001212.png&f=1&nofb=1",
                    children: [
                        {
                            name: "nanda",
                            icon:
                                "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2F1YR16fsYib4%2Fmaxresdefault.jpg&f=1&nofb=1",
                            children: () => window.alert("do you like anime?")
                        },
                        {
                            name: "are",
                            icon:
                                "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn130.picsart.com%2F258778191001212.png&f=1&nofb=1",
                            children: [
                                {
                                    name: "korewa",
                                    icon:
                                        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FRa1S4HWNzak%2Fmaxresdefault.jpg&f=1&nofb=1",
                                    children: () =>
                                        window.alert(
                                            "what about phineas and ferb?"
                                        )
                                },
                                {
                                    name: "hints",
                                    icon:
                                        "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn130.picsart.com%2F258778191001212.png&f=1&nofb=1",

                                    children: [
                                        {
                                            name: "tsk",
                                            icon:
                                                "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FrMyw6IW_lQE%2Fmaxresdefault.jpg&f=1&nofb=1",
                                            children: () =>
                                                window.alert("roku?")
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
                    style="visibility: ${showStartMenu
                        ? "visible"
                        : "hidden"}; height: 100%;"
                >
                    <div id="status">
                        <div id="os-text">
                            TileOS &trade;
                        </div>
                    </div>
                    <div class="container">
                        <div class="explorer">
                            ${renderMenu(menu)}
                        </div>
                        <div class="essentials">
                            ${renderEssentialsTiles()}
                        </div>
                        <div class="apps">
                            ${renderAppTiles(registered)}
                        </div>
                    </div>
                </div>
            `;
        },
        { shadowRoot: false }
    )
};

define("tileos-start-menu", Start);
