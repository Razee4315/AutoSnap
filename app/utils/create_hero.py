from PIL import Image, ImageDraw
import os

def create_hero_illustration():
    # Create a new image with a transparent background
    width = 800
    height = 600
    image = Image.new('RGBA', (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)
    
    # Draw a stylized laptop
    laptop_body = [
        (200, 300), (600, 300),  # Top edge
        (650, 450), (150, 450),  # Bottom edge
    ]
    draw.polygon(laptop_body, fill=(99, 102, 241, 255))  # Primary color
    
    # Draw laptop screen
    screen = [
        (220, 320), (580, 320),  # Top edge
        (580, 430), (220, 430),  # Bottom edge
    ]
    draw.polygon(screen, fill=(255, 255, 255, 255))
    
    # Draw some "content" on the screen
    for i in range(4):
        y = 340 + i * 20
        draw.rectangle((240, y, 560, y + 10), fill=(230, 230, 230, 255))
    
    # Draw floating elements around the laptop
    icons = [
        (150, 200, "📝"), (650, 200, "📚"),
        (300, 150, "🎥"), (500, 150, "📊"),
        (200, 450, "💡"), (600, 450, "✨")
    ]
    
    # Save the illustration
    static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'images')
    os.makedirs(static_dir, exist_ok=True)
    hero_path = os.path.join(static_dir, 'hero-illustration.png')
    image.save(hero_path, 'PNG')

if __name__ == '__main__':
    create_hero_illustration()
