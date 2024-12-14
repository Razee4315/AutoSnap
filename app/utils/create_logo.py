from PIL import Image, ImageDraw, ImageFont
import os

def create_logo():
    # Create a new image with a transparent background
    size = (200, 200)
    logo = Image.new('RGBA', size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(logo)

    # Draw a camera shape
    camera_body = [
        (50, 80),   # Top-left
        (150, 80),  # Top-right
        (150, 140), # Bottom-right
        (50, 140)   # Bottom-left
    ]
    draw.polygon(camera_body, fill=(0, 123, 255, 255))  # Blue color

    # Draw camera lens
    center = (100, 110)
    draw.ellipse([center[0]-20, center[1]-20, center[0]+20, center[1]+20], 
                 fill=(255, 255, 255, 255))
    draw.ellipse([center[0]-15, center[1]-15, center[0]+15, center[1]+15], 
                 fill=(0, 123, 255, 255))

    # Draw flash
    flash = [
        (130, 70),  # Top
        (140, 80),  # Right
        (130, 90),  # Bottom
        (120, 80)   # Left
    ]
    draw.polygon(flash, fill=(255, 193, 7, 255))  # Yellow color

    # Save the logo
    static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'images')
    os.makedirs(static_dir, exist_ok=True)
    logo.save(os.path.join(static_dir, 'logo.png'))
    
    # Create a favicon version
    favicon = logo.resize((32, 32), Image.Resampling.LANCZOS)
    favicon.save(os.path.join(static_dir, 'favicon.ico'))

if __name__ == '__main__':
    create_logo()
