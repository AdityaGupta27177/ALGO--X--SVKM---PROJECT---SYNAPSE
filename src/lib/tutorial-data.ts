export interface TutorialStep {
  id: number;
  title: string;
  subtitle: string;
  code: string;
  explanations: Record<number, { code: string; text: string; concept: string }>;
}

export const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Open a window",
    subtitle: "sf::RenderWindow setup",
    code: `#include <SFML/Graphics.hpp>

int main() {
    sf::RenderWindow window(
        sf::VideoMode(800, 600), "Pong"
    );
    window.setFramerateLimit(60);

    while (window.isOpen()) {
        sf::Event event;
        while (window.pollEvent(event))
            if (event.type == sf::Event::Closed)
                window.close();

        window.clear(sf::Color::Black);
        window.display();
    }
    return 0;
}`,
    explanations: {
      1: { code: '#include <SFML/Graphics.hpp>', text: "This imports the SFML Graphics module which gives you access to windows, shapes, text, and the rendering system. Without this, none of the sf:: classes will be available. SFML must be installed and linked in your build system.", concept: "Header files" },
      3: { code: 'int main() {', text: "The entry point of every C++ program. When you run your game, this is the first function that gets called by the operating system.", concept: "Entry point" },
      4: { code: 'sf::RenderWindow window(', text: "Creates a window that can both display content and handle events. RenderWindow inherits from Window and adds drawing capabilities.", concept: "SFML Window" },
      5: { code: 'sf::VideoMode(800, 600), "Pong"', text: "VideoMode sets the window dimensions to 800x600 pixels. The second argument is the window title shown in the title bar.", concept: "Video mode" },
      7: { code: 'window.setFramerateLimit(60);', text: "Caps the game at 60 frames per second. This prevents the game loop from running thousands of times per second and burning CPU.", concept: "Frame limiting" },
      9: { code: 'while (window.isOpen()) {', text: "This is the game loop — it runs every frame until the window is closed. Everything inside this loop happens 60 times per second.", concept: "Game loop" },
      15: { code: 'window.clear(sf::Color::Black);', text: "Clears the entire window to black before drawing the new frame. Without this, previous frames would stack on top of each other.", concept: "Frame clearing" },
      16: { code: 'window.display();', text: "Swaps the back buffer to the screen, showing everything drawn since clear(). This is called double buffering.", concept: "Double buffering" },
    },
  },
  {
    id: 2,
    title: "Draw the paddles",
    subtitle: "sf::RectangleShape",
    code: `const float PADDLE_W = 12, PADDLE_H = 80;

sf::RectangleShape leftPaddle({PADDLE_W, PADDLE_H});
leftPaddle.setFillColor(sf::Color::White);
leftPaddle.setPosition(20, 260);

sf::RectangleShape rightPaddle({PADDLE_W, PADDLE_H});
rightPaddle.setFillColor(sf::Color::White);
rightPaddle.setPosition(768, 260);

// Inside the game loop, after clear():
window.draw(leftPaddle);
window.draw(rightPaddle);`,
    explanations: {
      1: { code: 'const float PADDLE_W = 12, PADDLE_H = 80;', text: "Defines paddle dimensions as constants. Using const ensures these values can't be accidentally changed at runtime.", concept: "Constants" },
      3: { code: 'sf::RectangleShape leftPaddle({PADDLE_W, PADDLE_H});', text: "Creates a rectangle shape with the given width and height. SFML shapes are drawable objects you can move, scale, and color.", concept: "SFML Shapes" },
      4: { code: 'leftPaddle.setFillColor(sf::Color::White);', text: "Sets the paddle's fill color to white so it's visible against the black background.", concept: "Fill color" },
      5: { code: 'leftPaddle.setPosition(20, 260);', text: "Places the paddle 20 pixels from the left edge, roughly centered vertically (600/2 - 80/2 = 260).", concept: "Positioning" },
      12: { code: 'window.draw(leftPaddle);', text: "Draws the paddle to the back buffer. This must happen between clear() and display() calls.", concept: "Drawing" },
    },
  },
  {
    id: 3,
    title: "Move with input",
    subtitle: "Keyboard::isKeyPressed + delta time",
    code: `sf::Clock clock;
const float SPEED = 400.f;

// Inside the game loop:
float dt = clock.restart().asSeconds();

if (sf::Keyboard::isKeyPressed(sf::Keyboard::W))
    leftPaddle.move(0, -SPEED * dt);
if (sf::Keyboard::isKeyPressed(sf::Keyboard::S))
    leftPaddle.move(0, SPEED * dt);
if (sf::Keyboard::isKeyPressed(sf::Keyboard::Up))
    rightPaddle.move(0, -SPEED * dt);
if (sf::Keyboard::isKeyPressed(sf::Keyboard::Down))
    rightPaddle.move(0, SPEED * dt);`,
    explanations: {
      1: { code: 'sf::Clock clock;', text: "Creates a high-resolution clock that measures elapsed time between frames. Essential for frame-rate independent movement.", concept: "sf::Clock" },
      5: { code: 'float dt = clock.restart().asSeconds();', text: "Gets the time since the last frame in seconds and restarts the clock. 'dt' (delta time) makes movement speed consistent regardless of frame rate.", concept: "Delta time" },
      7: { code: 'if (sf::Keyboard::isKeyPressed(sf::Keyboard::W))', text: "Checks if the W key is currently held down. Unlike events, this detects continuous input — perfect for smooth movement.", concept: "Real-time input" },
      8: { code: 'leftPaddle.move(0, -SPEED * dt);', text: "Moves the paddle up by SPEED * dt pixels. Multiplying by dt ensures the paddle moves the same distance per second regardless of frame rate.", concept: "Frame-independent movement" },
    },
  },
  {
    id: 4,
    title: "Add the ball",
    subtitle: "sf::CircleShape + velocity",
    code: `sf::CircleShape ball(8.f);
ball.setFillColor(sf::Color::White);
ball.setPosition(396, 296);

sf::Vector2f ballVel(300.f, 250.f);

// Inside the game loop:
ball.move(ballVel * dt);

if (ball.getPosition().y <= 0 ||
    ball.getPosition().y >= 584)
    ballVel.y = -ballVel.y;

window.draw(ball);`,
    explanations: {
      1: { code: 'sf::CircleShape ball(8.f);', text: "Creates a circle with radius 8 pixels. The 'f' suffix makes it a float literal, matching SFML's expected parameter type.", concept: "Circle shape" },
      5: { code: 'sf::Vector2f ballVel(300.f, 250.f);', text: "A 2D vector storing the ball's velocity in pixels per second. The x component controls horizontal speed, y controls vertical.", concept: "Velocity vector" },
      8: { code: 'ball.move(ballVel * dt);', text: "Moves the ball by velocity × delta time each frame. This creates smooth, consistent movement regardless of frame rate.", concept: "Velocity movement" },
      10: { code: 'if (ball.getPosition().y <= 0 ||', text: "Checks if the ball has hit the top or bottom wall. If so, we reverse the y-velocity to make it bounce.", concept: "Wall collision" },
    },
  },
  {
    id: 5,
    title: "Collision detection",
    subtitle: "getGlobalBounds().intersects()",
    code: `sf::FloatRect ballBounds = ball.getGlobalBounds();

if (ballBounds.intersects(leftPaddle.getGlobalBounds())) {
    ballVel.x = std::abs(ballVel.x);
    ballVel.y += (ball.getPosition().y
        - leftPaddle.getPosition().y - 40) * 3.f;
}

if (ballBounds.intersects(rightPaddle.getGlobalBounds())) {
    ballVel.x = -std::abs(ballVel.x);
    ballVel.y += (ball.getPosition().y
        - rightPaddle.getPosition().y - 40) * 3.f;
}`,
    explanations: {
      1: { code: 'sf::FloatRect ballBounds = ball.getGlobalBounds();', text: "Gets the axis-aligned bounding box (AABB) of the ball. This rectangle is used for fast overlap detection with other shapes.", concept: "Bounding box" },
      3: { code: 'if (ballBounds.intersects(leftPaddle.getGlobalBounds())) {', text: "AABB collision check — returns true if the two rectangles overlap. This is the simplest and fastest collision detection method.", concept: "AABB collision" },
      4: { code: 'ballVel.x = std::abs(ballVel.x);', text: "Forces x-velocity positive so the ball always moves right after hitting the left paddle, preventing it from getting stuck inside.", concept: "Collision response" },
      5: { code: 'ballVel.y += (ball.getPosition().y', text: "Adds spin based on where the ball hits the paddle. Hitting near the edge creates a steeper angle, making gameplay more dynamic.", concept: "Angle variation" },
    },
  },
  {
    id: 6,
    title: "Score & reset",
    subtitle: "sf::Text + game state",
    code: `sf::Font font;
font.loadFromFile("arial.ttf");

sf::Text scoreText;
scoreText.setFont(font);
scoreText.setCharacterSize(36);
scoreText.setPosition(360, 20);

int leftScore = 0, rightScore = 0;

auto resetBall = [&]() {
    ball.setPosition(396, 296);
    ballVel = {300.f, 200.f};
};

if (ball.getPosition().x < 0)  { rightScore++; resetBall(); }
if (ball.getPosition().x > 800) { leftScore++;  resetBall(); }

scoreText.setString(
    std::to_string(leftScore) + "  " +
    std::to_string(rightScore));
window.draw(scoreText);`,
    explanations: {
      1: { code: 'sf::Font font;', text: "Creates a font object. SFML needs a font loaded from file before it can render any text on screen.", concept: "Font loading" },
      4: { code: 'sf::Text scoreText;', text: "Creates a text drawable. You set its font, size, position, and string content, then draw it like any other shape.", concept: "sf::Text" },
      11: { code: 'auto resetBall = [&]() {', text: "A lambda (anonymous function) that captures all variables by reference. It resets the ball to center with default velocity after a point is scored.", concept: "Lambda functions" },
      16: { code: 'if (ball.getPosition().x < 0)  { rightScore++; resetBall(); }', text: "If the ball goes past the left edge, the right player scores. The ball is then reset to center for the next round.", concept: "Score tracking" },
    },
  },
];
