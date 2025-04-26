const folderRoleElem = document.querySelector('[data-folder-role]');
const folderRole = folderRoleElem.dataset.folderRole;

// folder create
const folderCreateModal = document.querySelector('dialog.folder-create');
const folderCreateModalOpenButtons = document.querySelectorAll(
  'button.folder-create-open',
);
folderCreateModalOpenButtons.forEach((folderCreateOpen) => {
  folderCreateOpen.addEventListener('click', () => {
    folderCreateModal.showModal();
  });
});

const folderCreateClose = document.querySelector('button.folder-create-close');
folderCreateClose.addEventListener('click', () => {
  folderCreateModal.close();
});

// file upload
const fileUploadModal = document.querySelector('dialog.file-upload');
const fileUploadModalOpenButtons = document.querySelectorAll(
  'button.file-upload-open',
);
fileUploadModalOpenButtons.forEach((fileUploadOpen) => {
  fileUploadOpen.addEventListener('click', () => {
    fileUploadModal.showModal();
  });
});

const fileUploadClose = document.querySelector('button.file-upload-close');
fileUploadClose.addEventListener('click', () => {
  fileUploadModal.close();
});

const fileUploadForm = document.querySelector('form[enctype]');
fileUploadForm.addEventListener('submit', () => {
  const timestamp = document.querySelector('input[type="hidden"]');
  timestamp.value = new Date();
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
