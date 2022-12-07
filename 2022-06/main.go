package main

import (
	"fmt"

	"github.com/doeg/advent-of-code/util"
)

func main() {
	findMarker(4)  // Part one
	findMarker(14) // Part two
}

func findMarker(lookback int) {
	input := util.ReadInput()

	// Doesn't have to be a loop, but it's useful for processing all
	// five examples more easily.
	for _, i := range input {
		for j := lookback; j < len(i); j++ {
			b := make(map[string]bool, lookback)

			// Could do an optimization here where we move j ahead
			// to a new position _past_ any dupes based on k.
			for k := 0; k < lookback; k++ {
				c := string(i[j-k-1])
				if b[c] == true {
					break
				}
				b[c] = true
			}

			if len(b) == lookback {
				fmt.Println(j)
				break
			}
		}
	}
}
