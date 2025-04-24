const newFolderModal = document.querySelector('dialog.new-folder-dialog');
const newFolderModalOpenBtn = document.querySelector('button.new-folder-open');
const newFolderModalClosebtn = document.querySelector(
  'button.new-folder-close',
);
const newFolderSubmitBtn = document.querySelector('button.new-folder-submit');

newFolderModalOpenBtn.addEventListener('click', () => {
  newFolderModal.showModal();
});

newFolderModalClosebtn.addEventListener('click', () => {
  newFolderModal.close();
});

newFolderModal.addEventListener('submit', () => {
  console.log(window.location.pathname);
});
