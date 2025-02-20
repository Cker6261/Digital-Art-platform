// Load AWS SDK
const AWS = require('aws-sdk');

// AWS Configuration
AWS.config.update({
    accessKeyId: 'pinterest-s3-user',   // Replace with your AWS Access Key
    secretAccessKey: 'Chirag@6261', // Replace with your AWS Secret Key
    region: 'eu-north-1' // Replace with your AWS Region (e.g., us-east-1)
});

const s3 = new AWS.S3();
const bucketName = 'pinterest-clone-bucket';

// Upload Image to S3
const uploadFile = async () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file!");
        return;
    }

    const params = {
        Bucket: bucketName,
        Key: `uploads/${Date.now()}_${file.name}`,
        Body: file,
        ACL: "public-read",
        ContentType: file.type
    };

    try {
        const { Location } = await s3.upload(params).promise();
        console.log("File uploaded successfully:", Location);
        alert("Upload successful!");

        // Display the uploaded image
        createCard(Location);
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("Upload failed!");
    }
};

// Function to Create Image Cards
const createCard = (imageUrl) => {
    const container = document.getElementById('container');
    const cols = Array.from(container.getElementsByClassName('col'));

    const card = document.createElement('div');
    card.classList.add('card');

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = "Uploaded Image";
    img.style.width = "100%";

    img.onerror = function () {
        this.parentElement.style.display = "none";
    };

    card.appendChild(img);
    cols[Math.floor(Math.random() * cols.length)].appendChild(card);
};

// Fetch Images from S3
const fetchImages = async () => {
    const params = { Bucket: bucketName };

    try {
        const { Contents } = await s3.listObjectsV2(params).promise();

        const imageUrls = Contents.map(item => `https://${bucketName}.s3.amazonaws.com/${item.Key}`);
        imageUrls.forEach(createCard);
    } catch (error) {
        console.error("Error fetching images:", error);
    }
};

fetchImages();
