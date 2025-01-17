/* the chess app */
import { Chess } from "chess.js";

class LoveHandle extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.fen = this.getAttribute("data-fen");
        this.game = new Chess(this.fen);

        document.body.addEventListener("fen", (e) => {
            this.fen = e.detail;
            this.game = new Chess(this.fen);
            this.board.position(this.fen);
        });

        document.body.addEventListener("move", (e) => {
            const from = e.detail.from;
            const to = e.detail.to;
            const move = this.game.move({
                from: from,
                to: to
            });
            if (move) this.board.move(`${from}-${to}`);
        })

        const board = document.createElement("div");
        board.style.width = "350px";
        const id = "chess-board";
        board.setAttribute("id", id);

        if (document.getElementById(id)) {
            const el = document.createElement("div");
            el.innerHTML = "An instance of `love-handle` already exists!";
            this.appendChild(el);
            return;
        }
        this.appendChild(board);

        const config = {
            draggable: true,
            position: "start",
            onDragStart: this.onDragStart.bind(this),
            onDrop: this.onDrop.bind(this),
            position: this.fen
        };

        this.board = ChessBoard(id, config);

        this.appendChild(board);
        this.style.display = "flex";
        this.style.height = "100%";
        this.style.justifyContent = "center";
        this.style.alignItems = "center";
    }

    // from https://chessboardjs.com/examples#5000
    onDragStart(source, piece, position, orientation) {
        // do not pick up pieces if the game is over
        if (this.game.game_over()) return false;

        // only pick up pieces for the side to move
        if (
            (this.game.turn() === "w" && piece.search(/^b/) !== -1) ||
            (this.game.turn() === "b" && piece.search(/^w/) !== -1)
        ) {
            return false;
        }
    }

    onDrop(source, target) {
        // see if the move is legal
        var move = this.game.move({
            from: source,
            to: target
        });

        // illegal move
        if (move === null) return "snapback";
    }
}

customElements.define("love-handle", LoveHandle);
