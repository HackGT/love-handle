import { html } from "hybrids";

export function ls(host) {
    const { result, err } = host.fs.ls();
    if (!err) {
        return ok(result.map(
            ({ name, type }) => html`
                <span class="${type}">${name}</span>
            `
        ));
    }
    return err;
}

export function pwd(host) {
    const { result, err } = host.fs.pwd();
    if (!err) {
        return ok(html`
            <span class="wd">${result}</span>
        `)
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
    return err("could not clear the screen");
}
