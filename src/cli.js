#!/usr/bin/env node
'use strict';
const chalk = require('chalk');
const figlet = require('figlet');
const fs = require('fs');
// const inquirer = require("inquirer");
const path = require('path');

let createFolder = 'documentation';

console.log(
  chalk.yellow(figlet.textSync('MDocify', { horizontalLayout: 'full' }))
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
    console.log(chalk.green('Great!! found documentation in your project'));
    docRootPath = currentPath;
    found = true;
  }
  prevPath = currentPath;
  currentPath = path.resolve(currentPath, '../');
}
// console.log('documentation located at', docRootPath);
if (found) {
  const docPath = `${docRootPath}/${createFolder}/docs`;
  const docFiles = fs.readdirSync(docPath);
  const currentFiles = fs.readdirSync(process.cwd());
  // console.log("doc files",docFiles,currentFiles);
  currentFiles.forEach((item) => {
    // only doc file will be generated if that is component
    // not for package.json or index.tsx or something
    const docAllowed = item.split('.').length === 1 && item !== 'node_modules';
    if (docAllowed) {
      // if doc is not created yet,then generate the boilerplate
      // doc file for that component
      const docFileName = `${item.toLowerCase()}.md`;
      if (!docFiles.includes(docFileName)) {
        console.log(chalk.blueBright(`Creating doc file for ${item} ...`));
        // content of a boilerplate markdown file
        const doc_id = item.toLowerCase();
        // copying these because can be
        // customize ahead
        const doc_title = item;
        const doc_sidebar_label = item;
        const docBaseContent = `---\nid: ${doc_id}\ntitle: ${doc_title}\nsidebar_label: ${doc_sidebar_label}\n---`;
        // fs.appendFile(, docBaseContent, (error) => {
        //   if (error) throw error;
        // });

        // creating md files under docs directory
        const markdownPath = `${docPath}/${docFileName}`;
        fs.appendFileSync(markdownPath, docBaseContent);
        // notifying user that doc created
        console.log(chalk.green(`Doc generated for ${item}`));

        // registerting create markdown file to the sidebar.js
        const sideBarFile = `${docRootPath}/${createFolder}/sidebars.js`;
        const sideBarData = fs.readFileSync(sideBarFile, 'utf-8');
        // async version of reading file
        // fs.readFile(sideBarFile, "utf8", (err, data) => {
        //   if (err) throw err;
        //   console.log(data);
        //   sideBarData = data;
        // });

        // we detect where to add new content by this comment
        // and on every new content added we should add this
        // so that a new content can easily updated
        const newDocId = `, '${doc_id}' /* next_doc_id */`;
        const updatedSideBarData = sideBarData.replace(
          '/* next_doc_id */',
          newDocId
        );
        fs.writeFileSync(sideBarFile, updatedSideBarData, 'utf-8');
        console.log(chalk.cyanBright(`Sidebar updated for ${item}`));
        // async version of writting content to file
        // fs.writeFile(sideBarFile, updatedData, function (err) {
        //   if (err) throw err;
        //   console.log(
        //     chalk.cyanBright(`Sidebar updated for ${item}`),
        //     updatedData
        //   );
        // });
      }
    }
  });
} else {
  console.log(
    chalk.red('Oops! no documentation found in your root directory!,Make sure docasaurus is set up in your root directory')
  );
}
