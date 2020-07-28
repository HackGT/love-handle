import { html, define, parent } from "hybrids";
import { BabySharkDoDoDoDo } from "../tileos";

function minimize(host, event) {
    event.stopPropagation();
    host.parentNode.style.display = "none";
    host.store.focus = undefined;
}

function close(host) {
    // get app id
    const id = host.parentNode.id;

    // remove the app from `open` list
    host.store.open = host.store.open.filter(
        ({ id }) => id !== host.parentNode.id
    );

    // unmount the app
    const app = host.store.querySelector(`[id="${id}"]`);
    app.remove();
}

export const Header = {
    name: "[no-name]",
    store: parent(BabySharkDoDoDoDo),
    focus: false,
    render: ({ name, focus }) => {
        return html`
            ${styles}
            ${focus &&
                html`
                    <style>
                        :host {
                            background: #000a7c;
                        }
                    </style>
                `}
            <div>${name}</div>
            <div>
                <button onclick=${minimize}>-</button>
                <button onclick=${close}>x</button>
            </div>
        `;
    }
};

const styles = html`
    <style>
        :host {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: grey;
            padding: 2px;
        }

        button {
            background: #d3cfca;
            border-color: white black black white;
        }

        button:focus {
            outline: none;
        }

        button:active {
            border-color: black white white black;
        }
    </style>
`;

define("tileos-app-header", Header);
