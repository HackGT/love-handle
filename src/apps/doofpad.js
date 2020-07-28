import { html, define } from "hybrids";

const Notepad = {
    render: () => html`
        ${styles}
        <textarea>Welcome to doofpad, a dumber notepad</textarea>
    `
}

const styles = html`
    <style>
        :host {
            display: block;
            height: 100%;
        }

        .status {
            display: flex;
        }

        textarea {
            height: 100%;
            width: 100%;
        }
    </style>
`;

define("doof-pad", Notepad);
