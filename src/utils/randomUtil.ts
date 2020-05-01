export function InRange(low: number, high: number): number {
    return Math.round((Math.random() * (high - low)) + low);
}

export function PickRandom<T>(input: T[]) {
    return input[InRange(0, input.length - 1)];
}

export function ConstrainRange(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function ParseConstrainRange(value: string, min: number, max: number): number {
    return ConstrainRange(parseFloat(value), min, max);
}