import CodeMirror from "codemirror";
import "codemirror/keymap/vim";
import { registerProcessCommand } from "../index";
import { evalSexpr } from "../../../sexpr/Interpret";
import { err } from "../../../result";

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

    const run = (host) => {
        try {
            const result = evalSexpr(editor.getValue(), {});
            host.status = [true, result];
            return ok(result);
        } catch (e) {
            host.status = [false, e];
            return err(e);
        }
    }
    registerProcessCommand("run", run);

    return ok("opened repl successfully");
}
