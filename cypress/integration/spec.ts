describe('Home Page', ()=> {
  const BASE_URL = Cypress.config().baseUrl;
  beforeEach(()=> {

    cy.fixture('filters.json').as('filters');
    cy.fixture('indicatorResponse/allLevels.json').as('allLevelsIndicators');
    cy.fixture('indicatorResponse/poverty.json').as('povertyIndicators');
    cy.server();
    cy.route('GET', '**/indicator/filters', '@filters');
    cy.route('GET', '**/indicator', '@allLevelsIndicators');
    cy.route('GET', '**/indicator?sector=Poverty', '@povertyIndicators');
    
    cy.visit('/');
    sessionStorage.clear();
  });
  
  it("should display the selection tab", () => {
    // side buttons
    cy.get('#stepButton').should('be.visible');
    cy.get('#feedbackButton').should('be.visible');
    cy.get('#knowledgeBaseButton').should('be.visible');
    cy.get('#uploadButton').should('be.visible');
    
    cy.get('.ant-modal-close-x').click();
    // top header
    cy.contains('SELECTION');
    cy.contains('RESULT');
    cy.contains('VISUALISATION');
    cy.contains('DOWNLOAD');
    
    cy.contains('Filter by Sector');
    cy.contains('Filter by sources');
    cy.contains('Filter by SDGs');
    cy.contains('Filter by levels');

    cy.contains('Sector:');
    cy.contains('Sources:');
    cy.contains('SDGs:');
    cy.contains('Levels:');

    cy.get('.disclaimerText').contains('Disclaimer: Uploading data here is safe. You can trust us with your info, because we never save it anywhere. The algorithm uses your text to scan for keywords and retains access to it only so you can complete the procedure. Your data is discarded as soon as you click ‘done’ in the last step, or if you refresh the window before you’re done. We cannot access your information at any point.');
    // cy.get('.ant-upload-text').contains('CLICK TO THIS AREA TO UPLOAD');
    cy.get('.ant-upload-hint').contains('Support for a single MS Word file upload.')
    
    // buttons that shouldn't be visible
    cy.contains('Previous').should('not.be.visible');
    cy.contains('Done').should('not.be.visible');

    // legal information
    cy.contains('Data Protection Declaration');
    cy.contains('Imprint');
    cy.contains('Logframe Lab ©'+new Date().getFullYear()+' developed by Arqaam GmbH');
  });

  it("should test workflow with document", () => {
    hideSpin();
    const fixtureName = 'test_upload.docx';
    const fileType = '';
    let selector = cy.get('input[type="file"]');
    // let selector = cy.get('[data-cy="uploadDocument"]');
    
    cy.fixture('test_upload.docx').as(fixtureName);
    // cy.get('.uploadText').attachFile(fixtureName);
    // cy.attachFile(fixtureName);
    // cy.uploadFile(selector, fixtureName, '');
    // cy.upload_file(fixtureName, '', selector);
    // cy.fixture(fixtureName, 'hex').then((fileHex) => {

    //     const fileBytes = hexStringToByte(fileHex);
    //     const testFile = new File([fileBytes], fixtureName, {
    //         type: fileType
    //     });
    //     const dataTransfer = new DataTransfer()
    //     const el = selector[0]
        
    //     dataTransfer.items.add(testFile)
    //     el.files = dataTransfer.files
    // })

});

  it('should display help', ()=> {
      cy.get('.ant-modal-close-x').click();
      cy.get('.closeHelpIcon').should('not.exist');
      cy.get('#stepButton').should('be.visible');
      cy.get('#stepButton').click();
      cy.get('.closeHelpIcon').should('be.visible');
      cy.get('.closeHelpIcon').click();
      cy.get('.closeHelpIcon').should('not.exist');
  });

  /*it('should go to the feedback page', ()=> {
      cy.get('#feedbackButton').should('be.visible');
      cy.get('#feedbackButton').should('have.prop', 'href', 'https://feedback.logframelab.ai');
  });*/
  it('should go to the upload indicators page', ()=> {
    cy.get('#uploadButton').should('be.visible');
    cy.get('#uploadButton').click();
    cy.url().should('equal', BASE_URL+ 'indicators-upload');
  });

  function hideSpin(): void {
    // Hide extra layer of spin
    cy.get('.ant-spin').invoke('attr', 'style', 'display:none !important');
    cy.get('.ant-spin-blur').invoke('attr', 'class', 'ant-spin-container ng-star-inserted');
  }

  function hexStringToByte(str) {
    if (!str) {
        return new Uint8Array();
    }

    var a = [];
    for (var i = 0, len = str.length; i < len; i += 2) {
        a.push(parseInt(str.substr(i, 2), 16));
    }

    return new Uint8Array(a);
}
});
