// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    let baseUrl;
    const downloadButtonFP = document.getElementById('download-button');
    const downloadProgressButtonFP = document.getElementById('download-progress-button');
    const datasetInfoFP = document.getElementById('dataset-info-fullpage');
    const datasetTableContainer = document.getElementById('table-container'); // Table container for displaying the HTML file
    const datasetMessage = document.getElementById('dataset-message'); // Message for the dataset
    const optionsButtons = document.getElementById('options-buttons'); // Container for option buttons
    const subjectsDiv = document.getElementById('subjects');
    const sessionsDiv = document.getElementById('sessions');
    const stimuliDiv = document.getElementById('stimuli');
    let selectedButton = null;
    const output = document.getElementById('output');
    // Object to store selected values
    const selections = {
        subject: null,
        session: null,
        stimulus: null
    };

    const currentPage = window.location.pathname;
    console.log("Current Page:", currentPage);

    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {
        console.log("Checking link:", link.getAttribute("href"));

        if (link.getAttribute("href") === currentPage) {
            console.log("Match found:", link);
            link.classList.add("active");
        }
    });

    fetch('/api/base-url')
        .then(response => response.json())
        .then(data => {
            baseUrl = data.base_url;
            console.log('Base URL from API:', baseUrl);
        })
        .catch(error => console.error('Error fetching base URL:', error));

    // Fetch the list of datasets from the server
    fetch('/datasets')
        .then(response => response.json())
        .then(data => {
            const datasetList = document.getElementById('datasets');

            data.datasets.forEach(dataset => {
                const button = document.createElement('button');
                button.textContent = dataset.name;
                button.dataset.id = dataset.id;
                button.addEventListener('click', () => loadDatasetDetails(dataset.id, button));
                datasetList?.appendChild(button);
                
                });
        })
        .catch(error => console.error('Error fetching datasets:', error));

    // Function to load dataset details and display them
    function loadDatasetDetails(datasetId, button) {
        // Clear previously selected button
        if (selectedButton) {
            selectedButton.classList.remove('selected');
        }

        // Highlight the clicked button
        button.classList.add('selected');
        selectedButton = button;

        // Fetch details for the selected dataset
        fetch(`/dataset/${datasetId}`)
            .then(response => response.json())
            .then(dataset => {
                const pageURL = `${baseUrl}${dataset.page}`;
                // console.log(pageURL)
                datasetInfoFP.innerHTML = `
                    <h3 style='text-decoration: underline'>${dataset.name}</h3>
                    <p><strong>Description:</strong> ${dataset.description}
                    <br><strong>Subjects:</strong> ${dataset.subjects}
                    <br><strong>Sessions:</strong> ${dataset.sessions}
                    <br><strong>Session Conditions: <br></strong> ${dataset.Conditions}
                    <br><strong>Tasks (Stimuli):<br></strong> ${dataset.Stimuli} (Open <a href="${pageURL}">respective experiment page</a> for more info on what stimuli was used)
                    <br><strong>Modalities Recorded:</strong> ${dataset.Modalities}</p>
                `;

                // Download BIDS File
                downloadButtonFP.style.display = 'block';
                downloadButtonFP.textContent = `Download ${dataset.name} Dataset - BIDS Format`;
                downloadButtonFP.onclick = () => {
                    console.log(pageURL)
                    startDownload(dataset.bidsname);
                    download_file(dataset.bidsname);
                    downloadProgressButtonFP.style.display = 'block';
                    
                };
                
                downloadProgressButtonFP.innerHTML = `
                <p id="status">Download Progress Bar<p>
                <progress id="progress-bar" value="0" max="100" style="width: 100%;"></progress>
                `;
            })
            .catch(() => {
                datasetInfoFP.innerHTML = '<p>Dataset not found.</p>';
                downloadButtonFP.style.display = 'none';
            });
    }

    function startDownload(expName) {
        const progressBar = document.getElementById('progress-bar');
        const statusText = document.getElementById('status');

        // Start the download
        // fetch(`/progress/${expName}`)
        // .then(response => response.json()) // Parse the JSON response
        // .then(data => {
        //     console.log('Data: ', data)
            // if (data.status == 200) {
        
        statusText.innerText = `[Refresh to abort] Downloading...`; // Update the status text
        // Start polling for progress
        const intervalId = setInterval(() => {
            fetch(`/progress/${expName}`)
                .then(response => response.json())
                .then(progressData => {
                    if (progressData.status === 'completed') {
                        clearInterval(intervalId);
                        statusText.innerText = 'Download ready - find the dataset (.zip) in your default downloads directory. Happy analysis!';
                    } else if (progressData.status === 'downloading') {
                        progressBar.value = (progressData.current / progressData.total) * 100;
                        statusText.innerText = `[Refresh to abort] Preparing your download... (${Math.floor(progressBar.value)}%)`;
                    } else if (progressData.status === 'error') {
                        clearInterval(intervalId);
                        statusText.innerText = 'Error during download.';
                    }
                });
        }, 1000);
    }
        
        // .catch(error => {
        //     statusText.innerText = 'Error starting download.';
        //     console.error(error);
        // });
 


    // Function to fetch and display the HTML table
    function fetchTableHTML() {
        fetch('/table')  // Fetch the HTML file from the Flask route
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();  // Parse the response as text
            })
            .then(data => {
                datasetTableContainer.innerHTML = data; // Insert the fetched HTML into the container

                datasetTableContainer.addEventListener('click', (event) => {
                    const target = event.target;
                    // Check if the target is a download button
                    if (target.closest('.download-btn')) {
                        const filename = target.closest('.download-btn').getAttribute('data-filename');
                        console.log(filename)
                        download_file(filename);
                    }
                });
                datasetTableContainer.addEventListener('mouseover', (event) => {
                        const target = event.target;    
                    // Check if the target is a table cell (td)
                    if (target.tagName === 'TD') {
                        const row = target.parentNode; // Get the parent row
                        const id = row.getAttribute('data-id');
                        console.log(`ID: ${id}`);

                        const infoDisplay = document.getElementById('infoDisplay');
                        const infoTitle = document.getElementById('infoTitle');
                        const infoDescription = document.getElementById('infoDescription');
                        const infoDataStorage = document.getElementById('infoDataStorage');
                        const infoSignal = document.getElementById('infoSignal');
                        const infoReferences = document.getElementById('infoReferences');
                        const infoExamplePlot = document.getElementById('examplePlot');

                        const data = infoData[id - 1]; // Get the data for the clicked item
                        console.log(data)

                        infoTitle.innerHTML = `<u>${data.title}</u>`;
                        infoDescription.innerText = data.description;
                        infoDataStorage.innerText = data.dataStorage;
                        infoSignal.innerText = data.signalRepresents;
                        infoReferences.innerText = data.references;
                        // infoExamplePlot.innerHTML = data.examplePlot

                        infoExamplePlot.innerHTML = `<img src="${data.examplePlot}" width="780" height="160">`
                        console.log(infoExamplePlot)

                        // infoDisplay.style.display = 'block';

                    }
                    });
                });
    }

    
    function download_file(filename) {
        console.log('Filename: ' ,filename);
        // alert("Downloading: " + filename);  // Optional: Show an alert for debugging
        window.location.href = '/download-zip/' + filename;  // Trigger file download
    }
    // Fetch and display the table HTML when the page loads
    fetchTableHTML();

    const infoData = [
        {
            title: "Pupil Size",
            description: "Pupil size is an indicator of cognitive and emotional states, often influenced by factors such as arousal and attention. Changes in pupil diameter can reflect variations in light levels, emotional responses, and mental workload.",
            dataStorage: "Pupil size is typically stored as a time series signal, with measurements recorded in millimeters (mm) at high frequencies (e.g., 60 Hz or higher). The signal represents the diameter of the pupil over time.",
            signalRepresents: "Fluctuations in the signal can indicate cognitive load, emotional arousal, or attentional shifts during tasks.",
            references: "Laeng, B., et al. (2012). Pupil size as an indicator of mental effort during information processing.",
            examplePlot: ""
        },
        {
            title: "Gaze Position",
            description: "Gaze tracking involves measuring where a person is looking. This data can provide insights into attention, interest, and cognitive processes. It is commonly used in fields like psychology, marketing, and user experience research.",
            dataStorage: "Gaze tracking data is often stored as a series of coordinates (x, y) representing the point of gaze on a screen or within a visual field, collected at high frequencies (e.g., 30-120 Hz). The signal may also include fixation durations and saccadic movements.",
            signalRepresents: "The coordinates and associated metrics represent visual attention, interest, and engagement with specific stimuli.",
            references: "Duchowski, A. T. (2007). Eye tracking methodology: Theory and practice.",
            examplePlot: "/static/images/gaze.jpg"
        },
        {
            title: "Saccades",
            description: "Saccades are rapid movements of the eye that occur when shifting gaze from one point to another. They play a crucial role in visual perception by allowing the eyes to rapidly focus on different areas of interest.",
            dataStorage: "Saccadic data is typically stored as a series of events, each comprising coordinates (x, y) for the start and end points of each saccade, along with duration and amplitude measurements.",
            signalRepresents: "The saccade metrics represent the efficiency of visual information processing and can indicate cognitive workload and attentional shifts.",
            references: "Rayner, K. (1998). Eye movements in reading and information processing."
        },
        {
            title: "Blinks",
            description: "Blinks serve as a protective mechanism for the eyes and are also indicative of attention and cognitive load. Blink rates can vary with emotional states, fatigue, and task demands.",
            dataStorage: "Blink data is recorded as a time series indicating the occurrence and duration of each blink, often represented as binary events (0 for no blink, 1 for blink).",
            signalRepresents: "Blink frequency and duration can indicate cognitive load, attentional engagement, and fatigue levels.",
            references: "Stern, J. A. et al. (1994). The effects of stimulus presentation time on blink rate."
        },
        {
            title: "Respiration",
            description: "Respiration is a fundamental physiological process that reflects autonomic nervous system activity. Changes in breathing patterns can indicate emotional states such as stress and relaxation.",
            dataStorage: "Respiratory data is typically stored as a time series signal, representing the number of breaths per minute or changes in chest expansion over time, recorded at a high sampling rate (e.g., 1 Hz or higher).",
            signalRepresents: "Variations in the respiratory signal can indicate stress levels, emotional arousal, and relaxation states.",
            references: "Vaidya, V. S. & Kembhavi, A. (2016). The effect of deep breathing on heart rate variability.",
            examplePlot: "/static/images/respiration.png"
        },
        {
            title: "ECG (Electrocardiogram)",
            description: "ECG measures the electrical activity of the heart. It provides insights into heart rate, rhythm, and potential cardiac issues. It is widely used in medical diagnostics and research.",
            dataStorage: "Stored as a time series signal, with voltage changes measured in millivolts (mV).",
            signalRepresents: "The ECG waveform indicates heart rate variability and rhythm abnormalities.",
            references: "Kligfield, P. et al. (2005). The importance of heart rate in the interpretation of the electrocardiogram.",
            examplePlot: "/static/images/ecg.png"
        },
        {
            title: "EEG (Electroencephalogram)",
            description: "EEG measures electrical activity in the brain. It is used to study brain function, diagnose neurological conditions, and explore cognitive processes. EEG can provide insights into mental states, such as alertness and relaxation.",
            dataStorage: "EEG data is stored as a time series signal, with voltage fluctuations measured in microvolts (µV) at multiple channels (e.g., sampled at 256 Hz or higher).",
            signalRepresents: "The EEG signal represents the synchronized electrical activity of neuronal populations, indicating different brain states (e.g., sleep, alertness, cognitive workload).",
            references: "Niedermeyer, E. & da Silva, F. L. (2004). Electroencephalography: Basic Principles, Clinical Applications.",
            examplePlot: "/static/images/eeg.png"
        },
        {
            title: "Head Movement",
            description: "Head movement tracking provides insights into user attention, engagement, and cognitive load. It can be tracked through various methods, including sensors and cameras, and is often combined with other modalities like gaze tracking.",
            dataStorage: "Head movement data is typically stored as a series of 3D coordinates (x, y, z) or as rotational angles (pitch, yaw, roll) collected over time (e.g., sampled at 30 Hz or higher).",
            signalRepresents: "The signals represent the direction and extent of head movements, indicating attentional shifts and engagement levels during tasks.",
            references: "O'Leary, K. M. & Liu, S. (2021). Tracking head movement: Methods, applications, and future directions.",
            examplePlot: "/static/images/head.jpg"
        },
        {
            title: "EDA (Electrodermal Activity)",
            description: "EDA measures the electrical conductance of the skin, which varies with sweat gland activity and emotional arousal. It is often used in psychological research and stress studies.",
            dataStorage: "EDA data is stored as a time series signal, measured in microsiemens (µS) and sampled at rates ranging from 1 Hz to 256 Hz.",
            signalRepresents: "Changes in EDA can indicate emotional responses, arousal levels, and stress, reflecting autonomic nervous system activity.",
            references: "Boucsein, W. (2012). Electrodermal Activity."
        }
    ];    
});
