package util

import (
	"fmt"
	"math"
)

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
