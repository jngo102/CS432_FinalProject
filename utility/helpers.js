/// A set of helper methods
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
}