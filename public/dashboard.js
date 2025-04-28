const resourceMethod = (event, resourceType, method) => {
  const parentElement = event.target.parentElement;
  const id = parentElement.dataset.id;
  const resourceDeleteForm = document.querySelector(
    `form.${resourceType}-${method}`,
  );

  if (id) {
    resourceDeleteForm.action += `/${id}`;
  }

  if (method === 'delete') {
    const resourceTitleSpan = document.querySelector(
      `span.modal-info.${resourceType}-name`,
    );
    resourceTitleSpan.textContent = parentElement.dataset.name;
  }

  const modal = document.querySelector(`dialog.${resourceType}-${method}`);
  modal.showModal();
};

const hanldeFolderRename = (event) => {
  resourceMethod(event, 'folder', 'rename');
};

const handleFileRename = (event) => {
  resourceMethod(event, 'file', 'rename');
};

const handleFolderDelete = (event) => {
  resourceMethod(event, 'folder', 'delete');
};

const handleFileDelete = (event) => {
  resourceMethod(event, 'file', 'delete');
};

const removeChildId = (resourceType, method) => {
  // remove child resource id from end of URL if it exists
  const form = document.querySelector(`form.${resourceType}-${method}`);
  const pathnameArr = new URL(form.action).pathname.split('/');
  if (pathnameArr.length === 5) {
    form.action = pathnameArr.slice(0, -1).join('/');
  }
  const modal = document.querySelector(`dialog.${resourceType}-${method}`);
  modal.close();
};

const handleFolderRenameClose = () => {
  removeChildId('folder', 'rename');
};

const handleFolderDeleteClose = () => {
  removeChildId('folder', 'delete');
};

const handleFileRenameClose = () => {
  removeChildId('file', 'rename');
};

const handleFileDeleteClose = () => {
  removeChildId('file', 'delete');
};

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

const folderRoleElem = document.querySelector('[data-folder-role]');
const folderRole = folderRoleElem.dataset.folderRole;
const folderList = document.querySelectorAll('li.folder');

if (folderRole === 'REGULAR' || folderList.length > 0) {
  // rename folder
  const folderRenameOpenButtons = document.querySelectorAll(
    'button.folder-rename-open',
  );
  folderRenameOpenButtons.forEach((folderRenameOpen) => {
    folderRenameOpen.addEventListener('click', hanldeFolderRename);
  });

  const folderRenameClose = document.querySelector(
    'button.folder-rename-close',
  );
  folderRenameClose.addEventListener('click', handleFolderRenameClose);

  // delete folder
  const folderDeleteOpenButtons = document.querySelectorAll(
    'button.folder-delete-open',
  );
  folderDeleteOpenButtons.forEach((folderDeleteOpen) => {
    folderDeleteOpen.addEventListener('click', handleFolderDelete);
  });

  const folderDeleteClose = document.querySelector(
    'button.folder-delete-close',
  );
  folderDeleteClose.addEventListener('click', handleFolderDeleteClose);
}

const fileList = document.querySelectorAll('li.file');
if (fileList.length > 0) {
  // rename file
  const fileRenameOpenButtons = document.querySelectorAll(
    'button.file-rename-open',
  );
  fileRenameOpenButtons.forEach((fileRenameOpen) => {
    fileRenameOpen.addEventListener('click', handleFileRename);
  });

  const fileRenameClose = document.querySelector('button.file-rename-close');
  fileRenameClose.addEventListener('click', handleFileRenameClose);

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

  // delete file
  const fileDeleteOpenButtons = document.querySelectorAll(
    'button.file-delete-open',
  );
  fileDeleteOpenButtons.forEach((fileDeleteOpen) => {
    fileDeleteOpen.addEventListener('click', handleFileDelete);
  });

  const fileDeleteClose = document.querySelector('button.file-delete-close');
  fileDeleteClose.addEventListener('click', () => handleFileDeleteClose);
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
