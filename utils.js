"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirectoriesRecursive = exports.flatten = exports.getDirectories = exports.parseArgs = void 0;
var fs = require("fs");
var path = require("path");
function parseArgs(args) {
    var parsedArgs = {};
    args.forEach(function (arg) {
        var parts = arg.split("=");
        parsedArgs[parts[0]] = parts[1];
    });
    return parsedArgs;
}
exports.parseArgs = parseArgs;
function getDirectories(srcpath) {
    try {
        // neu la file json
        if (fs.statSync(srcpath).isFile()) {
            return [srcpath];
        }
        return fs
            .readdirSync(srcpath)
            .map(function (file) { return path.join(srcpath, file); });
    }
    catch (error) {
        console.log('getDirectories error', error);
    }
}
exports.getDirectories = getDirectories;
function flatten(lists) {
    return lists.reduce(function (a, b) { return a.concat(b); }, []);
}
exports.flatten = flatten;
function getDirectoriesRecursive(srcpath) {
    return __spreadArray([
        srcpath
    ], flatten(getDirectories(srcpath).map(getDirectoriesRecursive)), true);
}
exports.getDirectoriesRecursive = getDirectoriesRecursive;
//# sourceMappingURL=utils.js.map