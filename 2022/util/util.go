package util

import (
	"bufio"
	"os"
)

func IsUsingExample() bool {
	path := os.Args[1]
	return path == "example.txt"
}

func ReadInput() []string {
	// Assumes you're running the file with 'go run whatever.go example.txt'
	path := os.Args[1]

	file, err := os.Open(path)
	if err != nil {
		panic(err)
	}

	defer file.Close()

	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	err = scanner.Err()
	if err != nil {
		panic(err)
	}

	return lines
}

func ReadNumberGrid() [][]int {
	// Assumes you're running the file with 'go run whatever.go example.txt'
	path := os.Args[1]

	file, err := os.Open(path)
	if err != nil {
		panic(err)
	}

	defer file.Close()

	var lines [][]int
	i := 0

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		lines = append(lines, make([]int, len(line)))
		for j, r := range line {
			lines[i][j] = int(r - '0')
		}
		i++
	}

	err = scanner.Err()
	if err != nil {
		panic(err)
	}

	return lines
}
