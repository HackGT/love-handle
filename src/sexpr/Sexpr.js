const Lexer = class {
  constructor(string) {
    this.string = string;
    this.index = 0;
    this.line = 0;
    this.column = 0;
  }

  // Check if we reached the end of the file
  isEOF() {
    return this.index >= this.string.length;
  }

  // Peek at the next char
  peek() {
    return this.string[this.index];
  }

  // Read & consume the next char
  pop() {
    const char = this.string[this.index++];
    if (char == '\n') {
      this.line++;
      this.column = 0;
    } else {
      this.column++;
    }
    return char;
  }

  pos() {
    return { 'line': this.line, 'column': this.column };
  }
}

// Check if a char is a digit
function isDigit(char) {
  return char >= '0' && char <= '9';
}

// Check if a char is an alphabet character
function isAlpha(char) {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
}

// Lex a number
function num(lexer) {
  let num = 0;
  let digitsCount = 0;
  let negate = false;
  if (!lexer.isEOF() && lexer.peek() == '-') {
    digitsCount++;
    negate = true;
    lexer.pop();
  }
  while (!lexer.isEOF() && isDigit(lexer.peek())) {
    digitsCount++;
    num *= 10;
    num += parseInt(lexer.pop());
  }
  if (digitsCount === 0) {
    // Didn't find any digits
    return false;
  } else {
    // Found digits, so return the number
    return negate ? -num : num;
  }
}

// Lex a string
function string(lexer) {
  let contents = '';
  if (lexer.isEOF() || lexer.peek() !== '"') {
    return false;
  }
  lexer.pop();
  while (!lexer.isEOF()) {
    const char = lexer.pop();
    if (char === '"')
      return contents;
    else contents += char;
  }
  return false;
}

// Lex an open paren
function openParen(lexer) {
  if (!lexer.isEOF() && lexer.peek() == '(') {
    lexer.pop();
    return '(';
  } else {
    return false;
  }
}

// Lex a close paren
function closeParen(lexer) {
  if (!lexer.isEOF() && lexer.peek() == ')') {
    lexer.pop();
    return ')';
  } else {
    return false;
  }
}

// Lex white space
function whiteSpace(lexer) {
  const whiteSpaceChars = [' ', '\t', '\r', '\n'];
  while (!lexer.isEOF() && whiteSpaceChars.includes(lexer.peek())) { lexer.pop(); }
  return false;
}

// Lex an identifier
function ident(lexer) {
  const validOperators = ['+', '-', '*', '/', '%', '?', '=', '&', '|', '@', '!', '~', '_'];
  if (lexer.isEOF()) {
    return false;
  }
  const firstChar = lexer.pop();
  let buffer = '';
  if (isAlpha(firstChar) || validOperators.includes(firstChar)) {
    buffer += firstChar;
  }
  while (!lexer.isEOF()) {
    const char = lexer.peek();
    if (isAlpha(char) || isDigit(char) || validOperators.includes(char)) {
      buffer += lexer.pop();
    } else {
      break;
    }
  }
  return buffer;
}

// Construct a token as the position + item
function token(pos, item) {
  return {'pos': pos, 'token': item};
}

// Lex an entire program
function lexProgram(text) {
  let buffer = [];
  let lexer = new Lexer(text);
  while (!lexer.isEOF()) {
    whiteSpace(lexer);
    let startPos = lexer.pos();

    const isOpenParen = openParen(lexer);
    if (isOpenParen) {
      buffer.push(token(startPos, isOpenParen));
      continue;
    }

    const isCloseParen = closeParen(lexer);
    if (isCloseParen) {
      buffer.push(token(startPos, isCloseParen));
      continue;
    }

    const isString = string(lexer);
    if (isString) {
      buffer.push(token(startPos, isString));
      continue;
    }

    const isNum = num(lexer);
    if (isNum) {
      buffer.push(token(startPos, isNum));
      continue;
    }

    const isIdent = ident(lexer);
    if (isIdent) {
      buffer.push(token(startPos, { 'id': isIdent }));
      continue;
    }

    // Didn't find a match, so let's throw an error
    const line = startPos['line'];
    const col = startPos['column'];
    const found = lexer.peek();
    throw `Unexpected character at line ${line}, column ${col}: '${found}'`;
  }

  return buffer;
}

class Parser {
  constructor(tokenStream) {
    this.tokenStream = tokenStream;
    this.index = 0;
  }

  // Check if we reached the end of the file
  isEOF() {
    return this.index >= this.tokenStream.length;
  }

  // Peek at the next token
  peek() {
    return this.tokenStream[this.index]['token'];
  }

  // Fetch & consume the next token
  pop() {
    return this.tokenStream[this.index++]['token'];
  }

  // Get the current position of the parser
  pos() {
    return this.tokenStream[this.index]['pos'];
  }
}

function parseExpr(parser) {
  let buffer = [];
  while (!parser.isEOF()) {
    if (parser.peek() === ')') {
      parser.pop();
      return buffer;
    } else if (parser.peek() === '(') {
      parser.pop();
      buffer.push(parseExpr(parser));
    } else {
      buffer.push(parser.pop());
    }
  }
  const line = parser.pos()['line'];
  const col = parser.pos()['column'];
  throw `Expected ')' but found end of file at line ${line}, column ${col}`;
}

function parseProgram(tokenStream) {
  let parser = new Parser(tokenStream);
  let result = null;
  if (!parser.isEOF() && parser.peek() == '(') {
    parser.pop();
    result = parseExpr(parser);
  } else if (!parser.isEOF() && parser.peek() != ')') {
    result = parser.pop();
  }

  if (!parser.isEOF()) {
    const found = parser.peek();
    const line = parser.pos()['line'];
    const col = parser.pos()['column'];
    throw `Expected end of file but found '${found}' at line ${line}, column ${col}`;
  } else {
    return result;
  }
}

export function readSexpr(string) {
  return parseProgram(lexProgram(string));
}

export function formatSexpr(sexpr) {
  if (typeof sexpr === 'number') {
    return sexpr.toString();
  } else if (typeof sexpr === 'string') { // string literal
    return '"' + sexpr + '"';
  } else if (Array.isArray(sexpr)) {
    let buffer = '(';
    buffer += sexpr.map(formatSexpr).join(' ')
    buffer += ')';
    return buffer;
  } else if (typeof sexpr === 'object') { // identifier
    return sexpr['id'];
  } else {
    throw `Unable to format sexpr: ${sexpr}`;
  }
}
