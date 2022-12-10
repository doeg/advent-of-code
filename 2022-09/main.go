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
	visited := make(map[string]bool)

	h := &util.Coords{X: 0, Y: 0}
	t := &util.Coords{X: 0, Y: 0}

	for _, line := range input {
		dir, mag := parseInstruction(line)
		// fmt.Printf("==== %s%d ====\n", dir, mag)
		// printGrid(h, t)

		hs := make([]string, 0)
		// hs = append(hs, h.ToString())

		ts := make([]string, 0)
		// ts = append(ts, t.ToString())

		for i := 0; i < mag; i++ {
			// Move H
			switch dir {
			case "U":
				h.Y++
			case "R":
				h.X++
			case "D":
				h.Y--
			case "L":
				h.X--
			default:
				panic(fmt.Errorf("invalid direction %s", dir))
			}

			hs = append(hs, h.ToString())

			// Move T
			if h.IsAdjacent(t) {
				ts = append(ts, t.ToString())
			} else {
				if h.X > t.X {
					t.X++
				}
				if h.X < t.X {
					t.X--
				}
				if h.Y > t.Y {
					t.Y++
				}
				if h.Y < t.Y {
					t.Y--
				}
			}

			visited[t.ToString()] = true
			// printGrid(h, t)
		}

		// fmt.Printf("H: %s\n", strings.Join(hs, " -> "))
		// fmt.Printf("T: %s\n", strings.Join(ts, " -> "))
		// fmt.Println()
	}

	fmt.Println(len(visited))
}

func parseInstruction(line string) (string, int) {
	s := strings.Split(line, " ")
	mag, _ := strconv.Atoi(s[1])
	return s[0], mag
}

func printGrid(h, t *util.Coords) {
	size := 11
	hp, err := h.ToGridPosition(size)
	if err != nil {
		panic(err)
	}

	tp, err := t.ToGridPosition(size)
	if err != nil {
		panic(err)
	}

	for row := 0; row < size; row++ {
		s := make([]string, 0)
		for col := 0; col < size; col++ {
			switch {
			case hp.Row == row && hp.Col == col:
				s = append(s, "H")
			case tp.Row == row && tp.Col == col:
				s = append(s, "T")
			default:
				s = append(s, ".")
			}
		}
		fmt.Println(strings.Join(s, " "))
	}
	fmt.Println()
}
