package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"strings"
)

func main() {
	partOne()
	partTwo()
}

func partOne() {
	inputFile := os.Args[1]
	file, err := ioutil.ReadFile(inputFile)
	if err != nil {
		panic(err)
	}

	input := string(file)
	arr := strings.Split(strings.ReplaceAll(input, "\r\n", "\n"), "\n")

	var buff int
	var biggest int

	for _, c := range arr {
		if c != "" {
			i, _ := strconv.Atoi(c)
			buff = buff + i
			continue
		}

		if buff > biggest {
			biggest = buff
		}

		buff = 0
	}

	fmt.Println(biggest)
}

const n = 3

func partTwo() {
	inputFile := os.Args[1]
	file, err := ioutil.ReadFile(inputFile)
	if err != nil {
		panic(err)
	}

	input := string(file)
	arr := strings.Split(strings.ReplaceAll(input, "\r\n", "\n"), "\n")

	var buff int

	biggest := make([]int, n)

	for _, c := range arr {
		if c != "" {
			i, _ := strconv.Atoi(c)
			buff = buff + i
			continue
		}

		for b := range biggest {
			if buff > biggest[b] {
				biggest = shuffle(biggest, b, buff)
				break
			}
		}
		buff = 0
	}

	result := 0
	for i := range biggest {
		result += biggest[i]
	}

	fmt.Println(result)
}

// Inserts 'val' into the array 'arr' at index 'indexAt'
// and shuffles all remaining values to the right, returning
// the new array.
func shuffle(arr []int, insertAt int, val int) []int {
	result := arr

	// Start at the "back" of the array so we can just drop the smallest
	z := len(arr) - 1

	for z > insertAt {
		result[z] = arr[z-1]
		z -= 1
	}

	result[insertAt] = val

	return result
}
