var bufferEqual = require('buffer-equal')
var test = require('tape')
var utils = require('../')

test('Buffer tests', function (t) {
  t.plan(10)

  var b = new Buffer(8)

  utils.writeUInt64LE(b, 1, 0)
  t.ok(bufferEqual(b, new Buffer('0100000000000000', 'hex')))
  t.equal(utils.readUInt64LE(b, 0), 1)

  b = utils.numToVarInt(2)
  t.ok(bufferEqual(b, new Buffer('02', 'hex')))
  t.deepEqual(utils.readVarInt(b, 0), { res: 2, offset: 1 })

  b = utils.numToVarInt(0xfe)
  t.ok(bufferEqual(b, new Buffer('fdfe00', 'hex')))
  t.deepEqual(utils.readVarInt(b, 0), { res: 0xfe, offset: 3 })

  b = utils.numToVarInt(0xffffff)
  t.ok(bufferEqual(b, new Buffer('feffffff00', 'hex')))
  t.deepEqual(utils.readVarInt(b, 0), { res: 0xffffff, offset: 5 })

  b = utils.numToVarInt(0xffffffffff)
  t.ok(bufferEqual(b, new Buffer('ffffffffffff000000', 'hex')))
  t.deepEqual(utils.readVarInt(b, 0), { res: 0xffffffffff, offset: 9 })

})
