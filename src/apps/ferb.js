/* the terminal app */
import { html, define } from "hybrids";
import { tileosFs } from "../fs";
import CodeMirror from "codemirror";
import "codemirror/keymap/vim";

const COMMAND_PROMPT = "$";
const RESULT_PROMPT = ">";

// TODO have each command return a context of success/failure
// print :ok or :error based on context
const registry = {
    ferb: () => html`ohhhhhhhh yea`,
    ls: host => host.fs.ls(),
    pwd: host => html`<span class="wd">${host.fs.pwd()}</span>`,
    cd: (host, args) => {
        host.fs.cd(args[1]);
        return html`<span style="color: green; font-style: italic;">:ok</span>`
    },
    clear: () => [],
    help: () => html`this is good help hehe`,
    edit: (host, args) => {
        const file = args[1];
        const editor = CodeMirror(host.process, {
            value: host.fs.readFile(file),
            lineNumbers: true,
            keyMap: "vim",
            mode: "text/x-csrc",
            showCursorWhenSelecting: true
        });
        editor.setSize("100%", "100%");
        editor.focus();
    },
    exit: (host) => {
        //host.process.firstChildElement?.remove();
        // return html`<span style="color: green; font-style: italic;">:ok</span>`
    }
};

function runCommand(host, event) {
    if (event.keyCode === 13) {
        const args = event.target.value.split(" ");

        const result = registry[args[0]](host, args);
        host.results = [...host.results, result];

        event.target.value = "";
    }
}

function renderResults(results) {
    return results.map(result => {
        return html`
            <div class="result">
                <span>${RESULT_PROMPT}</span>
                <div>
                    ${result}
                </div>
            </div>
        `;
    });
}

const Terminal = {
    process: ({ render }) => {
        const target = render();
        return target.querySelector(".process");
    },
    status: ({ render }) => {
        const target = render();
        return target.querySelector(".status");
    },
    results: [],
    processRunning: false,
    resultsContainer: ({ render }) => {
        const target = render();
        return target.querySelector(".results");
    },
    fs: () => tileosFs,
    render: ({ results, fs }) => {
        return html`
                ${styles}
                <div class="process">
                </div>
                <div class="results">
                    ${renderResults(results)}
                </div>
                <div class="status">
                </div>
                <div class="cwd">
                    cwd: ${fs.pwd()}
                </div>
                <div class="prompt">
                    <span>${COMMAND_PROMPT}</span>
                    <input 
                        type="text" 
                        onkeyup=${runCommand}
                    ></input>
                </div>
        `;
    }
};

const styles = html`
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.56.0/codemirror.min.css"
    />

    <style>
        :host {
            display: block;
            position: relative;
            height: calc(100% - 10px);
            font-family: monospace;
            font-weight: bold;
        }

        .process {
            position: absolute;
            top: 0px;
            height: calc(100% - 72px);
            width: 100%;
            overflow: scroll;
        }

        .results {
            overflow: scroll;
            height: calc(100% - 88px);
            padding: 10px;
        }

        .result > span {
            padding-right: 5px;
        }

        .result {
            display: flex;
            max-width: 100%;
            min-height: 16px;
            font-size: 12px;
        }

        .result > div {
            overflow-wrap: anywhere;
        }

        .status {
            position: absolute;
            bottom: 52px;
            border-top: 2px solid white;
            width: 100%;
        }

        .cwd {
            position: absolute;
            bottom: 36px;
            border-top: 2px solid white;
            width: 100%;
        }

        .cwd,
        .wd {
            color: #5effa9;
        }

        .prompt {
            display: flex;
            position: absolute;
            bottom: 16px;
            width: 100%;
            border-top: 2px solid white;
        }

        .prompt span {
            padding-right: 10px;
            font-size: 16px;
        }

        .prompt input {
            height: 16px;
            width: 100%;
            background: black;
            color: cyan;
            border: none;
            padding: 0px;
            font-family: monospace;
            font-weight: bold;
        }

        .prompt input:focus {
            outline: none;
        }

        .dir,
        .file {
            font-weight: bold;
        }

        .dir {
            color: magenta;
        }

        .file {
            color: gold;
        }
    </style>
`;

define("tileos-ferb", Terminal);
