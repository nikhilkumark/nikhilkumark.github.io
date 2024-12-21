# app
from flask import Flask, jsonify, abort, render_template, request, abort, Response
# import os
import pandas as pd
from io import BytesIO
import io
import gzip
import requests
import boto3
from botocore import UNSIGNED
from botocore.client import Config
import zipfile
# from threading import Thread
from config import ConfigVariables
from datasets_info import datasets

app = Flask(__name__)
app.config.from_object(ConfigVariables)

bucket_name = app.config['S3_BUCKET']
prefix_s3 = app.config['S3_PREFIX']

# Global dictionary to track progress
progress = {}

@app.route('/')
def index():
    base_url = request.url_root
    print(f"Base URL: {base_url}")
    return render_template('index.html', base_url=base_url)

@app.route('/api/base-url')
def api_base_url():
    base_url = request.url_root
    return jsonify(base_url=base_url)

#### Webpages ####
@app.route('/intervention-dataset')
def intervention_dataset():
    return render_template('intervention_dataset.html')

@app.route('/multimodal-dataset')
def multimodal_dataset():
    return render_template('multimodal_dataset.html')

@app.route('/download_page')
def download_page():
    return render_template('download_page.html')

@app.route('/about-page')
def about_page():
    return render_template('about_page.html')

@app.route('/tutorials-page')
def tutorials_page():
    return render_template('tutorials_page.html')

@app.route('/experiments-page')
def experiments_page():
    return render_template('experiments_page.html')

@app.route('/questionnaires-page')
def questionnaires_page():
    return render_template('questionnaires_page.html')

@app.route('/research-page')
def research_page():
    return render_template('research_page.html')

@app.route('/multistyle-dataset')
def multistyle_dataset():
    return render_template('multistyle_dataset.html')

@app.route('/eyetracking-dataset')
def eyetracking_dataset():
    return render_template('eyetracking_dataset.html')

@app.route('/table')
def table():
    return render_template('table.html')

@app.route('/homepage_table')
def homepage_table():
    return render_template('homepage_table.html')

##### Backend Data Fetching ####
@app.route('/datasets', methods=['GET'])
def get_datasets():
    return jsonify({'datasets': [{'id': d['id'], 'name': d['name']} for d in datasets]})

@app.route('/dataset/<int:dataset_id>', methods=['GET'])
def get_dataset_info(dataset_id):
    dataset = next((d for d in datasets if d['id'] == dataset_id), None)
    if dataset:
        return jsonify(dataset)
    else:
        abort(404, description="Dataset not found")

@app.route('/download-zip/<exp_name>', methods=['GET'])
def download_zip(exp_name):
    # bucket_name = "fcp-indi"
    if exp_name == 'mevd': #ALL DATASETS
        prefix = prefix_s3 + "bids_plot_examples/"
    else:
        prefix = prefix_s3 + f"bids_plot_examples/{exp_name}/"
    s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))

    progress[exp_name] = {'status': 'downloading', 'current': 0, 'total': 0}
    
    # Get the list of files in the S3 prefix
    response = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
    if 'Contents' not in response:
        progress[exp_name]['status'] = 'error'
        return jsonify({'error': 'No files found for the given experiment name.'}), 404
    
    progress[exp_name]['total'] = len(response['Contents'])
    
    # Create an in-memory zip file
    memory_file = io.BytesIO()
    with zipfile.ZipFile(memory_file, 'w', zipfile.ZIP_DEFLATED) as zf:
        for i, obj in enumerate(response['Contents']):
            file_key = obj['Key']
            file_name = file_key[len(prefix):]  # Strip the prefix for a clean filename

            # Stream file content from S3
            s3_object = s3.get_object(Bucket=bucket_name, Key=file_key)
            file_content = s3_object['Body'].read()

            progress[exp_name]['current'] = i + 1

            # Write to the zip file in memory
            zf.writestr(file_name, file_content)
    
    memory_file.seek(0)  # Reset the file pointer to the beginning

    # Create a response to stream the zip file
    response = Response(memory_file, mimetype='application/zip')
    response.headers['Content-Disposition'] = f'attachment; filename={exp_name}.zip'

    progress[exp_name]['status'] = 'completed'
    return response


@app.route('/progress/<exp_name>', methods=['GET'])
def get_progress(exp_name):
    if exp_name not in progress:
        return jsonify({'error': f'No progress found for {exp_name}'}), 404
    return jsonify(progress[exp_name])

##############################
#### Signal Visualisation ####
##############################

