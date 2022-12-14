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
	sandMap := buildSandMap(input, false)

	grains := 0
	for {
		// Simulates a grain of sand. If the grain comes to rest without falling
		// into the abyss, the grain is marked on the sandmap as a feature and
		// the function returns true. If the grain falls into the abyss,
		// the function returns false.
		atRest := simulateGrain(sandMap)
		if !atRest {
			break
		}

		grains++
	}
	sandMap.print()
	fmt.Println(grains)
}

func partTwo(input []string) {
	sandMap := buildSandMap(input, true)
	grains := 0
	for {
		atRest := simulateGrain(sandMap)
		if !atRest {
			break
		}

		grains++
	}
	// Need to account for placement of the last grain at the spout position.
	grains++

	sandMap.print()
	fmt.Println(grains)
}

func simulateGrain(sandMap *SandMap) bool {
	// Set the initial position of the grain the position of the spout
	x := 500
	y := 0

	for {
		switch {
		// There is no infinite floor... the sand fell into the abyss!
		case !sandMap.infiniteFloor && y > sandMap.yMax:
			return false

		// The sand falls at rest to the infinite floor
		case sandMap.infiniteFloor && y == sandMap.yMax+1:
			// Place the sand at rest above the floor
			sandMap.addFeature(x, y, FEATURE_SAND)
			// Draw floor as needed since... well, it's infinite.
			sandMap.addFeature(x, y+1, FEATURE_ROCK)
			return true

		// A unit of sand always falls down one step if possible.
		case sandMap.canMoveTo(x, y+1):
			y++
			continue

		// If the tile immediately below is blocked (by rock or sand), the unit of sand
		// attempts to instead move diagonally one step down and to the left.
		case sandMap.canMoveTo(x-1, y+1):
			y++
			x--
			continue

		// If that tile is blocked, the unit of sand attempts to instead move
		// diagonally one step down and to the right.
		case sandMap.canMoveTo(x+1, y+1):
			y++
			x++
			continue

		// The sand can't move anywhere, and it is still at the initial spot position.
		case x == 500 && y == 0:
			return false

		// The sand can't move anywhere; it is at rest.
		default:
			sandMap.addFeature(x, y, FEATURE_SAND)
			return true
		}
	}
}

type SandMap struct {
	infiniteFloor bool
	features      map[string]FeatureType
	xMin, xMax    int
	yMin, yMax    int
}

type FeatureType int

const (
	FEATURE_ROCK FeatureType = iota
	FEATURE_SAND
)

func NewSandMap(infiniteFloor bool) *SandMap {
	return &SandMap{
		features:      make(map[string]FeatureType),
		infiniteFloor: infiniteFloor,
	}
}

func (sandMap *SandMap) addFeature(x, y int, featureType FeatureType) {
	k := fmt.Sprintf("%d,%d", x, y)
	if _, ok := sandMap.features[k]; ok {
		sandMap.print()
		panic(fmt.Errorf("cannot place feature at %d,%d; feature already exists", x, y))
	}
	sandMap.features[k] = featureType
}

func (sandMap *SandMap) canMoveTo(x, y int) bool {
	k := fmt.Sprintf("%d,%d", x, y)
	_, ok := sandMap.features[k]
	return !ok
}

const (
	RockColor       = "\033[1;34m%s\033[0m"
	SandColor       = "\033[1;36m%s\033[0m"
	BackgroundColor = "\033[1;30m%s\033[0m"
)

func (sandMap *SandMap) print() {
	xRange := sandMap.xMax - sandMap.xMin
	yRange := sandMap.yMax - sandMap.yMin

	for y := 0; y <= yRange; y++ {
		s := ""
		for x := 0; x <= xRange; x++ {
			k := fmt.Sprintf("%d,%d", x+sandMap.xMin, y+sandMap.yMin)
			if f, ok := sandMap.features[k]; ok {
				switch f {
				case FEATURE_ROCK:
					s = s + fmt.Sprintf(RockColor, "#")
				case FEATURE_SAND:
					s = s + fmt.Sprintf(SandColor, "o")
				}
			} else {
				s = s + fmt.Sprintf(BackgroundColor, ".")
			}
		}
		fmt.Println(s)
	}
}

func buildSandMap(input []string, infiniteFloor bool) *SandMap {
	sandMap := NewSandMap(infiniteFloor)

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

		sandMap.xMin = xMin
		sandMap.xMax = xMax
		sandMap.yMin = yMin
		sandMap.yMax = yMax

		// Iterate through the coordinates again, but this time
		// "fill in" the rest of the rocks.
		for i, curr := range coords {
			sandMap.features[curr.toString()] = FEATURE_ROCK

			// "Draw" rocks from the current point to the previous point.
			if i > 0 {
				prev := coords[i-1]
				switch {
				case prev.x < curr.x:
					for i := prev.x; i < curr.x; i++ {
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

	return sandMap
}

// This struct is mostly vestigial since at some point I switched
// to just using x,y coords directly... but whatever, I don't want to
// refactor it out.

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
