package main

import (
	"fmt"

	"github.com/doeg/advent-of-code/util"
)

func main() {
	partOne()
	partTwo()
}

func partOne() {

	input := util.ReadInput()

	acc := 0

	for _, r := range input {
		half := len(r) / 2

		first := r[:half]
		second := r[half:]

		counts := makeCounts(first)

		for _, s := range second {
			if counts[s] > 0 {
				acc += int(getPriority(s))
				break
			}
		}
	}

	fmt.Println(acc)
}

func partTwo() {
	input := util.ReadInput()

	i := 0
	n := 3

	acc := 0

	for i < len(input) {
		a := input[i]
		b := input[i+1]
		c := input[i+2]

		aa := makeCounts(a)
		bb := makeCounts(b)

		// I feel like there's probably some clever-ass bitwise bullshit
		// that could be done here... hmm.
		for _, cc := range c {
			if aa[cc] > 0 && bb[cc] > 0 {
				acc += int(getPriority(cc))
				break
			}
		}

		i += n
	}

	fmt.Println(acc)

}

func makeCounts(s string) map[rune]int {
	counts := make(map[rune]int)
	for _, f := range s {
		counts[f] += 1
	}
	return counts
}

func getPriority(letter rune) int32 {
	if letter > rune('Z') {
		return letter - rune('a') + 1
	} else {
		return letter - rune('A') + 1 + 26
	}
}
