const uploadContainers = document.querySelectorAll('.upload-container');
const saveBtn = document.querySelector('.save_button');


function getFileInfo(file) {
  const { name, size } = file;
  const extension = name.split('.').pop();
  return `
    <div class="file-upload-state"> 
      <div class="file-details">
        <div class="file-type">
          <img src="RET/${extension}.svg" alt="" class='file-image'>
        </div>
        <div class="file-name">
          <div class="file-nomination"><p>${name}</p></div>
          <div class="file-upload-information"><p>0% uploaded</p></div>
        </div>
      </div>
      <div class="upload-stop">
        <button class="stop_upload_btn">
          <img src="RET/action.svg" alt="Stop_icon">
        </button>
      </div>
      <div class="upload-progress">
        <div class="upload-progress-lite"></div>
      </div>
    </div>
  `;
}

function handleFileUploading(file, container) {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  formData.append("file", file);

  xhr.upload.addEventListener('progress', e => {
    const progressBar = container.querySelector('.upload-progress-lite');
    const progressText = container.querySelector('.file-upload-information p');
    if (!progressBar || !progressText) return;

    const progress = (e.loaded / e.total) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.innerText = `${progress.toFixed(0)}%`;

    if (e.loaded === e.total) {
      if (e.total >= 1024 * 1024) progressText.innerText = `${(e.total / (1024*1024)).toFixed(2)} MB`;
      else if (e.total >= 1024) progressText.innerText = `${(e.total / 1024).toFixed(2)} KB`;
      else progressText.innerText = `${e.total} Bytes`;

      container.dataset.upload_confirmed = 'true';
      checkAllUploadCompleted();
    }
  });

  xhr.open('POST','https://httpbin.org/post', true);
  xhr.send(formData);
}
function checkAllUploadCompleted()
{
    const Check_for_button = Array.from(uploadContainers).every(c=>c.dataset.upload_confirmed === 'true');
    if (Check_for_button)
    {
        saveBtn.disabled = false;
    }
    else
    {
     saveBtn.disabled = true;
    }
}

uploadContainers.forEach(container => {
    saveBtn.disabled = true;
  const fileInput = container.querySelector('.fileinput');
  const uploadIconBtn = container.querySelector('.upload-icon-btn');
  const fileExplorerBtn = container.querySelector('.file-explorer-btn');
  const uploadBox = container.querySelector('.upload-box');

  let hasFile = false;
  let actualFileName = null;
  let actualFileSize = null;

  function handleFiles(files) {
    if (!files.length) return;

    const file = files[0];
    const extension = file.name.split('.').pop();
    const allowed = ['pdf','jpg','png'];

    if (!allowed.includes(extension)) {
      swal('Do not upload files other than pdf, jpg, png');
      return;
    }

    if (hasFile && file.name === actualFileName && file.size === actualFileSize) return;

    if (hasFile) {
      swal("Only upload one file at a time. Delete the previous file first.");
      return;
    }

    container.insertAdjacentHTML('beforeend', getFileInfo(file));
    actualFileName = file.name;
    actualFileSize = file.size;
    hasFile = true;

    handleFileUploading(file, container);
  }

  fileInput.addEventListener('change', e => {
    handleFiles(e.target.files);
    fileInput.value = '';
  });

  uploadIconBtn.addEventListener('click', () => fileInput.click());
  fileExplorerBtn.addEventListener('click', () => fileInput.click());

  uploadBox.addEventListener('dragover', e => {
    e.preventDefault();
    uploadBox.classList.add('highlight');
  });

  uploadBox.addEventListener('dragleave', () => uploadBox.classList.remove('highlight'));

  uploadBox.addEventListener('drop', e => {
    e.preventDefault();
    uploadBox.classList.remove('highlight');
    handleFiles(e.dataTransfer.files);
  });

  container.addEventListener('click', e => {
    if (e.target.closest(".stop_upload_btn") && hasFile) {
      const fileUploaded = container.querySelector('.file-upload-state');
      if (fileUploaded) fileUploaded.remove();
      hasFile = false;
      actualFileName = null;
      actualFileSize = null;
    }
  });
});
