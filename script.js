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
  
    // Load the main image
    const image = new Image();
    image.src = mainImage.src;
  
    image.onload = () => {
      const templateWidth = 1080; // Template's original width
      const templateHeight = 1350; // Template's original height
  
      const canvas = document.createElement("canvas");
      canvas.width = templateWidth;
      canvas.height = templateHeight;
      const ctx = canvas.getContext("2d");
  
      // Draw the template background
      html2canvas(template, {
        useCORS: true,
        backgroundColor: null, // Keep transparent background if needed
        scale: 1,
      }).then((templateCanvas) => {
        ctx.drawImage(templateCanvas, 0, 0);
  
        // Calculate cropping dimensions for the main image
        const mainImageWidth = mainImage.offsetWidth;
        const mainImageHeight = mainImage.offsetHeight;
  
        const scaleX = image.width / mainImageWidth;
        const scaleY = image.height / mainImageHeight;
  
        const cropWidth = templateWidth * scaleX;
        const cropHeight = (cropWidth * mainImageHeight) / mainImageWidth;
  
        const cropX = (image.width - cropWidth) / 2; // Center cropping horizontally
        const cropY = (image.height - cropHeight) / 2; // Center cropping vertically
  
        // Draw the cropped main image on the canvas
        ctx.drawImage(
          image,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          mainImageWidth,
          mainImageHeight
        );
  
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
  