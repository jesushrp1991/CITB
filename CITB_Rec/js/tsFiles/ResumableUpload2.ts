type ResumableDownloadOptions = {
  resource: [number];
  accessToken: string;
  fileName: string;
  mymeTipe: string;
  parentFolderId: string;
};

class ResumableUpload2 {
  totalSize: number;
  endpoint: string = "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable";
  start: number = 0;
  cantRetries : number = 0;

  constructor(totalSize: number) {
    this.totalSize = totalSize;
  }

  public async upload(
     file: Blob
    ,callback: (
      result: string,
      error: string
    ) => { result: string; error: string }
    ,opciones: ResumableDownloadOptions
  ) {
    try {
      callback("Status", "Iniciando");
      const head = await this.initializeRequest(opciones);
      const location = head.get("location");
      callback("getLocation", location ?? "");
      let range: string = "bytes " + this.start + "-" + this.start + 256 + "/" + this.totalSize;
      let fileAsArray = await this.getArrayBuffer(file);
      let httpResponse: Response = await this.doUpload(fileAsArray, range, location ?? "");

      if(httpResponse.status == 200){
        this.start += 256; //if succesfully upload, asumiendo que los chunks son de 256 kb todo el tiempo
        callback("Done","Next Chunk of 256 kb");
      }
      if(httpResponse.status == 308){
        if(this.cantRetries >= 5){
            this.cantRetries = 0;
            throw "Error, tratar luego"
        }
        else{
            this.start = this.start + 256 - (parseInt(httpResponse.headers.get('Range') ?? "0"));
            this.upload(file,callback,opciones);
            this.cantRetries ++;
        }
      }
    } catch (error) {
      callback("Ha ocurrido el stge error:", JSON.stringify(error));
    }
  }

  public initializeRequest(
    options: ResumableDownloadOptions
  ): Promise<Headers> {
    return new Promise((resolve, reject) => {
      let metadata = {
        mimeType: options.mymeTipe,
        name: options.fileName,
        parents: options.parentFolderId,
      };
      fetch(this.endpoint, {
        method: "POST",
        body: JSON.stringify(metadata),
        headers: {
          Authorization: "Bearer " + options.accessToken,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status != 200) {
            res.json().then((e) => reject(e));
            return;
          }
          resolve(res.headers);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private doUpload(data:ArrayBuffer,range:string, url:string): Promise<Response> {
    return new Promise(function (resolve, reject) {
      fetch(url, {
        method: "PUT",
        body: data,
        headers: { "Content-Range": range },
      })
        .then((res) => {
          const status = res.status;
          if (status == 308) {
            resolve(res);
          } else if (status == 200) {
            res.json().then((res) => resolve(res));
          } else {
            res.json().then((err) => {
              reject(err);
              return;
            });
            return;
          }
        })
        .catch((err) => {
          reject(err);
          return;
        });
    });
  }

//   private getArrayBuffer (file: Blob) : ArrayBuffer | string {
  private getArrayBuffer (file: Blob) : Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      var fileReader = new FileReader();
      fileReader.onload = (event) =>{
        const arrayBuffer = event.target!.result as ArrayBuffer;
        resolve( arrayBuffer );
      };
      fileReader.readAsArrayBuffer(file);
    })
   
  }
} //END Class
