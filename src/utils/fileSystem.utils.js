const fs = require('fs/promises');
const path = require('path');

const imagesDirectory = `${path.resolve('.')}/public/images/`

const saveImage = (group, name, file) => {
    return getImage(group, name)
        .then(imageName => {
            return imageName ? fs.unlink(path.join(imagesDirectory, group, imageName)) : Promise.resolve();
        })
        .then(() => {
            const extension = file.mimetype.split('/').at(-1);
            return fs.writeFile(path.join(imagesDirectory, group, `${name}.${extension}`), file.buffer);
        });
}

const getImage = (group, name, fullPath = false) => {
    return fs.readdir(path.join(imagesDirectory,group))
        .then(files => {
            const image = files.filter(file => file.startsWith(name))[0];
            if (fullPath && image) {
                return path.join(imagesDirectory, group, image);
            } else {
                return image;
            }
        });
}

module.exports = {
    saveImage,
    getImage
}