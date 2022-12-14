package main

import (
	"fmt"
	"math"
	"net/http"

	"github.com/doeg/advent-of-code/util"
)

func main() {
	go func() {
		fmt.Println(http.ListenAndServe("localhost:6060", nil))
	}()

	input := util.ReadInput()
	partOne(input)
	partTwo(input)
}

func partOne(input []string) {
	grid, starts := buildGrid(input, "S")
	findShortestPath(grid, starts)
}

func partTwo(input []string) {
	grid, starts := buildGrid(input, "a")
	findShortestPath(grid, starts)
}

func findShortestPath(grid [][]*Node, starts []*Node) {
	// dist contains the current distances from 'source' to
	// other vertices; i.e., dist[u] is the current distance from
	// the 'source' to vertex u.
	dist := make(map[string]int)

	// prev contains pointers to previous-hop nodes on the shortest path
	// from 'source' to the given vertex; or, equivalently, it is the next-hop
	// on the path _from_ the given vertex _to_ the source.
	prev := make(map[string]*Node)

	queue := make([]*Node, 0)

	for _, row := range grid {
		for _, node := range row {
			dist[node.key] = math.MaxInt
			queue = append(queue, node)
		}
	}

	for _, source := range starts {
		dist[source.key] = 0
	}

	for len(queue) > 0 {
		u, newQueue := extractMin(queue, dist)

		if u.label == "E" {
			printPath(prev, u)
			return
		}

		queue = newQueue

		neighbors := findNeighbors(u, grid)
		for _, v := range neighbors {
			if !has(queue, v) {
				continue
			}

			alt := dist[u.key] + 1
			if alt < dist[v.key] {
				dist[v.key] = alt
				prev[v.key] = u
			}
		}
	}
}

func printPath(prev map[string]*Node, target *Node) {
	s := make([]string, 0)
	u := target

	for {
		if u == nil {
			break
		}

		s = append(s, u.key)
		u = prev[u.key]
	}

	fmt.Println(len(s) - 1)
}

func findNeighbors(node *Node, grid [][]*Node) []*Node {
	neighbors := make([]*Node, 0)

	// North
	if node.row-1 >= 0 && canMove(node, grid[node.row-1][node.col]) {
		neighbors = append(neighbors, grid[node.row-1][node.col])
	}

	// East
	if node.col+1 < len(grid[0]) && canMove(node, grid[node.row][node.col+1]) {
		neighbors = append(neighbors, grid[node.row][node.col+1])
	}

	// South
	if node.row+1 < len(grid) && canMove(node, grid[node.row+1][node.col]) {
		neighbors = append(neighbors, grid[node.row+1][node.col])
	}

	// West
	if node.col-1 >= 0 && canMove(node, grid[node.row][node.col-1]) {
		neighbors = append(neighbors, grid[node.row][node.col-1])
	}

	return neighbors
}

func canMove(from, to *Node) bool {
	return to.elevation-from.elevation < 2
}

func has(queue []*Node, target *Node) bool {
	for _, node := range queue {
		if node.key == target.key {
			return true
		}
	}
	return false
}

// extractMin finds and removes the node with the smallest distance
// from the queue. Look... the queue is an unordered slice. It's basically
// the worst min priority queue implementation the world has ever been cursed with.
// But I don't care. I don't care!!! I'm not going to implement heapsort.
func extractMin(queue []*Node, dist map[string]int) (*Node, []*Node) {
	if len(queue) == 0 {
		return nil, queue
	}

	smallestIdx := 0
	smallest := queue[0]

	for i, node := range queue {
		if dist[node.key] < dist[smallest.key] {
			smallest = node
			smallestIdx = i
		}
	}

	queue[smallestIdx] = queue[len(queue)-1]
	queue[len(queue)-1] = nil
	queue = queue[:len(queue)-1]

	return smallest, queue
}

func buildGrid(input []string, startChar string) ([][]*Node, []*Node) {
	starts := make([]*Node, 0)

	grid := make([][]*Node, len(input))
	for row, line := range input {
		grid[row] = make([]*Node, len(line))
		for col, char := range line {
			node := NewNode(row, col, char)
			grid[row][col] = node
			if node.label == startChar || node.label == "S" {
				starts = append(starts, node)
			}
		}
	}

	return grid, starts
}

type Node struct {
	row       int
	col       int
	elevation rune
	label     string
	key       string
}

func NewNode(row, col int, elevation rune) *Node {
	node := &Node{
		row:       row,
		col:       col,
		elevation: elevation,
		key:       fmt.Sprintf("%d,%d", row, col),
		label:     string(elevation),
	}

	switch elevation {
	case 'S':
		node.elevation = 'a'
	case 'E':
		node.elevation = 'z'
	}

	return node
}
