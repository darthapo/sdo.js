// Generated by CoffeeScript 1.6.3
(function() {
  var Hash, List, setObject, setPair,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  setPair = function(atts, key, value, _silent, _changed) {
    var oldValue;
    if (value !== atts[key]) {
      oldValue = atts[key];
      if (oldValue != null) {
        if (typeof oldValue.onChange === "function") {
          oldValue.onChange(_changed, false);
        }
      }
      atts[key] = value;
      if (!_silent) {
        _changed([key]);
      }
      if (value != null) {
        if (typeof value.onChange === "function") {
          value.onChange(_changed);
        }
      }
      return true;
    } else {
      return false;
    }
  };

  setObject = function(atts, hash, _silent, _changed) {
    var key, keys, value;
    keys = [];
    for (key in hash) {
      if (!__hasProp.call(hash, key)) continue;
      value = hash[key];
      if (setPair(atts, key, value, true, _changed)) {
        keys.push(key);
      }
    }
    if (keys.length > 0) {
      if (!_silent) {
        _changed(keys);
      }
      return true;
    } else {
      return false;
    }
  };

  Hash = function(source, callback) {
    var hash, _atts, _changed, _listeners;
    _atts = {};
    _listeners = null;
    _changed = function(keys) {
      var _i, _len, _results;
      if (!(_listeners && _listeners.length > 0)) {
        return null;
      }
      _results = [];
      for (_i = 0, _len = _listeners.length; _i < _len; _i++) {
        callback = _listeners[_i];
        _results.push(callback(keys, hash));
      }
      return _results;
    };
    hash = {
      set: function(key, value, _silent) {
        if (arguments.length === 2) {
          return setPair(_atts, key, value, _silent, _changed);
        } else {
          return setObject(_atts, key, _silent, _changed);
        }
      },
      get: function(key) {
        var atts, value;
        if (arguments.length === 1) {
          return _atts[key];
        } else {
          atts = {};
          for (key in _atts) {
            value = _atts[key];
            atts[key] = (value != null ? typeof value.get === "function" ? value.get() : void 0 : void 0) || value;
          }
          return atts;
        }
      },
      onChange: function(fn, remove) {
        var cb;
        if (_listeners == null) {
          _listeners = [];
        }
        if (remove) {
          return _listeners = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = _listeners.length; _i < _len; _i++) {
              cb = _listeners[_i];
              if (cb !== fn) {
                _results.push(cb);
              }
            }
            return _results;
          })();
        } else {
          if (__indexOf.call(_listeners, fn) < 0) {
            return _listeners.push(fn);
          }
        }
      }
    };
    if (callback) {
      hash.onChange(callback);
    }
    hash.onChange.clear = function() {
      return _listeners = [];
    };
    if (source) {
      hash.set(source);
    }
    return hash;
  };

  (function(root) {
    return root.Hash = Hash;
  })((typeof module !== "undefined" && module !== null ? module.exports : void 0) || this);

  List = function(source, callback) {
    var item, list, _changed, _i, _len, _list, _listeners;
    _list = [];
    _listeners = null;
    _changed = function(action) {
      var _i, _len, _results;
      if (!(_listeners && _listeners.length > 0)) {
        return null;
      }
      _results = [];
      for (_i = 0, _len = _listeners.length; _i < _len; _i++) {
        callback = _listeners[_i];
        _results.push(callback(action, list));
      }
      return _results;
    };
    list = {
      length: 0,
      add: function(value, _silent) {
        _list.push(value);
        if (value != null) {
          if (typeof value.onChange === "function") {
            value.onChange(_changed);
          }
        }
        this.length = _list.length;
        if (!_silent) {
          _changed('add');
        }
        return this;
      },
      addAll: function(values, _silent) {
        var value, _i, _len;
        for (_i = 0, _len = values.length; _i < _len; _i++) {
          value = values[_i];
          this.add(value, _silent);
        }
        return this;
      },
      remove: function(value, _silent) {
        var val;
        _list = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = _list.length; _i < _len; _i++) {
            val = _list[_i];
            if (val !== value) {
              _results.push(val);
            }
          }
          return _results;
        })();
        if (value != null) {
          if (typeof value.onChange === "function") {
            value.onChange(_changed, true);
          }
        }
        this.length = _list.length;
        if (!_silent) {
          _changed('remove');
        }
        return this;
      },
      get: function(index) {
        var val, _i, _len, _results;
        if (arguments.length === 0) {
          _results = [];
          for (_i = 0, _len = _list.length; _i < _len; _i++) {
            val = _list[_i];
            _results.push((val != null ? typeof val.get === "function" ? val.get() : void 0 : void 0) || val);
          }
          return _results;
        } else {
          return _list[index];
        }
      },
      items: function() {
        return _list;
      },
      clear: function(_silent) {
        var value, _i, _len;
        for (_i = 0, _len = _list.length; _i < _len; _i++) {
          value = _list[_i];
          this.remove(value, true);
        }
        if (!_silent) {
          _changed('clear', this);
        }
        return this;
      },
      onChange: function(fn, remove) {
        var cb;
        if (_listeners == null) {
          _listeners = [];
        }
        if (remove) {
          return _listeners = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = _listeners.length; _i < _len; _i++) {
              cb = _listeners[_i];
              if (cb !== fn) {
                _results.push(cb);
              }
            }
            return _results;
          })();
        } else {
          if (__indexOf.call(_listeners, fn) < 0) {
            return _listeners.push(fn);
          }
        }
      }
    };
    if (callback) {
      list.onChange(callback);
    }
    list.onChange.clear = function() {
      return _listeners = [];
    };
    if (source) {
      for (_i = 0, _len = source.length; _i < _len; _i++) {
        item = source[_i];
        list.add(item);
      }
    }
    return list;
  };

  (function(root) {
    return root.List = List;
  })((typeof module !== "undefined" && module !== null ? module.exports : void 0) || this);

}).call(this);
