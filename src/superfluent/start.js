import { html, parent, define, render } from "hybrids";
import { BabySharkDoDoDoDo } from "../tileos";

export const Start = {
    store: parent(BabySharkDoDoDoDo),
    render: render(
        ({ store: { showStartMenu } }) => html`
            <div id="start" style="visibility: ${showStartMenu?'visible':'hidden'}">
                <div id="status">
                    <div id="os-text">
                        TileOS &trade;
                    </div>
                </div>    
                <div id="content">
                </div>
            </div>
        `,
        { shadowRoot: false }
    )
};

define("tileos-start-menu", Start);
