import {
  type Block,
  MULT_2,
  MULT_3,
  MULT_9,
  MULT_B,
  MULT_D,
  MULT_E,
  SBOX,
  SBOX_INV,
} from './aes-helpers.js';

export function xorBlocks(left: Block, right: Block): Block {
  return left.map((cells, row) =>
    cells.map((byte, column) => byte ^ right[row][column])
  );
}

function addRoundKey(state: Block, roundKey: Block): Block {
  return xorBlocks(state, roundKey);
}

function subBytes(state: Block): Block {
  return state.map((cells) => cells.map((byte) => SBOX[byte]));
}

function invSubBytes(state: Block): Block {
  return state.map((cells) => cells.map((byte) => SBOX_INV[byte]));
}

function rotateLeft(cells: number[], shift: number): number[] {
  return [...cells.slice(shift), ...cells.slice(0, shift)];
}

function shiftRows(state: Block): Block {
  return state.map((cells, row) => rotateLeft(cells, row));
}

function invShiftRows(state: Block): Block {
  return state.map((cells, row) =>
    rotateLeft(cells, (cells.length - row) % cells.length)
  );
}

function transpose(state: Block): Block {
  return state[0].map((_, column) => state.map((cells) => cells[column]));
}

function mixColumn([a0, a1, a2, a3]: number[]): number[] {
  return [
    MULT_2[a0] ^ MULT_3[a1] ^ a2 ^ a3,
    a0 ^ MULT_2[a1] ^ MULT_3[a2] ^ a3,
    a0 ^ a1 ^ MULT_2[a2] ^ MULT_3[a3],
    MULT_3[a0] ^ a1 ^ a2 ^ MULT_2[a3],
  ];
}

function invMixColumn([a0, a1, a2, a3]: number[]): number[] {
  return [
    MULT_E[a0] ^ MULT_B[a1] ^ MULT_D[a2] ^ MULT_9[a3],
    MULT_9[a0] ^ MULT_E[a1] ^ MULT_B[a2] ^ MULT_D[a3],
    MULT_D[a0] ^ MULT_9[a1] ^ MULT_E[a2] ^ MULT_B[a3],
    MULT_B[a0] ^ MULT_D[a1] ^ MULT_9[a2] ^ MULT_E[a3],
  ];
}

function mixColumns(state: Block): Block {
  return transpose(transpose(state).map(mixColumn));
}

function invMixColumns(state: Block): Block {
  return transpose(transpose(state).map(invMixColumn));
}

export function encryptBlock(block: Block, roundKeys: Block[]): Block {
  const rounds = roundKeys.length - 1;

  let state = addRoundKey(block, roundKeys[0]);
  for (let round = 1; round < rounds; round++) {
    state = addRoundKey(
      mixColumns(shiftRows(subBytes(state))),
      roundKeys[round]
    );
  }

  return addRoundKey(shiftRows(subBytes(state)), roundKeys[rounds]);
}

export function decryptBlock(block: Block, roundKeys: Block[]): Block {
  const rounds = roundKeys.length - 1;

  let state = addRoundKey(block, roundKeys[rounds]);
  for (let round = 1; round < rounds; round++) {
    state = invMixColumns(
      addRoundKey(invSubBytes(invShiftRows(state)), roundKeys[rounds - round])
    );
  }

  return addRoundKey(invSubBytes(invShiftRows(state)), roundKeys[0]);
}
