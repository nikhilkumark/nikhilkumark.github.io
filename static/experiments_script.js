const stimuli = {
    exp1: {
        1: 'https://www.youtube.com/embed/VVAKFJ8VVp4', // Experiment 1 video 1
        2: 'https://www.youtube.com/embed/oCEKMEeZXug', // Experiment 1 video 2
        3: 'https://www.youtube.com/embed/zQGOcOUBi6s', // Experiment 1 video 3
        4: 'https://www.youtube.com/embed/21eFwbb48sE', // Experiment 1 video 4
        5: 'https://www.youtube.com/embed/3IaYhG11ckA', // Experiment 1 video 5
    },
    exp2: {
        // Define videos for experiment 2
        1: 'https://www.youtube.com/embed/VVAKFJ8VVp4', // Why are Stars Shaped
        2: 'https://www.youtube.com/embed/oCEKMEeZXug', // How Modern Light Bulbs Work
        3: 'https://www.youtube.com/embed/zQGOcOUBi6s', // The Immune System Explained – Bacteria Infection
        4: 'https://www.youtube.com/embed/21eFwbb48sE', // Who Invented the Internet - And Why
        5: 'https://www.youtube.com/embed/3IaYhG11ckA', // Why Do We Have More Boys Than Girls
    },
    exp3: {
        // Define videos for experiment 3
        1: 'https://www.youtube.com/embed/9w-5wJYVmcw', // What If We Killed All the Mosquitoes
        2: 'https://www.youtube.com/embed/mnYSMhR3jCI', // Are We All Related
        3: 'https://www.youtube.com/embed/30o4omX5qfo', // Work and the work-energy principle Physics Khan Academy
        4: 'https://www.youtube.com/embed/rkntp3_cZl4', // Dielectrics in capacitors Circuits Physics Khan Academy
        5: 'https://www.youtube.com/embed/bYgV9nvgJ3E', // How Do People Measure Planets Suns About Astrophysics Outer Space
        6: 'https://www.youtube.com/embed/lkRZKqDdwzU' // Three Factors That May Alter the Action of an Enzyme Chemistry Biology Concepts
    },
    exp4: {
        // Define videos for experiment 3
        1: 'https://www.youtube.com/embed/VVAKFJ8VVp4', // Why are Stars Shaped
        2: 'https://www.youtube.com/embed/zQGOcOUBi6s', // The Immune System Explained – Bacteria Infection (3)
        3: 'https://www.youtube.com/embed/mnYSMhR3jCI', // Are We All Related (7)
    },
    exp5: {
        // Define videos for experiment 3
        1: 'https://www.youtube.com/embed/VVAKFJ8VVp4', // Why are Stars Shaped
        2: 'https://www.youtube.com/embed/zQGOcOUBi6s', // The Immune System Explained – Bacteria Infection (3)
        3: 'https://www.youtube.com/embed/mnYSMhR3jCI', // Are We All Related (7)
    },
    // Add more experiments as needed...
};
const expNames = {
    exp1: {
        1: 'Why are Stars Star-Shaped',
        2: 'How Modern Light Bulbs Work',
        3: 'The Immune System Explained – Bacteria Infection',
        4: 'Who Invented the Internet - And Why',
        5: 'Why Do We Have More Boys Than Girls'
    },
    exp2: {
        // Define videos for experiment 2
        1: 'Why are Stars Star-Shaped',
        2: 'How Modern Light Bulbs Work',
        3: 'The Immune System Explained – Bacteria Infection',
        4: 'Who Invented the Internet - And Why',
        5: 'Why Do We Have More Boys Than Girls',
    },
    exp3: {
        // Define videos for experiment 3
        1: 'What If We Killed All the Mosquitoes',
        2: 'Are We All Related',
        3: 'Work and the work-energy principle',
        4: 'Dielectrics in capacitors Circuits',
        5: 'How Do People Measure Planets & Suns',
        6: 'Three Factors That May Alter the Action of an Enzyme'
    },
    exp4: {
        // Define videos for experiment 3
        1: 'Why are Stars Shaped',
        2: 'The Immune System Explained – Bacteria Infection', //(3)
        3: 'Are We All Related' //(7)
    },
    exp5: {
        // Define videos for experiment 3
        1: 'Why are Stars Shaped',
        2: 'The Immune System Explained – Bacteria Infection', //(3)
        3: 'Are We All Related' //(7)
    },
};
console.log("Calling setupStimuliExperiment...");

const videoFrames = [
    document.getElementById('video-frame-1'),
    document.getElementById('video-frame-2'),
    document.getElementById('video-frame-3'),
    document.getElementById('video-frame-4'),
    document.getElementById('video-frame-5')
];

// Locate the spec
document.addEventListener('DOMContentLoaded', function () {
    // Automatically load Experiment 1 when the page loads

    const firstExperimentLink = document.querySelector('#exp-ids a');
    if (firstExperimentLink) {
        firstExperimentLink.click(); // Simulate a click on the first experiment link
    }
});

function showExperiment(expId, element) {
    // Hide all experiment content
    var contents = document.querySelectorAll('.experiment-content');
    contents.forEach(function(content) {
        content.style.display = 'none';
    });

    // Show the selected experiment content
    var selectedExperiment = document.getElementById(expId);
    selectedExperiment.style.display = 'block';

    // Remove 'selected' class from all experiment links
    var links = document.querySelectorAll('#exp-ids a');
    links.forEach(function(link) {
        link.classList.remove('selected');
    });

    // Add 'selected' class to the clicked link
    element.classList.add('selected');
    displayVideoForExp(expId);
    // Example usage:
    setupExperiment(expId);

    // Fetch and display the transposed table for the selected experiment
    fetchExpTable(expId, 1); // Assuming column index 1; adjust as needed
}

