package util

import "testing"

func TestIsAdjacent(t *testing.T) {
	tests := []struct {
		name     string
		hp       []int
		tp       []int
		adjacent bool
	}{
		{
			name:     "overlapping",
			hp:       []int{1, 1},
			tp:       []int{1, 1},
			adjacent: true,
		},
		{
			name:     "north",
			hp:       []int{1, 1},
			tp:       []int{0, 1},
			adjacent: true,
		},
		{
			name:     "north-east",
			hp:       []int{1, 1},
			tp:       []int{0, 2},
			adjacent: true,
		},
		{
			name:     "east",
			hp:       []int{1, 1},
			tp:       []int{1, 2},
			adjacent: true,
		},
		{
			name:     "south-east",
			hp:       []int{1, 1},
			tp:       []int{2, 2},
			adjacent: true,
		},
		{
			name:     "south",
			hp:       []int{1, 1},
			tp:       []int{2, 1},
			adjacent: true,
		},
		{
			name:     "south-west",
			hp:       []int{1, 1},
			tp:       []int{2, 0},
			adjacent: true,
		},
		{
			name:     "west",
			hp:       []int{1, 1},
			tp:       []int{1, 0},
			adjacent: true,
		},
		{
			name:     "north-west",
			hp:       []int{1, 1},
			tp:       []int{0, 0},
			adjacent: true,
		},
		{
			name:     "not adjacent",
			hp:       []int{0, 0},
			tp:       []int{2, 2},
			adjacent: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := IsAdjacent(tt.hp, tt.tp)
			if result != tt.adjacent {
				t.Errorf("expected %t, but got %t", tt.adjacent, result)
			}
		})
	}
}
