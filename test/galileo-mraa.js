"use strict";

global.IS_TEST_ENV = true;

var Galileo = require("../lib/galileo");
var Emitter = require("events").EventEmitter;
var sinon = require("sinon");
var tick = global.setImmediate || process.nextTick;

function restore(target) {
  for (var prop in target) {

    if (target[prop] != null && typeof target[prop].restore === "function") {
      target[prop].restore();
    }
    if (typeof target[prop] === "object") {
      restore(target[prop]);
    }
  }
}

var IO = Galileo.__io;
var Gpio = IO.Gpio;
var Aio = IO.Aio;
var Pwm = IO.Pwm;
var I2c = IO.I2c;


exports["Platform Type Galileo"] = {
  setUp: function(done) {
    this.gpt = sinon.stub(IO, "getPlatformType").returns(1);
    this.board = new Galileo();
    done();
  },
  tearDown: function(done) {
    restore(this);
    Galileo.reset();
    done();
  },
  platformtype: function(test) {
    test.expect(1);
    test.equal(this.board.name, "Intel Galileo Gen 2");
    test.done();
  }
};

exports["Platform Type Edison"] = {
  setUp: function(done) {

    this.pinModes = [
      { modes: [] },
      { modes: [] },
      { modes: [0, 1] },
      { modes: [0, 1, 3, 4] },
      { modes: [0, 1] },
      { modes: [0, 1, 3, 4] },
      { modes: [0, 1, 3, 4] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1, 3, 4] },
      { modes: [0, 1, 3, 4] },
      { modes: [0, 1, 3, 4] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1, 2], analogChannel: 0 },
      { modes: [0, 1, 2], analogChannel: 1 },
      { modes: [0, 1, 2], analogChannel: 2 },
      { modes: [0, 1, 2], analogChannel: 3 },
      { modes: [0, 1, 2], analogChannel: 4 },
      { modes: [0, 1, 2], analogChannel: 5 },
    ];

    this.connections = this.pinModes.reduce(function(accum, value, i) {
      if (value !== null) {
        accum.push(i);
      }
      return accum;
    }, []);

    this.analogs = this.pinModes.reduce(function(accum, value, i) {
      if (typeof value.analogChannel === "number") {
        accum.push(i);
      }
      return accum;
    }, []);


    this.gpt = sinon.stub(IO, "getPlatformType").returns(2);
    this.board = new Galileo();
    done();
  },
  tearDown: function(done) {
    restore(this);
    Galileo.reset();
    done();
  },
  platformtype: function(test) {
    test.expect(1);
    test.equal(this.board.name, "Intel Edison");
    test.done();
  },
  arduinoBoardErrors: function(test) {
    test.expect(78);

    var board = new Galileo();
    var pin = 30;

    // No connection on pin 30
    test.throws(function() {
      board.pinMode(pin, 0);
    });

    test.throws(function() {
      board.digitalWrite(pin, 0);
    });

    test.throws(function() {
      board.digitalRead(pin, function() {});
    });

    test.throws(function() {
      board.analogWrite(pin, 0);
    });

    test.throws(function() {
      board.analogRead(pin, function() {});
    });

    test.throws(function() {
      board.servoWrite(pin, 0);
    });

    this.connections.forEach(function(pin) {
      var isAnalog = typeof this.pinModes[pin].analogChannel === "number";

      if (this.pinModes[pin].modes.length === 0) {
        return;
      }

      if (isAnalog) {
        pin = "A" + this.pinModes[pin].analogChannel;
        test.doesNotThrow(function() {
          board.pinMode(pin, 0);
        });

        test.doesNotThrow(function() {
          board.analogRead(pin, function() {});
        });
      } else {
        test.doesNotThrow(function() {
          board.pinMode(pin, 0);
        });

        test.doesNotThrow(function() {
          board.digitalWrite(pin, 0);
        });

        test.doesNotThrow(function() {
          board.digitalRead(pin, function() {});
        });

        test.doesNotThrow(function() {
          board.analogWrite(pin, 0);
        });

        test.doesNotThrow(function() {
          board.servoWrite(pin, 0);
        });
      }
    }, this);

    test.done();
  }
};

