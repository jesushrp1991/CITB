import { environment } from "../config/environment.js";

    let db = new Dexie("CITBRecords", { autoOpen: true });

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
        console.log("Not possible to persist storage");
        break;
      case "persisted":
        console.log("Successfully persisted storage silently");
        break;
      case "prompt":
        console.log("Not persisted, but we may prompt user when we want to.");
        await persist();
        break;
    }
  }
  
  const prepareDB = async() =>{
    delDB();           
    createDB();
    await initStoragePersistence();
    console.log(isStoragePersisted());
    showEstimatedQuota();
  }

  const delLastItem = async () => {    
    let last = await db.records.orderBy('id').last();
    console.log(last.id);
    await db.records.delete(last.id);    
  }

export {
    createDB,
    addDB,
    delDB,
    selectDB,
    persist,
    isStoragePersisted,
    showEstimatedQuota,
    tryPersistWithoutPromtingUser,
    initStoragePersistence,
    prepareDB,
    delLastItem
}