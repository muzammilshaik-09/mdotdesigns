let isPlacing = false;

function enablePlacing() {
  const userImage = document.getElementById("userImage");

  // Enable dragging
  userImage.style.cursor = "grab";
  isPlacing = true;

  let offsetX = 0, offsetY = 0, startX = 0, startY = 0;

  userImage.onmousedown = (e) => {
    if (!isPlacing) return;

    startX = e.clientX;
    startY = e.clientY;

    const rect = userImage.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    userImage.style.cursor = "grabbing";

    document.onmousemove = (e) => {
      if (!isPlacing) return;

      const template = document.getElementById("template").getBoundingClientRect();

      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;

      // Constrain within template boundaries
      newX = Math.max(template.left, Math.min(newX, template.right - rect.width));
      newY = Math.max(template.top, Math.min(newY, template.bottom - rect.height));

      userImage.style.left = `${newX - template.left}px`;
      userImage.style.top = `${newY - template.top}px`;
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      userImage.style.cursor = "grab";
    };
  };
}

document.getElementById("placeButton").addEventListener("click", () => {
  enablePlacing();
});

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
        // Crop the image based on the "cover" logic
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const aspectRatioTemplate = 1046 / 864; // Template width/height
        const aspectRatioImage = image.width / image.height;

        let cropWidth, cropHeight, cropX, cropY;
        if (aspectRatioImage > aspectRatioTemplate) {
          cropHeight = image.height;
          cropWidth = cropHeight * aspectRatioTemplate;
          cropX = (image.width - cropWidth) / 2;
          cropY = 0;
        } else {
          cropWidth = image.width;
          cropHeight = cropWidth / aspectRatioTemplate;
          cropX = 0;
          cropY = (image.height - cropHeight) / 2;
        }

        canvas.width = 1046; // Main image width in the template
        canvas.height = 864; // Main image height in the template
        context.drawImage(
          image,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          canvas.width,
          canvas.height
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
  
