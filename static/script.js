

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    let baseUrl;
    const downloadButton = document.getElementById('download-button');
    const datasetInfo = document.getElementById('dataset-info');
    const datasetTableContainer = document.getElementById('table-container'); // Table container for displaying the HTML file
    const datasetHomeTableContainer = document.getElementById('hometable-container');
    // const optionsButtons = document.getElementById('options-buttons'); // Container for option buttons
    const subjectsDiv = document.getElementById('subjects');
    const sessionsDiv = document.getElementById('sessions');
    const stimuliDiv = document.getElementById('stimuli');
    let selectedButton = null;
    // const output = document.getElementById('output');

    // Object to store selected values
    const selections = {
        subject: null,
        session: null,
        stimulus: null
    };

    const currentPage = window.location.pathname;
    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
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
                console.log(pageURL)
                datasetInfo.innerHTML = `
                    <h3 style='text-decoration: underline'>${dataset.name}</h3>
                    <p><strong>Description:</strong> ${dataset.description}</p>
                    <br><p><strong>Subjects:</strong> ${dataset.subjects}</p>
                    <br><p><strong>Sessions:</strong> ${dataset.sessions}</p>
                    <p><strong>^ Session Conditions: <br></strong> ${dataset.Conditions}</p>
                    <br><p><strong>Tasks (Stimuli):<br></strong> ${dataset.Stimuli} (Open <a href="${pageURL}">respective experiment page</a> for more info on what stimuli was used)</p>
                    <br><p><strong>Modalities Recorded:</strong> ${dataset.Modalities}</p>
                `;

                // Download BIDS File

                downloadButton.style.display = 'block';
                downloadButton.onclick = () => {
                    console.log(dataset.filename)
                    download_file(dataset.filename);
                };
            })
            .catch(() => {
                datasetInfo.innerHTML = '<p>Dataset not found.</p>';
                downloadButton.style.display = 'none';
            });
    }

    loadDatasetSignals(4);
    // Function to load dataset details and display them
    function loadDatasetSignals(datasetId) {
        // Fetch details for the selected dataset
        fetch(`/dataset/${datasetId}`)
            .then(response => response.json())
            .then(dataset => {

                const bidsname = dataset.filename.replace(/\.zip$/, '');
                const bidsdirname = dataset.bidsname;
            
                // Static Subjects
                const subjects = ['05', '06', '07'];
                subjectsDiv.innerHTML = '<strong>Subject:</strong> ';
                const subjectButtons = [];
                subjects.forEach(subject => {
                    const button = document.createElement('button');
                    button.textContent = subject;
                    button.onclick = () => handleSelection('subject', subject, subjectsDiv, button, bidsdirname);
                    subjectsDiv.appendChild(button);
                    subjectButtons.push(button);
                    // Select the first subject by default
                    // if (index === 0) button.click();
                });
                if (subjectButtons.length > 0) {
                    handleSelection('subject', subjects[0], subjectsDiv, subjectButtons[0], bidsdirname);
                }
            
                // Static Sessions
                const sessions = ['01', '02'];
                sessionsDiv.innerHTML = '<strong>Session:</strong> ';
                const sessionButtons = [];
                sessions.forEach(session => {
                    const button = document.createElement('button');
                    button.textContent = session;
                    button.onclick = () => handleSelection('session', session, sessionsDiv, button, bidsdirname);
                    sessionsDiv.appendChild(button);
                    // Select the first subject by default
                    // if (index === 0) button.click();
                    sessionButtons.push(button);
                });
                if (sessionButtons.length > 0) {
                    handleSelection('session', sessions[0], sessionsDiv, sessionButtons[0], bidsdirname);
                }
            
                // Static Stimuli
                const stimuli = ['01', '02', '03'];
                stimuliDiv.innerHTML = '<strong>Stimuli:</strong> ';
                const stimuliButtons = [];
                stimuli.forEach(stimulus => {
                    const button = document.createElement('button');
                    button.textContent = stimulus;
                    button.onclick = () => handleSelection('stimulus', stimulus, stimuliDiv, button, bidsdirname);
                    stimuliDiv.appendChild(button);
                    // Select the first subject by default
                    // if (index === 0) button.click();
                    stimuliButtons.push(button);
                });
                if (stimuliButtons.length > 0) {
                    handleSelection('stimulus', stimuli[0], stimuliDiv, stimuliButtons[0], bidsdirname);
                }
            
                // Function to handle button selection
                function handleSelection(type, selectedValue, parentDiv, selectedButton, bidsname) {
                    // Remove highlight from all buttons in the same group
                    const allButtons = parentDiv.getElementsByTagName('button');
                    for (let btn of allButtons) {
                        btn.classList.remove('selected');
                    }
                    // Highlight the selected button
                    selectedButton.classList.add('selected');
            
                    // You can add logic here to do something with the selection
                    console.log(`Selected: ${selectedButton.textContent}`);
            
                    selections[type] = selectedValue;
                    console.log(selections);
            
                    fetchSignal(bidsname, selections.subject,selections.session,selections.stimulus);
                }
            })
    }

    async function fetchSignal(bidsname, sub, ses, stim) {
        const signalPath = `${bidsname}/${sub}/${ses}/${stim}`;
        const loadingElement = document.getElementById('loading');
        
        try {
             // Show the loading indicator
            loadingElement.style.display = 'block';
            
            // Fetching signal data from Flask
            const response = await fetch(`/plot/${signalPath}`);
            
            if (!response.ok) {
                throw new Error(`Error fetching signal: ${response.statusText}`);
            }
    
            const signalData = await response.json();  // Parse the JSON response

            const rawData = signalData.raw;
            const derivedData = signalData.derived;
    
            // Process and plot the signal data
            plotSignalRaw(rawData, 'plotraw', sub, ses, stim);
            plotSignalDerived(derivedData, 'plotderived', sub, ses, stim);
    
        } catch (error) {
            console.error('Failed to load signal:', error);
        } finally {
            // Hide the loading indicator
            loadingElement.style.display = 'none';
        }
    }

    function plotSignalRaw(signalData, htmlcode, sub, ses, stim) {
        // Extract values from the signal data
        const ecgValues = signalData.ecg_values || [];
        const eyeX = signalData.eye_data.gaze_x || [];
        const eyeY = signalData.eye_data.gaze_y || [];
        const pupilSize = signalData.eye_data.pupil_size || [];
        const headX = signalData.head_data.head_x || [];
        const headY = signalData.head_data.head_y || [];
        const headZ = signalData.head_data.head_z || [];
    
        const ecgSamplingRate = 128; // Sampling rate for ECG
        const eyeHeadSamplingRate = 2000; // Sampling rate for eye and head data
    
        // Create time arrays based on the respective sampling rates
        const ecgTime = ecgValues.map((_, index) => index / ecgSamplingRate);
        const eyeHeadTime = eyeX.map((_, index) => index / eyeHeadSamplingRate); // Use eyeX to determine length
    
        // Create traces for each signal
        const traces = [
            {
                x: ecgTime,
                y: ecgValues,
                mode: 'lines',
                name: 'ECG Signal',
                yaxis: 'y1'
            },
            {
                x: eyeHeadTime,
                y: eyeX,
                mode: 'lines',
                name: 'Gaze X',
                yaxis: 'y2'
            },
            {
                x: eyeHeadTime,
                y: eyeY,
                mode: 'lines',
                name: 'Gaze Y',
                yaxis: 'y3'
            },
            {
                x: eyeHeadTime,
                y: pupilSize,
                mode: 'lines',
                name: 'Pupil Size',
                yaxis: 'y4'
            },
            {
                x: eyeHeadTime,
                y: headX,
                mode: 'lines',
                name: 'Head Pos X',
                yaxis: 'y5'
            },
            {
                x: eyeHeadTime,
                y: headY,
                mode: 'lines',
                name: 'Head Pos Y',
                yaxis: 'y6'
            },
            {
                x: eyeHeadTime,
                y: headZ,
                mode: 'lines',
                name: 'Head Pos Z',
                yaxis: 'y7'
            }
        ];
    
        // Create layout for the subplots
        const layout = {
            title: `Subject: ${sub}, Session: ${ses}, Stimulus: ${stim}`,
            height: 900, // Adjust the overall height for better visualization
            grid: { rows: traces.length, columns: 1, pattern: 'independent' },
            showlegend: true,
            paper_bgcolor: '#181a1b', // Set the background color of the entire plot
            plot_bgcolor: '#181a1b',  // Set the background color of the plotting area
            font: { color: 'white' },
            xaxis: {
                title: 'Time (s)', // Add title to the shared x-axis
                zeroline: false,
                showline: true,
                mirror: false,
                linecolor: 'grey',
                tickfont: { size: 10, color: 'white' },
                domain: [0, 1], // Use the full width of the plot
                anchor: 'y7' // Anchor to the last (bottom-most) y-axis
            }
        };
    
        // Create y-axis layout for each subplot
        traces.forEach((trace, index) => {
            layout[`yaxis${index + 1}`] = {
                title: trace.name,
                domain: [(traces.length - index - 1) / traces.length, (traces.length - index) / traces.length],
                zeroline: false,
                titlefont: { size: 12 },
                tickfont: { size: 10 },
                showticklabels: true,
                anchor: 'x' // Bind each y-axis to the shared x-axis
            };
        });
    
        // Plot the signals in subplots
        Plotly.newPlot(htmlcode, traces, layout);
    }
    
    

    function plotSignalDerived(signalData,htmlcode, sub, ses, stim) {
        // Extract values from the signal data
        const ecgValues = signalData.ecg_values || [];
        const heartrate = signalData.heart_rate || [];
    
        const ecgSamplingRate = 128; // Sampling rate for ECG
    
        // Create time arrays based on the respective sampling rates
        const ecgTime = ecgValues.map((_, index) => index / ecgSamplingRate);
    
        // Create traces for each signal
        const traces = [
            {
                x: ecgTime,
                y: ecgValues,
                mode: 'lines',
                name: 'Filtered ECG Signal',
                yaxis: 'y1'
            },
            {
                x: ecgTime,
                y: heartrate,
                mode: 'lines',
                name: 'Heart Rate',
                yaxis: 'y2'
            }
        ];
    
        // Create layout for the subplots
        const layout = {
            title: `Subject: ${sub}, Session: ${ses}, Stimulus: ${stim}`,
            height: (900*3.5)/7, // Adjust the overall height for better visualization
            grid: { rows: traces.length, columns: 1, pattern: 'independent' },
            showlegend: true,
            paper_bgcolor: '#181a1b', // Set the background color of the entire plot
            plot_bgcolor: '#181a1b',  // Set the background color of the plotting area
            font: { color: 'white' },
            xaxis: {
                title: 'Time (s)', // Add title to the shared x-axis
                zeroline: false,
                showline: true,
                mirror: false,
                linecolor: 'grey',
                tickfont: { size: 10, color: 'white' },
                domain: [0, 1], // Use the full width of the plot
                anchor: 'y2' // Anchor to the last (bottom-most) y-axis
            }
        };
    
        // Create y-axis layout for each subplot
        traces.forEach((trace, index) => {
            layout[`yaxis${index + 1}`] = {
                title: trace.name,
                domain: [(traces.length - index - 1) / traces.length, (traces.length - index) / traces.length],
                zeroline: false,
                titlefont: { size: 12 },
                tickfont: { size: 10 },
                showticklabels: true,
                anchor: 'x'
            };

            
        });
    
        // Plot the signals in subplots
        Plotly.newPlot(htmlcode, traces, layout);
    }

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
                datasetTableContainer.innerHTML = data;
                });
    }

    // function download_file(filename, subdirectory) {
    //     console.log(filename);
    //     alert("Downloading: " + filename);  // Optional: Show an alert for debugging
    //     window.location.href = '/download/' + subdirectory + '/' + filename;  // Trigger file download
    // }

    function download_file(filename) {
        console.log(filename);
        alert("Downloading: " + filename);  // Optional: Show an alert for debugging
        window.location.href = '/download/' + filename;  // Trigger file download
    }

    // Fetch and display the table HTML when the page loads
    fetchTableHTML();

    const infoData = [
        {
            title: "Pupil Size",
            description: "Pupil size is an indicator of cognitive and emotional states, often influenced by factors such as arousal and attention. Changes in pupil diameter can reflect variations in light levels, emotional responses, and mental workload.",
            dataStorage: "Pupil size is typically stored as a time series signal, with measurements recorded in millimeters (mm) at high frequencies (e.g., 60 Hz or higher). The signal represents the diameter of the pupil over time.",
            signalRepresents: "Fluctuations in the signal can indicate cognitive load, emotional arousal, or attentional shifts during tasks.",
            // references: "Laeng, B., et al. (2012). Pupil size as an indicator of mental effort during information processing.",
            examplePlot: ""
        },
        {
            title: "Gaze Position",
            description: "Gaze tracking involves measuring where a person is looking. This data can provide insights into attention, interest, and cognitive processes. It is commonly used in fields like psychology, marketing, and user experience research.",
            dataStorage: "Gaze tracking data is often stored as a series of coordinates (x, y) representing the point of gaze on a screen or within a visual field, collected at high frequencies (e.g., 30-120 Hz). The signal may also include fixation durations and saccadic movements.",
            signalRepresents: "The coordinates and associated metrics represent visual attention, interest, and engagement with specific stimuli.",
            // references: "Duchowski, A. T. (2007). Eye tracking methodology: Theory and practice.",
            examplePlot: "/static/images/gaze.jpg"
        },
        {
            title: "Saccades",
            description: "Saccades are rapid movements of the eye that occur when shifting gaze from one point to another. They play a crucial role in visual perception by allowing the eyes to rapidly focus on different areas of interest.",
            dataStorage: "Saccadic data is typically stored as a series of events, each comprising coordinates (x, y) for the start and end points of each saccade, along with duration and amplitude measurements.",
            signalRepresents: "The saccade metrics represent the efficiency of visual information processing and can indicate cognitive workload and attentional shifts.",
            // references: "Rayner, K. (1998). Eye movements in reading and information processing."
        },
        {
            title: "Blinks",
            description: "Blinks serve as a protective mechanism for the eyes and are also indicative of attention and cognitive load. Blink rates can vary with emotional states, fatigue, and task demands.",
            dataStorage: "Blink data is recorded as a time series indicating the occurrence and duration of each blink, often represented as binary events (0 for no blink, 1 for blink).",
            signalRepresents: "Blink frequency and duration can indicate cognitive load, attentional engagement, and fatigue levels.",
            // references: "Stern, J. A. et al. (1994). The effects of stimulus presentation time on blink rate."
        },
        {
            title: "Respiration",
            description: "Respiration is a fundamental physiological process that reflects autonomic nervous system activity. Changes in breathing patterns can indicate emotional states such as stress and relaxation.",
            dataStorage: "Respiratory data is typically stored as a time series signal, representing the number of breaths per minute or changes in chest expansion over time, recorded at a high sampling rate (e.g., 1 Hz or higher).",
            signalRepresents: "Variations in the respiratory signal can indicate stress levels, emotional arousal, and relaxation states.",
            // references: "Vaidya, V. S. & Kembhavi, A. (2016). The effect of deep breathing on heart rate variability.",
            examplePlot: "/static/images/respiration.png"
        },
        {
            title: "ECG (Electrocardiogram)",
            description: "ECG measures the electrical activity of the heart. It provides insights into heart rate, rhythm, and potential cardiac issues. It is widely used in medical diagnostics and research.",
            dataStorage: "Stored as a time series signal, with voltage changes measured in millivolts (mV).",
            signalRepresents: "The ECG waveform indicates heart rate variability and rhythm abnormalities.",
            // references: "Kligfield, P. et al. (2005). The importance of heart rate in the interpretation of the electrocardiogram.",
            examplePlot: "/static/images/ecg.png"
        },
        {
            title: "EEG (Electroencephalogram)",
            description: "EEG measures electrical activity in the brain. It is used to study brain function, diagnose neurological conditions, and explore cognitive processes. EEG can provide insights into mental states, such as alertness and relaxation.",
            dataStorage: "EEG data is stored as a time series signal, with voltage fluctuations measured in microvolts (µV) at multiple channels (e.g., sampled at 256 Hz or higher).",
            signalRepresents: "The EEG signal represents the synchronized electrical activity of neuronal populations, indicating different brain states (e.g., sleep, alertness, cognitive workload).",
            // references: "Niedermeyer, E. & da Silva, F. L. (2004). Electroencephalography: Basic Principles, Clinical Applications.",
            examplePlot: "/static/images/eeg.png"
        },
        {
            title: "Head Movement",
            description: "Head movement tracking provides insights into user attention, engagement, and cognitive load. It can be tracked through various methods, including sensors and cameras, and is often combined with other modalities like gaze tracking.",
            dataStorage: "Head movement data is typically stored as a series of 3D coordinates (x, y, z) or as rotational angles (pitch, yaw, roll) collected over time (e.g., sampled at 30 Hz or higher).",
            signalRepresents: "The signals represent the direction and extent of head movements, indicating attentional shifts and engagement levels during tasks.",
            // references: "O'Leary, K. M. & Liu, S. (2021). Tracking head movement: Methods, applications, and future directions.",
            examplePlot: "/static/images/head.jpg"
        },
        {
            title: "EDA (Electrodermal Activity)",
            description: "EDA measures the electrical conductance of the skin, which varies with sweat gland activity and emotional arousal. It is often used in psychological research and stress studies.",
            dataStorage: "EDA data is stored as a time series signal, measured in microsiemens (µS) and sampled at rates ranging from 1 Hz to 256 Hz.",
            signalRepresents: "Changes in EDA can indicate emotional responses, arousal levels, and stress, reflecting autonomic nervous system activity.",
            // references: "Boucsein, W. (2012). Electrodermal Activity."
        }
    ];   
    
    
    // Function to fetch and display the HTML table
    function fetchHomeTableHTML() {
        fetch('/homepage_table')  // Fetch the HTML file from the Flask route
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();  // Parse the response as text
            })
            .then(data => {
                datasetHomeTableContainer.innerHTML = data; // Insert the fetched HTML into the container
                
        });
    }

    fetchHomeTableHTML()


    
    // document.addEventListener("DOMContentLoaded", function() {
    

    
    // });
    
    // Function to handle file download
    

    


    // Search functionality for filtering displayed datasets
    // const searchInput = document.getElementById('dataset-search'); // Search input field

    // searchInput.addEventListener('input', function() {
    //     const searchValue = this.value.toLowerCase(); // Get the search input and convert it to lowercase
    //     const rows = datasetTableContainer.getElementsByTagName('tr'); // Get all rows in the fetched HTML table

    //     // Iterate over each row (skipping the header row)
    //     for (let i = 1; i < rows.length; i++) {
    //         const cells = rows[i].getElementsByTagName('td'); // Get all cells in the row
    //         let rowContainsSearchValue = false; // Flag to track if the row matches the search value

    //         // Check each cell for the search value
    //         for (let j = 0; j < cells.length; j++) {
    //             const cellValue = cells[j].textContent.toLowerCase(); // Get the cell value and convert to lowercase
    //             if (cellValue.includes(searchValue)) { // Check if cell value includes the search value
    //                 rowContainsSearchValue = true; // Set flag to true if match found
    //                 break; // Exit the loop if a match is found
    //             }
    //         }

    //         // Show or hide the row based on the search result
    //         rows[i].style.display = rowContainsSearchValue ? '' : 'none';
    //     }
    // });
});
