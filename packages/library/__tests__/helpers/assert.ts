/**
 * Assertions node:assert doesn't have. assertMatchObject checks that an
 * object has at least the expected properties, recursively, while arrays must
 * match in length and element by element; assert.partialDeepStrictEqual would
 * also accept an array with extra elements. assertCloseTo compares numbers to
 * a number of decimal digits.
 */

import assert from "node:assert/strict";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** `actual` cut down to the properties `expected` has, so the diff shows only those */
const project = (actual: unknown, expected: unknown): unknown => {
  if (Array.isArray(actual) && Array.isArray(expected)) {
    return actual.map((item, i) =>
      i < expected.length ? project(item, expected[i]) : item
    );
  }
  if (isObject(actual) && isObject(expected)) {
    return Object.fromEntries(
      Object.keys(expected)
        .filter((key) => key in actual)
        .map((key) => [key, project(actual[key], expected[key])])
    );
  }
  return actual;
};

export const assertMatchObject = (actual: unknown, expected: unknown) =>
  assert.deepEqual(project(actual, expected), expected);

const close = (actual: number, expected: number, digits: number) =>
  Math.abs(actual - expected) < 10 ** -digits / 2;

export const assertCloseTo = (actual: number, expected: number, digits = 2) =>
  assert.ok(
    close(actual, expected, digits),
    `${actual} isn't ${expected} to ${digits} digits`
  );

export const assertNotCloseTo = (
  actual: number,
  expected: number,
  digits = 2
) =>
  assert.ok(
    !close(actual, expected, digits),
    `${actual} is ${expected} to ${digits} digits`
  );
