// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/chess.js/chess.js":[function(require,module,exports) {
var define;
/*
 * Copyright (c) 2020, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

var Chess = function(fen) {
  var BLACK = 'b'
  var WHITE = 'w'

  var EMPTY = -1

  var PAWN = 'p'
  var KNIGHT = 'n'
  var BISHOP = 'b'
  var ROOK = 'r'
  var QUEEN = 'q'
  var KING = 'k'

  var SYMBOLS = 'pnbrqkPNBRQK'

  var DEFAULT_POSITION =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

  var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*']

  var PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15]
  }

  var PIECE_OFFSETS = {
    n: [-18, -33, -31, -14, 18, 33, 31, 14],
    b: [-17, -15, 17, 15],
    r: [-16, 1, 16, -1],
    q: [-17, -16, -15, 1, 17, 16, 15, -1],
    k: [-17, -16, -15, 1, 17, 16, 15, -1]
  }

  // prettier-ignore
  var ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
  ];

  // prettier-ignore
  var RAYS = [
     17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
      0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
      0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
      0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
      0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
      1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
      0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
      0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
      0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
      0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
    -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
  ];

  var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 }

  var FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q'
  }

  var BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64
  }

  var RANK_1 = 7
  var RANK_2 = 6
  var RANK_3 = 5
  var RANK_4 = 4
  var RANK_5 = 3
  var RANK_6 = 2
  var RANK_7 = 1
  var RANK_8 = 0

  // prettier-ignore
  var SQUARES = {
    a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
    a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
    a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
    a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
    a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
    a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
    a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
  };

  var ROOKS = {
    w: [
      { square: SQUARES.a1, flag: BITS.QSIDE_CASTLE },
      { square: SQUARES.h1, flag: BITS.KSIDE_CASTLE }
    ],
    b: [
      { square: SQUARES.a8, flag: BITS.QSIDE_CASTLE },
      { square: SQUARES.h8, flag: BITS.KSIDE_CASTLE }
    ]
  }

  var board = new Array(128)
  var kings = { w: EMPTY, b: EMPTY }
  var turn = WHITE
  var castling = { w: 0, b: 0 }
  var ep_square = EMPTY
  var half_moves = 0
  var move_number = 1
  var history = []
  var header = {}
  var comments = {}

  /* if the user passes in a fen string, load it, else default to
   * starting position
   */
  if (typeof fen === 'undefined') {
    load(DEFAULT_POSITION)
  } else {
    load(fen)
  }

  function clear(keep_headers) {
    if (typeof keep_headers === 'undefined') {
      keep_headers = false
    }

    board = new Array(128)
    kings = { w: EMPTY, b: EMPTY }
    turn = WHITE
    castling = { w: 0, b: 0 }
    ep_square = EMPTY
    half_moves = 0
    move_number = 1
    history = []
    if (!keep_headers) header = {}
    comments = {}
    update_setup(generate_fen())
  }

  function prune_comments() {
    var reversed_history = [];
    var current_comments = {};
    var copy_comment = function(fen) {
      if (fen in comments) {
        current_comments[fen] = comments[fen];
      }
    };
    while (history.length > 0) {
      reversed_history.push(undo_move());
    }
    copy_comment(generate_fen());
    while (reversed_history.length > 0) {
      make_move(reversed_history.pop());
      copy_comment(generate_fen());
    }
    comments = current_comments;
  }

  function reset() {
    load(DEFAULT_POSITION)
  }

  function load(fen, keep_headers) {
    if (typeof keep_headers === 'undefined') {
      keep_headers = false
    }

    var tokens = fen.split(/\s+/)
    var position = tokens[0]
    var square = 0

    if (!validate_fen(fen).valid) {
      return false
    }

    clear(keep_headers)

    for (var i = 0; i < position.length; i++) {
      var piece = position.charAt(i)

      if (piece === '/') {
        square += 8
      } else if (is_digit(piece)) {
        square += parseInt(piece, 10)
      } else {
        var color = piece < 'a' ? WHITE : BLACK
        put({ type: piece.toLowerCase(), color: color }, algebraic(square))
        square++
      }
    }

    turn = tokens[1]

    if (tokens[2].indexOf('K') > -1) {
      castling.w |= BITS.KSIDE_CASTLE
    }
    if (tokens[2].indexOf('Q') > -1) {
      castling.w |= BITS.QSIDE_CASTLE
    }
    if (tokens[2].indexOf('k') > -1) {
      castling.b |= BITS.KSIDE_CASTLE
    }
    if (tokens[2].indexOf('q') > -1) {
      castling.b |= BITS.QSIDE_CASTLE
    }

    ep_square = tokens[3] === '-' ? EMPTY : SQUARES[tokens[3]]
    half_moves = parseInt(tokens[4], 10)
    move_number = parseInt(tokens[5], 10)

    update_setup(generate_fen())

    return true
  }

  /* TODO: this function is pretty much crap - it validates structure but
   * completely ignores content (e.g. doesn't verify that each side has a king)
   * ... we should rewrite this, and ditch the silly error_number field while
   * we're at it
   */
  function validate_fen(fen) {
    var errors = {
      0: 'No errors.',
      1: 'FEN string must contain six space-delimited fields.',
      2: '6th field (move number) must be a positive integer.',
      3: '5th field (half move counter) must be a non-negative integer.',
      4: '4th field (en-passant square) is invalid.',
      5: '3rd field (castling availability) is invalid.',
      6: '2nd field (side to move) is invalid.',
      7: "1st field (piece positions) does not contain 8 '/'-delimited rows.",
      8: '1st field (piece positions) is invalid [consecutive numbers].',
      9: '1st field (piece positions) is invalid [invalid piece].',
      10: '1st field (piece positions) is invalid [row too large].',
      11: 'Illegal en-passant square'
    }

    /* 1st criterion: 6 space-seperated fields? */
    var tokens = fen.split(/\s+/)
    if (tokens.length !== 6) {
      return { valid: false, error_number: 1, error: errors[1] }
    }

    /* 2nd criterion: move number field is a integer value > 0? */
    if (isNaN(tokens[5]) || parseInt(tokens[5], 10) <= 0) {
      return { valid: false, error_number: 2, error: errors[2] }
    }

    /* 3rd criterion: half move counter is an integer >= 0? */
    if (isNaN(tokens[4]) || parseInt(tokens[4], 10) < 0) {
      return { valid: false, error_number: 3, error: errors[3] }
    }

    /* 4th criterion: 4th field is a valid e.p.-string? */
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
      return { valid: false, error_number: 4, error: errors[4] }
    }

    /* 5th criterion: 3th field is a valid castle-string? */
    if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
      return { valid: false, error_number: 5, error: errors[5] }
    }

    /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */
    if (!/^(w|b)$/.test(tokens[1])) {
      return { valid: false, error_number: 6, error: errors[6] }
    }

    /* 7th criterion: 1st field contains 8 rows? */
    var rows = tokens[0].split('/')
    if (rows.length !== 8) {
      return { valid: false, error_number: 7, error: errors[7] }
    }

    /* 8th criterion: every row is valid? */
    for (var i = 0; i < rows.length; i++) {
      /* check for right sum of fields AND not two numbers in succession */
      var sum_fields = 0
      var previous_was_number = false

      for (var k = 0; k < rows[i].length; k++) {
        if (!isNaN(rows[i][k])) {
          if (previous_was_number) {
            return { valid: false, error_number: 8, error: errors[8] }
          }
          sum_fields += parseInt(rows[i][k], 10)
          previous_was_number = true
        } else {
          if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
            return { valid: false, error_number: 9, error: errors[9] }
          }
          sum_fields += 1
          previous_was_number = false
        }
      }
      if (sum_fields !== 8) {
        return { valid: false, error_number: 10, error: errors[10] }
      }
    }

    if (
      (tokens[3][1] == '3' && tokens[1] == 'w') ||
      (tokens[3][1] == '6' && tokens[1] == 'b')
    ) {
      return { valid: false, error_number: 11, error: errors[11] }
    }

    /* everything's okay! */
    return { valid: true, error_number: 0, error: errors[0] }
  }

  function generate_fen() {
    var empty = 0
    var fen = ''

    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (board[i] == null) {
        empty++
      } else {
        if (empty > 0) {
          fen += empty
          empty = 0
        }
        var color = board[i].color
        var piece = board[i].type

        fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase()
      }

      if ((i + 1) & 0x88) {
        if (empty > 0) {
          fen += empty
        }

        if (i !== SQUARES.h1) {
          fen += '/'
        }

        empty = 0
        i += 8
      }
    }

    var cflags = ''
    if (castling[WHITE] & BITS.KSIDE_CASTLE) {
      cflags += 'K'
    }
    if (castling[WHITE] & BITS.QSIDE_CASTLE) {
      cflags += 'Q'
    }
    if (castling[BLACK] & BITS.KSIDE_CASTLE) {
      cflags += 'k'
    }
    if (castling[BLACK] & BITS.QSIDE_CASTLE) {
      cflags += 'q'
    }

    /* do we have an empty castling flag? */
    cflags = cflags || '-'
    var epflags = ep_square === EMPTY ? '-' : algebraic(ep_square)

    return [fen, turn, cflags, epflags, half_moves, move_number].join(' ')
  }

  function set_header(args) {
    for (var i = 0; i < args.length; i += 2) {
      if (typeof args[i] === 'string' && typeof args[i + 1] === 'string') {
        header[args[i]] = args[i + 1]
      }
    }
    return header
  }

  /* called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object.  if the FEN is
   * equal to the default position, the SetUp and FEN are deleted
   * the setup is only updated if history.length is zero, ie moves haven't been
   * made.
   */
  function update_setup(fen) {
    if (history.length > 0) return

    if (fen !== DEFAULT_POSITION) {
      header['SetUp'] = '1'
      header['FEN'] = fen
    } else {
      delete header['SetUp']
      delete header['FEN']
    }
  }

  function get(square) {
    var piece = board[SQUARES[square]]
    return piece ? { type: piece.type, color: piece.color } : null
  }

  function put(piece, square) {
    /* check for valid piece object */
    if (!('type' in piece && 'color' in piece)) {
      return false
    }

    /* check for piece */
    if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
      return false
    }

    /* check for valid square */
    if (!(square in SQUARES)) {
      return false
    }

    var sq = SQUARES[square]

    /* don't let the user place more than one king */
    if (
      piece.type == KING &&
      !(kings[piece.color] == EMPTY || kings[piece.color] == sq)
    ) {
      return false
    }

    board[sq] = { type: piece.type, color: piece.color }
    if (piece.type === KING) {
      kings[piece.color] = sq
    }

    update_setup(generate_fen())

    return true
  }

  function remove(square) {
    var piece = get(square)
    board[SQUARES[square]] = null
    if (piece && piece.type === KING) {
      kings[piece.color] = EMPTY
    }

    update_setup(generate_fen())

    return piece
  }

  function build_move(board, from, to, flags, promotion) {
    var move = {
      color: turn,
      from: from,
      to: to,
      flags: flags,
      piece: board[from].type
    }

    if (promotion) {
      move.flags |= BITS.PROMOTION
      move.promotion = promotion
    }

    if (board[to]) {
      move.captured = board[to].type
    } else if (flags & BITS.EP_CAPTURE) {
      move.captured = PAWN
    }
    return move
  }

  function generate_moves(options) {
    function add_move(board, moves, from, to, flags) {
      /* if pawn promotion */
      if (
        board[from].type === PAWN &&
        (rank(to) === RANK_8 || rank(to) === RANK_1)
      ) {
        var pieces = [QUEEN, ROOK, BISHOP, KNIGHT]
        for (var i = 0, len = pieces.length; i < len; i++) {
          moves.push(build_move(board, from, to, flags, pieces[i]))
        }
      } else {
        moves.push(build_move(board, from, to, flags))
      }
    }

    var moves = []
    var us = turn
    var them = swap_color(us)
    var second_rank = { b: RANK_7, w: RANK_2 }

    var first_sq = SQUARES.a8
    var last_sq = SQUARES.h1
    var single_square = false

    /* do we want legal moves? */
    var legal =
      typeof options !== 'undefined' && 'legal' in options
        ? options.legal
        : true

    /* are we generating moves for a single square? */
    if (typeof options !== 'undefined' && 'square' in options) {
      if (options.square in SQUARES) {
        first_sq = last_sq = SQUARES[options.square]
        single_square = true
      } else {
        /* invalid square */
        return []
      }
    }

    for (var i = first_sq; i <= last_sq; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) {
        i += 7
        continue
      }

      var piece = board[i]
      if (piece == null || piece.color !== us) {
        continue
      }

      if (piece.type === PAWN) {
        /* single square, non-capturing */
        var square = i + PAWN_OFFSETS[us][0]
        if (board[square] == null) {
          add_move(board, moves, i, square, BITS.NORMAL)

          /* double square */
          var square = i + PAWN_OFFSETS[us][1]
          if (second_rank[us] === rank(i) && board[square] == null) {
            add_move(board, moves, i, square, BITS.BIG_PAWN)
          }
        }

        /* pawn captures */
        for (j = 2; j < 4; j++) {
          var square = i + PAWN_OFFSETS[us][j]
          if (square & 0x88) continue

          if (board[square] != null && board[square].color === them) {
            add_move(board, moves, i, square, BITS.CAPTURE)
          } else if (square === ep_square) {
            add_move(board, moves, i, ep_square, BITS.EP_CAPTURE)
          }
        }
      } else {
        for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
          var offset = PIECE_OFFSETS[piece.type][j]
          var square = i

          while (true) {
            square += offset
            if (square & 0x88) break

            if (board[square] == null) {
              add_move(board, moves, i, square, BITS.NORMAL)
            } else {
              if (board[square].color === us) break
              add_move(board, moves, i, square, BITS.CAPTURE)
              break
            }

            /* break, if knight or king */
            if (piece.type === 'n' || piece.type === 'k') break
          }
        }
      }
    }

    /* check for castling if: a) we're generating all moves, or b) we're doing
     * single square move generation on the king's square
     */
    if (!single_square || last_sq === kings[us]) {
      /* king-side castling */
      if (castling[us] & BITS.KSIDE_CASTLE) {
        var castling_from = kings[us]
        var castling_to = castling_from + 2

        if (
          board[castling_from + 1] == null &&
          board[castling_to] == null &&
          !attacked(them, kings[us]) &&
          !attacked(them, castling_from + 1) &&
          !attacked(them, castling_to)
        ) {
          add_move(board, moves, kings[us], castling_to, BITS.KSIDE_CASTLE)
        }
      }

      /* queen-side castling */
      if (castling[us] & BITS.QSIDE_CASTLE) {
        var castling_from = kings[us]
        var castling_to = castling_from - 2

        if (
          board[castling_from - 1] == null &&
          board[castling_from - 2] == null &&
          board[castling_from - 3] == null &&
          !attacked(them, kings[us]) &&
          !attacked(them, castling_from - 1) &&
          !attacked(them, castling_to)
        ) {
          add_move(board, moves, kings[us], castling_to, BITS.QSIDE_CASTLE)
        }
      }
    }

    /* return all pseudo-legal moves (this includes moves that allow the king
     * to be captured)
     */
    if (!legal) {
      return moves
    }

    /* filter out illegal moves */
    var legal_moves = []
    for (var i = 0, len = moves.length; i < len; i++) {
      make_move(moves[i])
      if (!king_attacked(us)) {
        legal_moves.push(moves[i])
      }
      undo_move()
    }

    return legal_moves
  }

  /* convert a move from 0x88 coordinates to Standard Algebraic Notation
   * (SAN)
   *
   * @param {boolean} sloppy Use the sloppy SAN generator to work around over
   * disambiguation bugs in Fritz and Chessbase.  See below:
   *
   * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
   * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
   * 4. ... Ne7 is technically the valid SAN
   */
  function move_to_san(move, sloppy) {
    var output = ''

    if (move.flags & BITS.KSIDE_CASTLE) {
      output = 'O-O'
    } else if (move.flags & BITS.QSIDE_CASTLE) {
      output = 'O-O-O'
    } else {
      var disambiguator = get_disambiguator(move, sloppy)

      if (move.piece !== PAWN) {
        output += move.piece.toUpperCase() + disambiguator
      }

      if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
        if (move.piece === PAWN) {
          output += algebraic(move.from)[0]
        }
        output += 'x'
      }

      output += algebraic(move.to)

      if (move.flags & BITS.PROMOTION) {
        output += '=' + move.promotion.toUpperCase()
      }
    }

    make_move(move)
    if (in_check()) {
      if (in_checkmate()) {
        output += '#'
      } else {
        output += '+'
      }
    }
    undo_move()

    return output
  }

  // parses all of the decorators out of a SAN string
  function stripped_san(move) {
    return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '')
  }

  function attacked(color, square) {
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) {
        i += 7
        continue
      }

      /* if empty square or wrong color */
      if (board[i] == null || board[i].color !== color) continue

      var piece = board[i]
      var difference = i - square
      var index = difference + 119

      if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
        if (piece.type === PAWN) {
          if (difference > 0) {
            if (piece.color === WHITE) return true
          } else {
            if (piece.color === BLACK) return true
          }
          continue
        }

        /* if the piece is a knight or a king */
        if (piece.type === 'n' || piece.type === 'k') return true

        var offset = RAYS[index]
        var j = i + offset

        var blocked = false
        while (j !== square) {
          if (board[j] != null) {
            blocked = true
            break
          }
          j += offset
        }

        if (!blocked) return true
      }
    }

    return false
  }

  function king_attacked(color) {
    return attacked(swap_color(color), kings[color])
  }

  function in_check() {
    return king_attacked(turn)
  }

  function in_checkmate() {
    return in_check() && generate_moves().length === 0
  }

  function in_stalemate() {
    return !in_check() && generate_moves().length === 0
  }

  function insufficient_material() {
    var pieces = {}
    var bishops = []
    var num_pieces = 0
    var sq_color = 0

    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      sq_color = (sq_color + 1) % 2
      if (i & 0x88) {
        i += 7
        continue
      }

      var piece = board[i]
      if (piece) {
        pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1
        if (piece.type === BISHOP) {
          bishops.push(sq_color)
        }
        num_pieces++
      }
    }

    /* k vs. k */
    if (num_pieces === 2) {
      return true
    } else if (
      /* k vs. kn .... or .... k vs. kb */
      num_pieces === 3 &&
      (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)
    ) {
      return true
    } else if (num_pieces === pieces[BISHOP] + 2) {
      /* kb vs. kb where any number of bishops are all on the same color */
      var sum = 0
      var len = bishops.length
      for (var i = 0; i < len; i++) {
        sum += bishops[i]
      }
      if (sum === 0 || sum === len) {
        return true
      }
    }

    return false
  }

  function in_threefold_repetition() {
    /* TODO: while this function is fine for casual use, a better
     * implementation would use a Zobrist key (instead of FEN). the
     * Zobrist key would be maintained in the make_move/undo_move functions,
     * avoiding the costly that we do below.
     */
    var moves = []
    var positions = {}
    var repetition = false

    while (true) {
      var move = undo_move()
      if (!move) break
      moves.push(move)
    }

    while (true) {
      /* remove the last two fields in the FEN string, they're not needed
       * when checking for draw by rep */
      var fen = generate_fen()
        .split(' ')
        .slice(0, 4)
        .join(' ')

      /* has the position occurred three or move times */
      positions[fen] = fen in positions ? positions[fen] + 1 : 1
      if (positions[fen] >= 3) {
        repetition = true
      }

      if (!moves.length) {
        break
      }
      make_move(moves.pop())
    }

    return repetition
  }

  function push(move) {
    history.push({
      move: move,
      kings: { b: kings.b, w: kings.w },
      turn: turn,
      castling: { b: castling.b, w: castling.w },
      ep_square: ep_square,
      half_moves: half_moves,
      move_number: move_number
    })
  }

  function make_move(move) {
    var us = turn
    var them = swap_color(us)
    push(move)

    board[move.to] = board[move.from]
    board[move.from] = null

    /* if ep capture, remove the captured pawn */
    if (move.flags & BITS.EP_CAPTURE) {
      if (turn === BLACK) {
        board[move.to - 16] = null
      } else {
        board[move.to + 16] = null
      }
    }

    /* if pawn promotion, replace with new piece */
    if (move.flags & BITS.PROMOTION) {
      board[move.to] = { type: move.promotion, color: us }
    }

    /* if we moved the king */
    if (board[move.to].type === KING) {
      kings[board[move.to].color] = move.to

      /* if we castled, move the rook next to the king */
      if (move.flags & BITS.KSIDE_CASTLE) {
        var castling_to = move.to - 1
        var castling_from = move.to + 1
        board[castling_to] = board[castling_from]
        board[castling_from] = null
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        var castling_to = move.to + 1
        var castling_from = move.to - 2
        board[castling_to] = board[castling_from]
        board[castling_from] = null
      }

      /* turn off castling */
      castling[us] = ''
    }

    /* turn off castling if we move a rook */
    if (castling[us]) {
      for (var i = 0, len = ROOKS[us].length; i < len; i++) {
        if (
          move.from === ROOKS[us][i].square &&
          castling[us] & ROOKS[us][i].flag
        ) {
          castling[us] ^= ROOKS[us][i].flag
          break
        }
      }
    }

    /* turn off castling if we capture a rook */
    if (castling[them]) {
      for (var i = 0, len = ROOKS[them].length; i < len; i++) {
        if (
          move.to === ROOKS[them][i].square &&
          castling[them] & ROOKS[them][i].flag
        ) {
          castling[them] ^= ROOKS[them][i].flag
          break
        }
      }
    }

    /* if big pawn move, update the en passant square */
    if (move.flags & BITS.BIG_PAWN) {
      if (turn === 'b') {
        ep_square = move.to - 16
      } else {
        ep_square = move.to + 16
      }
    } else {
      ep_square = EMPTY
    }

    /* reset the 50 move counter if a pawn is moved or a piece is captured */
    if (move.piece === PAWN) {
      half_moves = 0
    } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
      half_moves = 0
    } else {
      half_moves++
    }

    if (turn === BLACK) {
      move_number++
    }
    turn = swap_color(turn)
  }

  function undo_move() {
    var old = history.pop()
    if (old == null) {
      return null
    }

    var move = old.move
    kings = old.kings
    turn = old.turn
    castling = old.castling
    ep_square = old.ep_square
    half_moves = old.half_moves
    move_number = old.move_number

    var us = turn
    var them = swap_color(turn)

    board[move.from] = board[move.to]
    board[move.from].type = move.piece // to undo any promotions
    board[move.to] = null

    if (move.flags & BITS.CAPTURE) {
      board[move.to] = { type: move.captured, color: them }
    } else if (move.flags & BITS.EP_CAPTURE) {
      var index
      if (us === BLACK) {
        index = move.to - 16
      } else {
        index = move.to + 16
      }
      board[index] = { type: PAWN, color: them }
    }

    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
      var castling_to, castling_from
      if (move.flags & BITS.KSIDE_CASTLE) {
        castling_to = move.to + 1
        castling_from = move.to - 1
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        castling_to = move.to - 2
        castling_from = move.to + 1
      }

      board[castling_to] = board[castling_from]
      board[castling_from] = null
    }

    return move
  }

  /* this function is used to uniquely identify ambiguous moves */
  function get_disambiguator(move, sloppy) {
    var moves = generate_moves({ legal: !sloppy })

    var from = move.from
    var to = move.to
    var piece = move.piece

    var ambiguities = 0
    var same_rank = 0
    var same_file = 0

    for (var i = 0, len = moves.length; i < len; i++) {
      var ambig_from = moves[i].from
      var ambig_to = moves[i].to
      var ambig_piece = moves[i].piece

      /* if a move of the same piece type ends on the same to square, we'll
       * need to add a disambiguator to the algebraic notation
       */
      if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
        ambiguities++

        if (rank(from) === rank(ambig_from)) {
          same_rank++
        }

        if (file(from) === file(ambig_from)) {
          same_file++
        }
      }
    }

    if (ambiguities > 0) {
      /* if there exists a similar moving piece on the same rank and file as
       * the move in question, use the square as the disambiguator
       */
      if (same_rank > 0 && same_file > 0) {
        return algebraic(from)
      } else if (same_file > 0) {
        /* if the moving piece rests on the same file, use the rank symbol as the
         * disambiguator
         */
        return algebraic(from).charAt(1)
      } else {
        /* else use the file symbol */
        return algebraic(from).charAt(0)
      }
    }

    return ''
  }

  function ascii() {
    var s = '   +------------------------+\n'
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* display the rank */
      if (file(i) === 0) {
        s += ' ' + '87654321'[rank(i)] + ' |'
      }

      /* empty piece */
      if (board[i] == null) {
        s += ' . '
      } else {
        var piece = board[i].type
        var color = board[i].color
        var symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase()
        s += ' ' + symbol + ' '
      }

      if ((i + 1) & 0x88) {
        s += '|\n'
        i += 8
      }
    }
    s += '   +------------------------+\n'
    s += '     a  b  c  d  e  f  g  h\n'

    return s
  }

  // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
  function move_from_san(move, sloppy) {
    // strip off any move decorations: e.g Nf3+?!
    var clean_move = stripped_san(move)

    // if we're using the sloppy parser run a regex to grab piece, to, and from
    // this should parse invalid SAN like: Pe2-e4, Rc1c4, Qf3xf7
    if (sloppy) {
      var matches = clean_move.match(
        /([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/
      )
      if (matches) {
        var piece = matches[1]
        var from = matches[2]
        var to = matches[3]
        var promotion = matches[4]
      }
    }

    var moves = generate_moves()
    for (var i = 0, len = moves.length; i < len; i++) {
      // try the strict parser first, then the sloppy parser if requested
      // by the user
      if (
        clean_move === stripped_san(move_to_san(moves[i])) ||
        (sloppy && clean_move === stripped_san(move_to_san(moves[i], true)))
      ) {
        return moves[i]
      } else {
        if (
          matches &&
          (!piece || piece.toLowerCase() == moves[i].piece) &&
          SQUARES[from] == moves[i].from &&
          SQUARES[to] == moves[i].to &&
          (!promotion || promotion.toLowerCase() == moves[i].promotion)
        ) {
          return moves[i]
        }
      }
    }

    return null
  }

  /*****************************************************************************
   * UTILITY FUNCTIONS
   ****************************************************************************/
  function rank(i) {
    return i >> 4
  }

  function file(i) {
    return i & 15
  }

  function algebraic(i) {
    var f = file(i),
      r = rank(i)
    return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1)
  }

  function swap_color(c) {
    return c === WHITE ? BLACK : WHITE
  }

  function is_digit(c) {
    return '0123456789'.indexOf(c) !== -1
  }

  /* pretty = external move object */
  function make_pretty(ugly_move) {
    var move = clone(ugly_move)
    move.san = move_to_san(move, false)
    move.to = algebraic(move.to)
    move.from = algebraic(move.from)

    var flags = ''

    for (var flag in BITS) {
      if (BITS[flag] & move.flags) {
        flags += FLAGS[flag]
      }
    }
    move.flags = flags

    return move
  }

  function clone(obj) {
    var dupe = obj instanceof Array ? [] : {}

    for (var property in obj) {
      if (typeof property === 'object') {
        dupe[property] = clone(obj[property])
      } else {
        dupe[property] = obj[property]
      }
    }

    return dupe
  }

  function trim(str) {
    return str.replace(/^\s+|\s+$/g, '')
  }

  /*****************************************************************************
   * DEBUGGING UTILITIES
   ****************************************************************************/
  function perft(depth) {
    var moves = generate_moves({ legal: false })
    var nodes = 0
    var color = turn

    for (var i = 0, len = moves.length; i < len; i++) {
      make_move(moves[i])
      if (!king_attacked(color)) {
        if (depth - 1 > 0) {
          var child_nodes = perft(depth - 1)
          nodes += child_nodes
        } else {
          nodes++
        }
      }
      undo_move()
    }

    return nodes
  }

  return {
    /***************************************************************************
     * PUBLIC CONSTANTS (is there a better way to do this?)
     **************************************************************************/
    WHITE: WHITE,
    BLACK: BLACK,
    PAWN: PAWN,
    KNIGHT: KNIGHT,
    BISHOP: BISHOP,
    ROOK: ROOK,
    QUEEN: QUEEN,
    KING: KING,
    SQUARES: (function() {
      /* from the ECMA-262 spec (section 12.6.4):
       * "The mechanics of enumerating the properties ... is
       * implementation dependent"
       * so: for (var sq in SQUARES) { keys.push(sq); } might not be
       * ordered correctly
       */
      var keys = []
      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        if (i & 0x88) {
          i += 7
          continue
        }
        keys.push(algebraic(i))
      }
      return keys
    })(),
    FLAGS: FLAGS,

    /***************************************************************************
     * PUBLIC API
     **************************************************************************/
    load: function(fen) {
      return load(fen)
    },

    reset: function() {
      return reset()
    },

    moves: function(options) {
      /* The internal representation of a chess move is in 0x88 format, and
       * not meant to be human-readable.  The code below converts the 0x88
       * square coordinates to algebraic coordinates.  It also prunes an
       * unnecessary move keys resulting from a verbose call.
       */

      var ugly_moves = generate_moves(options)
      var moves = []

      for (var i = 0, len = ugly_moves.length; i < len; i++) {
        /* does the user want a full move object (most likely not), or just
         * SAN
         */
        if (
          typeof options !== 'undefined' &&
          'verbose' in options &&
          options.verbose
        ) {
          moves.push(make_pretty(ugly_moves[i]))
        } else {
          moves.push(move_to_san(ugly_moves[i], false))
        }
      }

      return moves
    },

    in_check: function() {
      return in_check()
    },

    in_checkmate: function() {
      return in_checkmate()
    },

    in_stalemate: function() {
      return in_stalemate()
    },

    in_draw: function() {
      return (
        half_moves >= 100 ||
        in_stalemate() ||
        insufficient_material() ||
        in_threefold_repetition()
      )
    },

    insufficient_material: function() {
      return insufficient_material()
    },

    in_threefold_repetition: function() {
      return in_threefold_repetition()
    },

    game_over: function() {
      return (
        half_moves >= 100 ||
        in_checkmate() ||
        in_stalemate() ||
        insufficient_material() ||
        in_threefold_repetition()
      )
    },

    validate_fen: function(fen) {
      return validate_fen(fen)
    },

    fen: function() {
      return generate_fen()
    },

    board: function() {
      var output = [],
        row = []

      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        if (board[i] == null) {
          row.push(null)
        } else {
          row.push({ type: board[i].type, color: board[i].color })
        }
        if ((i + 1) & 0x88) {
          output.push(row)
          row = []
          i += 8
        }
      }

      return output
    },

    pgn: function(options) {
      /* using the specification from http://www.chessclub.com/help/PGN-spec
       * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
       */
      var newline =
        typeof options === 'object' && typeof options.newline_char === 'string'
          ? options.newline_char
          : '\n'
      var max_width =
        typeof options === 'object' && typeof options.max_width === 'number'
          ? options.max_width
          : 0
      var result = []
      var header_exists = false

      /* add the PGN header headerrmation */
      for (var i in header) {
        /* TODO: order of enumerated properties in header object is not
         * guaranteed, see ECMA-262 spec (section 12.6.4)
         */
        result.push('[' + i + ' "' + header[i] + '"]' + newline)
        header_exists = true
      }

      if (header_exists && history.length) {
        result.push(newline)
      }

      var append_comment = function(move_string) {
        var comment = comments[generate_fen()]
        if (typeof comment !== 'undefined') {
          var delimiter = move_string.length > 0 ? ' ' : '';
          move_string = `${move_string}${delimiter}{${comment}}`
        }
        return move_string
      }

      /* pop all of history onto reversed_history */
      var reversed_history = []
      while (history.length > 0) {
        reversed_history.push(undo_move())
      }

      var moves = []
      var move_string = ''

      /* special case of a commented starting position with no moves */
      if (reversed_history.length === 0) {
        moves.push(append_comment(''))
      }

      /* build the list of moves.  a move_string looks like: "3. e3 e6" */
      while (reversed_history.length > 0) {
        move_string = append_comment(move_string)
        var move = reversed_history.pop()

        /* if the position started with black to move, start PGN with 1. ... */
        if (!history.length && move.color === 'b') {
          move_string = move_number + '. ...'
        } else if (move.color === 'w') {
          /* store the previous generated move_string if we have one */
          if (move_string.length) {
            moves.push(move_string)
          }
          move_string = move_number + '.'
        }

        move_string = move_string + ' ' + move_to_san(move, false)
        make_move(move)
      }

      /* are there any other leftover moves? */
      if (move_string.length) {
        moves.push(append_comment(move_string))
      }

      /* is there a result? */
      if (typeof header.Result !== 'undefined') {
        moves.push(header.Result)
      }

      /* history should be back to what it was before we started generating PGN,
       * so join together moves
       */
      if (max_width === 0) {
        return result.join('') + moves.join(' ')
      }

      var strip = function() {
        if (result.length > 0 && result[result.length - 1] === ' ') {
          result.pop();
          return true;
        }
        return false;
      };

      /* NB: this does not preserve comment whitespace. */
      var wrap_comment = function(width, move) {
        for (var token of move.split(' ')) {
          if (!token) {
            continue;
          }
          if (width + token.length > max_width) {
            while (strip()) {
              width--;
            }
            result.push(newline);
            width = 0;
          }
          result.push(token);
          width += token.length;
          result.push(' ');
          width++;
        }
        if (strip()) {
          width--;
        }
        return width;
      };

      /* wrap the PGN output at max_width */
      var current_width = 0
      for (var i = 0; i < moves.length; i++) {
        if (current_width + moves[i].length > max_width) {
          if (moves[i].includes('{')) {
            current_width = wrap_comment(current_width, moves[i]);
            continue;
          }
        }
        /* if the current move will push past max_width */
        if (current_width + moves[i].length > max_width && i !== 0) {
          /* don't end the line with whitespace */
          if (result[result.length - 1] === ' ') {
            result.pop()
          }

          result.push(newline)
          current_width = 0
        } else if (i !== 0) {
          result.push(' ')
          current_width++
        }
        result.push(moves[i])
        current_width += moves[i].length
      }

      return result.join('')
    },

    load_pgn: function(pgn, options) {
      // allow the user to specify the sloppy move parser to work around over
      // disambiguation bugs in Fritz and Chessbase
      var sloppy =
        typeof options !== 'undefined' && 'sloppy' in options
          ? options.sloppy
          : false

      function mask(str) {
        return str.replace(/\\/g, '\\')
      }

      function has_keys(object) {
        for (var key in object) {
          return true
        }
        return false
      }

      function parse_pgn_header(header, options) {
        var newline_char =
          typeof options === 'object' &&
          typeof options.newline_char === 'string'
            ? options.newline_char
            : '\r?\n'
        var header_obj = {}
        var headers = header.split(new RegExp(mask(newline_char)))
        var key = ''
        var value = ''

        for (var i = 0; i < headers.length; i++) {
          key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1')
          value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\ *\]$/, '$1')
          if (trim(key).length > 0) {
            header_obj[key] = value
          }
        }

        return header_obj
      }

      var newline_char =
        typeof options === 'object' && typeof options.newline_char === 'string'
          ? options.newline_char
          : '\r?\n'

      // RegExp to split header. Takes advantage of the fact that header and movetext
      // will always have a blank line between them (ie, two newline_char's).
      // With default newline_char, will equal: /^(\[((?:\r?\n)|.)*\])(?:\r?\n){2}/
      var header_regex = new RegExp(
        '^(\\[((?:' +
          mask(newline_char) +
          ')|.)*\\])' +
          '(?:' +
          mask(newline_char) +
          '){2}'
      )

      // If no header given, begin with moves.
      var header_string = header_regex.test(pgn)
        ? header_regex.exec(pgn)[1]
        : ''

      // Put the board in the starting position
      reset()

      /* parse PGN header */
      var headers = parse_pgn_header(header_string, options)
      for (var key in headers) {
        set_header([key, headers[key]])
      }

      /* load the starting position indicated by [Setup '1'] and
       * [FEN position] */
      if (headers['SetUp'] === '1') {
        if (!('FEN' in headers && load(headers['FEN'], true))) {
          // second argument to load: don't clear the headers
          return false
        }
      }

      /* NB: the regexes below that delete move numbers, recursive
       * annotations, and numeric annotation glyphs may also match
       * text in comments. To prevent this, we transform comments
       * by hex-encoding them in place and decoding them again after
       * the other tokens have been deleted.
       *
       * While the spec states that PGN files should be ASCII encoded,
       * we use {en,de}codeURIComponent here to support arbitrary UTF8
       * as a convenience for modern users */

      var to_hex = function(string) {
        return Array
          .from(string)
          .map(function(c) {
            /* encodeURI doesn't transform most ASCII characters,
             * so we handle these ourselves */
            return c.charCodeAt(0) < 128
              ? c.charCodeAt(0).toString(16)
              : encodeURIComponent(c).replace(/\%/g, '').toLowerCase()
          })
          .join('')
      }

      var from_hex = function(string) {
        return string.length == 0
          ? ''
          : decodeURIComponent('%' + string.match(/.{1,2}/g).join('%'))
      }

      var encode_comment = function(string) {
        string = string.replace(new RegExp(mask(newline_char), 'g'), ' ')
        return `{${to_hex(string.slice(1, string.length - 1))}}`
      }

      var decode_comment = function(string) {
        if (string.startsWith('{') && string.endsWith('}')) {
          return from_hex(string.slice(1, string.length - 1))
        }
      }

      /* delete header to get the moves */
      var ms = pgn
        .replace(header_string, '')
        .replace(
          /* encode comments so they don't get deleted below */
          new RegExp(`(\{[^}]*\})+?|;([^${mask(newline_char)}]*)`, 'g'),
          function(match, bracket, semicolon) {
            return bracket !== undefined
              ? encode_comment(bracket)
              : ' ' + encode_comment(`{${semicolon.slice(1)}}`)
          }
        )
        .replace(new RegExp(mask(newline_char), 'g'), ' ')

      /* delete recursive annotation variations */
      var rav_regex = /(\([^\(\)]+\))+?/g
      while (rav_regex.test(ms)) {
        ms = ms.replace(rav_regex, '')
      }

      /* delete move numbers */
      ms = ms.replace(/\d+\.(\.\.)?/g, '')

      /* delete ... indicating black to move */
      ms = ms.replace(/\.\.\./g, '')

      /* delete numeric annotation glyphs */
      ms = ms.replace(/\$\d+/g, '')

      /* trim and get array of moves */
      var moves = trim(ms).split(new RegExp(/\s+/))

      /* delete empty entries */
      moves = moves
        .join(',')
        .replace(/,,+/g, ',')
        .split(',')
      var move = ''

      for (var half_move = 0; half_move < moves.length - 1; half_move++) {
        var comment = decode_comment(moves[half_move])
        if (comment !== undefined) {
          comments[generate_fen()] = comment
          continue
        }
        move = move_from_san(moves[half_move], sloppy)

        /* move not possible! (don't clear the board to examine to show the
         * latest valid position)
         */
        if (move == null) {
          return false
        } else {
          make_move(move)
        }
      }

      comment = decode_comment(moves[moves.length - 1])
      if (comment !== undefined) {
        comments[generate_fen()] = comment
        moves.pop()
      }

      /* examine last move */
      move = moves[moves.length - 1]
      if (POSSIBLE_RESULTS.indexOf(move) > -1) {
        if (has_keys(header) && typeof header.Result === 'undefined') {
          set_header(['Result', move])
        }
      } else {
        move = move_from_san(move, sloppy)
        if (move == null) {
          return false
        } else {
          make_move(move)
        }
      }
      return true
    },

    header: function() {
      return set_header(arguments)
    },

    ascii: function() {
      return ascii()
    },

    turn: function() {
      return turn
    },

    move: function(move, options) {
      /* The move function can be called with in the following parameters:
       *
       * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
       *
       * .move({ from: 'h7', <- where the 'move' is a move object (additional
       *         to :'h8',      fields are ignored)
       *         promotion: 'q',
       *      })
       */

      // allow the user to specify the sloppy move parser to work around over
      // disambiguation bugs in Fritz and Chessbase
      var sloppy =
        typeof options !== 'undefined' && 'sloppy' in options
          ? options.sloppy
          : false

      var move_obj = null

      if (typeof move === 'string') {
        move_obj = move_from_san(move, sloppy)
      } else if (typeof move === 'object') {
        var moves = generate_moves()

        /* convert the pretty move object to an ugly move object */
        for (var i = 0, len = moves.length; i < len; i++) {
          if (
            move.from === algebraic(moves[i].from) &&
            move.to === algebraic(moves[i].to) &&
            (!('promotion' in moves[i]) ||
              move.promotion === moves[i].promotion)
          ) {
            move_obj = moves[i]
            break
          }
        }
      }

      /* failed to find move */
      if (!move_obj) {
        return null
      }

      /* need to make a copy of move because we can't generate SAN after the
       * move is made
       */
      var pretty_move = make_pretty(move_obj)

      make_move(move_obj)

      return pretty_move
    },

    undo: function() {
      var move = undo_move()
      return move ? make_pretty(move) : null
    },

    clear: function() {
      return clear()
    },

    put: function(piece, square) {
      return put(piece, square)
    },

    get: function(square) {
      return get(square)
    },

    remove: function(square) {
      return remove(square)
    },

    perft: function(depth) {
      return perft(depth)
    },

    square_color: function(square) {
      if (square in SQUARES) {
        var sq_0x88 = SQUARES[square]
        return (rank(sq_0x88) + file(sq_0x88)) % 2 === 0 ? 'light' : 'dark'
      }

      return null
    },

    history: function(options) {
      var reversed_history = []
      var move_history = []
      var verbose =
        typeof options !== 'undefined' &&
        'verbose' in options &&
        options.verbose

      while (history.length > 0) {
        reversed_history.push(undo_move())
      }

      while (reversed_history.length > 0) {
        var move = reversed_history.pop()
        if (verbose) {
          move_history.push(make_pretty(move))
        } else {
          move_history.push(move_to_san(move))
        }
        make_move(move)
      }

      return move_history
    },

    get_comment: function() {
      return comments[generate_fen()];
    },

    set_comment: function(comment) {
      comments[generate_fen()] = comment.replace('{', '[').replace('}', ']');
    },

    delete_comment: function() {
      var comment = comments[generate_fen()];
      delete comments[generate_fen()];
      return comment;
    },

    get_comments: function() {
      prune_comments();
      return Object.keys(comments).map(function(fen) {
        return {fen: fen, comment: comments[fen]};
      });
    },

    delete_comments: function() {
      prune_comments();
      return Object.keys(comments)
        .map(function(fen) {
          var comment = comments[fen];
          delete comments[fen];
          return {fen: fen, comment: comment};
        });
    }
  }
}

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Chess = Chess
/* export Chess object for any RequireJS compatible environment */
if (typeof define !== 'undefined')
  define(function() {
    return Chess
  })

},{}],"src/apps/loveHandle.js":[function(require,module,exports) {
"use strict";

var _chess = require("chess.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var game = new _chess.Chess();

var LoveHandle = /*#__PURE__*/function (_HTMLElement) {
  _inherits(LoveHandle, _HTMLElement);

  var _super = _createSuper(LoveHandle);

  function LoveHandle() {
    _classCallCheck(this, LoveHandle);

    return _super.call(this);
  }

  _createClass(LoveHandle, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var board = document.createElement("div");
      board.style.width = "500px";
      board.setAttribute("id", "chess-board");
      this.appendChild(board);
      var config = {
        draggable: true,
        position: "start",
        onDragStart: this.onDragStart,
        onDrop: this.onDrop
      };
      window.board = ChessBoard("chess-board", config);
      this.appendChild(board);
    }
  }, {
    key: "onDragStart",
    value: function onDragStart(source, piece, position, orientation) {
      // do not pick up pieces if the game is over
      if (game.game_over()) return false; // only pick up pieces for the side to move

      if (game.turn() === "w" && piece.search(/^b/) !== -1 || game.turn() === "b" && piece.search(/^w/) !== -1) {
        return false;
      }
    }
  }, {
    key: "onDrop",
    value: function onDrop(source, target) {
      // see if the move is legal
      var move = game.move({
        from: source,
        to: target,
        promotion: "q" // NOTE: always promote to a queen for example simplicity

      }); // illegal move

      if (move === null) return "snapback";
    }
  }]);

  return LoveHandle;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

customElements.define("cool-chess", LoveHandle);
},{"chess.js":"node_modules/chess.js/chess.js"}],"node_modules/hybrids/esm/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.camelToDash = camelToDash;
exports.pascalToDash = pascalToDash;
exports.dispatch = dispatch;
exports.shadyCSS = shadyCSS;
exports.stringifyElement = stringifyElement;
exports.deferred = exports.IS_IE = void 0;

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var camelToDashMap = new Map();

