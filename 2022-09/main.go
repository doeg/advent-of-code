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
	h := util.Coords{X: 0, Y: 0}

	for _, line := range input {
		dir, mag := parseInstruction(line)
		fmt.Printf("==== %s%d ====\n", dir, mag)

		hs := make([]string, 0)

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
				panic(fmt.Errorf("Invalid direction %s", dir))
			}

			hs = append(hs, h.ToString())
		}

		fmt.Println(strings.Join(hs, " -> "))
		fmt.Println()
	}
}

func parseInstruction(line string) (string, int) {
	s := strings.Split(line, " ")
	mag, _ := strconv.Atoi(s[1])
	return s[0], mag
}
