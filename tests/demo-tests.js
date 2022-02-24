const assert = require('assert');

describe('Demo basic tests', () => {

    it('should pass when 1 equals 1', () => {
        assert.equal(1, 1);
    });

    it('should pass when 1 is not equal to 2', () => {
        assert.notEqual(1, 2);
    });

});
