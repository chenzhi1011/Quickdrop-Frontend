const backendBaseUrl = "https://quickdrop-habi.onrender.com";
const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const resultDiv = document.getElementById("result");
const downloadLink = document.getElementById("downloadLink");
const loadingDiv = document.getElementById("loading");
const qrCodeDiv = document.getElementById("qrcode");
const fileInfoDiv = document.getElementById("fileInfo");

let currentFile = null;

// === drag event ===
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
    showFileInfo(currentFile);
  }
});

// === click upload area===
uploadArea.addEventListener("click", () => {
  fileInput.click();
});

// === file selected ===
fileInput.addEventListener("change", () => {
  currentFile = fileInput.files[0];
  if (currentFile) {
    showFileInfo(currentFile);
  }
});

// === show file details ===
function showFileInfo(file) {
  const sizeKB = (file.size / 1024).toFixed(1);
  fileInfoDiv.innerHTML = `📄 <strong>${file.name}</strong>（${sizeKB} KB）<br>⬆️ アップロードボタンをクリックしてください`;
  fileInfoDiv.style.display = "block";
  resultDiv.style.display = "none";
  qrCodeDiv.innerHTML = "";
}

// === upload file ===
function uploadFile() {
  if (!currentFile) {
    alert("Please select a file first.");
    return;
  }

  loadingDiv.style.display = "block";
  resultDiv.style.display = "none";
  qrCodeDiv.innerHTML = "";

  const formData = new FormData();
  formData.append("file", currentFile);

  fetch(`${backendBaseUrl}/upload`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      loadingDiv.style.display = "none";

      const downloadUrl = `${backendBaseUrl}/download/${data.token}`;
      downloadLink.textContent = downloadUrl;
      downloadLink.href = downloadUrl;
      resultDiv.style.display = "block";

      new QRCode(qrCodeDiv, {
        text: downloadUrl,
        width: 160,
        height: 160,
      });
    })
    .catch((err) => {
      loadingDiv.style.display = "none";
      console.error(err);
      alert("Upload failed.");
    });
}

// === copy link ===
function copyLink() {
  const link = downloadLink.href;
  navigator.clipboard
    .writeText(link)
    .then(() => alert("Link copied to clipboard!"))
    .catch(() => alert("Copy failed."));
}