class Player:
    def __init__(self, x, y, direction):
        self.x = x
        self.y = y
        # self.tombstone = False
        self.dx, self.dy = direction

    def update(self):
        self.x += self.dx
        self.y += self.dy
