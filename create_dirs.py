import os

dirs = [
    'app',
    'app/static',
    'app/static/css',
    'app/static/js',
    'app/static/images',
    'app/templates'
]

for dir in dirs:
    os.makedirs(dir, exist_ok=True)