def read_gzip_data(url, data_container, signal_type):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad responses
        
        # Debug output: Response details
        print(f"Response status code: {response.status_code}")

        # Read the GZIP content
        with gzip.GzipFile(fileobj=BytesIO(response.content)) as f:
            df = pd.read_csv(f, sep='\t')
        
        print(signal_type, " data loaded successfully")

        if signal_type == 'ecg':
            data_container['ecg_values'] = df.iloc[:, 0].tolist()
        elif signal_type == 'hr':
            data_container['heart_rate'] = df.iloc[:, 0].tolist()
        elif signal_type == 'eye':
            data_container['eye_data']['gaze_x'] = df.iloc[:, 0].tolist()
            data_container['eye_data']['gaze_y'] = df.iloc[:, 1].tolist()
            data_container['eye_data']['pupil_size'] = df.iloc[:, 2].tolist()
        elif signal_type == 'head':
            data_container['head_data']['head_x'] = df.iloc[:, 0].tolist()
            data_container['head_data']['head_y'] = df.iloc[:, 1].tolist()
            data_container['head_data']['head_z'] = df.iloc[:, 2].tolist()
        print(f'{signal_type.capitalize()} data loaded from {url}')
    except Exception as e:
        print(f"Error reading data from {url}: {str(e)}")

@app.route('/plot/<string:bidsname>/<string:sub>/<string:ses>/<string:stim>')
def load_signal(bidsname, sub, ses, stim):
    print(f"Received sub: {sub}, ses: {ses}, stim: {stim}")

    raw_ecg_path = f'https://fcp-indi.s3.amazonaws.com/data/Projects/CUNY_MADSEN/bids_plot_examples/{bidsname}/sub-{sub}/ses-{ses}/beh/sub-{sub}_ses-{ses}_task-stim{stim}_recording-ecg_physio.tsv.gz'
    raw_eye_path = f'https://fcp-indi.s3.amazonaws.com/data/Projects/CUNY_MADSEN/bids_plot_examples/{bidsname}/sub-{sub}/ses-{ses}/beh/sub-{sub}_ses-{ses}_task-stim{stim}_recording-eye_physio.tsv.gz'
    raw_head_path = f'https://fcp-indi.s3.amazonaws.com/data/Projects/CUNY_MADSEN/bids_plot_examples/{bidsname}/sub-{sub}/ses-{ses}/beh/sub-{sub}_ses-{ses}_task-stim{stim}_recording-head_physio.tsv.gz'
    derived_ecg_path = f'https://fcp-indi.s3.amazonaws.com/data/Projects/CUNY_MADSEN/bids_plot_examples/{bidsname}/derivatives/sub-{sub}/ses-{ses}/beh/sub-{sub}_ses-{ses}_task-stim{stim}_desc-filtECG.tsv.gz'
    derived_hr_path = f'https://fcp-indi.s3.amazonaws.com/data/Projects/CUNY_MADSEN/bids_plot_examples/{bidsname}/derivatives/sub-{sub}/ses-{ses}/beh/sub-{sub}_ses-{ses}_task-stim{stim}_desc-hr.tsv.gz'

    if bidsname == 'BIDS_eyetracking':
        raw_eye_path = f'https://fcp-indi.s3.amazonaws.com/data/Projects/CUNY_MADSEN/bids_plot_examples/{bidsname}/sub-{sub}/ses-{ses}/beh/sub-{sub}_ses-{ses}_task-stim{stim}_recording-eyetracking_physio.tsv.gz'

    signal_data = {
        'raw': {
            'ecg_values': [],
            'eye_data': {'gaze_x': [], 'gaze_y': [], 'pupil_size': []},
            'head_data': {'head_x': [], 'head_y': [], 'head_z': []}
        },
        'derived': {
            'ecg_values': [],
            'heart_rate': []
        }
    }

    read_gzip_data(raw_ecg_path, signal_data['raw'], 'ecg')
    read_gzip_data(raw_eye_path, signal_data['raw'], 'eye')
    read_gzip_data(raw_head_path, signal_data['raw'], 'head')

    # Load derived (processed) data
    read_gzip_data(derived_ecg_path, signal_data['derived'], 'ecg')
    read_gzip_data(derived_hr_path, signal_data['derived'], 'hr')

    return jsonify(signal_data)

#######################
#### Main Function ####
#######################

if __name__ == '__main__':
    # app.run(debug=True) # Development debugging
    app.run(debug=False)
    # app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default_secret_key')

