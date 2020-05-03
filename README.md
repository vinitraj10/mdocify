# Intro
This is just a fun project which is written to solve a basic problem to autogenerate the boilerplate markdown file which is needed to be in format for docusarus-v2,not handled for v1(that is more stable), v2 is still in development,so it is just an experiment,for now this project has lot of limitations.will handle more cases if needed to make this tool more stable.


# Installation

## Using yarn or npm
Using package manager you would get the latest stable version of cli,But its not stable either ;)

To automatically link `mdocify` to your environment variables you would need to add it as a global package,if you install to any particular project dependencies,you might need to link it by yourself by using some commands which has been described below
```
$ yarn global add mdocify
# or
$ npm install -g modcify
```

## Using github
Using github clone you would get the latest development code of cli,which you would need to manually link to your path by using `npm` or `yarn` `link` command
### Step - 1
**Cloning the project since its not availabe on npm registry**
```
    git clone https://github.com/vinitraj10/mdocify
```

### Step - 2
**Installing all dependencies**
```
    cd mdocify && yarn
```

### Step-3
**Linking the cli to the terminal,this will add symlink or path to your environment variables**
```
    yarn link
```
### Step-4
**Edit your sidebars.js of docusarus-v2 for handling the updates in sidebar**
```
    someSideBar: {
        Components: [..., /* next_doc_id */],
    }
```
Just make sure you add `/* next_doc_id */` this line to make sure you get auto update in your provide key field,for example i have added in `Components`, you can wherever you want to add.
# Working

To Make it work,Right now I am assuming you have a `React Project` where you have been using `docusarus-v2`,Now to generate markdown file you need to run this command where you have kept all your components folder,It assumes a component will have its separate folder for now,will handle for components file also in coming work.

Your directory structure should look like
```
  |-- components
            |-- Button
                |-- index.tsx
                |-- button.css
                    
            |-- Card
                |-- index.tsx
                |-- card.css
```

So you need to run 
```
<project>/components> mdocify
```
on root directory like here its `components`,it will magically search for `documentation` directory which resides in your project root if you are using `docusarus-v2`.


and it will automatically generate `.md` file for your components also `sidebars.js` will be updated automatically your directory structure would look like this

```
  |-- documentation
            |-- docs
                |-- button.md
                |-- card.md                 
```


And at last run docusarus server to see the updates,run the following command in documentation folder,as docusarus lives there only

```
yarn start
```

# Disclaimer

*This might not be useful to you at first glance,but if you got an idea what i am trying to do,then you can contribute in this project anytime or if you want to discuss anything related to this or ReactJs,React-Native then you can get in touch with me at twitter [vinitraj_10](https://twitter.com/vinitraj_10)*