(function() {
	'use strict';

	/**
	 * This modules adds a cancel option to promises created by the {@link ng.$q} service.
	 */
	angular.module('cancelable-q', [])
		/**
		 * @ngdoc service
		 * @name cancelableQ
		 *
		 * @description
		 * Adds a cancel method to promises created by the Angular's ng.$q service.
		 *
		 * # The Service API
		 * 
		 * **Methods**
		 * - `wrap(original)` - Wraps a promise in a cancelable {@link ng.$q promise}.
		 *
		 * # The Promise API
		 *
		 * Adds a single method on top of the existing {@link ng.$q promise} methods.
		 *
		 * **Methods**
		 * - 'cancel(reason)' - Cancels the given promise. This will reject the promise with the given reason or 'canceled' if no reason is given.
		 */
		.factory('cancelableQ', ['$q', function($q) {
			return {
				/**
				 * Wraps the given promise into a cancelable promise.
				 * @param  {Promise}           original The promise which to wrap.
				 * @return {CancelablePromise}          Returns the wrapped {CancelablePromise}.
				 */
				'wrap': function(original) {
					// if the original promise already contains a cancel method, do not override it
					if (angular.isFunction(original.cancel)) return original;

					// create a cancel deferred, a combined promise of original an cancelled and a wrapped defered which hides the combined api
					var cancelDeferred = $q.defer(),
						combined = $q.all([original, cancelDeferred.promise]),
						wrapped = $q.defer();

					// resolve the cancelDeferred if the original promise is resolved
					original
						.then(function(result) {
							cancelDeferred.resolve();
						});

					// hide the $q.all behavior for the consumer
					combined
						.then(function(results) {
							// resolve the wrapped promise using the result of the original promise
							wrapped.resolve(results[0]);
						}, function(reason) {
							// reject the wrappep promise using the given reason
							wrapped.reject(reason);
						});

					// add the cancel function
					wrapped.promise.cancel = function(reason) {
						reason = reason || 'canceled';
						cancelDeferred.reject(reason);
					};

					// return the wrapped promise
					return wrapped.promise;
				}
			};
		}]);
}());