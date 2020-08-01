import { html, define } from "hybrids";

function printKayke(host) {
    const el = document.createElement("div");
    el.innerHTML = "🎂 WRONG: the correct answer is 'cake'";
    host.shadowRoot.appendChild(el);

    console.log(
        "%c 🎂 Yay kayke!!!",
        "font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)"
    );
    console.log("special string 3 -> 8/8/8/8/5r2/8/5Kn1/7q b - - 0 1");
    
}

const Cake = {
    render: () => {
        return html`
            ${styles}
            <h2>What will this print?</h2>
            <pre>console.log("hello, world");</pre>
            <input type="text" />
            <button onclick=${printKayke}>submit</button>
        `;
    }
};

const styles = html`
    <style>
        :host {
            display: block;
            height: 100%;
            overflow: hidden;
        }
    </style>
`;

define("candace-menace", Cake);
