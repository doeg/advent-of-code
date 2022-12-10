package util

func IsAdjacent(a, b []int) bool {
	isO := a[0] == b[0] && a[1] == b[1]
	isN := a[0] == b[0]-1 && a[1] == b[1]
	isNE := a[0] == b[0]-1 && a[1] == b[1]+1
	isE := a[0] == b[0] && a[1] == b[1]+1
	isSE := a[0] == b[0]+1 && a[1] == b[1]+1
	isS := a[0] == b[0]+1 && a[1] == b[1]
	isSW := a[0] == b[0]+1 && a[1] == b[1]-1
	isW := a[0] == b[0] && a[1] == b[1]-1
	isNW := a[0] == b[0]-1 && a[1] == b[1]-1

	return isO || isN || isNE || isE || isSE || isS || isSW || isW || isNW
}
