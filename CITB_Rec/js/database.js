    const db = new Dexie("CITBRecords");

    const createDB = () =>{
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
            await db.delete('CITBRecords');
        }catch(error){
            console.log(error);
            throw error; //needed to abort the transaction.
        }
    }

    const selectDB = async () =>{
        try{
            let result = await db.records.orderBy('id');
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
      console.log(`Quota: ${estimation.quota}`);
      console.log(`Usage: ${estimation.usage}`);
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
    createDB();
    await initStoragePersistence();
    console.log(isStoragePersisted());
    showEstimatedQuota();
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
    prepareDB
}