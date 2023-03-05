import * as fs from "fs";
import * as path from "path";

export function parseArgs<T = {}>(args) {
    const parsedArgs = {} as T;

    args.forEach((arg) => {
        const parts = arg.split("=");

        parsedArgs[parts[0]] = parts[1];
    });

    return parsedArgs;
}

export function getDirectories(srcpath) {
    try {
        // neu la file json
        if (fs.statSync(srcpath).isFile()) {
            return [srcpath];
        }

        return fs
            .readdirSync(srcpath)
            .map((file) => path.join(srcpath, file))
    } catch (error) {
        console.log('getDirectories error', error);
    }
}

export function flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);
}

export function getDirectoriesRecursive(srcpath: string) {
    return [
        srcpath,
        ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive)),
    ];
}
