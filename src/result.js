export function ok(value) {
    return {
        result: value,
    }
}

export function err(msg) {
    return {
        err: msg 
    }
}

window.ok = ok;
window.err = err;
