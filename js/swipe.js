// ===== SWIPE MODULE =====

const Swipe = {
    // State
    activeCard: null,
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    
    // Config
    swipeThreshold: 90,
    rotationMultiplier: 0.055,
    indicatorThreshold: 45,
    
    // Callbacks
    onSwipeLeft: null,
    onSwipeRight: null,
    onSwipeComplete: null,
    
    // Initialize swipe on a card
    init(card, callbacks = {}) {
        this.activeCard = card;
        this.onSwipeLeft = callbacks.onSwipeLeft || null;
        this.onSwipeRight = callbacks.onSwipeRight || null;
        this.onSwipeComplete = callbacks.onSwipeComplete || null;
        
        this.bindEvents(card);
    },
    
    // Bind touch/mouse events
    bindEvents(card) {
        this._handleDragStart = this.handleDragStart.bind(this);
        this._handleDrag = this.handleDrag.bind(this);
        this._handleDragEnd = this.handleDragEnd.bind(this);
        
        card.addEventListener('touchstart', this._handleDragStart, { passive: true });
        card.addEventListener('mousedown', this._handleDragStart);
    },
    
    // Handle drag start
    handleDragStart(e) {
        if (!this.activeCard) return;
        
        this.isDragging = true;
        this.startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        this.startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        document.addEventListener('touchmove', this._handleDrag, { passive: true });
        document.addEventListener('mousemove', this._handleDrag);
        document.addEventListener('touchend', this._handleDragEnd);
        document.addEventListener('mouseup', this._handleDragEnd);
    },
    
    // Handle dragging
    handleDrag(e) {
        if (!this.isDragging || !this.activeCard) return;
        
        this.currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        this.currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        const diffX = this.currentX - this.startX;
        const diffY = this.currentY - this.startY;
        const rotation = diffX * this.rotationMultiplier;
        
        // Move active card
        this.activeCard.style.transform = `translate3d(${diffX}px, ${diffY * 0.2}px, 0) rotate(${rotation}deg)`;
        
        // Update indicators
        this.updateIndicators(diffX);
        
        // Animate behind cards
        this.animateBehindCards(Math.abs(diffX));
    },
    
    // Update swipe indicators (OUI/NON)
    updateIndicators(diffX) {
        const likeIndicator = this.activeCard.querySelector('.swipe-indicator.like');
        const nopeIndicator = this.activeCard.querySelector('.swipe-indicator.nope');
        
        if (!likeIndicator || !nopeIndicator) return;
        
        if (diffX > this.indicatorThreshold) {
            likeIndicator.classList.add('visible');
            likeIndicator.style.opacity = Math.min((diffX - this.indicatorThreshold) / 70, 1);
            nopeIndicator.classList.remove('visible');
        } else if (diffX < -this.indicatorThreshold) {
            nopeIndicator.classList.add('visible');
            nopeIndicator.style.opacity = Math.min((-diffX - this.indicatorThreshold) / 70, 1);
            likeIndicator.classList.remove('visible');
        } else {
            likeIndicator.classList.remove('visible');
            nopeIndicator.classList.remove('visible');
        }
    },
    
    // Animate cards behind active card
    animateBehindCards(absDiffX) {
        const progress = Math.min(absDiffX / 160, 1);
        const behind1 = document.querySelector('.swipe-card.behind-1');
        const behind2 = document.querySelector('.swipe-card.behind-2');
        
        if (behind1) {
            behind1.style.transition = 'none';
            behind1.style.transform = `scale(${0.94 + progress * 0.06}) translateY(${20 - progress * 20}px) translateZ(${-30 + progress * 30}px)`;
            behind1.style.opacity = 0.8 + progress * 0.2;
            behind1.style.filter = `brightness(${0.9 + progress * 0.1})`;
        }
        
        if (behind2) {
            behind2.style.transition = 'none';
            behind2.style.transform = `scale(${0.88 + progress * 0.06}) translateY(${40 - progress * 20}px) translateZ(${-60 + progress * 30}px)`;
            behind2.style.opacity = 0.5 + progress * 0.3;
            behind2.style.filter = `brightness(${0.8 + progress * 0.1})`;
        }
    },
    
    // Handle drag end
    handleDragEnd() {
        if (!this.isDragging || !this.activeCard) return;
        
        // Remove listeners
        document.removeEventListener('touchmove', this._handleDrag);
        document.removeEventListener('mousemove', this._handleDrag);
        document.removeEventListener('touchend', this._handleDragEnd);
        document.removeEventListener('mouseup', this._handleDragEnd);
        
        this.isDragging = false;
        const diffX = this.currentX - this.startX;
        
        if (diffX > this.swipeThreshold) {
            this.completeSwipe('right');
        } else if (diffX < -this.swipeThreshold) {
            this.completeSwipe('left');
        } else {
            this.resetCard();
        }
    },
    
    // Reset card to original position
    resetCard() {
        haptic('light');
        
        this.activeCard.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
        this.activeCard.style.transform = '';
        
        const likeIndicator = this.activeCard.querySelector('.swipe-indicator.like');
        const nopeIndicator = this.activeCard.querySelector('.swipe-indicator.nope');
        if (likeIndicator) likeIndicator.classList.remove('visible');
        if (nopeIndicator) nopeIndicator.classList.remove('visible');
        
        this.resetBehindCards();
    },
    
    // Reset behind cards
    resetBehindCards() {
        const behind1 = document.querySelector('.swipe-card.behind-1');
        const behind2 = document.querySelector('.swipe-card.behind-2');
        
        if (behind1) {
            behind1.style.transition = 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
            behind1.style.transform = '';
            behind1.style.opacity = '';
            behind1.style.filter = '';
        }
        
        if (behind2) {
            behind2.style.transition = 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
            behind2.style.transform = '';
            behind2.style.opacity = '';
            behind2.style.filter = '';
        }
    },
    
    // Complete swipe animation
    completeSwipe(direction) {
        if (!this.activeCard) return;
        
        haptic(direction === 'right' ? 'success' : 'light');
        
        const card = this.activeCard;
        const multiplier = direction === 'right' ? 1 : -1;
        
        // Trigger callback
        if (direction === 'right' && this.onSwipeRight) {
            this.onSwipeRight();
        } else if (direction === 'left' && this.onSwipeLeft) {
            this.onSwipeLeft();
        }
        
        // Animate card out
        card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease';
        card.style.transform = `translate3d(${multiplier * 130}%, -20px, 0) rotate(${multiplier * 22}deg)`;
        card.style.opacity = '0';
        
        // Promote behind cards
        this.promoteBehindCards();
        
        // Cleanup and callback
        setTimeout(() => {
            if (this.onSwipeComplete) {
                this.onSwipeComplete(direction);
            }
        }, 400);
    },
    
    // Promote behind cards to front
    promoteBehindCards() {
        const behind1 = document.querySelector('.swipe-card.behind-1');
        const behind2 = document.querySelector('.swipe-card.behind-2');
        
        if (behind1) {
            behind1.style.transition = 'all 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
            behind1.style.transform = 'scale(1) translateY(0) translateZ(0)';
            behind1.style.opacity = '1';
            behind1.style.filter = 'brightness(1)';
        }
        
        if (behind2) {
            behind2.style.transition = 'all 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
            behind2.style.transform = 'scale(0.94) translateY(20px) translateZ(-30px)';
            behind2.style.opacity = '0.8';
            behind2.style.filter = 'brightness(0.9)';
        }
    },
    
    // Programmatic swipe (from button)
    swipe(direction) {
        if (!this.activeCard) return;
        
        haptic('medium');
        
        const indicator = this.activeCard.querySelector(`.swipe-indicator.${direction === 'right' ? 'like' : 'nope'}`);
        if (indicator) {
            indicator.classList.add('visible');
            indicator.style.opacity = 1;
        }
        
        setTimeout(() => this.completeSwipe(direction), 100);
    },
    
    // Destroy/cleanup
    destroy() {
        this.activeCard = null;
        this.isDragging = false;
        this.onSwipeLeft = null;
        this.onSwipeRight = null;
        this.onSwipeComplete = null;
    }
};
