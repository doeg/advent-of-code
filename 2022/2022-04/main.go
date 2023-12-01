package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/doeg/advent-of-code/util"
)

func main() {
	partOne()
	partTwo()
}

func partOne() {
	input := util.ReadInput()

	acc := 0

	for _, row := range input {
		a, aa, b, bb := parseRow(row)
		if (a <= b && aa >= bb) || (b <= a && bb >= aa) {
			acc += 1
			continue
		}
	}
	fmt.Println(acc)
}

func partTwo() {
	input := util.ReadInput()

	acc := 0

	for _, row := range input {
		a, aa, b, bb := parseRow(row)
		if (a <= b && aa >= b) || (b <= a && bb >= a) {
			acc += 1
			continue
		}
	}

	fmt.Println(acc)
}

// "2-4,6-8" -> (2,4,6,8)
func parseRow(r string) (int, int, int, int) {
	rr := strings.Split(r, ",")

	r1 := strings.Split(rr[0], "-")
	r2 := strings.Split(rr[1], "-")

	// Pls... I just want destructure syntax :(
	a, _ := strconv.Atoi(r1[0])
	b, _ := strconv.Atoi(r1[1])
	c, _ := strconv.Atoi(r2[0])
	d, _ := strconv.Atoi(r2[1])

	return a, b, c, d
}
