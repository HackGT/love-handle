/* the chess app */
import { Chess } from "chess.js";

const game = new Chess();

class LoveHandle extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const board = document.createElement("div");
        board.style.width = "500px";
        board.setAttribute("id", "chess-board");
        this.appendChild(board);

        const config = {
            draggable: true,
            position: "start",
            onDragStart: this.onDragStart,
            onDrop: this.onDrop,
        };

        window.board = ChessBoard("chess-board", config);

        this.appendChild(board);
    }

    onDragStart(source, piece, position, orientation) {
        // do not pick up pieces if the game is over
        if (game.game_over()) return false;

        // only pick up pieces for the side to move
        if (
            (game.turn() === "w" && piece.search(/^b/) !== -1) ||
            (game.turn() === "b" && piece.search(/^w/) !== -1)
        ) {
            return false;
        }
    }

    onDrop(source, target) {
        // see if the move is legal
        var move = game.move({
            from: source,
            to: target,
            promotion: "q" // NOTE: always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return "snapback";
    }
}

customElements.define("cool-chess", LoveHandle);
