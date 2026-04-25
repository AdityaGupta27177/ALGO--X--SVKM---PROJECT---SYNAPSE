export interface TutorialStep {
  id: number;
  title: string;
  subtitle: string;
  code: string;
  explanations: Record<number, { code: string; text: string; concept: string }>;
}

export const snakeTutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Set up the grid",
    subtitle: "Window + tile system",
    code: `#include <SFML/Graphics.hpp>
#include <deque>
#include <cstdlib>

const int TILE = 20;
const int COLS = 30, ROWS = 20;
const int W = COLS * TILE, H = ROWS * TILE;

int main() {
    sf::RenderWindow window(
        sf::VideoMode(W, H), "Snake"
    );
    window.setFramerateLimit(10);

    while (window.isOpen()) {
        sf::Event event;
        while (window.pollEvent(event))
            if (event.type == sf::Event::Closed)
                window.close();

        window.clear(sf::Color(30, 30, 30));
        window.display();
    }
    return 0;
}`,
    explanations: {
      5: { code: 'const int TILE = 20;', text: "Defines the size of each grid tile in pixels. The snake and food will snap to this grid, making movement discrete rather than smooth.", concept: "Grid-based movement" },
      6: { code: 'const int COLS = 30, ROWS = 20;', text: "The game grid is 30 columns × 20 rows. This gives us a playing field of 600×400 pixels.", concept: "Grid dimensions" },
      13: { code: 'window.setFramerateLimit(10);', text: "Unlike Pong's 60 FPS, Snake uses a low frame rate (10) as a simple way to control game speed. Each frame, the snake moves one tile.", concept: "Game speed" },
      21: { code: 'window.clear(sf::Color(30, 30, 30));', text: "Clears to a dark gray instead of pure black, giving a subtle background color.", concept: "Background color" },
    },
  },
  {
    id: 2,
    title: "Create the snake",
    subtitle: "std::deque for the body",
    code: `struct Segment { int x, y; };

std::deque<Segment> snake;
snake.push_back({COLS / 2, ROWS / 2});
snake.push_back({COLS / 2 - 1, ROWS / 2});
snake.push_back({COLS / 2 - 2, ROWS / 2});

int dirX = 1, dirY = 0;

// Drawing the snake (inside game loop):
sf::RectangleShape tile({TILE - 1.f, TILE - 1.f});
for (auto& seg : snake) {
    tile.setPosition(seg.x * TILE + 0.5f,
                     seg.y * TILE + 0.5f);
    tile.setFillColor(sf::Color::Green);
    window.draw(tile);
}`,
    explanations: {
      1: { code: 'struct Segment { int x, y; };', text: "A simple struct holding grid coordinates. Each segment of the snake body is one Segment with an x,y position on the grid.", concept: "Structs" },
      3: { code: 'std::deque<Segment> snake;', text: "A deque (double-ended queue) is perfect for a snake: we add to the front (head) and remove from the back (tail) efficiently.", concept: "std::deque" },
      8: { code: 'int dirX = 1, dirY = 0;', text: "Direction vector: (1,0) means moving right. We'll change this based on keyboard input.", concept: "Direction vector" },
      11: { code: 'sf::RectangleShape tile({TILE - 1.f, TILE - 1.f});', text: "Each tile is 1px smaller than the grid cell, creating a subtle gap between segments for visual clarity.", concept: "Visual gap" },
    },
  },
  {
    id: 3,
    title: "Handle input",
    subtitle: "Direction changes",
    code: `// Inside the event loop:
if (event.type == sf::Event::KeyPressed) {
    if (event.key.code == sf::Keyboard::Up
        && dirY != 1)
        { dirX = 0; dirY = -1; }
    if (event.key.code == sf::Keyboard::Down
        && dirY != -1)
        { dirX = 0; dirY = 1; }
    if (event.key.code == sf::Keyboard::Left
        && dirX != 1)
        { dirX = -1; dirY = 0; }
    if (event.key.code == sf::Keyboard::Right
        && dirX != -1)
        { dirX = 1; dirY = 0; }
}`,
    explanations: {
      2: { code: 'if (event.type == sf::Event::KeyPressed) {', text: "Unlike Pong where we used real-time input, Snake uses event-based input. One keypress = one direction change, processed once.", concept: "Event-based input" },
      4: { code: '&& dirY != 1)', text: "Prevents the snake from reversing into itself. If moving down (dirY=1), pressing Up is ignored.", concept: "Reverse prevention" },
      5: { code: '{ dirX = 0; dirY = -1; }', text: "Sets direction to up: no horizontal movement (0), moving up (-1) on the y-axis.", concept: "Direction change" },
    },
  },
  {
    id: 4,
    title: "Move & grow",
    subtitle: "Head insertion + tail removal",
    code: `// Spawn food at random position
Segment food = {
    rand() % COLS, rand() % ROWS
};

// Each frame — move the snake:
Segment newHead = {
    snake.front().x + dirX,
    snake.front().y + dirY
};
snake.push_front(newHead);

// Check if food eaten:
if (newHead.x == food.x && newHead.y == food.y) {
    food = { rand() % COLS, rand() % ROWS };
    // Don't remove tail → snake grows
} else {
    snake.pop_back(); // Remove tail
}

// Draw food:
tile.setPosition(food.x * TILE + 0.5f,
                 food.y * TILE + 0.5f);
tile.setFillColor(sf::Color::Red);
window.draw(tile);`,
    explanations: {
      2: { code: 'Segment food = {', text: "Food is a single grid cell placed at a random position. When eaten, a new food spawns.", concept: "Food spawning" },
      7: { code: 'Segment newHead = {', text: "Creates the next head position by adding the direction to the current head. This is how the snake 'moves' forward.", concept: "Head movement" },
      11: { code: 'snake.push_front(newHead);', text: "Adds the new head to the front of the deque. Combined with pop_back, this creates the illusion of movement.", concept: "Deque operations" },
      14: { code: 'if (newHead.x == food.x && newHead.y == food.y) {', text: "Simple grid-based collision: if head occupies the same cell as food, the snake eats it.", concept: "Grid collision" },
      18: { code: 'snake.pop_back();', text: "Removes the tail segment. If food was eaten, we skip this — so the snake grows by one segment.", concept: "Growth mechanic" },
    },
  },
  {
    id: 5,
    title: "Game over",
    subtitle: "Wall & self collision",
    code: `// After moving the head:
bool gameOver = false;

// Wall collision
if (newHead.x < 0 || newHead.x >= COLS ||
    newHead.y < 0 || newHead.y >= ROWS)
    gameOver = true;

// Self collision
for (size_t i = 1; i < snake.size(); i++) {
    if (snake[i].x == newHead.x &&
        snake[i].y == newHead.y)
        gameOver = true;
}

if (gameOver) {
    // Reset snake
    snake.clear();
    snake.push_back({COLS/2, ROWS/2});
    snake.push_back({COLS/2-1, ROWS/2});
    snake.push_back({COLS/2-2, ROWS/2});
    dirX = 1; dirY = 0;
    food = { rand() % COLS, rand() % ROWS };
}`,
    explanations: {
      5: { code: 'if (newHead.x < 0 || newHead.x >= COLS ||', text: "Checks if the head has gone outside the grid boundaries. Unlike Pong's ball bounce, hitting a wall in Snake ends the game.", concept: "Boundary check" },
      10: { code: 'for (size_t i = 1; i < snake.size(); i++) {', text: "Checks every body segment (starting at 1 to skip the head itself) to see if the head overlaps with any part of the body.", concept: "Self-collision" },
      17: { code: 'snake.clear();', text: "Resets the entire snake by clearing the deque and rebuilding the initial 3-segment body.", concept: "Game reset" },
    },
  },
  {
    id: 6,
    title: "Score display",
    subtitle: "sf::Text + snake length",
    code: `sf::Font font;
font.loadFromFile("arial.ttf");

sf::Text scoreText;
scoreText.setFont(font);
scoreText.setCharacterSize(18);
scoreText.setFillColor(sf::Color::White);
scoreText.setPosition(10, 5);

int score = 0;

// When food is eaten:
score += 10;

// Update score text each frame:
scoreText.setString("Score: " +
    std::to_string(score));
window.draw(scoreText);`,
    explanations: {
      1: { code: 'sf::Font font;', text: "Loads a font for rendering score text. Same pattern as Pong — SFML requires an explicit font file.", concept: "Font loading" },
      10: { code: 'int score = 0;', text: "Track the score as a simple integer. Each food eaten adds 10 points.", concept: "Score tracking" },
      13: { code: 'score += 10;', text: "Increment score when food is eaten. You could scale points based on snake length for increasing difficulty.", concept: "Scoring" },
    },
  },
];
