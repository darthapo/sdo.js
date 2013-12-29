
class List extends OnChange
  constructor: (source, callback)->
    return new List(source, callback) if this is _global
    @_list= []
    @length= 0
    @addAll(source) if source
    @onChange(callback) if callback

  add: (value, _silent)->
    # unless value in _list
    @_list.push value
    value?.onChange?(@_notifyChange)
    @length= @_list.length
    @_notifyChange('add') unless _silent
    this

  addAll: (values, _silent)->
    for value in values
      @add value, _silent
    this
  
  remove: (value, _silent)->
    @_list= (val for val in @_list when val isnt value)
    value?.onChange? @_notifyChange, true
    @length= @_list.length
    @_notifyChange('remove') unless _silent
    this

  get: (index) -> 
    if arguments.length is 0
      (val?.get?() or val for val in @_list)
    else
     @_list[index]

  items: -> 
    @_list

  clear: (_silent)->
    for value in @_list
      @remove(value, true)
    @_notifyChange('clear') unless _silent
    this

expose {
  List
}

