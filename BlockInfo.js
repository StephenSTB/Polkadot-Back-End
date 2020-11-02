const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main(){
    const provider = new WsProvider('wss://rpc.polkadot.io');
    const api = await ApiPromise.create({ provider });

    var args = process.argv.slice(2);

    if(args.length > 0){
        try{
            const latestNumber = (await api.rpc.chain.getBlock()).block.header.number.toNumber();
            //const latestNumber = latestBlock.block.header.number.toNumber();
            //console.log("input " + Number(args[0]) + " latest: " + latestNumber);
            if(Number(args[0]) > latestNumber){
                console.log("Block given (" + args[0] + ") is greater then current block " + latestNumber);
                process.exit(0);
            }
            
            const blockHash = await api.rpc.chain.getBlockHash(args[0]);
            //console.log(blockHash.toHuman());

            const header = await api.rpc.chain.getHeader(blockHash);
            console.log("Block Number: " + header.number.toNumber());
            console.log("Block Hash: " + header.hash.toHuman());
            console.log("Parent Hash: " + header.parentHash.toHuman());
            console.log("Extrinsics Root: " + header.extrinsicsRoot.toHuman());
            console.log("State Root: " + header.stateRoot.toHuman());

            process.exit(0);
            
        }
        catch(error){
            console.error(error);
        }

    }
    else{
        console.log("Latest Block:\n");
        api.rpc.chain.subscribeNewHeads((header) =>{
        console.log("Block Number: " + header.number.toNumber());
        console.log("Block Hash: " + header.hash.toHuman());
        console.log("Parent Hash: " + header.parentHash.toHuman());
        console.log("Extrinsics Root: " + header.extrinsicsRoot.toHuman());
        console.log("State Root: " + header.stateRoot.toHuman());

        process.exit(0);
    });
    }
}

main()
