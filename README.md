# Angular Cancelable $q [![Build Status](https://travis-ci.org/trilobyte/angular-cancelable-q.png?branch=master)](https://travis-ci.org/trilobyte/angular-cancelable-q)

Provides a cancel method on promises created by the Angular $q service. It essentially adds a `cancel` method on the promise interface when asked to wrap a promise. You can use this library to cancel remote requests (well, no truely since the requests themselves are not canceled).

Please note that this library is only useful as long as [angular/angular.js#2452](https://github.com/angular/angular.js/pull/2452) has not made it into the version of Angular you are using.

## Usage

```js
// Create a Deferred object which represents a task which will finish in the future.
var uncancelableDeferred = $q.defer();

// wrap the promise in a cancelable promise
var cancelable = cancelableQ.wrap(uncancelableDeferred.promise);

// add success and error callbacks
cancelable
	.then(function(result) {
		console.log('resolved with: ', result);
	}, function(reason) {
		console.log('rejected with reason: ', reason);
	})

// any of the following lines:
uncancelableDeferred.resolve('hello, world'); // prints 'resolved with: hello, world'
uncancelableDeferred.reject('goodbye, world'); // prints 'rejected with reason: goodbye, world'
cancelable.cancel(); // prints 'resolved with: canceled'
cancelable.cancel('nothing to show here'); // prints 'rejected with reason: nothing to show here'
```

## API
The `cancelable-q` provides a single service called `cancelableQ`. The service has the following public api.

### wrap(promise)

Wraps the given promise into a cancelable promise.

### promise.cancel(reason)

Wrapped promises will have a `cancel(reason)` method added to them which cancels given promise with an optional reason. The promise will be rejected using the specified reason.

If no reason is specified `canceled` will be given as rejection reason.

## Copyright

Copyright © 2013 Bert Willems and contributors

## License

This project is licensed under [MIT](http://www.opensource.org/licenses/mit-license.php "Read more about the MIT license form"). Refer to license.txt for more information.
