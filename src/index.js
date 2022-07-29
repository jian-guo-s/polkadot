"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@polkadot/api");
//创建polkadot api
function createPolkadotApi(wsUrl, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = new api_1.ApiPromise({ provider: new api_1.WsProvider(wsUrl) });
        yield api.isReadyOrError.catch((e) => {
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
    });
}
function listenEvent() {
    return __awaiter(this, void 0, void 0, function* () {
        //创建api
        const polkadotApi = yield createPolkadotApi("ws://127.0.0.1:9944");
        //订阅系统的event事件
        polkadotApi.query.system.events((events) => {
            console.log(`\nReceived ${events.length} events:`);
            //遍历事件
            events.forEach((record) => {
                //获取事件和事件类型
                const { event, phase } = record;
                const types = event.typeDef;
                //打印事件的相关信息
                console.log(`\t${event.section}:${event.method}:: (phase=${phase})`);
                console.log(`\t\t${event.meta.documentation}`);
                //获取事件数据信息并且打印
                event.data.forEach((data, index) => {
                    console.log(`\t\t\t${types[index].type}: ${data}`);
                });
            });
        });
    });
}
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield listenEvent();
});
main().catch((error) => {
    console.error(error);
    process.exit(-1);
});
