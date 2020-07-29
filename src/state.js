const os = document.querySelector("tileos-is-the-best");

export const state = [
    () => {
        os.setAttribute("data-theme", "95");
        setFen("3r4/8/7q/8/8/8/5kn1/8 w - - 0 1");
    },
    () => {
        os.setAttribute("data-theme", "xp");
        setFen("3R4/8/7Q/k7/8/8/6N1/8 w - - 0 1");
    },
    () => {
        os.setAttribute("data-theme", "7");
        setFen("3R4/8/7Q/k7/8/8/6N1/8 w - - 0 1");
    }
];

function setFen(fen) {
    os.fen = fen;
    document.body.dispatchEvent(new CustomEvent("fen", {
        detail: fen,
    }));
}

// TODO remove this once done with testing
window.state = state;