function camelToDash(str) {
  var result = camelToDashMap.get(str);

  if (result === undefined) {
    result = str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    camelToDashMap.set(str, result);
  }

  return result;
}

function pascalToDash(str) {
  return camelToDash(str.replace(/((?!([A-Z]{2}|^))[A-Z])/g, "-$1"));
}

function dispatch(host, eventType) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return host.dispatchEvent(new CustomEvent(eventType, _objectSpread({
    bubbles: false
  }, options)));
}

function shadyCSS(fn, fallback) {
  var shady = window.ShadyCSS;
  /* istanbul ignore next */

  if (shady && !shady.nativeShadow) {
    return fn(shady);
  }

  return fallback;
}

function stringifyElement(target) {
  return "<".concat(String(target.tagName).toLowerCase(), ">");
}

var IS_IE = ("ActiveXObject" in window);
exports.IS_IE = IS_IE;
var deferred = Promise.resolve();
exports.deferred = deferred;
},{}],"node_modules/hybrids/esm/property.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = property;

var _utils = require("./utils.js");

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var defaultTransform = function defaultTransform(v) {
  return v;
};

var objectTransform = function objectTransform(value) {
  if (_typeof(value) !== "object") {
    throw TypeError("Assigned value must be an object: ".concat(_typeof(value)));
  }

  return value && Object.freeze(value);
};

function property(value, connect) {
  var type = _typeof(value);

  var transform = defaultTransform;

  switch (type) {
    case "string":
      transform = String;
      break;

    case "number":
      transform = Number;
      break;

    case "boolean":
      transform = Boolean;
      break;

    case "function":
      transform = value;
      value = transform();
      break;

    case "object":
      if (value) Object.freeze(value);
      transform = objectTransform;
      break;

    default:
      break;
  }

  return {
    get: function get(host) {
      var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : value;
      return val;
    },
    set: function set(host, val, oldValue) {
      return transform(val, oldValue);
    },
    connect: type !== "object" && type !== "undefined" ? function (host, key, invalidate) {
      if (host[key] === value) {
        var attrName = (0, _utils.camelToDash)(key);

        if (host.hasAttribute(attrName)) {
          var attrValue = host.getAttribute(attrName);
          host[key] = attrValue === "" && transform === Boolean ? true : attrValue;
        }
      }

      return connect && connect(host, key, invalidate);
    } : connect
  };
}
},{"./utils.js":"node_modules/hybrids/esm/utils.js"}],"node_modules/hybrids/esm/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function render(fn) {
  var customOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof fn !== "function") {
    throw TypeError("The first argument must be a function: ".concat(_typeof(fn)));
  }

  var options = _objectSpread({
    shadowRoot: true
  }, customOptions);

  var shadowRootInit = {
    mode: "open"
  };

  if (_typeof(options.shadowRoot) === "object") {
    Object.assign(shadowRootInit, options.shadowRoot);
  }

  return {
    get: function get(host) {
      var update = fn(host);
      var target = host;

      if (options.shadowRoot) {
        if (!host.shadowRoot) host.attachShadow(shadowRootInit);
        target = host.shadowRoot;
      }

      return function flush() {
        update(host, target);
        return target;
      };
    },
    observe: function observe(host, flush) {
      flush();
    }
  };
}
},{}],"node_modules/hybrids/esm/emitter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatch = dispatch;
exports.subscribe = subscribe;
var callbacks = new WeakMap();
var queue = new Set();

function execute() {
  try {
    queue.forEach(function (target) {
      try {
        callbacks.get(target)();
        queue.delete(target);
      } catch (e) {
        queue.delete(target);
        throw e;
      }
    });
  } catch (e) {
    if (queue.size) execute();
    throw e;
  }
}

function dispatch(target) {
  if (!queue.size) {
    requestAnimationFrame(execute);
  }

  queue.add(target);
}

function subscribe(target, cb) {
  callbacks.set(target, cb);
  dispatch(target);
  return function unsubscribe() {
    queue.delete(target);
    callbacks.delete(target);
  };
}
},{}],"node_modules/hybrids/esm/cache.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEntry = getEntry;
exports.get = get;
exports.set = set;
exports.invalidate = invalidate;
exports.observe = observe;

var emitter = _interopRequireWildcard(require("./emitter.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var entries = new WeakMap();

function getEntry(target, key) {
  var targetMap = entries.get(target);

  if (!targetMap) {
    targetMap = new Map();
    entries.set(target, targetMap);
  }

  var entry = targetMap.get(key);

  if (!entry) {
    entry = {
      target: target,
      key: key,
      value: undefined,
      contexts: undefined,
      deps: undefined,
      state: 0,
      checksum: 0,
      observed: false
    };
    targetMap.set(key, entry);
  }

  return entry;
}

function calculateChecksum(entry) {
  var checksum = entry.state;

  if (entry.deps) {
    entry.deps.forEach(function (depEntry) {
      checksum += depEntry.state;
    });
  }

  return checksum;
}

function dispatchDeep(entry) {
  if (entry.observed) emitter.dispatch(entry);
  if (entry.contexts) entry.contexts.forEach(dispatchDeep);
}

function restoreDeepDeps(entry, deps) {
  if (deps) {
    deps.forEach(function (depEntry) {
      entry.deps.add(depEntry);

      if (entry.observed) {
        /* istanbul ignore if */
        if (!depEntry.contexts) depEntry.contexts = new Set();
        depEntry.contexts.add(entry);
      }

      restoreDeepDeps(entry, depEntry.deps);
    });
  }
}

var contextStack = new Set();

function get(target, key, getter) {
  var entry = getEntry(target, key);

  if (contextStack.size && contextStack.has(entry)) {
    throw Error("Circular get invocation is forbidden: '".concat(key, "'"));
  }

  contextStack.forEach(function (context) {
    if (!context.deps) context.deps = new Set();
    context.deps.add(entry);

    if (context.observed) {
      if (!entry.contexts) entry.contexts = new Set();
      entry.contexts.add(context);
    }
  });

  if (entry.checksum && entry.checksum === calculateChecksum(entry)) {
    return entry.value;
  }

  try {
    contextStack.add(entry);

    if (entry.observed && entry.deps && entry.deps.size) {
      entry.deps.forEach(function (depEntry) {
        /* istanbul ignore else */
        if (depEntry.contexts) depEntry.contexts.delete(entry);
      });
    }

    entry.deps = undefined;
    var nextValue = getter(target, entry.value);

    if (entry.deps) {
      entry.deps.forEach(function (depEntry) {
        restoreDeepDeps(entry, depEntry.deps);
      });
    }

    if (nextValue !== entry.value) {
      entry.state += 1;
      entry.value = nextValue;
      dispatchDeep(entry);
    }

    entry.checksum = calculateChecksum(entry);
    contextStack.delete(entry);
  } catch (e) {
    entry.checksum = 0;
    contextStack.delete(entry);
    contextStack.forEach(function (context) {
      context.deps.delete(entry);
      if (context.observed) entry.contexts.delete(context);
    });
    throw e;
  }

  return entry.value;
}

function set(target, key, setter, value) {
  var entry = getEntry(target, key);
  var newValue = setter(target, value, entry.value);

  if (newValue !== entry.value) {
    entry.checksum = 0;
    entry.state += 1;
    entry.value = newValue;
    dispatchDeep(entry);
  }
}

function invalidate(target, key, clearValue) {
  if (contextStack.size) {
    throw Error("Invalidating property in chain of get calls is forbidden: '".concat(key, "'"));
  }

  var entry = getEntry(target, key);
  entry.checksum = 0;
  entry.state += 1;
  dispatchDeep(entry);

  if (clearValue) {
    entry.value = undefined;
  }
}

function observe(target, key, getter, fn) {
  var entry = getEntry(target, key);
  entry.observed = true;
  var lastValue;
  var unsubscribe = emitter.subscribe(entry, function () {
    var value = get(target, key, getter);

    if (value !== lastValue) {
      fn(target, value, lastValue);
      lastValue = value;
    }
  });

  if (entry.deps) {
    entry.deps.forEach(function (depEntry) {
      /* istanbul ignore else */
      if (!depEntry.contexts) depEntry.contexts = new Set();
      depEntry.contexts.add(entry);
    });
  }

  return function unobserve() {
    unsubscribe();
    entry.observed = false;

    if (entry.deps && entry.deps.size) {
      entry.deps.forEach(function (depEntry) {
        /* istanbul ignore else */
        if (depEntry.contexts) depEntry.contexts.delete(entry);
      });
    }
  };
}
},{"./emitter.js":"node_modules/hybrids/esm/emitter.js"}],"node_modules/hybrids/esm/define.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = define;

var _property = _interopRequireDefault(require("./property.js"));

var _render = _interopRequireDefault(require("./render.js"));

var cache = _interopRequireWildcard(require("./cache.js"));

var _utils = require("./utils.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/* istanbul ignore next */
try {
  "development";
} catch (e) {
  var process = {
    env: {
      NODE_ENV: 'production'
    }
  };
} // eslint-disable-line


var defaultMethod = function defaultMethod(host, value) {
  return value;
};

var callbacksMap = new WeakMap();
var propsMap = new WeakMap();

function compile(Hybrid, descriptors) {
  Hybrid.hybrids = descriptors;
  var callbacks = [];
  var props = Object.keys(descriptors);
  callbacksMap.set(Hybrid, callbacks);
  propsMap.set(Hybrid, props);
  props.forEach(function (key) {
    var desc = descriptors[key];

    var type = _typeof(desc);

    var config;

    if (type === "function") {
      config = key === "render" ? (0, _render.default)(desc) : {
        get: desc
      };
    } else if (type !== "object" || desc === null || Array.isArray(desc)) {
      config = (0, _property.default)(desc);
    } else {
      config = {
        get: desc.get || defaultMethod,
        set: desc.set || !desc.get && defaultMethod || undefined,
        connect: desc.connect,
        observe: desc.observe
      };
    }

    Object.defineProperty(Hybrid.prototype, key, {
      get: function get() {
        return cache.get(this, key, config.get);
      },
      set: config.set && function set(newValue) {
        cache.set(this, key, config.set, newValue);
      },
      enumerable: true,
      configurable: "development" !== "production"
    });

    if (config.observe) {
      callbacks.unshift(function (host) {
        return cache.observe(host, key, config.get, config.observe);
      });
    }

    if (config.connect) {
      callbacks.push(function (host) {
        return config.connect(host, key, function () {
          cache.invalidate(host, key);
        });
      });
    }
  });
}

var update;
/* istanbul ignore else */

if ("development" !== "production") {
  var walkInShadow = function walkInShadow(node, fn) {
    fn(node);
    Array.from(node.children).forEach(function (el) {
      return walkInShadow(el, fn);
    });

    if (node.shadowRoot) {
      Array.from(node.shadowRoot.children).forEach(function (el) {
        return walkInShadow(el, fn);
      });
    }
  };

  var updateQueue = new Map();

  update = function update(Hybrid, lastHybrids) {
    if (!updateQueue.size) {
      _utils.deferred.then(function () {
        walkInShadow(document.body, function (node) {
          if (updateQueue.has(node.constructor)) {
            var hybrids = updateQueue.get(node.constructor);
            node.disconnectedCallback();
            Object.keys(node.constructor.hybrids).forEach(function (key) {
              cache.invalidate(node, key, node.constructor.hybrids[key] !== hybrids[key]);
            });
            node.connectedCallback();
          }
        });
        updateQueue.clear();
      });
    }

    updateQueue.set(Hybrid, lastHybrids);
  };
}

var disconnects = new WeakMap();

function defineElement(tagName, hybridsOrConstructor) {
  var type = _typeof(hybridsOrConstructor);

  if (type !== "object" && type !== "function") {
    throw TypeError("Second argument must be an object or a function: ".concat(type));
  }

  var CustomElement = window.customElements.get(tagName);

  if (type === "function") {
    if (CustomElement !== hybridsOrConstructor) {
      return window.customElements.define(tagName, hybridsOrConstructor);
    }

    return CustomElement;
  }

  if (CustomElement) {
    if (CustomElement.hybrids === hybridsOrConstructor) {
      return CustomElement;
    }

    if ("development" !== "production" && CustomElement.hybrids) {
      Object.keys(CustomElement.hybrids).forEach(function (key) {
        delete CustomElement.prototype[key];
      });
      var lastHybrids = CustomElement.hybrids;
      compile(CustomElement, hybridsOrConstructor);
      update(CustomElement, lastHybrids);
      return CustomElement;
    }

    throw Error("Element '".concat(tagName, "' already defined"));
  }

  var Hybrid = /*#__PURE__*/function (_HTMLElement) {
    _inherits(Hybrid, _HTMLElement);

    var _super = _createSuper(Hybrid);

    _createClass(Hybrid, null, [{
      key: "name",
      get: function get() {
        return tagName;
      }
    }]);

    function Hybrid() {
      var _this;

      _classCallCheck(this, Hybrid);

      _this = _super.call(this);
      var props = propsMap.get(Hybrid);

      for (var index = 0; index < props.length; index += 1) {
        var key = props[index];

        if (Object.prototype.hasOwnProperty.call(_assertThisInitialized(_this), key)) {
          var value = _this[key];
          delete _this[key];
          _this[key] = value;
        }
      }

      return _this;
    }

    _createClass(Hybrid, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var callbacks = callbacksMap.get(Hybrid);
        var list = [];

        for (var index = 0; index < callbacks.length; index += 1) {
          var cb = callbacks[index](this);
          if (cb) list.push(cb);
        }

        disconnects.set(this, list);
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        var list = disconnects.get(this);

        for (var index = 0; index < list.length; index += 1) {
          list[index]();
        }
      }
    }]);

    return Hybrid;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  compile(Hybrid, hybridsOrConstructor);
  customElements.define(tagName, Hybrid);
  return Hybrid;
}

function defineMap(elements) {
  return Object.keys(elements).reduce(function (acc, key) {
    var tagName = (0, _utils.pascalToDash)(key);
    acc[key] = defineElement(tagName, elements[key]);
    return acc;
  }, {});
}

function define() {
  if (_typeof(arguments.length <= 0 ? undefined : arguments[0]) === "object") {
    return defineMap(arguments.length <= 0 ? undefined : arguments[0]);
  }

  return defineElement.apply(void 0, arguments);
}
},{"./property.js":"node_modules/hybrids/esm/property.js","./render.js":"node_modules/hybrids/esm/render.js","./cache.js":"node_modules/hybrids/esm/cache.js","./utils.js":"node_modules/hybrids/esm/utils.js"}],"node_modules/hybrids/esm/parent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parent;

function walk(node, fn) {
  var parentElement = node.parentElement || node.parentNode.host;

  while (parentElement) {
    var hybrids = parentElement.constructor.hybrids;

    if (hybrids && fn(hybrids)) {
      return parentElement;
    }

    parentElement = parentElement.parentElement || parentElement.parentNode && parentElement.parentNode.host;
  }

  return parentElement || null;
}

function parent(hybridsOrFn) {
  var fn = typeof hybridsOrFn === "function" ? hybridsOrFn : function (hybrids) {
    return hybrids === hybridsOrFn;
  };
  return {
    get: function get(host) {
      return walk(host, fn);
    },
    connect: function connect(host, key, invalidate) {
      var target = host[key];

      if (target) {
        return invalidate;
      }

      return false;
    }
  };
}
},{}],"node_modules/hybrids/esm/children.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = children;

function walk(node, fn, options) {
  var items = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  Array.from(node.children).forEach(function (child) {
    var hybrids = child.constructor.hybrids;

    if (hybrids && fn(hybrids)) {
      items.push(child);

      if (options.deep && options.nested) {
        walk(child, fn, options, items);
      }
    } else if (options.deep) {
      walk(child, fn, options, items);
    }
  });
  return items;
}

function children(hybridsOrFn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    deep: false,
    nested: false
  };
  var fn = typeof hybridsOrFn === "function" ? hybridsOrFn : function (hybrids) {
    return hybrids === hybridsOrFn;
  };
  return {
    get: function get(host) {
      return walk(host, fn, options);
    },
    connect: function connect(host, key, invalidate) {
      var observer = new MutationObserver(invalidate);
      observer.observe(host, {
        childList: true,
        subtree: !!options.deep
      });
      return function () {
        observer.disconnect();
      };
    }
  };
}
},{}],"node_modules/hybrids/esm/template/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplateEnd = getTemplateEnd;
exports.removeTemplate = removeTemplate;
exports.dataMap = void 0;
var map = new WeakMap();
var dataMap = {
  get: function get(key, defaultValue) {
    var value = map.get(key);
    if (value) return value;

    if (defaultValue) {
      map.set(key, defaultValue);
    }

    return defaultValue;
  },
  set: function set(key, value) {
    map.set(key, value);
    return value;
  }
};
exports.dataMap = dataMap;

function getTemplateEnd(node) {
  var data; // eslint-disable-next-line no-cond-assign

  while (node && (data = dataMap.get(node)) && data.endNode) {
    node = data.endNode;
  }

  return node;
}

function removeTemplate(target) {
  if (target.nodeType !== Node.TEXT_NODE) {
    var child = target.childNodes[0];

    while (child) {
      target.removeChild(child);
      child = target.childNodes[0];
    }
  } else {
    var data = dataMap.get(target);

    if (data.startNode) {
      var endNode = getTemplateEnd(data.endNode);
      var node = data.startNode;
      var lastNextSibling = endNode.nextSibling;

      while (node) {
        var nextSibling = node.nextSibling;
        node.parentNode.removeChild(node);
        node = nextSibling !== lastNextSibling && nextSibling;
      }
    }
  }
}
},{}],"node_modules/hybrids/esm/template/resolvers/array.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveArray;
exports.arrayMap = void 0;

var _utils = require("../utils.js");

var arrayMap = new WeakMap();
exports.arrayMap = arrayMap;

function movePlaceholder(target, previousSibling) {
  var data = _utils.dataMap.get(target);

  var startNode = data.startNode;
  var endNode = (0, _utils.getTemplateEnd)(data.endNode);
  previousSibling.parentNode.insertBefore(target, previousSibling.nextSibling);
  var prevNode = target;
  var node = startNode;

  while (node) {
    var nextNode = node.nextSibling;
    prevNode.parentNode.insertBefore(node, prevNode.nextSibling);
    prevNode = node;
    node = nextNode !== endNode.nextSibling && nextNode;
  }
}

function resolveArray(host, target, value, resolveValue) {
  var lastEntries = arrayMap.get(target);
  var entries = value.map(function (item, index) {
    return {
      id: Object.prototype.hasOwnProperty.call(item, "id") ? item.id : index,
      value: item,
      placeholder: null,
      available: true
    };
  });
  arrayMap.set(target, entries);

  if (lastEntries) {
    var ids = new Set();
    entries.forEach(function (entry) {
      return ids.add(entry.id);
    });
    lastEntries = lastEntries.filter(function (entry) {
      if (!ids.has(entry.id)) {
        (0, _utils.removeTemplate)(entry.placeholder);
        entry.placeholder.parentNode.removeChild(entry.placeholder);
        return false;
      }

      return true;
    });
  }

  var previousSibling = target;
  var lastIndex = value.length - 1;

  var data = _utils.dataMap.get(target);

  for (var index = 0; index < entries.length; index += 1) {
    var entry = entries[index];
    var matchedEntry = void 0;

    if (lastEntries) {
      for (var i = 0; i < lastEntries.length; i += 1) {
        if (lastEntries[i].available && lastEntries[i].id === entry.id) {
          matchedEntry = lastEntries[i];
          break;
        }
      }
    }

    var placeholder = void 0;

    if (matchedEntry) {
      matchedEntry.available = false;
      placeholder = matchedEntry.placeholder;

      if (placeholder.previousSibling !== previousSibling) {
        movePlaceholder(placeholder, previousSibling);
      }

      if (matchedEntry.value !== entry.value) {
        resolveValue(host, placeholder, entry.value);
      }
    } else {
      placeholder = document.createTextNode("");
      previousSibling.parentNode.insertBefore(placeholder, previousSibling.nextSibling);
      resolveValue(host, placeholder, entry.value);
    }

    previousSibling = (0, _utils.getTemplateEnd)(_utils.dataMap.get(placeholder).endNode || placeholder);
    if (index === 0) data.startNode = placeholder;
    if (index === lastIndex) data.endNode = previousSibling;
    entry.placeholder = placeholder;
  }

  if (lastEntries) {
    lastEntries.forEach(function (entry) {
      if (entry.available) {
        (0, _utils.removeTemplate)(entry.placeholder);
        entry.placeholder.parentNode.removeChild(entry.placeholder);
      }
    });
  }
}
},{"../utils.js":"node_modules/hybrids/esm/template/utils.js"}],"node_modules/hybrids/esm/template/resolvers/value.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveValue;

