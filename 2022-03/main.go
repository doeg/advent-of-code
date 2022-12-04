package main

import (
	"fmt"
	"io/ioutil"
	"os"
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

	acc := 0

	for _, r := range arr {
		// Ignore messy newlines
		if r == "" {
			continue
		}

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
	inputFile := os.Args[1]
	file, err := ioutil.ReadFile(inputFile)
	if err != nil {
		panic(err)
	}

	input := string(file)
	arr := strings.Split(strings.ReplaceAll(input, "\r\n", "\n"), "\n")

	i := 0
	n := 3

	acc := 0

	for i < len(arr)-n {
		a := arr[i]
		b := arr[i+1]
		c := arr[i+2]

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
