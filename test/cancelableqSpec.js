describe('cancelableq', function() {
	var log;
	beforeEach(function() {
		log = [];
		module('mock-q');
		module('cancelable-q');
	});

	function sliceArgs(args, startIndex) {
		return [].slice.call(args, startIndex || 0);
	}
	function success(name) {
		return function() {
			name = 'success' + (name || '');
			var args = angular.toJson(sliceArgs(arguments)).replace(/(^\[|"|\]$)/g, '');
			log.push(name + '(' +  args + ')');
		};
	}
	function error(name) {
		return function() {
			name = 'error' + (name || '');
			var args = angular.toJson(sliceArgs(arguments)).replace(/(^\[|"|\]$)/g, '');
			log.push(name + '(' +  args + ')');
		};
	}
	function logStr() {
		return log.join('; ');
	}

	it('should have a cancel method', inject(function($q, cancelableQ) {
		// arrange
		var original = $q.defer();

		// act
		var actual = cancelableQ.wrap(original.promise);

		// assert
		expect(actual).toBeDefined();
		expect(actual.cancel).toBeDefined();
		expect(angular.isFunction(actual.cancel)).toBe(true);
	}));

	it('should resolve if original is resolved', inject(function($q, cancelableQ) {
		// arrange
		var original = $q.defer();

		// act
		var actual = cancelableQ.wrap(original.promise);
		actual.then(success(), error());
		expect(logStr()).toBe('');

		// assert
		original.resolve('resolved');
		$q.mockNextTick.flush();
		expect(logStr()).toBe('success(resolved)');
	}));

	it('should reject if original is rejected', inject(function($q, cancelableQ) {
		// arrange
		var original = $q.defer();

		// act
		var actual = cancelableQ.wrap(original.promise);
		actual.then(success(), error());
		expect(logStr()).toBe('');

		// assert
		original.reject('rejected');
		$q.mockNextTick.flush();
		expect(logStr()).toBe('error(rejected)');
	}));

	it('should cancel if canceled with default reason', inject(function($q, cancelableQ) {
		// arrange
		var original = $q.defer();

		// act
		var actual = cancelableQ.wrap(original.promise);
		actual.then(success(), error());
		expect(logStr()).toBe('');

		// assert
		actual.cancel();
		$q.mockNextTick.flush();
		expect(logStr()).toBe('error(canceled)');
	}));

	it('should cancel if canceled with specified reason', inject(function($q, cancelableQ) {
		// arrange
		var original = $q.defer();

		// act
		var actual = cancelableQ.wrap(original.promise);
		actual.then(success(), error());
		expect(logStr()).toBe('');

		// assert
		actual.cancel('my reason');
		$q.mockNextTick.flush();
		expect(logStr()).toBe('error(my reason)');
	}));

	it('should not wrap promises which already have a cancel method', inject(function($q, cancelableQ) {
		// arrange
		var original = $q.defer();
		original.promise.cancel = function() {
		};

		// act
		var actual = cancelableQ.wrap(original.promise);

		// assert
		expect(actual).toBe(original.promise);
	}));
});