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
}

func partOne(input []string) {
	h := &util.Coords{X: 0, Y: 0}

	for _, line := range input {
		dir, mag := parseInstruction(line)
		fmt.Printf("==== %s%d ====\n", dir, mag)
		printGrid(h)

		hs := make([]string, 0)
		hs = append(hs, h.ToString())

		for i := 0; i < mag; i++ {
			switch dir {
			case "U":
				h.Y--
			case "R":
				h.X++
			case "D":
				h.Y++
			case "L":
				h.X--
			default:
				panic(fmt.Errorf("invalid direction %s", dir))
			}

			hs = append(hs, h.ToString())

			printGrid(h)
		}

		fmt.Printf("H: %s\n", strings.Join(hs, " -> "))
		fmt.Println()

	}
}

func parseInstruction(line string) (string, int) {
	s := strings.Split(line, " ")
	mag, _ := strconv.Atoi(s[1])
	return s[0], mag
}

func printGrid(h *util.Coords) {
	size := 11
	hp, err := h.ToGridPosition(size)
	if err != nil {
		panic(err)
	}

	for row := 0; row < size; row++ {
		s := make([]string, 0)
		for col := 0; col < size; col++ {
			switch {
			case hp.Row == row && hp.Col == col:
				s = append(s, "H")
			default:
				s = append(s, ".")
			}
		}
		fmt.Println(strings.Join(s, " "))
	}
	fmt.Println()
}
