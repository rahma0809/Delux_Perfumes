document.addEventListener("DOMContentLoaded", function () {
  /* -------------------------
      HEADER SCROLL EFFECT
  -------------------------- */
  const header = document.querySelector(".header");

  function checkScroll() {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  checkScroll();
  window.addEventListener("scroll", checkScroll);

  /* -------------------------
      MOBILE MENU
  -------------------------- */
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      mobileToggle.classList.toggle("active");
    });
  }

  /* -------------------------
       MENU TABS
  -------------------------- */
  const menuTabs = document.querySelectorAll(".menu-tab");

  menuTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      menuTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  /* -------------------------
       SEARCH DROPDOWN
  -------------------------- */
  const searchBtn = document.getElementById("searchBtn");
  const searchDropdown = document.getElementById("searchDropdown");
  const closeSearch = document.getElementById("closeSearch");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      searchDropdown.style.display = "flex";
      document.getElementById("searchInput").focus();
    });
  }

  if (closeSearch) {
    closeSearch.addEventListener("click", () => {
      searchDropdown.style.display = "none";
    });
  }

  /* -------------------------
      SMOOTH SCROLL
  -------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      if (this.getAttribute("href") === "#") return;

      const targetElement = document.querySelector(this.getAttribute("href"));
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  /* -------------------------
      TOAST MESSAGE
  -------------------------- */
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  /* -------------------------
      SCROLL-TRIGGERED ANIMATIONS
  -------------------------- */
  const fadeElements = document.querySelectorAll(
    ".menu-item, .special-item, .bestsell-item, .about-feature"
  );

  const fadeInOnScroll = () => {
    fadeElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("visible");
      }
    });
  };

  // Set initial state for fade elements
  fadeElements.forEach((el) => el.classList.add("fade-in-scroll"));

  // Run on load and scroll
  fadeInOnScroll();
  window.addEventListener("scroll", fadeInOnScroll);

  /* -------------------------
      ADD TO CART
  -------------------------- */
  window.addToCart = function (name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name, price, image });

    localStorage.setItem("cart", JSON.stringify(cart));

    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) {
      // Add bounce animation
      cartCountEl.style.transform = "scale(1.5)";
      cartCountEl.textContent = cart.length;

      setTimeout(() => {
        cartCountEl.style.transform = "scale(1)";
      }, 300);
    }

    showToast(`${name} added to cart!`);

    // Create a floating effect from clicked item to cart
    const cartIcon = document.querySelector(".fa-shopping-cart");
    if (cartIcon) {
      cartIcon.style.transform = "scale(1.3)";
      setTimeout(() => {
        cartIcon.style.transform = "scale(1)";
      }, 300);
    }
  };

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) cartCountEl.textContent = cart.length;

  /* -------------------------
      ENHANCED SMOOTH SCROLL
  -------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      if (this.getAttribute("href") === "#") return;

      const targetElement = document.querySelector(this.getAttribute("href"));
      if (targetElement) {
        // Add fade-out effect to current section
        if (window.scrollY > 100) {
          document.documentElement.style.opacity = "0.95";
        }

        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });

        // Fade back in
        setTimeout(() => {
          document.documentElement.style.opacity = "1";
        }, 300);
      }
    });
  });

  /* -------------------------
      Main SCROLL BUTTON
  -------------------------- */
  const mainScroll = document.querySelector(".main-scroll");
  if (mainScroll) {
    heroScroll.addEventListener("click", () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    });
  }

  /* -------------------------
      WISHLIST FUNCTION
  -------------------------- */
  window.toggleWishlist = function (button, productName, price) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    // Check if product is already in wishlist
    const existingIndex = wishlist.findIndex(item => item.name === productName);
    
    if (existingIndex > -1) {
      // Remove from wishlist
      wishlist.splice(existingIndex, 1);
      button.classList.remove("active");
      button.innerHTML = '<i class="fas fa-heart"></i>';
      showToast(`${productName} removed from wishlist`);
    } else {
      // Add to wishlist
      wishlist.push({ name: productName, price: price });
      button.classList.add("active");
      button.innerHTML = '<i class="fas fa-heart" style="color: #ff4757;"></i>';
      showToast(`${productName} added to wishlist`);
    }
    
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  // Initialize wishlist buttons
  const wishlistButtons = document.querySelectorAll(".wishlist-btn");
  wishlistButtons.forEach(button => {
    const productName = button.getAttribute("data-product") || 
                       button.closest(".menu-item")?.querySelector(".menu-item-name")?.textContent ||
                       button.closest(".bestsell-item")?.querySelector(".bestsell-author-name")?.textContent;
    
    if (productName) {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const isInWishlist = wishlist.some(item => item.name === productName);
      
      if (isInWishlist) {
        button.classList.add("active");
        button.innerHTML = '<i class="fas fa-heart" style="color: #ff4757;"></i>';
      }
    }
  });

}); // END OF DOMContentLoaded

// ===== CHATBOT IMPLEMENTATION =====


const CHATBOT_API_KEY = "YOUR_API_KEY_HERE";
const CHATBOT_MODEL = "gpt-3.5-turbo";

