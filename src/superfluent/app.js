import { html, render, define } from "hybrids";

export const App = {
    options: undefined,
    name: {
        observe: (host, value) => {
            const instance = document.createElement(value);
            instance.options = host.options;

            if (host.fen) instance.setAttribute("data-fen", host.fen);
            host.appContainer.appendChild(instance);
        }
    },
    appContainer: ({ render}) => {
        const target = render();
        return target.querySelector(".app-container");
    },
    focus: {
        observe: (host, val) => {
            if (val) {
                host.style.zIndex = 1000;
            } else {
                host.style.zIndex = 900;
            }
        }
    },
    render: render(
        ({ name, focus }) =>
            html`
                <tileos-app-header
                    name=${name}
                    class=${focus && "focus"}
                ></tileos-app-header>
                <div class="app-container">
                </div>
            `,
        { shadowRoot: false }
    )
};

define("tileos-app", App);
