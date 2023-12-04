const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

// The URL of the image to download

// The path of the directory to save the image
const dirPath = "./images";

// The name of the image file
const fileName = "image.jpg";

// Create the directory if it does not exist
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

// Use fetch to get the image data as a buffer
const downloadImage = (imageURL) => {
    fetch(imageURL)
        .then((response) => response.buffer())
        .then((buffer) => {
            // Write the buffer to a file
            fs.writeFile(path.join(dirPath, fileName), buffer, (err) => {
                if (err) {
                    console.error(err); const axios = require("axios");
                    const fs = require("fs");
                    const path = require("path");

                    // The path of the directory to save the image
                    const dirPath = "./images";

                    // The name of the image file
                    const fileName = "image.jpg";

                    // Create the directory if it does not exist
                    if (!fs.existsSync(dirPath)) {
                        fs.mkdirSync(dirPath);
                    }

                    const downloadImage = async (imageURL) => {
                        try {
                            const response = await axios.get(imageURL, { responseType: 'arraybuffer' });
                            console.log("🚀 ~ file: index.js:44 ~ downloadImage ~ response :", response);

                            // Write the buffer to a file
                            fs.writeFileSync(path.join(dirPath, fileName), Buffer.from(response.data), (err) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    // console.log("Image downloaded successfully");
                                }
                            });
                        } catch (error) {
                            // console.error("Error fetching image:", error.message);
                        }
                    };
                } else {
                    // console.log("Image downloaded successfully");
                }
            });
        })
        .catch((error) => {
        });
}
module.exports = {
    downloadImage
}