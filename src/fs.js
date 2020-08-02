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

const manualContents =
`Congratulations on acquiring your new TileOS computer!
Every TileOS system comes pre-loaded with TileOS Lisp,
a simple programming language that you can use to
automate your system. This program is available through
the command line using the \`repl\` command.

The latest release of TileOS Lisp is version 0.8.3. In
this version, you have access to the following constructs:

 Syntax                  | Explanation
-------------------------+------------------------------
; hello world            | Comments (until end of line)
-------------------------+------------------------------
-1.5                     | Floating point numbers
-------------------------+------------------------------
"hello!"                 | Strings
-------------------------+------------------------------
(+ 1 2.0 -33)            | Add up any set of numbers!
-------------------------+------------------------------
(lambda (x) (+ x 1))     | Define functions using the
                         | lambda keyword, which creates
                         | an anonymous function that
                         | takes the specified list of
                         | arguments and evaluates them
                         | in the given expression.
-------------------------+------------------------------
((lambda (x) x) 5)       | Apply the given arguments to
                         | a function.
-------------------------+------------------------------
(quote (1 2 3))          | Capture the input without
                         | evaluation (in this case, the
                         | list (1 2 3)).
-------------------------+------------------------------
(list 1 2 3)             | Construct a list out of the
                         | arguments
-------------------------+------------------------------
(car (list 1 2))         | Take the first element from a
                         | list (e.g. 1).
-------------------------+------------------------------
(cdr (list 1 2))         | Take the given list minus the
                         | first element (e.g. (list 2))
-------------------------+------------------------------
(defun (f x) (+ x 1))    | Define a named function, with
                         | the possibility of making it
                         | recursive.
-------------------------+------------------------------
(f 1 2 3)                | Call a function 'f' with 3
                         | arguments
-------------------------+------------------------------
(move d6 d8)             | Access deep integration with
                         | TileOS chess using the
                         | built-in move command, which
                         | gives you the ability to play
                         | up to one instance of chess
                         | programatically!
-------------------------+------------------------------
(eigenjunior fen)        | Set the FEN for the built-in
                         | TileOS chess board. Use this
                         | to change the board layout.
                         | There should be some fun ones
                         | around, but I seem to have
                         | misplaced them...

At the top-level of your file, you can only write one
expression. If you want to combine multiple expressions,
try the following:

  (begin
    (defun (f x) (+ x 1))     ; Multiple
    (defun (g x) (+ (f x) 1)) ; Definitions
    (g 1))

-------------------------[!!!]-----------------------------

New in this release: 'defun' now allows for recursive
functions, simply by calling the function name in its body!

-------------------------[!!!]-----------------------------

More features are available if you purchase TileOS Service
Pack 3! Mail a check for $50.00 to us and you'll receive a
floppy disk containing new features such as: defining
variables, loops, and multiplication!

TileOS™ Corporation
1950 Random Rd
Atlanta, GA 30313

P.S
free token for you -> #4 8/8/8/7q/7r/8/5K2/4n3 b - - 0 1
`;

export const tileosFs = new FileSystem(
    new Folder("root", [
        new File("file-1", "hi there"),
        new File("file-2", "i'm good, wbu?"),
        new Folder("more-files", [
            new File("file-3", "this is my english homework"),
            new File("file-5", "neato burito"),
            new File("manual", manualContents),
            new Folder("rescue-me", [new File("file-6", "hi there again")])
        ]),
        new File("file-4", "wbu?")
    ])
);
