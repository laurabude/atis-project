from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from gtts import gTTS
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)


@app.route('/convert-text-to-speech', methods=['POST'])
def convert_text_to_speech():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
        return '', 200, headers

    data = request.json
    text = data['text']
    lang = data['language']

    audio_file_path = os.path.join(os.path.dirname(
        __file__), 'assets', 'current-broadcast.mp3')

    if lang == 'en':
        text = text.replace('AEROPARQUE', 'air-oh-park')

    myobj = gTTS(text=text, lang=lang, slow=False)
    myobj.save(audio_file_path)

    sound_file_path = 'assets/current-broadcast.mp3'
    return jsonify({'sound_file_path': sound_file_path})


@app.route('/assets/current-broadcast.mp3')
def serve_audio():
    audio_file_path = os.path.join(os.path.dirname(
        __file__), 'assets', 'current-broadcast.mp3')
    return send_file(audio_file_path)


if __name__ == '__main__':
    app.run(host='localhost', port=5000)
