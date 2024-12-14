from flask import render_template, redirect, url_for, flash, request, jsonify
from app import app
import os
import json
from werkzeug.utils import secure_filename
from pytube import YouTube
import cv2
import numpy as np
from PIL import Image
from fpdf import FPDF
import tempfile
from datetime import datetime

UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'uploads')
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.context_processor
def inject_now():
    return {'now': datetime.utcnow()}

@app.route('/')
def home():
    return render_template('home.html', title='Home')

@app.route('/view-notes')
def view_notes():
    return render_template('view_notes.html', title='My Notes')

@app.route('/help')
def help():
    return render_template('help.html', title='Help & About')

@app.route('/processing')
def processing():
    return render_template('processing.html', title='Processing')

# API Routes
@app.route('/api/upload-video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'success': False, 'error': 'No video file provided'})
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'})
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        # Start processing in background (in a real app, use Celery or similar)
        process_video(filepath)
        return jsonify({'success': True, 'redirect': url_for('processing')})
    
    return jsonify({'success': False, 'error': 'Invalid file type'})

@app.route('/api/process-youtube', methods=['POST'])
def process_youtube():
    url = request.json.get('url')
    if not url:
        return jsonify({'success': False, 'error': 'No URL provided'})
    
    try:
        # Download YouTube video
        yt = YouTube(url)
        video = yt.streams.filter(progressive=True, file_extension='mp4').first()
        filepath = os.path.join(UPLOAD_FOLDER, f"{secure_filename(yt.title)}.mp4")
        video.download(output_path=UPLOAD_FOLDER, filename=filepath)
        
        # Start processing in background
        process_video(filepath)
        return jsonify({'success': True, 'redirect': url_for('processing')})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

def process_video(video_path):
    """Process the video and extract whiteboard content"""
    try:
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # Process every nth frame
        frame_interval = int(fps * 2)  # Process every 2 seconds
        current_frame = 0
        screenshots = []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            if current_frame % frame_interval == 0:
                # Detect whiteboard (simplified version)
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
                contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                
                # Find the largest contour (assumed to be the whiteboard)
                if contours:
                    largest_contour = max(contours, key=cv2.contourArea)
                    x, y, w, h = cv2.boundingRect(largest_contour)
                    if w * h > frame.shape[0] * frame.shape[1] * 0.3:  # Min 30% of frame
                        whiteboard = frame[y:y+h, x:x+w]
                        screenshots.append(whiteboard)

            current_frame += 1

        cap.release()

        # Generate PDF
        if screenshots:
            generate_pdf(screenshots, video_path)

    except Exception as e:
        print(f"Error processing video: {str(e)}")

def generate_pdf(screenshots, video_path):
    """Generate PDF from screenshots"""
    pdf = FPDF()
    temp_dir = tempfile.mkdtemp()

    try:
        for i, screenshot in enumerate(screenshots):
            img_path = os.path.join(temp_dir, f'screenshot_{i}.jpg')
            cv2.imwrite(img_path, screenshot)
            
            # Add page to PDF
            pdf.add_page()
            pdf.image(img_path, x=10, y=10, w=190)

        # Save PDF
        pdf_filename = os.path.splitext(os.path.basename(video_path))[0] + '_notes.pdf'
        pdf_path = os.path.join(UPLOAD_FOLDER, pdf_filename)
        pdf.output(pdf_path)

    finally:
        # Cleanup temporary files
        for file in os.listdir(temp_dir):
            os.remove(os.path.join(temp_dir, file))
        os.rmdir(temp_dir)

@app.route('/api/notes')
def get_notes():
    notes = []
    for file in os.listdir(UPLOAD_FOLDER):
        if file.endswith('_notes.pdf'):
            notes.append({
                'id': file.replace('_notes.pdf', ''),
                'name': file.replace('_notes.pdf', '').replace('_', ' ').title(),
                'url': url_for('static', filename=f'uploads/{file}'),
                'date': os.path.getctime(os.path.join(UPLOAD_FOLDER, file))
            })
    return jsonify({'success': True, 'notes': sorted(notes, key=lambda x: x['date'], reverse=True)})

@app.route('/api/notes/<note_id>', methods=['DELETE'])
def delete_note(note_id):
    try:
        pdf_path = os.path.join(UPLOAD_FOLDER, f'{note_id}_notes.pdf')
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
            return jsonify({'success': True})
        return jsonify({'success': False, 'error': 'Note not found'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/capture-settings')
def capture_settings():
    return render_template('capture_settings.html', title='Capture Settings')

@app.route('/screenshot-manager')
def screenshot_manager():
    return render_template('screenshot_manager.html', title='Screenshot Manager')

@app.route('/api/save-settings', methods=['POST'])
def save_settings():
    settings = request.json
    try:
        # In a real implementation, save to database or config file
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/start-capture', methods=['POST'])
def start_capture():
    try:
        # In a real implementation, start the capture process
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/screenshots')
def get_screenshots():
    try:
        # Mock data for demonstration
        screenshots = [
            {
                'id': 1,
                'name': 'Screenshot_001',
                'url': url_for('static', filename='images/placeholder.jpg'),
                'timestamp': '2024-12-13T10:30:00'
            }
        ]
        return jsonify({
            'success': True,
            'screenshots': screenshots,
            'totalPages': 1
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/screenshots/bulk-delete', methods=['POST'])
def bulk_delete_screenshots():
    try:
        ids = request.json.get('ids', [])
        # In a real implementation, delete the screenshots
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})
