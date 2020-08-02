import { readSexpr, formatSexpr } from "./Sexpr";

function begin(env, args) {
    let result = null;
    for (let arg of args) {
        result = runSexpr(env, arg);
    }
    return result;
}

function add(env, args) {
    let result = 0;
    for (let arg of args) {
        const value = runSexpr(env, arg);
        if (typeof value !== "number") {
            throw `'+': Expected number but got ${value}`;
        }
        result += value;
    }
    return result;
}

function lambda(env, args) {
    if (args.length < 2) {
        throw `'lambda': Expected >=2 arguments but got ${args.length}`;
    }

    let argList = args[0];
    if (!Array.isArray(argList)) {
        throw `'lambda': Expected list of arguments but got ${argList}`;
    }
    argList = argList.map(name => name["id"]);

    const bodies = args.slice(1);

    return (...lambdaArgs) => {
        if (lambdaArgs.length !== argList.length) {
            throw `'lambda': Expected ${argList.length} args but got ${lambdaArgs.length}`;
        }
        let freshEnv = copyEnv(env);
        for (let i in argList) {
            freshEnv.scope[argList[i]] = lambdaArgs[i];
        }
        let result = null;
        for (let body of bodies) {
            result = runSexpr(freshEnv, body);
        }
        return result;
    };
}

function defun(env, args) {
    if (args.length < 2) {
        throw `'defun': Expected >=2 arguments but got ${args.length}`;
    }

    const prototype = args[0];
    if (!Array.isArray(prototype) || prototype.length < 1) {
        throw `'defun': Expected a prototype of the form (function-name args...)`;
    }
    const bodies = args.slice(1);
    const name = prototype[0]['id'];
    const params = prototype.slice(1).map(name => name["id"]);

    const fun = (recursiveEnv) => (...lambdaArgs) => {
        if (lambdaArgs.length !== params.length) {
            throw `'${name}': Expected ${params.length} args but got ${lambdaArgs.length}`;
        }
        let freshEnv = copyEnv(recursiveEnv);
        for (let i in params) {
            freshEnv.scope[params[i]] = lambdaArgs[i];
        }
        let result = null;
        for (let body of bodies) {
            result = runSexpr(freshEnv, body);
        }
        return result;
    }
    env.scope[name] = fun(env);
    return env.scope[name];
}

function quote(_env, args) {
    return args;
}

function runSexpr(env, sexpr) {
    switch (typeof sexpr) {
        case "string":
            return sexpr;
        case "number":
            return sexpr;
        case "object":
            if (!Array.isArray(sexpr)) {
                // identifier
                if (env.scope[sexpr["id"]] !== undefined) {
                    return env.scope[sexpr["id"]];
                } else if (env.builtins[sexpr["id"]] !== undefined) {
                    return env.builtins[sexpr["id"]];
                } else {
                    throw `Invalid expression: name '${sexpr["id"]}' could not be resolved`;
                }
            }
            // array
            if (sexpr.length == 0) {
                throw `Invalid expression: function application does not contain a head`;
            }
            let head = sexpr[0];
            const tail = sexpr.slice(1);
            if (!Array.isArray(head)) {
                head = head["id"];
                if (env.scope[head] && typeof env.scope[head] === "function") {
                    return env.scope[head](
                        ...tail.map(arg => runSexpr(env, arg))
                    );
                } else if (env.builtins[head]) {
                    return env.builtins[head](env, tail);
                } else {
                    throw `Invalid expression: name '${head}' could not be resolved`;
                }
            } else {
                const headValue = runSexpr(env, head);
                if (typeof headValue === "function") {
                    return headValue(...tail.map(arg => runSexpr(env, arg)));
                }
            }
            throw `Invalid expression: ${formatSexpr(head)} cannot be treated as a function`;
    }
}

function car(env, args) {
    const val = runSexpr(env, args[0]);
    return val[0];
}

function cdr(env, args) {
    const val = runSexpr(env, args[0]);
    return val.slice(1);
}

function cond(env, args) {

    const test = args[0][0];
    const op = test[0].id;
    const a = runSexpr(env, test[1]);
    const b = runSexpr(env, test[2]);
    
    let res = null;
    switch (op) {
        case "==":
            if (a == b) res = runSexpr(env, args[0][1]);
            break;
        case "<":
            if (a < b) res = runSexpr(env, args[0][1]);
            break;
        case ">":
            if (a > b) res = runSexpr(env, args[0][1]);
            break;
        case ">=":
            if (a >= b) res = runSexpr(env, args[0][1]);
            break;
        case "<=":
            if (a <= b) res = runSexpr(env, args[0][1]);
            break;
        default:
            throw `Invalid conditional operator ${op}`;
    }
    if (res === null) {
        res = runSexpr(env, args[0][2]);
    }
    return res;
}

function list(env, args) {
    const result = [];

    for (let arg of args) {
        result.push(runSexpr(env, arg));
    }
    return result;
}

function copyEnv(env) {
    const builtins = Object.assign({}, env.builtins);
    const scope = Object.assign({}, env.scope);
    return { builtins, scope };
}

function formatEnv(env) {
    let copy = copyEnv(env);
    Object.keys(copy.scope).map(key => {
        if (typeof copy.scope[key] === 'function')
            copy.scope[key] = '<function>';
    });
    Object.keys(copy.builtins).map(key => {
        if (typeof copy.builtins[key] === 'function')
            copy.builtins[key] = '<function>';
    });
    return JSON.stringify(copy);
}

export function evalSexpr(string, extraBuiltins) {
    let env = {
        scope: {},
        builtins: {
            begin,
            "+": add,
            lambda,
            quote,
            car,
            cdr,
            cond,
            list,
            defun,
            ...extraBuiltins
        }
    };
    const program = readSexpr(string);
    const result = runSexpr(env, program);
    if (typeof result === "function") {
        return "<function>";
    } else {
        return formatSexpr(result);
    }
}
