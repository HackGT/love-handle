const os = document.querySelector("tileos-is-the-best");

export const state = [
    () => {
        os.setAttribute("data-theme", "95");
        setFen("1r6/8/8/8/8/q7/4nK2/8 b - - 0 1");
    },
    () => {
        os.setAttribute("data-theme", "xp");
        setFen("3r1q2/8/8/8/8/6n1/5K2/8 b - - 0 1");
    },
    () => {
        os.setAttribute("data-theme", "xp");
        setFen("8/8/3r3q/8/8/8/5K2/5n2 b - - 0 1");
    },
    () => {
        os.setAttribute("data-theme", "7");
        setFen("8/8/5r2/8/8/4n3/5K2/2q5 b - - 0 1");
    },
    () => {
        os.setAttribute("data-theme", "disaster");
        setFen("8/8/8/8/5r2/8/5Kn1/7q b - - 0 1");
    },
    () => {
        os.setAttribute("data-theme", "10");
        setFen("8/8/8/7q/7r/8/5K2/4n3 b - - 0 1");
    },
    () => {
        setFen("8/8/8/8/8/5n2/7r/3q1K2 b - - 0 1");
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
