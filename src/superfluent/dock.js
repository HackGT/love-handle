import { html, define } from "hybrids";

const renderAppTabs = openApps => {
    return openApps.map(appName => html`<button>${appName}</button>`);
};

const Dock = {
    openApps: [],
    render: ({ openApps }) => html`
        ${styles}
        <button>start</button>
        <div class="divider"></div>
        ${renderAppTabs(openApps)}
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
    </style>
`;

define("tileos-dock", Dock);
