import os
from flask import Flask, request, jsonify, render_template
from scraper import get_versions, download_snapshot, compare_snapshots
from analyzer import analyze_snapshot
import subprocess
import json

app = Flask(__name__, template_folder="../templates", static_folder="../static")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/get_versions', methods=['POST'])
def api_get_versions():
    data = request.get_json()
    url = data.get('url')
    return jsonify(get_versions(url))

@app.route('/api/compare', methods=['POST'])
def api_compare():
    data = request.get_json()
    return jsonify(compare_snapshots(data['url'], data['ts1'], data['ts2']))

@app.route('/api/analyze_snapshot', methods=['POST'])
def api_analyze_snapshot():
    data = request.get_json()
    return jsonify(analyze_snapshot(data['url'], data['timestamp']))

@app.route('/api/analyze_media', methods=['POST'])
def api_analyze_media():
    data = request.get_json()
    filename = data.get('filename')
    path = os.path.join('media', filename)
    try:
        result = subprocess.run(['ffprobe', '-v', 'error', '-show_format', '-show_streams', '-print_format', 'json', path],
                                capture_output=True, text=True)
        return jsonify(json.loads(result.stdout))
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
