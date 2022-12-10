package util

import "fmt"

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
