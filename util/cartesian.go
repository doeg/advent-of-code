package util

import "fmt"

type Coords struct {
	X int // horizontal
	Y int // vertical
}

func (c *Coords) ToString() string {
	return fmt.Sprintf("(%d,%d)", c.X, c.Y)
}
