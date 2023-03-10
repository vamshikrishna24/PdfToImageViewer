// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.worker.min.js';
const pdfImages = document.getElementById('pdf-images');
const pdfFile = document.getElementById('pdf-file');

const selectedImages = [];

// Listen for file input changes
pdfFile.addEventListener('change', function (event) {
	var file = event.target.files[0];

	// Load the PDF file
	pdfjsLib.getDocument(URL.createObjectURL(file)).promise.then(function (pdf) {
		// Loop through each page of the PDF file
		for (let i = 1; i <= pdf.numPages; i++) {
			pdf.getPage(i).then(function (page) {
				// Create a canvas element for each page

				var canvas = document.createElement('canvas');
				var context = canvas.getContext('2d');
				var viewport = page.getViewport({ scale: 1.5 });
				canvas.width = viewport.width;
				canvas.height = viewport.height;



				// Render the page onto the canvas
				page.render({ canvasContext: context, viewport: viewport }).promise.then(function () {

					// Convert the canvas to an image and set its source to the data URL
					const scri = canvas.toDataURL();
					const imageDiv = document.createElement('div');
					imageDiv.classList.add('image-div');
					imageDiv.innerHTML = `
							<img src="${scri}" alt=""  class="image" onclick = "changeImage(this)">
							<div class="image-footer">
								<p>${i}</p>
								<input type="checkbox" class="checkbox" onclick="toggleSelection(this)"">
							</div>
					`
					pdfImages.append(imageDiv)


				});
			});
		}
	});
});

function changeImage(image) {
	const mainImg = document.querySelector('.preview img');
	mainImg.src = image.src;
}

function toggleSelection(checkbox) {
	const parentEl = checkbox.parentNode.parentNode;
	const imgEl = parentEl.querySelector('.image')
	if (checkbox.checked) {
		selectedImages.push(imgEl);
	} else {
		const index = selectedImages.indexOf(imgEl);
		if (index !== -1) {
			selectedImages.splice(index, 1);
		}
	}
	console.log(selectedImages);
}


function renderSelectedImages() {
	const imageContainer = document.getElementById('selected-image-container');
	imageContainer.innerHTML = '';
	selectedImages.forEach(function (image) {
		const newImage = document.createElement('img');
		newImage.src = image.src;
		newImage.alt = image.alt;
		newImage.className = 'selected-image';
		imageContainer.appendChild(newImage);
	});
}

