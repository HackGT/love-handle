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
        // add victory message
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
        const solution = fens.join();
        const searchParams = new URLSearchParams(window.location.search);
        const clientId = searchParams.get("installation-id");

        if (clientId) {
            const body = {
                solution,
                clientId
            };
            fetch("https://puzzles.hack.gt/lovehandle/check", {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-type": "application/json"
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        alert(
                            "We attempted to verify your solution, but coudldn't find your installation id. Please open Puzzle 4 from the puzzles dashboard at https://puzzles.hack.gt. PLEASE SAVE YOUR SOLUTION BEFORE HEADING OVER TO YOUR DASHBOARD TO AVOID unwarranted FRUSTRATION"
                        );
                    } else {
                        if (data.result === false) {
                            alert("INCORRECT SOLUTION! You are on the right track tho ;)");
                        } else {
                            const template = document.createElement("template");
                            template.innerHTML = `
                                <div class="modal">
                                    Congrats! You have found your true soulmate. It's the pleading face!!!
                                    <span style="font-size: 3rem; display: block;">
                                        🥺 
                                    </span>
                                    Submit the following for Puzzle 4 @ <a href="https://puzzles.hack.gt">puzzles.hack.gt</a>
                                    <div class="quote">
                                        ${data.quote}
                                    </div>
                                </div>
                            `
                             const el = template.content.cloneNode(true);
                            document.body.appendChild(el);
                        }
                    }
                });
        } else {
            alert(
                "We attempted to verify your solution, but coudldn't find your installation id. Please open Puzzle 4 from the puzzles dashboard at https://puzzles.hack.gt. PLEASE SAVE YOUR SOLUTION BEFORE HEADING OVER TO YOUR DASHBOARD TO AVOID unwarranted FRUSTRATION"
            );
        }
    }
});
