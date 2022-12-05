package util

import (
	"bufio"
	"os"
)

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
