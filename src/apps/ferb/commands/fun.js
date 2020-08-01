import { html } from "hybrids";
import { state } from "../../../state";

export function ferb() {
    state[1]();
    setTimeout(() => {
        state[0]();
    }, 2000);
    return ok(html`
        <h1>OHHHH YEAAA</h1>
        <p>
            special string #0 ->
            <span style="color: #ff57ae;">"3r1q2/8/8/8/8/6n1/5K2/8 b - - 0 1"</span>
        </p>
    `);
}
