import interact from "interactjs";

interact(".draggable-icon").draggable({
    inertia: false,
    modifiers: [
        interact.modifiers.restrictRect({
            restriction: "parent",
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
interact(".draggable")
    .draggable({
        // enable inertial throwing
        inertia: false,
        // keep the element within the area of it's parent
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: "parent",
                endOnly: true
            }),
            interact.modifiers.snap({
                targets: [interact.createSnapGrid({ x: 20, y: 20 })],
                range: Infinity,
                relativePoints: [{ x: 0, y: 0 }]
            })
        ],
        // enable autoScroll
        autoScroll: true,

        listeners: {
            move: dragMoveListener
        }
    })
    .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },

        listeners: {
            move(event) {
                const target = event.target;
                let x = parseFloat(target.getAttribute("data-x")) || 0;
                let y = parseFloat(target.getAttribute("data-y")) || 0;

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
                target.textContent =
                    Math.round(event.rect.width) +
                    "\u00D7" +
                    Math.round(event.rect.height);
            }
        },
        modifiers: [
            // keep the edges inside the parent
            interact.modifiers.restrictEdges({
                outer: "parent"
            }),

            // minimum size
            interact.modifiers.restrictSize({
                min: { width: 100, height: 50 }
            })
        ],

        inertia: false
    });

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
