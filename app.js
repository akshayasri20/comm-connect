/* ==========================================================================
   Application Logic - Community Connect
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // State Management
  const state = {
    currentStep: 1,
    logoDataUrl: null,
    industries: [],
    tags: [],
    countryData: {
      "United States": {
        states: {
          "California": ["San Francisco", "Los Angeles", "San Diego"],
          "New York": ["New York City", "Buffalo", "Rochester"],
          "Texas": ["Austin", "Houston", "Dallas"]
        }
      },
      "India": {
        states: {
          "Karnataka": ["Bengaluru", "Mysore", "Hubli"],
          "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
          "Delhi": ["New Delhi", "Dwarka"]
        }
      },
      "Canada": {
        states: {
          "Ontario": ["Toronto", "Ottawa", "Hamilton"],
          "British Columbia": ["Vancouver", "Victoria", "Kelowna"],
          "Quebec": ["Montreal", "Quebec City"]
        }
      },
      "United Kingdom": {
        states: {
          "England": ["London", "Manchester", "Birmingham"],
          "Scotland": ["Edinburgh", "Glasgow", "Aberdeen"]
        }
      }
    }
  };

  // Industries available for multi-select
  const availableIndustries = [
    "Technology", "Software Development", "Artificial Intelligence", 
    "Biotechnology", "Healthcare", "Education", "Creative Arts", 
    "Design", "Finance", "Fintech", "Social Services", "NGO & Non-Profit", 
    "Environmental Research", "Corporate Management", "Academic Study"
  ];

  // DOM Elements - Stepper
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const progressLine = document.getElementById('progress-line');
  const formPanes = document.querySelectorAll('.form-step-pane');
  const communityForm = document.getElementById('community-form');

  // DOM Elements - Navigation buttons
  const footerBtnBack = document.getElementById('footer-btn-back');
  const footerBtnSave = document.getElementById('footer-btn-save');
  const footerBtnPreview = document.getElementById('footer-btn-preview');
  const footerBtnContinue = document.getElementById('footer-btn-continue');
  const headerSaveDraft = document.getElementById('header-save-draft');
  const headerPreview = document.getElementById('header-preview');
  const headerPublish = document.getElementById('header-publish');

  // DOM Elements - Custom Selects
  const countryCodeTrigger = document.getElementById('country-code-trigger');
  const countryCodeOptions = document.getElementById('country-code-options');
  const selectedCountryCode = document.getElementById('selected-country-code');
  
  const specializationTrigger = document.getElementById('specialization-trigger');
  const specializationOptions = document.getElementById('specialization-options');
  const selectedSpecialization = document.getElementById('selected-specialization');
  
  const categoryTrigger = document.getElementById('category-trigger');
  const categoryOptions = document.getElementById('category-options');
  const selectedCategory = document.getElementById('selected-category');

  const countryTrigger = document.getElementById('country-trigger');
  const countryOptions = document.getElementById('country-options');
  const selectedCountry = document.getElementById('selected-country');

  const stateSelectWrapper = document.getElementById('state-select-wrapper');
  const stateTrigger = document.getElementById('state-trigger');
  const stateOptions = document.getElementById('state-options');
  const selectedState = document.getElementById('selected-state');

  const citySelectWrapper = document.getElementById('city-select-wrapper');
  const cityTrigger = document.getElementById('city-trigger');
  const cityOptions = document.getElementById('city-options');
  const selectedCity = document.getElementById('selected-city');

  // DOM Elements - Modals
  const modalDashboardPreview = document.getElementById('modal-dashboard-preview');
  const modalDraftSaved = document.getElementById('modal-draft-saved');
  const modalSuccessPublish = document.getElementById('modal-success-publish');
  const btnClosePreviewModal = document.getElementById('btn-close-preview-modal');
  const btnCloseDraftModal = document.getElementById('btn-close-draft-modal');
  const btnSuccessViewDraft = document.getElementById('btn-success-view-draft');
  const btnSuccessGoDashboard = document.getElementById('btn-success-go-dashboard');

  // DOM Elements - Inputs
  const logoInput = document.getElementById('logo-input');
  const logoDropzone = document.getElementById('logo-dropzone');
  const uploadPlaceholderState = document.getElementById('upload-placeholder-state');
  const uploadPreviewState = document.getElementById('upload-preview-state');
  const logoImgPreview = document.getElementById('logo-img-preview');
  const btnRemoveLogo = document.getElementById('btn-remove-logo');

  const inputCommunityName = document.getElementById('community-name');
  const inputCommunitySlug = document.getElementById('community-slug');
  const inputEmailId = document.getElementById('email-id');
  const inputPhoneNumber = document.getElementById('phone-number');
  const websiteUrlGroup = document.getElementById('website-url-group');
  const inputWebsiteUrl = document.getElementById('website-url');
  const inputMission = document.getElementById('mission-statement');
  const inputVision = document.getElementById('vision-statement');
  const inputCommunityDesc = document.getElementById('community-desc');
  const inputHighlights = document.getElementById('highlights-statement');
  const inputFoundedDate = document.getElementById('founded-date');
  const inputMemberCount = document.getElementById('member-count');
  const inputAddress = document.getElementById('address-details');
  const inputTagText = document.getElementById('tag-text-input');
  const tagInputBox = document.getElementById('tag-input-box');
  const tagsWrapper = document.getElementById('tags-wrapper');

  // DOM Elements - Dynamic Preview Synced Fields (panel removed - keeping refs as null-safe)
  const previewTitleVal = document.getElementById('preview-title-val');
  const previewSlugVal = document.getElementById('preview-slug-val');
  const previewDescVal = document.getElementById('preview-desc-val');
  const previewMembersVal = document.getElementById('preview-members-val');
  const previewLocationVal = document.getElementById('preview-location-val');
  const previewBadgeVisibility = document.getElementById('preview-badge-visibility');
  const previewBadgeCategory = document.getElementById('preview-badge-category');
  const previewTagsHolder = document.getElementById('preview-tags-holder');
  const previewLogoBox = document.getElementById('preview-logo-box');
  const previewLogoLetter = document.getElementById('preview-logo-letter');
  const previewLogoImg = document.getElementById('preview-logo-img');
  const previewPercentBar = document.getElementById('preview-percent-bar');
  const previewPercentText = document.getElementById('preview-percent-text');

  // Helper: safe text setter for potentially-null preview elements
  const setPreviewText = (el, val) => { if (el) el.textContent = val; };
  const setPreviewSrc = (el, val) => { if (el) el.src = val; };
  const togglePreviewClass = (el, cls, add) => { if (el) el.classList[add ? 'add' : 'remove'](cls); };
  const setPreviewStyle = (el, prop, val) => { if (el) el.style[prop] = val; };

  // DOM Elements - Simulated Portal Widgets
  const mockDashLogo = document.getElementById('mock-dash-logo');
  const mockDashLogoText = document.getElementById('mock-dash-logo-text');
  const mockDashTitle = document.getElementById('mock-dash-title');
  const mockDashWelcome = document.getElementById('mock-dash-welcome');
  const mockDashMemberCount = document.getElementById('mock-dash-member-count');
  const mockDashVisibility = document.getElementById('mock-dash-visibility');
  const mockDashLocation = document.getElementById('mock-dash-location');
  const mockDashMission = document.getElementById('mock-dash-mission');
  const mockDashTags = document.getElementById('mock-dash-tags');

  // Feature menu items in simulated dashboard
  const mockMenuForum = document.getElementById('mock-menu-forum');
  const mockMenuEvents = document.getElementById('mock-menu-events');
  const mockMenuLibrary = document.getElementById('mock-menu-library');
  const mockMenuJobs = document.getElementById('mock-menu-jobs');

  // Success summary elements
  const publishedCommunityTitle = document.getElementById('published-community-title');
  const publishedSlugLink = document.getElementById('published-slug-link');
  const publishedVisibilityBadge = document.getElementById('published-visibility-badge');
  const publishedFeaturesList = document.getElementById('published-features-list');

  /* ==========================================================================
     0. Helper Utilities & Validators
     ========================================================================== */

  // Email validator regex
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // URL validator
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Error styling setters
  const setFieldError = (element, message) => {
    const group = element.closest('.form-group');
    if (!group) return;
    group.classList.add('has-error');
    const errMsg = group.querySelector('.error-msg');
    if (errMsg) errMsg.textContent = message;
  };

  const clearFieldError = (element) => {
    const group = element.closest('.form-group');
    if (!group) return;
    group.classList.remove('has-error');
  };

  // Clear errors dynamically on input entry
  const setupErrorClearing = () => {
    const inputs = communityForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => clearFieldError(input));
      input.addEventListener('change', () => clearFieldError(input));
    });
  };

  // Slug generator function
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .substring(0, 50);              // Cap at 50 chars
  };

  // Run error clearing setup immediately
  setupErrorClearing();


  /* ==========================================================================
     1. Custom Selects Infrastructure
     ========================================================================== */

  // Utility to handle triggers toggling options
  const setupCustomSelect = (trigger, optionsBox) => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDropdowns(optionsBox);
      trigger.classList.toggle('active');
      optionsBox.classList.toggle('hidden');
    });

    optionsBox.addEventListener('click', (e) => {
      const option = e.target.closest('.select-option');
      if (!option) return;

      const value = option.dataset.value;
      const text = option.textContent;
      const displaySpan = trigger.querySelector('span');

      displaySpan.textContent = text;
      displaySpan.classList.remove('placeholder-text');
      trigger.dataset.value = value;

      // Unselect previous
      optionsBox.querySelectorAll('.select-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');

      trigger.classList.remove('active');
      optionsBox.classList.add('hidden');

      // Trigger custom change event for dependent inputs
      const event = new CustomEvent('change', { detail: { value, text } });
      trigger.dispatchEvent(event);
      clearFieldError(trigger);
      updateFormProgress();
    });
  };

  const closeAllDropdowns = (exceptBox = null) => {
    document.querySelectorAll('.custom-select-options, .multiselect-dropdown').forEach(box => {
      if (box !== exceptBox) {
        box.classList.add('hidden');
        const trigger = box.previousElementSibling;
        if (trigger) trigger.classList.remove('active');
      }
    });
  };

  document.addEventListener('click', () => closeAllDropdowns());

  setupCustomSelect(countryCodeTrigger, countryCodeOptions);
  setupCustomSelect(specializationTrigger, specializationOptions);
  setupCustomSelect(categoryTrigger, categoryOptions);

  // Category changes updates Preview Badge
  if (categoryTrigger) {
    categoryTrigger.addEventListener('change', (e) => {
      setPreviewText(previewBadgeCategory, e.detail.text);
    });
  }


  /* ==========================================================================
     2. Country-State-City Chain Loader
     ========================================================================== */

  // Load countries dynamically
  const loadCountries = () => {
    countryOptions.innerHTML = '';
    Object.keys(state.countryData).forEach(country => {
      const opt = document.createElement('div');
      opt.className = 'select-option';
      opt.dataset.value = country;
      opt.textContent = country;
      countryOptions.appendChild(opt);
    });
  };
  loadCountries();
  setupCustomSelect(countryTrigger, countryOptions);

  // Country Selection Event
  countryTrigger.addEventListener('change', (e) => {
    const country = e.detail.value;
    
    // Enable state select
    stateSelectWrapper.classList.remove('disabled');
    selectedState.textContent = 'Select State...';
    selectedState.classList.add('placeholder-text');
    stateTrigger.dataset.value = '';
    stateOptions.innerHTML = '';

    // Disable city select
    citySelectWrapper.classList.add('disabled');
    selectedCity.textContent = 'Select City...';
    selectedCity.classList.add('placeholder-text');
    cityTrigger.dataset.value = '';
    cityOptions.innerHTML = '';

    // Load states
    const states = state.countryData[country].states;
    Object.keys(states).forEach(st => {
      const opt = document.createElement('div');
      opt.className = 'select-option';
      opt.dataset.value = st;
      opt.textContent = st;
      stateOptions.appendChild(opt);
    });
    
    syncLocationPreview();
  });

  setupCustomSelect(stateTrigger, stateOptions);

  // State Selection Event
  stateTrigger.addEventListener('change', (e) => {
    const country = countryTrigger.dataset.value;
    const stateVal = e.detail.value;

    // Enable city select
    citySelectWrapper.classList.remove('disabled');
    selectedCity.textContent = 'Select City...';
    selectedCity.classList.add('placeholder-text');
    cityTrigger.dataset.value = '';
    cityOptions.innerHTML = '';

    // Load cities
    const cities = state.countryData[country].states[stateVal];
    cities.forEach(ct => {
      const opt = document.createElement('div');
      opt.className = 'select-option';
      opt.dataset.value = ct;
      opt.textContent = ct;
      cityOptions.appendChild(opt);
    });

    syncLocationPreview();
  });

  setupCustomSelect(cityTrigger, cityOptions);

  cityTrigger.addEventListener('change', () => {
    syncLocationPreview();
  });

  // Sync Location Preview
  const syncLocationPreview = () => {
    const c = cityTrigger.dataset.value || '';
    const s = stateTrigger.dataset.value || '';
    const co = countryTrigger.dataset.value || '';

    let locText = 'Virtual Onboarding';
    if (co) {
      locText = co;
      if (s) locText = `${s}, ${co}`;
      if (c) locText = `${c}, ${s}`;
    }
    setPreviewText(previewLocationVal, locText);
    if (mockDashLocation) mockDashLocation.textContent = c && co ? `${c}, ${co}` : (co || 'Virtual');
  };


  /* ==========================================================================
     3. Searchable Multi-Select Dropdown (Industry)
     ========================================================================== */

  const industryTrigger = document.getElementById('industry-trigger');
  const industryDropdown = document.getElementById('industry-dropdown');
  const industrySearchInput = document.getElementById('industry-search-input');
  const industryList = document.getElementById('industry-list');

  industryTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllDropdowns(industryDropdown);
    industryTrigger.classList.toggle('active');
    industryDropdown.classList.toggle('hidden');
    if (!industryDropdown.classList.contains('hidden')) {
      industrySearchInput.focus();
    }
  });

  industrySearchInput.addEventListener('click', (e) => e.stopPropagation());

  // Render original industry options
  const renderIndustries = (filterText = '') => {
    industryList.innerHTML = '';
    const filtered = availableIndustries.filter(ind => 
      ind.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filtered.length === 0) {
      industryList.innerHTML = '<div class="select-option placeholder-text py-sm">No match found</div>';
      return;
    }

    filtered.forEach(ind => {
      const isSelected = state.industries.includes(ind);
      const opt = document.createElement('div');
      opt.className = `dropdown-option ${isSelected ? 'selected' : ''}`;
      opt.dataset.value = ind;
      opt.innerHTML = `
        <span>${ind}</span>
        <i data-lucide="check" class="check-icon"></i>
      `;
      industryList.appendChild(opt);
    });
    lucide.createIcons();
  };
  renderIndustries();

  industrySearchInput.addEventListener('input', (e) => {
    renderIndustries(e.target.value);
  });

  // Clicking an industry in dropdown toggles it
  industryList.addEventListener('click', (e) => {
    e.stopPropagation();
    const opt = e.target.closest('.dropdown-option');
    if (!opt) return;

    const val = opt.dataset.value;
    const index = state.industries.indexOf(val);

    if (index === -1) {
      state.industries.push(val);
    } else {
      state.industries.splice(index, 1);
    }

    renderIndustryChips();
    renderIndustries(industrySearchInput.value);
    clearFieldError(industryTrigger);
    updateFormProgress();
  });

  // Render Industry Chips inside Trigger box
  const renderIndustryChips = () => {
    const chipsHolder = document.getElementById('industry-selected-chips');
    chipsHolder.innerHTML = '';

    if (state.industries.length === 0) {
      chipsHolder.innerHTML = '<span class="placeholder-text">Search and select industries...</span>';
      return;
    }

    state.industries.forEach(ind => {
      const chip = document.createElement('span');
      chip.className = 'industry-chip';
      chip.innerHTML = `
        ${ind}
        <i data-lucide="x" class="btn-remove-ind" data-val="${ind}"></i>
      `;
      chipsHolder.appendChild(chip);
    });
    lucide.createIcons();
  };

  // Remove industry via chip 'x' button
  document.getElementById('industry-selected-chips').addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.btn-remove-ind');
    if (!closeBtn) return;
    
    e.stopPropagation();
    const val = closeBtn.dataset.val;
    const index = state.industries.indexOf(val);
    if (index !== -1) {
      state.industries.splice(index, 1);
      renderIndustryChips();
      renderIndustries(industrySearchInput.value);
      updateFormProgress();
    }
  });


  /* ==========================================================================
     4. Drag-and-Drop Image Logo Upload
     ========================================================================== */

  const triggerUpload = () => logoInput.click();

  logoDropzone.addEventListener('click', (e) => {
    if (e.target.closest('#btn-remove-logo') || e.target.closest('.upload-preview-container')) return;
    triggerUpload();
  });

  // Drag over effects
  ['dragenter', 'dragover'].forEach(eventName => {
    logoDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      logoDropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    logoDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      logoDropzone.classList.remove('dragover');
    }, false);
  });

  // Dropping files
  logoDropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleLogoFile(files[0]);
    }
  });

  logoInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleLogoFile(e.target.files[0]);
    }
  });

  // FileReader logo extractor
  const handleLogoFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size exceeds 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      state.logoDataUrl = e.target.result;
      
      // Update form preview
      logoImgPreview.src = state.logoDataUrl;
      uploadPlaceholderState.classList.add('hidden');
      uploadPreviewState.classList.remove('hidden');

      // Update right Live Preview (null-safe, panel may be removed)
      setPreviewSrc(previewLogoImg, state.logoDataUrl);
      togglePreviewClass(previewLogoImg, 'hidden', false);
      togglePreviewClass(previewLogoBox, 'hidden', true);

      // Update simulated dashboard logo
      if (mockDashLogo) {
        mockDashLogo.src = state.logoDataUrl;
        mockDashLogo.classList.remove('hidden');
      }
      if (mockDashLogoText) mockDashLogoText.classList.add('hidden');

      updateFormProgress();
    };
    reader.readAsDataURL(file);
  };

  // Remove Logo Handler
  btnRemoveLogo.addEventListener('click', (e) => {
    e.stopPropagation();
    state.logoDataUrl = null;
    logoInput.value = '';
    
    // Reset Form Box
    uploadPlaceholderState.classList.remove('hidden');
    uploadPreviewState.classList.add('hidden');
    logoImgPreview.src = '';

    // Reset Live Preview fallback (null-safe)
    togglePreviewClass(previewLogoImg, 'hidden', true);
    setPreviewSrc(previewLogoImg, '');
    togglePreviewClass(previewLogoBox, 'hidden', false);

    // Reset dashboard mockup logo
    if (mockDashLogo) { mockDashLogo.classList.add('hidden'); mockDashLogo.src = ''; }
    if (mockDashLogoText) mockDashLogoText.classList.remove('hidden');

    updateFormProgress();
  });


  /* ==========================================================================
     5. Tag Input Chips System
     ========================================================================== */

  tagInputBox.addEventListener('click', () => {
    inputTagText.focus();
  });

  inputTagText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = inputTagText.value.trim().replace(/,/g, '');
      if (val) {
        addTag(val);
      }
      inputTagText.value = '';
    }
  });

  const addTag = (text) => {
    // Check duplication
    if (state.tags.includes(text)) return;
    
    state.tags.push(text);
    renderTagChips();
    syncTagsToPreview();
  };

  const removeTag = (text) => {
    state.tags = state.tags.filter(t => t !== text);
    renderTagChips();
    syncTagsToPreview();
  };

  const renderTagChips = () => {
    // Clear old chips except input field
    const chips = tagsWrapper.querySelectorAll('.tag-chip');
    chips.forEach(c => c.remove());

    state.tags.forEach(t => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.innerHTML = `
        ${t}
        <i data-lucide="x" class="btn-remove-tag" data-val="${t}"></i>
      `;
      tagsWrapper.insertBefore(chip, inputTagText);
    });
    lucide.createIcons();
  };

  tagsWrapper.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.btn-remove-tag');
    if (!closeBtn) return;
    const val = closeBtn.dataset.val;
    removeTag(val);
  });

  const syncTagsToPreview = () => {
    if (previewTagsHolder) previewTagsHolder.innerHTML = '';
    if (mockDashTags) mockDashTags.innerHTML = '';

    if (state.tags.length === 0) {
      if (previewTagsHolder) previewTagsHolder.innerHTML = '<span class="preview-tag-chip empty">No tags added</span>';
      return;
    }

    state.tags.forEach(t => {
      // Live Preview panel chips (null-safe)
      if (previewTagsHolder) {
        const previewChip = document.createElement('span');
        previewChip.className = 'preview-tag-chip';
        previewChip.textContent = t;
        previewTagsHolder.appendChild(previewChip);
      }

      // Portal Preview modal chips
      if (mockDashTags) {
        const dashboardChip = document.createElement('span');
        dashboardChip.className = 'preview-tag-chip';
        dashboardChip.textContent = t;
        mockDashTags.appendChild(dashboardChip);
      }
    });
  };


  /* ==========================================================================
     6. Dynamic Live Preview Synchronization & Auto-slug
     ========================================================================== */

  // Slug generation syncing trigger is set up below

  // Sync basic texts
  inputCommunityName.addEventListener('input', () => {
    const val = inputCommunityName.value.trim();
    
    // Sync name texts (null-safe for removed preview panel)
    setPreviewText(previewTitleVal, val || 'Your Community Name');
    if (mockDashTitle) mockDashTitle.textContent = val || 'Association';
    if (mockDashWelcome) mockDashWelcome.textContent = val ? `Welcome to ${val}!` : 'Welcome to Your Community!';

    // Letter logo fallback update (null-safe)
    const firstLetter = val ? val.charAt(0).toUpperCase() : 'A';
    setPreviewText(previewLogoLetter, firstLetter);
    if (mockDashLogoText) mockDashLogoText.textContent = firstLetter;

    // Auto slug filling (if not customized manually yet)
    if (!inputCommunitySlug.dataset.customized) {
      inputCommunitySlug.value = slugify(val);
      setPreviewText(previewSlugVal, inputCommunitySlug.value ? `connect.com/${inputCommunitySlug.value}` : 'connect.com/slug-placeholder');
    }

    updateFormProgress();
  });

  // Slug modified directly
  inputCommunitySlug.addEventListener('input', () => {
    inputCommunitySlug.dataset.customized = true;
    const val = slugify(inputCommunitySlug.value);
    inputCommunitySlug.value = val;
    setPreviewText(previewSlugVal, val ? `connect.com/${val}` : 'connect.com/slug-placeholder');
    updateFormProgress();
  });

  // Description Synced
  inputCommunityDesc.addEventListener('input', () => {
    const val = inputCommunityDesc.value.trim();
    setPreviewText(previewDescVal, val || 'Provide a description in the form to see details updated here. Your members will read this statement on the portal landing directory.');
    
    // Auto-grow height handling
    inputCommunityDesc.style.height = 'auto';
    inputCommunityDesc.style.height = inputCommunityDesc.scrollHeight + 'px';

    updateFormProgress();
  });

  // Members Count
  inputMemberCount.addEventListener('input', () => {
    const val = parseInt(inputMemberCount.value) || 0;
    setPreviewText(previewMembersVal, val.toLocaleString() + (val === 1 ? ' member' : ' members'));
    if (mockDashMemberCount) mockDashMemberCount.textContent = val.toLocaleString();
    updateFormProgress();
  });

  // Visibility toggle sync
  const handleVisibilityChange = () => {
    const selectedVis = document.querySelector('input[name="visibility"]:checked').value;
    setPreviewText(previewBadgeVisibility, selectedVis);
    if (mockDashVisibility) mockDashVisibility.textContent = selectedVis;

    // Change badge styles (null-safe)
    if (previewBadgeVisibility) {
      previewBadgeVisibility.className = 'preview-badge';
      if (selectedVis === 'Private') {
        previewBadgeVisibility.classList.add('purple');
      } else if (selectedVis === 'Invite Only') {
        previewBadgeVisibility.classList.add('gray');
      }
    }
  };

  document.querySelectorAll('input[name="visibility"]').forEach(radio => {
    radio.addEventListener('change', handleVisibilityChange);
  });
  handleVisibilityChange(); // Initial run

  // Conditional elements visibility toggle (Website available)
  const hasWebsiteRadios = document.querySelectorAll('input[name="has-website"]');
  hasWebsiteRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'yes') {
        websiteUrlGroup.classList.add('open');
        inputWebsiteUrl.setAttribute('required', 'required');
      } else {
        websiteUrlGroup.classList.remove('open');
        inputWebsiteUrl.removeAttribute('required');
        clearFieldError(inputWebsiteUrl);
      }
      updateFormProgress();
    });
  });

  // Conditional elements visibility toggle (Location headquarters)
  const hasLocationRadios = document.querySelectorAll('input[name="has-location"]');
  const locationDetailsGroup = document.getElementById('location-details-group');
  hasLocationRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'yes') {
        locationDetailsGroup.classList.add('open');
        setAddressRequired(true);
      } else {
        locationDetailsGroup.classList.remove('open');
        setAddressRequired(false);
        // Reset location fields error indicators
        clearFieldError(countryTrigger);
        clearFieldError(stateTrigger);
        clearFieldError(cityTrigger);
        clearFieldError(inputAddress);
      }
      syncLocationPreview();
      updateFormProgress();
    });
  });

  const setAddressRequired = (required) => {
    if (required) {
      countryTrigger.setAttribute('required', 'required');
      stateTrigger.setAttribute('required', 'required');
      cityTrigger.setAttribute('required', 'required');
      inputAddress.setAttribute('required', 'required');
    } else {
      countryTrigger.removeAttribute('required');
      stateTrigger.removeAttribute('required');
      cityTrigger.removeAttribute('required');
      inputAddress.removeAttribute('required');
    }
  };


  /* ==========================================================================
     7. Profile Completion Percentage Bar
     ========================================================================== */

  const updateFormProgress = () => {
    let completedPoints = 0;
    let totalPoints = 9;

    if (state.logoDataUrl) completedPoints++;
    if (inputCommunityName.value.trim() !== '') completedPoints++;
    if (inputCommunitySlug.value.trim() !== '') completedPoints++;
    if (validateEmail(inputEmailId.value.trim())) completedPoints++;
    if (inputPhoneNumber.value.trim() !== '') completedPoints++;
    if (categoryTrigger.dataset.value) completedPoints++;
    if (specializationTrigger.dataset.value) completedPoints++;
    if (inputCommunityDesc.value.trim() !== '') completedPoints++;
    if (document.getElementById('rules-accepted').checked) completedPoints++;

    // Add conditional points
    const hasWebsite = document.querySelector('input[name="has-website"]:checked').value === 'yes';
    if (hasWebsite) {
      totalPoints++;
      if (validateUrl(inputWebsiteUrl.value.trim())) completedPoints++;
    }

    const hasLocation = document.querySelector('input[name="has-location"]:checked').value === 'yes';
    if (hasLocation) {
      totalPoints += 4;
      if (countryTrigger.dataset.value) completedPoints++;
      if (stateTrigger.dataset.value) completedPoints++;
      if (cityTrigger.dataset.value) completedPoints++;
      if (inputAddress.value.trim() !== '') completedPoints++;
    }

    // Multiply percentage (null-safe for removed preview elements)
    const percent = Math.min(Math.round((completedPoints / totalPoints) * 100), 100);
    setPreviewText(previewPercentText, `${percent}%`);
    setPreviewStyle(previewPercentBar, 'width', `${percent}%`);
  };

  // Add validation event listeners to trigger immediate updates
  inputEmailId.addEventListener('input', updateFormProgress);
  inputPhoneNumber.addEventListener('input', updateFormProgress);
  inputWebsiteUrl.addEventListener('input', updateFormProgress);
  inputAddress.addEventListener('input', updateFormProgress);
  document.getElementById('rules-accepted').addEventListener('change', updateFormProgress);

  updateFormProgress(); // Initial check


  /* ==========================================================================
     8. Step Navigation Router & Transition Handler
     ========================================================================== */

  const navigateToStep = (step) => {
    if (step < 1 || step > 3) return;

    // Transition animations - Slide out active
    const activePane = document.querySelector('.form-step-pane.active');
    activePane.style.opacity = 0;
    activePane.style.transform = 'translateY(-12px)';

    setTimeout(() => {
      formPanes.forEach(pane => pane.classList.remove('active'));
      
      // Update Stepper Line
      state.currentStep = step;
      updateStepperUI();

      // Slide in new active pane
      const newPane = document.getElementById(`pane-step-${step}`);
      newPane.classList.add('active');
      
      // Force repaint
      newPane.offsetHeight;
      
      newPane.style.opacity = 1;
      newPane.style.transform = 'translateY(0)';
      
      // Scroll to top of form area on step transition
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  };

  const updateStepperUI = () => {
    // Fill Stepper progress track
    const linePercent = (state.currentStep - 1) / 2 * 100;
    progressLine.style.width = `${linePercent}%`;

    stepIndicators.forEach(ind => {
      const stepNum = parseInt(ind.dataset.step);
      ind.classList.remove('active', 'completed');
      
      if (stepNum === state.currentStep) {
        ind.classList.add('active');
        // Restore step number from checkmark if jumping back
        ind.querySelector('.step-number').innerHTML = stepNum;
      } else if (stepNum < state.currentStep) {
        ind.classList.add('completed');
        // Replace number with Lucide check icon
        ind.querySelector('.step-number').innerHTML = '<i data-lucide="check" style="width:16px;height:16px;stroke-width:3"></i>';
      } else {
        ind.querySelector('.step-number').innerHTML = stepNum;
      }
    });

    lucide.createIcons();

    // Show/hide footer back button
    if (state.currentStep === 1) {
      footerBtnBack.classList.add('hidden');
    } else {
      footerBtnBack.classList.remove('hidden');
    }

    // Change Next button text on Step 3
    if (state.currentStep === 3) {
      footerBtnContinue.innerHTML = 'Publish Community <i data-lucide="rocket"></i>';
      footerBtnContinue.className = 'btn btn-primary';
    } else {
      footerBtnContinue.innerHTML = 'Next Step <i data-lucide="arrow-right"></i>';
      footerBtnContinue.className = 'btn btn-primary';
    }
  };

  // Back actions
  footerBtnBack.addEventListener('click', () => {
    navigateToStep(state.currentStep - 1);
  });

  // Stepper jumps (only allowed for completed steps or backward directions)
  stepIndicators.forEach(ind => {
    ind.addEventListener('click', () => {
      const targetStep = parseInt(ind.dataset.step);
      if (targetStep < state.currentStep) {
        navigateToStep(targetStep);
      } else if (targetStep > state.currentStep) {
        // Run validations before letting them jump forward
        if (validateStep(state.currentStep)) {
          navigateToStep(targetStep);
        }
      }
    });
  });


  /* ==========================================================================
     9. Step Validations
     ========================================================================== */

  const validateStep = (step) => {
    let isValid = true;

    if (step === 1) {
      // Community Name
      if (inputCommunityName.value.trim() === '') {
        setFieldError(inputCommunityName, 'Community name is required.');
        isValid = false;
      }

      // Community Slug
      if (inputCommunitySlug.value.trim() === '') {
        setFieldError(inputCommunitySlug, 'Unique community namespace slug is required.');
        isValid = false;
      }

      // Email
      const email = inputEmailId.value.trim();
      if (email === '') {
        setFieldError(inputEmailId, 'Contact email address is required.');
        isValid = false;
      } else if (!validateEmail(email)) {
        setFieldError(inputEmailId, 'Please specify a valid email address structure.');
        isValid = false;
      }

      // Phone
      if (inputPhoneNumber.value.trim() === '') {
        setFieldError(inputPhoneNumber, 'Contact phone number is required.');
        isValid = false;
      }

      // Conditional Website URL
      const hasWebsite = document.querySelector('input[name="has-website"]:checked').value === 'yes';
      if (hasWebsite && inputWebsiteUrl.value.trim() !== '') {
        if (!validateUrl(inputWebsiteUrl.value.trim())) {
          setFieldError(inputWebsiteUrl, 'Please enter a valid URL (include http/https).');
          isValid = false;
        }
      } else if (hasWebsite && inputWebsiteUrl.value.trim() === '') {
        setFieldError(inputWebsiteUrl, 'Website URL is required if custom site option is selected.');
        isValid = false;
      }

      // Description
      const descText = inputCommunityDesc.value.trim();
      if (descText === '') {
        setFieldError(inputCommunityDesc, 'Description statement is required.');
        isValid = false;
      } else if (descText.length < 15) {
        setFieldError(inputCommunityDesc, 'Description must be at least 15 characters to explain your community purpose.');
        isValid = false;
      }

      // Industry Select
      if (state.industries.length === 0) {
        setFieldError(industryTrigger, 'Select at least one industry filter.');
        isValid = false;
      }

      // Specialization
      if (!specializationTrigger.dataset.value) {
        setFieldError(specializationTrigger, 'Select an area of specialization.');
        isValid = false;
      }

      // Category
      if (!categoryTrigger.dataset.value) {
        setFieldError(categoryTrigger, 'Category is required.');
        isValid = false;
      }

      // Founded Date
      if (inputFoundedDate.value === '') {
        setFieldError(inputFoundedDate, 'Founded date is required.');
        isValid = false;
      }

      // Member Count
      if (inputMemberCount.value === '' || parseInt(inputMemberCount.value) < 1) {
        setFieldError(inputMemberCount, 'Please specify starting member count (minimum 1).');
        isValid = false;
      }

      // Conditional Physical Location Address
      const hasLocation = document.querySelector('input[name="has-location"]:checked').value === 'yes';
      if (hasLocation) {
        if (!countryTrigger.dataset.value) {
          setFieldError(countryTrigger, 'Country is required.');
          isValid = false;
        }
        if (!stateTrigger.dataset.value) {
          setFieldError(stateTrigger, 'State is required.');
          isValid = false;
        }
        if (!cityTrigger.dataset.value) {
          setFieldError(cityTrigger, 'City is required.');
          isValid = false;
        }
        if (inputAddress.value.trim() === '') {
          setFieldError(inputAddress, 'Street address details are required.');
          isValid = false;
        }
      }

      // Rules check
      const rulesAccepted = document.getElementById('rules-accepted');
      if (!rulesAccepted.checked) {
        setFieldError(rulesAccepted, 'You must accept the community code of conduct to proceed.');
        isValid = false;
      }
    }

    if (!isValid) {
      // Find first error and scroll to it
      const firstErr = document.querySelector('.form-group.has-error');
      if (firstErr) {
        firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return isValid;
  };


  /* ==========================================================================
     10. Continue button handlers
     ========================================================================== */

  footerBtnContinue.addEventListener('click', () => {
    if (state.currentStep < 3) {
      // Validate current step fields
      if (validateStep(state.currentStep)) {
        navigateToStep(state.currentStep + 1);
      }
    } else {
      // Publish button on Step 3
      if (validateStep(1)) {
        openSuccessPublishModal();
      } else {
        alert('Validation errors found in Step 1. Please return to details card and fix highlights.');
        navigateToStep(1);
      }
    }
  });


  /* ==========================================================================
     11. Master Selector Toggles for Step 3 Admin Permissions
     ========================================================================== */

  document.querySelectorAll('.group-select-all').forEach(masterBox => {
    masterBox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      const groupCard = e.target.closest('.permission-group-card');
      const bodyCheckboxes = groupCard.querySelectorAll('.group-body input[type="checkbox"]');
      
      bodyCheckboxes.forEach(box => {
        box.checked = isChecked;
      });
    });
  });

  // Individual checkbox toggled updates header master checkbox
  document.querySelectorAll('.group-body input[type="checkbox"]').forEach(box => {
    box.addEventListener('change', (e) => {
      const groupCard = e.target.closest('.permission-group-card');
      const masterBox = groupCard.querySelector('.group-select-all');
      const bodyBoxes = groupCard.querySelectorAll('.group-body input[type="checkbox"]');
      const checkedBoxes = groupCard.querySelectorAll('.group-body input[type="checkbox"]:checked');
      
      if (checkedBoxes.length === 0) {
        masterBox.checked = false;
        masterBox.indeterminate = false;
      } else if (checkedBoxes.length === bodyBoxes.length) {
        masterBox.checked = true;
        masterBox.indeterminate = false;
      } else {
        masterBox.checked = false;
        masterBox.indeterminate = true;
      }
    });
  });

  // Trigger initial checks for preselected values on load
  document.querySelectorAll('.permission-group-card').forEach(groupCard => {
    const masterBox = groupCard.querySelector('.group-select-all');
    const bodyBoxes = groupCard.querySelectorAll('.group-body input[type="checkbox"]');
    const checkedBoxes = groupCard.querySelectorAll('.group-body input[type="checkbox"]:checked');
    if (checkedBoxes.length > 0 && checkedBoxes.length < bodyBoxes.length) {
      masterBox.indeterminate = true;
    } else if (checkedBoxes.length === bodyBoxes.length) {
      masterBox.checked = true;
    }
  });


  /* ==========================================================================
     12. Modals Operations (Preview, Save Draft, Publish)
     ========================================================================== */

  const toggleModal = (modal, open) => {
    if (open) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  };

  // Preview Modal sync details
  const openPortalPreviewModal = () => {
    // Populate simulated items
    const name = inputCommunityName.value.trim() || 'Your Community Name';
    const mission = inputMission.value.trim() || 'Provide a mission statement to motivate members.';
    const visibility = document.querySelector('input[name="visibility"]:checked').value;
    const category = categoryTrigger.dataset.value || 'Professional';
    const loc = previewLocationVal.textContent;
    const members = inputMemberCount.value || 0;

    // Toggle menu items in dashboard view based on Step 2 checkboxes
    toggleMockMenu(mockMenuEvents, document.getElementById('feat-events').checked);
    toggleMockMenu(mockMenuForum, document.getElementById('feat-forum').checked);
    toggleMockMenu(mockMenuLibrary, document.getElementById('feat-library').checked);
    toggleMockMenu(mockMenuJobs, document.getElementById('feat-jobs').checked);

    mockDashMission.textContent = mission;

    toggleModal(modalDashboardPreview, true);
  };

  const toggleMockMenu = (element, show) => {
    if (show) element.classList.remove('hidden');
    else element.classList.add('hidden');
  };

  // Click Actions for draft
  const triggerSaveDraft = () => {
    toggleModal(modalDraftSaved, true);
  };

  // Confetti Successful Publish
  const openSuccessPublishModal = () => {
    const name = inputCommunityName.value.trim() || 'Your Community';
    const slug = inputCommunitySlug.value.trim() || 'slug-placeholder';
    const visibility = document.querySelector('input[name="visibility"]:checked').value;

    publishedCommunityTitle.textContent = `${name} is Live!`;
    publishedSlugLink.textContent = `connect.com/${slug}`;
    publishedVisibilityBadge.textContent = visibility;

    // Gather features list
    const features = [];
    if (document.getElementById('feat-events').checked) features.push('Events');
    if (document.getElementById('feat-forum').checked) features.push('Discussion Boards');
    if (document.getElementById('feat-library').checked) features.push('Resources Library');
    if (document.getElementById('feat-jobs').checked) features.push('Careers Board');
    if (document.getElementById('feat-ai').checked) features.push('AI Copilot');

    publishedFeaturesList.textContent = features.length > 0 ? features.join(', ') : 'None enabled';

    toggleModal(modalSuccessPublish, true);

    // Launch Confetti Shower
    triggerConfettiShower();
  };

  const triggerConfettiShower = () => {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#F97316', '#FB923C', '#10B981']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#F97316', '#FB923C', '#10B981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // Wire event handlers to modal buttons
  headerPreview.addEventListener('click', openPortalPreviewModal);
  footerBtnPreview.addEventListener('click', openPortalPreviewModal);
  btnClosePreviewModal.addEventListener('click', () => toggleModal(modalDashboardPreview, false));

  headerSaveDraft.addEventListener('click', triggerSaveDraft);
  footerBtnSave.addEventListener('click', triggerSaveDraft);
  btnCloseDraftModal.addEventListener('click', () => toggleModal(modalDraftSaved, false));

  headerPublish.addEventListener('click', () => {
    if (validateStep(1)) {
      openSuccessPublishModal();
    } else {
      alert('Validation errors found in Step 1. Please return to details card and fix highlights.');
      navigateToStep(1);
    }
  });

  btnSuccessViewDraft.addEventListener('click', () => {
    toggleModal(modalSuccessPublish, false);
    navigateToStep(2); // Go to Settings
  });

  btnSuccessGoDashboard.addEventListener('click', () => {
    toggleModal(modalSuccessPublish, false);
    openPortalPreviewModal();
  });
});
