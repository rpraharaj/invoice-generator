// =======================================
// Invoice Generator Main Script
// Handles all client-side logic for the invoice app.
// =======================================

document.addEventListener('DOMContentLoaded', () => {
  // === DOM Elements ===
  const senderNameInput = document.getElementById('sender-name');
  const senderAddressInput = document.getElementById('sender-address');
  const senderPhoneInput = document.getElementById('sender-phone');
  const senderEmailInput = document.getElementById('sender-email');
  const logoUploadInput = document.getElementById('logo-upload');
  const logoPreviewImg = document.getElementById('logo-preview');
  const resetLogoBtn = document.getElementById('reset-logo');

  const clientNameInput = document.getElementById('client-name');
  const clientAddressInput = document.getElementById('client-address');
  const clientPhoneInput = document.getElementById('client-phone');
  const clientEmailInput = document.getElementById('client-email');

  const invoiceNumberInput = document.getElementById('invoice-number');
  const invoiceDateInput = document.getElementById('invoice-date');
  const dueDateInput = document.getElementById('due-date');
  const currencySelect = document.getElementById('currency');

  const lineItemsContainer = document.getElementById('line-items-container');
  const addRowBtn = document.getElementById('add-row-btn');

  const discountValueInput = document.getElementById('discount-value');
  const discountTypeSelect = document.getElementById('discount-type');
  const shippingChargesInput = document.getElementById('shipping-charges');

  const subtotalAmountSpan = document.getElementById('subtotal-amount');
  const totalTaxAmountSpan = document.getElementById('total-tax-amount');
  const grandTotalAmountSpan = document.getElementById('grand-total-amount');

  // Preview Elements
  const previewSenderName = document.getElementById('preview-sender-name');
  const previewSenderAddress = document.getElementById('preview-sender-address');
  const previewSenderPhone = document.getElementById('preview-sender-phone');
  const previewSenderEmail = document.getElementById('preview-sender-email');
  const previewLogoImg = document.getElementById('preview-logo');

  const previewClientName = document.getElementById('preview-client-name');
  const previewClientAddress = document.getElementById('preview-client-address');
  const previewClientPhone = document.getElementById('preview-client-phone');
  const previewClientEmail = document.getElementById('preview-client-email');

  const previewInvoiceNumber = document.getElementById('preview-invoice-number');
  const previewInvoiceDate = document.getElementById('preview-invoice-date');
  const previewDueDate = document.getElementById('preview-due-date');
  const previewCurrencySymbol = document.getElementById('preview-currency-symbol');

  const previewLineItemsBody = document.getElementById('preview-line-items-body');
  const previewSubtotal = document.getElementById('preview-subtotal');
  const previewTotalTax = document.getElementById('preview-total-tax');
  const previewDiscount = document.getElementById('preview-discount');
  const previewShipping = document.getElementById('preview-shipping');
  const previewGrandTotal = document.getElementById('preview-grand-total');

  const previewBankDetails = document.getElementById('preview-bank-details');
  const previewIfscSwift = document.getElementById('preview-ifsc-swift');
  const previewUpiId = document.getElementById('preview-upi-id');
  const previewPaymentLinkContainer = document.getElementById('preview-payment-link-container');
  const previewPaymentLink = document.getElementById('preview-payment-link');
  const previewNotes = document.getElementById('preview-notes');
  const previewTerms = document.getElementById('preview-terms');
  const generationTimestamp = document.getElementById('generation-timestamp');

  // Action Buttons
  const downloadPdfBtn = document.getElementById('download-pdf-btn');
  const printInvoiceBtn = document.getElementById('print-invoice-btn');
  const sendEmailBtn = document.getElementById('send-email-btn');
  const saveDefaultsBtn = document.getElementById('save-defaults-btn');
  const resetFormBtn = document.getElementById('reset-form-btn');

  // Email Modal Elements
  const emailModal = document.getElementById('email-modal');
  const closeEmailModalBtn = document.getElementById('close-email-modal-btn');
  const copyEmailDetailsBtn = document.getElementById('copy-email-details-btn');
  const emailClientAddressCopy = document.getElementById('email-client-address-copy');
  const emailInvoiceContentCopy = document.getElementById('email-invoice-content-copy');
  
  // Signature Elements
  const signatureUploadInput = document.getElementById('signature-upload');
  const signaturePreviewFormImg = document.getElementById('signature-preview-form');
  const resetSignatureBtn = document.getElementById('reset-signature');
  const previewSignatureImage = document.getElementById('preview-signature-image');
  const previewSignatureBlock = document.getElementById('preview-signature-block');

  // Display Options Checkboxes
  const includePaymentInstructionsCheckbox = document.getElementById('include-payment-instructions');
  const includeNotesTermsCheckbox = document.getElementById('include-notes-terms');
  const includeGenerationTimestampCheckbox = document.getElementById('include-generation-timestamp');
  const includeSignatureCheckbox = document.getElementById('include-signature');
  
  // Preview section blocks for toggling
  const previewPaymentInstructionsBlock = document.getElementById('preview-payment-instructions-block');
  const previewNotesTermsBlock = document.getElementById('preview-notes-terms-block');
  const previewGenerationTimestampBlock = document.getElementById('preview-generation-timestamp-block');

  // Default values for preview if inputs are empty
  const defaultSenderName = "Your Company LLC";
  const defaultSenderAddress = "123 Main St\nAnytown, USA";
  const defaultSenderPhone = "+1 (555) 123-4567";
  const defaultSenderEmail = "you@example.com";
  const defaultClientName = "Client Company Inc.";
  const defaultClientAddress = "456 Business Rd\nClient City, Country";
  const defaultClientPhone = "+1 (555) 987-6543";
  const defaultClientEmail = "client@example.com";
  const defaultNotes = "Thank you for your business!";
  const defaultTerms = "Payment due within 30 days.";
  const defaultBankDetails = "Bank: Global Bank Corp, Acc: 1234567890";
  const defaultIfscSwift = "IFSC/Swift: GBCNUS33";
  const defaultUpi = "";

  // === Currency Data & Number to Words Utility ===
  const currencyInfo = {
    USD: { name: "US Dollar", fraction: "Cent", symbol: "$" },
    EUR: { name: "Euro", fraction: "Cent", symbol: "€" },
    INR: { name: "Indian Rupee", fraction: "Paisa", symbol: "₹" },
    GBP: { name: "British Pound", fraction: "Pence", symbol: "£" },
    CAD: { name: "Canadian Dollar", fraction: "Cent", symbol: "C$" },
    AUD: { name: "Australian Dollar", fraction: "Cent", symbol: "A$" },
  };

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion']; // Add more if needed

  // Function to convert a number less than 1000 to words
  function convertLessThanOneThousand(num) {
    if (num === 0) return '';
    if (num < 20) return ones[num] + ' ';
    if (num < 100) return tens[Math.floor(num / 10)] + ' ' + (num % 10 !== 0 ? ones[num % 10] + ' ' : '');
    return ones[Math.floor(num / 100)] + ' Hundred ' + (num % 100 !== 0 ? convertLessThanOneThousand(num % 100) : '');
  }

  // Main function to convert a number to words
  function numberToWords(num, currencyCode = 'USD') {
    if (num === 0 || num === null || num === undefined) return 'Zero ' + (currencyInfo[currencyCode]?.name || currencyCode);
    if (typeof num === 'string') num = parseFloat(num);
    if (isNaN(num)) return 'Invalid Amount';

    const currency = currencyInfo[currencyCode] || { name: currencyCode, fraction: 'Fraction' };
    const integerPart = Math.floor(num);
    const fractionalPart = Math.round((num - integerPart) * 100);

    let words = '';
    if (integerPart === 0) {
        words = 'Zero ';
    } else {
        let currentNum = integerPart;
        let scaleIndex = 0;
        while (currentNum > 0) {
            if (currentNum % 1000 !== 0) {
                words = convertLessThanOneThousand(currentNum % 1000) + scales[scaleIndex] + ' ' + words;
            }
            currentNum = Math.floor(currentNum / 1000);
            scaleIndex++;
        }
    }
    
    words = words.trim(); // Remove leading/trailing spaces from integer part processing
    if (words.length > 0) {
      words += ' ' + currency.name;
    }

    if (fractionalPart > 0) {
        words += (words.length > 0 ? ' and ' : '') + convertLessThanOneThousand(fractionalPart).trim() + ' ' + currency.fraction;
    }
    words += ' Only';
    return words.replace(/\s+/g, ' ').trim(); // Replace multiple spaces with single and trim
  }

  // === Initial State & Setup ===
  let logoBase64 = null;
  let signatureBase64 = null; // Variable to store signature image data

  // Function to get current date as YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Function to set initial dates
  const setInitialDates = () => {
    invoiceDateInput.value = getCurrentDate();
    
    const today = new Date();
    today.setDate(today.getDate() + 30); // Default due date 30 days from today
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dueDateInput.value = `${yyyy}-${mm}-${dd}`;

    updatePreview();
  };

  // Function to get next invoice number from localStorage
  const getNextInvoiceNumber = () => {
    let lastInvoiceNum = parseInt(localStorage.getItem('lastInvoiceNumber')) || 0;
    lastInvoiceNum++;
    return `INV-${String(lastInvoiceNum).padStart(3, '0')}`;
  };

  // Function to save current invoice number to localStorage
  const saveCurrentInvoiceNumber = () => {
    const currentNumStr = invoiceNumberInput.value.replace('INV-', '');
    const currentNum = parseInt(currentNumStr);
    if (!isNaN(currentNum)) {
      localStorage.setItem('lastInvoiceNumber', currentNum);
    }
  };
  
  // Load default sender info from localStorage
  const loadSenderDefaults = () => {
    const defaults = JSON.parse(localStorage.getItem('senderDefaults'));
    if (defaults) {
      senderNameInput.value = defaults.name || '';
      senderAddressInput.value = defaults.address || '';
      senderPhoneInput.value = defaults.phone || '';
      senderEmailInput.value = defaults.email || '';
      if (defaults.logo) {
        logoBase64 = defaults.logo;
        logoPreviewImg.src = logoBase64;
        previewLogoImg.src = logoBase64;
        logoPreviewImg.classList.remove('hidden');
        resetLogoBtn.classList.remove('hidden');
        previewLogoImg.classList.remove('hidden');
      }
      if (defaults.signature) { // Load signature state
        signatureBase64 = defaults.signature;
        // Update form preview directly, live preview is handled by updatePreview
        signaturePreviewFormImg.src = signatureBase64;
        signaturePreviewFormImg.classList.remove('hidden');
        resetSignatureBtn.classList.remove('hidden');
      }
      // Also load payment details if saved
      document.getElementById('bank-name').value = defaults.bankName || '';
      document.getElementById('account-number').value = defaults.accountNumber || '';
      document.getElementById('ifsc-swift').value = defaults.ifscSwift || '';
      document.getElementById('upi-id').value = defaults.upiId || '';
      document.getElementById('payment-link').value = defaults.paymentLink || '';
      document.getElementById('notes').value = defaults.notes || defaultNotes;
      document.getElementById('terms').value = defaults.terms || defaultTerms;
      // Load display options preferences
      loadDisplayOptions();
    } else {
        // Set default notes and terms if no saved data
        document.getElementById('notes').value = defaultNotes;
        document.getElementById('terms').value = defaultTerms;
    }
    updatePreview(); // Ensure preview updates after loading defaults
  };

  // Save sender info to localStorage
  const saveSenderDefaults = () => {
    const defaults = {
      name: senderNameInput.value,
      address: senderAddressInput.value,
      phone: senderPhoneInput.value,
      email: senderEmailInput.value,
      logo: logoBase64,
      signature: signatureBase64, // Save signature
      bankName: document.getElementById('bank-name').value,
      accountNumber: document.getElementById('account-number').value,
      ifscSwift: document.getElementById('ifsc-swift').value,
      upiId: document.getElementById('upi-id').value,
      paymentLink: document.getElementById('payment-link').value,
      notes: document.getElementById('notes').value,
      terms: document.getElementById('terms').value,
      // Save display options preferences as well
      displayOptions: {
        paymentInstructions: includePaymentInstructionsCheckbox.checked,
        notesTerms: includeNotesTermsCheckbox.checked,
        generationTimestamp: includeGenerationTimestampCheckbox.checked,
        signature: includeSignatureCheckbox.checked // Save signature display preference
      }
    };
    localStorage.setItem('senderDefaults', JSON.stringify(defaults));
    alert('Sender information, default notes/terms, and display options saved!');
  };
  
  // Load display options from localStorage or set defaults
  const loadDisplayOptions = () => {
    const senderDefaults = JSON.parse(localStorage.getItem('senderDefaults'));
    const savedOptions = senderDefaults ? senderDefaults.displayOptions : null;

    includePaymentInstructionsCheckbox.checked = savedOptions ? savedOptions.paymentInstructions : true;
    includeNotesTermsCheckbox.checked = savedOptions ? savedOptions.notesTerms : true;
    includeGenerationTimestampCheckbox.checked = savedOptions ? savedOptions.generationTimestamp : true;
    includeSignatureCheckbox.checked = savedOptions ? savedOptions.signature : true; // Load signature display preference
  };

  // Initialize form
  const initializeForm = () => {
    invoiceNumberInput.value = getNextInvoiceNumber();
    setInitialDates();
    loadSenderDefaults(); // This loads sender text fields and potentially display options if saved within senderDefaults
    loadDisplayOptions(); // Explicitly load/set display options after other defaults
    addLineItemRow(); // Start with one item row
    updateAllCalculationsAndPreview(); // Initial calculation and preview update
  };


  // === Logo Handling ===
  logoUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        logoBase64 = e.target.result;
        logoPreviewImg.src = logoBase64;
        logoPreviewImg.classList.remove('hidden');
        previewLogoImg.src = logoBase64; // Update live preview
        previewLogoImg.classList.remove('hidden');
        resetLogoBtn.classList.remove('hidden');
        updatePreview();
      };
      reader.readAsDataURL(file);
    }
  });

  resetLogoBtn.addEventListener('click', () => {
    logoBase64 = null;
    logoUploadInput.value = ''; // Clear file input
    logoPreviewImg.src = '#';
    logoPreviewImg.classList.add('hidden');
    previewLogoImg.src = ''; // Clear live preview
    previewLogoImg.classList.add('hidden');
    resetLogoBtn.classList.add('hidden');
    updatePreview();
  });

  // === Signature Handling ===
  signatureUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        signatureBase64 = e.target.result;
        // Update form preview directly
        signaturePreviewFormImg.src = signatureBase64;
        signaturePreviewFormImg.classList.remove('hidden');
        resetSignatureBtn.classList.remove('hidden');
        // Live preview update will be handled by updatePreview via updateAllCalculationsAndPreview
        updateAllCalculationsAndPreview(); 
      };
      reader.readAsDataURL(file);
    }
  });

  resetSignatureBtn.addEventListener('click', () => {
    signatureBase64 = null;
    signatureUploadInput.value = ''; // Clear file input
    // Update form preview directly
    signaturePreviewFormImg.src = '#';
    signaturePreviewFormImg.classList.add('hidden');
    resetSignatureBtn.classList.add('hidden');
    // Live preview update will be handled by updatePreview via updateAllCalculationsAndPreview
    updateAllCalculationsAndPreview(); 
  });

  // === Line Item Management ===
  // Function to create a new line item row
  const createLineItemRowHTML = () => {
    // This is the HTML structure of a single line item row.
    // It's important that name attributes are unique or handled correctly if cloned.
    // For simplicity, we'll rely on querying within the row for calculations.
    return `
      <div class="line-item-row grid grid-cols-12 gap-2 items-center border-b border-gray-200 pb-2 pt-2">
        <div class="col-span-12 sm:col-span-4">
          <label class="hidden sm:block text-xs text-gray-600">Description</label>
          <input type="text" name="item-description" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-1.5" placeholder="Item or service">
        </div>
        <div class="col-span-3 sm:col-span-1">
          <label class="hidden sm:block text-xs text-gray-600">Qty</label>
          <input type="number" name="item-quantity" min="0" value="1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-1.5 text-center">
        </div>
        <div class="col-span-4 sm:col-span-2">
          <label class="hidden sm:block text-xs text-gray-600">Unit Price</label>
          <input type="number" name="item-unit-price" min="0" value="0.00" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-1.5 text-right">
        </div>
        <div class="col-span-3 sm:col-span-1">
          <label class="hidden sm:block text-xs text-gray-600">Tax (%)</label>
          <input type="number" name="item-tax" min="0" value="0" step="0.1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-1.5 text-center">
        </div>
        <div class="col-span-8 sm:col-span-3">
          <label class="hidden sm:block text-xs text-gray-600">Line Total</label>
          <input type="text" name="item-total" class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm p-1.5 text-right" placeholder="0.00" readonly>
        </div>
        <div class="col-span-4 sm:col-span-1 flex items-end justify-end">
          <button type="button" class="delete-row-btn text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    `;
  };

  // Add a new line item row to the form
  const addLineItemRow = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = createLineItemRowHTML();
    const newRow = tempDiv.firstElementChild;
    lineItemsContainer.appendChild(newRow);
    attachEventListenersToRow(newRow); // Attach listeners to new inputs
    updateAllCalculationsAndPreview();
  };
  
  // Attach event listeners to inputs within a specific row for real-time calculation
  const attachEventListenersToRow = (rowElement) => {
    const inputs = rowElement.querySelectorAll('input[name="item-quantity"], input[name="item-unit-price"], input[name="item-tax"], input[name="item-description"]');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        calculateLineItemTotal(rowElement);
        updateAllCalculationsAndPreview();
      });
      // For description, just update preview
      if(input.name === 'item-description') {
        input.addEventListener('input', updatePreviewLineItems);
      }
    });

    const deleteBtn = rowElement.querySelector('.delete-row-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        // Do not delete the last row
        if (lineItemsContainer.querySelectorAll('.line-item-row').length > 1) {
            rowElement.remove();
            updateAllCalculationsAndPreview();
        } else {
            alert("You cannot delete the last item row.");
        }
      });
    }
  };

  // Calculate total for a single line item
  const calculateLineItemTotal = (rowElement) => {
    const quantity = parseFloat(rowElement.querySelector('input[name="item-quantity"]').value) || 0;
    const unitPrice = parseFloat(rowElement.querySelector('input[name="item-unit-price"]').value) || 0;
    const taxPercent = parseFloat(rowElement.querySelector('input[name="item-tax"]').value) || 0;

    const itemSubtotal = quantity * unitPrice;
    const itemTaxAmount = itemSubtotal * (taxPercent / 100);
    const lineTotal = itemSubtotal + itemTaxAmount;

    rowElement.querySelector('input[name="item-total"]').value = lineTotal.toFixed(2);
  };
  
  // === Calculations ===
  // Calculate all totals: subtotal, total tax, grand total
  const calculateAllTotals = () => {
    let subtotal = 0;
    let totalTax = 0;

    document.querySelectorAll('.line-item-row').forEach(row => {
      const quantity = parseFloat(row.querySelector('input[name="item-quantity"]').value) || 0;
      const unitPrice = parseFloat(row.querySelector('input[name="item-unit-price"]').value) || 0;
      const taxPercent = parseFloat(row.querySelector('input[name="item-tax"]').value) || 0;
      
      const itemSubtotalWithoutTax = quantity * unitPrice;
      const itemTaxAmount = itemSubtotalWithoutTax * (taxPercent / 100);
      
      subtotal += itemSubtotalWithoutTax;
      totalTax += itemTaxAmount;
    });

    subtotalAmountSpan.textContent = subtotal.toFixed(2);
    totalTaxAmountSpan.textContent = totalTax.toFixed(2);

    const discountValue = parseFloat(discountValueInput.value) || 0;
    const discountType = discountTypeSelect.value;
    const shipping = parseFloat(shippingChargesInput.value) || 0;

    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = (subtotal + totalTax) * (discountValue / 100);
    } else { // flat
      discountAmount = discountValue;
    }
    
    let currentTotalBeforeShipping = subtotal + totalTax;
    if (discountAmount > currentTotalBeforeShipping) {
        discountAmount = currentTotalBeforeShipping; // Cap discount
    }
    const grandTotal = currentTotalBeforeShipping - discountAmount + shipping;

    grandTotalAmountSpan.textContent = grandTotal.toFixed(2);
    
    // Update currency symbol in form summary
    const formGrandTotalCurrency = document.getElementById('grand-total-currency-form');
    if (formGrandTotalCurrency) {
      formGrandTotalCurrency.textContent = currencyInfo[currencySelect.value]?.symbol || currencySelect.value;
    }
    // Update amount in words in form summary
    const formAmountInWords = document.getElementById('form-amount-in-words');
    if (formAmountInWords) {
      formAmountInWords.textContent = numberToWords(grandTotal, currencySelect.value);
    }
    
    return { subtotal, totalTax, discountAmount, shipping, grandTotal };
  };

  // === Live Preview Update ===
  const updatePreview = () => {
    // Sender Details
    previewSenderName.textContent = senderNameInput.value || defaultSenderName;
    previewSenderAddress.textContent = senderAddressInput.value || defaultSenderAddress;
    previewSenderPhone.textContent = senderPhoneInput.value ? `Phone: ${senderPhoneInput.value}` : (defaultSenderPhone ? `Phone: ${defaultSenderPhone}` : '');
    previewSenderEmail.textContent = senderEmailInput.value ? `Email: ${senderEmailInput.value}` : (defaultSenderEmail ? `Email: ${defaultSenderEmail}` : '');
    if (logoBase64) {
        previewLogoImg.src = logoBase64;
        previewLogoImg.classList.remove('hidden');
    } else {
        previewLogoImg.src = '';
        previewLogoImg.classList.add('hidden');
    }

    // Client Details
    previewClientName.textContent = clientNameInput.value || defaultClientName;
    previewClientAddress.textContent = clientAddressInput.value || defaultClientAddress;
    previewClientPhone.textContent = clientPhoneInput.value ? `Phone: ${clientPhoneInput.value}` : `Phone: ${defaultClientPhone}`;
    previewClientEmail.textContent = clientEmailInput.value ? `Email: ${clientEmailInput.value}` : `Email: ${defaultClientEmail}`;

    // Invoice Info
    previewInvoiceNumber.textContent = invoiceNumberInput.value || "INV-000";
    previewInvoiceDate.textContent = invoiceDateInput.value || getCurrentDate();
    previewDueDate.textContent = dueDateInput.value || "";
    
    // This span is no longer directly used for the main currency symbol display in preview grand total, but can be kept if used elsewhere or removed.
    // const currentCurrency = currencySelect.value;
    // previewCurrencySymbol.textContent = currencyInfo[currentCurrency]?.symbol || currentCurrency;

    // Payment Instructions (conditional display)
    if (includePaymentInstructionsCheckbox.checked) {
      previewPaymentInstructionsBlock.classList.remove('hidden');
      const bankName = document.getElementById('bank-name').value;
      const accountNumber = document.getElementById('account-number').value;
      previewBankDetails.textContent = (bankName || accountNumber) ? `Bank: ${bankName}, Acc: ${accountNumber}` : defaultBankDetails;
      previewIfscSwift.textContent = document.getElementById('ifsc-swift').value || defaultIfscSwift;
      previewUpiId.textContent = document.getElementById('upi-id').value ? `UPI: ${document.getElementById('upi-id').value}` : (defaultUpi ? `UPI: ${defaultUpi}` : '');
      
      const paymentLinkValue = document.getElementById('payment-link').value;
      if (paymentLinkValue) {
          previewPaymentLink.href = paymentLinkValue;
          previewPaymentLink.textContent = paymentLinkValue; 
          previewPaymentLinkContainer.classList.remove('hidden');
      } else {
          previewPaymentLinkContainer.classList.add('hidden');
      }
    } else {
      previewPaymentInstructionsBlock.classList.add('hidden');
    }
    
    // Notes & Terms (conditional display)
    if (includeNotesTermsCheckbox.checked) {
      previewNotesTermsBlock.classList.remove('hidden');
      previewNotes.textContent = document.getElementById('notes').value || defaultNotes;
      previewTerms.textContent = document.getElementById('terms').value || defaultTerms;
    } else {
      previewNotesTermsBlock.classList.add('hidden');
    }

    // Timestamp (conditional display)
    if (includeGenerationTimestampCheckbox.checked) {
      previewGenerationTimestampBlock.classList.remove('hidden');
      generationTimestamp.textContent = new Date().toLocaleString();
    } else {
      previewGenerationTimestampBlock.classList.add('hidden');
    }

    // Signature (conditional display)
    if (includeSignatureCheckbox.checked && signatureBase64) {
      previewSignatureBlock.classList.remove('hidden');
      previewSignatureImage.src = signatureBase64;
    } else {
      previewSignatureBlock.classList.add('hidden');
      previewSignatureImage.src = ''; // Clear src if not shown to avoid broken image icon
    }

    updatePreviewLineItems(); // This will also trigger calculation update
    updatePreviewTotals(); // Update totals section in preview
  };
  
  const updatePreviewLineItems = () => {
    previewLineItemsBody.innerHTML = ''; // Clear existing items
    document.querySelectorAll('.line-item-row').forEach(row => {
      const description = row.querySelector('input[name="item-description"]').value || "N/A";
      const quantity = parseFloat(row.querySelector('input[name="item-quantity"]').value) || 0;
      const unitPrice = parseFloat(row.querySelector('input[name="item-unit-price"]').value) || 0;
      const taxPercent = parseFloat(row.querySelector('input[name="item-tax"]').value) || 0;
      const lineTotal = parseFloat(row.querySelector('input[name="item-total"]').value) || 0;

      const tr = document.createElement('tr');
      tr.classList.add('border-b', 'border-gray-200');
      tr.innerHTML = `
        <td class="p-2">${description}</td>
        <td class="p-2 text-center">${quantity}</td>
        <td class="p-2 text-right">${unitPrice.toFixed(2)}</td>
        <td class="p-2 text-right">${taxPercent.toFixed(1)}%</td>
        <td class="p-2 text-right">${lineTotal.toFixed(2)}</td>
      `;
      previewLineItemsBody.appendChild(tr);
    });
  };
  
  const updatePreviewTotals = () => {
      const totals = calculateAllTotals(); // Recalculate to get fresh values
      previewSubtotal.textContent = totals.subtotal.toFixed(2);
      previewTotalTax.textContent = totals.totalTax.toFixed(2);
      previewDiscount.textContent = totals.discountAmount.toFixed(2);
      previewShipping.textContent = totals.shipping.toFixed(2);
      previewGrandTotal.textContent = totals.grandTotal.toFixed(2);
      
      // Update amount in words preview
      const amountInWordsPreview = document.getElementById('preview-amount-in-words');
      if (amountInWordsPreview) {
          amountInWordsPreview.textContent = numberToWords(totals.grandTotal, currencySelect.value);
      }
      // Update currency symbol in new layout
      const grandTotalCurrencySymbolPreview = document.getElementById('preview-grand-total-currency');
      if(grandTotalCurrencySymbolPreview){
          grandTotalCurrencySymbolPreview.textContent = currencyInfo[currencySelect.value]?.symbol || currencySelect.value;
      }
  };
  
  // Combined update function
  const updateAllCalculationsAndPreview = () => {
      calculateAllTotals(); // Calculate totals for the form first
      updatePreview();      // Then update the entire preview which includes items and totals
  };

  // === Event Listeners for Form Inputs ===
  // Attach to all relevant inputs for real-time preview update
  const allInputs = document.querySelectorAll(
    '#sender-details input, #sender-details textarea, ' +
    '#client-details input, #client-details textarea, ' +
    '#invoice-info input, #invoice-info select, ' +
    '#totals-section input, #totals-section select, ' +
    '#payment-instructions input, #notes-terms textarea, ' +
    '#display-options input[type="checkbox"]' // Add display options checkboxes
  );

  allInputs.forEach(input => {
    input.addEventListener('input', updateAllCalculationsAndPreview);
    input.addEventListener('change', updateAllCalculationsAndPreview); // For select, date
  });
  
  // Specifically for line item container, delegate events as rows are dynamic
  lineItemsContainer.addEventListener('input', (event) => {
      // Check if the event target is one of the dynamic row inputs
      if (event.target.matches('input[name="item-quantity"], input[name="item-unit-price"], input[name="item-tax"], input[name="item-description"]')) {
          const row = event.target.closest('.line-item-row');
          if (row) {
              calculateLineItemTotal(row); // Calculate for specific row
              updateAllCalculationsAndPreview(); // Update everything
          }
      }
  });


  // === Action Buttons ===
  addRowBtn.addEventListener('click', addLineItemRow);

  saveDefaultsBtn.addEventListener('click', saveSenderDefaults);

  downloadPdfBtn.addEventListener('click', () => {
    saveCurrentInvoiceNumber(); // Save before download
    const invoicePreviewElement = document.getElementById('invoice-preview');
    const clientNameForFile = clientNameInput.value.trim() || 'invoice_details';
    const invoiceNumberForFile = invoiceNumberInput.value.trim() || 'INV000';

    const opt = {
      margin:       0.4, // inches
      filename:     `${invoiceNumberForFile}_${clientNameForFile}.pdf`,
      image:        { type: 'png', quality: 0.98 }, 
      html2canvas:  {
        scale: 1.5, 
        useCORS: true, 
        logging: true, 
        letterRendering: true, 
        scrollY: 0
      },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak:    { mode: 'avoid-all' } 
    };
    // To ensure all content is captured, especially with potential overflow
    invoicePreviewElement.style.height = 'auto'; 
    // Temporarily ensure the preview container itself doesn't constrain the preview element too much
    const previewContainer = document.getElementById('invoice-preview-container');
    const originalContainerHeight = previewContainer.style.height;
    previewContainer.style.height = 'auto';

    html2pdf().from(invoicePreviewElement).set(opt).save().then(() => {
        invoicePreviewElement.style.height = ''; // Reset element height
        previewContainer.style.height = originalContainerHeight; // Reset container height
        // Increment invoice number for next time AFTER successful save
        invoiceNumberInput.value = getNextInvoiceNumber(); 
    }).catch(err => {
        console.error("Error generating PDF:", err);
        invoicePreviewElement.style.height = ''; // Reset element height on error too
        previewContainer.style.height = originalContainerHeight; // Reset container height on error too
    });
  });

  printInvoiceBtn.addEventListener('click', () => {
    saveCurrentInvoiceNumber(); // Save before print
    // Optional: Increment invoice number for next use after printing
    // invoiceNumberInput.value = getNextInvoiceNumber(); 
    // localStorage.setItem('lastInvoiceNumber', parseInt(invoiceNumberInput.value.replace('INV-','')));
    window.print();
  });

  // Simulate Send Email
  sendEmailBtn.addEventListener('click', () => {
    const clientEmail = clientEmailInput.value;
    emailClientAddressCopy.value = clientEmail || "No client email entered.";
    
    // Create a simplified text/HTML representation for email body
    let emailBody = "INVOICE DETAILS:\n";
    emailBody += `------------------------------------\n`;
    emailBody += `Invoice #: ${previewInvoiceNumber.textContent}\n`;
    emailBody += `Date: ${previewInvoiceDate.textContent}\n`;
    emailBody += `Due Date: ${previewDueDate.textContent}\n\n`;
    emailBody += `FROM:\n${previewSenderName.textContent}\n${previewSenderAddress.textContent.replace(/\n/g, ', ')}\n\n`;
    emailBody += `TO:\n${previewClientName.textContent}\n${previewClientAddress.textContent.replace(/\n/g, ', ')}\n\n`;
    emailBody += `ITEMS:\n`;
    previewLineItemsBody.querySelectorAll('tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        emailBody += `- ${cells[0].textContent} (Qty: ${cells[1].textContent}, Price: ${cells[2].textContent}, Tax: ${cells[3].textContent}, Total: ${cells[4].textContent})\n`;
    });
    emailBody += `\nSUBTOTAL: ${previewSubtotal.textContent} ${previewCurrencySymbol.textContent}\n`;
    emailBody += `TOTAL TAX: ${previewTotalTax.textContent} ${previewCurrencySymbol.textContent}\n`;
    if (parseFloat(previewDiscount.textContent) > 0) {
        emailBody += `DISCOUNT: ${previewDiscount.textContent} ${previewCurrencySymbol.textContent}\n`;
    }
    if (parseFloat(previewShipping.textContent) > 0) {
        emailBody += `SHIPPING: ${previewShipping.textContent} ${previewCurrencySymbol.textContent}\n`;
    }
    emailBody += `GRAND TOTAL: ${previewGrandTotal.textContent} ${previewCurrencySymbol.textContent}\n`;

    if (includePaymentInstructionsCheckbox.checked) {
      emailBody += `\nPAYMENT INSTRUCTIONS:\n`;
      if (document.getElementById('bank-name').value || document.getElementById('account-number').value) {
        emailBody += `${previewBankDetails.textContent}\n`;
      }
      if (document.getElementById('ifsc-swift').value) {
        emailBody += `${previewIfscSwift.textContent}\n`;
      }
      if (document.getElementById('upi-id').value) {
         emailBody += `UPI: ${document.getElementById('upi-id').value}\n`;
      }
      if (document.getElementById('payment-link').value) {
        emailBody += `Payment Link: ${document.getElementById('payment-link').value}\n`;
      }
    }

    if (includeNotesTermsCheckbox.checked) {
      emailBody += `\nNOTES:\n${previewNotes.textContent}\n`;
      emailBody += `\nTERMS:\n${previewTerms.textContent}\n`;
    }
    
    if (includeGenerationTimestampCheckbox.checked) {
        emailBody += `\nGenerated on: ${generationTimestamp.textContent}\n`;
    }

    if (includeSignatureCheckbox.checked && signatureBase64) {
      emailBody += `\n\n[Signature included in PDF/Invoice]`;
    }

    emailInvoiceContentCopy.value = emailBody;
    emailModal.classList.remove('hidden');
  });

  closeEmailModalBtn.addEventListener('click', () => {
    emailModal.classList.add('hidden');
  });

  copyEmailDetailsBtn.addEventListener('click', () => {
    let combinedDetails = `Client Email: ${emailClientAddressCopy.value}\n\n--- INVOICE ---\n${emailInvoiceContentCopy.value}`;
    navigator.clipboard.writeText(combinedDetails).then(() => {
        alert('Client email and invoice content copied to clipboard!');
        emailModal.classList.add('hidden');
    }).catch(err => {
        alert('Failed to copy details. Please copy manually.');
        console.error('Clipboard copy failed: ', err);
    });
  });
  
  // Form Reset
  resetFormBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default form reset if it's type="reset" on a form element
    if (confirm("Are you sure you want to reset the entire form? Unsaved changes will be lost.")) {
        // Clear all input fields
        document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="url"], textarea').forEach(input => input.value = '');
        document.querySelectorAll('input[type="date"]').forEach(input => input.value = ''); // Clear dates
        document.querySelectorAll('select').forEach(select => select.selectedIndex = 0); // Reset selects to first option

        // Clear logo
        logoBase64 = null;
        logoUploadInput.value = '';
        logoPreviewImg.src = '#';
        logoPreviewImg.classList.add('hidden');
        previewLogoImg.src = '';
        previewLogoImg.classList.add('hidden');
        resetLogoBtn.classList.add('hidden');

        // Clear signature
        signatureBase64 = null;
        signatureUploadInput.value = '';
        signaturePreviewFormImg.src = '#';
        signaturePreviewFormImg.classList.add('hidden');
        previewSignatureImage.src = '';
        resetSignatureBtn.classList.add('hidden');

        // Remove all but one line item row
        const itemRows = lineItemsContainer.querySelectorAll('.line-item-row');
        itemRows.forEach((row, index) => {
            if (index > 0) row.remove(); // Remove all but the first
        });
        // Clear the first row's inputs
        const firstRow = lineItemsContainer.querySelector('.line-item-row');
        if(firstRow){
            firstRow.querySelector('input[name="item-description"]').value = '';
            firstRow.querySelector('input[name="item-quantity"]').value = '1';
            firstRow.querySelector('input[name="item-unit-price"]').value = '0.00';
            firstRow.querySelector('input[name="item-tax"]').value = '0';
        }
        
        // Restore default notes and terms
        document.getElementById('notes').value = defaultNotes;
        document.getElementById('terms').value = defaultTerms;
        
        // Restore default payment values (empty or defaults if set)
        document.getElementById('bank-name').value = '';
        document.getElementById('account-number').value = '';
        document.getElementById('ifsc-swift').value = '';
        document.getElementById('upi-id').value = '';
        document.getElementById('payment-link').value = '';

        // Re-initialize critical parts (like invoice number, dates, default sender info if any)
        invoiceNumberInput.value = getNextInvoiceNumber(); // Get new invoice number
        setInitialDates();
        loadSenderDefaults(); // This will reload sender info which might include notes/terms/payment if saved

        updateAllCalculationsAndPreview(); // Update everything after reset
        alert("Form has been reset.");
    }
  });

  // === Initial Call ===
  initializeForm();
  // Attach event listeners to the initially created line item row(s)
  document.querySelectorAll('.line-item-row').forEach(row => attachEventListenersToRow(row));

}); 