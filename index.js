// main os
import "./src/tileos";

// components
import "./src/superfluent/dock";
import "./src/superfluent/start";
import "./src/superfluent/desktop";
import "./src/superfluent/icon";
import "./src/superfluent/app";
import "./src/superfluent/header";

// apps
import "./src/apps/ferb/index";
import "./src/apps/loveHandle";
import "./src/apps/doofpad";
import "./src/apps/photoviewer";
import "./src/apps/candaceMenace";

// error handling
import "./src/result";

// drag and resize
import "./src/interact";

// styles
import "./style.scss";

// puzzle state
import { state } from "./src/state";
state[0]();

const body = {
    solution: "tom"
};

fetch("https://puzzles.dev.hack.gt/lovehandle", {
    method: "POST",
    body: JSON.stringify(body)
})
    .then(res => {
        return res.json();
    })
    .then(data => console.log(data));
