import { html } from "hybrids";

class Folder {
    constructor(name, nodes) {
        this.name = name;
        this.nodes = nodes;
    }
}

class File {
    constructor(name, content) {
        this.name = name;
        this.content = content;
    }
}

class FileSystem {
    constructor(tree) {
        this.tree = tree;
        this.crumbs = [tree];
    }

    ls() {
        const [focus] = this.crumbs.slice(-1);
        const results = [];
        if (focus instanceof Folder) {
            for (let node of focus.nodes) {
                if (node instanceof Folder) {
                    results.push(node.name + "/"); 
                } else {
                    results.push(node.name); 
                }
            }
        }
        return results;
    }

    pwd() {
        return this.crumbs.map(crumb => crumb.name).join("/");
    }

    cd(path) {
        for (let name of path.split("/")) {
            if (name === "..") {
                this._fsUp();
            } else {
                this._fsTo(name);
            }
        }
    }

    _fsUp() {
        if (this.crumbs.length > 1) this.crumbs.pop();
        return this;
    }

    _fsTo(name) {
        const [focus] = this.crumbs.slice(-1);
        if (focus instanceof File) {
            return this;
        }

        const nodes = focus.nodes;
        const i = nodes.findIndex(node => node.name == name);
        if (i < 0) return this;
        
        this.crumbs.push(nodes[i]);
        return this;
    }
}

export const tileosFs = new FileSystem(
    new Folder("root", [
        new File(
            "file-1",
            html`
                hi there
            `
        ),
        new File(
            "file-2",
            html`
                i'm good, wbu?
            `
        ),
        new Folder("more-files", [
            new File(
                "file-3",
                html`
                    hi there
                `
            )
        ]),
        new File(
            "file-4",
            html`
                i'm good, wbu?
            `
        )
    ])
);
