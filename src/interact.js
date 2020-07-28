import interact from "interactjs";

const viewport = {
    x: 0,
    y: 0,
    width: Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
    ),
    height: Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
    )
};

interact("tileos-icon").draggable({
    inertia: false,
    modifiers: [
        interact.modifiers.restrictRect({
            endOnly: true
        }),
        interact.modifiers.snap({
            targets: [interact.createSnapGrid({ x: 64, y: 64 })],
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
        ],
        // enable autoScroll
        autoScroll: true,

        listeners: {
            move: dragApp
        }
    })

interact("tileos-app")
    .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },

        listeners: {
            move(event) {
                var target = event.target;
                var x = parseFloat(target.getAttribute("data-x")) || 0;
                var y = parseFloat(target.getAttribute("data-y")) || 0;

                // update the element's style
                target.style.width = event.rect.width + "px";
                target.style.height = event.rect.height + "px";

                // translate when resizing from top or left edges
                x += event.deltaRect.left;
                y += event.deltaRect.top;

                target.style.webkitTransform = target.style.transform =
                    "translate(" + x + "px," + y + "px)";

                target.setAttribute("data-x", x);
                target.setAttribute("data-y", y);
            }
        },
        modifiers: [
            // keep the edges inside the parent
            interact.modifiers.restrictEdges({
                outer: viewport,
            }),

            // minimum size
            interact.modifiers.restrictSize({
                min: { width: 100, height: 50 }
            })
        ],

        inertia: false, 
    });

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
