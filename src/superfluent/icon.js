import { html, define } from "hybrids";

export const Icon = {
    name: "[no-name]",
    icon: "[no-icon]",
    render: ({ icon, name }) => html`
        ${styles}
        <div>
            <img src="${icon}" draggable="false" />
            <span>${name}</span>
        </div>
    `
};

const styles = html`
    <style>
        :host {
            display: block;
            width: fit-content;
        }

        :host > div {
            height: 64px;
            width: 64px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        :host > div:hover {
            opacity: 0.7;
            outline: 1px black solid;
            cursor: pointer;
        }

        span {
            font-size: 0.75rem;
        }

        img {
            height: 40px;
        }
    </style>
`;

define("tileos-icon", Icon);
