package main

import (
	"fmt"
	"math"
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

func partTwo(input []string) {
	rope := make([]Coords, 10)
	tailPositions := make([]Coords, 0)
	tailPositionsByKey := make(map[string]bool)

	for _, line := range input {
		dir, mag := parseInstruction(line)

		// fmt.Printf("\n==== %s%d ====\n", dir, mag)
		// printRopeGrid(rope)
		// fmt.Println()

		// Process each move in the instruction set individually
		for m := 0; m < mag; m++ {
			// Copy into a new var so we can mess with it
			next := rope

			for k := 0; k < len(rope); k++ {
				// The head of the rope is ~* special *~
				if k == 0 {
					next[k] = MoveHead(rope[k], dir)
					continue
				}

				// Compare the current to the "last" (headmost) in the rope
				comp := next[k-1]

				// If the current overlaps the last, even after it's already moved,
				// then they're stacked. The assumption is this only happens in the starting
				// position. Either way, nothing to be done.
				if !comp.IsEqual(&rope[k]) && !comp.IsAdjacent(&rope[k]) {
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
					tailPositions = append(tailPositions, next[k])
					tailPositionsByKey[next[k].ToString()] = true
				}
			}
			// printRopeGrid(next)
			// fmt.Println()

			// Update the rope state for the next iteration
			rope = next
		}

		// printVisited(tailPositions)

	}
	// fmt.Println(tailPositionsByKey)
	fmt.Println(len(tailPositionsByKey))
}

func MoveHead(c Coords, dir string) Coords {
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

func printVisited(coords []Coords) {
	size := 55
	positions := make(map[string]bool)
	for _, c := range coords {
		p, err := c.ToGridPosition(size)
		if err != nil {
			panic(err)
		}
		k := p.ToString()
		positions[k] = true
	}

	for row := 0; row < size; row++ {
		s := make([]string, 0)
		for col := 0; col < size; col++ {
			c := GridPosition{Row: row, Col: col}
			k := c.ToString()
			if positions[k] {
				s = append(s, "#")
			} else {
				s = append(s, ".")
			}
			// switch {
			// case hp.Row == row && hp.Col == col:
			// 	s = append(s, "H")
			// case tp.Row == row && tp.Col == col:
			// 	s = append(s, "T")
			// default:
			// 	s = append(s, ".")
			// }
		}
		fmt.Println(strings.Join(s, ""))
	}
	fmt.Println()
}

func printRopeGrid(coords []Coords) {
	size := 55

	positions := make(map[string][]string)
	for i, c := range coords {
		p, err := c.ToGridPosition(size)
		if err != nil {
			panic(err)
		}

		k := p.ToString()
		if _, ok := positions[k]; !ok {
			positions[k] = make([]string, 0)
		}

		s := fmt.Sprint(i)
		if i == 0 {
			s = "H"
		}
		positions[k] = append(positions[k], s)
	}

	for row := 0; row < size; row++ {
		line := make([]string, 0)
		for col := 0; col < size; col++ {
			p := &GridPosition{Row: row, Col: col}

			k, ok := positions[p.ToString()]
			s := "."
			if ok {
				s = k[0]
			}
			line = append(line, s)
		}
		fmt.Println(strings.Join(line, " "))
	}
}

func printGrid(h, t *Coords) {
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

// Represents (x,y) coordinates on a 2D Cartesian plane
type Coords struct {
	X int // horizontal
	Y int // vertical
}

func (c *Coords) ToString() string {
	return fmt.Sprintf("(%d,%d)", c.X, c.Y)
}

func (c *Coords) IsEqual(other *Coords) bool {
	return c.X == other.X && c.Y == other.Y
}

// IsAdjacent returns true if "other" is adjacent to "c"
// in the horizontal, vertical, or diagonal direction
func (c *Coords) IsAdjacent(other *Coords) bool {
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

// ToGridPosition returns the row and column coordinates on a square grid
// of size "size", where "size" is the _total_ size of the grid.
func (c *Coords) ToGridPosition(size int) (*GridPosition, error) {
	if size%2 == 0 {
		return nil, fmt.Errorf("size must be an odd number")
	}

	sf := int(math.Floor(float64(size) / 2))
	row := sf - c.Y
	col := sf + c.X

	return &GridPosition{Row: row, Col: col}, nil
}

// Represents a position in a 2D array
type GridPosition struct {
	Row int
	Col int
}

func (g *GridPosition) ToString() string {
	return fmt.Sprintf("[%d][%d]", g.Row, g.Col)
}
