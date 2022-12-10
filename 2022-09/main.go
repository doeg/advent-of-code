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

type Pos struct {
	row int
	col int
}

type GameState struct {
	dir string
	mag int
	hs  []Pos
}

func partOne(input []string) {
	history := make([]*GameState, 0)

	h := Pos{row: 0, col: 0}
	history = append(history, &GameState{
		hs: []Pos{h},
	})

	for _, line := range input {
		dir, mag := parseInstruction(line)

		state := &GameState{
			dir: dir,
			hs:  []Pos{h},
			mag: mag,
		}

		for i := 0; i < mag; i++ {
			// Move H
			switch dir {
			case "U":
				h.row--
			case "R":
				h.col++
			case "D":
				h.row++
			case "L":
				h.col--
			default:
				panic(fmt.Errorf("Invalid direction: %s", dir))
			}

			state.hs = append(state.hs, h)
		}

		history = append(history, state)
	}

	printHistory(history)
}

func (p *Pos) toString() string {
	return fmt.Sprintf("[%d][%d]", p.row, p.col)
}

func parseInstruction(line string) (string, int) {
	i := strings.Split(line, " ")
	mag, _ := strconv.Atoi(i[1])
	return i[0], mag
}

func printHistory(history []*GameState) {
	for _, state := range history {
		fmt.Printf("==== %s%d ====\n", state.dir, state.mag)

		hs := make([]string, len(state.hs))
		for i := 0; i < len(state.hs); i++ {
			hs[i] = state.hs[i].toString()
		}

		fmt.Println("H:", strings.Join(hs, " -> "))
		fmt.Println()
	}
}
