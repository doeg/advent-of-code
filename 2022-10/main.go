package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/doeg/advent-of-code/util"
)

func main() {
	input := util.ReadInput()
	partOne(input)
	partTwo(input)
}

func partOne(input []string) {
	x := 1
	cycle := 0
	signal := 0

	for _, line := range input {
		switch {
		case line == "noop":
			cycle = cycle + 1
			signal = maybeSample(cycle, x, signal)
		case strings.HasPrefix(line, "addx"):
			// This could probably be more elegant but whatever
			for i := 0; i < 2; i++ {
				cycle++
				signal = maybeSample(cycle, x, signal)
			}
			x += parseAdd(line)
		default:
			panic("Unknown instruction")
		}
	}

	fmt.Println(signal)
}

func partTwo(input []string) {
	cycle := 0

	// controls the horizontal position of a sprite
	// the sprite is 3 pixels wide, and the X register
	// sets the horizontal position of the middle of that sprite
	spritePosition := 1

	crt := make([][]string, 6)

	for _, line := range input {
		switch {
		case line == "noop":
			crt = maybeDraw(cycle, spritePosition, crt)
			cycle++
		case strings.HasPrefix(line, "addx"):
			for i := 0; i < 2; i++ {
				crt = maybeDraw(cycle, spritePosition, crt)
				cycle++
			}
			xn := parseAdd(line)
			spritePosition += xn
		}
	}

	for _, row := range crt {
		fmt.Println(row)
	}
}

func maybeDraw(cycle, spritePosition int, crt [][]string) [][]string {
	crtRow := cycle / 40
	crtCol := cycle % 40

	// The center of the sprite
	spriteCol := spritePosition % 40

	if len(crt[crtRow]) == 0 {
		crt[crtRow] = make([]string, 40)
	}

	// If the sprite is positioned such that one of its three pixels
	// is the pixel currently being drawn, the screen produces a lit pixel (#);
	// otherwise, the screen leaves the pixel dark (.).
	colMatch := crtCol >= spriteCol-1 && crtCol <= spriteCol+1
	if colMatch {
		crt[crtRow][crtCol] = "#"
	} else {
		crt[crtRow][crtCol] = "."
	}
	return crt
}

func maybeSample(cycle, x, signal int) int {
	switch {
	case cycle == 20 || (cycle-20)%40 == 0:
		return signal + cycle*x
	default:
		return signal
	}
}

func parseAdd(s string) int {
	v, _ := strconv.Atoi(strings.Split(s, " ")[1])
	return v
}
