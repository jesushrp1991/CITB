const populateMicSelect = () => {
    let micList = await navigator.mediaDevices.enumerateDevices();
    let select = document.getElementById('miclist');
    while (select.options.length > 0) {                
        select.remove(0);
    }  
    micList.forEach(element => {
        var option = document.createElement("option");
        option.text = element.label;
        option.value = element.deviceId;
        select.add(option);
    });
}