
export class BaseButton  {
    public window = window as any;

    public sendMessage = (msg: object) => {
        console.log("sending msg", msg)
        this.window.chrome.runtime.sendMessage('ijbdnbhhklnlmdpldichdlknfaibceaf', msg);
      };
}