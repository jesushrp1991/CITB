type ResumableDownloadOptions = {
  accessToken: string;
  fileName: string;
  mimeType: string;
  parentFolderId: string;
};

interface CallbackOneParam<T1, T2 = void> {
  (param1: T1): T2;
}

class ResumableUpload2 {
  endpoint: string =
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable";
  cantRetries: number = 0;
  location: string = "";
  chunkSize: number = 256 * 1024;
  startBuffer: number = 0;
  endBuffer: number = this.chunkSize;
  fileTotalSize: number = 0;
  file: Blob;
  options: ResumableDownloadOptions;

  constructor(
    file: Blob,
    options: ResumableDownloadOptions,
    fileTotalSize: number
  ) {
    this.file = file;
    this.options = options;
    this.fileTotalSize = fileTotalSize;
  }

  public initializeRequest(): Promise<Headers> {
    return new Promise((resolve, reject) => {
      let metadata = {
        // mimeType: this.options.mimeType,
        name: this.options.fileName,
        parents: this.options.parentFolderId,
      };
      fetch(this.endpoint, {
        method: "POST",
        body: JSON.stringify(metadata),
        headers: {
          Authorization: "Bearer " + this.options.accessToken,
          "X-Upload-Content-Type": this.options.mimeType ,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status != 200) {
            res.json().then((e) => reject(e));
            return;
          }
          this.location = res.headers.get("location");
          resolve(res.headers);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  public nextChunk() {
    try {
      return this.file.slice(this.startBuffer, this.endBuffer);
    } catch (error) {
      console.log(error);
    }
  }

  public calculateUploadPercent = (callback: CallbackOneParam<object>) => {
    let percent = (this.startBuffer * 100) / this.fileTotalSize;
    callback({status: percent});
  }

  public async start(callback: CallbackOneParam<object>) {
    try {
      const len = Math.ceil(this.fileTotalSize / this.chunkSize);
      for (let index = 0; index < len; index++) {
        let nextChunk = this.nextChunk();
        await this.doUpload(nextChunk,callback);
        nextChunk = null; //Asegurandonos de limpiar la memoria.
      }
    } catch (error) {
      console.log(error);
    }
  }

  public doUpload = (element,callback: CallbackOneParam<object>) => {
    return new Promise((resolve, reject) => {
      const contentRange: string =
        "bytes " +
        String(this.startBuffer) +
        "-" +
        String((this.endBuffer - 1)) +
        "/" +
        this.fileTotalSize;
      // console.log("contentRange",contentRange);
      fetch(this.location, {
        method: "PUT",
        body: element,
        headers: {
          "Content-Range": contentRange,
        },
      })
        .then((res) => {
          const status = res.status;
          if (status == 308) {
            let range = res.headers.get("Range");
            let lastUploadedByte = range.split("-");
            this.startBuffer = parseInt(lastUploadedByte[1]) + 1;
            this.endBuffer = Math.min(this.startBuffer + this.chunkSize,this.fileTotalSize);
            this.calculateUploadPercent(callback);
            resolve({ status: "Next", result: res });
          } 
          else if (status == 200 || status == 201) {
            console.log("fetch result 200");
            callback({status: 100});
            resolve({ status: "Done", result: res });
          } 
          else {
            console.log("fetch result ??", res.status);
            reject(res.status);  
            return;
          }
        })
        .catch((err) => {
          console.log("error fetch", err);
          reject(err);
          return;
        });
    });
  };
} //END Class
