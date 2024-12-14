# AutoSnap

An intelligent software tool for recording video lectures and automatically capturing important content displayed on boards.

## Features

- Automatic detection of board content
- High-quality screenshots taken at the right moments
- User-friendly interface for organizing and managing screenshots
- Real-time navigation through video and screenshots
- Customizable settings for screenshot preferences

## Installation

1. Clone this repository
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Project Structure

```
autosnap/
├── app/
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   ├── templates/
│   │   ├── base.html
│   │   ├── home.html
│   │   ├── capture_settings.html
│   │   ├── screenshot_manager.html
│   │   └── help.html
│   └── __init__.py
├── config.py
├── run.py
├── requirements.txt
└── README.md
```

## Usage

1. Activate your virtual environment
2. Run the application:
   ```
   python run.py
   ```
3. Open your browser and navigate to `http://localhost:5000`

## Development Status

- [x] Project structure setup
- [x] Basic UI implementation
- [ ] Screenshot capture functionality
- [ ] Image processing and board detection
- [ ] Gallery management system
