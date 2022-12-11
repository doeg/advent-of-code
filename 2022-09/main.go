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
	visited := make(map[string]bool)

	h := &Coords{X: 0, Y: 0}
	t := &Coords{X: 0, Y: 0}

	for _, line := range input {
		dir, mag := parseInstruction(line)
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

			// Move T
			if !h.isAdjacent(t) {
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

			visited[t.toString()] = true
		}
	}

	fmt.Println(len(visited))
}

func partTwo(input []string) {
	rope := make([]Coords, 10)
	tailPositionsByKey := make(map[string]bool)

	for _, line := range input {
		dir, mag := parseInstruction(line)

		for m := 0; m < mag; m++ {
			next := rope

			for k := 0; k < len(rope); k++ {
				// The head of the rope is ~* special *~
				if k == 0 {
					next[k] = moveHead(rope[k], dir)
					continue
				}

				comp := next[k-1]
				if !comp.isEqual(&rope[k]) && !comp.isAdjacent(&rope[k]) {
					if comp.X > rope[k].X {
						rope[k].X++
					}
					if comp.X < rope[k].X {
						rope[k].X--
					}
					if comp.Y > rope[k].Y {
						rope[k].Y++
					}
					if comp.Y < rope[k].Y {
						rope[k].Y--
					}
				}

				// If we're on the tail, track its position
				if k == len(next)-1 {
					tailPositionsByKey[next[k].toString()] = true
				}
			}

			rope = next
		}
	}
	fmt.Println(len(tailPositionsByKey))
}

func moveHead(c Coords, dir string) Coords {
	next := c
	switch dir {
	case "U":
		next.Y++
	case "R":
		next.X++
	case "D":
		next.Y--
	case "L":
		next.X--
	default:
		panic(fmt.Errorf("invalid direction %s", dir))
	}
	return next
}

func parseInstruction(line string) (string, int) {
	s := strings.Split(line, " ")
	mag, _ := strconv.Atoi(s[1])
	return s[0], mag
}

// Represents (x,y) coordinates on a 2D Cartesian plane
type Coords struct {
	X int // horizontal
	Y int // vertical
}

func (c *Coords) toString() string {
	return fmt.Sprintf("(%d,%d)", c.X, c.Y)
}

func (c *Coords) isEqual(other *Coords) bool {
	return c.X == other.X && c.Y == other.Y
}

// isAdjacent returns true if "other" is adjacent to "c"
// in the horizontal, vertical, or diagonal direction
func (c *Coords) isAdjacent(other *Coords) bool {
	isN := other.X == c.X && other.Y == c.Y+1
	isNE := other.X == c.X+1 && other.Y == c.Y+1
	isE := other.X == c.X+1 && other.Y == c.Y
	isSE := other.X == c.X+1 && other.Y == c.Y-1
	isS := other.X == c.X && other.Y == c.Y-1
	isSW := other.X == c.X-1 && other.Y == c.Y-1
	isW := other.X == c.X-1 && other.Y == c.Y
	isNW := other.X == c.X-1 && other.Y == c.Y+1
	return isN || isNE || isE || isSE || isS || isSW || isW || isNW
}
