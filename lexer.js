import { EaselError } from "./stdlib";

export const TOKENS = {
    LeftParen: 'LeftParen',
    RightParen: 'RightParen',
    LeftBrace: 'LeftBrace',
    RightBrace: 'RightBrace',
    LeftBracket: 'LeftBracket',
    RightBracket: 'RightBracket',
    Period: 'Period',
    Comma: 'Comma',
    Colon: 'Colon',
    Keyword: 'Keyword',
    Identifier: 'Identifier',
    String: 'String',
    Number: 'Number',
    Or: 'Or',
    Not: 'Not',
    And: 'And',
    Equiv: 'Equiv',
    NotEquiv: 'NotEquiv',
    Gt: 'Gt',
    Gte: 'Gte',
    Lt: 'Lt',
    Lte: 'Lte',
    Plus: 'Plus',
    Minus: 'Minus',
    Asterisk: 'Asterisk',
    Slash: 'Slash',
    EOF: 'EOF'
}

export const KEYWORDS = {
    prepare: 'prepare',
    as: 'as',
    brush: 'brush',
    prep: 'prep',
    has: 'has',
    sketch: 'sketch',
    needs: 'needs',
    finished: 'finished',
    loop: 'loop',
    through: 'through',
    while: 'while',
    if: 'if',
    elif: 'elif',
    else: 'else'
}

const MAPPING = {
    '(': TOKENS.LeftParen,
    ')': TOKENS.RightParen,
    '{': TOKENS.LeftBrace,
    '}': TOKENS.RightBrace,
    '[': TOKENS.LeftBracket,
    ']': TOKENS.RightBracket,
    '.': TOKENS.Period,
    ',': TOKENS.Comma,
    ':': TOKENS.Colon,
    '+': TOKENS.Plus,
    '-': TOKENS.Minus,
    '*': TOKENS.Asterisk,
    '/': TOKENS.Slash
}

export class Token {
    constructor(type, value, content, line, column) {
        this.type = type;
        this.value = value;
        this.content = content;
        this.line = line;
        this.column = column;
    }

    toString() {
        return this.value;
    }
}

export class Lexer {
    constructor(program) {
        this.program = program;
        this.tokens = [];
        this.current = 0;
        this.line = 1;
        this.column = 0;
    }

    error(msg) {
        throw new EaselError(`Error on ${this.line}:${this.column}: ${msg}`)
    }

    peek() {
        if (this.current >= this.program.length) return '\0';
        return this.program[this.current];
    }

    advance() {
        if (this.current >= this.program.length) return '\0';
        this.column++;
        return this.program[this.current++];
    }

    match(char) {
        if (this.peek() === char) return this.advance();
        return false;
    }

    scanToken() {
        const isNumber = char => char >= '0' && char <= '9';

        const char = this.advance()

        if ('(){}[].,:+-*/'.includes(char)) {
            return this.tokens.push(
                new Token(MAPPING[char], char, char, this.line, this.column)
            );
        } else if (("'" + '"').includes(char)) {
            let string = [];
            while (this.peek() !== char) {
                string.push(this.advance());
                if (this.peek === '\0')
                    this.error('Unexpected end of file; expected a closing quote')
            }
            this.advance();
            string = string.join('')
            return this.tokens.push(
                new Token(TOKENS.String, string, string, this.line, this.column)
            );
        } else if (char === '|' && this.match('|')) {
            return this.tokens.push(
                new Token(TOKENS.Or, '||', '||', this.line, this.column)
            );
        } else if (char === '>') {
            if (this.match('='))
                return this.tokens.push(
                    new Token(TOKENS.Gte, '>=', '>=', this.line, this.column)
                );
            return this.tokens.push(
                new Token(TOKENS.Gt, '>', '>', this.line, this.column)
            );
        } else if (char === '<') {
            if (this.match('='))
                return this.tokens.push(
                    new Token(TOKENS.Lte, '<=', '<=', this.line, this.column)
                );
            return this.tokens.push(
                new Token(TOKENS.Lt, '<', '<', this.line, this.column)
            );
        } else if (char === '=' && this.match('=')) {
            return this.tokens.push(
                new Token(TOKENS.Equiv, '==', '==', this.line, this.column)
            );
        } else if (char === '&' && this.match('&')) {
            return this.tokens.push(
                new Token(TOKENS.And, '&&', '&&', this.line, this.column)
            );
        } else if (char === '!') {
            if (this.match('='))
                return this.tokens.push(
                    new Token(TOKENS.NotEquiv, '!=', '!=', this.line, this.column)
                );
            return this.tokens.push(
                new Token(TOKENS.Not, '!', '!', this.line, this.column)
            );
        } else {
            if (isNumber(char)) {
                let number = [char]
                while (isNumber(this.peek()) || (this.peek() === '.' && !number.includes('.')))
                    number.push(this.advance());
                number = number.join('')
                return this.tokens.push(
                    new Token(TOKENS.Number, number, Number(number), this.line, this.column)
                )
            }
        }
    }

    scanTokens() {
        while (this.peek() !== '\0') this.scanToken();
        this.tokens.push(new Token(TOKENS.EOF, null, null, this.line, this.column));
        return this.tokens;
    }
}