// VARIABLES //

const firstName = 'John';
const lastName = 'Totoro';
const postalCode = '59000';
const standardUserName = 'standard_user';
const lockUserName = 'locked_out_user' 
const password = 'secret_sauce';
const price = '$9.99';
const title = 'Sauce Labs Bike Light';
const description = "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.";
const btnCarValue = '1';

// FONCTIONS //

//Fontion pour se connecter avec le compte Standard
function logInStandardAccount(standardUserName, password) {
  cy.visit('/')
  cy.get('#user-name').type(standardUserName)
  cy.get('#password').type(password)
  cy.get('[data-test="login-button"]').click();
}
//Fonction pour les informations utilisateurs
function userDetailsInformations(firstName, lastName, postalCode){
  cy.get('#first-name').type(firstName)
  cy.get('#last-name').type(lastName)
  cy.get('#postal-code').type(postalCode)
}

//Fonctions pour vérifier les détails sur la page principale
function checkDetailsMainPage(price, title, description){
  cy.get('.inventory_item_name ').eq(1).invoke('text').then((valeurText)=>{
    cy.log(valeurText)
    expect(valeurText).to.eq(title)})
  cy.get('.inventory_item_price').eq(1).invoke('text').then((valeurText)=>{
    cy.log(valeurText)
    expect(valeurText).to.eq(price)})
  cy.get('.inventory_item_desc').eq(1).invoke('text').then((valeurText)=>{
    cy.log(valeurText)
    expect(valeurText).to.eq(description)})
  cy.get('.inventory_item_img').should('be.visible') //Vérifier que l'image est bien présente
}

//Fonction pour vérifier les détails d'un item dans le panier
function  checkDetails(price, title, description, btnCarValue){
  cy.get('#item_0_title_link').invoke('text').then((valeurText)=>{
    cy.log(valeurText)
    expect(valeurText).to.eq(title)})
  cy.get('.inventory_item_price').invoke('text').then((valeurText)=>{
    cy.log(valeurText)
    expect(valeurText).to.eq(price)})
  cy.get('.inventory_item_desc').invoke('text').then((valeurText)=>{
    cy.log(valeurText)
    expect(valeurText).to.eq(description)})
  cy.get('.shopping_cart_badge').invoke('text').then((valeurText)=>{
    cy.log(valeurText)
    expect(valeurText).to.eq(btnCarValue)})  

}



// CAS DE TEST 1 //
context ('User want to get acess to his account',()=>{

  describe ('User want to log in and log out from his account',()=>{

    it('User can log in', () => {
      cy.visit('/')
      cy.get('#login_button_container').should('not.be.enabled') //Assertion pour vérifier que je suis sur la page login
      cy.get('#user-name').type('standard_user')
      cy.get('#password').type('secret_sauce')
      cy.get('[data-test="login-button"]').click()
      cy.get('div>a.shopping_cart_link').should('be.visible') //Assertion pour vérifier que je suis connecté en ayant accès au bouton panier

    })
    it('User can log out', () => {
      logInStandardAccount(standardUserName, password)
      cy.get('#react-burger-menu-btn').click()
      cy.get('#logout_sidebar_link').click()
      cy.get('#login_button_container').should('not.be.enabled') //Assertion pour vérifier que je suis déconnecté en ayant accès au bouton login
    })
  })
  

// CAS DE TEST 2 //  
  describe ('User want to log with a locked account',()=>{

    it('User cant log and get error message', () => {
      logInStandardAccount(lockUserName, password)
      cy.get('[data-test="login-button"]').click()
      cy.get('[data-test="error"]').invoke('text').then((valeurText)=>{
        cy.log(valeurText)
        expect(valeurText).to.eq('Epic sadface: Sorry, this user has been locked out.')}) //Assertion pour récupérer le message d'erreur

    })

  })
})

// CAS DE TEST 3 //
context ('Standard user wants to sort items, add items, finalize the purchase',()=>{
  
  describe('Standard user wants to sort by price, add the 2 most expensives items and buy them ',()=>{

    it('User can sort items by price',()=>{
      logInStandardAccount(standardUserName, password)
      cy.get('[data-test="product-sort-container"]').select('Price (high to low)')
      cy.get('[data-test="product-sort-container"]').find(':selected').contains('Price (high to low)') // Assertion pour vérifier que la valeur du tri a bien été changée
    })
    
    it('User add the 2 most expensive items to his cart and go to cart and see details',()=>{
      logInStandardAccount(standardUserName, password)
      cy.get('[data-test="product-sort-container"]').select('Price (high to low)')
      cy.get('button.btn.btn_primary.btn_small.btn_inventory').eq(0).click() //Permet de sélectionner le premier item via le css que partage tous les boutons add to cart, il suffit de changer la valeur eq()
      cy.get('button.btn.btn_primary.btn_small.btn_inventory').eq(1).click()
      cy.get('#shopping_cart_container').click()
      cy.get('[data-test="shopping-cart-badge"]').invoke('text').then((valeurText)=>{
        cy.log(valeurText)
        expect(valeurText).to.eq('2')}) //Assertion pour vérifier que mon panier contient deux items via le logo sur le panier 
      })

    it('User can finalize his purchase with his contact informations',()=>{
      logInStandardAccount(standardUserName, password)
      cy.get('[data-test="product-sort-container"]').select('Price (high to low)')
      cy.get('#add-to-cart-sauce-labs-fleece-jacket').click()
      cy.get('#add-to-cart-sauce-labs-backpack').click()
      cy.get('#shopping_cart_container').click()
      cy.get('#checkout').click()
      userDetailsInformations(firstName, lastName, postalCode)
      cy.get('#continue').click()
      cy.get('#finish').click()
      cy.get('[data-test="complete-header"]').invoke('text').then((valeurText)=>{
        cy.log(valeurText)
        expect(valeurText).to.eq('Thank you for your order!')})
      })
    })
  
  // CAS DE TEST 4 //
  describe('Standard user to sort items by price ',()=>{
    
    it('User can sort items by higer price to lower price',()=>{
      logInStandardAccount(standardUserName, password)
      cy.get('[data-test="product-sort-container"]').select('Price (high to low)')
      cy.get('[data-test="product-sort-container"]').find(':selected').contains('Price (high to low)') // Assertion pour vérifier que la valeur du tri a bien été changée
    })

    it('User can sort items by lower price to higher price',()=>{
      logInStandardAccount(standardUserName, password)
      cy.get('[data-test="product-sort-container"]').select('Price (low to high)')
      cy.get('[data-test="product-sort-container"]').find(':selected').contains('Price (low to high)') // Assertion pour vérifier que la valeur du tri a bien été changée
    })
  })
})

// CAS DE TEST 5 //
context('Standard user want to add item in cart and check the details',()=>{

  describe('Standard user add the second items and go on the details page to check if the informations are correct',()=>{

    it('User add second items and go to details page',()=>{
      logInStandardAccount(standardUserName, password)
      checkDetailsMainPage(price, title, description)
      cy.get('button.btn.btn_primary.btn_small.btn_inventory').eq(1).click()
      cy.get('.shopping_cart_badge').invoke('text').then((valeurText)=>{
        cy.log(valeurText)
        expect(valeurText).to.eq(btnCarValue)})
      cy.get('#shopping_cart_container').click()
      checkDetails(price, title, description, btnCarValue)
    })

  })
})



