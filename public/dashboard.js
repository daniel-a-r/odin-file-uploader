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

const folderList = document.querySelectorAll('li.folder');
// if (folderList.length > 0) {

// }

const fileList = document.querySelectorAll('li.file');
if (fileList.length > 0) {
  // open file details modal
  const fileDetailsOpenButtons = document.querySelectorAll(
    'button.file-details-open',
  );
  const fileDetailsModal = document.querySelector('dialog.file-details');
  fileDetailsOpenButtons.forEach((fileDetailsOpen) => {
    fileDetailsOpen.addEventListener('click', (e) => {
      const parent = e.target.parentElement;

      const fileNameElem = document.querySelector('p.modal-info.file-name');
      fileNameElem.textContent = parent.dataset.name;

      const fileSizeElem = document.querySelector('p.modal-info.file-size');
      fileSizeElem.textContent = parent.dataset.size;

      const fileUploadedAtElem = document.querySelector(
        'p.modal-info.file-uploaded-at',
      );
      fileUploadedAtElem.textContent = new Date(parent.dataset.uploadedAt);

      fileDetailsModal.showModal();
    });
  });

  // close file details modal
  const fileDetailsClose = document.querySelector('button.file-details-close');
  fileDetailsClose.addEventListener('click', () => {
    fileDetailsModal.close();
  });
}

const dropdownToggleButtons = document.querySelectorAll(
  'button.dropdown-toggle',
);
if (dropdownToggleButtons.length > 0) {
  // add event listeners to dropdown toggle buttons
  dropdownToggleButtons.forEach((dropdownToggle) => {
    dropdownToggle.addEventListener('click', (e) => {
      const openDropdownActions = document.querySelector(
        'div.dropdown-actions.open',
      );
      const dropdownActions = e.target.nextElementSibling;

      // if dropdown is already open and not the toggle button currently clicked
      // close the dropdown
      if (openDropdownActions && openDropdownActions !== dropdownActions) {
        openDropdownActions.style.display = 'none';
        openDropdownActions.classList.remove('open');
      }

      dropdownActions.classList.add('open');

      const display = window.getComputedStyle(dropdownActions).display;
      dropdownActions.style.display = display === 'none' ? 'block' : 'none';
    });
  });

  // close dropdown when clicking on element that is not a dropdown toggle button
  window.addEventListener('click', (e) => {
    if (!Array.from(dropdownToggleButtons).includes(e.target)) {
      const openDropdownActions = document.querySelector(
        'div.dropdown-actions.open',
      );
      if (openDropdownActions) {
        openDropdownActions.style.display = 'none';
        openDropdownActions.classList.remove('open');
      }
    }
  });
}
