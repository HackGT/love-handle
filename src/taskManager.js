import { v4 as uuidv4 } from "uuid";

// host is the operating system top level component
export function openApp(host, appDetails, options) {
    const name = appDetails.name;
    const icon = appDetails.icon;
    const id = uuidv4();
    
    // create the app
    const app = document.createElement("tileos-app");
    app.name = name;
    app.id = id;
    app.options = options;

    if (name === "love-handle") app.fen = host.fen;

    app.addEventListener("click", () => {
        host.focus = app.id;
    });

    host.appendChild(app);
    host.open = [...host.open, { id, name, icon }];
    host.focus = id;
}
