function generateTemplate() {
  const imageInput = document.getElementById("imageInput");
  const nameInput = document.getElementById("nameInput");
  const userImage = document.getElementById("userImage");
  const userName = document.getElementById("userName");

  // Update name
  const name = nameInput.value.trim();
  userName.textContent = name ? name : "Your Name";

  // Update image
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.src = e.target.result;

      image.onload = () => {
        // Crop the image based on width only
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const targetWidth = 1046; // Template's main image width
        const targetHeight = 864; // Template's main image height

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const scaleFactor = targetHeight / image.height; // Scale by height to fit
        const scaledWidth = image.width * scaleFactor;

        const cropX = (scaledWidth - targetWidth) / 2; // Center the crop horizontally

        context.drawImage(
          image,
          cropX / scaleFactor, // Adjust crop position based on scaling
          0,
          targetWidth / scaleFactor, // Only crop width
          image.height, // Keep full height
          0,
          0,
          targetWidth,
          targetHeight
        );

        // Replace the original userImage with the cropped version
        userImage.src = canvas.toDataURL("image/png");
      };
    };
    reader.readAsDataURL(file);
  } else {
    userImage.src = "default.jpg"; // Default placeholder image
  }
}

document.getElementById("downloadButton").addEventListener("click", () => {
  const template = document.getElementById("template");

  html2canvas(template, { useCORS: true }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "NewYearTemplate.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

  
  document.getElementById("shareButton").addEventListener("click", () => {
    const template = document.getElementById("template");
  
    html2canvas(template, { useCORS: true }).then((canvas) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], "NewYearTemplate.png", { type: "image/png" });
  
        const text = `Check out this amazing New Year template I created! Let's celebrate together with beautiful memories. 🎉`;
  
        if (navigator.share) {
          navigator
            .share({
              title: "Happy New Year Template",
              text,
              files: [file],
            })
            .then(() => console.log("Shared successfully!"))
            .catch((error) => console.error("Error sharing:", error));
        } else {
          alert("Your browser does not support the Web Share API!");
        }
      });
    });
  });
  