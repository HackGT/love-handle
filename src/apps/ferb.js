/* the terminal app */
import { html, define } from "hybrids";
import { tileosFs } from "../fs";

function runCommand(host, event) {
    if (event.keyCode === 13) {
        const command = event.target.value.split(" ");
        if (command.length === 0) return;
        event.target.value = "";
        
        const result = [];

        switch (command[0].toLowerCase()) {
            case "ls": {
                result.push(host.fs.ls());
                result.flat(); 
            } break;
            case "pwd": result.push(host.fs.pwd()); break;
            case "cd": host.fs.cd(command[1]); break;
            case "clear": host.results = []; break; 
            case "help": result.push(html`this is helping you`); break;
            default: result.push(html`[error] command ${command} not recognized`); break;
        }

        host.results = [...host.results, ...result];
        host.resultsContainer.scrollTop = host.resultsContainer.scrollHeight;
    }
}

function renderResults(results) {
    return results.map(result => {
        return html`
            <div class="result">
                <span>&gt;</span>
                <div>
                    ${result}
                </div>
            </div>
        `;
    });
}

const Terminal = {
    results: [],
    resultsContainer: ({ render }) => {
        const target = render();
        return target.querySelector(".results");
    },
    fs: () => tileosFs,
    render: ({ results }) => {
        return html`
                ${styles}
                <div class="results">
                    ${renderResults(results)}
                </div>
                <div class="prompt">
                    <span>$</span>
                    <input 
                        type="text" 
                        onkeyup=${runCommand}
                    ></input>
                </div>
        `;
    }
};

const styles = html`
    <style>
        :host {
            display: block;
            position: relative;
            height: 100%;
        }
        .results {
            overflow: scroll;
            max-height: 90%; 
        }

        .result {
            max-width: 100%;
            display: flex;
            min-height: 16px;
        }

        .result > div {
            overflow-wrap: anywhere;
        }

        .prompt {
            display: flex;
            position: absolute;
            bottom: 16px;
            width: 100%;
            border-top: 2px solid white;
            font-family: monospace;
        }

        .prompt span, .result span {
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

        
    </style>
`;

define("tileos-ferb", Terminal);
