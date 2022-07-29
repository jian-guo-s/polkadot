import { ApiPromise, WsProvider } from '@polkadot/api';

//创建polkadot api
async function createPolkadotApi(wsUrl: string, callback?: (api: ApiPromise) => any) {
    const api = new ApiPromise({ provider: new WsProvider(wsUrl) });
    await api.isReadyOrError.catch((e) => {
        //连接错误自动断开
        console.log('connect failed error', e);
        api.disconnect();
    });
    // If callback provided,
    // auto disconnect when callback process finished
    if (callback) {
        callback(api);
        api.disconnect();
    }

    return api;
}


async function listenEvent() {
    //创建api
    const polkadotApi = await createPolkadotApi("ws://127.0.0.1:9944");
    //订阅系统的event事件
    polkadotApi.query.system.events(( events:any ) => { // Extract the phase, event and the event types
        console.log(`\nReceived ${events.length} events:`);
        //遍历事件
        events.forEach((record:any) => {
            //获取事件和事件类型
            const { event, phase } = record;
            const types = event.typeDef;

            //打印事件的相关信息
            console.log(`\t${event.section}:${event.method}:: (phase=${phase})`);
            console.log(`\t\t${event.meta.documentation}`);
            //获取事件数据信息并且打印
            event.data.forEach((data:any,index:number) => {
                console.log(`\t\t\t${types[index].type}: ${data}`);
            })
        })
    })
}
const main = async () => {
    await listenEvent();
}

main().catch((error) => {
    console.error(error);
    process.exit(-1);
});