exports["Platform Type Edison (Miniboard)"] = {
  setUp: function(done) {

    this.pinModes = [
      { modes: [0, 1, 3, 4] },
      null,
      null,
      null,
      { modes: [0, 1] },
      null,
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      null,
      { modes: [0, 1] },
      { modes: [0, 1, 3, 4] },
      { modes: [0, 1] },
      null,
      null,
      null,
      { modes: [0, 1] },
      { modes: [0, 1, 3, 4] },
      { modes: [0, 1, 3, 4] },
      null,
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      null,
      null,
      null,
      null,
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      null,
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      null,
      null,
      null,
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
      { modes: [0, 1] },
    ];

    this.noConnections = this.pinModes.reduce(function(accum, value, i) {
      if (value === null) {
        accum.push(i);
      }
      return accum;
    }, []);
    this.connections = this.pinModes.reduce(function(accum, value, i) {
      if (value !== null) {
        accum.push(i);
      }
      return accum;
    }, []);

    Galileo.__miniboard(true);
    Galileo.__pinmodes(this.pinModes);
    done();
  },
  tearDown: function(done) {
    Galileo.__miniboard(false);
    Galileo.__pinmodes();
    restore(this);
    Galileo.reset();
    done();
  },
  miniBoardErrors: function(test) {
    test.expect(298);

    var board = new Galileo();

    // Tests for capabilities as shown here:
    // https://github.com/intel-iot-devkit/mraa/blob/master/docs/edison.md
    //

    // No analog read on any
    test.throws(function() {
      board.pinMode("any", 2);
    });

    this.noConnections.forEach(function(pin) {
      test.throws(function() {
        board.pinMode(pin, 0);
      });

      test.throws(function() {
        board.digitalWrite(pin, 0);
      });

      test.throws(function() {
        board.digitalRead(pin, function() {});
      });

      test.throws(function() {
        board.analogWrite(pin, 0);
      });

      test.throws(function() {
        board.analogRead(pin, function() {});
      });

      test.throws(function() {
        board.servoWrite(pin, 0);
      });
    });

    this.connections.forEach(function(pin) {
      test.doesNotThrow(function() {
        board.pinMode(pin, 0);
      });

      test.doesNotThrow(function() {
        board.digitalWrite(pin, 0);
      });

      test.doesNotThrow(function() {
        board.digitalRead(pin, function() {});
      });

      test.doesNotThrow(function() {
        board.analogWrite(pin, 0);
      });

      test.doesNotThrow(function() {
        board.servoWrite(pin, 0);
      });
    });

    test.done();
  }
};


exports["Digital & Analog"] = {
  setUp: function(done) {
    var protos = {
      gpio: Object.assign({}, Gpio.prototype),
      aio: Object.assign({}, Aio.prototype)
    };

    this.Gpio = sinon.spy(IO, "Gpio");
    this.Aio = sinon.spy(IO, "Aio");

    ["Gpio", "Aio"].forEach(function(name) {
      var key = name.toLowerCase();
      var target = this[name];

      this[key] = Object.keys(protos[key]).reduce(function(proto, prop) {
        target.prototype[prop] = protos[key][prop];
        proto[prop] = sinon.spy(target.prototype, prop);
        return proto;
      }, {});
    }, this);

    this.clock = sinon.useFakeTimers();

    this.board = new Galileo();

    for (var i = 2; i < 20; i++) {
      this.board.pins[i].initialize();
    }

    done();
  },
  tearDown: function(done) {
    restore(this);
    Galileo.reset();
    done();
  },
  initializationDigital: function(test) {
    test.expect(39);


    // 12 Digital IO Pins are initialized, with:
    //    - 12 calls to dir
    //    - 12 calls to useMmap
    //
    test.equal(this.Gpio.callCount, 12);
    test.equal(this.gpio.dir.callCount, 12);
    test.equal(this.gpio.useMmap.callCount, 12);

    // 12 calls to dir received the argument 0
    this.gpio.dir.args.forEach(function(args) {
      test.equal(args[0], 0);
    });

    // 12 calls to write received the argument 0
    this.gpio.write.args.forEach(function(args) {
      test.equal(args[0], 0);
    });

    // 12 calls to dir received the argument true
    this.gpio.useMmap.args.forEach(function(args) {
      test.equal(args[0], true);
    });

    test.done();
  },
  initializationAnalog: function(test) {
    test.expect(1);

    // 6 Digital IO Pins are initialized
    test.equal(this.Aio.callCount, 6);
    test.done();
  },
  blinkAll: function(test) {
    test.expect(6);

    var state = 0;

    for (var i = 2; i < 14; i++) {
      this.board.pinMode(i, this.board.MODES.OUTPUT);
    }

    setInterval(function() {
      state ^= 1;
      for (var i = 2; i < 14; i++) {
        this.board.digitalWrite(i, state);
      }
    }.bind(this), 10);


    this.gpio.write.reset();
    this.clock.tick(10);

    test.equal(this.gpio.write.callCount, 12);
    test.ok(this.gpio.write.alwaysCalledWithExactly(1));

    this.gpio.write.reset();
    this.clock.tick(10);

    test.equal(this.gpio.write.callCount, 12);
    test.ok(this.gpio.write.alwaysCalledWithExactly(0));

    this.gpio.write.reset();
    this.clock.tick(10);

    test.equal(this.gpio.write.callCount, 12);
    test.ok(this.gpio.write.alwaysCalledWithExactly(1));

    test.done();
  }
};

