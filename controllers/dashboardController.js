import prisma from '../config/prismaClient.js';
import path from 'node:path';

const dashboardGet = async (req, res) => {
  res.redirect(`/dashboard/${req.user.root.id}`);
};

const dashboardCurrentFolderIdGet = async (req, res, next) => {
  try {
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

    const parentFolders = [];

    if (req.user.root.id !== folder.id) {
      let parentId = folder.parentId;
      const folders = [];
      for (let i = 0; i < 3; i++) {
        const parentFolder = await prisma.folder.findUnique({
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
      folder: folder,
      folders: folder.folders,
      files: folder.files,
      parentFolders,
    });
  } catch (error) {
    console.error(error);
    next();
  }
};

const folderCreatePost = async (req, res) => {
  await prisma.folder.create({
    data: {
      name: req.body.newFolderName,
      ownerId: req.user.id,
      parentId: req.params.currentFolderId,
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

  try {
    await prisma.folder.update({
      where: {
        id: req.params.currentFolderId,
      },
      data: {
        name: req.body.folderRename,
      },
    });
    res.redirect(`/dashboard/${req.params.currentFolderId}`);
  } catch (error) {
    console.error(error);
  }
};

const folderDeletePost = async (req, res) => {
  // cannot delete root folder
  if (req.params.currentFolderId === req.user.root.id) {
    res.redirect(`/dashboard/${req.user.root.id}`);
    return;
  }

  try {
    const { parentId } = await prisma.folder.findUnique({
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
  } catch (error) {
    console.error(error);
  }
};

const fileUploadPost = async (req, res) => {
  const filePath = path.resolve(req.file.path);
  try {
    await prisma.file.create({
      data: {
        name: req.file.originalname,
        path: filePath,
        size: req.file.size,
        parentId: req.params.currentFolderId,
        ownerId: req.user.id,
      },
    });
    res.redirect(`/dashboard/${req.params.currentFolderId}`);
  } catch (error) {
    console.error(error);
  }
};

const childFolderRenamePost = async (req, res) => {
  try {
    await prisma.folder.update({
      where: {
        id: req.params.childFolderId,
        parentId: req.params.currentFolderId,
      },
      data: {
        name: req.body.folderRename,
      },
    });
    res.redirect(`/dashboard/${req.params.currentFolderId}`);
  } catch (error) {
    console.error(error);
  }
};

const childFolderDeletePost = async (req, res) => {
  try {
    await prisma.folder.delete({
      where: {
        id: req.params.childFolderId,
        parentId: req.params.currentFolderId,
      },
    });
    res.redirect(`/dashboard/${req.params.currentFolderId}`);
  } catch (error) {
    console.error(error);
  }
};

const fileRenamePost = async (req, res, next) => {
  try {
    await prisma.file.update({
      where: {
        id: req.params.fileId,
        parentId: req.params.currentFolderId,
        ownerId: req.user.id,
      },
      data: {
        name: req.body.fileRename,
      },
    });
    res.redirect(`/dashboard/${req.params.currentFolderId}`);
  } catch (error) {
    console.error(error);
    next();
  }
};

const fileDeletePost = async (req, res, next) => {
  try {
    await prisma.file.delete({
      where: {
        id: req.params.fileId,
        parentId: req.params.currentFolderId,
        ownerId: req.user.id,
      },
    });
    res.redirect(`/dashboard/${req.params.currentFolderId}`);
  } catch (error) {
    console.log(error);
    next();
  }
};

export default {
  dashboardGet,
  dashboardCurrentFolderIdGet,
  folderCreatePost,
  folderRenamePost,
  folderDeletePost,
  fileUploadPost,
  childFolderRenamePost,
  childFolderDeletePost,
  fileRenamePost,
};
