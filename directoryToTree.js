const fs = require('fs');
const path = require('path');

// main function directory to tree
function directoryToTree(rootPath, maxDepth) {

    // create tree 
    function createTree(folderPath, currentDepth) {
        const folderParse = path.parse(folderPath);
        const nodeType = isDirectory(folderPath);
        const stats = fs.statSync(folderPath);
        const fileSize = stats.size;

        if (currentDepth >= maxDepth) {
            return {
                path: folderPath,
                name: folderParse.name,
                type: nodeType ? 'dir' : 'file',
                size: fileSize,
                children: []
            }
        }

        // create inner folder children
        const children = fs.readdirSync(folderPath).map(child => {
            const childPath = path.join(folderPath, child);
            const childStats = fs.statSync(childPath);
            if (childStats.isDirectory()) {
                return createTree(childPath, currentDepth + 1);
            } else {
                return {
                    path: childPath,
                    name: child,
                    type: 'file',
                    size: childStats.size,
                };
            }
        });

        return {
            path: folderPath,
            name: folderParse.name,
            type: nodeType ? 'dir' : 'file',
            size: fileSize,
            children: children,
        };
    }

    // run again until max depth is reached
    return createTree(rootPath, 0);
}


// check if is directory
function isDirectory(filePath) {
    try {
        return fs.statSync(filePath).isDirectory();
    } catch (error) {
        // prevent 'file type error'
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
}

// // testing examples in console // // // // // //
// const test1 = directoryToTree('dummy_dir/a_dir', 5);
// const test2 = directoryToTree('dummy_dir', 5);
// const test3 = directoryToTree('dummy_dir', 1);

// console.log('Example 1', '- - - - - - - - - - - - - - - -');
// console.log(JSON.stringify(test1, null, 2));

// console.log('Example 2', '- - - - - - - - - - - - - - - -');
// console.log(JSON.stringify(test2, null, 2));

// console.log('Example 3', '- - - - - - - - - - - - - - - -');
// console.log(JSON.stringify(test3, null, 2)); 