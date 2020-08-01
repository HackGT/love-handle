import { html, define, render } from "hybrids";

const registeredApps = [
    {
        name: "tileos-ferb",
        icon:
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.freebiesupply.com%2Flogos%2Fthumbs%2F2x%2Fterminal-1-logo.png&f=1&nofb=1"
    },
    {
        name: "love-handle",
        icon:
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fopengameart.org%2Fsites%2Fdefault%2Ffiles%2Fheart%2520pixel%2520art%2520254x254.png&f=1&nofb=1"
    },
    {
        name: "doof-pad",
        icon:
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Ff%2Ff0%2FIcon-notepad.svg%2F480px-Icon-notepad.svg.png&f=1&nofb=1"
    },
    {
        name: "photo-view",
        icon:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Media_Viewer_Icon_-_Open_Control.svg/512px-Media_Viewer_Icon_-_Open_Control.svg.png"
    },
    {
        name: "candace-menace",
        icon:
            "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpixelartmaker.com%2Fart%2F70489b4658e1add.png&f=1&nofb=1"
    }
];

localStorage.setItem("base64: two", "OC84LzVyMi84LzgvNG4zLzVLMi8ycTUgYiAtIC0gMCAx");
window.cincoDeMayo = `8/8/8/8/8/5n2/7r/3q1K2 b - - 0 1`;

export const BabySharkDoDoDoDo = {
    registered: registeredApps,
    open: [],
    focus: {
        observe: (host, val, lastVal) => {
            const currApp = host.querySelector(`[id="${val}"]`);
            const prevApp = host.querySelector(`[id="${lastVal}"]`);
            if (prevApp) prevApp.focus = false;
            if (currApp) {
                currApp.focus = true;
                currApp.style.display = "block";
            }
        }
    },
    showStartMenu: false,
    render: render(
        ({ showStartMenu }) => {
            return html`
                <tileos-desktop></tileos-desktop>
                <div id="dock-and-start-menu">
                    <tileos-start-menu
                        class=${!showStartMenu && "hide"}
                    ></tileos-start-menu>
                    <tileos-dock></tileos-dock>
                </div>
            `;
        },
        { shadowRoot: false }
    )
};

define("tileos-is-the-best", BabySharkDoDoDoDo);
