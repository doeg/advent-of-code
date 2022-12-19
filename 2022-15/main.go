package main

import (
	"fmt"
	"math"
	"regexp"
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
	sensorMap := buildSensorMap(input)

	y := 2000000
	if util.IsUsingExample() {
		y = 10
	}

	result := sensorMap.calculateCoverage(y)
	fmt.Println(result)
}

func partTwo(input []string) {
	sensorMap := buildSensorMap(input)

	m := 4000000
	if util.IsUsingExample() {
		m = 20
	}

	// A mapping from "x,y" coordinates to whether or not
	// that position is a candidate for the missing beacon.
	// This is based on the hint that the missing becon MUST exist
	// _just_ outside any (and every!) sensor region.
	candidates := make(map[string]bool)

	// So, we can proceed by moving along the edges of every sensor's range.
	for _, sensor := range sensorMap.sensors {
		// The radius of a sensor is inclusive; the edge is (by definition!)
		// just outside this radius.
		outerRadius := sensor.radius + 1

		for r := 0; r <= outerRadius; r++ {
			x1 := sensor.x - r
			x2 := sensor.x + r

			dy := outerRadius - r
			y1 := sensor.y + dy
			y2 := sensor.y - dy

			if x1 >= 0 && x1 <= m && y1 >= 0 && y1 <= m {
				candidates[toKey(x1, y1)] = true
			}
			if x1 >= 0 && x1 <= m && y2 >= 0 && y2 <= m {
				candidates[toKey(x1, y2)] = true
			}
			if x2 >= 0 && x2 <= m && y1 >= 0 && y1 <= m {
				candidates[toKey(x2, y1)] = true
			}
			if x2 >= 0 && x2 <= m && y2 >= 0 && y2 <= m {
				candidates[toKey(x2, y2)] = true
			}
		}
	}

	fmt.Println(len(candidates))

	// Weed out candidates based on whether or not they fall
	// within the range of any other sensor
	for cs := range candidates {
		x, y := fromKey(cs)

		outOfEveryRange := true
		for _, sensor := range sensorMap.sensors {
			outOfRange := sensor.distance(x, y) > sensor.radius
			if !outOfRange {
				outOfEveryRange = false
				break
			}
		}

		if outOfEveryRange {
			fmt.Println(x*4000000 + y)
			return
		}
	}
}

func buildSensorMap(input []string) *SensorMap {
	sensorMap := NewSensorMap()

	// Build the sensor map from the input
	re := regexp.MustCompile(`^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$`)
	for _, line := range input {
		matches := re.FindAllStringSubmatch(line, -1)
		if len(matches) != 1 {
			panic("invalid matches")
		}

		sx, _ := strconv.Atoi(matches[0][1])
		sy, _ := strconv.Atoi(matches[0][2])
		sensor := NewSensor(sx, sy)

		bx, _ := strconv.Atoi(matches[0][3])
		by, _ := strconv.Atoi(matches[0][4])
		sensor.addBeacon(bx, by)

		sensorMap.addSensor(sensor)
	}

	return sensorMap
}

type SensorMap struct {
	sensors []*Sensor

	// "Memoize" positions of the beacons + sensors, since we use that
	// in the calculations.
	beaconPositions map[string]bool
	sensorPositions map[string]bool

	// The min/max horizontal/vertical positions of the map,
	// which is bounded by the furthest range across all sensors
	xMin, xMax int
	yMin, yMax int
}

func NewSensorMap() *SensorMap {
	return &SensorMap{
		beaconPositions: make(map[string]bool),
		sensorPositions: make(map[string]bool),
		sensors:         make([]*Sensor, 0),
	}
}

func (sensorMap *SensorMap) addSensor(sensor *Sensor) {
	sensorMap.sensors = append(sensorMap.sensors, sensor)
	sensorMap.sensorPositions[sensor.key] = true

	// Recalculate the bounds of the map
	sensorMap.xMin = minInt(sensorMap.xMin, sensor.x-sensor.radius)
	sensorMap.xMax = maxInt(sensorMap.xMax, sensor.x+sensor.radius)
	sensorMap.yMin = minInt(sensorMap.yMin, sensor.y-sensor.radius)
	sensorMap.yMax = maxInt(sensorMap.yMax, sensor.y+sensor.radius)

	sensorMap.beaconPositions[sensor.beacon.key] = true
}

// Returns the number of positions that are not covered by
// any sensor in the map (and thus positions where a beacon
// definitely could NOT exist).
func (sensorMap *SensorMap) calculateCoverage(y int) int {
	count := 0
	for x := sensorMap.xMin; x <= sensorMap.xMax; x++ {
		c := sensorMap.calculateCoverageAt(x, y)
		count += c
	}
	return count
}

// calculateCoverageAt returns 1 if the position is covered by a sensor,
// or actually contains a sensor or beacon. It returns 0 if the position
// is not covered by anything.
func (sensorMap *SensorMap) calculateCoverageAt(x, y int) int {
	if sensorMap.hasBeaconAt(x, y) {
		return 0
	}

	for _, sensor := range sensorMap.sensors {
		ds := sensor.distance(x, y)
		if ds <= sensor.radius {
			return 1
		}
	}
	return 0
}

func (sensorMap *SensorMap) hasBeaconAt(x, y int) bool {
	k := toKey(x, y)
	_, ok := sensorMap.beaconPositions[k]
	return ok
}

type Sensor struct {
	beacon *Beacon
	key    string
	radius int
	x, y   int
}

func NewSensor(x, y int) *Sensor {
	return &Sensor{
		key: toKey(x, y),
		x:   x,
		y:   y,
	}
}

func (sensor *Sensor) addBeacon(x, y int) {
	beacon := NewBeacon(x, y)
	sensor.beacon = beacon
	sensor.radius = sensor.distance(x, y)
}

// Returns the Manhattan distance between the sensor
// and the point at position x,y
func (sensor *Sensor) distance(x, y int) int {
	dx := int(math.Abs(float64(sensor.x) - float64(x)))
	dy := int(math.Abs(float64(sensor.y) - float64(y)))
	return dx + dy
}

type Beacon struct {
	key  string
	x, y int
}

func NewBeacon(x, y int) *Beacon {
	return &Beacon{
		key: toKey(x, y),
		x:   x,
		y:   y,
	}
}

type FeatureType int

const (
	FEAT_SENSOR FeatureType = iota
	FEAT_BEACON
	FEAT_RAY
)

func toKey(x, y int) string {
	return fmt.Sprintf("%d,%d", x, y)
}

// Dumb helper functions
func minInt(a, b int) int {
	if b < a {
		return b
	}
	return a
}

func maxInt(a, b int) int {
	if b > a {
		return b
	}
	return a
}

func fromKey(k string) (int, int) {
	p := strings.Split(k, ",")
	x, _ := strconv.Atoi(p[0])
	y, _ := strconv.Atoi(p[1])
	return x, y
}
