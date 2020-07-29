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
                    results.push({
                        name: node.name,
                        type: "directory"
                    });
                } else {
                    results.push({
                        name: node.name,
                        type: "file"
                    });
                }
            }
        }
        return ok(results);
    }

    pwd() {
        return ok(this.crumbs.map(crumb => crumb.name).join("/"));
    }

    cd(path) {
        for (let name of path.split("/")) {
            if (name === "..") {
                this._fsUp();
            } else {
                this._fsTo(name);
            }
        }
        return ok("");
    }

    readFile(path) {
        let n = 0;
        for (let name of path.split("/")) {
            if (name === "..") {
                this._fsUp();
                n--;
            } else {
                this._fsTo(name);
                n++;
            }
        }
        const [focus] = this.crumbs.slice(-1);

        for (let i = 0; i < n; i++) {
            this._fsUp();
        }

        if (focus instanceof File) {
            return focus.content;
        } else {
            return "";
        }
    }

    writeFile(path, content) {
        let n = 0;
        for (let name of path.split("/")) {
            if (name === "..") {
                this._fsUp();
                n--;
            } else {
                this._fsTo(name);
                n++;
            }
        }
        const [focus] = this.crumbs.slice(-1);

        for (let i = 0; i < n; i++) {
            this._fsUp();
        }

        if (focus instanceof File) {
            focus.content = content;
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
        new File("file-1", "hi there"),
        new File("file-2", "i'm good, wbu?"),
        new Folder("more-files", [
            new File("file-3", "this is my english homework"),
            new File("file-5", "neato burito"),
            new Folder("rescue-me", [new File("file-6", "hi there again")])
        ]),
        new File("file-4", "wbu?")
    ])
);