var _utils = require("../utils.js");

var _array = _interopRequireWildcard(require("./array.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function resolveValue(host, target, value) {
  var type = Array.isArray(value) ? "array" : _typeof(value);

  var data = _utils.dataMap.get(target, {});

  if (data.type !== type) {
    (0, _utils.removeTemplate)(target);
    if (type === "array") _array.arrayMap.delete(target);
    data = _utils.dataMap.set(target, {
      type: type
    });

    if (target.textContent !== "") {
      target.textContent = "";
    }
  }

  switch (type) {
    case "function":
      value(host, target);
      break;

    case "array":
      (0, _array.default)(host, target, value, resolveValue);
      break;

    default:
      target.textContent = type === "number" || value ? value : "";
  }
}
},{"../utils.js":"node_modules/hybrids/esm/template/utils.js","./array.js":"node_modules/hybrids/esm/template/resolvers/array.js"}],"node_modules/hybrids/esm/template/resolvers/event.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveEventListener;

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var targets = new WeakMap();

function resolveEventListener(eventType) {
  return function (host, target, value, lastValue) {
    if (lastValue) {
      var eventMap = targets.get(target);

      if (eventMap) {
        target.removeEventListener(eventType, eventMap.get(lastValue), lastValue.options !== undefined ? lastValue.options : false);
      }
    }

    if (value) {
      if (typeof value !== "function") {
        throw Error("Event listener must be a function: ".concat(_typeof(value)));
      }

      var _eventMap = targets.get(target);

      if (!_eventMap) {
        _eventMap = new WeakMap();
        targets.set(target, _eventMap);
      }

      var callback = value.bind(null, host);

      _eventMap.set(value, callback);

      target.addEventListener(eventType, callback, value.options !== undefined ? value.options : false);
    }
  };
}
},{}],"node_modules/hybrids/esm/template/resolvers/class.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveClassList;

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function normalizeValue(value) {
  var set = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();

  if (Array.isArray(value)) {
    value.forEach(function (className) {
      return set.add(className);
    });
  } else if (value !== null && _typeof(value) === "object") {
    Object.keys(value).forEach(function (key) {
      return value[key] && set.add(key);
    });
  } else {
    set.add(value);
  }

  return set;
}

var classMap = new WeakMap();

function resolveClassList(host, target, value) {
  var previousList = classMap.get(target) || new Set();
  var list = normalizeValue(value);
  classMap.set(target, list);
  list.forEach(function (className) {
    target.classList.add(className);
    previousList.delete(className);
  });
  previousList.forEach(function (className) {
    target.classList.remove(className);
  });
}
},{}],"node_modules/hybrids/esm/template/resolvers/style.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveStyle;

var _utils = require("../../utils.js");

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var styleMap = new WeakMap();

function resolveStyle(host, target, value) {
  if (value === null || _typeof(value) !== "object") {
    throw TypeError("Style value must be an object in ".concat((0, _utils.stringifyElement)(target), ":"), value);
  }

  var previousMap = styleMap.get(target) || new Map();
  var nextMap = Object.keys(value).reduce(function (map, key) {
    var dashKey = (0, _utils.camelToDash)(key);
    var styleValue = value[key];

    if (!styleValue && styleValue !== 0) {
      target.style.removeProperty(dashKey);
    } else {
      target.style.setProperty(dashKey, styleValue);
    }

    map.set(dashKey, styleValue);
    previousMap.delete(dashKey);
    return map;
  }, new Map());
  previousMap.forEach(function (styleValue, key) {
    target.style[key] = "";
  });
  styleMap.set(target, nextMap);
}
},{"../../utils.js":"node_modules/hybrids/esm/utils.js"}],"node_modules/hybrids/esm/template/resolvers/property.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveProperty;

var _event = _interopRequireDefault(require("./event.js"));

var _class = _interopRequireDefault(require("./class.js"));

var _style = _interopRequireDefault(require("./style.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolveProperty(attrName, propertyName, isSVG) {
  if (propertyName.substr(0, 2) === "on") {
    var eventType = propertyName.substr(2);
    return (0, _event.default)(eventType);
  }

  switch (attrName) {
    case "class":
      return _class.default;

    case "style":
      return _style.default;

    default:
      return function (host, target, value) {
        if (!isSVG && !(target instanceof SVGElement) && propertyName in target) {
          if (target[propertyName] !== value) {
            target[propertyName] = value;
          }
        } else if (value === false || value === undefined || value === null) {
          target.removeAttribute(attrName);
        } else {
          var attrValue = value === true ? "" : String(value);
          target.setAttribute(attrName, attrValue);
        }
      };
  }
}
},{"./event.js":"node_modules/hybrids/esm/template/resolvers/event.js","./class.js":"node_modules/hybrids/esm/template/resolvers/class.js","./style.js":"node_modules/hybrids/esm/template/resolvers/style.js"}],"node_modules/hybrids/esm/template/core.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInternalWalker = createInternalWalker;
exports.compileTemplate = compileTemplate;
exports.getPlaceholder = void 0;

var _utils = require("../utils.js");

var _utils2 = require("./utils.js");

var _value = _interopRequireDefault(require("./resolvers/value.js"));

var _property = _interopRequireDefault(require("./resolvers/property.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/* istanbul ignore next */
try {
  "development";
} catch (e) {
  var process = {
    env: {
      NODE_ENV: 'production'
    }
  };
} // eslint-disable-line


var TIMESTAMP = Date.now();

var getPlaceholder = function getPlaceholder() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return "{{h-".concat(TIMESTAMP, "-").concat(id, "}}");
};

exports.getPlaceholder = getPlaceholder;
var PLACEHOLDER_REGEXP_TEXT = getPlaceholder("(\\d+)");
var PLACEHOLDER_REGEXP_EQUAL = new RegExp("^".concat(PLACEHOLDER_REGEXP_TEXT, "$"));
var PLACEHOLDER_REGEXP_ALL = new RegExp(PLACEHOLDER_REGEXP_TEXT, "g");
var ATTR_PREFIX = "--".concat(TIMESTAMP, "--");
var ATTR_REGEXP = new RegExp(ATTR_PREFIX, "g");
var preparedTemplates = new WeakMap();
/* istanbul ignore next */

function applyShadyCSS(template, tagName) {
  if (!tagName) return template;
  return (0, _utils.shadyCSS)(function (shady) {
    var map = preparedTemplates.get(template);

    if (!map) {
      map = new Map();
      preparedTemplates.set(template, map);
    }

    var clone = map.get(tagName);

    if (!clone) {
      clone = document.createElement("template");
      clone.content.appendChild(template.content.cloneNode(true));
      map.set(tagName, clone);
      var styles = clone.content.querySelectorAll("style");
      Array.from(styles).forEach(function (style) {
        var count = style.childNodes.length + 1;

        for (var i = 0; i < count; i += 1) {
          style.parentNode.insertBefore(document.createTextNode(getPlaceholder()), style);
        }
      });
      shady.prepareTemplate(clone, tagName.toLowerCase());
    }

    return clone;
  }, template);
}

function createSignature(parts, styles) {
  var signature = parts.reduce(function (acc, part, index) {
    if (index === 0) {
      return part;
    }

    if (parts.slice(index).join("").match(/^\s*<\/\s*(table|tr|thead|tbody|tfoot|colgroup)>/)) {
      return "".concat(acc, "<!--").concat(getPlaceholder(index - 1), "-->").concat(part);
    }

    return acc + getPlaceholder(index - 1) + part;
  }, "");

  if (styles) {
    signature += "<style>\n".concat(styles.join("\n/*------*/\n"), "\n</style>");
  }
  /* istanbul ignore if */


  if (_utils.IS_IE) {
    return signature.replace(/style\s*=\s*(["][^"]+["]|['][^']+[']|[^\s"'<>/]+)/g, function (match) {
      return "".concat(ATTR_PREFIX).concat(match);
    });
  }

  return signature;
}

function getPropertyName(string) {
  return string.replace(/\s*=\s*['"]*$/g, "").split(/\s+/).pop();
}

function replaceComments(fragment) {
  var iterator = document.createNodeIterator(fragment, NodeFilter.SHOW_COMMENT, null, false);
  var node; // eslint-disable-next-line no-cond-assign

  while (node = iterator.nextNode()) {
    if (PLACEHOLDER_REGEXP_EQUAL.test(node.textContent)) {
      node.parentNode.insertBefore(document.createTextNode(node.textContent), node);
      node.parentNode.removeChild(node);
    }
  }
}

function createInternalWalker(context) {
  var node;
  return {
    get currentNode() {
      return node;
    },

    nextNode: function nextNode() {
      if (node === undefined) {
        node = context.childNodes[0];
      } else if (node.childNodes.length) {
        node = node.childNodes[0];
      } else if (node.nextSibling) {
        node = node.nextSibling;
      } else {
        var parentNode = node.parentNode;
        node = parentNode.nextSibling;

        while (!node && parentNode !== context) {
          parentNode = parentNode.parentNode;
          node = parentNode.nextSibling;
        }
      }

      return !!node;
    }
  };
}

function createExternalWalker(context) {
  return document.createTreeWalker(context, // eslint-disable-next-line no-bitwise
  NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
}
/* istanbul ignore next */


var createWalker = _typeof(window.ShadyDOM) === "object" && window.ShadyDOM.inUse ? createInternalWalker : createExternalWalker;
var container = document.createElement("div");
var styleSheetsMap = new Map();

function compileTemplate(rawParts, isSVG, styles) {
  var template = document.createElement("template");
  var parts = [];
  var signature = createSignature(rawParts, styles);
  if (isSVG) signature = "<svg>".concat(signature, "</svg>");
  /* istanbul ignore if */

  if (_utils.IS_IE) {
    template.innerHTML = signature;
  } else {
    container.innerHTML = "<template>".concat(signature, "</template>");
    template.content.appendChild(container.children[0].content);
  }

  if (isSVG) {
    var svgRoot = template.content.firstChild;
    template.content.removeChild(svgRoot);
    Array.from(svgRoot.childNodes).forEach(function (node) {
      return template.content.appendChild(node);
    });
  }

  replaceComments(template.content);
  var compileWalker = createWalker(template.content);
  var compileIndex = 0;

  var _loop = function _loop() {
    var node = compileWalker.currentNode;

    if (node.nodeType === Node.TEXT_NODE) {
      var text = node.textContent;

      if (!text.match(PLACEHOLDER_REGEXP_EQUAL)) {
        var results = text.match(PLACEHOLDER_REGEXP_ALL);

        if (results) {
          var currentNode = node;
          results.reduce(function (acc, placeholder) {
            var _acc$pop$split = acc.pop().split(placeholder),
                _acc$pop$split2 = _slicedToArray(_acc$pop$split, 2),
                before = _acc$pop$split2[0],
                next = _acc$pop$split2[1];

            if (before) acc.push(before);
            acc.push(placeholder);
            if (next) acc.push(next);
            return acc;
          }, [text]).forEach(function (part, index) {
            if (index === 0) {
              currentNode.textContent = part;
            } else {
              currentNode = currentNode.parentNode.insertBefore(document.createTextNode(part), currentNode.nextSibling);
            }
          });
        }
      }

      var equal = node.textContent.match(PLACEHOLDER_REGEXP_EQUAL);

      if (equal) {
        /* istanbul ignore else */
        if (!_utils.IS_IE) node.textContent = "";
        parts[equal[1]] = [compileIndex, _value.default];
      }
    } else {
      /* istanbul ignore else */
      // eslint-disable-next-line no-lonely-if
      if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.attributes).forEach(function (attr) {
          var value = attr.value.trim();
          /* istanbul ignore next */

          var name = _utils.IS_IE ? attr.name.replace(ATTR_PREFIX, "") : attr.name;
          var equal = value.match(PLACEHOLDER_REGEXP_EQUAL);

          if (equal) {
            var propertyName = getPropertyName(rawParts[equal[1]]);
            parts[equal[1]] = [compileIndex, (0, _property.default)(name, propertyName, isSVG)];
            node.removeAttribute(attr.name);
          } else {
            var _results = value.match(PLACEHOLDER_REGEXP_ALL);

            if (_results) {
              var partialName = "attr__".concat(name);

              _results.forEach(function (placeholder, index) {
                var _placeholder$match = placeholder.match(PLACEHOLDER_REGEXP_EQUAL),
                    _placeholder$match2 = _slicedToArray(_placeholder$match, 2),
                    id = _placeholder$match2[1];

                parts[id] = [compileIndex, function (host, target, attrValue) {
                  var data = _utils2.dataMap.get(target, {});

                  data[partialName] = (data[partialName] || value).replace(placeholder, attrValue == null ? "" : attrValue);

                  if (_results.length === 1 || index + 1 === _results.length) {
                    target.setAttribute(name, data[partialName]);
                    data[partialName] = undefined;
                  }
                }];
              });

              attr.value = "";
              /* istanbul ignore next */

              if (_utils.IS_IE && name !== attr.name) {
                node.removeAttribute(attr.name);
                node.setAttribute(name, "");
              }
            }
          }
        });
      }
    }

    compileIndex += 1;
  };

  while (compileWalker.nextNode()) {
    _loop();
  }

  return function updateTemplateInstance(host, target, args, styleSheets) {
    var data = _utils2.dataMap.get(target, {
      type: "function"
    });

    if (template !== data.template) {
      if (data.template || target.nodeType === Node.ELEMENT_NODE) {
        (0, _utils2.removeTemplate)(target);
      }

      data.prevArgs = null;
      var fragment = document.importNode(applyShadyCSS(template, host.tagName).content, true);
      var renderWalker = createWalker(fragment);
      var clonedParts = parts.slice(0);
      var renderIndex = 0;
      var currentPart = clonedParts.shift();
      var markers = [];
      data.template = template;
      data.markers = markers;

      while (renderWalker.nextNode()) {
        var node = renderWalker.currentNode;

        if (node.nodeType === Node.TEXT_NODE) {
          /* istanbul ignore next */
          if (PLACEHOLDER_REGEXP_EQUAL.test(node.textContent)) {
            node.textContent = "";
          } else if (_utils.IS_IE) {
            node.textContent = node.textContent.replace(ATTR_REGEXP, "");
          }
        } else if ("development" !== "production" && node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName.indexOf("-") > -1 && !customElements.get(node.tagName.toLowerCase())) {
            throw Error("Missing '".concat((0, _utils.stringifyElement)(node), "' element definition in '").concat((0, _utils.stringifyElement)(host), "'"));
          }
        }

        while (currentPart && currentPart[0] === renderIndex) {
          markers.push([node, currentPart[1]]);
          currentPart = clonedParts.shift();
        }

        renderIndex += 1;
      }

      if (target.nodeType === Node.TEXT_NODE) {
        data.startNode = fragment.childNodes[0];
        data.endNode = fragment.childNodes[fragment.childNodes.length - 1];
        var previousChild = target;
        var child = fragment.childNodes[0];

        while (child) {
          target.parentNode.insertBefore(child, previousChild.nextSibling);
          previousChild = child;
          child = fragment.childNodes[0];
        }
      } else {
        target.appendChild(fragment);
      }
    }

    var adoptedStyleSheets = target.adoptedStyleSheets;

    if (styleSheets) {
      var isEqual = false;
      styleSheets = styleSheets.map(function (style) {
        if (style instanceof CSSStyleSheet) return style;
        var styleSheet = styleSheetsMap.get(style);

        if (!styleSheet) {
          styleSheet = new CSSStyleSheet();
          styleSheet.replaceSync(style);
          styleSheetsMap.set(style, styleSheet);
        }

        return styleSheet;
      });

      if (styleSheets.length === adoptedStyleSheets.length) {
        isEqual = true;

        for (var i = 0; i < styleSheets.length; i += 1) {
          if (styleSheets[i] !== adoptedStyleSheets[i]) {
            isEqual = false;
            break;
          }
        }
      }

      if (!isEqual) target.adoptedStyleSheets = styleSheets;
    } else if (adoptedStyleSheets && adoptedStyleSheets.length) {
      target.adoptedStyleSheets = [];
    }

    var prevArgs = data.prevArgs;
    data.prevArgs = args;

    for (var index = 0; index < data.markers.length; index += 1) {
      var _data$markers$index = _slicedToArray(data.markers[index], 2),
          _node = _data$markers$index[0],
          marker = _data$markers$index[1];

      if (!prevArgs || prevArgs[index] !== args[index]) {
        marker(host, _node, args[index], prevArgs ? prevArgs[index] : undefined);
      }
    }

    if (target.nodeType !== Node.TEXT_NODE) {
      (0, _utils.shadyCSS)(function (shady) {
        if (host.shadowRoot) {
          if (prevArgs) {
            shady.styleSubtree(host);
          } else {
            shady.styleElement(host);
          }
        }
      });
    }
  };
}
},{"../utils.js":"node_modules/hybrids/esm/utils.js","./utils.js":"node_modules/hybrids/esm/template/utils.js","./resolvers/value.js":"node_modules/hybrids/esm/template/resolvers/value.js","./resolvers/property.js":"node_modules/hybrids/esm/template/resolvers/property.js"}],"node_modules/hybrids/esm/template/helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = set;
exports.resolve = resolve;
var setCache = new Map();

function set(propertyName, value) {
  if (!propertyName) throw Error("Target property name missing: ".concat(propertyName));

  if (arguments.length === 2) {
    return function (host) {
      host[propertyName] = value;
    };
  }

  var fn = setCache.get(propertyName);

  if (!fn) {
    fn = function fn(host, _ref) {
      var target = _ref.target;
      host[propertyName] = target.value;
    };

    setCache.set(propertyName, fn);
  }

  return fn;
}

var promiseMap = new WeakMap();

function resolve(promise, placeholder) {
  var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
  return function (host, target) {
    var timeout;

    if (placeholder) {
      timeout = setTimeout(function () {
        timeout = undefined;
        requestAnimationFrame(function () {
          placeholder(host, target);
        });
      }, delay);
    }

    promiseMap.set(target, promise);
    promise.then(function (template) {
      if (timeout) clearTimeout(timeout);

      if (promiseMap.get(target) === promise) {
        template(host, target);
        promiseMap.set(target, null);
      }
    });
  };
}
},{}],"node_modules/hybrids/esm/template/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = html;
exports.svg = svg;

var _define = _interopRequireDefault(require("../define.js"));

var _core = require("./core.js");

var helpers = _interopRequireWildcard(require("./helpers.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PLACEHOLDER = (0, _core.getPlaceholder)();
var SVG_PLACEHOLDER = (0, _core.getPlaceholder)("svg");
var STYLE_IMPORT_REGEXP = /@import/;
var templatesMap = new Map();
var stylesMap = new WeakMap();
var methods = {
  define: function define(elements) {
    (0, _define.default)(elements);
    return this;
  },
  key: function key(id) {
    this.id = id;
    return this;
  },
  style: function style() {
    for (var _len = arguments.length, styles = new Array(_len), _key = 0; _key < _len; _key++) {
      styles[_key] = arguments[_key];
    }

    stylesMap.set(this, styles.filter(function (style) {
      return style;
    }));
    return this;
  }
};

function create(parts, args, isSVG) {
  var createTemplate = function createTemplate(host) {
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : host;
    var styles = stylesMap.get(createTemplate);
    var hasAdoptedStyleSheets;
    var id = parts.join(PLACEHOLDER);

    if (styles) {
      var joinedStyles = styles.join(PLACEHOLDER);
      hasAdoptedStyleSheets = !!target.adoptedStyleSheets && !STYLE_IMPORT_REGEXP.test(joinedStyles);
      if (!hasAdoptedStyleSheets) id += joinedStyles;
    }

    if (isSVG) id += SVG_PLACEHOLDER;
    var render = templatesMap.get(id);

    if (!render) {
      render = (0, _core.compileTemplate)(parts, isSVG, !hasAdoptedStyleSheets && styles);
      templatesMap.set(id, render);
    }

    render(host, target, args, hasAdoptedStyleSheets && styles);
  };

  return Object.assign(createTemplate, methods);
}

function html(parts) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return create(parts, args);
}

function svg(parts) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return create(parts, args, true);
}

Object.assign(html, helpers);
Object.assign(svg, helpers);
},{"../define.js":"node_modules/hybrids/esm/define.js","./core.js":"node_modules/hybrids/esm/template/core.js","./helpers.js":"node_modules/hybrids/esm/template/helpers.js"}],"node_modules/hybrids/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "define", {
  enumerable: true,
  get: function () {
    return _define.default;
  }
});
Object.defineProperty(exports, "property", {
  enumerable: true,
  get: function () {
    return _property.default;
  }
});
Object.defineProperty(exports, "parent", {
  enumerable: true,
  get: function () {
    return _parent.default;
  }
});
Object.defineProperty(exports, "children", {
  enumerable: true,
  get: function () {
    return _children.default;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _render.default;
  }
});
Object.defineProperty(exports, "dispatch", {
  enumerable: true,
  get: function () {
    return _utils.dispatch;
  }
});
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _index.html;
  }
});
Object.defineProperty(exports, "svg", {
  enumerable: true,
  get: function () {
    return _index.svg;
  }
});

var _define = _interopRequireDefault(require("./define.js"));

var _property = _interopRequireDefault(require("./property.js"));

var _parent = _interopRequireDefault(require("./parent.js"));

var _children = _interopRequireDefault(require("./children.js"));

var _render = _interopRequireDefault(require("./render.js"));

var _utils = require("./utils.js");

var _index = require("./template/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./define.js":"node_modules/hybrids/esm/define.js","./property.js":"node_modules/hybrids/esm/property.js","./parent.js":"node_modules/hybrids/esm/parent.js","./children.js":"node_modules/hybrids/esm/children.js","./render.js":"node_modules/hybrids/esm/render.js","./utils.js":"node_modules/hybrids/esm/utils.js","./template/index.js":"node_modules/hybrids/esm/template/index.js"}],"src/fs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tileosFs = void 0;

var _hybrids = require("hybrids");

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n                i'm good, wbu?\n            "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n                    hi there\n                "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n                i'm good, wbu?\n            "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n                hi there\n            "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Folder = function Folder(name, nodes) {
  _classCallCheck(this, Folder);

  this.name = name;
  this.nodes = nodes;
};

var File = function File(name, content) {
  _classCallCheck(this, File);

  this.name = name;
  this.content = content;
};

