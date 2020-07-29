import CodeMirror from "codemirror";
import "codemirror/keymap/vim";
import { registerProcessCommand } from "../index";

export function edit(host, args) {
    const file = args[1];

    const editor = CodeMirror(host.process, {
        value: host.fs.readFile(file),
        lineNumbers: true,
        keyMap: "vim",
        mode: "text/x-csrc",
        showCursorWhenSelecting: true
    });
    editor.setSize("100%", "100%");
    editor.focus();


    const save = (host) => {
        host.fs.writeFile(file, editor.getValue());
        host.status = [true, "saved to " + file];
        return ok("saved to " + file);
    }

    registerProcessCommand("help", (host) => {
        host.status = [true, "this is help"];
        return ok("");
    });
    registerProcessCommand("save", save);
    registerProcessCommand("post", save);

    return ok("opened phineas-code successfully");
}

