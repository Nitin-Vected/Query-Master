# Installation
> `npm install --save @types/randomstring`

# Summary
This package contains type definitions for randomstring (https://github.com/klughammer/node-randomstring).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/randomstring.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/randomstring/index.d.ts)
````ts
declare namespace Randomstring {
    type Charset =
        | "alphanumeric"
        | "alphabetic"
        | "numeric"
        | "hex"
        | "binary"
        | "octal"
        | string & {};
    type Capitalization = "lowercase" | "uppercase";
    interface GenerateOptions {
        length?: number | undefined;
        readable?: boolean | undefined;
        charset?: Charset | Charset[] | undefined;
        capitalization?: Capitalization | undefined;
    }

    function generate(options?: GenerateOptions | number): string;
}

declare module "randomstring" {
    export = Randomstring;
}

````

### Additional Details
 * Last updated: Thu, 04 Apr 2024 18:08:09 GMT
 * Dependencies: none

# Credits
These definitions were written by [Isman Usoh](https://github.com/isman-usoh).
