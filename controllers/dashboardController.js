import prisma from '../config/prismaClient.js';

const dashboardGet = async (req, res) => {
  res.redirect(`/dashboard/${req.user.root.id}`);
};

const dashboardCurrentFolderIdGet = async (req, res) => {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: req.params.currentFolderId,
        ownerId: req.user.id,
      },
      include: {
        folders: true,
        files: true,
      },
    });
    res.render('dashboard', {
      title: 'Dashboard',
      script: 'dashboard.js',
      folder: folder,
      folders: folder.folders,
    });
  } catch (error) {
    console.error(error);
  }
};

const newFolderPost = async (req, res) => {
  console.log(req.body);
  console.log(req.params);
  const newFolder = await prisma.folder.create({
    data: {
      name: req.body.newFolderName,
      ownerId: req.user.id,
      parentId: req.params.currentFolderId,
    },
  });
  res.redirect(`/dashboard/${newFolder.id}`);
};

export default {
  dashboardGet,
  dashboardCurrentFolderIdGet,
  newFolderPost,
};
