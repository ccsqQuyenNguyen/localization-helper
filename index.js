#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonToExcel = void 0;
var fs = require("fs");
var path = require("path");
var xlsx = require("xlsx");
var utils_1 = require("./utils");
var commander_1 = require("commander");
function convertObjectToArray(obj, parentKey) {
    if (parentKey === void 0) { parentKey = ''; }
    var result = [];
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        var currentKey = parentKey ? "".concat(parentKey, ":").concat(key) : key;
        if (typeof value === 'object' && value !== null) {
            result.push.apply(result, convertObjectToArray(value, currentKey));
        }
        else {
            result.push([currentKey, value]);
        }
    }
    return result;
}
function convertArrayToObject(arr) {
    var result = {};
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var _a = arr_1[_i], keys = _a[0], value = _a[1];
        var keysArray = keys.split(':');
        var currentObj = result;
        for (var i = 0; i < keysArray.length - 1; i++) {
            var key = keysArray[i];
            currentObj[key] = currentObj[key] || {};
            currentObj = currentObj[key];
        }
        currentObj[keysArray[keysArray.length - 1]] = value;
    }
    return result;
}
function mergeArrays(arr1, arr2) {
    var obj = {};
    for (var _i = 0, _a = arr1.concat(arr2); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (!obj[key]) {
            obj[key] = [key];
        }
        obj[key].push(value);
    }
    return Object.values(obj);
}
function handleJsonFile(filePath) {
    if (!filePath)
        return [];
    try {
        var jsonData = fs.readFileSync(filePath, { encoding: "utf8" });
        var fileData = JSON.parse(jsonData);
        var newOjbectArray = convertObjectToArray(fileData);
        return newOjbectArray;
    }
    catch (error) {
        return [];
    }
}
var excelFile = "./result.xlsx";
function jsonToExcel(dir) {
    var listFileDir = (0, utils_1.getDirectories)(dir);
    console.log('listFileDir', listFileDir);
    if (listFileDir.length) {
        var keyWords_1 = [];
        listFileDir.forEach(function (filePath) {
            var fileType = path.parse(filePath).ext;
            var _fileType = fileType.toLowerCase();
            if (_fileType === '.json') {
                keyWords_1.push(path.parse(filePath).name);
            }
        });
        keyWords_1.unshift('key');
        var result = listFileDir.reduce(function (pV, cV) {
            var data = handleJsonFile(cV);
            return mergeArrays(pV, data);
        }, []);
        result.unshift(keyWords_1);
        var workbook = xlsx.utils.book_new();
        var worksheet = xlsx.utils.aoa_to_sheet(result);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'result');
        xlsx.writeFile(workbook, excelFile);
    }
    console.log('ALL DONE!!!!!!');
}
exports.jsonToExcel = jsonToExcel;
var program = new commander_1.Command();
program
    .command('convert <path>')
    .description("convert")
    .action(function (path, cmd) {
    jsonToExcel(path);
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map