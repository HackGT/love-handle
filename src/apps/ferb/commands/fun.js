import { html } from "hybrids";
import { state } from "../../../state";

export function ferb() {
    state[1]();
    return ok(html`
        <h1>OHHHH YEAAA</h1>
    `);
}
