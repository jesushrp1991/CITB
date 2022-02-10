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
    function ResumableUpload2(file, options, fileTotalSize) {
        var _this = this;
        this.endpoint = "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable";
        this.cantRetries = 0;
        this.location = "";
        this.chunkSize = 256 * 1024 * 10;
        this.startBuffer = 0;
        this.endBuffer = this.chunkSize;
        this.fileTotalSize = 0;
        this.calculateUploadPercent = function (callback) {
            var percent = (_this.startBuffer * 100) / _this.fileTotalSize;
            console.log(Math.ceil(percent));
            callback({ status: Math.ceil(percent) });
        };
        this.doUpload = function (element, callback) {
            return new Promise(function (resolve, reject) {
                var contentRange = "bytes " +
                    String(_this.startBuffer) +
                    "-" +
                    String((_this.endBuffer - 1)) +
                    "/" +
                    _this.fileTotalSize;
                // console.log("contentRange",contentRange);
                fetch(_this.location, {
                    method: "PUT",
                    body: element,
                    headers: {
                        "Content-Range": contentRange
                    }
                })
                    .then(function (res) {
                    var status = res.status;
                    if (status == 308) {
                        var range = res.headers.get("Range");
                        var lastUploadedByte = range.split("-");
                        _this.startBuffer = parseInt(lastUploadedByte[1]) + 1;
                        _this.endBuffer = Math.min(_this.startBuffer + _this.chunkSize, _this.fileTotalSize);
                        _this.calculateUploadPercent(callback);
                        resolve({ status: "Next", result: res });
                    }
                    else if (status == 200 || status == 201) {
                        console.log("fetch result 200,Done");
                        callback({ status: 100 });
                        resolve({ status: "Done", result: res });
                    }
                    else {
                        console.log("fetch result ??", res.status);
                        reject(res.status);
                        return;
                    }
                })["catch"](function (err) {
                    console.log("error fetch", err);
                    reject(err);
                    return;
                });
            });
        };
        this.file = file;
        this.options = options;
        this.fileTotalSize = fileTotalSize;
    }
    ResumableUpload2.prototype.initializeRequest = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var metadata = {
                'mimeType': _this.options.mimeType,
                'name': _this.options.fileName,
                'parents': [_this.options.parentFolderId]
            };
            fetch(_this.endpoint, {
                method: "POST",
                body: JSON.stringify(metadata),
                headers: {
                    Authorization: "Bearer " + _this.options.accessToken,
                    "X-Upload-Content-Type": _this.options.mimeType,
                    "Content-Type": "application/json"
                }
            })
                .then(function (res) {
                if (res.status != 200) {
                    res.json().then(function (e) { return reject(e); });
                    return;
                }
                _this.location = res.headers.get("location");
                resolve(res.headers);
            })["catch"](function (err) {
                console.log(err);
                reject(err);
            });
        });
    };
    ResumableUpload2.prototype.nextChunk = function () {
        try {
            return this.file.slice(this.startBuffer, this.endBuffer);
        }
        catch (error) {
            console.log(error);
        }
    };
    ResumableUpload2.prototype.start = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var len, index, nextChunk, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        len = Math.ceil(this.fileTotalSize / this.chunkSize);
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index < len)) return [3 /*break*/, 4];
                        nextChunk = this.nextChunk();
                        return [4 /*yield*/, this.doUpload(nextChunk, callback)];
                    case 2:
                        _a.sent();
                        nextChunk = null; //Asegurandonos de limpiar la memoria.
                        _a.label = 3;
                    case 3:
                        index++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return ResumableUpload2;
}()); //END Class
