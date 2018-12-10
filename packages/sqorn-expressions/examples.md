# e(9)

op         accumulate      action         queue
_          _               consumeN       [9]
-          9               done           []

# e(9)(7)

op         accumulate      action         queue
_          _               consumeN       [9, 7]
-          (9, 7)          done           [    ]

# e.add(9)(7)

op         accumulate      action         queue
_          _               consumeN       [add, 9, 7]
add        _               consume2       [     9, 7]
_          add(9, 7)       done           [         ]

# e.add(9)

op         accumulate      action         queue
_          _               consumeN       [add, 9]
add        _               consume2       [     9]
_          add(9, _)       error          [      ]

# e.neq(true).not

op         accumulate      action         queue
_          _               consumeN       [neq, true, not]
neq        _               consume2       [     true, not]
_          neq(t, _)       error          [         , not]

# e.add

op         accumulate      action         queue
_          _               consumeN       [add]
add        _               consume2       [   ]
_          add(_, _)       error          [   ]

# e.add(9)(7)(4)

op         accumulate      action         queue
_          _               consumeN       [add, 9, 7, 4]
add        _               consume2       [     9, 7, 4]
_          add(9, 7)       consumeE       [           4]
_          add(9, 7)       error          [           4]

# e.null

op         accumulate      action         queue
_          _               consumeN       [null]
null       _               consume0       []
_          null            done           []

# e.add(9)(7).add(4)

op         accumulate        action         queue
_          _                 consumeN       [add, 9, 7, add, 4]
add        _                 consume2       [     9, 7, add, 4]
_          add(9, 7)         consumeE       [           add, 4]
add        add(9, 7)         consume2       [                4]
_          add(add(9, 7), 4) done           [                 ]

# e(true).and(false, true)

op         accumulate        action         queue
_          _                 consumeN       [true, and, false, true]
true       _                 consume2       [true, and, false, true]
_          add(9, 7)         consumeE       [true, and, false, true]
add        add(9, 7)         consume2       [true, and, false, true]
_          add(add(9, 7), 4) done           [true, and, false, true]



Terminate when:
* queue is empty:
  * no op -> valid
  * op    -> error
* required arg but received expression
* required exp but received arg

* expression pulls N args but less than N available
* 

# e.add(9)(7).subtract(5).add(6)


queue                   op         accumulate      action
[add, 9, 7, 5, 6]       _          _               consume
[     9, 7, 5, 6]       add[2]     _               consume2
[         , 5, 6]       __         add[9, 7]     

# e.add(9)

# e.add(9).add(9)



# e.add(1)(2)

[_, add] -> pull next 2 args

# e(1)

[_, 1] -> accumulate ->

# e(1).add(2)

[_, 1] -> accumul
