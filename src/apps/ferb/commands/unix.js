import { html } from "hybrids";
import { resetProcessCommands, getProcessCommand } from "../index";

export function ls(host) {
    const { result, err } = host.fs.ls();
    if (!err) {
        return ok(
            result.map(
                ({ name, type }) => html`
                    <span class="${type}">${name}</span>
                `
            )
        );
    }
    return err;
}

export function pwd(host) {
    const { result, err } = host.fs.pwd();
    if (!err) {
        return ok(html`
            <span class="wd">${result}</span>
        `);
    }
    return err;
}

export function cd(host, args) {
    const { result, err } = host.fs.cd(args[1]);
    if (!err) {
        return ok(result);
    }
    return err;
}

export function clear(host) {
    host.results = [];
    return ok("");
}

export function exit(host) {
    if (!host.process.firstElementChild) return err("there is no process running");
    while (host.process.firstChild) {
        host.process.removeChild(host.process.lastChild);
    }
    host.process.style.display = "none";
    const post = getProcessCommand("post");
    if (post) {
        const res = post(host);
        if (res.err) return res.err;
        return ok(res.result + " + exited successfully");
    }
    resetProcessCommands();
    return ok("exited successfully");
}
