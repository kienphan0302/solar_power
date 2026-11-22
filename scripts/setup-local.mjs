import { copyFile, constants } from 'node:fs/promises';
for (const filename of ['.env', '.dev.vars']) {
  try {
    await copyFile(filename + '.example', filename, constants.COPYFILE_EXCL);
    console.log('Created ' + filename);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    console.log('Kept existing ' + filename);
  }
}
console.log('Next: npm run db:local, npm run build, npm run preview');
