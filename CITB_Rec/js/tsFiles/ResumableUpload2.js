var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var ResumableUpload2 = /** @class */ (function () {
    function ResumableUpload2() {
        this.endpoint = "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable";
        this.start = 0;
        this.cantRetries = 0;
    }
    ResumableUpload2.prototype.upload = function (file, totalSize, opciones) {
        return __awaiter(this, void 0, void 0, function () {
            var head, location_1, range, fileAsArray, httpResponse, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.initializeRequest.call(opciones)];
                    case 1:
                        head = _a.sent();
                        location_1 = head.get("location");
                        range = "bytes " + this.start + "-" + this.start + 256 + "/" + totalSize;
                        fileAsArray = this.getArrayBuffer(file);
                        return [4 /*yield*/, this.doUpload(fileAsArray, range, location_1)];
                    case 2:
                        httpResponse = _a.sent();
                        if (httpResponse.status == 200) {
                            this.start += 256 * 1024; //if succesfully upload, asumiendo que los chunks son de 256 kb todo el tiempo
                            console.log("http 200");
                            // callback("Done",null);
                            return [2 /*return*/, "new pedazo"];
                        }
                        if (httpResponse.status == 308) {
                            console.log("http 308");
                            if (this.cantRetries >= 5) {
                                this.cantRetries = 0;
                                throw "Error, tratar luego";
                            }
                            else {
                                throw "AQUI COLLADO";
                                // this.start = this.start + 256 * 1024 - httpResponse.headers['Range'] as number;
                                // this.upload(file,totalSize,opciones,callback);
                                // this.cantRetries ++;
                            }
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ResumableUpload2.prototype.initializeRequest = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var metadata = {
                            mimeType: options.mimeType,
                            name: options.fileName,
                            parents: options.parentFolderId
                        };
                        fetch(_this.endpoint, {
                            method: "POST",
                            body: JSON.stringify(metadata),
                            headers: {
                                Authorization: "Bearer " + options.accessToken,
                                "Content-Type": "application/json"
                            }
                        })
                            .then(function (res) {
                            console.log("http initialize", res);
                            if (res.status != 200) {
                                res.json().then(function (e) { return reject(e); });
                                return;
                            }
                            resolve(res.headers);
                        })["catch"](function (err) {
                            reject(err);
                        });
                    })];
            });
        });
    };
    ResumableUpload2.prototype.doUpload = function (data, range, url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fetch(url, {
                            method: "PUT",
                            body: data,
                            headers: { "Content-Range": range }
                        })
                            .then(function (res) {
                            var status = res.status;
                            if (status == 308) {
                                resolve(res);
                            }
                            else if (status == 200) {
                                res.json().then(function (res) { return resolve(res); });
                            }
                            else {
                                res.json().then(function (err) {
                                    reject(err);
                                    return;
                                });
                                return;
                            }
                        })["catch"](function (err) {
                            reject(err);
                            return;
                        });
                    })];
            });
        });
    };
    //   private getArrayBuffer (file: Blob) : ArrayBuffer | string {
    ResumableUpload2.prototype.getArrayBuffer = function (file) {
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
            return event.target.result;
        };
        fileReader.readAsArrayBuffer(file);
    };
    return ResumableUpload2;
}()); //END Class
