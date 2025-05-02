import prisma from '../config/prismaClient.js';
import { createClient } from '@supabase/supabase-js';
import path from 'node:path';
import fs from 'node:fs/promises';

const FILE_SIZE_LIMIT = 50000000;

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.STORAGE_URL, process.env.STORAGE_KEY);

const checkUserAuth = (req, res, next) => {
  if (!req.user) {
    console.log('user not logged in');
    res.status(401).redirect('/login');
    return;
  }
  next();
};

const dashboardGet = async (req, res) => {
  res.redirect(`/dashboard/${req.user.root.id}`);
};

// get current folder for dashboard
const getCurrentFolder = async (req, res, next) => {
  const folder = await prisma.folder.findUniqueOrThrow({
    where: {
      id: req.params.currentFolderId,
      ownerId: req.user.id,
    },
    include: {
      folders: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      files: {
        orderBy: {
          uploadedAt: 'asc',
        },
      },
    },
  });

  res.locals.currentFolder = folder;
  next();
};

const getParentFoldersNav = async (req, res) => {
  const { currentFolder } = res.locals;
  const parentFolders = [];

  if (req.user.root.id !== currentFolder.id) {
    let parentId = currentFolder.parentId;
    const folders = [];
    for (let i = 0; i < 3; i++) {
      const parentFolder = await prisma.folder.findUniqueOrThrow({
        where: {
          id: parentId,
        },
      });
      if (parentFolder.id === req.user.root.id) break;
      folders.push(parentFolder);
      parentId = parentFolder.parentId;
    }
    folders.reverse();
    parentFolders.push(req.user.root, ...folders);
  }

  if (parentFolders.length === 4) {
    parentFolders[1].name = '...';
  }

  res.render('dashboard', {
    title: 'Dashboard',
    script: 'dashboard.js',
    folder: currentFolder,
    folders: currentFolder.folders,
    files: currentFolder.files,
    parentFolders,
  });
};

const dashboardCurrentFolderIdGet = [getCurrentFolder, getParentFoldersNav];

const folderCreatePost = async (req, res) => {
  await prisma.folder.update({
    where: {
      id: req.params.currentFolderId,
      ownerId: req.user.id,
    },
    data: {
      folders: {
        create: {
          name: req.body.newFolderName,
          ownerId: req.user.id,
        },
      },
    },
  });
  res.redirect(`/dashboard/${req.params.currentFolderId}`);
};

const folderRenamePost = async (req, res) => {
  // cannot rename root folder
  if (req.params.currentFolderId === req.user.root.id) {
    res.redirect(`/dashboard/${req.user.root.id}`);
    return;
  }

  await prisma.folder.update({
    where: {
      id: req.params.currentFolderId,
      ownerId: req.user.id,
    },
    data: {
      name: req.body.folderRename,
    },
  });
  res.redirect(`/dashboard/${req.params.currentFolderId}`);
};

const folderDeletePost = async (req, res) => {
  // cannot delete root folder
  if (req.params.currentFolderId === req.user.root.id) {
    res.redirect(`/dashboard/${req.user.root.id}`);
    return;
  }

  const { parentId } = await prisma.folder.findUniqueOrThrow({
    where: {
      id: req.params.currentFolderId,
      ownerId: req.user.id,
    },
    select: {
      parentId: true,
    },
  });

  await prisma.folder.delete({
    where: {
      id: req.params.currentFolderId,
      ownerId: req.user.id,
    },
  });

  res.redirect(`/dashboard/${parentId}`);
};

// upload file
const validateFileSize = async (req, res, next) => {
  const filePath = path.resolve(`uploads/${req.file.filename}`);
  if (req.file.size > FILE_SIZE_LIMIT) {
    console.error(
      'File cannot be uploaded due to it being greater than the file size limit',
    );
    await fs.rm(filePath);
    res.redirect('/dashboard');
    return;
  }
  res.locals.filePath = filePath;
  next();
};

const uploadToStorage = async (req, res, next) => {
  const { filePath } = res.locals;
  const file = await fs.readFile(filePath);
  const { data, error } = await supabase.storage
    .from('files')
    .upload(`${req.user.id}/${req.file.filename}`, file, {
      contentType: `${req.file.mimetype}`,
    });

  if (data) {
    res.locals.storagePath = data.path;
    next();
  } else if (error) {
    console.error(error);
    throw new Error('Storage upload error');
  }
};

const insertToDatabase = async (req, res) => {
  const { storagePath, filePath } = res.locals;
  const { data } = supabase.storage
    .from('files')
    .getPublicUrl(storagePath, { download: req.file.originalname });

  await prisma.folder.update({
    where: {
      id: req.params.currentFolderId,
      ownerId: req.user.id,
    },
    data: {
      files: {
        create: {
          id: req.file.filename,
          name: req.file.originalname,
          path: data.publicUrl,
          size: req.file.size,
          mimetype: req.file.mimetype,
          ownerId: req.user.id,
        },
      },
    },
  });

  await fs.rm(filePath);
  res.redirect(`/dashboard/${req.params.currentFolderId}`);
};

const fileUploadPost = [validateFileSize, uploadToStorage, insertToDatabase];

const childFolderRenamePost = async (req, res) => {
  await prisma.folder.update({
    where: {
      id: req.params.childFolderId,
      parentId: req.params.currentFolderId,
      ownerId: req.user.id,
    },
    data: {
      name: req.body.folderRename,
    },
  });
  res.redirect(`/dashboard/${req.params.currentFolderId}`);
};

const childFolderDeletePost = async (req, res) => {
  await prisma.folder.delete({
    where: {
      id: req.params.childFolderId,
      parentId: req.params.currentFolderId,
      ownerId: req.user.id,
    },
  });
  res.redirect(`/dashboard/${req.params.currentFolderId}`);
};

const fileRenamePost = async (req, res) => {
  const { data } = supabase.storage
    .from('files')
    .getPublicUrl(`${req.user.id}/${req.params.fileId}`, {
      download: req.body.fileRename,
    });

  await prisma.file.update({
    where: {
      id: req.params.fileId,
      parentId: req.params.currentFolderId,
      ownerId: req.user.id,
    },
    data: {
      name: req.body.fileRename,
      path: data.publicUrl,
    },
  });
  res.redirect(`/dashboard/${req.params.currentFolderId}`);
};

const fileDeletePost = async (req, res) => {
  const { error } = await supabase.storage
    .from('files')
    .remove([`${req.user.id}/${req.params.fileId}`]);

  if (error) {
    console.error(error);
    throw new Error('Error removing file from storage');
  }

  await prisma.file.delete({
    where: {
      id: req.params.fileId,
      parentId: req.params.currentFolderId,
      ownerId: req.user.id,
    },
  });
  res.redirect(`/dashboard/${req.params.currentFolderId}`);
};

export default {
  checkUserAuth,
  dashboardGet,
  dashboardCurrentFolderIdGet,
  folderCreatePost,
  folderRenamePost,
  folderDeletePost,
  fileUploadPost,
  childFolderRenamePost,
  childFolderDeletePost,
  fileRenamePost,
  fileDeletePost,
};
