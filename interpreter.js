import Ast from './ast.js';
import { EaselError } from 'stdlib.js';

export class Interpreter {
    error (msg) {
        throw new EaselError(`Runtime error: ${msg}`);
    }

    evaluate(value, scope) {

    }

    execute(node, scope) {
        switch(node.constructor) {
            case Ast.Var:
            case Ast.Set:
            case Ast.Struct:
            case Ast.Func:
            case Ast.Return:
            case Ast.While:
            case Ast.For:
            case Ast.Conditional:
            default:
                this.evaluate(node, scope);
        }
        
        return scope;
    }

    run(ast, scope) {

    }

    inScope(scope, name) {
        Object.keys(scope).includes(name);
    }
}