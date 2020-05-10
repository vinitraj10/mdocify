#!/usr/bin/env node
'use strict';
const chalk = require('chalk');
const figlet = require('figlet');
const fs = require('fs');
// const inquirer = require("inquirer");
const path = require('path');

let createFolder = 'documentation';

console.log(
  chalk.yellow(figlet.textSync('MDocify', { horizontalLayout: 'full' })),
);
// needed when user input required
// inquirer
//   .prompt([
//     /* Pass your questions in here */
//     {
//       type: "input",
//       name: "createFolder",
//       message: "Where you want to create doc file?"
//     },
//     {
//       type: "input",
//       name: "fileType",
//       message: "what file type do you want?"
//     }
//   ])
//   .then(answers => {
//     // Use user feedback for... whatever!!
//     if (answers.createFolder !== "") {
//       createFolder = answers.createFolder;
//     }
//     if (answers.fileType !== "") {
//       fileType = answers.fileType;
//     }

//     // go and check doc path and src/components and src/animations
//   })
//   .catch(error => {
//     if (error.isTtyError) {
//       // Prompt couldn't be rendered in the current environment
//     } else {
//       // Something else when wrong
//     }
//   });

// getting current working directory
// const [, , ...args] = process.argv;

let found = false;
// will be used for iterating the path
let currentPath = process.cwd();
// will be used to terminate the loop
let prevPath = '';
// will be used to create files for the ones
// whose docs has not been there
let docRootPath = '';
// reading current directory
while (!found && currentPath !== prevPath) {
  // getting the list of files in the current path
  // and then checking whether the given folder
  // exists in it or not,repeating the process
  // until it gets end
  const files = fs.readdirSync(currentPath);
  if (files.includes(createFolder)) {
    docRootPath = currentPath;
    found = true;
  }
  prevPath = currentPath;
  currentPath = path.resolve(currentPath, '../');
}
if (found) {
  const docPath = `${docRootPath}/${createFolder}/docs`;
  const docFiles = fs.readdirSync(docPath);
  const currentFiles = fs.readdirSync(process.cwd());
  // assuming that docs folder is up to date as of now
  // as per the current codebase.
  let isDocUpdated = true;
  // never generate doc for these
  const notAllowed = [
    'package',
    'node_modules',
    'index'
  ];
  // iterating over current working files to match whether
  // their respective doc file has generated or not,if not
  // we will create it or else we continue.
  currentFiles.forEach((item) => {
    // item could be a folder of a particular component
    // or can be a js or ts files,we need to generate doc
    // for them.
    
    // splitting over . to get the fileName of current file
    const fileName = item.split('.')[0];
    // if the current item is not inclued in not allowed files
    if (!notAllowed.includes(fileName)) {
      // if doc is not created yet,then generate the boilerplate
      // doc file for that component
      const docFileName = `${fileName.toLowerCase()}.md`;
      if (!docFiles.includes(docFileName)) {
        // setting to false so that user won't get the message
        // if the doc is not updated to the codebase.
        isDocUpdated = false;
        console.log(chalk.blueBright(`Creating doc file for ${fileName} ...`));
        // content of a boilerplate markdown file
        const doc_id = fileName.toLowerCase();
        const doc_title = fileName;
        const doc_sidebar_label = fileName;
        const docBaseContent = `---\nid: ${doc_id}\ntitle: ${doc_title}\nsidebar_label: ${doc_sidebar_label}\n---`;
        // creating md files under docs directory
        const markdownPath = `${docPath}/${docFileName}`;
        fs.appendFileSync(markdownPath, docBaseContent);
        // notifying user that doc created
        console.log(chalk.green(`Doc generated for ${item}`));

        // registerting create markdown file to the sidebar.js
        const sideBarFile = `${docRootPath}/${createFolder}/sidebars.js`;
        const sideBarData = fs.readFileSync(sideBarFile, 'utf-8');

        // we detect where to add new content by this comment
        // and on every new content added we should add this
        // so that a new content can easily updated
        const newDocId = `, '${doc_id}' /* next_doc_id */`;
        const updatedSideBarData = sideBarData.replace(
          '/* next_doc_id */',
          newDocId,
        );
        fs.writeFileSync(sideBarFile, updatedSideBarData, 'utf-8');
        console.log(chalk.cyanBright(`Sidebar updated for ${item}`));
      }
    }
  });
  // if no new files added in the codebase and docs folder contains all the
  // respective doc file then notifying user that doc is up to date.
  if (isDocUpdated) {
    console.log(chalk.green('Hola! your documentation is already up to date!'));
  }
} else {
  console.log(
    chalk.red(
      'Oops! no documentation found in your root directory!,Make sure docasaurus is set up in your root directory',
    ),
  );
}
