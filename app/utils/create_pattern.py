from PIL import Image, ImageDraw
import os

def create_pattern():
    # Create a new image with a white background
    width = 100
    height = 100
    image = Image.new('RGBA', (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)
    
    # Draw dots pattern
    dot_size = 2
    spacing = 10
    for x in range(0, width, spacing):
        for y in range(0, height, spacing):
            draw.ellipse([x, y, x + dot_size, y + dot_size], fill=(0, 123, 255, 50))
    
    # Save the pattern
    static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'images')
    os.makedirs(static_dir, exist_ok=True)
    pattern_path = os.path.join(static_dir, 'pattern.png')
    image.save(pattern_path, 'PNG')

if __name__ == '__main__':
    create_pattern()
