// Generated by CoffeeScript 1.6.3
(function() {
  var Hash, List, OnChange, Store, expose, type, uid, _global, _slice, _toString,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _global = this;

  _slice = Array.prototype.slice;

  _toString = Object.prototype.toString;

  type = (function() {
    var classToType, elemParser, name, _i, _len, _ref;
    elemParser = /\[object HTML(.*)\]/;
    classToType = {};
    _ref = "Array Boolean Date Function NodeList Null Number RegExp String Undefined ".split(" ");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      classToType["[object " + name + "]"] = name.toLowerCase();
    }
    return function(obj) {
      var found, strType;
      strType = _toString.call(obj);
      if (found = classToType[strType]) {
        return found;
      } else if (found = strType.match(elemParser)) {
        return found[1].toLowerCase();
      } else {
        return "object";
      }
    };
  })();

  uid = (function() {
    var last, radix;
    last = 0;
    radix = 36;
    return function() {
      var now;
      now = (new Date).getTime();
      while (now <= last) {
        now += 1;
      }
      last = now;
      return now.toString(radix);
    };
  })();

  expose = (function() {
    var _root;
    _root = (typeof module !== "undefined" && module !== null ? module.exports : void 0) || _global;
    return function(ctx) {
      var key, value, _results;
      _results = [];
      for (key in ctx) {
        if (!__hasProp.call(ctx, key)) continue;
        value = ctx[key];
        if (__indexOf.call(_root, key) >= 0) {
          throw new Error("" + key + " already exists!");
        }
        _results.push(_root[key] = value);
      }
      return _results;
    };
  })();

  OnChange = (function() {
    function OnChange() {
      this._notifyChange = __bind(this._notifyChange, this);
    }

    OnChange.prototype.onChange = function(fn, remove) {
      var cb;
      if (this._listeners == null) {
        this._listeners = [];
      }
      if (remove) {
        if (fn != null) {
          return this._listeners = (function() {
            var _i, _len, _ref, _results;
            _ref = this._listeners;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              cb = _ref[_i];
              if (cb !== fn) {
                _results.push(cb);
              }
            }
            return _results;
          }).call(this);
        } else {
          return this._listeners = [];
        }
      } else {
        if (__indexOf.call(this._listeners, fn) < 0) {
          return this._listeners.push(fn);
        }
      }
    };

    OnChange.prototype._notifyChange = function(data) {
      var callback, _i, _len, _ref, _results;
      if (!(this._listeners && this._listeners.length > 0)) {
        return null;
      }
      _ref = this._listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        _results.push(callback(data, this));
      }
      return _results;
    };

    return OnChange;

  })();

  expose({
    uid: uid,
    type: type
  });

  Hash = (function(_super) {
    __extends(Hash, _super);

    function Hash(source, callback) {
      if (this === _global) {
        return new Hash(source, callback);
      }
      Hash.__super__.constructor.apply(this, arguments);
      this._atts = {};
      if (source) {
        this.set(source);
      }
      if (callback) {
        this.onChange(callback);
      }
    }

    Hash.prototype.set = function(key, value, _silent) {
      if (arguments.length === 2) {
        return this._setPair(key, value, _silent);
      } else {
        return this._setObject(key, _silent);
      }
    };

    Hash.prototype.replace = function(key, value, _silent) {
      this.remove(key, _silent, true);
      return this.set(key, value, _silent);
    };

    Hash.prototype.get = function(key) {
      var atts, value, _ref;
      if (arguments.length === 1) {
        return this._atts[key];
      } else {
        atts = {};
        _ref = this._atts;
        for (key in _ref) {
          value = _ref[key];
          atts[key] = (value != null ? typeof value.get === "function" ? value.get() : void 0 : void 0) || value;
        }
        return atts;
      }
    };

    Hash.prototype.remove = function(key, _silent, _skipDelete) {
      var value;
      value = this.get(key);
      if (value !== void 0) {
        if (value != null) {
          if (typeof value.onChange === "function") {
            value.onChange(this._notifyChange, false);
          }
        }
        if (!_skipDelete) {
          delete this._atts[key];
        }
        if (!_silent) {
          this._notifyChange([key]);
        }
      }
      return value;
    };

    Hash.prototype._setPair = function(key, value, _silent) {
      if (value !== this._atts[key]) {
        this.remove(key, true, true);
        this._atts[key] = value;
        if (!_silent) {
          this._notifyChange([key]);
        }
        if (value != null) {
          if (typeof value.onChange === "function") {
            value.onChange(this._notifyChange);
          }
        }
        return true;
      } else {
        return false;
      }
    };

    Hash.prototype._setObject = function(hash, _silent) {
      var key, keys, value;
      keys = [];
      for (key in hash) {
        if (!__hasProp.call(hash, key)) continue;
        value = hash[key];
        if (this._setPair(key, value, true)) {
          keys.push(key);
        }
      }
      if (keys.length > 0) {
        if (!_silent) {
          this._notifyChange(keys);
        }
        return true;
      } else {
        return false;
      }
    };

    return Hash;

  })(OnChange);

  expose({
    Hash: Hash
  });

  List = (function(_super) {
    __extends(List, _super);

    function List(source, callback) {
      if (this === _global) {
        return new List(source, callback);
      }
      this._list = [];
      this.length = 0;
      if (source) {
        this.addAll(source);
      }
      if (callback) {
        this.onChange(callback);
      }
    }

    List.prototype.add = function(value, _silent) {
      this._list.push(value);
      if (value != null) {
        if (typeof value.onChange === "function") {
          value.onChange(this._notifyChange);
        }
      }
      this.length = this._list.length;
      if (!_silent) {
        this._notifyChange('add');
      }
      return this;
    };

    List.prototype.addAll = function(values, _silent) {
      var value, _i, _len;
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        value = values[_i];
        this.add(value, _silent);
      }
      return this;
    };

    List.prototype.remove = function(value, _silent) {
      var val;
      this._list = (function() {
        var _i, _len, _ref, _results;
        _ref = this._list;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          val = _ref[_i];
          if (val !== value) {
            _results.push(val);
          }
        }
        return _results;
      }).call(this);
      if (value != null) {
        if (typeof value.onChange === "function") {
          value.onChange(this._notifyChange, true);
        }
      }
      this.length = this._list.length;
      if (!_silent) {
        this._notifyChange('remove');
      }
      return this;
    };

    List.prototype.get = function(index) {
      var val, _i, _len, _ref, _results;
      if (arguments.length === 0) {
        _ref = this._list;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          val = _ref[_i];
          _results.push((val != null ? typeof val.get === "function" ? val.get() : void 0 : void 0) || val);
        }
        return _results;
      } else {
        return this._list[index];
      }
    };

    List.prototype.items = function() {
      return this._list;
    };

    List.prototype.clear = function(_silent) {
      var value, _i, _len, _ref;
      _ref = this._list;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        value = _ref[_i];
        this.remove(value, true);
      }
      if (!_silent) {
        this._notifyChange('clear');
      }
      return this;
    };

    return List;

  })(OnChange);

  expose({
    List: List
  });

  Store = (function() {
    var stores;

    stores = {};

    function Store(storageKey, backend) {
      this.storageKey = storageKey;
      this.backend = backend != null ? backend : window['localStorage'];
      this.load = __bind(this.load, this);
      this.save = __bind(this.save, this);
      if (stores[this.storageKey] !== void 0) {
        return stores[this.storageKey];
      }
      if (this === _global) {
        return new Store(this.storageKey, this.backend);
      }
      if (this.storageKey == null) {
        throw new Error("Can't persist with a storage key.");
      }
      if (this.backend == null) {
        throw new Error("Can't persist on this platform.");
      }
      return stores[this.storageKey] = this;
    }

    Store.prototype.save = function(action, container) {
      var data;
      data = container.get();
      return this.backend.setItem(this.storageKey, JSON.stringify(data));
    };

    Store.prototype.load = function(defaultData) {
      var data, raw;
      if (defaultData == null) {
        defaultData = {};
      }
      raw = this.backend.getItem(this.storageKey);
      if (raw != null) {
        data = JSON.parse(raw);
        return this.parse(data);
      } else {
        return this.parse(defaultData);
      }
    };

    Store.prototype.parse = function(data) {
      var hash, item, key, list, value, _i, _len;
      if (type(data) === 'array') {
        list = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          item = data[_i];
          list.push(this.parse(item));
        }
        return List(list);
      } else if (type(data) === 'object') {
        hash = {};
        for (key in data) {
          if (!__hasProp.call(data, key)) continue;
          value = data[key];
          hash[key] = this.parse(value);
        }
        return Hash(hash);
      } else {
        return data;
      }
    };

    return Store;

  })();

  expose({
    Store: Store
  });

}).call(this);
