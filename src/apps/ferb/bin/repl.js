import CodeMirror from "codemirror";
import "codemirror/keymap/vim";
import { registerProcessCommand } from "../index";
import { runSexpr, evalSexpr } from "../../../sexpr/Interpret";
import { err } from "../../../result";

const parsePosition = pos => {
    if (typeof pos !== "string") throw `Expected position, got ${pos}`;
    else if (pos.length !== 2)
        throw `Expected text position of length 2, got ${pos}`;
    const col = pos[0].toLowerCase();
    const row = pos[1].toLowerCase();
    if (col < "a" || col > "h") throw `Expected column between 'a' and 'h'`;
    else if (row < "1" || row > "8") throw `Expected row between 1 and 8`;
    else return col + row;
};

const move = (_env, args) => {
    const from = parsePosition(args[0]);
    const to = parsePosition(args[1]);
    document.body.dispatchEvent(
        new CustomEvent("move", {
            detail: {
                from: from,
                to: to
            }
        })
    );
    return "hopefully that was ok, i can't view other processes...";
};

const eigenjunior = (_env, args) => {
    const fen = args[0];
    console.log(fen);
    document.body.dispatchEvent(
        new CustomEvent("fen", {
            detail: {
                fen
            }
        })
    );
    return "hopefully that was ok, i can't view other processes...";
};

export function repl(host, _args) {
    const editor = CodeMirror(host.process, {
        value: "",
        lineNumbers: true,
        keyMap: "vim",
        mode: "text/x-csrc",
        showCursorWhenSelecting: true
    });
    editor.setSize("100%", "100%");
    editor.focus();

    const run = host => {
        try {
            const result = evalSexpr(editor.getValue(), {
                move,
                eigenjunior
            });
            host.status = [true, result];
            return ok(result);
        } catch (e) {
            host.status = [false, e];
            return err(e);
        }
    };
    registerProcessCommand("run", run);

    return ok("opened repl successfully");
}
