'use strict'

angular.module('mean.ffxivCrafter_base').factory('CPU', ['_',
  function (_) {
    return {
      compile: function (code) {
        var lines = _.split(code, '\n')
        lines = _.reject(lines, (line) => { return _.trim(line).length === 0 })
        lines = _.reject(lines, (line) => { return _.startsWith(_.trim(line), ';') })
        return _.map(lines, (line) => {
          var splitted = _.split(_.trim(line), /\s+/)
          return { instructionName: _.trim(_.head(splitted)), args: _.map(_.tail(splitted), (arg) => { return _.trim(arg) }) }
        })
      },
      CPU: function () {
        this.memory = {}
        this.flags = {
          eq: false,
          gt: false,
          lt: false
        }

        this.getValue = function (arg) {
          if (_.startsWith(arg, '#')) {
            return arg.slice(1, arg.length)
          } else {
            return this.memory[arg]
          }
        }

        this.checkConditionalFail = function (cond) {
          if (cond === 'any') return false
          return (
             (cond === 'eq' && !this.flags.eq) ||
             (cond === 'neq' && this.flags.eq) ||
             (cond === 'gt' && !this.flags.gt) ||
             (cond === 'lt' && !this.flags.lt) ||
             (cond === 'gte' && !this.flags.eq && !this.flags.gt) ||
             (cond === 'lte' && !this.flags.eq && !this.flags.lt)
          )
        }

        this.instructions = {
          set: ([a0, a1]) => { this.memory[a0] = this.getValue(a1) },
          add: ([a0, a1]) => { this.memory[a0] = parseFloat(this.getValue(a0)) + parseFloat(this.getValue(a1)) },
          sub: ([a0, a1]) => { this.memory[a0] = parseFloat(this.getValue(a0)) - parseFloat(this.getValue(a1)) },
          mul: ([a0, a1]) => { this.memory[a0] = parseFloat(this.getValue(a0)) * parseFloat(this.getValue(a1)) },
          div: ([a0, a1]) => { this.memory[a0] = parseFloat(this.getValue(a0)) / parseFloat(this.getValue(a1)) },
          log: ([a0]) => { this.memory[a0] = Math.log(parseFloat(this.getValue(a0))) },
          ceil: ([a0]) => { this.memory[a0] = Math.ceil(parseFloat(this.getValue(a0))) },
          floor: ([a0]) => { this.memory[a0] = Math.floor(parseFloat(this.getValue(a0))) },
          exit: (args) => { this.memory.pc = -1 },
          cmp: ([a0, a1]) => {
            this.flags.eq = parseFloat(this.getValue(a0)) === parseFloat(this.getValue(a1))
            this.flags.gt = parseFloat(this.getValue(a0)) > parseFloat(this.getValue(a1))
            this.flags.lt = parseFloat(this.getValue(a0)) < parseFloat(this.getValue(a1))
          },
          '@': (args) => {},
          jmp: ([cond, a0, a1]) => {
            if (this.checkConditionalFail(cond)) return

            this.memory.pc = parseInt(this.getValue(a0)) + parseInt(this.getValue(a1))
          },
          call: ([a0]) => {
            if (!this.memory.stack) this.memory.stack = [this.memory.pc]
            else this.memory.stack.push(this.memory.pc)

            this.memory.pc = parseInt(this.getValue(a0))
          },
          ret: (args) => {
            if (args.length === 1) {
              if (this.checkConditionalFail(args[0])) {
                return
              }
            }

            this.memory.pc = this.memory.stack.pop()
          }
        }

        this.executeInstruction = function (i) {
          this.instructions[i.instructionName].bind(this)(i.args)
        }

        this.fetchInstruction = function (code) {
          var i = code[this.memory.pc]
          this.memory.pc ++
          return i
        }

        this.parseLabels = function (code) {
          this.memory.pc = 0

          while (this.memory.pc >= 0 && this.memory.pc < code.length) {
            var i = this.fetchInstruction(code)
            if (i.instructionName === '@') {
              this.memory[i.args[0]] = this.memory.pc
            }
          }
        }

        this.execute = function (code) {
          this.parseLabels(code)

          this.memory.pc = 0

          while (this.memory.pc >= 0 && this.memory.pc < code.length) {
            var i = this.fetchInstruction(code)
            this.executeInstruction(i)
          }
        }
      }
    }
  }
])
