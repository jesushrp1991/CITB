export const createFloatingButtons = () =>{
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.visibility = 'hidden';
    buttonsContainer.setAttribute('id', 'buttonsContainer')
    
    const buttonClose = document.createElement('button');
    buttonClose.setAttribute('id', 'buttonClose');

    const CITBcamButton = document.createElement('button');
    CITBcamButton.setAttribute('id', 'CITBcamButton');
    CITBcamButton.classList.add("CITBButton", "CITBCamButton");
   
    const buttonShow = document.createElement('button');
    buttonShow.setAttribute('id', 'buttonShow');
    buttonShow.classList.add("CITBButton", "CITBShowButton");
    
    const showTooltip = document.createElement('div');
    showTooltip.setAttribute('id', 'showTooltip');
    showTooltip.setAttribute('data-mdl-for', 'buttonShow');
    showTooltip.classList.add("mdl-tooltip");
    showTooltip.innerText ='Show Mode'

    const buttonClass = document.createElement('button');
    buttonClass.setAttribute('id', 'buttonClass');
    buttonClass.classList.add("CITBButton", "CITBClassButton");

    const classTooltip = document.createElement('div');
    classTooltip.setAttribute('id', 'classTooltip');
    classTooltip.setAttribute('data-mdl-for', 'buttonClass');
    classTooltip.classList.add("mdl-tooltip");
    classTooltip.innerText ='Classroom mode'
    
    const presentationTooltip = document.createElement('div');
    presentationTooltip.setAttribute('id', 'presentationTooltip');
    presentationTooltip.setAttribute('data-mdl-for', 'buttonPresentation');
    presentationTooltip.classList.add("mdl-tooltip");
    presentationTooltip.innerText ='Duplo mode'

    const buttonPresentation = document.createElement('div');
    buttonPresentation.setAttribute('id', 'buttonPresentation');
    buttonPresentation.classList.add("duplo-container", "CITBButton", "CITBPresentationButton");
       
        const duploIconHolder = document.createElement('div');
        duploIconHolder.classList.add("duplo", "duplo-icon-holder", "CITBButton");
            
            const iFaQuestion = document.createElement('i');
            iFaQuestion.classList.add("fas", "fa-question");
       
        const UL = document.createElement('ul');
        UL.classList.add("duplo-options");

            const LI = document.createElement('li');
            const LI1 = document.createElement('li');
               
            const duplo1 = document.createElement('div');
            duplo1.setAttribute('id', 'duplo1');
            duplo1.classList.add("duplo-icon-holder", "CITBButton","CITBDuplo1");
                const duplo1I = document.createElement('i');
                duplo1I.classList.add("fas", "fa-file-alt");


            const duplo2 = document.createElement('div');
            duplo2.setAttribute('id', 'duplo2');
            duplo2.classList.add("duplo-icon-holder", "CITBButton","CITBDuplo1");
                const duplo2I = document.createElement('i');
                duplo2I.classList.add("fas", "fa-video");


    const buttonDrag = document.createElement('button');
    buttonDrag.setAttribute('id', 'buttonDrag');


    buttonsContainer.appendChild(buttonClose);
    buttonsContainer.appendChild(CITBcamButton);
    buttonsContainer.appendChild(buttonShow);
    buttonsContainer.appendChild(showTooltip);
    buttonsContainer.appendChild(buttonClass);
    buttonsContainer.appendChild(classTooltip);
    buttonsContainer.appendChild(presentationTooltip);

    duplo1.appendChild(duplo1I)
    duplo2.appendChild(duplo2I)
    LI.appendChild(duplo1)
    LI1.appendChild(duplo2)
    UL.appendChild(LI)
    UL.appendChild(LI1)
    duploIconHolder.appendChild(iFaQuestion)
    buttonPresentation.appendChild(duploIconHolder)
    buttonPresentation.appendChild(UL)
    buttonsContainer.appendChild(buttonPresentation);
          
    buttonsContainer.appendChild(buttonDrag)
    return buttonsContainer;
}