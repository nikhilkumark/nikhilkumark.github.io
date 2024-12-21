datasets = [
    {
        'id': 1,
        'name': 'Experiment 1',
        'bidsname': 'BIDS_eyetracking',
        'description': 'Subjects watched five videos, knowing they\'d be tested afterward. After each video, they answered 11 to 12 factual multiple-choice questions. Videos and questions were presented in random order.',
        'subjects': 27,
        'sessions': 2,
        'filename': 'sample1.txt',
        'Stimuli': 5,
        'page': 'eyetracking-dataset',
        'Modalities': '<ul> <li> Gaze (X, Y) </li> <li> Pupil Size </li> <li> Blinks </li> <li> Saccades </li> </ul>',
        'Conditions' : '1) Attentive - Watch videos with focus <br> 2) Distracted - Watch videos while counting backwards in your head'
    },
    {
        'id': 2, 
        'name': 'Experiment 2',
        'bidsname': 'BIDS_multimodal',
        'description': 'Subjects watched five videos without knowing they\'d be tested. After viewing all the videos, they answered 59 factual multiple-choice questions. Videos and questions were presented in random order.',
        'subjects': 32,
        'sessions': 2,
        'filename': 'BIDS_multimodal.zip',
        'Stimuli': 5,
        'page': 'multimodal-dataset',
        'Modalities': '<ul><li>Gaze (X, Y)</li><li>Head (X, Y, Z)</li><li>Pupil Size</li><li>ECG</li><li>EEG (64 Channel)</li><li>Heart Rate (Derivative)</li><li>Blinks (Derivative)</li><li>Saccades (Derivative)</li></ul></ul>',
        'Conditions' : '1) Attentive - Watch videos with focus <br> 2) Distracted - Watch videos while counting backwards in your head'
    },
    {
        'id': 3,
        'name': 'Experiment 3',
        'bidsname': 'BIDS_multistyle',
        'description': 'Subjects watched six videos, knowing they\'d be tested afterward. They answered factual multiple-choice questions after each video, similar to Experiment 1 but with different stimuli. Videos and questions were presented in random order.',
        'subjects': 29,
        'sessions': 2,
        'filename': 'BIDS_multistyle.zip',
        'Stimuli': 6,
        'page': 'multistyle-dataset',
        'Modalities': '<ul><li>Gaze (X, Y)</li><li>Head (X, Y, Z)</li><li>Pupil Size</li><li>ECG</li><li>EEG (64 Channel)</li><li>Respiration</li><li>Heart Rate (Derivative)</li><li>Breathing Rate (Derivative)</li><li>Blinks (Derivative)</li><li>Saccades (Derivative)</li></ul></ul>',
        'Conditions' : '1) Attentive - Watch videos with focus <br> 2) Distracted - Watch videos while counting backwards in your head'
    },
    {
        'id': 4,
        'name': 'Experiment 4',
        'bidsname': 'BIDS_intervention',
        'description': 'Subjects watched three instructional videos while their signals were recorded. Videos and question pairs were presented in random order. Subjects were not aware that they would be tested on the material.',
        'subjects': 43,
        'sessions': 2,
        'Stimuli': 3,
        'page': 'intervention-dataset',
        'filename': 'BIDS_intervention.zip',
        'Modalities': '<ul><li>Gaze (X, Y)</li><li>Head (X, Y, Z)</li><li>Pupil Size</li><li>ECG</li><li>EEG (64 Channel)</li><li>Heart Rate (Derivative)</li><li>Blinks (Derivative)</li><li>Saccades (Derivative)</li></ul>',
        'Conditions' : 'Watch 3 vids before or after intervention'
    },
    {
        'id': 5,
        'name': 'Experiment 5',
        'bidsname': 'BIDS_intervention',
        'description': 'Subjects watched three instructional videos while their signals were recorded. Videos and question pairs were presented in random order. Subjects were aware that they would be tested on the material. They were monetarily incentivized and were shown the questions, after Session 1, that would be asked at the end of the videos.',
        'subjects': 49,
        'sessions': 2,
        'Stimuli': 3,
        'page': 'intervention-dataset',
        'filename': 'BIDS_intervention.zip',
        'Modalities': '<ul><li>Gaze (X, Y)</li><li>Head (X, Y, Z)</li><li>Pupil Size</li><li>ECG</li><li>EEG (64 Channel)</li><li>Heart Rate (Derivative)</li><li>Blinks (Derivative)</li><li>Saccades (Derivative)</li></ul>',
        'Conditions' : 'Watch 3 vids before or after intervention'
    },
    {
        'id': 6,
        'name': 'All Experiments',
        'bidsname': 'mevd',
        'description': 'Datasets of all 5 recorded experiments',
        'subjects': 180,
        'sessions': 2,
        'Stimuli': '22 in total',
        'page': '',
        'filename': 'MEVD.zip',
        'Modalities': '<ul><li>Gaze (X, Y)</li><li>Head (X, Y, Z)</li><li>Pupil Size</li><li>ECG</li><li>EEG (64 Channel)</li><li>Heart Rate (Derivative)</li><li>Blinks (Derivative)</li><li>Saccades (Derivative)</li></ul>',
        'Conditions' : 'Attend/Distract (Exp 1,2,3), Attend/Attend (Exp 4,5)'
    }
]