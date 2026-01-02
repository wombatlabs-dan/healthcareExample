// Shared Persona Card JavaScript

// Persona card HTML template
const personaCardHTML = `
    <div class="persona-tiles-container" id="personaContainer">
        <div class="drag-handle"></div>
        <div class="persona-label">Persona:</div>
        <div class="persona-tiles">
            <div class="persona-tile" data-persona="emily" id="tile-emily">
                <img src="images/emily.png" alt="Emily Watson">
                <div class="placeholder">Emily<br>Watson</div>
                <div class="tile-label">Emily Watson</div>
            </div>
            <div class="persona-tile" data-persona="steve" id="tile-steve">
                <img src="images/steve.png" alt="Steve Lendal">
                <div class="placeholder">Steve<br>Lendal</div>
                <div class="tile-label">Steve Lendal</div>
            </div>
            <div class="persona-tile" data-persona="leo-maya" id="tile-leo-maya">
                <img src="images/leo-maya.png" alt="Leo and Maya Torres">
                <div class="placeholder">Leo & Maya<br>Torres</div>
                <div class="tile-label">Leo & Maya Torres</div>
            </div>
        </div>
        <div class="start-over-link">
            <a href="index.html">start over</a>
        </div>
    </div>
`;

// Initialize persona card
function initPersonaCard(activePersona = null, onTileClick = null) {
    // Check if card already exists
    if (document.getElementById('personaContainer')) {
        // Card already exists, just update active state
        if (activePersona) {
            document.querySelectorAll('.persona-tile').forEach(tile => {
                tile.classList.remove('active');
                if (tile.getAttribute('data-persona') === activePersona) {
                    tile.classList.add('active');
                }
            });
        }
        return;
    }
    
    // Insert card at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', personaCardHTML);
    
    const container = document.getElementById('personaContainer');
    if (!container) return;
    
    // Set active persona
    if (activePersona) {
        document.querySelectorAll('.persona-tile').forEach(tile => {
            tile.classList.remove('active');
            if (tile.getAttribute('data-persona') === activePersona) {
                tile.classList.add('active');
            }
        });
    }
    
    // Setup tile click handlers
    document.querySelectorAll('.persona-tile').forEach(tile => {
        tile.addEventListener('click', function() {
            const personaKey = this.getAttribute('data-persona');
            localStorage.setItem('selectedPersona', personaKey);
            
            if (onTileClick) {
                onTileClick(personaKey);
            }
        });
    });
    
    // Setup image handling
    setupImageHandling();
    
    // Setup drag functionality
    setupDragFunctionality();
}

// Update active persona (for pages that need to change it dynamically)
function updateActivePersona(personaKey) {
    document.querySelectorAll('.persona-tile').forEach(tile => {
        tile.classList.remove('active');
        if (tile.getAttribute('data-persona') === personaKey) {
            tile.classList.add('active');
        }
    });
}

// Handle image loading
function setupImageHandling() {
    document.querySelectorAll('.persona-tile img').forEach(img => {
        const placeholder = img.nextElementSibling;
        
        if (placeholder && placeholder.classList.contains('placeholder')) {
            placeholder.style.display = 'none';
        }
        img.style.display = 'block';
        
        img.addEventListener('error', function() {
            this.style.display = 'none';
            if (placeholder && placeholder.classList.contains('placeholder')) {
                placeholder.style.display = 'flex';
            }
        });
        
        img.addEventListener('load', function() {
            this.style.display = 'block';
            if (placeholder && placeholder.classList.contains('placeholder')) {
                placeholder.style.display = 'none';
            }
        });
        
        if (img.complete && img.naturalHeight !== 0) {
            img.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
        } else if (img.complete && img.naturalHeight === 0) {
            img.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';
        }
    });
}

// Draggable functionality for persona tiles container
function setupDragFunctionality() {
    const container = document.getElementById('personaContainer');
    if (!container) return;
    
    const dragHandle = container.querySelector('.drag-handle');
    if (!dragHandle) return;
    
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    dragHandle.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        isDragging = true;
        container.classList.add('dragging');
        e.preventDefault();
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, container);
        }
    }

    function dragEnd(e) {
        if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            container.classList.remove('dragging');
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
}

// Don't auto-initialize - let pages call it explicitly with their own handlers

