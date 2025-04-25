const newFolderModal = document.querySelector('dialog.new-folder');
const newFolderModalOpenButtons = document.querySelectorAll(
  'button.new-folder-open',
);
const newFolderClose = document.querySelector('button.new-folder-close');
const folderActionsToggle = document.querySelector(
  'button.folder-actions-toggle',
);
const folderActions = document.querySelector('div.folder-actions');
const folderRenameModal = document.querySelector('dialog.folder-rename');
const folderRenameOpen = document.querySelector('button.folder-rename-open');
const folderRenameClose = document.querySelector('button.folder-rename-close');

newFolderModalOpenButtons.forEach((button) => {
  button.addEventListener('click', () => {
    newFolderModal.showModal();
  });
});

newFolderClose.addEventListener('click', () => {
  newFolderModal.close();
});

newFolderModal.addEventListener('submit', () => {
  console.log(window.location.pathname);
});

folderActionsToggle.addEventListener('click', () => {
  const display = window.getComputedStyle(folderActions).display;
  folderActions.style.display = display === 'none' ? 'block' : 'none';
});

window.addEventListener('click', (e) => {
  if (e.target !== folderActionsToggle) {
    const display = window.getComputedStyle(folderActions).display;
    if (display === 'block') {
      folderActions.style.display = 'none';
    }
  }
});

folderRenameOpen.addEventListener('click', () => {
  folderRenameModal.showModal();
});

folderRenameClose.addEventListener('click', () => {
  folderRenameModal.close();
});
