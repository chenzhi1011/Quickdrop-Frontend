const backendBaseUrl = "https://quickdrop-habi.onrender.com"; 
const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
let currentFile = null;

// drag listingevent
uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("dragover");
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    fileInput.files = files;
    currentFile = files[0];
  }
});

uploadArea.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  currentFile = fileInput.files[0];
});

function uploadFile() {
  if (!currentFile) {
    alert("Please select a file first.");
    return;
  }

  document.getElementById("loading").style.display = "block";
  const formData = new FormData();
  formData.append("file", currentFile);

  fetch(backendBaseUrl + "/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("loading").style.display = "none";
      const downloadUrl = backendBaseUrl + "/download/" + data.token;

      document.getElementById("result").style.display = "block";
      const linkElem = document.getElementById("downloadLink");
      linkElem.textContent = downloadUrl;
      linkElem.href = downloadUrl;

      document.getElementById("qrcode").innerHTML = "";
      new QRCode(document.getElementById("qrcode"), {
        text: downloadUrl,
        width: 160,
        height: 160,
      });
    })
    .catch((err) => {
      document.getElementById("loading").style.display = "none";
      console.error(err);
      alert("Upload failed.");
    });
}

function copyLink() {
  const link = document.getElementById("downloadLink").href;
  navigator.clipboard
    .writeText(link)
    .then(() => alert("Link copied to clipboard!"))
    .catch(() => alert("Copy failed."));
}