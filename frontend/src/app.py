from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from gtts import gTTS
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)

language = 'en'


@app.route('/convert-text-to-speech', methods=['POST'])
def convert_text_to_speech():
    if request.method == 'OPTIONS':
        # Handle CORS preflight request
        headers = {
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
        return '', 200, headers

    # Assuming the text and language are sent as JSON in the request body
    data = request.json
    text = data['text']
    lang = data['language']

    # Set the file path for saving the audio file relative to the app.py script
    audio_file_path = os.path.join(os.path.dirname(
        __file__), 'assets', 'current-broadcast.mp3')

    # Generate and save the audio file
    myobj = gTTS(text=text, lang=lang, slow=False)
    myobj.save(audio_file_path)

    # Return the file path of the generated sound file
    sound_file_path = 'assets/current-broadcast.mp3'
    return jsonify({'sound_file_path': sound_file_path})


@app.route('/assets/current-broadcast.mp3')
def serve_audio():
    audio_file_path = os.path.join(os.path.dirname(
        __file__), 'assets', 'current-broadcast.mp3')
    return send_file(audio_file_path)


if __name__ == '__main__':
    app.run(host='localhost', port=5000)
