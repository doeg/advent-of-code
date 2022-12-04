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
	var values map[string]int = map[string]int{
		"A": 1, // Rock
		"B": 2, // Paper
		"C": 3, // Scissors

		"X": 1, // Rock
		"Y": 2, // Paper
		"Z": 3, // Scissors
	}

	var lookup [][]int = [][]int{
		{3, 0, 6},
		{6, 3, 0},
		{0, 6, 3},
	}

	inputFile := os.Args[1]
	file, err := ioutil.ReadFile(inputFile)
	if err != nil {
		panic(err)
	}

	input := string(file)
	arr := strings.Split(strings.ReplaceAll(input, "\r\n", "\n"), "\n")

	acc := 0

	for _, round := range arr {
		// Ignore trailing newlines
		if round == "" {
			continue
		}

		s := strings.Split(round, " ")
		them := values[s[0]]
		me := values[s[1]]

		result := lookup[me-1][them-1] + me
		acc += result
	}

	fmt.Println(acc)
}

func partTwo() {
	var values map[string]int = map[string]int{
		"A": 1, // Rock
		"B": 2, // Paper
		"C": 3, // Scissors

		"R": 1, // Rock
		"P": 2, // Paper
		"S": 3, // Scissors

		"X": 0, // Lose
		"Y": 3, // Draw
		"Z": 6, // Win
	}

	var lookup [][]int = [][]int{
		{3, 0, 6},
		{6, 3, 0},
		{0, 6, 3},
	}

	inputFile := os.Args[1]
	file, err := ioutil.ReadFile(inputFile)
	if err != nil {
		panic(err)
	}

	input := string(file)
	arr := strings.Split(strings.ReplaceAll(input, "\r\n", "\n"), "\n")

	acc := 0

	for _, round := range arr {
		s := strings.Split(round, " ")
		if len(s) < 2 {
			continue
		}

		them := s[0]
		outcome := s[1]

		tn := values[them]
		on := values[outcome]

		me := -1

		for m := range lookup {
			if lookup[m][tn-1] == on {
				me = m + 1
				break
			}
		}

		if me < 0 {
			panic("nope")
		}

		acc += on + me
	}

	fmt.Println(acc)
}
