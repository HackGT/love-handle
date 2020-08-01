/* the terminal app */
import { html, define } from "hybrids";
import { tileosFs } from "../../fs";
import { ls, pwd, cd, clear, exit } from "./commands/unix";
import { ferb } from "./commands/fun";
import { edit } from "./bin/phineasCode";
import { repl } from "./bin/repl";

const COMMAND_PROMPT = "$";
const RESULT_PROMPT = ">";

const registry = {
    ferb,
    ls,
    pwd,
    cd,
    clear,
    help,
    edit,
    repl,
    exit
};

const processCommands = {};

export function registerProcessCommand(name, func) {
    processCommands[name] = func;
}

export function unregisterProcessCommand(name) {
    delete processCommands[name];
}

export function getProcessCommand(name) {
    return processCommands[name];
}

export function resetProcessCommands() {
    for (let cmd in processCommands) {
        delete processCommands[cmd];
    }
}

function help() {
    return ok(html`
        <div>
            Welcome to ferb, a terminal for tileos
        </div>
    `);
}

function runCommand(host, event) {
    if (event.keyCode === 13) {
        host.process.style.display = "block";

        const args = event.target.value.split(" ");

        const command = processCommands[args[0]] || registry[args[0]];

        if (!command) {
            host.status = [
                false,
                `the command "${args[0]}" could not be found`
            ];
            host.process.style.display = "none";
        } else {
            const { result, err } = command(host, args);
            if (err) {
                host.status = [false, err];
                host.process.style.display = "none";
            } else {
                if (result) host.results = [...host.results, result];
                if (!host.process.firstElementChild) {
                    host.status = [true, ""];
                    host.process.style.display = "none";
                }
            }
        }

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

function renderStatus(status) {
    const [success, val] = status;
    if (success) {
        return html`
            <span class="success">
                :ok "${val}"
            </span>
        `;
    } else {
        return html`
            <span class="error">
                :err "${val}"
            </span>
        `;
    }
}

const welcome = html`
    <h2>
        Welcome to <span style="color: #5effa9;">ferb</span>, a terminal for
        tileos
    </h2>
    <p>type <span style="color: #5ed2ff;">help</span> to get started</p>
`;

const Terminal = {
    process: ({ render }) => {
        const target = render();
        return target.querySelector(".process");
    },
    status: [true, ""],
    results: [welcome],
    fs: () => tileosFs,
    render: ({ results, fs, status }) => {
        return html`
                ${styles}
                <div class="process">
                </div>
                <div class="results">
                    ${renderResults(results)}
                </div>
                <div class="status">
                    ${renderStatus(status)}
                </div>
                <div class="cwd">
                    cwd: ${fs.pwd().result}
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
            height: 100%;
            font-family: monospace;
            font-weight: bold;
            font-size: 1rem;
            background: black;
            color: white;
        }

        .process, .results {
            overflow-x: hidden;
            overflow-y: scroll;
        }

        .process {
            display: none;
            position: absolute;
            top: 0px;
            height: calc(100% - 5.5rem);
            width: 100%;
            z-index: 1000;
        }

        .results {
            height: calc(100% - 7rem);
            padding: 10px;
        }

        .result > span {
            padding-right: 5px;
        }

        .result {
            display: flex;
            max-width: 100%;
            min-height: 1.25rem;
        }

        .result > div {
            overflow-wrap: anywhere;
        }

        .status {
            position: absolute;
            bottom: 3rem;
            width: 100%;
            max-height: 2rem;
        }

        .cwd {
            position: absolute;
            bottom: 1.5rem;
            border-top: 2px solid grey;
            width: 100%;
        }

        .cwd,
        .wd {
            color: #5ed2ff;
        }

        .prompt {
            display: flex;
            position: absolute;
            bottom: 0px;
            width: 100%;
            border-top: 2px solid grey;
        }

        .prompt span {
            padding-right: 10px;
        }

        .prompt input {
            width: 100%;
            background: black;
            border: none;
            color: white;
            font-family: monospace;
            font-weight: bold;
            font-size: 1rem;
        }

        .prompt input:focus {
            outline: none;
        }

        .directory,
        .file {
            font-weight: bold;
        }

        .directory {
            color: #ff8eff;
        }

        .directory::after {
            content: "/";
        }

        .file {
            color: #ffe86e;
        }

        .success,
        .error {
            font-style: italic;
        }

        .success {
            color: #5effa9;
        }

        .error {
            color: #ff5e5e;
        }
    </style>
`;

define("tileos-ferb", Terminal);
