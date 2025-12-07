import { describe, expect, test } from "bun:test";
import { partOne, partTwo } from "./day01";

const TEST_INPUT = [
  "L68",
  "L30",
  "R48",
  "L5",
  "R60",
  "L55",
  "L1",
  "L99",
  "R14",
  "L82",
];

describe("day one", () => {
  describe("partOne", () => {
    test("test input", () => {
      expect(
        partOne({
          initialPosition: 50,
          instructions: TEST_INPUT,
        })
      ).toEqual(3);
    });
  });

  describe("partTwo", () => {
    test("test input", () => {
      expect(
        partTwo({
          initialPosition: 50,
          instructions: TEST_INPUT,
        })
      ).toEqual(6);
    });

    test("partial test input", () => {
      expect(
        partTwo({
          initialPosition: 50,
          instructions: ["L68"],
        })
      ).toEqual(1);

      expect(
        partTwo({
          initialPosition: 50,
          instructions: ["L68", "L30"],
        })
      ).toEqual(1);

      expect(
        partTwo({
          initialPosition: 50,
          instructions: ["L68", "L30", "R48"],
        })
      ).toEqual(2);

      expect(
        partTwo({
          initialPosition: 50,
          instructions: ["L68", "L30", "R48", "L5"],
        })
      ).toEqual(2);

      expect(
        partTwo({
          initialPosition: 50,
          instructions: ["L68", "L30", "R48", "L5", "R60"],
        })
      ).toEqual(3);

      expect(
        partTwo({
          initialPosition: 50,
          instructions: ["L68", "L30", "R48", "L5", "R60", "L55"],
        })
      ).toEqual(4);

      expect(
        partTwo({
          initialPosition: 50,
          instructions: ["L68", "L30", "R48", "L5", "R60", "L55", "L1"],
        })
      ).toEqual(4);

      expect(
        partTwo({
          initialPosition: 50,
          instructions: ["L68", "L30", "R48", "L5", "R60", "L55", "L1", "L99"],
        })
      ).toEqual(5);

      expect(
        partTwo({
          initialPosition: 50,
          instructions: [
            "L68",
            "L30",
            "R48",
            "L5",
            "R60",
            "L55",
            "L1",
            "L99",
            "R14",
          ],
        })
      ).toEqual(5);

      expect(
        partTwo({
          initialPosition: 50,
          instructions: [
            "L68",
            "L30",
            "R48",
            "L5",
            "R60",
            "L55",
            "L1",
            "L99",
            "R14",
            "L82",
          ],
        })
      ).toEqual(6);
    });

    test("multiple full rotations", () => {
      expect(
        partTwo({
          initialPosition: 50,
          instructions: ["R1000"],
        })
      ).toEqual(10);
    });

    test("starting and ending at zero", () => {
      expect(
        partTwo({
          initialPosition: 0,
          instructions: ["L100", "R100"],
        })
      ).toEqual(2);
    });

    test("single CCW rotation crossing zero", () => {
      expect(
        partTwo({
          initialPosition: 50,
          instructions: ["L68"],
        })
      ).toEqual(1);
    });

    test("double CCW rotation crossing zero", () => {
      expect(
        partTwo({
          initialPosition: 50,
          instructions: ["L168"],
        })
      ).toEqual(2);
    });

    test("starting at non-zero and ending at non-zero across a multiple rotations", () => {
      expect(
        partTwo({
          initialPosition: 50,
          instructions: ["L149"],
        })
      ).toEqual(1);
    });

    test("starting at non-zero ending at zero across multiple CW rotations", () => {
      expect(
        partTwo({
          initialPosition: 50,
          instructions: ["R150"],
        })
      ).toEqual(2);
    });

    test("starting at non-zero ending at zero across multiple CCW rotations", () => {
      expect(
        partTwo({
          initialPosition: 50,
          instructions: ["L150"],
        })
      ).toEqual(2);
    });
  });
});
