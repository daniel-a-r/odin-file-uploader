const folderRoleElem = document.querySelector('[data-folder-role]');
const folderRole = folderRoleElem.dataset.folderRole;

const newFolderModal = document.querySelector('dialog.new-folder');
const newFolderModalOpenButtons = document.querySelectorAll(
  'button.new-folder-open',
);
newFolderModalOpenButtons.forEach((button) => {
  button.addEventListener('click', () => {
    newFolderModal.showModal();
  });
});

const newFolderClose = document.querySelector('button.new-folder-close');
newFolderClose.addEventListener('click', () => {
  newFolderModal.close();
});

if (folderRole === 'REGULAR') {
  // toggle folder actions dropdown
  const folderActions = document.querySelector('div.folder-actions');
  const folderActionsToggle = document.querySelector(
    'button.folder-actions-toggle',
  );

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

  // rename folder
  const folderRenameModal = document.querySelector('dialog.folder-rename');
  const folderRenameOpen = document.querySelector('button.folder-rename-open');
  const folderRenameClose = document.querySelector(
    'button.folder-rename-close',
  );

  folderRenameOpen.addEventListener('click', () => {
    folderRenameModal.showModal();
  });

  folderRenameClose.addEventListener('click', () => {
    folderRenameModal.close();
  });

  // delete folder
  const folderDeleteOpen = document.querySelector('button.folder-delete-open');
  const folderDeleteModal = document.querySelector('dialog.folder-delete');
  const folderDeleteClose = document.querySelector(
    'button.folder-delete-close',
  );

  folderDeleteOpen.addEventListener('click', () => {
    folderDeleteModal.showModal();
  });

  folderDeleteClose.addEventListener('click', () => {
    folderDeleteModal.close();
  });
}