function setupExperiment(expId) {
    console.log("Setting up Exp")
    // Extract the numeric ID from expId (e.g., "exp1" -> 1, "exp2" -> 2)
    const expNumber = parseInt(expId.replace('exp', ''), 10);
    videoframeNum = expNumber - 1;
    console.log(videoFrames[videoframeNum])
    if (!expNumber || !videoFrames[videoframeNum]) {
        console.error(`Invalid expId (${expId}) or video frame missing for ${videoFrames[videoframeNum]}`);
        return;
    }

    // Dynamically generate the DOM ID for stimuli-ids based on the expId
    const stimuliIdsElement = `stimuli-ids-exp${expNumber}`;
    console.log(stimuliIdsElement)

    // Call the setupStimuliExperiment function with the appropriate parameters
    setupStimuliExperiment(stimuli[expId], expNames[expId], stimuliIdsElement, expId, videoFrames[videoframeNum]);
}

const currentPage = window.location.pathname;
const links = document.querySelectorAll(".nav-link");

links.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        console.log("Match found:", link);
        link.classList.add("active");
    }
});
// Directly target the video frame and load the corresponding video
function displayVideoForExp(expId) {
    const numericId = expId.replace(/\D/g, ''); // Removes non-numeric characters
    const videoFrame = document.querySelector(`#video-frame-${numericId}`); // Ensure your video frames have unique IDs like 'video-frame-1', etc.

    if (!videoFrame) {
        console.error(`No video frame found for expId: ${expId}`);
        return;
    }

    // Get the video URL for the selected expId
    const firstStimulusId = Object.keys(stimuli[expId])[0]; // Get the first stimulus ID dynamically
    const videoUrl = stimuli[expId][firstStimulusId];

    console.log(`Selected ExpId: ${expId}`);
    console.log(`Loading video for expId: ${expId}, URL: ${videoUrl}`);

    if (videoUrl) {
        videoFrame.innerHTML = `<iframe width="560" height="315" src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
        videoFrame.innerHTML = '<p>Video not found.</p>';
    }

}

function setupStimuliExperiment(stimuli, videoNames, containerId, expId, videoFrame) {
    const stimuliIdsContainer = document.getElementById(containerId);
    const tooltip = document.getElementById('tooltip');
    const currentPage = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll("nav ul li a");

    links.forEach(link => {
        const linkHref = link.getAttribute("href").split("/").pop();
        if (linkHref === currentPage) {
            link.classList.add("active");
        }
    });

    // Check if buttons already exist
    if (stimuliIdsContainer.childElementCount > 0) {
        console.log('Buttons already exist. Skipping creation.');
        return;
    }

    // Populate stimuli ID buttons
    Object.keys(stimuli).forEach(key => {
        const button = document.createElement('button');
        button.textContent = `Stim 0${key}`;
        button.dataset.id = key;
        console.log(key);
        button.addEventListener('click', () => showVideo(key, expId, videoFrame));
        
        button.addEventListener('mouseover', (event) => {
            const videoName = videoNames[key];
            tooltip.textContent = videoName;
            tooltip.style.display = 'block';
            tooltip.style.left = `${event.pageX + 10}px`; 
            tooltip.style.top = `${event.pageY + 10}px`; 
        });

        button.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });

        stimuliIdsContainer.appendChild(button);
    });
}

function showVideo(id, expId, videoFrame) {
    const videoUrl = stimuli[expId][id];
    if (videoUrl) {
        videoFrame.innerHTML = `<iframe width="560" height="315" src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
        videoFrame.innerHTML = '<p>Video not found.</p>';
    }
}

// function fetchExpTable(expId, columnIndex) {
//     fetch('/table')
//         .then(response => {
//             if (!response.ok) {
//                 console.log(respose.text())
//                 throw new Error('Network response was not ok');
//             }
//             return response.text();
//         })
//         .then(tableHTML => {
//             const selectedExperiment = document.getElementById(expId);

//             // Parse the fetched HTML into a DOM element
//             const parser = new DOMParser();
//             const doc = parser.parseFromString(tableHTML, 'text/html');
//             const experimentTable = doc.querySelector('#modalityTable');

//             if (!experimentTable) {
//                 console.error("Table with id 'modalityTable' not found in the fetched HTML.");
//                 return;
//             }

//             // Transpose and display the specified column
//             transposeAndDisplayColumn(expId, columnIndex, experimentTable, selectedExperiment);
//         })
//         .catch(error => console.error('Error fetching table:', error));
// }

// // Function to extract and transpose a specific column from the dynamically loaded table
// function transposeAndDisplayColumn(expId, columnIndex, experimentTable, selectedExperiment) {
//     // Locate the table within the specific experiment section
//     // Get rows of the table and transpose the specified column
//     const rows = Array.from(experimentTable.querySelectorAll('tr'));
//     const transposedData = rows.map(row => {
//         const cells = row.querySelectorAll('td, th');
//         return cells[columnIndex] ? cells[columnIndex].textContent.trim() : '';
//     });

//     // Create a display element for the transposed data
//     const transposedContainer = document.createElement('div');
//     transposedContainer.classList.add('transposed-column');
//     transposedData.forEach(item => {
//         const itemElement = document.createElement('p');
//         itemElement.textContent = item;
//         transposedContainer.appendChild(itemElement);
//     });

//     // Append the transposed column to the selected experiment section
//     selectedExperiment.appendChild(transposedContainer);
// }