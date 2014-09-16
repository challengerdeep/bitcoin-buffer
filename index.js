var assert = require('assert')

// https://github.com/bitcoinjs/bitcoinjs-lib/blob/cc98600154bf921acaff2efd907c1fcec08232e8/src/bufferutils.js
module.exports.writeUInt64LE = function (buf, n, offset) {
  verifuint(n, 0x001fffffffffffff)
  buf.writeInt32LE(n & -1, offset)
  buf.writeUInt32LE(Math.floor(n / 0x100000000), offset + 4)
}

// https://github.com/bitcoinjs/bitcoinjs-lib/blob/cc98600154bf921acaff2efd907c1fcec08232e8/src/bufferutils.js
module.exports.readUInt64LE = function (buf, offset) {
  var n = buf.readUInt32LE(offset) + buf.readUInt32LE(offset + 4) * 0x100000000
  verifuint(n, 0x001fffffffffffff)
  return n
}

module.exports.writeVarInt = function (buf, n, offset) {
  if (!offset)
    offset = 0

  if (n < 0xfd) {
    buf.writeUInt8(n, offset)
  } else if (n <= 0xffff) {
    buf[offset] = 0xfd
    buf.writeUInt16LE(n, offset + 1)
  } else if (n <= 0xffffffff) {
    buf[offset] = 0xfe
    buf.writeUInt32LE(n, offset + 1)
  } else {
    buf[offset] = 0xff
    module.exports.writeUInt64LE(buf, n, offset + 1)
  }
}

module.exports.readVarInt = function (buf, offset) {
  if (!offset)
    offset = 0

  var res, size

  if (buf[offset] < 0xfd) {
    res = buf.readUInt8(offset)
    size = 1
  } else if (buf[offset] === 0xfd) {
    res = buf.readUInt16LE(offset + 1)
    size = 3
  } else if (buf[offset] === 0xfe) {
    res = buf.readUInt32LE(offset + 1)
    size = 5
  } else if (buf[offset] === 0xff) {
    res = module.exports.readUInt64LE(buf, offset + 1)
    size = 9
  }

  return { res: res, offset: offset + size }
}

// https://github.com/feross/buffer/blob/master/index.js#L1127
function verifuint(value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}
