const express = require('express');
const router = express.Router();

// USSD entry point

// USSD session state simulation (for demo, use DB/cache in production)
const sessionState = {};

router.post('/ussd', (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  let response = '';

  // Split text by * to get menu navigation
  const inputs = text.split('*');

  // Step 1: Role selection
  if (text === '') {
    response = 'CON Welcome to AgriNova\nSelect your role:\n1. Farmer\n2. Buyer\n3. Seller\n4. Tractor Hirer';
  }
  // Step 2: Role-specific menus
  else if (inputs.length === 1) {
    switch (inputs[0]) {
      case '1': // Farmer
        response = 'CON Farmer Menu:\n1. Report Disease\n2. Record Expense\n3. Check Market Prices\n4. Ask AI Assistant';
        break;
      case '2': // Buyer
        response = 'CON Buyer Menu:\n1. Browse Products\n2. Place Order\n3. Check Market Prices\n4. Ask AI Assistant';
        break;
      case '3': // Seller
        response = 'CON Seller Menu:\n1. List Product\n2. View Orders\n3. Check Market Prices\n4. Ask AI Assistant';
        break;
      case '4': // Tractor Hirer
        response = 'CON Tractor Hirer Menu:\n1. List Tractor\n2. Hire Tractor\n3. View Bookings\n4. Ask AI Assistant';
        break;
      default:
        response = 'END Invalid role. Please try again.';
    }
  }
  // Step 3: Farmer actions
  else if (inputs[0] === '1' && inputs.length === 2) {
    switch (inputs[1]) {
      case '1':
        response = 'CON Enter symptoms (e.g., yellow leaves):';
        break;
      case '2':
        response = 'CON Enter expense amount:';
        break;
      case '3':
        response = 'END Maize: 100 KES\nMilk: 50 KES';
        break;
      case '4':
        response = 'CON Ask your question:';
        break;
      default:
        response = 'END Invalid input.';
    }
  }
  // Step 4: Farmer disease reporting
  else if (inputs[0] === '1' && inputs[1] === '1' && inputs.length === 3) {
    const symptoms = inputs[2];
    // TODO: Call AI diagnosis logic
    response = `END Diagnosis for ${symptoms}: Sample diagnosis. Recommendation: Sample treatment.`;
  }
  // Step 4: Farmer expense recording
  else if (inputs[0] === '1' && inputs[1] === '2' && inputs.length === 3) {
    response = 'CON Enter expense description:';
  }
  else if (inputs[0] === '1' && inputs[1] === '2' && inputs.length === 4) {
    response = 'END Expense recorded. Thank you!';
  }
  // Step 4: Farmer AI assistant
  else if (inputs[0] === '1' && inputs[1] === '4' && inputs.length === 3) {
    const question = inputs[2];
    // TODO: Call AI assistant logic
    response = `END AI Response: Sample answer for "${question}".`;
  }
  // Step 3: Buyer actions
  else if (inputs[0] === '2' && inputs.length === 2) {
    switch (inputs[1]) {
      case '1':
        response = 'END Maize: 100 KES\nMilk: 50 KES';
        break;
      case '2':
        response = 'CON Enter product ID to order:';
        break;
      case '3':
        response = 'END Maize: 100 KES\nMilk: 50 KES';
        break;
      case '4':
        response = 'CON Ask your question:';
        break;
      default:
        response = 'END Invalid input.';
    }
  }
  // Step 4: Buyer order placement
  else if (inputs[0] === '2' && inputs[1] === '2' && inputs.length === 3) {
    const productId = inputs[2];
    // TODO: Place order logic
    response = `END Order placed for product ${productId}.`;
  }
  // Step 4: Buyer AI assistant
  else if (inputs[0] === '2' && inputs[1] === '4' && inputs.length === 3) {
    const question = inputs[2];
    // TODO: Call AI assistant logic
    response = `END AI Response: Sample answer for "${question}".`;
  }
  // Step 3: Seller actions
  else if (inputs[0] === '3' && inputs.length === 2) {
    switch (inputs[1]) {
      case '1':
        response = 'CON Enter product name to list:';
        break;
      case '2':
        response = 'END Orders: None yet.';
        break;
      case '3':
        response = 'END Maize: 100 KES\nMilk: 50 KES';
        break;
      case '4':
        response = 'CON Ask your question:';
        break;
      default:
        response = 'END Invalid input.';
    }
  }
  // Step 4: Seller product listing
  else if (inputs[0] === '3' && inputs[1] === '1' && inputs.length === 3) {
    const productName = inputs[2];
    // TODO: List product logic
    response = `END Product "${productName}" listed.`;
  }
  // Step 4: Seller AI assistant
  else if (inputs[0] === '3' && inputs[1] === '4' && inputs.length === 3) {
    const question = inputs[2];
    // TODO: Call AI assistant logic
    response = `END AI Response: Sample answer for "${question}".`;
  }
  // Step 3: Tractor Hirer actions
  else if (inputs[0] === '4' && inputs.length === 2) {
    switch (inputs[1]) {
      case '1':
        response = 'CON Enter tractor details to list:';
        break;
      case '2':
        response = 'CON Enter tractor ID to hire:';
        break;
      case '3':
        response = 'END Bookings: None yet.';
        break;
      case '4':
        response = 'CON Ask your question:';
        break;
      default:
        response = 'END Invalid input.';
    }
  }
  // Step 4: Tractor Hirer listing
  else if (inputs[0] === '4' && inputs[1] === '1' && inputs.length === 3) {
    const tractorDetails = inputs[2];
    // TODO: List tractor logic
    response = `END Tractor "${tractorDetails}" listed.`;
  }
  // Step 4: Tractor Hirer hiring
  else if (inputs[0] === '4' && inputs[1] === '2' && inputs.length === 3) {
    const tractorId = inputs[2];
    // TODO: Hire tractor logic
    response = `END Tractor ${tractorId} hired.`;
  }
  // Step 4: Tractor Hirer AI assistant
  else if (inputs[0] === '4' && inputs[1] === '4' && inputs.length === 3) {
    const question = inputs[2];
    // TODO: Call AI assistant logic
    response = `END AI Response: Sample answer for "${question}".`;
  }
  else {
    response = 'END Invalid input. Please try again.';
  }

  res.set('Content-Type: text/plain');
  res.send(response);
});

module.exports = router;
