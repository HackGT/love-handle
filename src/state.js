const os = document.querySelector("tileos-is-the-best");

const ticker = ["10", "disaster", "7", "vista", "xp", "95"];

export const state = [
    () => {
        os.setAttribute("data-theme", "95");
        setFen("1r6/8/8/8/8/q7/4nK2/8 b - - 0 1");
    },
    () => {
        os.setAttribute("data-theme", "xp");
    },
    () => {
        os.setAttribute("data-theme", "vista");
    },
    () => {
        os.setAttribute("data-theme", "7");
    },
    () => {
        os.setAttribute("data-theme", "disaster");
    },
    () => {
        os.setAttribute("data-theme", "10");
    },
    () => {
        // display winner screen
        window.state = state;
    }
];

function setFen(fen) {
    os.fen = fen;
    document.body.dispatchEvent(
        new CustomEvent("fen", {
            detail: fen
        })
    );
}

let fens = [];

document.body.addEventListener("aweirdevent", e => {
    const i = ticker.length - 1;
    if (ticker[i] === os.getAttribute("data-theme")) {
        state[state.length - ticker.length]();
        setFen(e.detail);
        fens.push(e.detail);
        ticker.pop();
        window.geiger -= 1;
    }

    if (ticker.length === 0) {
        // check solution
    }
});

