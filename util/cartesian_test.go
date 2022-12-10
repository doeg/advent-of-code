package util

import "testing"

func TestIsAdjacent(t *testing.T) {
	tests := []struct {
		name     string
		c1       *Coords
		c2       *Coords
		adjacent bool
	}{
		{
			name:     "north",
			c1:       &Coords{X: 0, Y: 0},
			c2:       &Coords{X: 0, Y: 1},
			adjacent: true,
		},
		{
			name:     "northeast",
			c1:       &Coords{X: 0, Y: 0},
			c2:       &Coords{X: 1, Y: 1},
			adjacent: true,
		},
		{
			name:     "east",
			c1:       &Coords{X: 0, Y: 0},
			c2:       &Coords{X: 1, Y: 0},
			adjacent: true,
		},
		{
			name:     "southeast",
			c1:       &Coords{X: 0, Y: 0},
			c2:       &Coords{X: 1, Y: -1},
			adjacent: true,
		},
		{
			name:     "south",
			c1:       &Coords{X: 0, Y: 0},
			c2:       &Coords{X: 0, Y: -1},
			adjacent: true,
		},
		{
			name:     "southwest",
			c1:       &Coords{X: 0, Y: 0},
			c2:       &Coords{X: -1, Y: -1},
			adjacent: true,
		},
		{
			name:     "west",
			c1:       &Coords{X: 0, Y: 0},
			c2:       &Coords{X: -1, Y: 0},
			adjacent: true,
		},
		{
			name:     "northwest",
			c1:       &Coords{X: 0, Y: 0},
			c2:       &Coords{X: -1, Y: 1},
			adjacent: true,
		},
		{
			name:     "overlapping",
			c1:       &Coords{X: 0, Y: 0},
			c2:       &Coords{X: 0, Y: 0},
			adjacent: false,
		},
		{
			name:     "not adjacent",
			c1:       &Coords{X: 0, Y: 0},
			c2:       &Coords{X: 0, Y: 0},
			adjacent: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.c1.IsAdjacent(tt.c2)
			if result != tt.adjacent {
				t.Errorf("expected %t, but got %t", tt.adjacent, result)
			}
		})
	}
}
