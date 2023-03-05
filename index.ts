#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as xlsx from "xlsx";
import { getDirectories, parseArgs } from "./utils";
import { Command } from "commander"

function convertObjectToArray(obj, parentKey = '') {
    const result = [];
    for (const [key, value] of Object.entries(obj)) {
        const currentKey = parentKey ? `${parentKey}:${key}` : key;
        if (typeof value === 'object' && value !== null) {
            result.push(...convertObjectToArray(value, currentKey));
        } else {
            result.push([currentKey, value]);
        }
    }
    return result;
}

function convertArrayToObject(arr) {
    const result = {};
    for (const [keys, value] of arr) {
        const keysArray = keys.split(':');
        let currentObj = result;
        for (let i = 0; i < keysArray.length - 1; i++) {
            const key = keysArray[i];
            currentObj[key] = currentObj[key] || {};
            currentObj = currentObj[key];
        }
        currentObj[keysArray[keysArray.length - 1]] = value;
    }
    return result;
}

function mergeArrays(arr1, arr2) {
    const obj = {};

    for (const [key, value] of arr1.concat(arr2)) {
        if (!obj[key]) {
            obj[key] = [key];
        }
        obj[key].push(value);
    }

    return Object.values(obj);
}

function handleJsonFile(filePath: string) {
    if (!filePath) return [];
    try {
        const jsonData = fs.readFileSync(filePath, { encoding: "utf8" });
        const fileData = JSON.parse(jsonData);
        const newOjbectArray = convertObjectToArray(fileData);
        return newOjbectArray;
    } catch (error) {
        return [];
    }
}

const excelFile = "./result.xlsx";

export function jsonToExcel(dir) {

    const listFileDir = getDirectories(dir);

    if (listFileDir.length) {
        const keyWords = [];
        listFileDir.forEach(filePath => {
            const fileType = path.parse(filePath).ext;
            const _fileType = fileType.toLowerCase();
            if (_fileType === '.json') {
                keyWords.push(path.parse(filePath).name);
            }
        });
        keyWords.unshift('key');

        const result = listFileDir.reduce(function (pV, cV) {
            const data = handleJsonFile(cV);
            return mergeArrays(pV, data);
        }, [])
        result.unshift(keyWords);

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.aoa_to_sheet(result);

        xlsx.utils.book_append_sheet(workbook, worksheet, 'result');

        xlsx.writeFile(workbook, excelFile);
    }
    console.log('ALL DONE!!!!!!');
}
const program = new Command();

program
    .command('convert <path>')
    .description("convert")
    .action((path, cmd) => {
        jsonToExcel(path);
    });

program.parse(process.argv);