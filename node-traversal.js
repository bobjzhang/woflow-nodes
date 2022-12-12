const STARTING_NODE_ID = "089ef556-dfff-4ff2-9733-654645be56fe";
const DATA_API_PREFIX = "https://nodes-on-nodes-challenge.herokuapp.com/nodes";

const callDataEndpoint = async (nodeId) => {
	const response = await fetch(`${DATA_API_PREFIX}/${nodeId}`);
	return response;
};

// Process JSON Response
const processResp = async (nodeAPIPromise) => {
	const resp = await nodeAPIPromise;
	const jsonResp = await resp.json();
	return JSON.parse(JSON.stringify(jsonResp))[0];
}

// Add a visited node to map
const processNode = (node, visitedMap, array) => {
    if (!visitedMap[node.id]) {
    	visitedMap[node.id] = 1;
    	
        array.push(node);
    } else {
    	visitedMap[node.id] += 1;
    }
}

// Traverse the grapqh and print out the number of unique node IDs, 
// and the most common node ID.
const traverseNodes = async () => {
	const rootNode = await processResp(callDataEndpoint(STARTING_NODE_ID));

    let stack = [], array = [], visitedMap = {};
    stack.push(rootNode);

    while(stack.length !== 0) {
        let node = stack.pop();    
        processNode(node, visitedMap, array);

        if (node.child_node_ids.length !== 0) {
            for(var i = node.child_node_ids.length - 1; i >= 0; i--) {
            	const newNode =  await processResp(callDataEndpoint(node.child_node_ids[i]));
                stack.push(newNode);
            }
        }
    }    

    // Check unique nodes and highest occurring node id
    let mostCommonNodeCount = 0;
    let mostCommonNodeId = null;
    let totalNumUniqueNodes = 0;

	for (var nodeId in visitedMap) {
		if (visitedMap.hasOwnProperty(nodeId)) {
			const nodeCount = visitedMap[nodeId];
			if (nodeCount === 1) {
				totalNumUniqueNodes += 1;
			}

			if (nodeCount > mostCommonNodeCount) {
				mostCommonNodeId = nodeId;
				mostCommonNodeCount = nodeCount;
			}
		}
	}	

	console.log(`The most common node ID is: ${mostCommonNodeId} with a count of ${mostCommonNodeCount}`);
	console.log(`The total number of unique node IDs is: ${totalNumUniqueNodes}`);
};



// [
//   {
//     id: '089ef556-dfff-4ff2-9733-654645be56fe',
//     child_node_ids: [
//       'c20c063c-99b3-452f-a44f-72e2dac4eec0',
//       '3e82e3c2-4cd1-4cab-91da-899430299c84'
//     ]
//   }
// ]


// Test 1
// const test1 = await callDataEndpoint("089ef556-dfff-4ff2-9733-654645be56fe");
// console.log(await test1.json());


// Test 2
const test2 = await traverseNodes();
console.log(test2);








