import interact from "interactjs";

const viewport = {
    x: 0,
    y: 0,
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
}

interact("tileos-icon").draggable({
    inertia: false,
    modifiers: [
        interact.modifiers.restrictRect({
            endOnly: true
        }),
        interact.modifiers.snap({
            targets: [interact.createSnapGrid({ x: 64, y: 64})],
            range: Infinity,
            relativePoints: [{ x: 0, y: 0 }]
        })
    ],
    autoScroll: false,
    listeners: {
        move: dragMoveListener
    }
});

// target elements with the "draggable" class
interact("tileos-app-header")
    .draggable({
        // enable inertial throwing
        inertia: false,
        // keep the element within the area of it's parent
        modifiers: [
            interact.modifiers.restrictRect({
                endOnly: true
            }),
            interact.modifiers.snap({
                targets: [interact.createSnapGrid({ x: 16, y: 16})],
                range: Infinity,
                relativePoints: [{ x: 0, y: 0 }]
            })
        ],
        // enable autoScroll
        autoScroll: true,

        listeners: {
            move: dragApp 
        }
    })

function dragApp(event) {
    const header = event.target;
    window.header = header;
    const target = header.parentNode;
    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform = target.style.transform =
        "translate(" + x + "px, " + y + "px)";

    // update the posiion attributes
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
}

function dragMoveListener(event) {
    const target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform = target.style.transform =
        "translate(" + x + "px, " + y + "px)";

    // update the posiion attributes
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
}
