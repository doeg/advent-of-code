package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/doeg/advent-of-code/util"
)

func main() {
	input := util.ReadInput()
	partOne(input)
}

func partOne(input []string) {
	for _, line := range input {
		dir, mag := parseInstruction(line)
		fmt.Println(dir, mag)
	}
}

func parseInstruction(line string) (string, int) {
	i := strings.Split(line, " ")
	mag, _ := strconv.Atoi(i[1])
	return i[0], mag
}