exports["Galileo.prototype.analogRead"] = {
  setUp: function(done) {
    var protos = {
      gpio: Object.assign({}, Gpio.prototype),
      aio: Object.assign({}, Aio.prototype)
    };

    this.Gpio = sinon.spy(IO, "Gpio");
    this.Aio = sinon.spy(IO, "Aio");

    ["Gpio", "Aio"].forEach(function(name) {
      var key = name.toLowerCase();
      var target = this[name];

      this[key] = Object.keys(protos[key]).reduce(function(proto, prop) {
        target.prototype[prop] = protos[key][prop];
        proto[prop] = sinon.spy(target.prototype, prop);
        return proto;
      }, {});
    }, this);

    this.clock = sinon.useFakeTimers();

    this.board = new Galileo();

    done();

  },
  tearDown: function(done) {
    this.aio.read.override = null;

    restore(this);

    for (var i = 0; i < 14; i++) {
      if (i < 6) {
        this.board.removeAllListeners("analog-read-" + i);
      }
      if (i > 2) {
        this.board.removeAllListeners("digital-read-" + i);
      }
    }

    Galileo.reset();
    done();
  },
  correctMode: function(test) {
    test.expect(1);

    this.board.analogRead("A0", function() {});

    // ANALOG input mode
    test.equal(this.board.pins[14].mode, 2);

    test.done();
  },

  analogPin: function(test) {
    test.expect(1);

    var value = 1023;

    this.aio.read.override = value;

    var handler = function(data) {
      test.equal(data, value);
      test.done();
    };

    this.board.analogRead(0, handler);
    this.clock.tick(10);
  },

  analogName: function(test) {
    test.expect(1);

    var value = 1023;

    this.aio.read.override = value;

    var handler = function(data) {
      test.equal(data, value);
      test.done();
    };

    this.board.analogRead("A0", handler);
    this.clock.tick(10);
  },

  event: function(test) {
    test.expect(1);

    var value = 1023;
    var event = "analog-read-0";

    this.aio.read.override = value;

    this.board.once(event, function(data) {
      test.equal(data, value);
      test.done();
    });

    var handler = function(data) {};

    this.board.analogRead("A0", handler);
    this.clock.tick(10);
  }
};

exports["Galileo.prototype.digitalRead"] = {
  setUp: function(done) {
    var protos = {
      gpio: Object.assign({}, Gpio.prototype),
      aio: Object.assign({}, Aio.prototype)
    };

    this.Gpio = sinon.spy(IO, "Gpio");
    this.Aio = sinon.spy(IO, "Aio");

    ["Gpio", "Aio"].forEach(function(name) {
      var key = name.toLowerCase();
      var target = this[name];

      this[key] = Object.keys(protos[key]).reduce(function(proto, prop) {
        target.prototype[prop] = protos[key][prop];
        proto[prop] = sinon.spy(target.prototype, prop);
        return proto;
      }, {});
    }, this);

    this.clock = sinon.useFakeTimers();

    this.board = new Galileo();
    done();
  },
  tearDown: function(done) {
    this.gpio.read.override = null;

    restore(this);
    Galileo.reset();

    for (var i = 0; i < 14; i++) {
      if (i < 6) {
        this.board.removeAllListeners("analog-read-A" + i);
      }
      if (i > 1) {
        this.board.removeAllListeners("digital-read-" + i);
      }
    }
    done();
  },
  correctMode: function(test) {
    test.expect(1);

    this.board.digitalRead(9, function() {});

    // DIGITAL input mode
    test.equal(this.board.pins[9].mode, 0);

    test.done();
  },

  digitalPin: function(test) {
    test.expect(1);

    var value = 1;

    this.gpio.read.override = value;

    var handler = function(data) {
      test.equal(data, value);
      test.done();
    };

    this.board.digitalRead(9, handler);
    this.clock.tick(10);
  },

  event: function(test) {
    test.expect(1);

    var value = 1;
    var event = "digital-read-9";

    this.gpio.read.override = value;

    this.board.once(event, function(data) {
      test.equal(data, value);
      test.done();
    });

    var handler = function(data) {};

    this.board.digitalRead(9, handler);
    this.clock.tick(10);
  }
};



