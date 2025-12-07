import { describe, expect, test } from "bun:test";
import { partOne, partTwo, splitEvenSubstrings } from "./day02";

const TEST_INPUT =
  "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124";

describe("day two", () => {
  describe("part one", () => {
    test("test input", () => {
      expect(partOne(TEST_INPUT)).toEqual(1227775554);
    });
  });

  describe("part two", () => {
    test("test input", () => {
      expect(partTwo(TEST_INPUT)).toEqual(4174379265);
    });

    test("known matches", () => {
      expect(partTwo("11-22")).toEqual(11 + 22);
    });
  });

  describe("splitSubstrings", () => {
    test("returns valid substrings", () => {
      expect(splitEvenSubstrings("123123", 3)).toEqual(["123", "123"]);
      expect(splitEvenSubstrings("123456789", 3)).toEqual([
        "123",
        "456",
        "789",
      ]);
    });

    test("always works when the divisor is 1", () => {
      expect(splitEvenSubstrings("123", 1)).toEqual(["1", "2", "3"]);
      expect(splitEvenSubstrings("111", 1)).toEqual(["1", "1", "1"]);
    });

    test("returns an empty array when divisor does not fit", () => {
      expect(splitEvenSubstrings("111", 2)).toEqual([]);
      expect(splitEvenSubstrings("11", 3)).toEqual([]);
    });
  });
});
