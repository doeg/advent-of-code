package main

import (
	"fmt"

	"github.com/doeg/advent-of-code/util"
)

func main() {
	input := util.ReadNumberGrid()
	partOne(input)
	partTwo(input)
}

func partOne(input [][]int) {
	gridHeight := len(input)
	gridWidth := len(input[0])

	// This just represents that the trees around the edge of the grid
	// are always visible
	offset := 1

	// Start off by counting the trees along the edge
	result := 2*gridHeight + (2 * (gridWidth - 2))

	// This runs in O(n^2)... not sure if there is a linear solution :thinky:
	for i := offset; i < gridHeight-offset; i++ {
		for j := offset; j < gridWidth-offset; j++ {
			tallestNorthwards := CheckNorth(input, i, j)
			if tallestNorthwards {
				result++
				continue
			}

			tallestEastwards := CheckEast(input, i, j)
			if tallestEastwards {
				result++
				continue
			}

			tallestSouthwards := CheckSouth(input, i, j)
			if tallestSouthwards {
				result++
				continue
			}

			tallestWestwards := CheckWest(input, i, j)
			if tallestWestwards {
				result++
				continue
			}

		}
	}

	fmt.Println(result)
}

func CheckNorth(input [][]int, i int, j int) bool {
	for n := i - 1; n >= 0; n-- {
		if input[n][j] >= input[i][j] {
			return false
		}
	}
	return true
}

func CheckEast(input [][]int, i int, j int) bool {
	for n := j + 1; n < len(input[0]); n++ {
		if input[i][n] >= input[i][j] {
			return false
		}
	}
	return true
}

func CheckSouth(input [][]int, i int, j int) bool {
	for n := i + 1; n < len(input); n++ {
		if input[n][j] >= input[i][j] {
			return false
		}
	}
	return true
}

func CheckWest(input [][]int, i int, j int) bool {
	for n := j - 1; n >= 0; n-- {
		if input[i][n] >= input[i][j] {
			return false
		}
	}
	return true
}

func partTwo(input [][]int) {
	gridHeight := len(input)
	gridWidth := len(input[0])
	offset := 1

	biggest := make([]int, 3) // i, j, score

	for i := offset; i < gridHeight-offset; i++ {
		for j := offset; j < gridWidth-offset; j++ {
			n := CheckScoreNorth(input, i, j)
			e := CheckScoreEast(input, i, j)
			s := CheckScoreSouth(input, i, j)
			w := CheckScoreWest(input, i, j)
			score := n * e * s * w
			if score > biggest[2] {
				biggest = []int{i, j, score}
			}
		}
	}

	fmt.Println(biggest[2])
}

func CheckScoreNorth(input [][]int, i int, j int) int {
	score := 0
	for n := i - 1; n >= 0; n-- {
		score++
		if input[n][j] >= input[i][j] {
			return score
		}
	}
	return score
}

func CheckScoreEast(input [][]int, i int, j int) int {
	score := 0
	for n := j + 1; n < len(input[0]); n++ {
		score++
		if input[i][n] >= input[i][j] {
			return score
		}
	}
	return score
}

func CheckScoreSouth(input [][]int, i int, j int) int {
	score := 0
	for n := i + 1; n < len(input); n++ {
		score++
		if input[n][j] >= input[i][j] {
			return score
		}
	}
	return score
}

func CheckScoreWest(input [][]int, i int, j int) int {
	score := 0
	for n := j - 1; n >= 0; n-- {
		score++
		if input[i][n] >= input[i][j] {
			return score
		}
	}
	return score
}
