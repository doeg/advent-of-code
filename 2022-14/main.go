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
}

func partOne(input []string) {
	// sandMap := make(map[string]FeatureType)
	sandMap := NewSandMap()

	xMax := 0
	xMin := math.MaxInt
	yMax := 0
	yMin := 0 // yMin is p much guaranteed to be zero anyway but whatevs

	// Each line of the input file represents a rock shape,
	// specified by its points.
	for _, line := range input {
		coords := make([]*Coords, 0)
		for _, part := range strings.Split(line, " -> ") {
			c := NewCoords(part)
			coords = append(coords, c)

			// Figure out the boundaries of the map we can draw.
			// This is mostly for debugging/drawing purposes.
			if c.x > xMax {
				xMax = c.x
			} else if c.x < xMin {
				xMin = c.x
			}

			if c.y > yMax {
				yMax = c.y
			} else if c.y < yMin {
				yMin = c.y
			}
		}

		// Iterate through the coordinates again, but this time
		// "fill in" the rest of the rocks.
		for i, curr := range coords {
			fmt.Println(curr.toString())
			sandMap.features[curr.toString()] = FEATURE_ROCK

			// "Draw" rocks from the current point to the previous point.
			if i > 0 {
				prev := coords[i-1]
				switch {
				case prev.x < curr.x:
					for i := prev.x; i < prev.x; i++ {
						sandMap.features[fmt.Sprintf("%d,%d", i, curr.y)] = FEATURE_ROCK
					}
				case curr.x < prev.x:
					for i := curr.x; i < prev.x; i++ {
						sandMap.features[fmt.Sprintf("%d,%d", i, curr.y)] = FEATURE_ROCK
					}
				case curr.y < prev.y:
					for i := curr.y; i < prev.y; i++ {
						sandMap.features[fmt.Sprintf("%d,%d", curr.x, i)] = FEATURE_ROCK
					}
				case prev.y < curr.y:
					for i := prev.y; i < curr.y; i++ {
						sandMap.features[fmt.Sprintf("%d,%d", curr.x, i)] = FEATURE_ROCK
					}
				}

			}
		}
	}

	sandMap.xMin = xMin
	sandMap.xMax = xMax
	sandMap.yMin = yMin
	sandMap.yMax = yMax

	sandMap.print()
}

type SandMap struct {
	features map[string]FeatureType

	xMin, xMax int
	yMin, yMax int
}

func NewSandMap() *SandMap {
	return &SandMap{
		features: make(map[string]FeatureType),
	}
}

func (sandMap *SandMap) print() {
	xRange := sandMap.xMax - sandMap.xMin
	yRange := sandMap.yMax - sandMap.yMin

	fmt.Println(sandMap.features)
	for y := 0; y <= yRange; y++ {
		s := ""
		for x := 0; x <= xRange; x++ {
			k := fmt.Sprintf("%d,%d", x+sandMap.xMin, y+sandMap.yMin)
			if _, ok := sandMap.features[k]; ok {
				s += "#"
			} else {
				s += "."
			}
		}
		fmt.Println(s)
	}
}

type Coords struct {
	// x represents distance to the right and y represents distance down
	x, y int
}

func (c *Coords) toString() string {
	return fmt.Sprintf("%d,%d", c.x, c.y)
}

func NewCoords(s string) *Coords {
	parts := strings.Split(s, ",")
	x, _ := strconv.Atoi(parts[0])
	y, _ := strconv.Atoi(parts[1])
	return &Coords{x: x, y: y}
}

type Feature struct {
	coords      Coords
	featureType FeatureType
	key         string
}

type FeatureType int

const (
	FEATURE_ROCK FeatureType = iota
	FEATURE_SAND
)
