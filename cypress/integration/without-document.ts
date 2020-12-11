describe('Main Workflow without document', ()=> {
  beforeEach(()=> {
    sessionStorage.setItem('shownDialog', 'true');

    cy.fixture('filters.json').as('filters');
    cy.fixture('indicatorResponse/allLevels.json').as('allLevelsIndicators');
    cy.fixture('indicatorResponse/poverty.json').as('povertyIndicators');
    cy.server();
    cy.route('GET', '**/indicator/filters', '@filters');
    cy.route('GET', '**/indicator', '@allLevelsIndicators');
    cy.route('GET', '**/indicator?sectors=Poverty', '@povertyIndicators');      
    
    cy.visit('/');
  });

  it("should test workflow without document", () => {
      hideSpin();
      cy.contains('Filter by Sector').click();
      cy.contains('Poverty').click();
      cy.get('#nextButton').click({ force: true }).then(()=> {
        cy.contains('Level');
        cy.contains('Result Statement');
        cy.contains('Status');
        cy.contains('Score');
        cy.contains('Action');
        cy.get('#nextButton').should('be.visible');
        cy.contains('Done').should('not.be.visible');
        cy.contains('Add Statement').click();
        cy.get('[data-cy=statement]').click();
        // Add result statement
        const statement: string = 'New statement';
        cy.get('[data-cy=statement-input]').type(statement);
        cy.get('[nzType="check-circle"]').click();  
        cy.contains('To validate a statement it must have a level set.');

        // Add level
        cy.get('[data-cy=level]').click();
        cy.get('.ant-select-selection-search-input').click()
        cy.contains('IMPACT').click();

        // Validate statement
        cy.route('POST', '**/statement-quality', {score: 80, status:'good'});

        cy.get('.check-icon').click();
        cy.contains('GOOD');
        cy.contains('80%');

        addStatement(1, 'New statement 2', 'OUTCOME', 20, 'bad');
        
        // Add statement to remove
        addStatement(2, 'New statement 3', 'OUTPUT', 30, 'bad');
        // Removing statement
        cy.get('.anticon').eq(2).click({force: true});
        cy.get(':nth-child(3) > :nth-child(5) > a > .anticon > svg').click();
        cy.get('.ant-popover-message').should('exist');
        cy.contains('Cancel').click();
        cy.get('.ant-popover-message').should('not.exist');
        cy.get(':nth-child(3) > :nth-child(5) > a > .anticon > svg').click();
        cy.contains('OK').click({force:true});
        cy.contains('New statement 3').should('not.exist');
        
        // Indicators Tab
        cy.get('#nextButton').click({ force: true }).then(()=> {
          cy.get('.propertiesCell').eq(0).click();

          // Add baseline value
          cy.get('#baselineInput').type('Baseline value', {force:true}).should('have.value', 'Baseline value');
          cy.get('.ant-table-content > table > .ant-table-tbody > .ant-table-row > .ant-table-selection-column').click({force:true});
          // cy.get(':nth-child(4) > .ant-picker > [nz-picker=""] > .ant-picker-input > .ng-pristine').type('2020', {force: true}).should('have.value', '2020');

          cy.contains('OK').click({force: true});
          // Select another row
          cy.get(':nth-child(4) > .ant-table-selection-column').click();
          // Visualisation Tab
          cy.get('#nextButton').click({ force: true }).then(()=> {
            cy.contains('Proceed').click();
            // cy.wait(5000);
            // cy.wrap('.draw2d_OutputPort').trigger("dragstart");
            // cy.get('[cy="40"]').trigger("drop");
            // Download Tab
            cy.get('#nextButton').click({ force: true }).then(()=> {
              cy.contains('Proceed').click();
              cy.contains('Download Indicators Word (EU format)');
              cy.contains('Download Indicators Word (PRM format)');
              cy.contains('Download Indicators Excel');
              cy.contains('Download Indicators Excel (DFID format)');
              cy.contains('Download Statements PNG');
              cy.get('#nextButton').should('not.be.visible');
              cy.contains('Previous').should('be.visible');
              cy.contains('Done').should('be.visible');
              cy.contains('Done').click();
              // Selection Tab
              hideSpin();
              cy.get('.ant-upload-text');
              cy.contains('Poverty').should('not.exist');
              cy.get('#nextButton').should('be.visible');
              cy.contains('Previous').should('not.be.visible');
            });
          });
        });
        
      });
  });

  function hideSpin(): void {
    // Hide extra layer of spin
    cy.get('.ant-spin').invoke('attr', 'style', 'display:none !important');
    cy.get('.ant-spin-blur').invoke('attr', 'class', 'ant-spin-container ng-star-inserted');
  }

  function addStatement(index: number, statement: string, level: string, score: number, status: string): void {
    // Add new statement
    cy.get('.add-icon').eq(0).click();

    cy.get('[data-cy=statement]').eq(index).click();

    // Add result statement
    cy.get('[data-cy=statement-input]').eq(index).type(statement);

    // Add level
    cy.get('[data-cy=level]').eq(index).click({force: true});
    cy.get('.ant-select-selection-search-input').eq(index).click();
    cy.contains(level).click();

    // Validate statement
    cy.route('POST', '**/statement-quality', {score: score, status:status});

    cy.get('.check-icon').eq(index).click();
    cy.contains(status.toUpperCase());
    cy.contains(score+'%');
  }
});