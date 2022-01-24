import { environment } from "../config/environment.js";

    let db = new Dexie("CITBRecords", { autoOpen: true });
    let queueDB = new Dexie("CITBQueueRecords", { autoOpen: true });

    const createDB = async () =>{
        let exitsDB = await Dexie.exists("CITBRecords");
        if(exitsDB){
            delDB();
        }
        db = new Dexie("CITBRecords", { autoOpen: true });
        db.version(1).stores({
            records: `
                ++id,
                record`,
        });
    }
    
    const addDB = async (chunk) =>{
        try{
            await db.records.add({record: chunk});  
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    const delDB = async () => {
        try{
            await db.delete();
        }catch(error){
            console.log(error);
            throw error; //needed to abort the transaction.
        }
    }

    const selectDB = async () =>{
      try{
          let result = await db.records.orderBy('id').toArray();
          return result; 
      }catch(error){
          console.log(error);
          throw error;
      }
      
  }
    
  const createRecQueueDB = () =>{
      queueDB = new Dexie("CITBQueueRecords", { autoOpen: true });
      queueDB.version(1).stores({
        records: `
            ++id,
            file,
            name,
            dateStart,
            dateEnd,
            driveLink,
            calendarId
            `,
        });
  }

  const addRecQueueDB = async(file,name,dateStart,dateEnd,driveLink,calendarId) =>{
    try{
      await queueDB.records.add({file: file,name: name,dateStart:dateStart,dateEnd:dateEnd,driveLink:driveLink,calendarId:calendarId});  
    }catch(error){
        console.log(error);
        throw error;
    }
  }
  const delQueueDB = async () => {
    try{
        await queueDB.delete();
    }catch(error){
        console.log(error);
        throw error; //needed to abort the transaction.
    }
  }
  const getLastElementIdQueueDB = async () =>{
      try{
          const exitsDB = await Dexie.exists("CITBQueueRecords");
          if(!exitsDB){
            return;
          }
          let result;
          let firsResult = false;
          await queueDB.records.each(element => {  
            if(element.file != "uploaded" && element.file != "folder" ){
              if(!firsResult){
                result = element;
                firsResult = true;
              }
            }
          });
          return result;
      }catch(error){
          console.log(error);
          throw error;
      }
      
  }

  const getNextQueueFile = async(id) =>{
    //get first Element FILE fields
    let first;
    if(id > -1){
      first = await queueDB.records.where('id').above(id).first();
    }else{
      first = await queueDB.records.orderBy('id').last();
    }
    return first;
  }

  const saveLinktoDB = async(id,link) =>{
    await queueDB.records.update(id,{driveLink: link});
    getDriverLinkInQueueDB(id);
  }

  const delFileInDB = async(id) =>{
    await queueDB.records.update(id,{file: "uploaded"});
    removeRecordQueueDB(id);
  }

  const removeRecordQueueDB = (primaryKey) => {
    primaryKey = parseInt(primaryKey);
    queueDB.records.where('id').equals(primaryKey).delete().then((deleteCount) => {
      chrome.runtime.sendMessage({greeting: primaryKey}, (response) => {});
    }).catch((error) => {
        console.error ("Error: " + error);
    });
  }
  const listQueueDB = async () =>{
    try{
        let exitsDB = await Dexie.exists("CITBQueueRecords");
        if(!exitsDB){
          return;
        }
        let result = await queueDB.records.orderBy('id').reverse().toArray();
        return result; 
    }catch(error){
        console.log(error);
        throw error;
    }  
  }

  const getDriverLinkInQueueDB = async (id) => {
    let exitsDB = await Dexie.exists("CITBQueueRecords");
    if(!exitsDB){
      return;
    }
    let result;
    await queueDB.records.each(element => {  
      if(element.id == id){
        result = element.driveLink;
      }
    });
    return result;
  }
const searchBylinkQueueDB = async (link) =>{
  let exitsDB = await Dexie.exists("CITBQueueRecords");
  if(!exitsDB){
    return;
  }
  let result = false;
  await queueDB.records.each(element => {  
    if(element.driveLink == link){
      result = true;
    }
  });
  return result;
}
    
const persist = async () => {
    return await navigator.storage && navigator.storage.persist &&
      navigator.storage.persist();
  } 
const isStoragePersisted = async () => {
    return await navigator.storage && navigator.storage.persisted &&
      navigator.storage.persisted();
  }

const showEstimatedQuota = async() => {
    if (navigator.storage && navigator.storage.estimate) {
      const estimation = await navigator.storage.estimate();
      let perCentUsedQuotaOfSpace = estimation.usage / estimation.quota * 100;      
      if( perCentUsedQuotaOfSpace >= environment.lowDiskSpaceAlert )
        return true;
      return false;
    } else {
      console.error("StorageManager not found");
    }
  }
/** Tries to persist storage without ever prompting user.
  @returns {Promise<string>}
    "never" In case persisting is not ever possible. Caller don't bother
      asking user for permission.
    "prompt" In case persisting would be possible if prompting user first.
    "persisted" In case this call successfully silently persisted the storage,
      or if it was already persisted.
*/
const tryPersistWithoutPromtingUser = async () => {
    if (!navigator.storage || !navigator.storage.persisted) {
      return "never";
    }
    let persisted = await navigator.storage.persisted();
    if (persisted) {
      return "persisted";
    }
    if (!navigator.permissions || !navigator.permissions.query) {
      return "prompt"; // It MAY be successful to prompt. Don't know.
    }
    const permission = await navigator.permissions.query({
      name: "persistent-storage"
    });
    if (permission.state === "granted") {
      persisted = await navigator.storage.persist();
      if (persisted) {
        return "persisted";
      } else {
        throw new Error("Failed to persist");
      }
    }
    if (permission.state === "prompt") {
      return "prompt";
    }
    return "never";
  }

  const initStoragePersistence = async () => {
    const tryToPersist = await tryPersistWithoutPromtingUser();
    switch (tryToPersist) {
      case "never":
        // console.log("Not possible to persist storage");
        break;
      case "persisted":
        // console.log("Successfully persisted storage silently");
        break;
      case "prompt":
        // console.log("Not persisted, but we may prompt user when we want to.");
        await persist();
        break;
    }
  }
  
  const prepareDB = async() =>{
    delDB();           
    createDB();
    createRecQueueDB();
    await initStoragePersistence();
    // console.log(isStoragePersisted());
    showEstimatedQuota();
  }

  const initDB = async() =>{
    createRecQueueDB();
    await initStoragePersistence();
    // console.log(isStoragePersisted());
    showEstimatedQuota();
  }

  initDB();

  const delLastItem = async (itemsToDel = 1) => {    
    let last;
    for(let i=0;i<=itemsToDel;i++){
      last = await db.records.orderBy('id').last();
    }
    await db.records.delete(last.id);    
  }

export {
     createDB
    ,addDB
    ,delDB
    ,selectDB 
    ,persist 
    ,isStoragePersisted
    ,showEstimatedQuota
    ,tryPersistWithoutPromtingUser
    ,initStoragePersistence
    ,prepareDB
    ,delLastItem
    ,createRecQueueDB
    ,addRecQueueDB
    ,getLastElementIdQueueDB
    ,getNextQueueFile
    ,saveLinktoDB
    ,delFileInDB
    ,listQueueDB
    ,getDriverLinkInQueueDB
    ,searchBylinkQueueDB
    ,removeRecordQueueDB
    ,delQueueDB
}