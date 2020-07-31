import { html, define } from "hybrids";

const PhotoViewer = {
    images: [
        { name: 'xp-wallpaper.png',
          uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.vox-cdn.com%2Fthumbor%2FlCAHfXW-NhmS4tF2gBZmGuU2el4%3D%2F0x0%3A800x600%2F1200x800%2Ffilters%3Afocal(266x304%3A394x432)%2Fcdn.vox-cdn.com%2Fuploads%2Fchorus_image%2Fimage%2F55227337%2FBliss.1497349801.png&f=1&nofb=1' },
        { name: 'seven-wallpaper.png',
          uri: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwallpapercave.com%2Fwp%2FEgHUioz.jpg&f=1&nofb=1' },
        { name: 'chessboard.jpeg',
          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Chess_board_opening_staunton.jpg/800px-Chess_board_opening_staunton.jpg' },
        { name: 'reimagine reality.svg',
          uri: 'https://2020.hack.gt/finalLogo.58dc4dfe.svg' }
    ],
    imageIndex: 0,
    render: ({ images, imageIndex }) => {
        const previous = host => host.imageIndex--;
        const next = host => host.imageIndex++;
        return html`
        ${styles}
        <img src='${images[imageIndex%images.length].uri}'/>
        <div class='controls'>
            <button onclick=${previous}>Previous photo</button>
            ${images[imageIndex%images.length].name}
            <button onclick=${next}>Next photo</button>
        </div>
        `;
    }

}

const styles = html`
    <style>
        :host {
            display: flex;
            flex-direction: column;
            height: 100%;
            align-items: center;
            justify-content: center;
        }

        .controls {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            align-items: center;
            margin-top: auto;
        }

        img {
            height: max-content;
            width: auto;
            max-width: 100%;
            max-height: 100%;
        }
    </style>
`;

define("photo-view", PhotoViewer);
