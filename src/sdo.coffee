# Simple Data Objects
# v0.2.0

_slice= Array::slice
_toString= Object::toString

type= do ->
  elemParser= /\[object HTML(.*)\]/
  classToType= {}
  for name in "Boolean Number String Function Array Date RegExp Undefined Null NodeList".split(" ")
    classToType["[object " + name + "]"] = name.toLowerCase()
  (obj) ->
    strType = _toString.call(obj)
    if found= classToType[strType]
      found
    else if found= strType.match(elemParser)
      found[1].toLowerCase()
    else
      "object"

defaults= (obj)->
  for source in _slice.call(arguments, 1)
    if source
      for key,value of source
        unless obj[key]?
          obj[key]= value
  obj

extend= (obj)->
  for source in _slice.call(arguments, 1)
    if source
      for key,value of source
        obj[key]= value
  obj

clone= (obj)->
  extend {}, obj

makeArray= (args) ->
  _slice.call(args, 0)

# arrayWithoutArray= (source, target)->
#   item for item in source when item not in target

arrayWithout= (source, target)->
  item for item in source when item not target

isBlank= (value) ->
  return true unless value
  return false for key of value
  true

hasKey= (obj, key)-> `(key in obj)`

resultFor= (obj, key)->
  if hasKey obj, key
    prop= obj[key]
    prop?() or prop
  else
    undefined

uid= (radix=36)->
  now= (new Date).getTime()
  while now <= uid._lastTimestamp or 0
    now += 1
  uid._lastTimestamp= now
  now.toString radix


# Class: _Evented
# Used internally for tracking/firing onChange events
class _Evented
  constructor: (callback)->
    @_callbacks= []
    @onChange(callback) if callback?
  
  onChange: (callback, remove=false)->
    if remove
      @_callbacks= arrayWithout @_callbacks, callback
    else
      @_callbacks.push callback
    this
    
  _changed: (params...)=>
    callback(params...) for callback in @_callbacks
    this

# Class: Hash
# Name/Value Pair container
class Hash extends _Evented
  constructor: (atts, callback)->
    if type(atts) is 'function'
      callback= atts
      atts= {}
    atts or= {}
    super callback
    defaults= resultFor(this, 'defaults') or {}
    @atts= extend {}, atts, defaults
  
  setPair: (key, value, _silent)->
    if value isnt @atts[key]
      @atts[key]= value
      @_changed([key]) unless _silent
      yes
    else
      no

  set: (keyOrValues, value)->
    if type(keyOrValues) is 'string'
      @setPair keyOrValues, value
    else
      keys= []
      for own k,v of keyOrValues
        keys.push(k) if @setPair k, v, yes
      if keys.length > 0
        @_changed(keys)
        yes
      else
        no
      # extend @atts, key
      # @_changed _.keys(key)

  get: (key)->
    if arguments.length is 0
      @atts
    else
      @atts[key]

  toProps: ->
    # clone @atts
    @atts

# Class: List
# List container.
class List extends _Evented
  constructor: (callback)->
    super callback
    @_list=[]
    @_comparator= null

  create: (atts={})->
    if @ItemClass?
      model= new @ItemClass atts
      @add model
      model
    else
      throw new Error "To create items you must specify a ItemClass property."

  add: (model)->
    @_list.push model
    # @_list= _.sortBy(@_comparator) if @_comparator?
    model.onChange @_changed
    this
  
  remove: (model)->
    @_list= arrayWithout @_list, model
    model.onChange @_changed, true
    this

  get: (index) -> 
    if arguments.length is 0
      @_list
    else
     @_list[index]
  
  # sort: (comparator)->
  #   @_comparator= comparator
  #   @_list= _.sortBy(@_comparator) if @_comparator?
  #   this

  toProps: ->
    # data= []
    # data.push model.toProps() for model in @_list
    # data
    model.toProps() for model in @_list
  
# Class: Group
# Not a great name, basically a decorator for composing multipled, name, Hashes.
class Graph extends _Evented
  constructor: (models, callback)->
    super callback
    @_keys= []
    if models?
      @add(key, model) for own key,model of models

  add: (key, model)->
    model = new model() if type(model) is 'function'
    @[key]= model
    @_keys.push key
    # @_keys= _.uniq @_keys
    model.onChange(@_changed)
    this

  remove: (key)->
    model= @[key]
    if model?
      model.onChange @_changed, true
      delete @[key]
      @_keys= arrayWithout @_keys, key
      model
    else
      null

  set: (name, key, value)->
    @[name].set(key, value)
  
  get: (name, key)->
    @[name].get(key)

  toProps: ->
    data={}
    data[key]= @[key].toProps() for key in @_keys
    data

api= {
  uid
  type
  extend
  defaults  
  Hash
  List
  Graph
}

if module?
  module?.exports= api
else
  @SDO= api