export function translateUndefinedToString(str: string | undefined) {
    if (str === undefined) {
        return '';
    }
    return str;
}