exports["I2C"] = {
  setUp: function(done) {
    this.clock = sinon.useFakeTimers();

    this.gpt = sinon.stub(IO, "getPlatformType").returns(1);

    this.i2c = {
      write: sinon.spy(I2c.prototype, "write"),
      writeReg: sinon.spy(I2c.prototype, "writeReg"),
      address: sinon.spy(I2c.prototype, "address")
    };

    this.board = new Galileo();

    this.i2c.read = sinon.stub(I2c.prototype, "read").returns([0x0, 0x1]);
    done();
  },
  tearDown: function(done) {
    this.clock.restore();
    restore(this);
    done();
  },
  shape: function(test) {
    test.expect(3);

    test.equal(this.board.i2cWrite, this.board.sendI2CWriteRequest);
    test.equal(this.board.i2cReadOnce, this.board.sendI2CReadRequest);
    test.equal(this.board.i2cConfig, this.board.sendI2CConfig);

    test.done();
  },
  initAddressOnFirstWrite: function(test) {
    test.expect(3);

    this.board.i2cWrite(0x4, 0x1);

    // Once on initialization
    test.equal(this.gpt.callCount, 1);
    test.equal(this.i2c.address.callCount, 1);
    test.equal(this.i2c.write.callCount, 1);

    test.done();
  },

  initAddressOnFirstRead: function(test) {
    test.expect(5);

    this.temp = sinon.spy(this.board, "i2cWrite");

    this.board.i2cConfig(0);
    this.board.i2cReadOnce(0x4, 1, 2, function() {
      test.equal(this.temp.callCount, 1);
      test.equal(this.i2c.read.callCount, 1);
      test.done();
    }.bind(this));


    test.equal(this.i2c.address.callCount, 1);
    test.equal(this.i2c.write.callCount, 1);

    // Once on initialization
    test.equal(this.gpt.callCount, 1);


    this.clock.tick(1);
  },

  writeAndReg: function(test) {
    // test.expect(1);

    this.i2cConfig = sinon.spy(this.board, "i2cConfig");
    this.i2cWrite = sinon.spy(this.board, "i2cWrite");
    this.i2cWriteReg = sinon.spy(this.board, "i2cWriteReg");

    // Should invoke writeReg, does NOT invoke write
    this.board.i2cWrite(1, 2, 3);
    // API
    test.equal(this.i2cWriteReg.callCount, 1);
    // Internal
    test.equal(this.i2c.write.callCount, 0);
    test.equal(this.i2c.writeReg.callCount, 1);

    // Should NOT invoke writeReg, does invoke write
    this.board.i2cWrite(1, 2, [3]);
    // API
    test.equal(this.i2cWriteReg.callCount, 1);
    // Internal
    // 2 when using loop
    // test.equal(this.i2c.write.callCount, 2);
    test.equal(this.i2c.write.callCount, 1);
    test.equal(this.i2c.writeReg.callCount, 1);

    // Should NOT invoke writeReg
    this.board.i2cWrite(1, [2, 3]);
    // API
    test.equal(this.i2cWriteReg.callCount, 1);
    // Internal
    test.equal(this.i2c.write.callCount, 2);

    // 1 call to i2cConfig
    test.equal(this.i2cConfig.callCount, 1);

    test.done();
  },

  i2cRead: function(test) {
    test.expect(6);

    var handler = sinon.spy(function() {});

    this.board.i2cConfig(2);
    this.board.i2cRead(0x4, 1, 2, handler);
    this.clock.tick(10);

    test.equal(handler.callCount, 5);
    test.equal(handler.getCall(0).args[0].length, 2);
    test.equal(handler.getCall(1).args[0].length, 2);
    test.equal(handler.getCall(2).args[0].length, 2);
    test.equal(handler.getCall(3).args[0].length, 2);
    test.equal(handler.getCall(4).args[0].length, 2);

    test.done();
  },

  i2cReadOnce: function(test) {
    test.expect(2);

    var handler = sinon.spy(function() {});

    this.board.i2cConfig(2);
    this.board.i2cReadOnce(0x4, 1, 2, handler);
    this.clock.tick(2);

    test.equal(handler.callCount, 1);
    test.equal(handler.getCall(0).args[0].length, 2);

    test.done();
  },

};
