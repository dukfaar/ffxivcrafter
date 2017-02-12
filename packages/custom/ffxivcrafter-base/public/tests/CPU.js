'use strict'

describe('CPU', function () {
  beforeEach(module('mean.ffxivCrafter_base'))

  var CPU
  var cpu

  beforeEach(inject(function (_CPU_) {
    CPU = _CPU_
    cpu = new CPU.CPU()
  }))

  it('can set a variable to a number', function (done) {
    cpu.execute(CPU.compile('set a #13'))
    expect(cpu.memory.a).toBe('13')
    done()
  })

  it('can copy a variable', function (done) {
    cpu.execute(CPU.compile('set a #13\nset b a'))
    expect(cpu.memory.a).toBe('13')
    expect(cpu.memory.b).toBe('13')
    done()
  })

  describe('math', function () {
    it('can add 2 numbers', function (done) {
      var code = CPU.compile('set a #13\nset b #12\nadd a b')
      expect(code.length).toBe(3)
      expect(code[0].instructionName).toBe('set')
      expect(code[0].args[0]).toBe('a')
      expect(code[0].args[1]).toBe('#13')
      expect(code[2].instructionName).toBe('add')
      expect(code[2].args[0]).toBe('a')
      expect(code[2].args[1]).toBe('b')
      cpu.execute(code)
      expect(cpu.memory.a).toBe(25)
      done()
    })

    it('can subtract 2 numbers', function (done) {
      cpu.execute(CPU.compile('set a #13\nset b #12\nsub a b'))
      expect(cpu.memory.a).toBe(1)
      done()
    })

    it('can multiply 2 numbers', function (done) {
      cpu.execute(CPU.compile('set a #13\nset b #12\nmul a b'))
      expect(cpu.memory.a).toBe(156)
      done()
    })

    it('can divide 2 numbers', function (done) {
      cpu.execute(CPU.compile('set a #12\nset b #2\ndiv a b'))
      expect(cpu.memory.a).toBe(6)
      done()
    })

    it('can floor a number', function (done) {
      cpu.execute(CPU.compile('set a #12.3\nfloor a'))
      expect(cpu.memory.a).toBe(12)
      done()
    })

    it('can ceil a number', function (done) {
      cpu.execute(CPU.compile('set a #12.3\nceil a'))
      expect(cpu.memory.a).toBe(13)
      done()
    })

    it('can log a number', function (done) {
      cpu.execute(CPU.compile('set a #12.3\nlog a'))
      expect(cpu.memory.a).toBe(Math.log(12.3))
      done()
    })
  })

  it('exits', function (done) {
    cpu.execute(CPU.compile('set a #2\nexit\nadd a #1'))
    expect(cpu.memory.a).toBe('2')
    done()
  })

  it('jumps without a condition', function (done) {
    cpu.execute(CPU.compile('jmp any skipset2 #0\nset a #2\n@ skipset2\nset a #1\nexit'))
    expect(cpu.memory.a).toBe('1')
    done()
  })

  it('does not jump if condition is not met', function (done) {
    cpu.flags.eq = false
    cpu.flags.gt = false
    cpu.flags.lt = false
    cpu.execute(CPU.compile('jmp gt skipset2 #0\nset a #2\nexit\n@ skipset2\nset a #1\nexit'))
    expect(cpu.memory.a).toBe('2')
    done()
  })

  it('jumps if condition is met for not equal', function (done) {
    cpu.flags.eq = false
    cpu.flags.gt = false
    cpu.flags.lt = false
    cpu.execute(CPU.compile('jmp neq skipset2 #0\nset a #2\nexit\n@ skipset2\nset a #1\nexit'))
    expect(cpu.memory.a).toBe('1')
    done()
  })

  it('jumps if condition is met for gt', function (done) {
    cpu.flags.eq = false
    cpu.flags.gt = true
    cpu.flags.lt = false
    cpu.execute(CPU.compile('jmp gt skipset2 #0\nset a #2\nexit\n@ skipset2\nset a #1\nexit'))
    expect(cpu.memory.a).toBe('1')
    done()
  })

  it('jumps if condition is met for lt', function (done) {
    cpu.flags.eq = false
    cpu.flags.gt = false
    cpu.flags.lt = true
    cpu.execute(CPU.compile('jmp lt skipset2 #0\nset a #2\nexit\n@ skipset2\nset a #1\nexit'))
    expect(cpu.memory.a).toBe('1')
    done()
  })

  it('compares two equal values', function (done) {
    cpu.execute(CPU.compile('set a #3\nset b #3\ncmp a b'))
    expect(cpu.flags.eq).toBe(true)
    expect(cpu.flags.gt).toBe(false)
    expect(cpu.flags.lt).toBe(false)
    done()
  })

  it('compares two different values for lt', function (done) {
    cpu.execute(CPU.compile('set a #3\nset b #19\ncmp a b'))
    expect(cpu.flags.eq).toBe(false)
    expect(cpu.flags.gt).toBe(false)
    expect(cpu.flags.lt).toBe(true)
    done()
  })

  it('compares two different values for gt', function (done) {
    cpu.execute(CPU.compile('set a #3\nset b #19\ncmp b a'))
    expect(cpu.flags.eq).toBe(false)
    expect(cpu.flags.gt).toBe(true)
    expect(cpu.flags.lt).toBe(false)
    done()
  })

  it('calls a function and returns', function (done) {
    cpu.execute(CPU.compile('call f\nset b #22\nexit\n@ f\nset a #17\n ret\n'))
    expect(cpu.memory.a).toBe('17')
    expect(cpu.memory.b).toBe('22')
    done()
  })

  it('calls a function and conditionally returns', function (done) {
    spyOn(cpu, 'checkConditionalFail').and.callThrough()
    cpu.execute(CPU.compile('call f\nset b #22\nexit\n@ f\nset a #4\ncmp a #4\nret neq\nset a #17\nret\n'))
    expect(cpu.checkConditionalFail).toHaveBeenCalled()
    expect(cpu.flags.eq).toBe(true)
    expect(cpu.memory.a).toBe('17')
    expect(cpu.memory.b).toBe('22')
    done()
  })

  it('calls a function twice', function (done) {
    cpu.execute(CPU.compile('set a #3\ncall f\ncall f\n exit\n@ f\nadd a #1\nret\n'))
    expect(cpu.memory.a).toBe(5)
    done()
  })
})