var FileSystem = /*#__PURE__*/function () {
  function FileSystem(tree) {
    _classCallCheck(this, FileSystem);

    this.tree = tree;
    this.crumbs = [tree];
  }

  _createClass(FileSystem, [{
    key: "ls",
    value: function ls() {
      var _this$crumbs$slice = this.crumbs.slice(-1),
          _this$crumbs$slice2 = _slicedToArray(_this$crumbs$slice, 1),
          focus = _this$crumbs$slice2[0];

      var results = [];

      if (focus instanceof Folder) {
        var _iterator = _createForOfIteratorHelper(focus.nodes),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var node = _step.value;

            if (node instanceof Folder) {
              results.push(node.name + "/");
            } else {
              results.push(node.name);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      return results;
    }
  }, {
    key: "pwd",
    value: function pwd() {
      return this.crumbs.map(function (crumb) {
        return crumb.name;
      }).join("/");
    }
  }, {
    key: "cd",
    value: function cd(path) {
      var _iterator2 = _createForOfIteratorHelper(path.split("/")),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var name = _step2.value;

          if (name === "..") {
            this._fsUp();
          } else {
            this._fsTo(name);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "_fsUp",
    value: function _fsUp() {
      if (this.crumbs.length > 1) this.crumbs.pop();
      return this;
    }
  }, {
    key: "_fsTo",
    value: function _fsTo(name) {
      var _this$crumbs$slice3 = this.crumbs.slice(-1),
          _this$crumbs$slice4 = _slicedToArray(_this$crumbs$slice3, 1),
          focus = _this$crumbs$slice4[0];

      if (focus instanceof File) {
        return this;
      }

      var nodes = focus.nodes;
      var i = nodes.findIndex(function (node) {
        return node.name == name;
      });
      if (i < 0) return this;
      this.crumbs.push(nodes[i]);
      return this;
    }
  }]);

  return FileSystem;
}();

var tileosFs = new FileSystem(new Folder("root", [new File("file-1", (0, _hybrids.html)(_templateObject())), new File("file-2", (0, _hybrids.html)(_templateObject2())), new Folder("more-files", [new File("file-3", (0, _hybrids.html)(_templateObject3()))]), new File("file-4", (0, _hybrids.html)(_templateObject4()))]));
exports.tileosFs = tileosFs;
},{"hybrids":"node_modules/hybrids/esm/index.js"}],"src/apps/ferb.js":[function(require,module,exports) {

"use strict";

var _hybrids = require("hybrids");

var _fs = require("../fs");

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n    <style>\n        :host {\n            display: block;\n            position: relative;\n            height: 100%;\n        }\n        .results {\n            overflow: scroll;\n            max-height: 90%; \n        }\n\n        .result {\n            max-width: 100%;\n            display: flex;\n            min-height: 16px;\n        }\n\n        .result > div {\n            overflow-wrap: anywhere;\n        }\n\n        .prompt {\n            display: flex;\n            position: absolute;\n            bottom: 16px;\n            width: 100%;\n            border-top: 2px solid white;\n            font-family: monospace;\n        }\n\n        .prompt span, .result span {\n            padding-right: 10px;\n            font-size: 16px;\n        }\n\n        .prompt input {\n            height: 16px;\n            width: 100%;\n            background: black;\n            color: cyan;\n            border: none;\n            padding: 0px;\n            font-family: monospace;\n            font-weight: bold;\n        }\n\n        .prompt input:focus {\n            outline: none;\n        }\n\n        \n    </style>\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n                ", "\n                <div class=\"results\">\n                    ", "\n                </div>\n                <div class=\"prompt\">\n                    <span>$</span>\n                    <input \n                        type=\"text\" \n                        onkeyup=", "\n                    ></input>\n                </div>\n        "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n            <div class=\"result\">\n                <span>&gt;</span>\n                <div>\n                    ", "\n                </div>\n            </div>\n        "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["[error] command ", " not recognized"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["this is helping you"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function runCommand(host, event) {
  if (event.keyCode === 13) {
    var command = event.target.value.split(" ");
    if (command.length === 0) return;
    event.target.value = "";
    var result = [];

    switch (command[0].toLowerCase()) {
      case "ls":
        {
          result.push(host.fs.ls());
          result.flat();
        }
        break;

      case "pwd":
        result.push(host.fs.pwd());
        break;

      case "cd":
        host.fs.cd(command[1]);
        break;

      case "clear":
        host.results = [];
        break;

      case "help":
        result.push((0, _hybrids.html)(_templateObject()));
        break;

      default:
        result.push((0, _hybrids.html)(_templateObject2(), command));
        break;
    }

    host.results = [].concat(_toConsumableArray(host.results), result);
    host.resultsContainer.scrollTop = host.resultsContainer.scrollHeight;
  }
}

function renderResults(results) {
  return results.map(function (result) {
    return (0, _hybrids.html)(_templateObject3(), result);
  });
}

var Terminal = {
  results: [],
  resultsContainer: function resultsContainer(_ref) {
    var render = _ref.render;
    var target = render();
    return target.querySelector(".results");
  },
  fs: function fs() {
    return _fs.tileosFs;
  },
  render: function render(_ref2) {
    var results = _ref2.results;
    return (0, _hybrids.html)(_templateObject4(), styles, renderResults(results), runCommand);
  }
};
var styles = (0, _hybrids.html)(_templateObject5());
(0, _hybrids.define)("tileos-ferb", Terminal);
},{"hybrids":"node_modules/hybrids/esm/index.js","../fs":"src/fs.js"}],"src/superfluent/icon.js":[function(require,module,exports) {

"use strict";

var _hybrids = require("hybrids");

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n    <style>\n        :host {\n            display: block;\n            width: fit-content;\n        }\n\n        :host > div {\n            height: 64px;\n            width: 64px;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            flex-direction: column;\n        }\n\n        :host > div:hover {\n            opacity: 0.7;\n            outline: 1px black solid;\n            cursor: pointer;\n        }\n\n        span {\n            font-size: 0.75rem;\n        }\n    </style>\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        ", "\n        <div>\n            <img src=\"https://picsum.photos/", "\" draggable=\"false\" />\n            <span>", "</span>\n        </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Icon = {
  size: 40,
  name: "[no-name]",
  render: function render(_ref) {
    var size = _ref.size,
        name = _ref.name;
    return (0, _hybrids.html)(_templateObject(), styles, size, name);
  }
};
var styles = (0, _hybrids.html)(_templateObject2());
(0, _hybrids.define)("tileos-icon", Icon);
},{"hybrids":"node_modules/hybrids/esm/index.js"}],"src/superfluent/header.js":[function(require,module,exports) {

"use strict";

var _hybrids = require("hybrids");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n            <div>", "</div>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Header = {
  name: "[no-name]",
  render: function render(_ref) {
    var name = _ref.name;
    return (0, _hybrids.html)(_templateObject(), name);
  }
};
(0, _hybrids.define)("tileos-app-header", Header);
},{"hybrids":"node_modules/hybrids/esm/index.js"}],"src/superfluent/app.js":[function(require,module,exports) {

"use strict";

var _hybrids = require("hybrids");

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n    <style>\n        :host {\n            display: block;\n            width: 500px;\n            height: 500px;\n            background: black;\n            color: white;\n            border: 3px white solid;\n        }\n    </style>\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n            <tileos-app-header name=", "></tileos-app-header>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var App = {
  name: {
    observe: function observe(host) {
      var name = host.name;
      var app = document.createElement(name);
      host.appendChild(app);
    }
  },
  render: (0, _hybrids.render)(function (_ref) {
    var name = _ref.name;
    return (0, _hybrids.html)(_templateObject(), name);
  }, {
    shadowRoot: false
  })
};
var styles = (0, _hybrids.html)(_templateObject2());
(0, _hybrids.define)("tileos-app", App);
},{"hybrids":"node_modules/hybrids/esm/index.js"}],"src/superfluent/dock.js":[function(require,module,exports) {

"use strict";

var _hybrids = require("hybrids");

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n    <style>\n        :host {\n            height: 25px;\n            width: 100%;\n            background: #d3cfca;\n            position: fixed;\n            bottom: 0px;\n            display: flex;\n            padding: 5px;\n        }\n\n        button {\n            background: inherit;\n            border-color: white black black white;\n        }\n\n        button:focus {\n            outline: none;\n        }\n\n        button:active {\n            border-color: black white white black;\n        }\n        \n        .divider {\n            border-left: grey 3px solid;\n            margin: 0px 10px;\n        }\n    </style>\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n        ", "\n        <button>start</button>\n        <div class=\"divider\"></div>\n        ", "\n    "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["<button>", "</button>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var renderAppTabs = function renderAppTabs(openApps) {
  return openApps.map(function (appName) {
    return (0, _hybrids.html)(_templateObject(), appName);
  });
};

var Dock = {
  openApps: [],
  render: function render(_ref) {
    var openApps = _ref.openApps;
    return (0, _hybrids.html)(_templateObject2(), styles, renderAppTabs(openApps));
  }
};
var styles = (0, _hybrids.html)(_templateObject3());
(0, _hybrids.define)("tileos-dock", Dock);
},{"hybrids":"node_modules/hybrids/esm/index.js"}],"src/tileos.js":[function(require,module,exports) {

"use strict";

var _hybrids = require("hybrids");

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n        <div class=\"apps\">\n            ", "\n        </div>\n        <tileos-dock></tileos-dock>\n    "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n            <tileos-app name=", "></tileos-app>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var registeredApps = ["tileos-ferb" // "cool-chess",
];

function renderApps(apps) {
  return apps.map(function (name) {
    return (0, _hybrids.html)(_templateObject(), name);
  });
}

var BabySharkDoDoDoDo = {
  apps: registeredApps,
  render: (0, _hybrids.render)(function (_ref) {
    var apps = _ref.apps;
    return (0, _hybrids.html)(_templateObject2(), renderApps(apps));
  }, {
    shadowRoot: false
  })
};
(0, _hybrids.define)("tileos-is-the-best", BabySharkDoDoDoDo);
},{"hybrids":"node_modules/hybrids/esm/index.js"}],"../../../../node_modules/interactjs/dist/interact.min.js":[function(require,module,exports) {
var define;
var global = arguments[3];
/* interact.js 1.9.8 | https://raw.github.com/taye/interact.js/master/LICENSE */
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).interact=t()}}(function(){function t(e){var n;return function(t){return n||e(n={exports:{},parent:t},n.exports),n.exports}}var k=t(function(t,e){"use strict";function a(t){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=e.Interactable=void 0;var u=r(S),l=n(C),s=n(V),c=n(ct),f=r(w),p=n(ft),i=n(bt),d=m({});function n(t){return t&&t.__esModule?t:{default:t}}function v(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return v=function(){return t},t}function r(t){if(t&&t.__esModule)return t;if(null===t||"object"!==a(t)&&"function"!=typeof t)return{default:t};var e=v();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function y(t,e,n){return e&&o(t.prototype,e),n&&o(t,n),t}function h(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var g=function(){function o(t,e,n,r){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,o),this._scopeEvents=r,h(this,"options",void 0),h(this,"_actions",void 0),h(this,"target",void 0),h(this,"events",new i.default),h(this,"_context",void 0),h(this,"_win",void 0),h(this,"_doc",void 0),this._actions=e.actions,this.target=t,this._context=e.context||n,this._win=(0,O.getWindow)((0,$.trySelector)(t)?this._context:t),this._doc=this._win.document,this.set(e)}return y(o,[{key:"_defaults",get:function(){return{base:{},perAction:{},actions:{}}}}]),y(o,[{key:"setOnEvents",value:function(t,e){return f.func(e.onstart)&&this.on("".concat(t,"start"),e.onstart),f.func(e.onmove)&&this.on("".concat(t,"move"),e.onmove),f.func(e.onend)&&this.on("".concat(t,"end"),e.onend),f.func(e.oninertiastart)&&this.on("".concat(t,"inertiastart"),e.oninertiastart),this}},{key:"updatePerActionListeners",value:function(t,e,n){(f.array(e)||f.object(e))&&this.off(t,e),(f.array(n)||f.object(n))&&this.on(t,n)}},{key:"setPerAction",value:function(t,e){var n=this._defaults;for(var r in e){var o=r,i=this.options[t],a=e[o];"listeners"===o&&this.updatePerActionListeners(t,i.listeners,a),f.array(a)?i[o]=u.from(a):f.plainObject(a)?(i[o]=(0,c.default)(i[o]||{},(0,s.default)(a)),f.object(n.perAction[o])&&"enabled"in n.perAction[o]&&(i[o].enabled=!1!==a.enabled)):f.bool(a)&&f.object(n.perAction[o])?i[o].enabled=a:i[o]=a}}},{key:"getRect",value:function(t){return t=t||(f.element(this.target)?this.target:null),f.string(this.target)&&(t=t||this._context.querySelector(this.target)),(0,$.getElementRect)(t)}},{key:"rectChecker",value:function(t){return f.func(t)?(this.getRect=t,this):null===t?(delete this.getRect,this):this.getRect}},{key:"_backCompatOption",value:function(t,e){if((0,$.trySelector)(e)||f.object(e)){for(var n in this.options[t]=e,this._actions.map)this.options[n][t]=e;return this}return this.options[t]}},{key:"origin",value:function(t){return this._backCompatOption("origin",t)}},{key:"deltaSource",value:function(t){return"page"===t||"client"===t?(this.options.deltaSource=t,this):this.options.deltaSource}},{key:"context",value:function(){return this._context}},{key:"inContext",value:function(t){return this._context===t.ownerDocument||(0,$.nodeContains)(this._context,t)}},{key:"testIgnoreAllow",value:function(t,e,n){return!this.testIgnore(t.ignoreFrom,e,n)&&this.testAllow(t.allowFrom,e,n)}},{key:"testAllow",value:function(t,e,n){return!t||!!f.element(n)&&(f.string(t)?(0,$.matchesUpTo)(n,t,e):!!f.element(t)&&(0,$.nodeContains)(t,n))}},{key:"testIgnore",value:function(t,e,n){return!(!t||!f.element(n))&&(f.string(t)?(0,$.matchesUpTo)(n,t,e):!!f.element(t)&&(0,$.nodeContains)(t,n))}},{key:"fire",value:function(t){return this.events.fire(t),this}},{key:"_onOff",value:function(t,e,n,r){f.object(e)&&!f.array(e)&&(r=n,n=null);var o="on"===t?"add":"remove",i=(0,p.default)(e,n);for(var a in i){"wheel"===a&&(a=l.default.wheelEvent);for(var u=0;u<i[a].length;u++){var s=i[a][u];(0,d.isNonNativeEvent)(a,this._actions)?this.events[t](a,s):f.string(this.target)?this._scopeEvents["".concat(o,"Delegate")](this.target,this._context,a,s,r):this._scopeEvents[o](this.target,a,s,r)}}return this}},{key:"on",value:function(t,e,n){return this._onOff("on",t,e,n)}},{key:"off",value:function(t,e,n){return this._onOff("off",t,e,n)}},{key:"set",value:function(t){var e=this._defaults;for(var n in f.object(t)||(t={}),this.options=(0,s.default)(e.base),this._actions.methodDict){var r=n,o=this._actions.methodDict[r];this.options[r]={},this.setPerAction(r,(0,c.default)((0,c.default)({},e.perAction),e.actions[r])),this[o](t[r])}for(var i in t)f.func(this[i])&&this[i](t[i]);return this}},{key:"unset",value:function(){if(f.string(this.target))for(var t in this._scopeEvents.delegatedEvents)for(var e=this._scopeEvents.delegatedEvents[t],n=e.length-1;0<=n;n--){var r=e[n],o=r.selector,i=r.context,a=r.listeners;o===this.target&&i===this._context&&e.splice(n,1);for(var u=a.length-1;0<=u;u--)this._scopeEvents.removeDelegate(this.target,this._context,t,a[u][0],a[u][1])}else this._scopeEvents.remove(this.target,"all")}}]),o}(),b=e.Interactable=g;e.default=b}),m=t(function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.isNonNativeEvent=function(t,e){if(e.phaselessTypes[t])return!0;for(var n in e.map)if(0===t.indexOf(n)&&t.substr(n.length)in e.phases)return!0;return!1},e.initScope=M,e.Scope=e.default=void 0;var n=d(D),r=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==v(t)&&"function"!=typeof t)return{default:t};var e=p();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le),o=d(bt),i=d(We),a=d(T({})),u=d(k({})),s=d(Ze),l=d(ze),c=d(cn),f=d(E({}));function p(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return p=function(){return t},t}function d(t){return t&&t.__esModule?t:{default:t}}function v(t){return(v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function y(t,e){return!e||"object"!==v(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function h(t,e,n){return(h="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=g(t)););return t}(t,e);if(r){var o=Object.getOwnPropertyDescriptor(r,e);return o.get?o.get.call(n):o.value}})(t,e,n||t)}function g(t){return(g=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function b(t,e){return(b=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function m(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function O(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function w(t,e,n){return e&&O(t.prototype,e),n&&O(t,n),t}function _(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var P=r.win,x=r.browser,S=r.raf,j=function(){function t(){var e=this;m(this,t),_(this,"id","__interact_scope_".concat(Math.floor(100*Math.random()))),_(this,"isInitialized",!1),_(this,"listenerMaps",[]),_(this,"browser",x),_(this,"utils",r),_(this,"defaults",r.clone(l.default)),_(this,"Eventable",o.default),_(this,"actions",{map:{},phases:{start:!0,move:!0,end:!0},methodDict:{},phaselessTypes:{}}),_(this,"interactStatic",new a.default(this)),_(this,"InteractEvent",i.default),_(this,"Interactable",void 0),_(this,"interactables",new s.default(this)),_(this,"_win",void 0),_(this,"document",void 0),_(this,"window",void 0),_(this,"documents",[]),_(this,"_plugins",{list:[],map:{}}),_(this,"onWindowUnload",function(t){return e.removeDocument(t.target)});var n=this;this.Interactable=function(){function e(){return m(this,e),y(this,g(e).apply(this,arguments))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&b(t,e)}(e,u["default"]),w(e,[{key:"set",value:function(t){return h(g(e.prototype),"set",this).call(this,t),n.fire("interactable:set",{options:t,interactable:this}),this}},{key:"unset",value:function(){h(g(e.prototype),"unset",this).call(this),n.interactables.list.splice(n.interactables.list.indexOf(this),1),n.fire("interactable:unset",{interactable:this})}},{key:"_defaults",get:function(){return n.defaults}}]),e}()}return w(t,[{key:"addListeners",value:function(t,e){this.listenerMaps.push({id:e,map:t})}},{key:"fire",value:function(t,e){for(var n=0;n<this.listenerMaps.length;n++){var r=this.listenerMaps[n].map[t];if(r&&!1===r(e,this,t))return!1}}},{key:"init",value:function(t){return this.isInitialized?this:M(this,t)}},{key:"pluginIsInstalled",value:function(t){return this._plugins.map[t.id]||-1!==this._plugins.list.indexOf(t)}},{key:"usePlugin",value:function(t,e){if(this.pluginIsInstalled(t))return this;if(t.id&&(this._plugins.map[t.id]=t),this._plugins.list.push(t),t.install&&t.install(this,e),t.listeners&&t.before){for(var n=0,r=this.listenerMaps.length,o=t.before.reduce(function(t,e){return t[e]=!0,t},{});n<r;n++){if(o[this.listenerMaps[n].id])break}this.listenerMaps.splice(n,0,{id:t.id,map:t.listeners})}else t.listeners&&this.listenerMaps.push({id:t.id,map:t.listeners});return this}},{key:"addDocument",value:function(t,e){if(-1!==this.getDocIndex(t))return!1;var n=P.getWindow(t);e=e?r.extend({},e):{},this.documents.push({doc:t,options:e}),this.events.documents.push(t),t!==this.document&&this.events.add(n,"unload",this.onWindowUnload),this.fire("scope:add-document",{doc:t,window:n,scope:this,options:e})}},{key:"removeDocument",value:function(t){var e=this.getDocIndex(t),n=P.getWindow(t),r=this.documents[e].options;this.events.remove(n,"unload",this.onWindowUnload),this.documents.splice(e,1),this.events.documents.splice(e,1),this.fire("scope:remove-document",{doc:t,window:n,scope:this,options:r})}},{key:"getDocIndex",value:function(t){for(var e=0;e<this.documents.length;e++)if(this.documents[e].doc===t)return e;return-1}},{key:"getDocOptions",value:function(t){var e=this.getDocIndex(t);return-1===e?null:this.documents[e].options}},{key:"now",value:function(){return(this.window.Date||Date).now()}}]),t}();function M(t,e){return t.isInitialized=!0,P.init(e),n.default.init(e),x.init(e),S.init(e),t.window=e,t.document=e.document,t.usePlugin(f.default),t.usePlugin(c.default),t}e.Scope=e.default=j}),E=t(function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var _=n(C),u=n(D),P=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==c(t)&&"function"!=typeof t)return{default:t};var e=a();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(zt),s=n(En),l=n(Un),o=n(tr);n(m({}));function a(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return a=function(){return t},t}function n(t){return t&&t.__esModule?t:{default:t}}function c(t){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function x(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function f(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function p(t,e){return!e||"object"!==c(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function v(t,e){return(v=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var y=["pointerDown","pointerMove","pointerUp","updatePointer","removePointer","windowBlur"];function h(O,w){return function(t){var e=w.interactions.list,n=P.getPointerType(t),r=x(P.getEventTargets(t),2),o=r[0],i=r[1],a=[];if(/^touch/.test(t.type)){w.prevTouchTime=w.now();for(var u=0;u<t.changedTouches.length;u++){s=t.changedTouches[u];var s,l={pointer:s,pointerId:P.getPointerId(s),pointerType:n,eventType:t.type,eventTarget:o,curEventTarget:i,scope:w},c=S(l);a.push([l.pointer,l.eventTarget,l.curEventTarget,c])}}else{var f=!1;if(!_.default.supportsPointerEvent&&/mouse/.test(t.type)){for(var p=0;p<e.length&&!f;p++)f="mouse"!==e[p].pointerType&&e[p].pointerIsDown;f=f||w.now()-w.prevTouchTime<500||0===t.timeStamp}if(!f){var d={pointer:t,pointerId:P.getPointerId(t),pointerType:n,eventType:t.type,curEventTarget:i,eventTarget:o,scope:w},v=S(d);a.push([d.pointer,d.eventTarget,d.curEventTarget,v])}}for(var y=0;y<a.length;y++){var h=x(a[y],4),g=h[0],b=h[1],m=h[2];h[3][O](g,t,b,m)}}}function S(t){var e=t.pointerType,n=t.scope,r={interaction:o.default.search(t),searchDetails:t};return n.fire("interactions:find",r),r.interaction||n.interactions.new({pointerType:e})}function r(t,e){var n=t.doc,r=t.scope,o=t.options,i=r.interactions.docEvents,a=r.events,u=a[e];for(var s in r.browser.isIOS&&!o.events&&(o.events={passive:!1}),a.delegatedEvents)u(n,s,a.delegateListener),u(n,s,a.delegateUseCapture,!0);for(var l=o&&o.events,c=0;c<i.length;c++){var f;f=i[c];u(n,f.type,f.listener,l)}}var i={id:"core/interactions",install:function(o){for(var t={},e=0;e<y.length;e++){var n;n=y[e];t[n]=h(n,o)}var r,i=_.default.pEventTypes;function a(){for(var t=0;t<o.interactions.list.length;t++){var e=o.interactions.list[t];if(e.pointerIsDown&&"touch"===e.pointerType&&!e._interacting)for(var n=function(){var n=e.pointers[r];o.documents.some(function(t){var e=t.doc;return(0,$.nodeContains)(e,n.downTarget)})||e.removePointer(n.pointer,n.event)},r=0;r<e.pointers.length;r++){n()}}}(r=u.default.PointerEvent?[{type:i.down,listener:a},{type:i.down,listener:t.pointerDown},{type:i.move,listener:t.pointerMove},{type:i.up,listener:t.pointerUp},{type:i.cancel,listener:t.pointerUp}]:[{type:"mousedown",listener:t.pointerDown},{type:"mousemove",listener:t.pointerMove},{type:"mouseup",listener:t.pointerUp},{type:"touchstart",listener:a},{type:"touchstart",listener:t.pointerDown},{type:"touchmove",listener:t.pointerMove},{type:"touchend",listener:t.pointerUp},{type:"touchcancel",listener:t.pointerUp}]).push({type:"blur",listener:function(t){for(var e=0;e<o.interactions.list.length;e++){o.interactions.list[e].documentBlur(t)}}}),o.prevTouchTime=0,o.Interaction=function(){function t(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),p(this,d(t).apply(this,arguments))}var e,n,r;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&v(t,e)}(t,s["default"]),e=t,(n=[{key:"_now",value:function(){return o.now()}},{key:"pointerMoveTolerance",get:function(){return o.interactions.pointerMoveTolerance},set:function(t){o.interactions.pointerMoveTolerance=t}}])&&f(e.prototype,n),r&&f(e,r),t}(),o.interactions={list:[],new:function(t){t.scopeFire=function(t,e){return o.fire(t,e)};var e=new o.Interaction(t);return o.interactions.list.push(e),e},listeners:t,docEvents:r,pointerMoveTolerance:1},o.usePlugin(l.default)},listeners:{"scope:add-document":function(t){return r(t,"add")},"scope:remove-document":function(t){return r(t,"remove")},"interactable:unset":function(t,e){for(var n=t.interactable,r=e.interactions.list.length-1;0<=r;r--){var o=e.interactions.list[r];o.interactable===n&&(o.stop(),e.fire("interactions:destroy",{interaction:o}),o.destroy(),2<e.interactions.list.length&&e.interactions.list.splice(r,1))}}},onDocSignal:r,doOnInteractions:h,methodNames:y};e.default=i}),T=t(function(t,e){"use strict";function a(t){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=e.InteractStatic=void 0;var n,r=(n=C)&&n.__esModule?n:{default:n},u=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==a(t)&&"function"!=typeof t)return{default:t};var e=l();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le),s=m({});function l(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return l=function(){return t},t}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function c(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var i=function(){function a(r){var o=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,a),this.scope=r,c(this,"getPointerAverage",u.pointer.pointerAverage),c(this,"getTouchBBox",u.pointer.touchBBox),c(this,"getTouchDistance",u.pointer.touchDistance),c(this,"getTouchAngle",u.pointer.touchAngle),c(this,"getElementRect",u.dom.getElementRect),c(this,"getElementClientRect",u.dom.getElementClientRect),c(this,"matchesSelector",u.dom.matchesSelector),c(this,"closest",u.dom.closest),c(this,"globalEvents",{}),c(this,"dynamicDrop",void 0),c(this,"version","1.9.8"),c(this,"interact",void 0);for(var t=this.constructor.prototype,e=function(t,e){var n=r.interactables.get(t,e);return n||((n=r.interactables.new(t,e)).events.global=o.globalEvents),n},n=0;n<Object.getOwnPropertyNames(this.constructor.prototype).length;n++){var i;i=Object.getOwnPropertyNames(this.constructor.prototype)[n];e[i]=t[i]}return u.extend(e,this),e.constructor=this.constructor,this.interact=e}var t,e,n;return t=a,(e=[{key:"use",value:function(t,e){return this.scope.usePlugin(t,e),this}},{key:"isSet",value:function(t,e){return!!this.scope.interactables.get(t,e&&e.context)}},{key:"on",value:function(t,e,n){if(u.is.string(t)&&-1!==t.search(" ")&&(t=t.trim().split(/ +/)),u.is.array(t)){for(var r=0;r<t.length;r++){var o=t[r];this.on(o,e,n)}return this}if(u.is.object(t)){for(var i in t)this.on(i,t[i],e);return this}return(0,s.isNonNativeEvent)(t,this.scope.actions)?this.globalEvents[t]?this.globalEvents[t].push(e):this.globalEvents[t]=[e]:this.scope.events.add(this.scope.document,t,e,{options:n}),this}},{key:"off",value:function(t,e,n){if(u.is.string(t)&&-1!==t.search(" ")&&(t=t.trim().split(/ +/)),u.is.array(t)){for(var r=0;r<t.length;r++){var o=t[r];this.off(o,e,n)}return this}if(u.is.object(t)){for(var i in t)this.off(i,t[i],e);return this}var a;(0,s.isNonNativeEvent)(t,this.scope.actions)?t in this.globalEvents&&-1!==(a=this.globalEvents[t].indexOf(e))&&this.globalEvents[t].splice(a,1):this.scope.events.remove(this.scope.document,t,e,n);return this}},{key:"debug",value:function(){return this.scope}},{key:"supportsTouch",value:function(){return r.default.supportsTouch}},{key:"supportsPointerEvent",value:function(){return r.default.supportsPointerEvent}},{key:"stop",value:function(){for(var t=0;t<this.scope.interactions.list.length;t++){this.scope.interactions.list[t].stop()}return this}},{key:"pointerMoveTolerance",value:function(t){return u.is.number(t)?(this.scope.interactions.pointerMoveTolerance=t,this):this.scope.interactions.pointerMoveTolerance}},{key:"addDocument",value:function(t,e){this.scope.addDocument(t,e)}},{key:"removeDocument",value:function(t){this.scope.removeDocument(t)}}])&&o(t.prototype,e),n&&o(t,n),a}(),f=e.InteractStatic=i;e.default=f}),e={};Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;e.default=function(t){return!(!t||!t.Window)&&t instanceof t.Window};var O={};Object.defineProperty(O,"__esModule",{value:!0}),O.init=i,O.getWindow=a,O.default=void 0;var n,r=(n=e)&&n.__esModule?n:{default:n};var o={realWindow:void 0,window:void 0,getWindow:a,init:i};function i(t){var e=(o.realWindow=t).document.createTextNode("");e.ownerDocument!==t.document&&"function"==typeof t.wrap&&t.wrap(e)===e&&(t=t.wrap(t)),o.window=t}function a(t){return(0,r.default)(t)?t:(t.ownerDocument||t).defaultView||o.window}"undefined"==typeof window?(o.window=void 0,o.realWindow=void 0):i(window),o.init=i;var u=o;O.default=u;var w={};Object.defineProperty(w,"__esModule",{value:!0}),w.array=w.plainObject=w.element=w.string=w.bool=w.number=w.func=w.object=w.docFrag=w.window=void 0;var s=c(e),l=c(O);function c(t){return t&&t.__esModule?t:{default:t}}function f(t){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}w.window=function(t){return t===l.default.window||(0,s.default)(t)};w.docFrag=function(t){return p(t)&&11===t.nodeType};var p=function(t){return!!t&&"object"===f(t)};w.object=p;function d(t){return"function"==typeof t}w.func=d;w.number=function(t){return"number"==typeof t};w.bool=function(t){return"boolean"==typeof t};w.string=function(t){return"string"==typeof t};w.element=function(t){if(!t||"object"!==f(t))return!1;var e=l.default.getWindow(t)||l.default.window;return/object|function/.test(f(e.Element))?t instanceof e.Element:1===t.nodeType&&"string"==typeof t.nodeName};w.plainObject=function(t){return p(t)&&!!t.constructor&&/function Object\b/.test(t.constructor.toString())};w.array=function(t){return p(t)&&void 0!==t.length&&d(t.splice)};var v={};function y(t){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(v,"__esModule",{value:!0}),v.default=void 0;var h=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==y(t)&&"function"!=typeof t)return{default:t};var e=g();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w);function g(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return g=function(){return t},t}function b(t){var e=t.interaction;if("drag"===e.prepared.name){var n=e.prepared.axis;"x"===n?(e.coords.cur.page.y=e.coords.start.page.y,e.coords.cur.client.y=e.coords.start.client.y,e.coords.velocity.client.y=0,e.coords.velocity.page.y=0):"y"===n&&(e.coords.cur.page.x=e.coords.start.page.x,e.coords.cur.client.x=e.coords.start.client.x,e.coords.velocity.client.x=0,e.coords.velocity.page.x=0)}}function _(t){var e=t.iEvent,n=t.interaction;if("drag"===n.prepared.name){var r=n.prepared.axis;if("x"===r||"y"===r){var o="x"===r?"y":"x";e.page[o]=n.coords.start.page[o],e.client[o]=n.coords.start.client[o],e.delta[o]=0}}}var P={id:"actions/drag",install:function(t){var e=t.actions,n=t.Interactable,r=t.defaults;n.prototype.draggable=P.draggable,e.map.drag=P,e.methodDict.drag="draggable",r.actions.drag=P.defaults},listeners:{"interactions:before-action-move":b,"interactions:action-resume":b,"interactions:action-move":_,"auto-start:check":function(t){var e=t.interaction,n=t.interactable,r=t.buttons,o=n.options.drag;if(o&&o.enabled&&(!e.pointerIsDown||!/mouse|pointer/.test(e.pointerType)||0!=(r&n.options.drag.mouseButtons)))return!(t.action={name:"drag",axis:"start"===o.lockAxis?o.startAxis:o.lockAxis})}},draggable:function(t){return h.object(t)?(this.options.drag.enabled=!1!==t.enabled,this.setPerAction("drag",t),this.setOnEvents("drag",t),/^(xy|x|y|start)$/.test(t.lockAxis)&&(this.options.drag.lockAxis=t.lockAxis),/^(xy|x|y)$/.test(t.startAxis)&&(this.options.drag.startAxis=t.startAxis),this):h.bool(t)?(this.options.drag.enabled=t,this):this.options.drag},beforeMove:b,move:_,defaults:{startAxis:"xy",lockAxis:"xy"},getCursor:function(){return"move"}},x=P;v.default=x;var S={};Object.defineProperty(S,"__esModule",{value:!0}),S.find=S.findIndex=S.from=S.merge=S.remove=S.contains=void 0;S.contains=function(t,e){return-1!==t.indexOf(e)};S.remove=function(t,e){return t.splice(t.indexOf(e),1)};function j(t,e){for(var n=0;n<e.length;n++){var r=e[n];t.push(r)}return t}S.merge=j;S.from=function(t){return j([],t)};function M(t,e){for(var n=0;n<t.length;n++)if(e(t[n],n,t))return n;return-1}S.findIndex=M;S.find=function(t,e){return t[M(t,e)]};var D={};Object.defineProperty(D,"__esModule",{value:!0}),D.default=void 0;var I={init:function(t){var e=t;I.document=e.document,I.DocumentFragment=e.DocumentFragment||z,I.SVGElement=e.SVGElement||z,I.SVGSVGElement=e.SVGSVGElement||z,I.SVGElementInstance=e.SVGElementInstance||z,I.Element=e.Element||z,I.HTMLElement=e.HTMLElement||I.Element,I.Event=e.Event,I.Touch=e.Touch||z,I.PointerEvent=e.PointerEvent||e.MSPointerEvent},document:null,DocumentFragment:null,SVGElement:null,SVGSVGElement:null,SVGElementInstance:null,Element:null,HTMLElement:null,Event:null,Touch:null,PointerEvent:null};function z(){}var A=I;D.default=A;var C={};function W(t){return(W="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(C,"__esModule",{value:!0}),C.default=void 0;var R=N(D),F=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==W(t)&&"function"!=typeof t)return{default:t};var e=Y();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w),X=N(O);function Y(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Y=function(){return t},t}function N(t){return t&&t.__esModule?t:{default:t}}var L={init:function(t){var e=R.default.Element,n=X.default.window.navigator;L.supportsTouch="ontouchstart"in t||F.func(t.DocumentTouch)&&R.default.document instanceof t.DocumentTouch,L.supportsPointerEvent=!1!==n.pointerEnabled&&!!R.default.PointerEvent,L.isIOS=/iP(hone|od|ad)/.test(n.platform),L.isIOS7=/iP(hone|od|ad)/.test(n.platform)&&/OS 7[^\d]/.test(n.appVersion),L.isIe9=/MSIE 9/.test(n.userAgent),L.isOperaMobile="Opera"===n.appName&&L.supportsTouch&&/Presto/.test(n.userAgent),L.prefixedMatchesSelector="matches"in e.prototype?"matches":"webkitMatchesSelector"in e.prototype?"webkitMatchesSelector":"mozMatchesSelector"in e.prototype?"mozMatchesSelector":"oMatchesSelector"in e.prototype?"oMatchesSelector":"msMatchesSelector",L.pEventTypes=L.supportsPointerEvent?R.default.PointerEvent===t.MSPointerEvent?{up:"MSPointerUp",down:"MSPointerDown",over:"mouseover",out:"mouseout",move:"MSPointerMove",cancel:"MSPointerCancel"}:{up:"pointerup",down:"pointerdown",over:"pointerover",out:"pointerout",move:"pointermove",cancel:"pointercancel"}:null,L.wheelEvent="onmousewheel"in R.default.document?"mousewheel":"wheel"},supportsTouch:null,supportsPointerEvent:null,isIOS7:null,isIOS:null,isIe9:null,isOperaMobile:null,prefixedMatchesSelector:null,pEventTypes:null,wheelEvent:null};var B=L;C.default=B;var V={};function q(t){return(q="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(V,"__esModule",{value:!0}),V.default=function t(e){var n={};for(var r in e){var o=e[r];G.plainObject(o)?n[r]=t(o):G.array(o)?n[r]=U.from(o):n[r]=o}return n};var U=K(S),G=K(w);function H(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return H=function(){return t},t}function K(t){if(t&&t.__esModule)return t;if(null===t||"object"!==q(t)&&"function"!=typeof t)return{default:t};var e=H();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}var $={};function Z(t){return(Z="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty($,"__esModule",{value:!0}),$.nodeContains=function(t,e){for(;e;){if(e===t)return!0;e=e.parentNode}return!1},$.closest=function(t,e){for(;tt.element(t);){if(at(t,e))return t;t=it(t)}return null},$.parentNode=it,$.matchesSelector=at,$.indexOfDeepestElement=function(t){var e,n,r=[],o=t[0],i=o?0:-1;for(e=1;e<t.length;e++){var a=t[e];if(a&&a!==o)if(o){if(a.parentNode!==a.ownerDocument)if(o.parentNode!==a.ownerDocument)if(a.parentNode!==o.parentNode){if(!r.length)for(var u=o,s=void 0;(s=ut(u))&&s!==u.ownerDocument;)r.unshift(u),u=s;var l=void 0;if(o instanceof Q.default.HTMLElement&&a instanceof Q.default.SVGElement&&!(a instanceof Q.default.SVGSVGElement)){if(a===o.parentNode)continue;l=a.ownerSVGElement}else l=a;for(var c=[];l.parentNode!==l.ownerDocument;)c.unshift(l),l=ut(l);for(n=0;c[n]&&c[n]===r[n];)n++;for(var f=[c[n-1],c[n],r[n]],p=f[0].lastChild;p;){if(p===f[1]){o=a,i=e,r=c;break}if(p===f[2])break;p=p.previousSibling}}else{var d=parseInt((0,et.getWindow)(o).getComputedStyle(o).zIndex,10)||0,v=parseInt((0,et.getWindow)(a).getComputedStyle(a).zIndex,10)||0;d<=v&&(o=a,i=e)}else o=a,i=e}else o=a,i=e}return i},$.matchesUpTo=function(t,e,n){for(;tt.element(t);){if(at(t,e))return!0;if((t=it(t))===n)return at(t,e)}return!1},$.getActualElement=function(t){return t instanceof Q.default.SVGElementInstance?t.correspondingUseElement:t},$.getScrollXY=st,$.getElementClientRect=lt,$.getElementRect=function(t){var e=lt(t);if(!J.default.isIOS7&&e){var n=st(et.default.getWindow(t));e.left+=n.x,e.right+=n.x,e.top+=n.y,e.bottom+=n.y}return e},$.getPath=function(t){var e=[];for(;t;)e.push(t),t=it(t);return e},$.trySelector=function(t){return!!tt.string(t)&&(Q.default.document.querySelector(t),!0)};var J=ot(C),Q=ot(D),tt=rt(w),et=rt(O);function nt(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return nt=function(){return t},t}function rt(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Z(t)&&"function"!=typeof t)return{default:t};var e=nt();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function ot(t){return t&&t.__esModule?t:{default:t}}function it(t){var e=t.parentNode;if(tt.docFrag(e)){for(;(e=e.host)&&tt.docFrag(e););return e}return e}function at(t,e){return et.default.window!==et.default.realWindow&&(e=e.replace(/\/deep\//g," ")),t[J.default.prefixedMatchesSelector](e)}var ut=function(t){return t.parentNode?t.parentNode:t.host};function st(t){return{x:(t=t||et.default.window).scrollX||t.document.documentElement.scrollLeft,y:t.scrollY||t.document.documentElement.scrollTop}}function lt(t){var e=t instanceof Q.default.SVGElement?t.getBoundingClientRect():t.getClientRects()[0];return e&&{left:e.left,right:e.right,top:e.top,bottom:e.bottom,width:e.width||e.right-e.left,height:e.height||e.bottom-e.top}}var ct={};Object.defineProperty(ct,"__esModule",{value:!0}),ct.default=function(t,e){for(var n in e)t[n]=e[n];return t};var ft={};function pt(t){return(pt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(ft,"__esModule",{value:!0}),ft.default=function n(e,r,o){o=o||{};yt.string(e)&&-1!==e.search(" ")&&(e=gt(e));if(yt.array(e))return e.reduce(function(t,e){return(0,vt.default)(t,n(e,r,o))},o);yt.object(e)&&(r=e,e="");if(yt.func(r))o[e]=o[e]||[],o[e].push(r);else if(yt.array(r))for(var t=0;t<r.length;t++){var i=r[t];n(e,i,o)}else if(yt.object(r))for(var a in r){var u=gt(a).map(function(t){return"".concat(e).concat(t)});n(u,r[a],o)}return o};var dt,vt=(dt=ct)&&dt.__esModule?dt:{default:dt},yt=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==pt(t)&&"function"!=typeof t)return{default:t};var e=ht();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w);function ht(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return ht=function(){return t},t}function gt(t){return t.trim().split(/ +/)}var bt={};function mt(t){return(mt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(bt,"__esModule",{value:!0}),bt.default=void 0;var Ot=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==mt(t)&&"function"!=typeof t)return{default:t};var e=xt();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(S),wt=Pt(ct),_t=Pt(ft);function Pt(t){return t&&t.__esModule?t:{default:t}}function xt(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return xt=function(){return t},t}function St(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function jt(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function Mt(t,e){for(var n=0;n<e.length;n++){var r=e[n];if(t.immediatePropagationStopped)break;r(t)}}var kt=function(){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),jt(this,"options",void 0),jt(this,"types",{}),jt(this,"propagationStopped",!1),jt(this,"immediatePropagationStopped",!1),jt(this,"global",void 0),this.options=(0,wt.default)({},t||{})}var t,n,r;return t=e,(n=[{key:"fire",value:function(t){var e,n=this.global;(e=this.types[t.type])&&Mt(t,e),!t.propagationStopped&&n&&(e=n[t.type])&&Mt(t,e)}},{key:"on",value:function(t,e){var n=(0,_t.default)(t,e);for(t in n)this.types[t]=Ot.merge(this.types[t]||[],n[t])}},{key:"off",value:function(t,e){var n=(0,_t.default)(t,e);for(t in n){var r=this.types[t];if(r&&r.length)for(var o=0;o<n[t].length;o++){var i=n[t][o],a=r.indexOf(i);-1!==a&&r.splice(a,1)}}}},{key:"getRect",value:function(){return null}}])&&St(t.prototype,n),r&&St(t,r),e}();bt.default=kt;var Et={};Object.defineProperty(Et,"__esModule",{value:!0}),Et.default=void 0;Et.default=function(t,e){return Math.sqrt(t*t+e*e)};var Tt={};function Dt(t,e){for(var n in e){var r=Dt.prefixedPropREs,o=!1;for(var i in r)if(0===n.indexOf(i)&&r[i].test(n)){o=!0;break}o||"function"==typeof e[n]||(t[n]=e[n])}return t}Object.defineProperty(Tt,"__esModule",{value:!0}),Tt.default=void 0,Dt.prefixedPropREs={webkit:/(Movement[XY]|Radius[XY]|RotationAngle|Force)$/,moz:/(Pressure)$/};var It=Dt;Tt.default=It;var zt={};function At(t){return(At="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(zt,"__esModule",{value:!0}),zt.copyCoords=function(t,e){t.page=t.page||{},t.page.x=e.page.x,t.page.y=e.page.y,t.client=t.client||{},t.client.x=e.client.x,t.client.y=e.client.y,t.timeStamp=e.timeStamp},zt.setCoordDeltas=function(t,e,n){t.page.x=n.page.x-e.page.x,t.page.y=n.page.y-e.page.y,t.client.x=n.client.x-e.client.x,t.client.y=n.client.y-e.client.y,t.timeStamp=n.timeStamp-e.timeStamp},zt.setCoordVelocity=function(t,e){var n=Math.max(e.timeStamp/1e3,.001);t.page.x=e.page.x/n,t.page.y=e.page.y/n,t.client.x=e.client.x/n,t.client.y=e.client.y/n,t.timeStamp=n},zt.setZeroCoords=function(t){t.page.x=0,t.page.y=0,t.client.x=0,t.client.y=0},zt.isNativePointer=Vt,zt.getXY=qt,zt.getPageXY=Ut,zt.getClientXY=Gt,zt.getPointerId=function(t){return Xt.number(t.pointerId)?t.pointerId:t.identifier},zt.setCoords=function(t,e,n){var r=1<e.length?Kt(e):e[0],o={};Ut(r,o),t.page.x=o.x,t.page.y=o.y,Gt(r,o),t.client.x=o.x,t.client.y=o.y,t.timeStamp=n},zt.getTouchPair=Ht,zt.pointerAverage=Kt,zt.touchBBox=function(t){if(!(t.length||t.touches&&1<t.touches.length))return null;var e=Ht(t),n=Math.min(e[0].pageX,e[1].pageX),r=Math.min(e[0].pageY,e[1].pageY),o=Math.max(e[0].pageX,e[1].pageX),i=Math.max(e[0].pageY,e[1].pageY);return{x:n,y:r,left:n,top:r,right:o,bottom:i,width:o-n,height:i-r}},zt.touchDistance=function(t,e){var n=e+"X",r=e+"Y",o=Ht(t),i=o[0][n]-o[1][n],a=o[0][r]-o[1][r];return(0,Ft.default)(i,a)},zt.touchAngle=function(t,e){var n=e+"X",r=e+"Y",o=Ht(t),i=o[1][n]-o[0][n],a=o[1][r]-o[0][r];return 180*Math.atan2(a,i)/Math.PI},zt.getPointerType=function(t){return Xt.string(t.pointerType)?t.pointerType:Xt.number(t.pointerType)?[void 0,void 0,"touch","pen","mouse"][t.pointerType]:/touch/.test(t.type)||t instanceof Wt.default.Touch?"touch":"mouse"},zt.getEventTargets=function(t){var e=Xt.func(t.composedPath)?t.composedPath():t.path;return[Rt.getActualElement(e?e[0]:t.target),Rt.getActualElement(t.currentTarget)]},zt.newCoords=function(){return{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0}},zt.coordsToEvent=function(t){return{coords:t,get page(){return this.coords.page},get client(){return this.coords.client},get timeStamp(){return this.coords.timeStamp},get pageX(){return this.coords.page.x},get pageY(){return this.coords.page.y},get clientX(){return this.coords.client.x},get clientY(){return this.coords.client.y},get pointerId(){return this.coords.pointerId},get target(){return this.coords.target},get type(){return this.coords.type},get pointerType(){return this.coords.pointerType},get buttons(){return this.coords.buttons},preventDefault:function(){}}},Object.defineProperty(zt,"pointerExtend",{enumerable:!0,get:function(){return Yt.default}});var Ct=Bt(C),Wt=Bt(D),Rt=Lt($),Ft=Bt(Et),Xt=Lt(w),Yt=Bt(Tt);function Nt(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Nt=function(){return t},t}function Lt(t){if(t&&t.__esModule)return t;if(null===t||"object"!==At(t)&&"function"!=typeof t)return{default:t};var e=Nt();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function Bt(t){return t&&t.__esModule?t:{default:t}}function Vt(t){return t instanceof Wt.default.Event||t instanceof Wt.default.Touch}function qt(t,e,n){return(n=n||{}).x=e[(t=t||"page")+"X"],n.y=e[t+"Y"],n}function Ut(t,e){return e=e||{x:0,y:0},Ct.default.isOperaMobile&&Vt(t)?(qt("screen",t,e),e.x+=window.scrollX,e.y+=window.scrollY):qt("page",t,e),e}function Gt(t,e){return e=e||{},Ct.default.isOperaMobile&&Vt(t)?qt("screen",t,e):qt("client",t,e),e}function Ht(t){var e=[];return Xt.array(t)?(e[0]=t[0],e[1]=t[1]):"touchend"===t.type?1===t.touches.length?(e[0]=t.touches[0],e[1]=t.changedTouches[0]):0===t.touches.length&&(e[0]=t.changedTouches[0],e[1]=t.changedTouches[1]):(e[0]=t.touches[0],e[1]=t.touches[1]),e}function Kt(t){for(var e={pageX:0,pageY:0,clientX:0,clientY:0,screenX:0,screenY:0},n=0;n<t.length;n++){var r=t[n];for(var o in e)e[o]+=r[o]}for(var i in e)e[i]/=t.length;return e}var $t={};function Zt(t){return(Zt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty($t,"__esModule",{value:!0}),$t.getStringOptionResult=ne,$t.resolveRectLike=function(t,e,n,r){var o=t;te.string(o)?o=ne(o,e,n):te.func(o)&&(o=o.apply(void 0,function(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}(r)));te.element(o)&&(o=(0,$.getElementRect)(o));return o},$t.rectToXY=function(t){return t&&{x:"x"in t?t.x:t.left,y:"y"in t?t.y:t.top}},$t.xywhToTlbr=function(t){!t||"left"in t&&"top"in t||((t=(0,Qt.default)({},t)).left=t.x||0,t.top=t.y||0,t.right=t.right||t.left+t.width,t.bottom=t.bottom||t.top+t.height);return t},$t.tlbrToXywh=function(t){!t||"x"in t&&"y"in t||((t=(0,Qt.default)({},t)).x=t.left||0,t.y=t.top||0,t.width=t.width||t.right||0-t.x,t.height=t.height||t.bottom||0-t.y);return t},$t.addEdges=function(t,e,n){t.left&&(e.left+=n.x);t.right&&(e.right+=n.x);t.top&&(e.top+=n.y);t.bottom&&(e.bottom+=n.y);e.width=e.right-e.left,e.height=e.bottom-e.top};var Jt,Qt=(Jt=ct)&&Jt.__esModule?Jt:{default:Jt},te=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Zt(t)&&"function"!=typeof t)return{default:t};var e=ee();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w);function ee(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return ee=function(){return t},t}function ne(t,e,n){return"parent"===t?(0,$.parentNode)(n):"self"===t?e.getRect(n):(0,$.closest)(n,t)}var re={};Object.defineProperty(re,"__esModule",{value:!0}),re.default=function(t,e,n){var r=t.options[n],o=r&&r.origin||t.options.origin,i=(0,$t.resolveRectLike)(o,t,e,[t&&e]);return(0,$t.rectToXY)(i)||{x:0,y:0}};var oe={};Object.defineProperty(oe,"__esModule",{value:!0}),oe.default=void 0;var ie,ae,ue=0;var se={request:function(t){return ie(t)},cancel:function(t){return ae(t)},init:function(t){if(ie=t.requestAnimationFrame,ae=t.cancelAnimationFrame,!ie)for(var e=["ms","moz","webkit","o"],n=0;n<e.length;n++){var r=e[n];ie=t["".concat(r,"RequestAnimationFrame")],ae=t["".concat(r,"CancelAnimationFrame")]||t["".concat(r,"CancelRequestAnimationFrame")]}ie||(ie=function(t){var e=Date.now(),n=Math.max(0,16-(e-ue)),r=setTimeout(function(){t(e+n)},n);return ue=e+n,r},ae=function(t){return clearTimeout(t)})}};oe.default=se;var le={};function ce(t){return(ce="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(le,"__esModule",{value:!0}),le.warnOnce=function(t,e){var n=!1;return function(){return n||(he.default.window.console.warn(e),n=!0),t.apply(this,arguments)}},le.copyAction=function(t,e){return t.name=e.name,t.axis=e.axis,t.edges=e.edges,t},Object.defineProperty(le,"win",{enumerable:!0,get:function(){return he.default}}),Object.defineProperty(le,"browser",{enumerable:!0,get:function(){return ge.default}}),Object.defineProperty(le,"clone",{enumerable:!0,get:function(){return be.default}}),Object.defineProperty(le,"extend",{enumerable:!0,get:function(){return me.default}}),Object.defineProperty(le,"getOriginXY",{enumerable:!0,get:function(){return Oe.default}}),Object.defineProperty(le,"hypot",{enumerable:!0,get:function(){return we.default}}),Object.defineProperty(le,"normalizeListeners",{enumerable:!0,get:function(){return _e.default}}),Object.defineProperty(le,"raf",{enumerable:!0,get:function(){return Pe.default}}),le.rect=le.pointer=le.is=le.dom=le.arr=void 0;var fe=je(S);le.arr=fe;var pe=je($);le.dom=pe;var de=je(w);le.is=de;var ve=je(zt);le.pointer=ve;var ye=je($t);le.rect=ye;var he=xe(O),ge=xe(C),be=xe(V),me=xe(ct),Oe=xe(re),we=xe(Et),_e=xe(ft),Pe=xe(oe);function xe(t){return t&&t.__esModule?t:{default:t}}function Se(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Se=function(){return t},t}function je(t){if(t&&t.__esModule)return t;if(null===t||"object"!==ce(t)&&"function"!=typeof t)return{default:t};var e=Se();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}var Me={};function ke(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Ee(t,e,n){return e&&ke(t.prototype,e),n&&ke(t,n),t}function Te(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty(Me,"__esModule",{value:!0}),Me.default=Me.BaseEvent=void 0;var De=function(){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),Te(this,"type",void 0),Te(this,"target",void 0),Te(this,"currentTarget",void 0),Te(this,"interactable",void 0),Te(this,"_interaction",void 0),Te(this,"timeStamp",void 0),Te(this,"immediatePropagationStopped",!1),Te(this,"propagationStopped",!1),this._interaction=t}return Ee(e,[{key:"interaction",get:function(){return this._interaction._proxy}}]),Ee(e,[{key:"preventDefault",value:function(){}},{key:"stopPropagation",value:function(){this.propagationStopped=!0}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0}}]),e}(),Ie=Me.BaseEvent=De;Me.default=Ie;var ze={};Object.defineProperty(ze,"__esModule",{value:!0}),ze.default=ze.defaults=void 0;var Ae={base:{preventDefault:"auto",deltaSource:"page"},perAction:{enabled:!1,origin:{x:0,y:0}},actions:{}},Ce=ze.defaults=Ae;ze.default=Ce;var We={};Object.defineProperty(We,"__esModule",{value:!0}),We.default=We.InteractEvent=void 0;var Re=Le(ct),Fe=Le(re),Xe=Le(Et),Ye=Le(Me),Ne=Le(ze);function Le(t){return t&&t.__esModule?t:{default:t}}function Be(t){return(Be="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Ve(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function qe(t){return(qe=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function Ue(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function Ge(t,e){return(Ge=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function He(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var Ke=function(){function g(t,e,n,r,o,i,a){var u,s,l;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,g),s=this,u=!(l=qe(g).call(this,t))||"object"!==Be(l)&&"function"!=typeof l?Ue(s):l,He(Ue(u),"target",void 0),He(Ue(u),"currentTarget",void 0),He(Ue(u),"relatedTarget",null),He(Ue(u),"screenX",void 0),He(Ue(u),"screenY",void 0),He(Ue(u),"button",void 0),He(Ue(u),"buttons",void 0),He(Ue(u),"ctrlKey",void 0),He(Ue(u),"shiftKey",void 0),He(Ue(u),"altKey",void 0),He(Ue(u),"metaKey",void 0),He(Ue(u),"page",void 0),He(Ue(u),"client",void 0),He(Ue(u),"delta",void 0),He(Ue(u),"rect",void 0),He(Ue(u),"x0",void 0),He(Ue(u),"y0",void 0),He(Ue(u),"t0",void 0),He(Ue(u),"dt",void 0),He(Ue(u),"duration",void 0),He(Ue(u),"clientX0",void 0),He(Ue(u),"clientY0",void 0),He(Ue(u),"velocity",void 0),He(Ue(u),"speed",void 0),He(Ue(u),"swipe",void 0),He(Ue(u),"timeStamp",void 0),He(Ue(u),"dragEnter",void 0),He(Ue(u),"dragLeave",void 0),He(Ue(u),"axes",void 0),He(Ue(u),"preEnd",void 0),o=o||t.element;var c=t.interactable,f=(c&&c.options||Ne.default).deltaSource,p=(0,Fe.default)(c,o,n),d="start"===r,v="end"===r,y=d?Ue(u):t.prevEvent,h=d?t.coords.start:v?{page:y.page,client:y.client,timeStamp:t.coords.cur.timeStamp}:t.coords.cur;return u.page=(0,Re.default)({},h.page),u.client=(0,Re.default)({},h.client),u.rect=(0,Re.default)({},t.rect),u.timeStamp=h.timeStamp,v||(u.page.x-=p.x,u.page.y-=p.y,u.client.x-=p.x,u.client.y-=p.y),u.ctrlKey=e.ctrlKey,u.altKey=e.altKey,u.shiftKey=e.shiftKey,u.metaKey=e.metaKey,u.button=e.button,u.buttons=e.buttons,u.target=o,u.currentTarget=o,u.preEnd=i,u.type=a||n+(r||""),u.interactable=c,u.t0=d?t.pointers[t.pointers.length-1].downTime:y.t0,u.x0=t.coords.start.page.x-p.x,u.y0=t.coords.start.page.y-p.y,u.clientX0=t.coords.start.client.x-p.x,u.clientY0=t.coords.start.client.y-p.y,u.delta=d||v?{x:0,y:0}:{x:u[f].x-y[f].x,y:u[f].y-y[f].y},u.dt=t.coords.delta.timeStamp,u.duration=u.timeStamp-u.t0,u.velocity=(0,Re.default)({},t.coords.velocity[f]),u.speed=(0,Xe.default)(u.velocity.x,u.velocity.y),u.swipe=v||"inertiastart"===r?u.getSwipe():null,u}var t,e,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&Ge(t,e)}(g,Ye["default"]),t=g,(e=[{key:"getSwipe",value:function(){var t=this._interaction;if(t.prevEvent.speed<600||150<this.timeStamp-t.prevEvent.timeStamp)return null;var e=180*Math.atan2(t.prevEvent.velocityY,t.prevEvent.velocityX)/Math.PI;e<0&&(e+=360);var n=112.5<=e&&e<247.5,r=202.5<=e&&e<337.5;return{up:r,down:!r&&22.5<=e&&e<157.5,left:n,right:!n&&(292.5<=e||e<67.5),angle:e,speed:t.prevEvent.speed,velocity:{x:t.prevEvent.velocityX,y:t.prevEvent.velocityY}}}},{key:"preventDefault",value:function(){}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0}},{key:"stopPropagation",value:function(){this.propagationStopped=!0}},{key:"pageX",get:function(){return this.page.x},set:function(t){this.page.x=t}},{key:"pageY",get:function(){return this.page.y},set:function(t){this.page.y=t}},{key:"clientX",get:function(){return this.client.x},set:function(t){this.client.x=t}},{key:"clientY",get:function(){return this.client.y},set:function(t){this.client.y=t}},{key:"dx",get:function(){return this.delta.x},set:function(t){this.delta.x=t}},{key:"dy",get:function(){return this.delta.y},set:function(t){this.delta.y=t}},{key:"velocityX",get:function(){return this.velocity.x},set:function(t){this.velocity.x=t}},{key:"velocityY",get:function(){return this.velocity.y},set:function(t){this.velocity.y=t}}])&&Ve(t.prototype,e),n&&Ve(t,n),g}(),$e=We.InteractEvent=Ke;We.default=$e;var Ze={};function Je(t){return(Je="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Ze,"__esModule",{value:!0}),Ze.default=void 0;var Qe,tn=an(S),en=an($),nn=(Qe=ct)&&Qe.__esModule?Qe:{default:Qe},rn=an(w);function on(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return on=function(){return t},t}function an(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Je(t)&&"function"!=typeof t)return{default:t};var e=on();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function un(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function sn(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var ln=function(){function e(t){var a=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),this.scope=t,sn(this,"list",[]),sn(this,"selectorMap",{}),t.addListeners({"interactable:unset":function(t){var e=t.interactable,n=e.target,r=e._context,o=rn.string(n)?a.selectorMap[n]:n[a.scope.id],i=o.findIndex(function(t){return t.context===r});o[i]&&(o[i].context=null,o[i].interactable=null),o.splice(i,1)}})}var t,n,r;return t=e,(n=[{key:"new",value:function(t,e){e=(0,nn.default)(e||{},{actions:this.scope.actions});var n=new this.scope.Interactable(t,e,this.scope.document,this.scope.events),r={context:n._context,interactable:n};return this.scope.addDocument(n._doc),this.list.push(n),rn.string(t)?(this.selectorMap[t]||(this.selectorMap[t]=[]),this.selectorMap[t].push(r)):(n.target[this.scope.id]||Object.defineProperty(t,this.scope.id,{value:[],configurable:!0}),t[this.scope.id].push(r)),this.scope.fire("interactable:new",{target:t,options:e,interactable:n,win:this.scope._win}),n}},{key:"get",value:function(e,t){var n=t&&t.context||this.scope.document,r=rn.string(e),o=r?this.selectorMap[e]:e[this.scope.id];if(!o)return null;var i=tn.find(o,function(t){return t.context===n&&(r||t.interactable.inContext(e))});return i&&i.interactable}},{key:"forEachMatch",value:function(t,e){for(var n=0;n<this.list.length;n++){var r=this.list[n],o=void 0;if((rn.string(r.target)?rn.element(t)&&en.matchesSelector(t,r.target):t===r.target)&&r.inContext(t)&&(o=e(r)),void 0!==o)return o}}}])&&un(t.prototype,n),r&&un(t,r),e}();Ze.default=ln;var cn={};function fn(t){return(fn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(cn,"__esModule",{value:!0}),cn.default=cn.FakeEvent=void 0;var pn=On(S),dn=On($),vn=bn(ct),yn=On(w),hn=bn(Tt),gn=On(zt);function bn(t){return t&&t.__esModule?t:{default:t}}function mn(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return mn=function(){return t},t}function On(t){if(t&&t.__esModule)return t;if(null===t||"object"!==fn(t)&&"function"!=typeof t)return{default:t};var e=mn();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function wn(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _n(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var Pn=function(){function o(t){var e,n,r;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,o),this.originalEvent=t,r=void 0,(n="currentTarget")in(e=this)?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,(0,hn.default)(this,t)}var t,e,n;return t=o,(e=[{key:"preventOriginalDefault",value:function(){this.originalEvent.preventDefault()}},{key:"stopPropagation",value:function(){this.originalEvent.stopPropagation()}},{key:"stopImmediatePropagation",value:function(){this.originalEvent.stopImmediatePropagation()}}])&&wn(t.prototype,e),n&&wn(t,n),o}();function xn(t){if(!yn.object(t))return{capture:!!t,passive:!1};var e=(0,vn.default)({},t);return e.capture=!!t.capture,e.passive=!!t.passive,e}cn.FakeEvent=Pn;var Sn={id:"events",install:function(t){var f=[],b={},c=[],p={add:d,remove:g,addDelegate:function(e,n,t,r,o){var i=xn(o);if(!b[t]){b[t]=[];for(var a=0;a<c.length;a++){var u=c[a];d(u,t,m),d(u,t,O,!0)}}var s=b[t],l=pn.find(s,function(t){return t.selector===e&&t.context===n});l||(l={selector:e,context:n,listeners:[]},s.push(l));l.listeners.push([r,i])},removeDelegate:function(t,e,n,r,o){var i,a=xn(o),u=b[n],s=!1;if(!u)return;for(i=u.length-1;0<=i;i--){var l=u[i];if(l.selector===t&&l.context===e){for(var c=l.listeners,f=c.length-1;0<=f;f--){var p=_n(c[f],2),d=p[0],v=p[1],y=v.capture,h=v.passive;if(d===r&&y===a.capture&&h===a.passive){c.splice(f,1),c.length||(u.splice(i,1),g(e,n,m),g(e,n,O,!0)),s=!0;break}}if(s)break}}},delegateListener:m,delegateUseCapture:O,delegatedEvents:b,documents:c,targets:f,supportsOptions:!1,supportsPassive:!1};function d(e,t,n,r){var o=xn(r),i=pn.find(f,function(t){return t.eventTarget===e});i||(i={eventTarget:e,events:{}},f.push(i)),i.events[t]||(i.events[t]=[]),e.addEventListener&&!pn.contains(i.events[t],n)&&(e.addEventListener(t,n,p.supportsOptions?o:o.capture),i.events[t].push(n))}function g(e,t,n,r){var o=xn(r),i=pn.findIndex(f,function(t){return t.eventTarget===e}),a=f[i];if(a&&a.events)if("all"!==t){var u=!1,s=a.events[t];if(s){if("all"===n){for(var l=s.length-1;0<=l;l--)g(e,t,s[l],o);return}for(var c=0;c<s.length;c++)if(s[c]===n){e.removeEventListener(t,n,p.supportsOptions?o:o.capture),s.splice(c,1),0===s.length&&(delete a.events[t],u=!0);break}}u&&!Object.keys(a.events).length&&f.splice(i,1)}else for(t in a.events)a.events.hasOwnProperty(t)&&g(e,t,"all")}function m(t,e){for(var n=xn(e),r=new Pn(t),o=b[t.type],i=_n(gn.getEventTargets(t),1)[0],a=i;yn.element(a);){for(var u=0;u<o.length;u++){var s=o[u],l=s.selector,c=s.context;if(dn.matchesSelector(a,l)&&dn.nodeContains(c,i)&&dn.nodeContains(c,a)){var f=s.listeners;r.currentTarget=a;for(var p=0;p<f.length;p++){var d=_n(f[p],2),v=d[0],y=d[1],h=y.capture,g=y.passive;h===n.capture&&g===n.passive&&v(r)}}}a=dn.parentNode(a)}}function O(t){return m.call(this,t,!0)}return t.document.createElement("div").addEventListener("test",null,{get capture(){return p.supportsOptions=!0},get passive(){return p.supportsPassive=!0}}),t.events=p}};cn.default=Sn;var jn={};Object.defineProperty(jn,"__esModule",{value:!0}),jn.default=jn.PointerInfo=void 0;function Mn(t,e,n,r,o){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,Mn),this.id=t,this.pointer=e,this.event=n,this.downTime=r,this.downTarget=o}var kn=jn.PointerInfo=Mn;jn.default=kn;var En={};function Tn(t){return(Tn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(En,"__esModule",{value:!0}),Object.defineProperty(En,"PointerInfo",{enumerable:!0,get:function(){return Rn.default}}),En.default=En.Interaction=En._ProxyMethods=En._ProxyValues=void 0;var Dn,In,zn,An,Cn=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Tn(t)&&"function"!=typeof t)return{default:t};var e=Xn();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le),Wn=Fn(We),Rn=Fn(jn);function Fn(t){return t&&t.__esModule?t:{default:t}}function Xn(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Xn=function(){return t},t}function Yn(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Nn(t,e,n){return e&&Yn(t.prototype,e),n&&Yn(t,n),t}function Ln(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}En._ProxyValues=Dn,(In=Dn||(En._ProxyValues=Dn={})).interactable="",In.element="",In.prepared="",In.pointerIsDown="",In.pointerWasMoved="",In._proxy="",En._ProxyMethods=zn,(An=zn||(En._ProxyMethods=zn={})).start="",An.move="",An.end="",An.stop="",An.interacting="";var Bn=0,Vn=function(){function l(t){var e=this,n=t.pointerType,r=t.scopeFire;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,l),Ln(this,"interactable",null),Ln(this,"element",null),Ln(this,"rect",void 0),Ln(this,"_rects",void 0),Ln(this,"edges",void 0),Ln(this,"_scopeFire",void 0),Ln(this,"prepared",{name:null,axis:null,edges:null}),Ln(this,"pointerType",void 0),Ln(this,"pointers",[]),Ln(this,"downEvent",null),Ln(this,"downPointer",{}),Ln(this,"_latestPointer",{pointer:null,event:null,eventTarget:null}),Ln(this,"prevEvent",null),Ln(this,"pointerIsDown",!1),Ln(this,"pointerWasMoved",!1),Ln(this,"_interacting",!1),Ln(this,"_ending",!1),Ln(this,"_stopped",!0),Ln(this,"_proxy",null),Ln(this,"simulation",null),Ln(this,"doMove",Cn.warnOnce(function(t){this.move(t)},"The interaction.doMove() method has been renamed to interaction.move()")),Ln(this,"coords",{start:Cn.pointer.newCoords(),prev:Cn.pointer.newCoords(),cur:Cn.pointer.newCoords(),delta:Cn.pointer.newCoords(),velocity:Cn.pointer.newCoords()}),Ln(this,"_id",Bn++),this._scopeFire=r,this.pointerType=n;var o=this;this._proxy={};function i(t){Object.defineProperty(e._proxy,t,{get:function(){return o[t]}})}for(var a in Dn)i(a);function u(t){Object.defineProperty(e._proxy,t,{value:function(){return o[t].apply(o,arguments)}})}for(var s in zn)u(s);this._scopeFire("interactions:new",{interaction:this})}return Nn(l,[{key:"pointerMoveTolerance",get:function(){return 1}}]),Nn(l,[{key:"pointerDown",value:function(t,e,n){var r=this.updatePointer(t,e,n,!0),o=this.pointers[r];this._scopeFire("interactions:down",{pointer:t,event:e,eventTarget:n,pointerIndex:r,pointerInfo:o,type:"down",interaction:this})}},{key:"start",value:function(t,e,n){return!(this.interacting()||!this.pointerIsDown||this.pointers.length<("gesture"===t.name?2:1)||!e.options[t.name].enabled)&&(Cn.copyAction(this.prepared,t),this.interactable=e,this.element=n,this.rect=e.getRect(n),this.edges=this.prepared.edges?Cn.extend({},this.prepared.edges):{left:!0,right:!0,top:!0,bottom:!0},this._stopped=!1,this._interacting=this._doPhase({interaction:this,event:this.downEvent,phase:"start"})&&!this._stopped,this._interacting)}},{key:"pointerMove",value:function(t,e,n){this.simulation||this.modification&&this.modification.endResult||this.updatePointer(t,e,n,!1);var r,o,i=this.coords.cur.page.x===this.coords.prev.page.x&&this.coords.cur.page.y===this.coords.prev.page.y&&this.coords.cur.client.x===this.coords.prev.client.x&&this.coords.cur.client.y===this.coords.prev.client.y;this.pointerIsDown&&!this.pointerWasMoved&&(r=this.coords.cur.client.x-this.coords.start.client.x,o=this.coords.cur.client.y-this.coords.start.client.y,this.pointerWasMoved=Cn.hypot(r,o)>this.pointerMoveTolerance);var a=this.getPointerIndex(t),u={pointer:t,pointerIndex:a,pointerInfo:this.pointers[a],event:e,type:"move",eventTarget:n,dx:r,dy:o,duplicate:i,interaction:this};i||Cn.pointer.setCoordVelocity(this.coords.velocity,this.coords.delta),this._scopeFire("interactions:move",u),i||this.simulation||(this.interacting()&&(u.type=null,this.move(u)),this.pointerWasMoved&&Cn.pointer.copyCoords(this.coords.prev,this.coords.cur))}},{key:"move",value:function(t){t&&t.event||Cn.pointer.setZeroCoords(this.coords.delta),(t=Cn.extend({pointer:this._latestPointer.pointer,event:this._latestPointer.event,eventTarget:this._latestPointer.eventTarget,interaction:this},t||{})).phase="move",this._doPhase(t)}},{key:"pointerUp",value:function(t,e,n,r){var o=this.getPointerIndex(t);-1===o&&(o=this.updatePointer(t,e,n,!1));var i=/cancel$/i.test(e.type)?"cancel":"up";this._scopeFire("interactions:".concat(i),{pointer:t,pointerIndex:o,pointerInfo:this.pointers[o],event:e,eventTarget:n,type:i,curEventTarget:r,interaction:this}),this.simulation||this.end(e),this.pointerIsDown=!1,this.removePointer(t,e)}},{key:"documentBlur",value:function(t){this.end(t),this._scopeFire("interactions:blur",{event:t,type:"blur",interaction:this})}},{key:"end",value:function(t){var e;this._ending=!0,t=t||this._latestPointer.event,this.interacting()&&(e=this._doPhase({event:t,interaction:this,phase:"end"})),!(this._ending=!1)===e&&this.stop()}},{key:"currentAction",value:function(){return this._interacting?this.prepared.name:null}},{key:"interacting",value:function(){return this._interacting}},{key:"stop",value:function(){this._scopeFire("interactions:stop",{interaction:this}),this.interactable=this.element=null,this._interacting=!1,this._stopped=!0,this.prepared.name=this.prevEvent=null}},{key:"getPointerIndex",value:function(t){var e=Cn.pointer.getPointerId(t);return"mouse"===this.pointerType||"pen"===this.pointerType?this.pointers.length-1:Cn.arr.findIndex(this.pointers,function(t){return t.id===e})}},{key:"getPointerInfo",value:function(t){return this.pointers[this.getPointerIndex(t)]}},{key:"updatePointer",value:function(t,e,n,r){var o=Cn.pointer.getPointerId(t),i=this.getPointerIndex(t),a=this.pointers[i];return r=!1!==r&&(r||/(down|start)$/i.test(e.type)),a?a.pointer=t:(a=new Rn.default(o,t,e,null,null),i=this.pointers.length,this.pointers.push(a)),Cn.pointer.setCoords(this.coords.cur,this.pointers.map(function(t){return t.pointer}),this._now()),Cn.pointer.setCoordDeltas(this.coords.delta,this.coords.prev,this.coords.cur),r&&(this.pointerIsDown=!0,a.downTime=this.coords.cur.timeStamp,a.downTarget=n,Cn.pointer.pointerExtend(this.downPointer,t),this.interacting()||(Cn.pointer.copyCoords(this.coords.start,this.coords.cur),Cn.pointer.copyCoords(this.coords.prev,this.coords.cur),this.downEvent=e,this.pointerWasMoved=!1)),this._updateLatestPointer(t,e,n),this._scopeFire("interactions:update-pointer",{pointer:t,event:e,eventTarget:n,down:r,pointerInfo:a,pointerIndex:i,interaction:this}),i}},{key:"removePointer",value:function(t,e){var n=this.getPointerIndex(t);if(-1!==n){var r=this.pointers[n];this._scopeFire("interactions:remove-pointer",{pointer:t,event:e,eventTarget:null,pointerIndex:n,pointerInfo:r,interaction:this}),this.pointers.splice(n,1)}}},{key:"_updateLatestPointer",value:function(t,e,n){this._latestPointer.pointer=t,this._latestPointer.event=e,this._latestPointer.eventTarget=n}},{key:"destroy",value:function(){this._latestPointer.pointer=null,this._latestPointer.event=null,this._latestPointer.eventTarget=null}},{key:"_createPreparedEvent",value:function(t,e,n,r){return new Wn.default(this,t,this.prepared.name,e,this.element,n,r)}},{key:"_fireEvent",value:function(t){this.interactable.fire(t),(!this.prevEvent||t.timeStamp>=this.prevEvent.timeStamp)&&(this.prevEvent=t)}},{key:"_doPhase",value:function(t){var e=t.event,n=t.phase,r=t.preEnd,o=t.type,i=this.rect;if(i&&"move"===n&&(Cn.rect.addEdges(this.edges,i,this.coords.delta[this.interactable.options.deltaSource]),i.width=i.right-i.left,i.height=i.bottom-i.top),!1===this._scopeFire("interactions:before-action-".concat(n),t))return!1;var a=t.iEvent=this._createPreparedEvent(e,n,r,o);return this._scopeFire("interactions:action-".concat(n),t),"start"===n&&(this.prevEvent=a),this._fireEvent(a),this._scopeFire("interactions:after-action-".concat(n),t),!0}},{key:"_now",value:function(){return Date.now()}}]),l}(),qn=En.Interaction=Vn;En.default=qn;var Un={};function Gn(t){return(Gn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Un,"__esModule",{value:!0}),Un.install=Jn,Un.default=void 0;var Hn=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Gn(t)&&"function"!=typeof t)return{default:t};var e=Kn();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w);function Kn(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Kn=function(){return t},t}function $n(t){return/^(always|never|auto)$/.test(t)?(this.options.preventDefault=t,this):Hn.bool(t)?(this.options.preventDefault=t?"always":"never",this):this.options.preventDefault}function Zn(t){var e=t.interaction,n=t.event;e.interactable&&e.interactable.checkAndPreventDefault(n)}function Jn(r){var t=r.Interactable;t.prototype.preventDefault=$n,t.prototype.checkAndPreventDefault=function(t){return function(t,e,n){var r=t.options.preventDefault;if("never"!==r)if("always"!==r){if(e.events.supportsPassive&&/^touch(start|move)$/.test(n.type)){var o=(0,O.getWindow)(n.target).document,i=e.getDocOptions(o);if(!i||!i.events||!1!==i.events.passive)return}/^(mouse|pointer|touch)*(down|start)/i.test(n.type)||Hn.element(n.target)&&(0,$.matchesSelector)(n.target,"input,select,textarea,[contenteditable=true],[contenteditable=true] *")||n.preventDefault()}else n.preventDefault()}(this,r,t)},r.interactions.docEvents.push({type:"dragstart",listener:function(t){for(var e=0;e<r.interactions.list.length;e++){var n=r.interactions.list[e];if(n.element&&(n.element===t.target||(0,$.nodeContains)(n.element,t.target)))return void n.interactable.checkAndPreventDefault(t)}}})}var Qn={id:"core/interactablePreventDefault",install:Jn,listeners:["down","move","up","cancel"].reduce(function(t,e){return t["interactions:".concat(e)]=Zn,t},{})};Un.default=Qn;var tr={};function er(t){return(er="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(tr,"__esModule",{value:!0}),tr.default=void 0;var nr=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==er(t)&&"function"!=typeof t)return{default:t};var e=rr();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}($);function rr(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return rr=function(){return t},t}var or={methodOrder:["simulationResume","mouseOrPen","hasPointer","idle"],search:function(t){for(var e=0;e<or.methodOrder.length;e++){var n;n=or.methodOrder[e];var r=or[n](t);if(r)return r}return null},simulationResume:function(t){var e=t.pointerType,n=t.eventType,r=t.eventTarget,o=t.scope;if(!/down|start/i.test(n))return null;for(var i=0;i<o.interactions.list.length;i++){var a=o.interactions.list[i],u=r;if(a.simulation&&a.simulation.allowResume&&a.pointerType===e)for(;u;){if(u===a.element)return a;u=nr.parentNode(u)}}return null},mouseOrPen:function(t){var e,n=t.pointerId,r=t.pointerType,o=t.eventType,i=t.scope;if("mouse"!==r&&"pen"!==r)return null;for(var a=0;a<i.interactions.list.length;a++){var u=i.interactions.list[a];if(u.pointerType===r){if(u.simulation&&!ir(u,n))continue;if(u.interacting())return u;e=e||u}}if(e)return e;for(var s=0;s<i.interactions.list.length;s++){var l=i.interactions.list[s];if(!(l.pointerType!==r||/down/i.test(o)&&l.simulation))return l}return null},hasPointer:function(t){for(var e=t.pointerId,n=t.scope,r=0;r<n.interactions.list.length;r++){var o=n.interactions.list[r];if(ir(o,e))return o}return null},idle:function(t){for(var e=t.pointerType,n=t.scope,r=0;r<n.interactions.list.length;r++){var o=n.interactions.list[r];if(1===o.pointers.length){var i=o.interactable;if(i&&(!i.options.gesture||!i.options.gesture.enabled))continue}else if(2<=o.pointers.length)continue;if(!o.interacting()&&e===o.pointerType)return o}return null}};function ir(t,e){return t.pointers.some(function(t){return t.id===e})}var ar=or;tr.default=ar;var ur={};Object.defineProperty(ur,"__esModule",{value:!0}),ur.default=void 0;var sr,lr=(sr=Me)&&sr.__esModule?sr:{default:sr},cr=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==pr(t)&&"function"!=typeof t)return{default:t};var e=fr();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(S);function fr(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return fr=function(){return t},t}function pr(t){return(pr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function dr(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function vr(t){return(vr=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function yr(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function hr(t,e){return(hr=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function gr(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var br=function(){function l(t,e,n){var r,o,i;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,l),o=this,r=!(i=vr(l).call(this,e._interaction))||"object"!==pr(i)&&"function"!=typeof i?yr(o):i,gr(yr(r),"target",void 0),gr(yr(r),"dropzone",void 0),gr(yr(r),"dragEvent",void 0),gr(yr(r),"relatedTarget",void 0),gr(yr(r),"draggable",void 0),gr(yr(r),"timeStamp",void 0),gr(yr(r),"propagationStopped",!1),gr(yr(r),"immediatePropagationStopped",!1);var a="dragleave"===n?t.prev:t.cur,u=a.element,s=a.dropzone;return r.type=n,r.target=u,r.currentTarget=u,r.dropzone=s,r.dragEvent=e,r.relatedTarget=e.target,r.draggable=e.interactable,r.timeStamp=e.timeStamp,r}var t,e,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&hr(t,e)}(l,lr["default"]),t=l,(e=[{key:"reject",value:function(){var r=this,t=this._interaction.dropState;if("dropactivate"===this.type||this.dropzone&&t.cur.dropzone===this.dropzone&&t.cur.element===this.target)if(t.prev.dropzone=this.dropzone,t.prev.element=this.target,t.rejected=!0,t.events.enter=null,this.stopImmediatePropagation(),"dropactivate"===this.type){var e=t.activeDrops,n=cr.findIndex(e,function(t){var e=t.dropzone,n=t.element;return e===r.dropzone&&n===r.target});t.activeDrops.splice(n,1);var o=new l(t,this.dragEvent,"dropdeactivate");o.dropzone=this.dropzone,o.target=this.target,this.dropzone.fire(o)}else this.dropzone.fire(new l(t,this.dragEvent,"dragleave"))}},{key:"preventDefault",value:function(){}},{key:"stopPropagation",value:function(){this.propagationStopped=!0}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0}}])&&dr(t.prototype,e),n&&dr(t,n),l}();ur.default=br;var mr={};function Or(t){return(Or="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(mr,"__esModule",{value:!0}),mr.default=void 0;Sr(k({})),Sr(m({}));var wr=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Or(t)&&"function"!=typeof t)return{default:t};var e=xr();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le),_r=Sr(v),Pr=Sr(ur);function xr(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return xr=function(){return t},t}function Sr(t){return t&&t.__esModule?t:{default:t}}function jr(t,e){for(var n=0;n<t.slice().length;n++){r=t.slice()[n];var r,o=r.dropzone,i=r.element;e.dropzone=o,e.target=i,o.fire(e),e.propagationStopped=e.immediatePropagationStopped=!1}}function Mr(t,e){for(var n=function(t,e){for(var n=t.interactables,r=[],o=0;o<n.list.length;o++){var i=n.list[o];if(i.options.drop.enabled){var a=i.options.drop.accept;if(!(wr.is.element(a)&&a!==e||wr.is.string(a)&&!wr.dom.matchesSelector(e,a)||wr.is.func(a)&&!a({dropzone:i,draggableElement:e})))for(var u=wr.is.string(i.target)?i._context.querySelectorAll(i.target):wr.is.array(i.target)?i.target:[i.target],s=0;s<u.length;s++){var l;l=u[s];l!==e&&r.push({dropzone:i,element:l})}}}return r}(t,e),r=0;r<n.length;r++){var o;o=n[r];o.rect=o.dropzone.getRect(o.element)}return n}function kr(t,e,n){for(var r=t.dropState,o=t.interactable,i=t.element,a=[],u=0;u<r.activeDrops.length;u++){s=r.activeDrops[u];var s,l=s.dropzone,c=s.element,f=s.rect;a.push(l.dropCheck(e,n,o,i,c,f)?c:null)}var p=wr.dom.indexOfDeepestElement(a);return r.activeDrops[p]||null}function Er(t,e,n){var r=t.dropState,o={enter:null,leave:null,activate:null,deactivate:null,move:null,drop:null};return"dragstart"===n.type&&(o.activate=new Pr.default(r,n,"dropactivate"),o.activate.target=null,o.activate.dropzone=null),"dragend"===n.type&&(o.deactivate=new Pr.default(r,n,"dropdeactivate"),o.deactivate.target=null,o.deactivate.dropzone=null),r.rejected||(r.cur.element!==r.prev.element&&(r.prev.dropzone&&(o.leave=new Pr.default(r,n,"dragleave"),n.dragLeave=o.leave.target=r.prev.element,n.prevDropzone=o.leave.dropzone=r.prev.dropzone),r.cur.dropzone&&(o.enter=new Pr.default(r,n,"dragenter"),n.dragEnter=r.cur.element,n.dropzone=r.cur.dropzone)),"dragend"===n.type&&r.cur.dropzone&&(o.drop=new Pr.default(r,n,"drop"),n.dropzone=r.cur.dropzone,n.relatedTarget=r.cur.element),"dragmove"===n.type&&r.cur.dropzone&&(o.move=new Pr.default(r,n,"dropmove"),(o.move.dragmove=n).dropzone=r.cur.dropzone)),o}function Tr(t,e){var n=t.dropState,r=n.activeDrops,o=n.cur,i=n.prev;e.leave&&i.dropzone.fire(e.leave),e.move&&o.dropzone.fire(e.move),e.enter&&o.dropzone.fire(e.enter),e.drop&&o.dropzone.fire(e.drop),e.deactivate&&jr(r,e.deactivate),n.prev.dropzone=o.dropzone,n.prev.element=o.element}function Dr(t,e){var n=t.interaction,r=t.iEvent,o=t.event;if("dragmove"===r.type||"dragend"===r.type){var i=n.dropState;e.dynamicDrop&&(i.activeDrops=Mr(e,n.element));var a=r,u=kr(n,a,o);i.rejected=i.rejected&&!!u&&u.dropzone===i.cur.dropzone&&u.element===i.cur.element,i.cur.dropzone=u&&u.dropzone,i.cur.element=u&&u.element,i.events=Er(n,0,a)}}var Ir={id:"actions/drop",install:function(e){var t=e.actions,n=e.interactStatic,r=e.Interactable,o=e.defaults;e.usePlugin(_r.default),r.prototype.dropzone=function(t){return function(t,e){if(wr.is.object(e)){if(t.options.drop.enabled=!1!==e.enabled,e.listeners){var n=wr.normalizeListeners(e.listeners),r=Object.keys(n).reduce(function(t,e){return t[/^(enter|leave)/.test(e)?"drag".concat(e):/^(activate|deactivate|move)/.test(e)?"drop".concat(e):e]=n[e],t},{});t.off(t.options.drop.listeners),t.on(r),t.options.drop.listeners=r}return wr.is.func(e.ondrop)&&t.on("drop",e.ondrop),wr.is.func(e.ondropactivate)&&t.on("dropactivate",e.ondropactivate),wr.is.func(e.ondropdeactivate)&&t.on("dropdeactivate",e.ondropdeactivate),wr.is.func(e.ondragenter)&&t.on("dragenter",e.ondragenter),wr.is.func(e.ondragleave)&&t.on("dragleave",e.ondragleave),wr.is.func(e.ondropmove)&&t.on("dropmove",e.ondropmove),/^(pointer|center)$/.test(e.overlap)?t.options.drop.overlap=e.overlap:wr.is.number(e.overlap)&&(t.options.drop.overlap=Math.max(Math.min(1,e.overlap),0)),"accept"in e&&(t.options.drop.accept=e.accept),"checker"in e&&(t.options.drop.checker=e.checker),t}if(wr.is.bool(e))return t.options.drop.enabled=e,t;return t.options.drop}(this,t)},r.prototype.dropCheck=function(t,e,n,r,o,i){return function(t,e,n,r,o,i,a){var u=!1;if(!(a=a||t.getRect(i)))return!!t.options.drop.checker&&t.options.drop.checker(e,n,u,t,i,r,o);var s=t.options.drop.overlap;if("pointer"===s){var l=wr.getOriginXY(r,o,"drag"),c=wr.pointer.getPageXY(e);c.x+=l.x,c.y+=l.y;var f=c.x>a.left&&c.x<a.right,p=c.y>a.top&&c.y<a.bottom;u=f&&p}var d=r.getRect(o);if(d&&"center"===s){var v=d.left+d.width/2,y=d.top+d.height/2;u=v>=a.left&&v<=a.right&&y>=a.top&&y<=a.bottom}if(d&&wr.is.number(s)){var h=Math.max(0,Math.min(a.right,d.right)-Math.max(a.left,d.left))*Math.max(0,Math.min(a.bottom,d.bottom)-Math.max(a.top,d.top))/(d.width*d.height);u=s<=h}t.options.drop.checker&&(u=t.options.drop.checker(e,n,u,t,i,r,o));return u}(this,t,e,n,r,o,i)},n.dynamicDrop=function(t){return wr.is.bool(t)?(e.dynamicDrop=t,n):e.dynamicDrop},wr.extend(t.phaselessTypes,{dragenter:!0,dragleave:!0,dropactivate:!0,dropdeactivate:!0,dropmove:!0,drop:!0}),t.methodDict.drop="dropzone",e.dynamicDrop=!1,o.actions.drop=Ir.defaults},listeners:{"interactions:before-action-start":function(t){var e=t.interaction;"drag"===e.prepared.name&&(e.dropState={cur:{dropzone:null,element:null},prev:{dropzone:null,element:null},rejected:null,events:null,activeDrops:[]})},"interactions:after-action-start":function(t,e){var n=t.interaction,r=(t.event,t.iEvent);if("drag"===n.prepared.name){var o=n.dropState;o.activeDrops=null,o.events=null,o.activeDrops=Mr(e,n.element),o.events=Er(n,0,r),o.events.activate&&(jr(o.activeDrops,o.events.activate),e.fire("actions/drop:start",{interaction:n,dragEvent:r}))}},"interactions:action-move":Dr,"interactions:action-end":Dr,"interactions:after-action-move":function(t,e){var n=t.interaction,r=t.iEvent;"drag"===n.prepared.name&&(Tr(n,n.dropState.events),e.fire("actions/drop:move",{interaction:n,dragEvent:r}),n.dropState.events={})},"interactions:after-action-end":function(t,e){var n=t.interaction,r=t.iEvent;"drag"===n.prepared.name&&(Tr(n,n.dropState.events),e.fire("actions/drop:end",{interaction:n,dragEvent:r}))},"interactions:stop":function(t){var e=t.interaction;if("drag"===e.prepared.name){var n=e.dropState;n&&(n.activeDrops=null,n.events=null,n.cur.dropzone=null,n.cur.element=null,n.prev.dropzone=null,n.prev.element=null,n.rejected=!1)}}},getActiveDrops:Mr,getDrop:kr,getDropEvents:Er,fireDropEvents:Tr,defaults:{enabled:!1,accept:null,overlap:"pointer"}},zr=Ir;mr.default=zr;var Ar={};function Cr(t){return(Cr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Ar,"__esModule",{value:!0}),Ar.default=void 0;var Wr=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Cr(t)&&"function"!=typeof t)return{default:t};var e=Rr();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le);function Rr(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Rr=function(){return t},t}function Fr(t){var e=t.interaction,n=t.iEvent,r=t.phase;if("gesture"===e.prepared.name){var o=e.pointers.map(function(t){return t.pointer}),i="start"===r,a="end"===r,u=e.interactable.options.deltaSource;if(n.touches=[o[0],o[1]],i)n.distance=Wr.pointer.touchDistance(o,u),n.box=Wr.pointer.touchBBox(o),n.scale=1,n.ds=0,n.angle=Wr.pointer.touchAngle(o,u),n.da=0,e.gesture.startDistance=n.distance,e.gesture.startAngle=n.angle;else if(a){var s=e.prevEvent;n.distance=s.distance,n.box=s.box,n.scale=s.scale,n.ds=0,n.angle=s.angle,n.da=0}else n.distance=Wr.pointer.touchDistance(o,u),n.box=Wr.pointer.touchBBox(o),n.scale=n.distance/e.gesture.startDistance,n.angle=Wr.pointer.touchAngle(o,u),n.ds=n.scale-e.gesture.scale,n.da=n.angle-e.gesture.angle;e.gesture.distance=n.distance,e.gesture.angle=n.angle,Wr.is.number(n.scale)&&n.scale!==1/0&&!isNaN(n.scale)&&(e.gesture.scale=n.scale)}}var Xr={id:"actions/gesture",before:["actions/drag","actions/resize"],install:function(t){var e=t.actions,n=t.Interactable,r=t.defaults;n.prototype.gesturable=function(t){return Wr.is.object(t)?(this.options.gesture.enabled=!1!==t.enabled,this.setPerAction("gesture",t),this.setOnEvents("gesture",t),this):Wr.is.bool(t)?(this.options.gesture.enabled=t,this):this.options.gesture},e.map.gesture=Xr,e.methodDict.gesture="gesturable",r.actions.gesture=Xr.defaults},listeners:{"interactions:action-start":Fr,"interactions:action-move":Fr,"interactions:action-end":Fr,"interactions:new":function(t){t.interaction.gesture={angle:0,distance:0,scale:1,startAngle:0,startDistance:0}},"auto-start:check":function(t){if(!(t.interaction.pointers.length<2)){var e=t.interactable.options.gesture;if(e&&e.enabled)return!(t.action={name:"gesture"})}}},defaults:{},getCursor:function(){return""}},Yr=Xr;Ar.default=Yr;var Nr={};function Lr(t){return(Lr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Nr,"__esModule",{value:!0}),Nr.default=void 0;var Br,Vr=Hr($),qr=(Br=ct)&&Br.__esModule?Br:{default:Br},Ur=Hr(w);function Gr(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Gr=function(){return t},t}function Hr(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Lr(t)&&"function"!=typeof t)return{default:t};var e=Gr();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function Kr(t,e,n,r,o,i,a){if(!e)return!1;if(!0===e){var u=Ur.number(i.width)?i.width:i.right-i.left,s=Ur.number(i.height)?i.height:i.bottom-i.top;if(a=Math.min(a,("left"===t||"right"===t?u:s)/2),u<0&&("left"===t?t="right":"right"===t&&(t="left")),s<0&&("top"===t?t="bottom":"bottom"===t&&(t="top")),"left"===t)return n.x<(0<=u?i.left:i.right)+a;if("top"===t)return n.y<(0<=s?i.top:i.bottom)+a;if("right"===t)return n.x>(0<=u?i.right:i.left)-a;if("bottom"===t)return n.y>(0<=s?i.bottom:i.top)-a}return!!Ur.element(r)&&(Ur.element(e)?e===r:Vr.matchesUpTo(r,e,o))}function $r(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.resizeAxes){var r=e;n.interactable.options.resize.square?("y"===n.resizeAxes?r.delta.x=r.delta.y:r.delta.y=r.delta.x,r.axes="xy"):(r.axes=n.resizeAxes,"x"===n.resizeAxes?r.delta.y=0:"y"===n.resizeAxes&&(r.delta.x=0))}}var Zr={id:"actions/resize",before:["actions/drag"],install:function(e){var t=e.actions,n=e.browser,r=e.Interactable,o=e.defaults;Zr.cursors=n.isIe9?{x:"e-resize",y:"s-resize",xy:"se-resize",top:"n-resize",left:"w-resize",bottom:"s-resize",right:"e-resize",topleft:"se-resize",bottomright:"se-resize",topright:"ne-resize",bottomleft:"ne-resize"}:{x:"ew-resize",y:"ns-resize",xy:"nwse-resize",top:"ns-resize",left:"ew-resize",bottom:"ns-resize",right:"ew-resize",topleft:"nwse-resize",bottomright:"nwse-resize",topright:"nesw-resize",bottomleft:"nesw-resize"},Zr.defaultMargin=n.supportsTouch||n.supportsPointerEvent?20:10,r.prototype.resizable=function(t){return function(t,e,n){if(Ur.object(e))return t.options.resize.enabled=!1!==e.enabled,t.setPerAction("resize",e),t.setOnEvents("resize",e),Ur.string(e.axis)&&/^x$|^y$|^xy$/.test(e.axis)?t.options.resize.axis=e.axis:null===e.axis&&(t.options.resize.axis=n.defaults.actions.resize.axis),Ur.bool(e.preserveAspectRatio)?t.options.resize.preserveAspectRatio=e.preserveAspectRatio:Ur.bool(e.square)&&(t.options.resize.square=e.square),t;if(Ur.bool(e))return t.options.resize.enabled=e,t;return t.options.resize}(this,t,e)},t.map.resize=Zr,t.methodDict.resize="resizable",o.actions.resize=Zr.defaults},listeners:{"interactions:new":function(t){t.interaction.resizeAxes="xy"},"interactions:action-start":function(t){!function(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.prepared.edges){var r=e,o=n.rect;n._rects={start:(0,qr.default)({},o),corrected:(0,qr.default)({},o),previous:(0,qr.default)({},o),delta:{left:0,right:0,width:0,top:0,bottom:0,height:0}},r.edges=n.prepared.edges,r.rect=n._rects.corrected,r.deltaRect=n._rects.delta}}(t),$r(t)},"interactions:action-move":function(t){!function(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.prepared.edges){var r=e,o=n.interactable.options.resize.invert,i="reposition"===o||"negate"===o,a=n.rect,u=n._rects,s=u.start,l=u.corrected,c=u.delta,f=u.previous;if((0,qr.default)(f,l),i){if((0,qr.default)(l,a),"reposition"===o){if(l.top>l.bottom){var p=l.top;l.top=l.bottom,l.bottom=p}if(l.left>l.right){var d=l.left;l.left=l.right,l.right=d}}}else l.top=Math.min(a.top,s.bottom),l.bottom=Math.max(a.bottom,s.top),l.left=Math.min(a.left,s.right),l.right=Math.max(a.right,s.left);for(var v in l.width=l.right-l.left,l.height=l.bottom-l.top,l)c[v]=l[v]-f[v];r.edges=n.prepared.edges,r.rect=l,r.deltaRect=c}}(t),$r(t)},"interactions:action-end":function(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.prepared.edges){var r=e;r.edges=n.prepared.edges,r.rect=n._rects.corrected,r.deltaRect=n._rects.delta}},"auto-start:check":function(t){var e=t.interaction,n=t.interactable,r=t.element,o=t.rect,i=t.buttons;if(o){var a=(0,qr.default)({},e.coords.cur.page),u=n.options.resize;if(u&&u.enabled&&(!e.pointerIsDown||!/mouse|pointer/.test(e.pointerType)||0!=(i&u.mouseButtons))){if(Ur.object(u.edges)){var s={left:!1,right:!1,top:!1,bottom:!1};for(var l in s)s[l]=Kr(l,u.edges[l],a,e._latestPointer.eventTarget,r,o,u.margin||Zr.defaultMargin);s.left=s.left&&!s.right,s.top=s.top&&!s.bottom,(s.left||s.right||s.top||s.bottom)&&(t.action={name:"resize",edges:s})}else{var c="y"!==u.axis&&a.x>o.right-Zr.defaultMargin,f="x"!==u.axis&&a.y>o.bottom-Zr.defaultMargin;(c||f)&&(t.action={name:"resize",axes:(c?"x":"")+(f?"y":"")})}return!t.action&&void 0}}}},defaults:{square:!1,preserveAspectRatio:!1,axis:"xy",margin:NaN,edges:null,invert:"none"},cursors:null,getCursor:function(t){var e=t.edges,n=t.axis,r=t.name,o=Zr.cursors,i=null;if(n)i=o[r+n];else if(e){for(var a="",u=["top","bottom","left","right"],s=0;s<u.length;s++){var l=u[s];e[l]&&(a+=l)}i=o[a]}return i},defaultMargin:null},Jr=Zr;Nr.default=Jr;var Qr={};Object.defineProperty(Qr,"__esModule",{value:!0}),Object.defineProperty(Qr,"drag",{enumerable:!0,get:function(){return to.default}}),Object.defineProperty(Qr,"drop",{enumerable:!0,get:function(){return eo.default}}),Object.defineProperty(Qr,"gesture",{enumerable:!0,get:function(){return no.default}}),Object.defineProperty(Qr,"resize",{enumerable:!0,get:function(){return ro.default}}),Qr.default=void 0;var to=oo(v),eo=oo(mr),no=oo(Ar),ro=oo(Nr);function oo(t){return t&&t.__esModule?t:{default:t}}var io={id:"actions",install:function(t){t.usePlugin(no.default),t.usePlugin(ro.default),t.usePlugin(to.default),t.usePlugin(eo.default)}};Qr.default=io;var ao={};Object.defineProperty(ao,"__esModule",{value:!0}),ao.default=void 0;ao.default={};var uo={};function so(t){return(so="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(uo,"__esModule",{value:!0}),uo.getContainer=go,uo.getScroll=bo,uo.getScrollSize=function(t){fo.window(t)&&(t=window.document.body);return{x:t.scrollWidth,y:t.scrollHeight}},uo.getScrollSizeDelta=function(t,e){var n=t.interaction,r=t.element,o=n&&n.interactable.options[n.prepared.name].autoScroll;if(!o||!o.enabled)return e(),{x:0,y:0};var i=go(o.container,n.interactable,r),a=bo(i);e();var u=bo(i);return{x:u.x-a.x,y:u.y-a.y}},uo.default=void 0;var lo,co=yo($),fo=yo(w),po=(lo=oe)&&lo.__esModule?lo:{default:lo};function vo(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return vo=function(){return t},t}function yo(t){if(t&&t.__esModule)return t;if(null===t||"object"!==so(t)&&"function"!=typeof t)return{default:t};var e=vo();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}var ho={defaults:{enabled:!1,margin:60,container:null,speed:300},now:Date.now,interaction:null,i:0,x:0,y:0,isScrolling:!1,prevTime:0,margin:0,speed:0,start:function(t){ho.isScrolling=!0,po.default.cancel(ho.i),(t.autoScroll=ho).interaction=t,ho.prevTime=ho.now(),ho.i=po.default.request(ho.scroll)},stop:function(){ho.isScrolling=!1,ho.interaction&&(ho.interaction.autoScroll=null),po.default.cancel(ho.i)},scroll:function(){var t=ho.interaction,e=t.interactable,n=t.element,r=t.prepared.name,o=e.options[r].autoScroll,i=go(o.container,e,n),a=ho.now(),u=(a-ho.prevTime)/1e3,s=o.speed*u;if(1<=s){var l={x:ho.x*s,y:ho.y*s};if(l.x||l.y){var c=bo(i);fo.window(i)?i.scrollBy(l.x,l.y):i&&(i.scrollLeft+=l.x,i.scrollTop+=l.y);var f=bo(i),p={x:f.x-c.x,y:f.y-c.y};(p.x||p.y)&&e.fire({type:"autoscroll",target:n,interactable:e,delta:p,interaction:t,container:i})}ho.prevTime=a}ho.isScrolling&&(po.default.cancel(ho.i),ho.i=po.default.request(ho.scroll))},check:function(t,e){var n=t.options;return n[e].autoScroll&&n[e].autoScroll.enabled},onInteractionMove:function(t){var e=t.interaction,n=t.pointer;if(e.interacting()&&ho.check(e.interactable,e.prepared.name))if(e.simulation)ho.x=ho.y=0;else{var r,o,i,a,u=e.interactable,s=e.element,l=e.prepared.name,c=u.options[l].autoScroll,f=go(c.container,u,s);if(fo.window(f))a=n.clientX<ho.margin,r=n.clientY<ho.margin,o=n.clientX>f.innerWidth-ho.margin,i=n.clientY>f.innerHeight-ho.margin;else{var p=co.getElementClientRect(f);a=n.clientX<p.left+ho.margin,r=n.clientY<p.top+ho.margin,o=n.clientX>p.right-ho.margin,i=n.clientY>p.bottom-ho.margin}ho.x=o?1:a?-1:0,ho.y=i?1:r?-1:0,ho.isScrolling||(ho.margin=c.margin,ho.speed=c.speed,ho.start(e))}}};function go(t,e,n){return(fo.string(t)?(0,$t.getStringOptionResult)(t,e,n):t)||(0,O.getWindow)(n)}function bo(t){return fo.window(t)&&(t=window.document.body),{x:t.scrollLeft,y:t.scrollTop}}var mo={id:"auto-scroll",install:function(t){var e=t.defaults,n=t.actions;(t.autoScroll=ho).now=function(){return t.now()},n.phaselessTypes.autoscroll=!0,e.perAction.autoScroll=ho.defaults},listeners:{"interactions:new":function(t){t.interaction.autoScroll=null},"interactions:destroy":function(t){t.interaction.autoScroll=null,ho.stop(),ho.interaction&&(ho.interaction=null)},"interactions:stop":ho.stop,"interactions:action-move":function(t){return ho.onInteractionMove(t)}}};uo.default=mo;var Oo={};function wo(t){return(wo="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Oo,"__esModule",{value:!0}),Oo.default=void 0;var _o=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==wo(t)&&"function"!=typeof t)return{default:t};var e=Po();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w);function Po(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Po=function(){return t},t}function xo(t){return _o.bool(t)?(this.options.styleCursor=t,this):null===t?(delete this.options.styleCursor,this):this.options.styleCursor}function So(t){return _o.func(t)?(this.options.actionChecker=t,this):null===t?(delete this.options.actionChecker,this):this.options.actionChecker}var jo={id:"auto-start/interactableMethods",install:function(d){var t=d.Interactable;t.prototype.getAction=function(t,e,n,r){var o,i,a,u,s,l,c,f,p=(i=e,a=n,u=r,s=d,l=(o=this).getRect(u),c=i.buttons||{0:1,1:4,3:8,4:16}[i.button],f={action:null,interactable:o,interaction:a,element:u,rect:l,buttons:c},s.fire("auto-start:check",f),f.action);return this.options.actionChecker?this.options.actionChecker(t,e,p,this,r,n):p},t.prototype.ignoreFrom=(0,le.warnOnce)(function(t){return this._backCompatOption("ignoreFrom",t)},"Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue})."),t.prototype.allowFrom=(0,le.warnOnce)(function(t){return this._backCompatOption("allowFrom",t)},"Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue})."),t.prototype.actionChecker=So,t.prototype.styleCursor=xo}};Oo.default=jo;var Mo={};function ko(t){return(ko="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Mo,"__esModule",{value:!0}),Mo.default=void 0;var Eo,To=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==ko(t)&&"function"!=typeof t)return{default:t};var e=Io();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le),Do=(Eo=Oo)&&Eo.__esModule?Eo:{default:Eo};function Io(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Io=function(){return t},t}function zo(t,e,n,r,o){return e.testIgnoreAllow(e.options[t.name],n,r)&&e.options[t.name].enabled&&Ro(e,n,t,o)?t:null}function Ao(t,e,n,r,o,i,a){for(var u=0,s=r.length;u<s;u++){var l=r[u],c=o[u],f=l.getAction(e,n,t,c);if(f){var p=zo(f,l,c,i,a);if(p)return{action:p,interactable:l,element:c}}}return{action:null,interactable:null,element:null}}function Co(t,e,n,r,o){var i=[],a=[],u=r;function s(t){i.push(t),a.push(u)}for(;To.is.element(u);){i=[],a=[],o.interactables.forEachMatch(u,s);var l=Ao(t,e,n,i,a,r,o);if(l.action&&!l.interactable.options[l.action.name].manualStart)return l;u=To.dom.parentNode(u)}return{action:null,interactable:null,element:null}}function Wo(t,e,n){var r=e.action,o=e.interactable,i=e.element;r=r||{name:null},t.interactable=o,t.element=i,To.copyAction(t.prepared,r),t.rect=o&&r.name?o.getRect(i):null,Yo(t,n),n.fire("autoStart:prepared",{interaction:t})}function Ro(t,e,n,r){var o=t.options,i=o[n.name].max,a=o[n.name].maxPerElement,u=r.autoStart.maxInteractions,s=0,l=0,c=0;if(!(i&&a&&u))return!1;for(var f=0;f<r.interactions.list.length;f++){var p=r.interactions.list[f],d=p.prepared.name;if(p.interacting()){if(u<=++s)return!1;if(p.interactable===t){if(i<=(l+=d===n.name?1:0))return!1;if(p.element===e&&(c++,d===n.name&&a<=c))return!1}}}return 0<u}function Fo(t,e){return To.is.number(t)?(e.autoStart.maxInteractions=t,this):e.autoStart.maxInteractions}function Xo(t,e,n){var r=n.autoStart.cursorElement;r&&r!==t&&(r.style.cursor=""),t.ownerDocument.documentElement.style.cursor=e,t.style.cursor=e,n.autoStart.cursorElement=e?t:null}function Yo(t,e){var n=t.interactable,r=t.element,o=t.prepared;if("mouse"===t.pointerType&&n&&n.options.styleCursor){var i="";if(o.name){var a=n.options[o.name].cursorChecker;i=To.is.func(a)?a(o,n,r,t._interacting):e.actions.map[o.name].getCursor(o)}Xo(t.element,i||"",e)}else e.autoStart.cursorElement&&Xo(e.autoStart.cursorElement,"",e)}var No={id:"auto-start/base",before:["actions","actions/drag","actions/resize","actions/gesture"],install:function(e){var t=e.interactStatic,n=e.defaults;e.usePlugin(Do.default),n.base.actionChecker=null,n.base.styleCursor=!0,To.extend(n.perAction,{manualStart:!1,max:1/0,maxPerElement:1,allowFrom:null,ignoreFrom:null,mouseButtons:1}),t.maxInteractions=function(t){return Fo(t,e)},e.autoStart={maxInteractions:1/0,withinInteractionLimit:Ro,cursorElement:null}},listeners:{"interactions:down":function(t,e){var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget;n.interacting()||Wo(n,Co(n,r,o,i,e),e)},"interactions:move":function(t,e){var n,r,o,i,a,u;r=e,o=(n=t).interaction,i=n.pointer,a=n.event,u=n.eventTarget,"mouse"!==o.pointerType||o.pointerIsDown||o.interacting()||Wo(o,Co(o,i,a,u,r),r),function(t,e){var n=t.interaction;if(n.pointerIsDown&&!n.interacting()&&n.pointerWasMoved&&n.prepared.name){e.fire("autoStart:before-start",t);var r=n.interactable,o=n.prepared.name;o&&r&&(r.options[o].manualStart||!Ro(r,n.element,n.prepared,e)?n.stop():(n.start(n.prepared,r,n.element),Yo(n,e)))}}(t,e)},"interactions:stop":function(t,e){var n=t.interaction,r=n.interactable;r&&r.options.styleCursor&&Xo(n.element,"",e)}},maxInteractions:Fo,withinInteractionLimit:Ro,validateAction:zo};Mo.default=No;var Lo={};function Bo(t){return(Bo="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Lo,"__esModule",{value:!0}),Lo.default=void 0;var Vo,qo=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Bo(t)&&"function"!=typeof t)return{default:t};var e=Go();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w),Uo=(Vo=Mo)&&Vo.__esModule?Vo:{default:Vo};function Go(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Go=function(){return t},t}var Ho={id:"auto-start/dragAxis",listeners:{"autoStart:before-start":function(t,r){var o=t.interaction,i=t.eventTarget,e=t.dx,n=t.dy;if("drag"===o.prepared.name){var a=Math.abs(e),u=Math.abs(n),s=o.interactable.options.drag,l=s.startAxis,c=u<a?"x":a<u?"y":"xy";if(o.prepared.axis="start"===s.lockAxis?c[0]:s.lockAxis,"xy"!=c&&"xy"!==l&&l!==c){o.prepared.name=null;function f(t){if(t!==o.interactable){var e=o.interactable.options.drag;if(!e.manualStart&&t.testIgnoreAllow(e,p,i)){var n=t.getAction(o.downPointer,o.downEvent,o,p);if(n&&"drag"===n.name&&function(t,e){if(!e)return;var n=e.options.drag.startAxis;return"xy"===t||"xy"===n||n===t}(c,t)&&Uo.default.validateAction(n,t,p,i,r))return t}}}for(var p=i;qo.element(p);){var d=r.interactables.forEachMatch(p,f);if(d){o.prepared.name="drag",o.interactable=d,o.element=p;break}p=(0,$.parentNode)(p)}}}}}};Lo.default=Ho;var Ko={};Object.defineProperty(Ko,"__esModule",{value:!0}),Ko.default=void 0;var $o,Zo=($o=Mo)&&$o.__esModule?$o:{default:$o};function Jo(t){var e=t.prepared&&t.prepared.name;if(!e)return null;var n=t.interactable.options;return n[e].hold||n[e].delay}var Qo={id:"auto-start/hold",install:function(t){var e=t.defaults;t.usePlugin(Zo.default),e.perAction.hold=0,e.perAction.delay=0},listeners:{"interactions:new":function(t){t.interaction.autoStartHoldTimer=null},"autoStart:prepared":function(t){var e=t.interaction,n=Jo(e);0<n&&(e.autoStartHoldTimer=setTimeout(function(){e.start(e.prepared,e.interactable,e.element)},n))},"interactions:move":function(t){var e=t.interaction,n=t.duplicate;e.pointerWasMoved&&!n&&clearTimeout(e.autoStartHoldTimer)},"autoStart:before-start":function(t){var e=t.interaction;0<Jo(e)&&(e.prepared.name=null)}},getHoldDuration:Jo};Ko.default=Qo;var ti={};Object.defineProperty(ti,"__esModule",{value:!0}),Object.defineProperty(ti,"autoStart",{enumerable:!0,get:function(){return ei.default}}),Object.defineProperty(ti,"dragAxis",{enumerable:!0,get:function(){return ni.default}}),Object.defineProperty(ti,"hold",{enumerable:!0,get:function(){return ri.default}}),ti.default=void 0;var ei=oi(Mo),ni=oi(Lo),ri=oi(Ko);function oi(t){return t&&t.__esModule?t:{default:t}}var ii={id:"auto-start",install:function(t){t.usePlugin(ei.default),t.usePlugin(ri.default),t.usePlugin(ni.default)}};ti.default=ii;var ai={};Object.defineProperty(ai,"__esModule",{value:!0}),ai.default=void 0;ai.default={};var ui={};Object.defineProperty(ui,"__esModule",{value:!0}),ui.default=void 0;ui.default={};var si={};function li(t){return(li="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(si,"__esModule",{value:!0}),si.default=void 0;var ci,fi,pi=hi(D),di=(hi(ct),function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==li(t)&&"function"!=typeof t)return{default:t};var e=yi();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w)),vi=hi(O);function yi(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return yi=function(){return t},t}function hi(t){return t&&t.__esModule?t:{default:t}}(fi=ci=ci||{}).touchAction="touchAction",fi.boxSizing="boxSizing",fi.noListeners="noListeners";var gi={touchAction:"https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action",boxSizing:"https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing"};ci.touchAction,ci.boxSizing,ci.noListeners;function bi(t,e,n){return n.test(t.style[e]||vi.default.window.getComputedStyle(t)[e])}var mi="dev-tools",Oi={id:mi,install:function(){}};si.default=Oi;var wi={};Object.defineProperty(wi,"__esModule",{value:!0}),wi.default=void 0;wi.default={};var _i={};function Pi(t){return(Pi="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(_i,"__esModule",{value:!0}),_i.getRectOffset=Ai,_i.default=void 0;var xi=ki(V),Si=ki(ct),ji=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Pi(t)&&"function"!=typeof t)return{default:t};var e=Mi();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}($t);function Mi(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Mi=function(){return t},t}function ki(t){return t&&t.__esModule?t:{default:t}}function Ei(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function Ti(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Di(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var Ii=function(){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),this.interaction=t,Di(this,"states",[]),Di(this,"startOffset",{left:0,right:0,top:0,bottom:0}),Di(this,"startDelta",null),Di(this,"result",null),Di(this,"endResult",null),Di(this,"edges",void 0),this.result=zi()}var t,n,r;return t=e,(n=[{key:"start",value:function(t,e){var n=t.phase,r=this.interaction,o=function(t){var n=t.interactable.options[t.prepared.name],e=n.modifiers;if(e&&e.length)return e.filter(function(t){return!t.options||!1!==t.options.enabled});return["snap","snapSize","snapEdges","restrict","restrictEdges","restrictSize"].map(function(t){var e=n[t];return e&&e.enabled&&{options:e,methods:e._methods}}).filter(function(t){return!!t})}(r);this.prepareStates(o),this.edges=(0,Si.default)({},r.edges),this.startOffset=Ai(r.rect,e);var i={phase:n,pageCoords:e,preEnd:!(this.startDelta={x:0,y:0})};return this.result=zi(),this.startAll(i),this.result=this.setAll(i)}},{key:"fillArg",value:function(t){var e=this.interaction;t.interaction=e,t.interactable=e.interactable,t.element=e.element,t.rect=t.rect||e.rect,t.edges=this.edges,t.startOffset=this.startOffset}},{key:"startAll",value:function(t){this.fillArg(t);for(var e=0;e<this.states.length;e++){var n=this.states[e];n.methods.start&&(t.state=n).methods.start(t)}}},{key:"setAll",value:function(t){this.fillArg(t);var e=t.phase,n=t.preEnd,r=t.skipModifiers,o=t.rect;t.coords=(0,Si.default)({},t.pageCoords),t.rect=(0,Si.default)({},o);for(var i=r?this.states.slice(r):this.states,a=zi(t.coords,t.rect),u=0;u<i.length;u++){var s=i[u],l=s.options,c=(0,Si.default)({},t.coords),f=null;s.methods.set&&this.shouldDo(l,n,e)&&(f=(t.state=s).methods.set(t),ji.addEdges(this.interaction.edges,t.rect,{x:t.coords.x-c.x,y:t.coords.y-c.y})),a.eventProps.push(f)}a.delta.x=t.coords.x-t.pageCoords.x,a.delta.y=t.coords.y-t.pageCoords.y,a.rectDelta.left=t.rect.left-o.left,a.rectDelta.right=t.rect.right-o.right,a.rectDelta.top=t.rect.top-o.top,a.rectDelta.bottom=t.rect.bottom-o.bottom;var p=this.result.coords,d=this.result.rect;if(p&&d){var v=a.rect.left!==d.left||a.rect.right!==d.right||a.rect.top!==d.top||a.rect.bottom!==d.bottom;a.changed=v||p.x!==a.coords.x||p.y!==a.coords.y}return a}},{key:"applyToInteraction",value:function(t){var e=this.interaction,n=t.phase,r=e.coords.cur,o=e.coords.start,i=this.result,a=this.startDelta,u=i.delta;"start"===n&&(0,Si.default)(this.startDelta,i.delta);for(var s=0;s<[[o,a],[r,u]].length;s++){var l=Ei([[o,a],[r,u]][s],2),c=l[0],f=l[1];c.page.x+=f.x,c.page.y+=f.y,c.client.x+=f.x,c.client.y+=f.y}var p=this.result.rectDelta,d=t.rect||e.rect;d.left+=p.left,d.right+=p.right,d.top+=p.top,d.bottom+=p.bottom,d.width=d.right-d.left,d.height=d.bottom-d.top}},{key:"setAndApply",value:function(t){var e=this.interaction,n=t.phase,r=t.preEnd,o=t.skipModifiers,i=this.setAll({preEnd:r,phase:n,pageCoords:t.modifiedCoords||e.coords.cur.page});if(!(this.result=i).changed&&(!o||o<this.states.length)&&e.interacting())return!1;if(t.modifiedCoords){var a=e.coords.cur.page,u=t.modifiedCoords.x-a.x,s=t.modifiedCoords.y-a.y;i.coords.x+=u,i.coords.y+=s,i.delta.x+=u,i.delta.y+=s}this.applyToInteraction(t)}},{key:"beforeEnd",value:function(t){var e=t.interaction,n=t.event,r=this.states;if(r&&r.length){for(var o=!1,i=0;i<r.length;i++){var a=r[i],u=(t.state=a).options,s=a.methods,l=s.beforeEnd&&s.beforeEnd(t);if(l)return this.endResult=l,!1;o=o||!o&&this.shouldDo(u,!0,t.phase,!0)}o&&e.move({event:n,preEnd:!0})}}},{key:"stop",value:function(t){var e=t.interaction;if(this.states&&this.states.length){var n=(0,Si.default)({states:this.states,interactable:e.interactable,element:e.element,rect:null},t);this.fillArg(n);for(var r=0;r<this.states.length;r++){var o=this.states[r];(n.state=o).methods.stop&&o.methods.stop(n)}this.states=null,this.endResult=null}}},{key:"prepareStates",value:function(t){this.states=[];for(var e=0;e<t.length;e++){var n=t[e],r=n.options,o=n.methods,i=n.name;r&&!1===r.enabled||this.states.push({options:r,methods:o,index:e,name:i})}return this.states}},{key:"restoreInteractionCoords",value:function(t){var e=t.interaction,n=e.coords,r=e.rect,o=e.modification;if(o.result){for(var i=o.startDelta,a=o.result,u=a.delta,s=a.rectDelta,l=[[n.start,i],[n.cur,u]],c=0;c<l.length;c++){var f=Ei(l[c],2),p=f[0],d=f[1];p.page.x-=d.x,p.page.y-=d.y,p.client.x-=d.x,p.client.y-=d.y}r.left-=s.left,r.right-=s.right,r.top-=s.top,r.bottom-=s.bottom}}},{key:"shouldDo",value:function(t,e,n,r){return!(!t||!1===t.enabled||r&&!t.endOnly||t.endOnly&&!e||"start"===n&&!t.setStart)}},{key:"copyFrom",value:function(t){this.startOffset=t.startOffset,this.startDelta=t.startDelta,this.edges=t.edges,this.states=t.states.map(function(t){return(0,xi.default)(t)}),this.result=zi((0,Si.default)({},t.result.coords),(0,Si.default)({},t.result.rect))}},{key:"destroy",value:function(){for(var t in this)this[t]=null}}])&&Ti(t.prototype,n),r&&Ti(t,r),e}();function zi(t,e){return{rect:e,coords:t,delta:{x:0,y:0},rectDelta:{left:0,right:0,top:0,bottom:0},eventProps:[],changed:!0}}function Ai(t,e){return t?{left:e.x-t.left,top:e.y-t.top,right:t.right-e.x,bottom:t.bottom-e.y}:{left:0,top:0,right:0,bottom:0}}_i.default=Ii;var Ci={};Object.defineProperty(Ci,"__esModule",{value:!0}),Ci.makeModifier=function(t,r){function e(t){var e=t||{};for(var n in e.enabled=!1!==e.enabled,o)n in e||(e[n]=o[n]);return{options:e,methods:i,name:r}}var o=t.defaults,i={start:t.start,set:t.set,beforeEnd:t.beforeEnd,stop:t.stop};r&&"string"==typeof r&&(e._defaults=o,e._methods=i);return e},Ci.addEventModifiers=Fi,Ci.default=void 0;var Wi,Ri=(Wi=_i)&&Wi.__esModule?Wi:{default:Wi};function Fi(t){var e=t.iEvent,n=t.interaction.modification.result;n&&(e.modifiers=n.eventProps)}var Xi={id:"modifiers/base",install:function(t){t.defaults.perAction.modifiers=[]},listeners:{"interactions:new":function(t){var e=t.interaction;e.modification=new Ri.default(e)},"interactions:before-action-start":function(t){var e=t.interaction.modification;e.start(t,t.interaction.coords.start.page),t.interaction.edges=e.edges,e.applyToInteraction(t)},"interactions:before-action-move":function(t){return t.interaction.modification.setAndApply(t)},"interactions:before-action-end":function(t){return t.interaction.modification.beforeEnd(t)},"interactions:action-start":Fi,"interactions:action-move":Fi,"interactions:action-end":Fi,"interactions:after-action-start":function(t){return t.interaction.modification.restoreInteractionCoords(t)},"interactions:after-action-move":function(t){return t.interaction.modification.restoreInteractionCoords(t)},"interactions:stop":function(t){return t.interaction.modification.stop(t)}},before:["actions","action/drag","actions/resize","actions/gesture"]};Ci.default=Xi;var Yi={};function Ni(t){return(Ni="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Yi,"__esModule",{value:!0}),Yi.addTotal=Vi,Yi.applyPending=Ui,Yi.default=void 0;var Li=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Ni(t)&&"function"!=typeof t)return{default:t};var e=Bi();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}($t);function Bi(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Bi=function(){return t},t}function Vi(t){t.pointerIsDown&&(Hi(t.coords.cur,t.offset.total),t.offset.pending.x=0,t.offset.pending.y=0)}function qi(t){Ui(t.interaction)}function Ui(t){if(!(e=t).offset.pending.x&&!e.offset.pending.y)return!1;var e,n=t.offset.pending;return Hi(t.coords.cur,n),Hi(t.coords.delta,n),Li.addEdges(t.edges,t.rect,n),n.x=0,!(n.y=0)}function Gi(t){var e=t.x,n=t.y;this.offset.pending.x+=e,this.offset.pending.y+=n,this.offset.total.x+=e,this.offset.total.y+=n}function Hi(t,e){var n=t.page,r=t.client,o=e.x,i=e.y;n.x+=o,n.y+=i,r.x+=o,r.y+=i}En._ProxyMethods.offsetBy="";var Ki={id:"offset",install:function(t){t.Interaction.prototype.offsetBy=Gi},listeners:{"interactions:new":function(t){t.interaction.offset={total:{x:0,y:0},pending:{x:0,y:0}}},"interactions:update-pointer":function(t){return Vi(t.interaction)},"interactions:before-action-start":qi,"interactions:before-action-move":qi,"interactions:before-action-end":function(t){var e=t.interaction;if(Ui(e))return e.move({offset:!0}),e.end(),!1},"interactions:stop":function(t){var e=t.interaction;e.offset.total.x=0,e.offset.total.y=0,e.offset.pending.x=0,e.offset.pending.y=0}}};Yi.default=Ki;var $i={};function Zi(t){return(Zi="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty($i,"__esModule",{value:!0}),$i.default=$i.InertiaState=void 0;var Ji=ua(_i),Qi=aa(Ci),ta=ua(Yi),ea=aa($),na=ua(Et),ra=aa(w),oa=ua(oe);function ia(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return ia=function(){return t},t}function aa(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Zi(t)&&"function"!=typeof t)return{default:t};var e=ia();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function ua(t){return t&&t.__esModule?t:{default:t}}function sa(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function la(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var ca=function(){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),this.interaction=t,la(this,"active",!1),la(this,"isModified",!1),la(this,"smoothEnd",!1),la(this,"allowResume",!1),la(this,"modification",null),la(this,"modifierCount",0),la(this,"modifierArg",null),la(this,"startCoords",null),la(this,"t0",0),la(this,"v0",0),la(this,"te",0),la(this,"targetOffset",null),la(this,"modifiedOffset",null),la(this,"currentOffset",null),la(this,"lambda_v0",0),la(this,"one_ve_v0",0),la(this,"timeout",null)}var t,n,r;return t=e,(n=[{key:"start",value:function(t){var e=this.interaction,n=fa(e);if(!n||!n.enabled)return!1;var r=e.coords.velocity.client,o=(0,na.default)(r.x,r.y),i=this.modification||(this.modification=new Ji.default(e));if(i.copyFrom(e.modification),this.t0=e._now(),this.allowResume=n.allowResume,this.v0=o,this.currentOffset={x:0,y:0},this.startCoords=e.coords.cur.page,this.modifierArg={interaction:e,interactable:e.interactable,element:e.element,rect:e.rect,edges:e.edges,pageCoords:this.startCoords,preEnd:!0,phase:"inertiastart"},this.t0-e.coords.cur.timeStamp<50&&o>n.minSpeed&&o>n.endSpeed)this.startInertia();else{if(i.result=i.setAll(this.modifierArg),!i.result.changed)return!1;this.startSmoothEnd()}return e.modification.result.rect=null,e.offsetBy(this.targetOffset),e._doPhase({interaction:e,event:t,phase:"inertiastart"}),e.offsetBy({x:-this.targetOffset.x,y:-this.targetOffset.y}),e.modification.result.rect=null,this.active=!0,e.simulation=this,!0}},{key:"startInertia",value:function(){var t=this,e=this.interaction.coords.velocity.client,n=fa(this.interaction),r=n.resistance,o=-Math.log(n.endSpeed/this.v0)/r;this.targetOffset={x:(e.x-o)/r,y:(e.y-o)/r},this.te=o,this.lambda_v0=r/this.v0,this.one_ve_v0=1-n.endSpeed/this.v0;var i=this.modification,a=this.modifierArg;a.pageCoords={x:this.startCoords.x+this.targetOffset.x,y:this.startCoords.y+this.targetOffset.y},i.result=i.setAll(a),i.result.changed&&(this.isModified=!0,this.modifiedOffset={x:this.targetOffset.x+i.result.delta.x,y:this.targetOffset.y+i.result.delta.y}),this.timeout=oa.default.request(function(){return t.inertiaTick()})}},{key:"startSmoothEnd",value:function(){var t=this;this.smoothEnd=!0,this.isModified=!0,this.targetOffset={x:this.modification.result.delta.x,y:this.modification.result.delta.y},this.timeout=oa.default.request(function(){return t.smoothEndTick()})}},{key:"inertiaTick",value:function(){var t,e,n,r,o,i,a,u=this,s=this.interaction,l=fa(s).resistance,c=(s._now()-this.t0)/1e3;if(c<this.te){var f,p=1-(Math.exp(-l*c)-this.lambda_v0)/this.one_ve_v0,d={x:(f=this.isModified?(e=t=0,n=this.targetOffset.x,r=this.targetOffset.y,o=this.modifiedOffset.x,i=this.modifiedOffset.y,{x:pa(a=p,t,n,o),y:pa(a,e,r,i)}):{x:this.targetOffset.x*p,y:this.targetOffset.y*p}).x-this.currentOffset.x,y:f.y-this.currentOffset.y};this.currentOffset.x+=d.x,this.currentOffset.y+=d.y,s.offsetBy(d),s.move(),this.timeout=oa.default.request(function(){return u.inertiaTick()})}else s.offsetBy({x:this.modifiedOffset.x-this.currentOffset.x,y:this.modifiedOffset.y-this.currentOffset.y}),this.end()}},{key:"smoothEndTick",value:function(){var t=this,e=this.interaction,n=e._now()-this.t0,r=fa(e).smoothEndDuration;if(n<r){var o=da(n,0,this.targetOffset.x,r),i=da(n,0,this.targetOffset.y,r),a={x:o-this.currentOffset.x,y:i-this.currentOffset.y};this.currentOffset.x+=a.x,this.currentOffset.y+=a.y,e.offsetBy(a),e.move({skipModifiers:this.modifierCount}),this.timeout=oa.default.request(function(){return t.smoothEndTick()})}else e.offsetBy({x:this.targetOffset.x-this.currentOffset.x,y:this.targetOffset.y-this.currentOffset.y}),this.end()}},{key:"resume",value:function(t){var e=t.pointer,n=t.event,r=t.eventTarget,o=this.interaction;o.offsetBy({x:-this.currentOffset.x,y:-this.currentOffset.y}),o.updatePointer(e,n,r,!0),o._doPhase({interaction:o,event:n,phase:"resume"}),(0,zt.copyCoords)(o.coords.prev,o.coords.cur),this.stop()}},{key:"end",value:function(){this.interaction.move(),this.interaction.end(),this.stop()}},{key:"stop",value:function(){this.active=this.smoothEnd=!1,this.interaction.simulation=null,oa.default.cancel(this.timeout)}}])&&sa(t.prototype,n),r&&sa(t,r),e}();function fa(t){var e=t.interactable,n=t.prepared;return e&&e.options&&n.name&&e.options[n.name].inertia}function pa(t,e,n,r){var o=1-t;return o*o*e+2*o*t*n+t*t*r}function da(t,e,n,r){return-n*(t/=r)*(t-2)+e}$i.InertiaState=ca;var va={id:"inertia",before:["modifiers/base"],install:function(t){var e=t.defaults;t.usePlugin(ta.default),t.usePlugin(Qi.default),t.actions.phases.inertiastart=!0,t.actions.phases.resume=!0,e.perAction.inertia={enabled:!1,resistance:10,minSpeed:100,endSpeed:10,allowResume:!0,smoothEndDuration:300}},listeners:{"interactions:new":function(t){var e=t.interaction;e.inertia=new ca(e)},"interactions:before-action-end":function(t){var e=t.interaction,n=t.event;return(!e._interacting||e.simulation||!e.inertia.start(n))&&null},"interactions:down":function(t){var e=t.interaction,n=t.eventTarget,r=e.inertia;if(r.active)for(var o=n;ra.element(o);){if(o===e.element){r.resume(t);break}o=ea.parentNode(o)}},"interactions:stop":function(t){var e=t.interaction.inertia;e.active&&e.stop()},"interactions:before-action-resume":function(t){var e=t.interaction.modification;e.stop(t),e.start(t,t.interaction.coords.cur.page),e.applyToInteraction(t)},"interactions:before-action-inertiastart":function(t){return t.interaction.modification.setAndApply(t)},"interactions:action-resume":Qi.addEventModifiers,"interactions:action-inertiastart":Qi.addEventModifiers,"interactions:after-action-inertiastart":function(t){return t.interaction.modification.restoreInteractionCoords(t)},"interactions:after-action-resume":function(t){return t.interaction.modification.restoreInteractionCoords(t)}}};$i.default=va;var ya,ha={};function ga(t){return(ga="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(ha,"__esModule",{value:!0}),ha.init=ha.default=void 0;var ba=new(((ya=m({}))&&ya.__esModule?ya:{default:ya}).default),ma=ba.interactStatic;ha.default=ma;function Oa(t){return ba.init(t)}ha.init=Oa,"object"===("undefined"==typeof window?"undefined":ga(window))&&window&&Oa(window);var wa={};Object.defineProperty(wa,"__esModule",{value:!0}),wa.default=void 0;wa.default={};var _a={};Object.defineProperty(_a,"__esModule",{value:!0}),_a.default=void 0;_a.default={};var Pa={};function xa(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}Object.defineProperty(Pa,"__esModule",{value:!0}),Pa.default=void 0;Pa.default=function(v){function t(t,e){for(var n=v.range,r=v.limits,o=void 0===r?{left:-1/0,right:1/0,top:-1/0,bottom:1/0}:r,i=v.offset,a=void 0===i?{x:0,y:0}:i,u={range:n,grid:v,x:null,y:null},s=0;s<y.length;s++){var l=xa(y[s],2),c=l[0],f=l[1],p=Math.round((t-a.x)/v[c]),d=Math.round((e-a.y)/v[f]);u[c]=Math.max(o.left,Math.min(o.right,p*v[c]+a.x)),u[f]=Math.max(o.top,Math.min(o.bottom,d*v[f]+a.y))}return u}var y=[["x","y"],["left","top"],["right","bottom"],["width","height"]].filter(function(t){var e=xa(t,2),n=e[0],r=e[1];return n in v||r in v});return t.grid=v,t.coordFields=y,t};var Sa={};Object.defineProperty(Sa,"__esModule",{value:!0}),Object.defineProperty(Sa,"edgeTarget",{enumerable:!0,get:function(){return ja.default}}),Object.defineProperty(Sa,"elements",{enumerable:!0,get:function(){return Ma.default}}),Object.defineProperty(Sa,"grid",{enumerable:!0,get:function(){return ka.default}});var ja=Ea(wa),Ma=Ea(_a),ka=Ea(Pa);function Ea(t){return t&&t.__esModule?t:{default:t}}var Ta={};function Da(t){return(Da="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Ta,"__esModule",{value:!0}),Ta.default=void 0;var Ia,za=(Ia=ct)&&Ia.__esModule?Ia:{default:Ia},Aa=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Da(t)&&"function"!=typeof t)return{default:t};var e=Ca();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(Sa);function Ca(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Ca=function(){return t},t}var Wa={id:"snappers",install:function(t){var e=t.interactStatic;e.snappers=(0,za.default)(e.snappers||{},Aa),e.createSnapGrid=e.snappers.grid}};Ta.default=Wa;var Ra={};Object.defineProperty(Ra,"__esModule",{value:!0}),Ra.aspectRatio=Ra.default=void 0;var Fa=Ya(ct),Xa=Ya(_i);function Ya(t){return t&&t.__esModule?t:{default:t}}function Na(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function La(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Na(Object(n),!0).forEach(function(t){Ba(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Na(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function Ba(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var Va={start:function(t){var e=t.state,n=t.rect,r=t.edges,o=t.pageCoords,i=e.options.ratio,a=e.options,u=a.equalDelta,s=a.modifiers;"preserve"===i&&(i=n.width/n.height),e.startCoords=(0,Fa.default)({},o),e.startRect=(0,Fa.default)({},n),e.ratio=i,e.equalDelta=u;var l=e.linkedEdges={top:r.top||r.left&&!r.bottom,left:r.left||r.top&&!r.right,bottom:r.bottom||r.right&&!r.top,right:r.right||r.bottom&&!r.left};if(e.xIsPrimaryAxis=!(!r.left&&!r.right),e.equalDelta)e.edgeSign=(l.left?1:-1)*(l.top?1:-1);else{var c=e.xIsPrimaryAxis?l.top:l.left;e.edgeSign=c?-1:1}if((0,Fa.default)(t.edges,l),s&&s.length){var f=new Xa.default(t.interaction);f.copyFrom(t.interaction.modification),f.prepareStates(s),(e.subModification=f).startAll(La({},t))}},set:function(t){var e=t.state,n=t.rect,r=t.coords,o=(0,Fa.default)({},r),i=e.equalDelta?qa:Ua;if(i(e,e.xIsPrimaryAxis,r,n),!e.subModification)return null;var a=(0,Fa.default)({},n);(0,$t.addEdges)(e.linkedEdges,a,{x:r.x-o.x,y:r.y-o.y});var u=e.subModification.setAll(La({},t,{rect:a,edges:e.linkedEdges,pageCoords:r,prevCoords:r,prevRect:a})),s=u.delta;u.changed&&(i(e,Math.abs(s.x)>Math.abs(s.y),u.coords,u.rect),(0,Fa.default)(r,u.coords));return u.eventProps},defaults:{ratio:"preserve",equalDelta:!1,modifiers:[],enabled:!1}};function qa(t,e,n){var r=t.startCoords,o=t.edgeSign;e?n.y=r.y+(n.x-r.x)*o:n.x=r.x+(n.y-r.y)*o}function Ua(t,e,n,r){var o=t.startRect,i=t.startCoords,a=t.ratio,u=t.edgeSign;if(e){var s=r.width/a;n.y=i.y+(s-o.height)*u}else{var l=r.height*a;n.x=i.x+(l-o.width)*u}}Ra.aspectRatio=Va;var Ga=(0,Ci.makeModifier)(Va,"aspectRatio");Ra.default=Ga;var Ha={};Object.defineProperty(Ha,"__esModule",{value:!0}),Ha.default=void 0;function Ka(){}Ka._defaults={};var $a=Ka;Ha.default=$a;var Za={};function Ja(t){return(Ja="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Za,"__esModule",{value:!0}),Za.getRestrictionRect=iu,Za.restrict=Za.default=void 0;var Qa,tu=(Qa=ct)&&Qa.__esModule?Qa:{default:Qa},eu=ou(w),nu=ou($t);function ru(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return ru=function(){return t},t}function ou(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Ja(t)&&"function"!=typeof t)return{default:t};var e=ru();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function iu(t,e,n){return eu.func(t)?nu.resolveRectLike(t,e.interactable,e.element,[n.x,n.y,e]):nu.resolveRectLike(t,e.interactable,e.element)}var au={start:function(t){var e=t.rect,n=t.startOffset,r=t.state,o=t.interaction,i=t.pageCoords,a=r.options,u=a.elementRect,s=(0,tu.default)({left:0,top:0,right:0,bottom:0},a.offset||{});if(e&&u){var l=iu(a.restriction,o,i);if(l){var c=l.right-l.left-e.width,f=l.bottom-l.top-e.height;c<0&&(s.left+=c,s.right+=c),f<0&&(s.top+=f,s.bottom+=f)}s.left+=n.left-e.width*u.left,s.top+=n.top-e.height*u.top,s.right+=n.right-e.width*(1-u.right),s.bottom+=n.bottom-e.height*(1-u.bottom)}r.offset=s},set:function(t){var e=t.coords,n=t.interaction,r=t.state,o=r.options,i=r.offset,a=iu(o.restriction,n,e);if(a){var u=nu.xywhToTlbr(a);e.x=Math.max(Math.min(u.right-i.right,e.x),u.left+i.left),e.y=Math.max(Math.min(u.bottom-i.bottom,e.y),u.top+i.top)}},defaults:{restriction:null,elementRect:null,offset:null,endOnly:!1,enabled:!1}};Za.restrict=au;var uu=(0,Ci.makeModifier)(au,"restrict");Za.default=uu;var su={};function lu(t){return(lu="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(su,"__esModule",{value:!0}),su.restrictEdges=su.default=void 0;var cu,fu=(cu=ct)&&cu.__esModule?cu:{default:cu},pu=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==lu(t)&&"function"!=typeof t)return{default:t};var e=du();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}($t);function du(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return du=function(){return t},t}var vu={top:1/0,left:1/0,bottom:-1/0,right:-1/0},yu={top:-1/0,left:-1/0,bottom:1/0,right:1/0};function hu(t,e){for(var n=["top","left","bottom","right"],r=0;r<n.length;r++){var o=n[r];o in t||(t[o]=e[o])}return t}var gu={noInner:vu,noOuter:yu,start:function(t){var e,n=t.interaction,r=t.startOffset,o=t.state,i=o.options;if(i){var a=(0,Za.getRestrictionRect)(i.offset,n,n.coords.start.page);e=pu.rectToXY(a)}e=e||{x:0,y:0},o.offset={top:e.y+r.top,left:e.x+r.left,bottom:e.y-r.bottom,right:e.x-r.right}},set:function(t){var e=t.coords,n=t.edges,r=t.interaction,o=t.state,i=o.offset,a=o.options;if(n){var u=(0,fu.default)({},e),s=(0,Za.getRestrictionRect)(a.inner,r,u)||{},l=(0,Za.getRestrictionRect)(a.outer,r,u)||{};hu(s,vu),hu(l,yu),n.top?e.y=Math.min(Math.max(l.top+i.top,u.y),s.top+i.top):n.bottom&&(e.y=Math.max(Math.min(l.bottom+i.bottom,u.y),s.bottom+i.bottom)),n.left?e.x=Math.min(Math.max(l.left+i.left,u.x),s.left+i.left):n.right&&(e.x=Math.max(Math.min(l.right+i.right,u.x),s.right+i.right))}},defaults:{inner:null,outer:null,offset:null,endOnly:!1,enabled:!1}};su.restrictEdges=gu;var bu=(0,Ci.makeModifier)(gu,"restrictEdges");su.default=bu;var mu,Ou={};Object.defineProperty(Ou,"__esModule",{value:!0}),Ou.restrictRect=Ou.default=void 0;var wu=(0,((mu=ct)&&mu.__esModule?mu:{default:mu}).default)({get elementRect(){return{top:0,left:0,bottom:1,right:1}},set elementRect(t){}},Za.restrict.defaults),_u={start:Za.restrict.start,set:Za.restrict.set,defaults:wu};Ou.restrictRect=_u;var Pu=(0,Ci.makeModifier)(_u,"restrictRect");Ou.default=Pu;var xu={};function Su(t){return(Su="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(xu,"__esModule",{value:!0}),xu.restrictSize=xu.default=void 0;var ju,Mu=(ju=ct)&&ju.__esModule?ju:{default:ju},ku=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Su(t)&&"function"!=typeof t)return{default:t};var e=Eu();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}($t);function Eu(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Eu=function(){return t},t}var Tu={width:-1/0,height:-1/0},Du={width:1/0,height:1/0};var Iu={start:function(t){return su.restrictEdges.start(t)},set:function(t){var e=t.interaction,n=t.state,r=t.rect,o=t.edges,i=n.options;if(o){var a=ku.tlbrToXywh((0,Za.getRestrictionRect)(i.min,e,t.coords))||Tu,u=ku.tlbrToXywh((0,Za.getRestrictionRect)(i.max,e,t.coords))||Du;n.options={endOnly:i.endOnly,inner:(0,Mu.default)({},su.restrictEdges.noInner),outer:(0,Mu.default)({},su.restrictEdges.noOuter)},o.top?(n.options.inner.top=r.bottom-a.height,n.options.outer.top=r.bottom-u.height):o.bottom&&(n.options.inner.bottom=r.top+a.height,n.options.outer.bottom=r.top+u.height),o.left?(n.options.inner.left=r.right-a.width,n.options.outer.left=r.right-u.width):o.right&&(n.options.inner.right=r.left+a.width,n.options.outer.right=r.left+u.width),su.restrictEdges.set(t),n.options=i}},defaults:{min:null,max:null,endOnly:!1,enabled:!1}};xu.restrictSize=Iu;var zu=(0,Ci.makeModifier)(Iu,"restrictSize");xu.default=zu;var Au={};Object.defineProperty(Au,"__esModule",{value:!0}),Au.default=void 0;function Cu(){}Cu._defaults={};var Wu=Cu;Au.default=Wu;var Ru={};function Fu(t){return(Fu="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Ru,"__esModule",{value:!0}),Ru.snap=Ru.default=void 0;var Xu=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Fu(t)&&"function"!=typeof t)return{default:t};var e=Yu();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le);function Yu(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Yu=function(){return t},t}var Nu={start:function(t){var e,n,r,o=t.interaction,i=t.interactable,a=t.element,u=t.rect,s=t.state,l=t.startOffset,c=s.options,f=c.offsetWithOrigin?(n=(e=t).interaction.element,Xu.rect.rectToXY(Xu.rect.resolveRectLike(e.state.options.origin,null,null,[n]))||Xu.getOriginXY(e.interactable,n,e.interaction.prepared.name)):{x:0,y:0};if("startCoords"===c.offset)r={x:o.coords.start.page.x,y:o.coords.start.page.y};else{var p=Xu.rect.resolveRectLike(c.offset,i,a,[o]);(r=Xu.rect.rectToXY(p)||{x:0,y:0}).x+=f.x,r.y+=f.y}var d=c.relativePoints;s.offsets=u&&d&&d.length?d.map(function(t,e){return{index:e,relativePoint:t,x:l.left-u.width*t.x+r.x,y:l.top-u.height*t.y+r.y}}):[Xu.extend({index:0,relativePoint:null},r)]},set:function(t){var e=t.interaction,n=t.coords,r=t.state,o=r.options,i=r.offsets,a=Xu.getOriginXY(e.interactable,e.element,e.prepared.name),u=Xu.extend({},n),s=[];o.offsetWithOrigin||(u.x-=a.x,u.y-=a.y);for(var l=0;l<i.length;l++)for(var c=i[l],f=u.x-c.x,p=u.y-c.y,d=0,v=o.targets.length;d<v;d++){var y=o.targets[d],h=void 0;(h=Xu.is.func(y)?y(f,p,e,c,d):y)&&s.push({x:(Xu.is.number(h.x)?h.x:f)+c.x,y:(Xu.is.number(h.y)?h.y:p)+c.y,range:Xu.is.number(h.range)?h.range:o.range,source:y,index:d,offset:c})}for(var g={target:null,inRange:!1,distance:0,range:0,delta:{x:0,y:0}},b=0;b<s.length;b++){var m=s[b],O=m.range,w=m.x-u.x,_=m.y-u.y,P=Xu.hypot(w,_),x=P<=O;O===1/0&&g.inRange&&g.range!==1/0&&(x=!1),g.target&&!(x?g.inRange&&O!==1/0?P/O<g.distance/g.range:O===1/0&&g.range!==1/0||P<g.distance:!g.inRange&&P<g.distance)||(g.target=m,g.distance=P,g.range=O,g.inRange=x,g.delta.x=w,g.delta.y=_)}return g.inRange&&(n.x=g.target.x,n.y=g.target.y),r.closest=g},defaults:{range:1/0,targets:null,offset:null,offsetWithOrigin:!0,origin:null,relativePoints:null,endOnly:!1,enabled:!1}};Ru.snap=Nu;var Lu=(0,Ci.makeModifier)(Nu,"snap");Ru.default=Lu;var Bu={};function Vu(t){return(Vu="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Bu,"__esModule",{value:!0}),Bu.snapSize=Bu.default=void 0;var qu,Uu=(qu=ct)&&qu.__esModule?qu:{default:qu},Gu=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Vu(t)&&"function"!=typeof t)return{default:t};var e=Hu();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w);function Hu(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Hu=function(){return t},t}function Ku(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var $u={start:function(t){var e=t.state,n=t.edges,r=e.options;if(!n)return null;t.state={options:{targets:null,relativePoints:[{x:n.left?0:1,y:n.top?0:1}],offset:r.offset||"self",origin:{x:0,y:0},range:r.range}},e.targetFields=e.targetFields||[["width","height"],["x","y"]],Ru.snap.start(t),e.offsets=t.state.offsets,t.state=e},set:function(t){var e=t.interaction,n=t.state,r=t.coords,o=n.options,i=n.offsets,a={x:r.x-i[0].x,y:r.y-i[0].y};n.options=(0,Uu.default)({},o),n.options.targets=[];for(var u=0;u<(o.targets||[]).length;u++){var s=(o.targets||[])[u],l=void 0;if(l=Gu.func(s)?s(a.x,a.y,e):s){for(var c=0;c<n.targetFields.length;c++){var f=Ku(n.targetFields[c],2),p=f[0],d=f[1];if(p in l||d in l){l.x=l[p],l.y=l[d];break}}n.options.targets.push(l)}}var v=Ru.snap.set(t);return n.options=o,v},defaults:{range:1/0,targets:null,offset:null,endOnly:!1,enabled:!1}};Bu.snapSize=$u;var Zu=(0,Ci.makeModifier)($u,"snapSize");Bu.default=Zu;var Ju={};Object.defineProperty(Ju,"__esModule",{value:!0}),Ju.snapEdges=Ju.default=void 0;var Qu=es(V),ts=es(ct);function es(t){return t&&t.__esModule?t:{default:t}}var ns={start:function(t){var e=t.edges;return e?(t.state.targetFields=t.state.targetFields||[[e.left?"left":"right",e.top?"top":"bottom"]],Bu.snapSize.start(t)):null},set:Bu.snapSize.set,defaults:(0,ts.default)((0,Qu.default)(Bu.snapSize.defaults),{targets:null,range:null,offset:{x:0,y:0}})};Ju.snapEdges=ns;var rs=(0,Ci.makeModifier)(ns,"snapEdges");Ju.default=rs;var os={};Object.defineProperty(os,"__esModule",{value:!0}),os.default=void 0;function is(){}is._defaults={};var as=is;os.default=as;var us={};Object.defineProperty(us,"__esModule",{value:!0}),us.default=void 0;function ss(){}ss._defaults={};var ls=ss;us.default=ls;var cs={};Object.defineProperty(cs,"__esModule",{value:!0}),cs.default=void 0;var fs=Ps(Ra),ps=Ps(Ha),ds=Ps(su),vs=Ps(Za),ys=Ps(Ou),hs=Ps(xu),gs=Ps(Au),bs=Ps(Ju),ms=Ps(Ru),Os=Ps(Bu),ws=Ps(os),_s=Ps(us);function Ps(t){return t&&t.__esModule?t:{default:t}}var xs={aspectRatio:fs.default,restrictEdges:ds.default,restrict:vs.default,restrictRect:ys.default,restrictSize:hs.default,snapEdges:bs.default,snap:ms.default,snapSize:Os.default,spring:ws.default,avoid:ps.default,transform:_s.default,rubberband:gs.default};cs.default=xs;var Ss={};Object.defineProperty(Ss,"__esModule",{value:!0}),Ss.default=void 0;var js=Es(Ta),Ms=Es(cs),ks=Es(Ci);function Es(t){return t&&t.__esModule?t:{default:t}}var Ts={id:"modifiers",install:function(t){var e=t.interactStatic;for(var n in t.usePlugin(ks.default),t.usePlugin(js.default),e.modifiers=Ms.default,Ms.default){var r=Ms.default[n],o=r._defaults,i=r._methods;o._methods=i,t.defaults.perAction[n]=o}}};Ss.default=Ts;var Ds={};Object.defineProperty(Ds,"__esModule",{value:!0}),Ds.default=void 0;Ds.default={};var Is={};Object.defineProperty(Is,"__esModule",{value:!0}),Is.PointerEvent=Is.default=void 0;var zs,As=(zs=Me)&&zs.__esModule?zs:{default:zs},Cs=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Rs(t)&&"function"!=typeof t)return{default:t};var e=Ws();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(zt);function Ws(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Ws=function(){return t},t}function Rs(t){return(Rs="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Fs(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Xs(t){return(Xs=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function Ys(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function Ns(t,e){return(Ns=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function Ls(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var Bs=function(){function f(t,e,n,r,o,i){var a,u,s;if(!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,f),u=this,a=!(s=Xs(f).call(this,o))||"object"!==Rs(s)&&"function"!=typeof s?Ys(u):s,Ls(Ys(a),"type",void 0),Ls(Ys(a),"originalEvent",void 0),Ls(Ys(a),"pointerId",void 0),Ls(Ys(a),"pointerType",void 0),Ls(Ys(a),"double",void 0),Ls(Ys(a),"pageX",void 0),Ls(Ys(a),"pageY",void 0),Ls(Ys(a),"clientX",void 0),Ls(Ys(a),"clientY",void 0),Ls(Ys(a),"dt",void 0),Ls(Ys(a),"eventable",void 0),Cs.pointerExtend(Ys(a),n),n!==e&&Cs.pointerExtend(Ys(a),e),a.timeStamp=i,a.originalEvent=n,a.type=t,a.pointerId=Cs.getPointerId(e),a.pointerType=Cs.getPointerType(e),a.target=r,a.currentTarget=null,"tap"===t){var l=o.getPointerIndex(e);a.dt=a.timeStamp-o.pointers[l].downTime;var c=a.timeStamp-o.tapTime;a.double=!!(o.prevTap&&"doubletap"!==o.prevTap.type&&o.prevTap.target===a.target&&c<500)}else"doubletap"===t&&(a.dt=e.timeStamp-o.tapTime);return a}var t,e,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&Ns(t,e)}(f,As["default"]),t=f,(e=[{key:"_subtractOrigin",value:function(t){var e=t.x,n=t.y;return this.pageX-=e,this.pageY-=n,this.clientX-=e,this.clientY-=n,this}},{key:"_addOrigin",value:function(t){var e=t.x,n=t.y;return this.pageX+=e,this.pageY+=n,this.clientX+=e,this.clientY+=n,this}},{key:"preventDefault",value:function(){this.originalEvent.preventDefault()}}])&&Fs(t.prototype,e),n&&Fs(t,n),f}();Is.PointerEvent=Is.default=Bs;var Vs={};function qs(t){return(qs="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Vs,"__esModule",{value:!0}),Vs.default=void 0;Ks(En),Ks(m({}));var Us=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==qs(t)&&"function"!=typeof t)return{default:t};var e=Hs();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le),Gs=Ks(Is);function Hs(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Hs=function(){return t},t}function Ks(t){return t&&t.__esModule?t:{default:t}}var $s={id:"pointer-events/base",install:function(t){t.pointerEvents=$s,t.defaults.actions.pointerEvents=$s.defaults,Us.extend(t.actions.phaselessTypes,$s.types)},listeners:{"interactions:new":function(t){var e=t.interaction;e.prevTap=null,e.tapTime=0},"interactions:update-pointer":function(t){var e=t.down,n=t.pointerInfo;if(!e&&n.hold)return;n.hold={duration:1/0,timeout:null}},"interactions:move":function(t,e){var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget,a=t.duplicate,u=n.getPointerIndex(r);a||n.pointerIsDown&&!n.pointerWasMoved||(n.pointerIsDown&&clearTimeout(n.pointers[u].hold.timeout),Zs({interaction:n,pointer:r,event:o,eventTarget:i,type:"move"},e))},"interactions:down":function(t,e){!function(t,e){for(var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget,a=t.pointerIndex,u=n.pointers[a].hold,s=Us.dom.getPath(i),l={interaction:n,pointer:r,event:o,eventTarget:i,type:"hold",targets:[],path:s,node:null},c=0;c<s.length;c++){var f=s[c];l.node=f,e.fire("pointerEvents:collect-targets",l)}if(!l.targets.length)return;for(var p=1/0,d=0;d<l.targets.length;d++){var v=l.targets[d].eventable.options.holdDuration;v<p&&(p=v)}u.duration=p,u.timeout=setTimeout(function(){Zs({interaction:n,eventTarget:i,pointer:r,event:o,type:"hold"},e)},p)}(t,e),Zs(t,e)},"interactions:up":function(t,e){var n,r,o,i,a,u;Qs(t),Zs(t,e),r=e,o=(n=t).interaction,i=n.pointer,a=n.event,u=n.eventTarget,o.pointerWasMoved||Zs({interaction:o,eventTarget:u,pointer:i,event:a,type:"tap"},r)},"interactions:cancel":function(t,e){Qs(t),Zs(t,e)}},PointerEvent:Gs.default,fire:Zs,collectEventTargets:Js,defaults:{holdDuration:600,ignoreFrom:null,allowFrom:null,origin:{x:0,y:0}},types:{down:!0,move:!0,up:!0,cancel:!0,tap:!0,doubletap:!0,hold:!0}};function Zs(t,e){var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget,a=t.type,u=t.targets,s=void 0===u?Js(t,e):u,l=new Gs.default(a,r,o,i,n,e.now());e.fire("pointerEvents:new",{pointerEvent:l});for(var c={interaction:n,pointer:r,event:o,eventTarget:i,targets:s,type:a,pointerEvent:l},f=0;f<s.length;f++){var p=s[f];for(var d in p.props||{})l[d]=p.props[d];var v=Us.getOriginXY(p.eventable,p.node);if(l._subtractOrigin(v),l.eventable=p.eventable,l.currentTarget=p.node,p.eventable.fire(l),l._addOrigin(v),l.immediatePropagationStopped||l.propagationStopped&&f+1<s.length&&s[f+1].node!==l.currentTarget)break}if(e.fire("pointerEvents:fired",c),"tap"===a){var y=l.double?Zs({interaction:n,pointer:r,event:o,eventTarget:i,type:"doubletap"},e):l;n.prevTap=y,n.tapTime=y.timeStamp}return l}function Js(t,e){var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget,a=t.type,u=n.getPointerIndex(r),s=n.pointers[u];if("tap"===a&&(n.pointerWasMoved||!s||s.downTarget!==i))return[];for(var l=Us.dom.getPath(i),c={interaction:n,pointer:r,event:o,eventTarget:i,type:a,path:l,targets:[],node:null},f=0;f<l.length;f++){var p=l[f];c.node=p,e.fire("pointerEvents:collect-targets",c)}return"hold"===a&&(c.targets=c.targets.filter(function(t){return t.eventable.options.holdDuration===n.pointers[u].hold.duration})),c.targets}function Qs(t){var e=t.interaction,n=t.pointerIndex;e.pointers[n].hold&&clearTimeout(e.pointers[n].hold.timeout)}var tl=$s;Vs.default=tl;var el={};Object.defineProperty(el,"__esModule",{value:!0}),el.default=void 0;rl(Is);var nl=rl(Vs);function rl(t){return t&&t.__esModule?t:{default:t}}function ol(t){var e=t.interaction;e.holdIntervalHandle&&(clearInterval(e.holdIntervalHandle),e.holdIntervalHandle=null)}var il={id:"pointer-events/holdRepeat",install:function(t){t.usePlugin(nl.default);var e=t.pointerEvents;e.defaults.holdRepeatInterval=0,e.types.holdrepeat=t.actions.phaselessTypes.holdrepeat=!0},listeners:["move","up","cancel","endall"].reduce(function(t,e){return t["pointerEvents:".concat(e)]=ol,t},{"pointerEvents:new":function(t){var e=t.pointerEvent;"hold"===e.type&&(e.count=(e.count||0)+1)},"pointerEvents:fired":function(t,e){var n=t.interaction,r=t.pointerEvent,o=t.eventTarget,i=t.targets;if("hold"===r.type&&i.length){var a=i[0].eventable.options.holdRepeatInterval;a<=0||(n.holdIntervalHandle=setTimeout(function(){e.pointerEvents.fire({interaction:n,eventTarget:o,type:"hold",pointer:r,event:r},e)},a))}}})};el.default=il;var al={};Object.defineProperty(al,"__esModule",{value:!0}),al.default=void 0;var ul,sl=(ul=ct)&&ul.__esModule?ul:{default:ul};function ll(t){return(0,sl.default)(this.events.options,t),this}var cl={id:"pointer-events/interactableTargets",install:function(t){var e=t.Interactable;e.prototype.pointerEvents=ll;var r=e.prototype._backCompatOption;e.prototype._backCompatOption=function(t,e){var n=r.call(this,t,e);return n===this&&(this.events.options[t]=e),n}},listeners:{"pointerEvents:collect-targets":function(t,e){var r=t.targets,o=t.node,i=t.type,a=t.eventTarget;e.interactables.forEachMatch(o,function(t){var e=t.events,n=e.options;e.types[i]&&e.types[i].length&&t.testIgnoreAllow(n,o,a)&&r.push({node:o,eventable:e,props:{interactable:t}})})},"interactable:new":function(t){var e=t.interactable;e.events.getRect=function(t){return e.getRect(t)}},"interactable:set":function(t,e){var n=t.interactable,r=t.options;(0,sl.default)(n.events.options,e.pointerEvents.defaults),(0,sl.default)(n.events.options,r.pointerEvents||{})}}};al.default=cl;var fl={};function pl(t){return(pl="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(fl,"__esModule",{value:!0}),Object.defineProperty(fl,"holdRepeat",{enumerable:!0,get:function(){return vl.default}}),Object.defineProperty(fl,"interactableTargets",{enumerable:!0,get:function(){return yl.default}}),fl.pointerEvents=fl.default=void 0;var dl=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==pl(t)&&"function"!=typeof t)return{default:t};var e=gl();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(Vs);fl.pointerEvents=dl;var vl=hl(el),yl=hl(al);function hl(t){return t&&t.__esModule?t:{default:t}}function gl(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return gl=function(){return t},t}var bl={id:"pointer-events",install:function(t){t.usePlugin(dl),t.usePlugin(vl.default),t.usePlugin(yl.default)}};fl.default=bl;var ml={};Object.defineProperty(ml,"__esModule",{value:!0}),ml.install=wl,ml.default=void 0;var Ol;(Ol=k({}))&&Ol.__esModule;function wl(e){var t=e.Interactable;e.actions.phases.reflow=!0,t.prototype.reflow=function(t){return function(u,s,l){function t(){var e=c[d],t=u.getRect(e);if(!t)return"break";var n=le.arr.find(l.interactions.list,function(t){return t.interacting()&&t.interactable===u&&t.element===e&&t.prepared.name===s.name}),r=void 0;if(n)n.move(),p&&(r=n._reflowPromise||new f(function(t){n._reflowResolve=t}));else{var o=le.rect.tlbrToXywh(t),i={page:{x:o.x,y:o.y},client:{x:o.x,y:o.y},timeStamp:l.now()},a=le.pointer.coordsToEvent(i);r=function(t,e,n,r,o){var i=t.interactions.new({pointerType:"reflow"}),a={interaction:i,event:o,pointer:o,eventTarget:n,phase:"reflow"};i.interactable=e,i.element=n,i.prepared=(0,le.extend)({},r),i.prevEvent=o,i.updatePointer(o,o,n,!0),i._doPhase(a);var u=le.win.window.Promise?new le.win.window.Promise(function(t){i._reflowResolve=t}):null;i._reflowPromise=u,i.start(r,e,n),i._interacting?(i.move(a),i.end(o)):i.stop();return i.removePointer(o,o),i.pointerIsDown=!1,u}(l,u,e,s,a)}p&&p.push(r)}for(var c=le.is.string(u.target)?le.arr.from(u._context.querySelectorAll(u.target)):[u.target],f=le.win.window.Promise,p=f?[]:null,d=0;d<c.length;d++){if("break"===t())break}return p&&f.all(p).then(function(){return u})}(this,t,e)}}var _l={id:"reflow",install:wl,listeners:{"interactions:stop":function(t,e){var n=t.interaction;"reflow"===n.pointerType&&(n._reflowResolve&&n._reflowResolve(),le.arr.remove(e.interactions.list,n))}}};ml.default=_l;var Pl={};Object.defineProperty(Pl,"__esModule",{value:!0}),Pl.default=void 0;Pl.default={};var xl={};Object.defineProperty(xl,"__esModule",{value:!0}),xl.exchange=void 0;xl.exchange={};var Sl={};Object.defineProperty(Sl,"__esModule",{value:!0}),Sl.default=void 0;Sl.default={};var jl={};function Ml(t){return(Ml="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(jl,"__esModule",{value:!0}),jl.default=void 0;var kl=Hl(Qr),El=Hl(ao),Tl=Hl(uo),Dl=Hl(ti),Il=Hl(ai),zl=Hl(ui),Al=Hl(Un),Cl=(Hl(si),Gl(wi)),Wl=Hl($i),Rl=Hl(ha),Fl=Hl(Ss),Xl=Hl(Ds),Yl=Hl(Yi),Nl=Hl(fl),Ll=Hl(ml),Bl=Gl(Pl),Vl=Gl(zt),ql=Gl(Sl);function Ul(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Ul=function(){return t},t}function Gl(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Ml(t)&&"function"!=typeof t)return{default:t};var e=Ul();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function Hl(t){return t&&t.__esModule?t:{default:t}}Rl.default.use(Xl.default),Rl.default.use(Al.default),Rl.default.use(Yl.default),Rl.default.use(Il.default),Rl.default.use(El.default),Rl.default.use(Nl.default),Rl.default.use(Wl.default),Rl.default.use(Fl.default),Rl.default.use(Dl.default),Rl.default.use(kl.default),Rl.default.use(Tl.default),Rl.default.use(Ll.default),Rl.default.feedback=Cl,Rl.default.use(zl.default),Rl.default.vue={components:ql},Rl.default.__utils={exchange:xl.exchange,displace:Bl,pointer:Vl};var Kl=Rl.default;jl.default=Kl;var $l={exports:{}};Object.defineProperty($l.exports,"__esModule",{value:!0}),$l.exports.default=void 0;var Zl,Jl=(Zl=jl)&&Zl.__esModule?Zl:{default:Zl};function Ql(t){return(Ql="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}if("object"===Ql($l)&&$l)try{$l.exports=Jl.default}catch(t){}Jl.default.default=Jl.default;var tc=Jl.default;return $l.exports.default=tc,$l=$l.exports});



},{}],"src/interact.js":[function(require,module,exports) {
"use strict";

var _interactjs = _interopRequireDefault(require("interactjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var viewport = {
  x: 0,
  y: 0,
  width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
  height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
};
(0, _interactjs.default)("tileos-icon").draggable({
  inertia: false,
  modifiers: [_interactjs.default.modifiers.restrictRect({
    endOnly: true
  }), _interactjs.default.modifiers.snap({
    targets: [_interactjs.default.createSnapGrid({
      x: 64,
      y: 64
    })],
    range: Infinity,
    relativePoints: [{
      x: 0,
      y: 0
    }]
  })],
  autoScroll: false,
  listeners: {
    move: dragMoveListener
  }
}); // target elements with the "draggable" class

(0, _interactjs.default)("tileos-app-header").draggable({
  // enable inertial throwing
  inertia: false,
  // keep the element within the area of it's parent
  modifiers: [_interactjs.default.modifiers.restrictRect({
    endOnly: true
  }), _interactjs.default.modifiers.snap({
    targets: [_interactjs.default.createSnapGrid({
      x: 16,
      y: 16
    })],
    range: Infinity,
    relativePoints: [{
      x: 0,
      y: 0
    }]
  })],
  // enable autoScroll
  autoScroll: true,
  listeners: {
    move: dragApp
  }
});

function dragApp(event) {
  var header = event.target;
  window.header = header;
  var target = header.parentNode; // keep the dragged position in the data-x/data-y attributes

  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy; // translate the element

  target.style.webkitTransform = target.style.transform = "translate(" + x + "px, " + y + "px)"; // update the posiion attributes

  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

function dragMoveListener(event) {
  var target = event.target; // keep the dragged position in the data-x/data-y attributes

  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy; // translate the element

  target.style.webkitTransform = target.style.transform = "translate(" + x + "px, " + y + "px)"; // update the posiion attributes

  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}
},{"interactjs":"../../../../node_modules/interactjs/dist/interact.min.js"}],"index.js":[function(require,module,exports) {
"use strict";

require("./src/apps/loveHandle");

require("./src/apps/ferb");

require("./src/superfluent/icon");

require("./src/superfluent/header");

require("./src/superfluent/app");

require("./src/superfluent/dock");

require("./src/tileos");

require("./src/interact");
},{"./src/apps/loveHandle":"src/apps/loveHandle.js","./src/apps/ferb":"src/apps/ferb.js","./src/superfluent/icon":"src/superfluent/icon.js","./src/superfluent/header":"src/superfluent/header.js","./src/superfluent/app":"src/superfluent/app.js","./src/superfluent/dock":"src/superfluent/dock.js","./src/tileos":"src/tileos.js","./src/interact":"src/interact.js"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61319" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/checkmate-in-one.e31bb0bc.js.map