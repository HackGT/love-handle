import { readSexpr, formatSexpr } from "./Sexpr";

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
    if (args.length !== 2) {
        throw `'lambda': Expected 2 arguments but got ${args.length}`;
    }

    const argList = args[0];
    if (!Array.isArray(argList)) {
        throw `'lambda': Expected list of arguments but got ${argList}`;
    }

    const body = args[1];

    return (...lambdaArgs) => {
        if (lambdaArgs.length !== argList.length) {
            throw `'lambda': Expected ${argList.length} args but got ${lambdaArgs.length}`;
        }
        let freshEnv = Object.assign({}, env);
        for (let i in argList) {
            freshEnv.scope[argList[i]] = lambdaArgs[i];
        }
        return runSexpr(freshEnv, body);
    };
}

function quote(_env, args) {
    return args;
}

function runSexpr(env, sexpr) {
    switch (typeof sexpr) {
        case "string":
            if (env.scope[sexpr]) {
                return env.scope[sexpr];
            } else if (env.builtins[sexpr]) {
                return env.builtins[sexpr];
            } else {
                throw `Invalid expression: name '${sexpr}' could not be resolved`;
            }
        case "number":
            return sexpr;
        case "object":
            if (!Array.isArray(sexpr)) {
                throw `Invalid expression: ${sexpr}`;
            }
            if (sexpr.length == 0) {
                throw `Invalid expression: function application does not contain a head`;
            }
            const head = sexpr[0];
            const tail = sexpr.slice(1);
            if (typeof head === "string") {
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
                console.log(sexpr);
                const headValue = runSexpr(env, head);
                if (typeof headValue === "function") {
                    return headValue(...tail.map(arg => runSexpr(env, arg)));
                }
            }
            throw `Invalid expression: ${head} cannot be treated as a function`;
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
    const op = test[0];
    const a = runSexpr(env, test[1]);
    const b = runSexpr(env, test[2]);
    
    let res = [];
    switch (op) {
        case "==":  if (a == b) res = runSexpr(env, args[0][1]); break;
        case "<": if (a < b) res = runSexpr(env, args[0][1]); break;
        case ">": if (a > b) res = runSexpr(env, args[0][1]); break;
        case ">=": if (a >= b) res = runSexpr(env, args[0][1]); break;
        case "<=": if (a <= b) res = runSexpr(env, args[0][1]); break;
        default: throw `Invalid conditional operator ${op}`;
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

export function evalSexpr(string, extraBuiltins) {
    let env = {
        scope: {},
        builtins: {
            "+": add,
            lambda,
            quote,
            car,
            cdr,
            cond,
            list,
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
