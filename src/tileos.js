import { html, define, render } from "hybrids";

const registeredApps = [
    "tileos-ferb",
    // "cool-chess",
];

function renderApps(apps) {
    return apps.map(name => {
        return html`
            <tileos-app name=${name}></tileos-app>
        `;
    });
}

const BabySharkDoDoDoDo = {
    apps: registeredApps,
    render: render(({ apps }) => html`
        <div class="apps">
            ${renderApps(apps)}
        </div>
        <tileos-dock></tileos-dock>
    `, { shadowRoot: false })
};

define("tileos-is-the-best", BabySharkDoDoDoDo);
