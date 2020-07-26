import { html, define } from "hybrids";

const Icon = {
    size: 40,
    name: "[no-name]",
    render: ({ size, name }) => html`
        ${styles}
        <div>
            <img src="https://picsum.photos/${size}" draggable="false" />
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
    </style>
`;

define("tileos-icon", Icon);
