package main

import (
	"encoding/json"
	"fmt"
	"sort"
	"strconv"
	"strings"

	"github.com/doeg/advent-of-code/util"
)

type ElfDir struct {
	parent *ElfDir
	name   string
	dirs   map[string]*ElfDir
	files  map[string]*ElfFile
	size   int
	path   string
}

type ElfFile struct {
	name   string
	parent *ElfDir
	size   int
}

func main() {
	input := util.ReadInput()

	fileTree := BuildFileTree(input)
	// PrintFileTree(fileTree, 0)

	// Get the cumulative sum of every folder
	// TODO it'd be nice to use a sync.Map, though it doesn't _really_ matter
	// since each path is guaranteed to be unique
	folderSizes := make(map[string]int)
	SumFolderSize(fileTree, folderSizes)
	// PrintFolderSizes(folderSizes)

	partOne(folderSizes)
	partTwo(folderSizes)
}

func partOne(folderSizes map[string]int) {
	threshold := 100000
	acc := 0
	for _, size := range folderSizes {
		if size <= threshold {
			acc += size
		}
	}
	fmt.Println(acc)
}

func partTwo(folderSizes map[string]int) {
	type KV struct {
		Key   string
		Value int
	}

	var ss []KV
	for k, v := range folderSizes {
		ss = append(ss, KV{k, v})
	}

	sort.Slice(ss, func(i, j int) bool {
		return ss[i].Value < ss[j].Value
	})

	fileSystemSize := 70000000
	updateSize := 30000000
	unusedSpace := fileSystemSize - folderSizes["/"]
	threshold := updateSize - unusedSpace

	for _, kv := range ss {
		if kv.Value < threshold {
			continue
		}

		fmt.Println(kv.Value)
		break
	}
}

func BuildFileTree(input []string) *ElfDir {
	var fileTree *ElfDir
	var currentDirectory *ElfDir

	for _, line := range input {
		switch {
		// Special case for the root directory; this could just as easily
		// be rolled into the generic "cd" case but whatever.
		case line == "$ cd /":
			rootDir := ElfDir{
				name:  "/",
				dirs:  make(map[string]*ElfDir),
				files: make(map[string]*ElfFile),
				path:  "/",
			}
			currentDirectory = &rootDir
			fileTree = &rootDir

		// Again, could probably roll into a generic "cd" handler but, again, whatever
		case line == "$ cd ..":
			currentDirectory = currentDirectory.parent

		case strings.HasPrefix(line, "$ cd"):
			dirname := strings.Split(line, " ")[2]
			ptr, ok := currentDirectory.dirs[dirname]
			if !ok {
				panic(fmt.Sprintf("Tried to switch to directory %s that does not exist in current directory's files %v", dirname, currentDirectory.dirs))
			}
			currentDirectory = ptr

		case line == "$ ls":
			// no-op (for now)

		case strings.HasPrefix(line, "dir"):
			dirname := strings.Split(line, " ")[1]
			dir := ElfDir{
				name:   dirname,
				parent: currentDirectory,
				dirs:   make(map[string]*ElfDir),
				files:  make(map[string]*ElfFile),
				path:   currentDirectory.path + dirname + "/",
			}
			currentDirectory.dirs[dirname] = &dir

			// Add file to directory
		default:
			fp := strings.Split(line, " ")
			name := fp[1]
			size, _ := strconv.Atoi(fp[0])
			file := ElfFile{
				name:   name,
				parent: currentDirectory,
				size:   size,
			}
			currentDirectory.files[name] = &file
			currentDirectory.size += file.size
		}
	}
	return fileTree
}

func SumFolderSize(dir *ElfDir, sizes map[string]int) int {
	sum := dir.size
	for _, child := range dir.dirs {
		sum += SumFolderSize(child, sizes)
	}
	sizes[dir.path] = sum
	return sum
}

func PrintFolderSizes(folderSizes map[string]int) {
	b, err := json.MarshalIndent(folderSizes, "", " ")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(b))
}

func PrintFileTree(dir *ElfDir, level int) {
	if level == 0 {
		fmt.Printf("- %s (dir)\n", dir.name)
	}

	tabs := ""
	for i := 0; i < level; i++ {
		tabs += "\t"
	}

	for _, d := range dir.dirs {
		fmt.Printf("%s - %s (dir, size=%d)\n", tabs, d.path, d.size)
		PrintFileTree(d, level+1)
	}

	for _, f := range dir.files {
		fmt.Printf("%s - %s (file, size=%d)\n", tabs, f.name, f.size)
	}
}
