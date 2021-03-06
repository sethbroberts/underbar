(function() {
  'use strict';
  //a little comment at the top
  window._ = {};

  // Returns whatever value is passed as the argument. This function doesn't
  // seem very useful, but remember it--if a function needs to provide an
  // iterator when the user does not pass one in, this will be handy.
  _.identity = function(val) {
    return val;
  };

  /**
   * COLLECTIONS
   * ===========
   *
   * In this section, we'll have a look at functions that operate on collections
   * of values; in JavaScript, a 'collection' is something that can contain a
   * number of values--either an array or an object.
   *
   *
   * IMPORTANT NOTE!
   * ===========
   *
   * The .first function is implemented for you, to help guide you toward success
   * in your work on the following functions. Whenever you see a portion of the
   * assignment pre-completed, be sure to read and understanding it fully before
   * you proceed. Skipping this step will lead to considerably more difficulty
   * implementing the sections you are responsible for.
   */

  // Return an array of the first n elements of an array. If n is undefined,
  // return just the first element.
  _.first = function(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  // Like first, but for the last elements. If n is undefined, return just the
  // last element.
  _.last = function(array, n) {
    return n === undefined ? array[array.length-1] : array.slice(Math.max(array.length-n, 0));
    //below also passes tests, seems less efficient
    //return n === undefined ? array[array.length-1] : array.reverse().slice(0, n).reverse();
  };

  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.
  //
  // Note: _.each does not have a return value, but rather simply runs the
  // iterator function over each item in the input collection.
  _.each = function(collection, iterator) {
    if (Array.isArray(collection)) {
      for (var i=0; i<collection.length; i++) {
        iterator(collection[i], i, collection);
      } 
    }
    else {
      for (var j in collection) {
        iterator(collection[j], j, collection);
      }
    }
  };

  // Returns the index at which value can be found in the array, or -1 if value
  // is not present in the array.
  _.indexOf = function(array, target){
    // TIP: Here's an example of a function that needs to iterate, which we've
    // implemented for you. Instead of using a standard `for` loop, though,
    // it uses the iteration helper `each`, which you will need to write.
    var result = -1;                              // initialize some data structure or thing

    _.each(array, function(item, index) {         // update the thing
      if (item === target && result === -1) {     // if item in array === target and you haven't seen it before (result === -1)
        result = index;
      }
    });

    return result;                                // use the thing
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, test) {
    var result = [];

    _.each(collection, function(item, index, collection) {
      if (test(item)) {                                       // test(item) should return true or false
        result.push(item);
      }
    });

    return result;
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, test) {
    // TIP: see if you can re-use _.filter() here, without simply
    // copying code in and modifying it
    
    // _.filter(collection, test) is the array of items from collection that passed the test (PASSED)
    // we want to filter the original collection for those items that are NOT in PASSED (index < 0)

    return _.filter(collection, function (q) {
      return _.indexOf(_.filter(collection, test), q) < 0;
    });

    /*
    // this is equivalent to above compact version, but here probably easier to understand
    // once we have items that passed, use that to filter out items that don't pass (two filters applied sequentially)
    var array_of_items_that_passed = _.filter(collection, test);                   

    var filter_function_to_get_items_that_did_not_pass = function (item) {         // item is from collection; remember, filter works by
      return _.indexOf(array_of_items_that_passed, item) < 0;                      // passing one item at a time to test
    };                                                                             // return value must be true or false for filter func

    return _.filter(collection, filter_function_to_get_items_that_did_not_pass );  // just pass the function; gets called inside filter
    */
    
    // this works, too:
    /*
    var result = [];
    _.each(collection, function(item, index, collection) {
      if (!test(item)) {
        result.push(item);
      } 
    });
    return result;
    */

    
  };

  // Produce a duplicate-free version of the array.
  _.uniq = function(array) {

    // this works with arrays of numbers, not sure about arrays of other stuff
    // put the numbers in an object, key is number (stringified), value is number
    // only subtlety is you have to put in value to result array, not key
    // otherwise you would get ["1", "2"] instead of [1, 2] for the input [1, 2, 2, 1, 1]
    // worst case would be O(2N)?
    var cache = {};
    _.each(array, function (item, index) {
      cache[item] = item;
    });
    var result = []
    _.each(cache, function (item, key) {
      result.push(item);
    });
    return result;
  };


  // Return the results of applying an iterator to each element.
  _.map = function(collection, iterator) {
    // map() is a useful primitive iteration function that works a lot
    // like each(), but in addition to running the operation on all
    // the members, it also maintains an array of results.
    var results = []
    _.each(collection, function (item) {
      results.push(iterator(item));
    });
    return results;
  };

  /*
   * TIP: map is really handy when you want to transform an array of
   * values into a new array of values. _.pluck() is solved for you
   * as an example of this.
   */

  // Takes an array of objects and returns and array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  // so usage might be: "var ages = _.pluck(people, "age");"
  _.pluck = function(collection, key) {
    // TIP: map is really handy when you want to transform an array of
    // values into a new array of values. _.pluck() is solved for you
    // as an example of this.
    return _.map(collection, function(item){
      return item[key];
    });
  };

  // Reduces an array or object to a single value by repetitively calling
  // iterator(accumulator, item) for each item. accumulator should be
  // the return value of the previous iterator call.
  //  
  // You can pass in a starting value for the accumulator as the third argument
  // to reduce. If no starting value is passed, the first element is used as
  // the accumulator, and is never passed to the iterator. In other words, in
  // the case where a starting value is not passed, the iterator is not invoked
  // until the second element, with the first element as it's second argument.
  //  
  // Example:
  //   var numbers = [1,2,3];
  //   var sum = _.reduce(numbers, function(total, number){
  //     return total + number;
  //   }, 0); // should be 6
  //  
  //   var identity = _.reduce([5], function(total, number){
  //     return total + number * number;
  //   }); // should be 5, regardless of the iterator function passed in
  //          No accumulator is given so the first element is used.
  _.reduce = function(collection, iterator, accumulator) {

    var result = accumulator;
    // if accumulator is not equal to zero, not equal to false, and it is 'falsey', then set 
    // result to the first member of the collection
    if (accumulator !== 0 && accumulator !== false && !accumulator) {
      for (var thing in collection) break;
      result = collection[thing];

      // if taking this approach, remove the first item from the collection
      if (Array.isArray(collection)) {
        collection = collection.slice(1);
      } else {
        delete collection[thing];
      }
      
    }
    // console.log(result, collection, iterator.toString());
    _.each(collection, function(item) {
      // capture output of iterator as updated result value
      result = iterator(result, item);
    });

    return result;
  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    // TIP: Many iteration problems can be most easily expressed in
    // terms of reduce(). Here's a freebie to demonstrate!

    // example use:
    // _.contains([4, 5, 6], 2);

    return _.reduce(collection, function(wasFound, item) {
      if (wasFound) {
        return true;
      }
      return item === target;
    }, false);

  };


  // Determine whether all of the elements match a truth test.
  _.every = function(collection, iterator) {
    // TIP: Try re-using reduce() here.
    if (iterator === undefined) {       // account for case where iterator is not provided
      iterator = _.identity;
    }

    return _.reduce(collection, function (isTrue, item) {
      if (!isTrue) {
        return false;
      }
      return Boolean(iterator(item));   // use Boolean to type-cast result of iterator(item)
    }, true);

  };

  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = function(collection, iterator) {
    // TIP: There's a very clever way to re-use every() here.

    if (iterator === undefined) {       // account for case where iterator is not provided
      iterator = _.identity;
    }

    // if it is not true that none of the objects have the property, then some must have it
    // in other words, if not all the objects do not have the property, then some do
    var inverse = function (item) {
      return !iterator(item);
    };

    return !_.every(collection, inverse);

    // below works, too...
    // return (_.filter(collection, iterator).length > 0);

  };


  /**
   * OBJECTS
   * =======
   *
   * In this section, we'll look at a couple of helpers for merging objects.
   */

  // Extend a given object with all the properties of the passed in
  // object(s).
  //
  // Example:
  //   var obj1 = {key1: "something"};
  //   _.extend(obj1, {
  //     key2: "something new",
  //     key3: "something else new"
  //   }, {
  //     bla: "even more stuff"
  //   }); // obj1 now contains key1, key2, key3 and bla
  _.extend = function(obj) {
    // see http://stackoverflow.com/questions/9510094/how-to-get-a-slice-from-arguments
    // subobtimal for performance
    var orig = arguments[0], rest = Array.prototype.slice.call(arguments, 1);
    _.each(rest, function (other_obj, ix) {
      _.each(other_obj, function (item, key) {
        orig[key] = item;
      });
    });
    return obj;
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(obj) {
    var orig = arguments[0], rest = Array.prototype.slice.call(arguments, 1);
    _.each(rest, function (other_obj, ix) {
      _.each(other_obj, function (item, key) {
        if (!(key in orig)) {
          orig[key] = item;
        }
      });
    });
    return obj;    
  };


  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function
   * and return out a new version of the function that works somewhat differently
   */

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function(func) {
    // TIP: These variables are stored in a "closure scope" (worth researching),
    // so that they'll remain available to the newly-generated function every
    // time it's called.
    var alreadyCalled = false;
    var result;

    // TIP: We'll return a new function that delegates to the old one, but only
    // if it hasn't been called before.
    return function() {
      if (!alreadyCalled) {
        // TIP: .apply(this, arguments) is the standard way to pass on all of the
        // infromation from one function call to another.
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      return result;
    };
  };

  // Memorize an expensive function's results by storing them. You may assume
  // that the function takes only one argument and that it is a primitive.
  // memoize could be renamed to oncePerUniqueArgumentList; memoize does the
  // same thing as once, but based on many sets of unique arguments.
  //
  // _.memoize should return a function that, when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  _.memoize = function(func) {
    var cache = {};                 // keys=inputs to function, values=results
    return function () {
      var args = Array.prototype.slice.call(arguments);   // make array version of arguments
      if (!(args in cache)) {
        cache[args] = func.apply(this, arguments);        // if this is a new set of args, run the function, store results
      }
      return cache[args];                                 // return function value stored in cache
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function(func, wait) {

    // get the arguments
    var args = Array.prototype.slice.call(arguments, 2); 

    // http://stackoverflow.com/questions/24849/is-there-some-way-to-introduce-a-delay-in-javascript
    // see second answer
    // also see mistake #1 in http://www.toptal.com/javascript/10-most-common-javascript-mistakes
    setTimeout(function () {func.apply(this, args)}, wait);

  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // Randomizes the order of an array's contents.
  //
  // TIP: This function's test suite will ask that you not modify the original
  // input array. For a tip on how to make a copy of an array, see:
  // http://mdn.io/Array.prototype.slice
  _.shuffle = function(array) {

    // define a function that randomizes the order
    // there's a chance this will match original order, so want to be able
    // to call repeatedly until you get new order
    function getRandomOrder (array) {
      var result = [];
      var copyarr = array.slice(0);
      var ix, removed;
      while (copyarr.length > 0) {
        ix = Math.floor(Math.random()*copyarr.length);
        removed = copyarr.splice(ix, 1);
        result.push(removed[0]);
      }  
      console.log(result);
      return result;
    }

    // now call the above function until you get a new order distinct from input array
    // also want to insure that array.length > 1, otherwise will get stuck in endless loop
    do {
      var result = getRandomOrder(array);
    }
    while (result == array && array.length > 1);
    
    return result;

  };


  /**
   * EXTRA CREDIT
   * =================
   *
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */

  // Calls the method named by functionOrKey on each value in the list.
  // Note: You will need to learn a bit about .apply to complete this.
  _.invoke = function(collection, functionOrKey, args) {
  };

  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function(collection, iterator) {
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function(nestedArray, result) {
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function() {
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.  See the Underbar readme for extra details
  // on this function.
  //
  // Note: This is difficult! It may take a while to implement.
  _.throttle = function(func, wait) {
  };
}());
