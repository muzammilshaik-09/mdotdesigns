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
        userImage.src = e.target.result;
        userImage.style.objectFit = "cover"
      };
      reader.readAsDataURL(file);
    } else {
      userImage.src = "default.jpg"; // Default placeholder image
    }
  }
  
  document.getElementById("downloadButton").addEventListener("click", () => {
    const template = document.getElementById("template");
    const mainImage = document.getElementById("userImage");
  
    const canvas = document.createElement("canvas");
    canvas.width = 1080; // Width of the template
    canvas.height = 1350; // Height of the template
    const ctx = canvas.getContext("2d");
  
    // Load the main image
    const image = new Image();
    image.src = mainImage.src;
  
    image.onload = () => {
      // Calculate the cropped area for object-fit: cover
      const aspectRatioTemplate = 1046 / 864; // Main image width/height ratio
      const aspectRatioImage = image.width / image.height;
  
      let cropWidth, cropHeight, cropX, cropY;
      if (aspectRatioImage > aspectRatioTemplate) {
        // Image is wider than the template's aspect ratio
        cropHeight = image.height;
        cropWidth = cropHeight * aspectRatioTemplate;
        cropX = (image.width - cropWidth) / 2;
        cropY = 0;
      } else {
        // Image is taller than the template's aspect ratio
        cropWidth = image.width;
        cropHeight = cropWidth / aspectRatioTemplate;
        cropX = 0;
        cropY = (image.height - cropHeight) / 2;
      }
  
      // Draw the cropped main image
      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        17, // X position on template canvas
        80, // Y position on template canvas
        1046, // Main image width on template
        864 // Main image height on template
      );
  
      // Render the rest of the template using html2canvas
      html2canvas(template, {
        useCORS: true,
        backgroundColor: null,
        ignoreElements: (element) => element.id === "userImage", // Ignore the placeholder
      }).then((templateCanvas) => {
        ctx.drawImage(templateCanvas, 0, 0);
  
        // Download the final template
        const finalImage = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "NewYearTemplate.png";
        link.href = finalImage;
        link.click();
      });
    };
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
  