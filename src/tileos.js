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
            "https://lh3.googleusercontent.com/proxy/V_-wnhaTzZbt_IeXfnOpLBODVCU3QNVbhWoK2GMSD9n4bW51Pp3x2MdBmFyA0KbUGGZbSSNdQogXmoLpVwtQkyzSf4U88L8i"
    }
];

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
    render: render(
        () => {
            return html`
                <tileos-desktop></tileos-desktop>
                <tileos-dock></tileos-dock>
            `;
        },
        { shadowRoot: false }
    )
};

define("tileos-is-the-best", BabySharkDoDoDoDo);
