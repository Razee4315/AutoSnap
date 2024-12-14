from PIL import Image, ImageDraw, ImageFont
import os

def create_logo():
    # Create a new image with a transparent background
    width = 500
    height = 500
    image = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    # Define colors
    primary_color = (64, 123, 255)  # Modern blue
    accent_color = (255, 87, 87)    # Coral red

    # Draw a camera icon stylized shape
    # Main body
    draw.rounded_rectangle([(100, 150), (400, 350)], radius=40, fill=primary_color)
    
    # Lens
    draw.ellipse([(200, 200), (300, 300)], fill=accent_color)
    draw.ellipse([(220, 220), (280, 280)], fill=primary_color)
    
    # Flash
    draw.rounded_rectangle([(150, 130), (220, 150)], radius=10, fill=primary_color)

    # Save the logo
    logo_path = os.path.join(os.path.dirname(__file__), 'logo.png')
    image.save(logo_path)
    
    # Create a smaller version for favicon
    favicon = image.resize((32, 32), Image.Resampling.LANCZOS)
    favicon_path = os.path.join(os.path.dirname(__file__), 'favicon.ico')
    favicon.save(favicon_path, format='ICO')

if __name__ == '__main__':
    create_logo()