class Chatbot {
  constructor() {
    this.icon = document.getElementById("chatbotIcon");
    this.box = document.getElementById("chatbotBox");
    this.messages = document.getElementById("chatMessages");
    this.input = document.getElementById("chatInput");
    this.sendBtn = document.getElementById("sendChat");
    this.closeBtn = document.querySelector(".close-chat");
    this.conversationHistory = [];

    // Check if elements exist before initializing
    if (this.icon && this.box && this.messages && this.input && this.sendBtn && this.closeBtn) {
      this.init();
    } else {
      console.warn("Chatbot elements not found. Skipping chatbot initialization.");
    }
  }

  init() {
    // Event listeners
    this.icon.addEventListener("click", () => this.toggleChat());
    this.closeBtn.addEventListener("click", () => this.closeChat());
    this.sendBtn.addEventListener("click", () => this.sendMessage());
    this.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendMessage();
    });

    // Clear old chat and show fresh welcome message
    this.clearOldChats();
    this.showWelcomeMessage();
  }

  clearOldChats() {
    // Clear localStorage chat history on every page load
    localStorage.removeItem('delux_chat_history');
    this.conversationHistory = [];
  }

  toggleChat() {
    this.box.classList.toggle("active");
    if (this.box.classList.contains("active")) {
      this.input.focus();
      this.scrollToBottom();
    }
  }

  closeChat() {
    this.box.classList.remove("active");
  }

  showWelcomeMessage() {
    // Clear any existing messages
    this.messages.innerHTML = '';
    
    const welcomeHTML = `
            <div class="chat-message bot-message intro">
                <strong>Hello! 👋 I'm your Delux Perfumes assistant.</strong><br><br>
                I can help you with:<br>
                • Perfume recommendations<br>
                • Order tracking<br>
                • Scent suggestions<br>
                • Gift ideas<br>
                • Store information<br><br>
                What can I help you with today?
            </div>
            <div class="chat-suggestions">
                <button class="suggestion-btn" data-question="What are your bestsellers?">Top perfumes</button>
                <button class="suggestion-btn" data-question="What's a good gift perfume?">Gift ideas</button>
                <button class="suggestion-btn" data-question="Do you have any discounts?">Current offers</button>
                <button class="suggestion-btn" data-question="What are your store hours?">Store hours</button>
            </div>
        `;

    this.messages.innerHTML = welcomeHTML;

    // Add event listeners to suggestion buttons
    setTimeout(() => {
      document.querySelectorAll(".suggestion-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const question = e.target.getAttribute("data-question");
          this.input.value = question;
          this.sendMessage();
        });
      });
    }, 100);

    // Reset conversation history
    this.conversationHistory = [{
      role: "assistant",
      content: "Hello! I'm your Delux Perfumes assistant. How can I help you today?",
    }];
  }

  async sendMessage() {
    const message = this.input.value.trim();
    if (!message) return;

    // Add user message to chat
    this.addMessage(message, "user");
    this.input.value = "";

    // Show loading indicator
    this.showLoading();

    try {
      // Send to AI API
      const response = await this.getAIResponse(message);

      // Remove loading indicator
      this.removeLoading();

      // Add bot response
      this.addMessage(response, "bot");

      // Add to conversation history
      this.conversationHistory.push(
        { role: "user", content: message },
        { role: "assistant", content: response }
      );

    } catch (error) {
      console.error("Chatbot error:", error);
      this.removeLoading();
      this.addMessage(
        "Sorry, I'm having trouble connecting right now. Please try again later or contact support at info@deluxperfumes.com",
        "bot"
      );
    }
  }

  async getAIResponse(userMessage) {
    // If using OpenAI API
    if (CHATBOT_API_KEY.startsWith("sk-")) {
      return await this.getOpenAIResponse(userMessage);
    }

    // If using Claude API
    if (CHATBOT_API_KEY.startsWith("sk-ant-")) {
      return await this.getClaudeResponse(userMessage);
    }

   
    try {
      return await this.getBackendResponse(userMessage);
    } catch (error) {
      console.log("Backend API failed, using mock responses");
    }

    // Fallback to mock responses if no API key
    return this.getMockResponse(userMessage);
  }

  async getBackendResponse(userMessage) {
    // Your backend API call
    const response = await fetch("http://localhost:3000/users/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error("Backend API request failed");
    }

    const data = await response.json();
    return data.reply || "I'm here to help with Delux Perfumes!";
  }

  async getOpenAIResponse(userMessage) {
    if (CHATBOT_API_KEY === "YOUR_API_KEY_HERE") {
      return this.getMockResponse(userMessage);
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CHATBOT_API_KEY}`,
      },
      body: JSON.stringify({
        model: CHATBOT_MODEL,
        messages: [
          {
            role: "system",
            content: `You are a helpful perfume shop assistant for Delux Perfumes. 
                        Provide helpful, friendly responses about perfumes, scents, recommendations, 
                        orders, and store information. Keep responses concise and professional.
                        
                        Store Info:
                        - Location: Delux Perfumes Boutique, Al Wasl Street, Dubai, UAE
                        - Hours: Mon-Fri 10AM-9PM, Sat 10AM-10PM, Sun 11AM-8PM
                        - Phone: +918 4 555 7890
                        - Email: info@deluxperfumes.com
                        - Website: deluxperfumes.com
                        
                        Products:
                        - Popular scents: Velvet Rose, Midnight Oud, Amber Horizon
                        - Price range: AED 79-250
                        - Best for gifts: Golden Essence Set
                        
                        Always be polite and helpful. If you don't know something, suggest 
                        contacting customer service.`,
          },
          ...this.conversationHistory,
          { role: "user", content: userMessage },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async getClaudeResponse(userMessage) {
   
    return this.getMockResponse(userMessage);
  }

  getMockResponse(userMessage) {
    // Mock responses for testing or when no API key
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("bestseller") ||
      lowerMessage.includes("top") ||
      lowerMessage.includes("popular")
    ) {
      return `Our bestsellers are:<br><br>• <strong>Velvet Rose</strong> (AED 199) - Romantic floral with amber<br>• <strong>Midnight Oud</strong> (AED 249) - Rich oud with leather notes<br>• <strong>Amber Horizon</strong> (AED 179) - Warm amber and citrus<br><br>These are customer favorites and make excellent gifts too!`;
    }

    if (lowerMessage.includes("gift") || lowerMessage.includes("present")) {
      return `Perfect gift suggestions:<br><br>• <strong>Golden Essence Set</strong> (AED 299) - Premium gift box with 3 mini fragrances<br>• <strong>Velvet Rose</strong> - Classic and elegant<br>• <strong>Noir Élixir Limited Edition</strong> (AED 150) - Exclusive scent<br><br>All gifts come with complimentary wrapping and a handwritten note!`;
    }

    if (
      lowerMessage.includes("discount") ||
      lowerMessage.includes("offer") ||
      lowerMessage.includes("sale")
    ) {
      return `Current offers:<br><br>🎁 <strong>Buy 1 Get 1 Free</strong> on selected perfumes (limited time)<br>🎁 <strong>Golden Gift Set</strong> - AED 299 with free delivery<br>🎁 <strong>20% OFF</strong> with coupon code: DELUX20<br><br>Check our "Offers" section for more details!`;
    }

    if (
      lowerMessage.includes("hour") ||
      lowerMessage.includes("open") ||
      lowerMessage.includes("close")
    ) {
      return `Our store hours:<br><br>🕙 <strong>Monday - Friday:</strong> 10:00 AM - 9:00 PM<br>🕙 <strong>Saturday:</strong> 10:00 AM - 10:00 PM<br>🕙 <strong>Sunday:</strong> 11:00 AM - 8:00 PM<br><br>We're also available online 24/7 at deluxperfumes.com`;
    }

    if (
      lowerMessage.includes("track") ||
      lowerMessage.includes("order") ||
      lowerMessage.includes("delivery")
    ) {
      return `For order tracking:<br><br>1. Check your email for tracking information<br>2. Visit "My Orders" in your account<br>3. Contact support at info@deluxperfumes.com<br><br>Delivery usually takes 2-3 business days in UAE.`;
    }

    if (
      lowerMessage.includes("recommend") ||
      lowerMessage.includes("suggest")
    ) {
      return `Based on popular choices, I'd recommend:<br><br>🌸 <strong>For Her:</strong> Velvet Rose or Bloom Éclat<br>🕶️ <strong>For Him:</strong> Midnight Oud or Noir Élixir<br>✨ <strong>Unisex:</strong> Amber Horizon<br><br>What type of scent are you looking for? Floral, woody, fresh, or oriental?`;
    }

    if (
      lowerMessage.includes("price") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("aed")
    ) {
      return `Our price range:<br><br>• Regular perfumes: AED 79 - 150<br>• Premium/Limited: AED 150 - 250<br>• Gift sets: AED 120 - 299<br><br>All prices include VAT. We offer free delivery on orders over AED 200!`;
    }

    return `I'm here to help with all things Delux Perfumes! You can ask me about:<br><br>• Perfume recommendations<br>• Current offers and discounts<br>• Store hours and location<br>• Order tracking<br>• Gift suggestions<br><br>What would you like to know?`;
  }

  addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${sender}-message`;
    messageDiv.innerHTML = text;
    this.messages.appendChild(messageDiv);
    this.scrollToBottom();
  }

  showLoading() {
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "chat-loading";
    loadingDiv.id = "loadingIndicator";
    loadingDiv.innerHTML = `
            <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            Thinking...
        `;
    this.messages.appendChild(loadingDiv);
    this.scrollToBottom();
  }

  removeLoading() {
    const loading = document.getElementById("loadingIndicator");
    if (loading) loading.remove();
  }

  scrollToBottom() {
    this.messages.scrollTop = this.messages.scrollHeight;
  }

}

// Initialize chatbot when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Give it a moment to ensure all elements are loaded
  setTimeout(() => {
    if (
      document.getElementById("chatbotIcon") &&
      document.getElementById("chatbotBox")
    ) {
      window.deluxChatbot = new Chatbot();
    }
  }, 1000);
});