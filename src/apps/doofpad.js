import { html, define } from "hybrids";

const Notepad = {
    options: undefined,
    render: ({ options }) => {
        return html`
            ${styles}
            <textarea>
${options?.content || "Welcome to doofpad, a dumber notepad"}</textarea
            >
            <div>
                <p>
                    special string #1 ->
                    <span style="color: #ff57ae;"
                        >"8/8/3r3q/8/8/8/5K2/5n2 b - - 0 1"</span
                    >
                </p>
            </div>
        `;
    }
};

const styles = html`
    <style>
        :host {
            display: block;
            height: 100%;
            overflow: scroll;
        }

        .status {
            display: flex;
        }

        textarea {
            height: 100%;
            width: 100%;
            padding: 0px;
            margin: 0px;
            font-size: 1.5rem;
        }
    </style>
`;

define("doof-pad", Notepad);
