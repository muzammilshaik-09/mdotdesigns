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
  
    // Calculate the cropping dimensions
    const image = new Image();
    image.src = mainImage.src;
  
    image.onload = () => {
      const templateRect = template.getBoundingClientRect();
      const mainImageRect = mainImage.getBoundingClientRect();
  
      const scaleX = image.width / mainImageRect.width;
      const scaleY = image.height / mainImageRect.height;
  
      const cropWidth = templateRect.width * scaleX;
      const cropHeight = templateRect.height * scaleY;
  
      const cropX = (image.width - cropWidth) / 2;
      const cropY = (image.height - cropHeight) / 2;
  
      html2canvas(template, {
        useCORS: true,
        onclone: (clonedDoc) => {
          const clonedImage = clonedDoc.getElementById("userImage");
  
          // Remove the original object-fit styles
          clonedImage.style.objectFit = "none";
          clonedImage.style.objectPosition = "0 0";
          clonedImage.style.width = `${templateRect.width}px`;
          clonedImage.style.height = `${templateRect.height}px`;
  
          // Set crop area explicitly (this ensures the correct area is rendered)
          const canvas = document.createElement("canvas");
          canvas.width = cropWidth;
          canvas.height = cropHeight;
  
          const ctx = canvas.getContext("2d");
          ctx.drawImage(
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
  
          // Replace the cloned image with the manually cropped version
          clonedImage.src = canvas.toDataURL("image/png");
        },
      }).then((canvas) => {
        const link = document.createElement("a");
        link.download = "NewYearTemplate.png";
        link.href = canvas.toDataURL("image/png");
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
  