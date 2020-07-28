import { html, parent, define } from "hybrids";
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
    render: ({ store: { open, focus } }) => html`
        ${styles}
        <button>
            <img
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F1%2F1e%2FWindows_Logo_1995.svg%2F1181px-Windows_Logo_1995.svg.png&f=1&nofb=1" style="height: 15px; padding-right: 5px;"/>start
        </button>
        <div class="divider"></div>
        ${renderAppTabs(open, focus)}
    `
};

const styles = html`
    <style>
        :host {
            height: 25px;
            width: 100%;
            background: #d3cfca;
            position: fixed;
            bottom: 0px;
            display: flex;
            padding: 5px;
        }

        button {
            display: flex;
            justify-content: center;
            align-items: center;
            background: inherit;
            border-color: white black black white;
        }

        button:focus {
            outline: none;
        }

        button:active {
            border-color: black white white black;
        }

        .divider {
            border-left: grey 3px solid;
            margin: 0px 10px;
        }

        .focus {
            border-color: black white white black;
        }
    </style>
`;

define("tileos-dock", Dock);
